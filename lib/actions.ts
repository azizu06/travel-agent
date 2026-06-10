"use server";
import { redirect } from "next/navigation";
import { redis } from "@/lib/redis";
import { TripFormSchema } from "@/lib/schemas";
import { makePlan } from "./agent";
import { put } from "@vercel/blob";
import { generateImage } from "./tools";
export const addTrip = async (formData: FormData) => {
  const raw = Object.fromEntries(formData);
  const { error, data, success } = TripFormSchema.safeParse(raw);
  if (!success) {
    console.error(error);
    return;
  }
  const id = crypto.randomUUID();
  const plan = await makePlan(data);
  if (!plan) {
    console.error("Plan generation failed");
    return;
  }
  const bytes = await generateImage(data.dest);
  const blob = await put(`travel/${id}.png`, bytes, { access: "public" });
  const trip = {
    ...data,

    ...plan,
    destUrl: blob.url,
  };
  await redis.set(`travel:${id}`, trip);
  redirect(`/trips/${id}`);
};
