"use server";
import { redirect } from "next/navigation";
import { redis } from "@/lib/redis";
import { TripFormSchema } from "@/lib/schemas";
export const addTrip = async (formData: FormData) => {
  const raw = Object.fromEntries(formData);
  const { error, data: trip, success } = TripFormSchema.safeParse(raw);
  if (!success) {
    console.error(error);
    return;
  }
  const id = crypto.randomUUID();
  await redis.set(`travel:${id}`, trip);
  redirect(`/trips/${id}`);
};
