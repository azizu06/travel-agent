import { useState } from "react";
import TripForm from "@/components/tripFrom";
export default function Home() {
  const [formPage, setFormPage] = useState(false);
  return (
    <main>
      {!formPage ? (
        <button onClick={() => setFormPage(true)}>Let&apos;s begin</button>
      ) : (
        <TripForm />
      )}
    </main>
  );
}
