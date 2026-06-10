"use client";
import { addTrip } from "@/lib/actions";
import { useState } from "react";

export default function FormPage() {
  const [numPpl, setNumPpl] = useState(0);

  return (
    <form action={addTrip} className="card form-card">
      {/* Number of travellers — stepper */}
      <div className="field">
        <span className="label" id="trav-label">
          Number of travellers
        </span>
        <div className="stepper-wrap">
          <div className="stepper" role="group" aria-labelledby="trav-label">
            <button
              type="button"
              className="step-btn"
              onClick={() => setNumPpl((p) => p - 1)}
              aria-label="Remove one traveller"
            >
              <svg className="i i-md" viewBox="0 0 24 24">
                <path d="M5 12h14" />
              </svg>
            </button>
            <input
              type="number"
              name="numPeople"
              id="numPeople"
              className="step-val"
              value={numPpl}
              onChange={(e) => setNumPpl(Number(e.target.value))}
              aria-labelledby="trav-label"
            />
            <button
              type="button"
              className="step-btn"
              onClick={() => setNumPpl((p) => p + 1)}
              aria-label="Add one traveller"
            >
              <svg className="i i-md" viewBox="0 0 24 24">
                <path d="M12 5v14M5 12h14" />
              </svg>
            </button>
          </div>
          <span className="step-meta">
            <span className="u">travellers</span>
          </span>
        </div>
      </div>

      {/* Flying from / to */}
      <div className="field row2">
        <div>
          <label className="label" htmlFor="origin">
            Flying from
          </label>
          <input
            type="text"
            name="origin"
            id="origin"
            className="control"
            placeholder="New York (JFK)"
            autoComplete="off"
          />
        </div>
        <div>
          <label className="label" htmlFor="dest">
            Flying to
          </label>
          <input
            type="text"
            name="dest"
            id="dest"
            className="control"
            placeholder="Where to?"
            autoComplete="off"
          />
        </div>
      </div>

      {/* Dates */}
      <div className="field row2">
        <div>
          <label className="label" htmlFor="depart">
            From date
          </label>
          <input type="date" name="depart" id="depart" className="control" />
        </div>
        <div>
          <label className="label" htmlFor="arrive">
            To date
          </label>
          <input type="date" name="arrive" id="arrive" className="control" />
        </div>
      </div>

      {/* Budget */}
      <div className="field">
        <label className="label" htmlFor="budget">
          Budget
        </label>
        <div className="affix">
          <span className="sym" aria-hidden="true">
            $
          </span>
          <input
            type="number"
            name="budget"
            id="budget"
            className="control"
            inputMode="numeric"
            min="0"
            step="50"
            placeholder="2,800"
            aria-describedby="budget-hint"
          />
        </div>
        <p className="field-hint" id="budget-hint">
          Total, for the whole party — we&apos;ll plan to fit inside it.
        </p>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary btn-lg btn-block">
          Plan my Trip!
          <svg className="i arr" viewBox="0 0 24 24" width="20" height="20">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </button>
      </div>
      <p className="form-foot">
        You&apos;ll get a shareable page you can edit before you send it.
      </p>
    </form>
  );
}
