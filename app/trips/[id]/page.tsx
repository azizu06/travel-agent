import { redis } from "@/lib/redis";
import { TripPlanSchema } from "@/lib/schemas";
export default async function TripPlan({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const raw = await redis.get(`travel:${id}`);
  const { error, data: trip, success } = TripPlanSchema.safeParse(raw);
  if (!success) {
    console.error(error);
    return;
  }
  return (
    <main className="flex flex-col justify-center gap-2">
      <h1>Your Trip</h1>
      <div className="flex flex-col gap-1 justify-center">
        <div className="flex gap-1">
          <p>{trip.depart}</p>
          <p>{trip.arrive}</p>
        </div>
        <p>
          {trip.origin} - {trip.dest}
        </p>
      </div>
      <div className="flex flex-col gap-1">
        <h2>Weather</h2>
        <p>{trip.weather}</p>
      </div>
      <div className="flex flex-col gap-1">
        <h2>Flights</h2>
        <p>{trip.flights}</p>
        <button className="border rounded-lg p-2 justify-center flex">
          Book
        </button>
      </div>
      <div className="flex flex-col gap-1">
        <h2>Hotel</h2>
        <p>{trip.hotel}</p>
        <button className="border rounded-lg p-2 justify-center flex">
          Book
        </button>
      </div>
      <div className="flex flex-col gap-1">
        <h2>Hotel</h2>
        <ul>
          {trip.activities.map((activity: string, i: number) => (
            <li key={i}>{activity}</li>
          ))}
        </ul>
      </div>
      <img src="#" alt="trip destination" />
    </main>
  );
}
