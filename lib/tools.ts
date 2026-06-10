import { openai } from "./openai";
import type {
  FunctionTool,
  ResponseInputItem,
} from "openai/resources/responses/responses";

type Forecast = {
  list: {
    main: { temp: number };
    weather: { description: string }[];
  }[];
};

export const getWeather = async (city: string) => {
  const geo = await fetch(
    `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(city)}&limit=1&appid=${process.env.WEATHER_API_KEY}`,
  ).then((r) => r.json());
  if (!Array.isArray(geo) || geo.length === 0) return null;
  const { lat, lon } = geo[0];
  const forecast: Forecast = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${process.env.WEATHER_API_KEY}`,
  ).then((r) => r.json());
  if (!forecast?.list?.length) return null;
  const temps = forecast.list.map((f) => f.main.temp);
  const minTemp = Math.round(Math.min(...temps));
  const maxTemp = Math.round(Math.max(...temps));
  const conditions = [
    ...new Set(forecast.list.map((f) => f.weather[0].description)),
  ];
  return { conditions, minTemp, maxTemp };
};

export const generateImage = async (city: string) => {
  const prompt = `Generate me an artistic, beautiful view of my travel destination: ${city}`;
  const img = await openai.images.generate({
    model: "gpt-image-1",
    n: 1,
    size: "1024x1024",
    prompt,
  });
  const b64 = img.data?.[0].b64_json;
  if (!b64) throw new Error("Image generation returned no data");
  return Buffer.from(b64, "base64");
};

export const tools: FunctionTool[] = [
  {
    type: "function",
    name: "getWeather",
    description: "Given a city, find the weather data.",
    strict: null,
    parameters: {
      type: "object",
      properties: { city: { type: "string" } },
      required: ["city"],
    },
  },
];

export const toolFns = {
  getWeather: (args: { city: string }) => getWeather(args.city),
};
