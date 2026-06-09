import { addTrip } from "@/lib/actions";
import { useState } from "react";
export default function FormPage() {
  const [numPpl, setNumPpl] = useState(0);
  return (
    <form
      action={addTrip}
      className="flex flex-col justify-center items-center gap-2 w-11/12"
    >
      <div className="flex flex-col justify-center">
        <label htmlFor="numPeople">Number of travellers</label>
        <div className="flex justify-around">
          <button onClick={() => setNumPpl((p) => p - 1)}>-</button>
          <input type="number" name="numPeople" id="numPeople" value={numPpl} />
          <button onClick={() => setNumPpl((p) => p + 1)}>-</button>
        </div>
      </div>
      <div className="flex flex-col justify-center gap-1">
        <div className="flex flex-col justify-center">
          <label htmlFor="origin">Flying from</label>
          <input type="text" name="origin" id="origin" />
        </div>
        <div className="flex flex-col justify-center">
          <label htmlFor="dest">Flying to</label>
          <input type="text" name="dest" id="dest" />
        </div>
      </div>
      <div className="flex flex-col justify-center gap-1">
        <div className="flex flex-col justify-center">
          <label htmlFor="depart">From date</label>
          <input type="date" name="depart" id="depart" />
        </div>
        <div className="flex flex-col justify-center">
          <label htmlFor="arrive">To date</label>
          <input type="date" name="arrive" id="arrive" />
        </div>
      </div>
      <div className="flex flex-col justify-center">
        <label htmlFor="budget">Budget</label>
        <span className="flex">
          $<input type="number" name="budget" id="budget" />
        </span>
      </div>
      <button type="submit">Plan my Trip!</button>
    </form>
  );
}
