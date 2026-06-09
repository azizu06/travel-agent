import Image from "next/image";
import Popcorn from "@/public/popcorn.png";
import { Preferences, PreferencesSchema } from "@/lib/schemas";

export type PrefFormProps = {
  handleSubmit: (data: Preferences) => void;
  isLast: boolean;
  isPending: boolean;
  prefIdx: number;
  totalCount: number;
};

export default function PrefForm({
  handleSubmit,
  isLast,
  isPending,
  prefIdx,
  totalCount,
}: PrefFormProps) {
  const types = ["new", "classic"];
  const moods = ["fun", "serious", "inspiring", "scary"];

  const onSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      favMovie: formData.get("favMovie"),
      era: formData.get("era"),
      mood: formData.get("mood"),
      favPerson: formData.get("favPerson"),
    };
    const result = PreferencesSchema.safeParse(data);
    if (!result.success) {
      console.error(result.error);
      return;
    }
    handleSubmit(result.data);
  };

  return (
    <div className="screen prefs-screen">
      <div className="brand brand-compact">
        <Image src={Popcorn} alt="popcorn" className="popcorn-logo" priority />
        <h1 className="person-count">{prefIdx}</h1>
        {totalCount > 1 && (
          <div className="progress-dots">
            {Array.from({ length: totalCount }, (_, i) => (
              <div
                key={i}
                className={`progress-dot ${
                  i + 1 < prefIdx
                    ? "progress-dot--filled"
                    : i + 1 === prefIdx
                      ? "progress-dot--active"
                      : ""
                }`}
              />
            ))}
          </div>
        )}
      </div>
      <form onSubmit={onSubmit} className="prefs-form">
        <div className="question-block question-favorite">
          <label htmlFor="favMovie">What is your favorite movie and why?</label>
          <textarea
            className="form-control text-area text-area-tall"
            name="favMovie"
            id="favMovie"
            required
          />
        </div>
        <fieldset className="question-block">
          <p>Are you in the mood for something new or a classic?</p>
          <div className="pill-row">
            {types.map((t) => (
              <div className="choice-pill" key={t}>
                <input type="radio" name="era" id={t} required value={t} />
                <label htmlFor={t}>
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </label>
              </div>
            ))}
          </div>
        </fieldset>
        <fieldset className="question-block">
          <p>What are you in the mood for?</p>
          <div className="pill-row mood-row">
            {moods.map((m) => (
              <div className="choice-pill" key={m}>
                <input type="radio" name="mood" id={m} required value={m} />
                <label htmlFor={m}>
                  {m.charAt(0).toUpperCase() + m.slice(1)}
                </label>
              </div>
            ))}
          </div>
        </fieldset>
        <div className="question-block">
          <label htmlFor="favPerson">
            Which famous film person would you love to be stranded on an island
            with and why?
          </label>
          <textarea
            className="form-control text-area"
            name="favPerson"
            id="favPerson"
            required
          />
        </div>
        <button
          type="submit"
          className="primary-button prefs-button"
          disabled={isPending}
        >
          {isPending ? "Generating…" : isLast ? "Get Movie" : "Next Person"}
        </button>
      </form>
    </div>
  );
}
