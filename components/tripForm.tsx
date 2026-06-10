"use client";
import { addTrip } from "@/lib/actions";
import { useState, useActionState } from "react";

export default function TripForm() {
  const [numPpl, setNumPpl] = useState(1);
  const [budget, setBudget] = useState(0);
  const [state, formAction, pending] = useActionState(addTrip, null);

  return (
    <form action={formAction} className="card form-card">
      {state?.error && (
        <p className="form-error" role="alert">
          <svg className="i i-sm" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="9" />
            <path d="M12 8v5M12 16.5v.5" />
          </svg>
          {state.error}
        </p>
      )}
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

      {/* Travellers / Budget */}
      <div className="field row2">
        <div>
          <span className="label" id="trav-label">
            Travellers
          </span>
          <div className="stepper" role="group" aria-labelledby="trav-label">
            <button
              type="button"
              className="step-btn"
              onClick={() => setNumPpl((p) => Math.max(1, p - 1))}
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
              onChange={(e) =>
                setNumPpl(Math.min(20, Math.max(1, Number(e.target.value) || 1)))
              }
              aria-labelledby="trav-label"
            />
            <button
              type="button"
              className="step-btn"
              onClick={() => setNumPpl((p) => Math.min(20, p + 1))}
              aria-label="Add one traveller"
            >
              <svg className="i i-md" viewBox="0 0 24 24">
                <path d="M12 5v14M5 12h14" />
              </svg>
            </button>
          </div>
        </div>
        <div>
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
              value={budget || ""}
              onChange={(e) =>
                setBudget(
                  Math.min(1_000_000, Math.max(0, Number(e.target.value)))
                )
              }
            />
          </div>
        </div>
      </div>

      <div className="form-actions">
        <button
          disabled={pending}
          type="submit"
          className="btn btn-primary btn-lg btn-block"
        >
          {pending ? (
            <>
              Planning
              <span className="dots" aria-hidden="true">
                <span />
                <span />
                <span />
              </span>
            </>
          ) : (
            <>
              Plan my Trip!
              <svg className="i arr" viewBox="0 0 24 24" width="20" height="20">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </>
          )}
        </button>
      </div>
      <p className="form-foot">
        You&apos;ll get a shareable page you can edit before you send it.
      </p>
    </form>
  );
}
