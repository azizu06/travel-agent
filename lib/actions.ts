"use server";
import { redirect } from "next/navigation";
import { redis } from "@/lib/redis";
import { TripFormSchema, FinalPlanSchema } from "@/lib/schemas";
import { makePlanV2 } from "./agent-aisdk";
import { put } from "@vercel/blob";
import { ratelimit } from "./ratelimit";
import { generateImage } from "./tools";
import { headers } from "next/headers";
export const addTrip = async (formData: FormData) => {
  const ip = (await headers()).get("x-forwarded-for") ?? "anonymous";
  const { success } = await ratelimit.limit(ip);
  if (!success) return;
  const raw = Object.fromEntries(formData);
  const res = TripFormSchema.safeParse(raw);
  if (!res.success) {
    console.error(res.error);
    return;
  }
  const id = crypto.randomUUID();
  const plan = await makePlanV2(res.data);
  if (!plan) {
    console.error("Plan generation failed");
    return;
  }
  const bytes = await generateImage(res.data.dest);
  const blob = await put(`travel/${id}.png`, bytes, { access: "public" });
  const trip = {
    ...res.data,
    ...plan,
    destUrl: blob.url,
  };
  const parsed = FinalPlanSchema.safeParse(trip);
  if (!parsed.success) {
    console.error(parsed.error);
    return;
  }
  await redis.set(`travel:${id}`, parsed.data);
  redirect(`/trips/${id}`);
};
