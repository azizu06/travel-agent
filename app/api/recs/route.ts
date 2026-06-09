import { headers } from "next/headers";
import { getMovies } from "@/lib/movieRecs";
import { RecBodySchema } from "@/lib/schemas";
import { ratelimit } from "@/lib/ratelimit";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const headersList = await headers();
    const forwarded = headersList.get("x-forwarded-for")?.split(",")[0].trim();
    const ip = forwarded || headersList.get("x-real-ip") || "anonymous";
    const { success } = await ratelimit.limit(ip);
    if (!success)
      return new Response(
        JSON.stringify({
          error: "Too many recommendation requests. Try again later.",
        }),
        { status: 429 },
      );
  } catch (err) {
    console.error("Rate limit check failed", err);
  }
  const body = await req.json();
  const parsed = RecBodySchema.safeParse(body);
  if (!parsed.success)
    return new Response(JSON.stringify({ error: "Invalid request" }), {
      status: 400,
    });
  const { session, prefs } = parsed.data;
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      for await (const movie of getMovies(session, prefs)) {
        controller.enqueue(encoder.encode(JSON.stringify(movie) + "\n"));
      }
      controller.close();
    },
  });
  return new Response(stream, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
