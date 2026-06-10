"use server";
import { redirect } from "next/navigation";
import { redis } from "@/lib/redis";
import { TripFormSchema, FinalPlanSchema } from "@/lib/schemas";
import { makePlanV2 } from "./agent-aisdk";
import { put } from "@vercel/blob";
import { ratelimit } from "./ratelimit";
import { generateImage } from "./tools";
import { headers } from "next/headers";
export const addTrip = async (prevState: unknown, formData: FormData) => {
  const ip = (await headers()).get("x-forwarded-for") ?? "anonymous";
  const { success } = await ratelimit.limit(ip);
  if (!success) return { error: "Too many requests. Try again later." };
  const raw = Object.fromEntries(formData);
  const res = TripFormSchema.safeParse(raw);
  if (!res.success) return { error: "Please check your trip details." };
  if (res.data.arrive < res.data.depart)
    return { error: "Return date must be on or after the departure date." };
  const id = crypto.randomUUID();
  try {
    const [plan, bytes] = await Promise.all([
      makePlanV2(res.data),
      generateImage(res.data.dest),
    ]);
    if (!plan) return { error: "Couldn't plan the trip. Try again." };
    const blob = await put(`travel/${id}.png`, bytes, { access: "public" });
    const trip = {
      ...res.data,
      ...plan,
      destUrl: blob.url,
    };
    const parsed = FinalPlanSchema.safeParse(trip);
    if (!parsed.success) return { error: "Something went wrong. Try again." };
    await redis.set(`travel:${id}`, parsed.data, { ex: 60 * 60 * 24 * 30 });
  } catch (err) {
    console.error(err);
    return { error: "Something went wrong. Try again." };
  }
  redirect(`/trips/${id}`);
};
