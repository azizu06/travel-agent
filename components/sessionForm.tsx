import Image from "next/image";
import Popcorn from "@/public/popcorn.png";
import { Session, SessionSchema } from "@/lib/schemas";

type SessionFormProps = {
  handleSubmit: (data: Session) => void;
};

export default function SessionForm({ handleSubmit }: SessionFormProps) {
  const onSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      peopleCount: formData.get("people"),
      time: formData.get("time"),
    };
    const result = SessionSchema.safeParse(data);
    if (!result.success) {
      console.error(result.error);
      return;
    }
    handleSubmit(result.data);
  };
  return (
    <div className="screen start-screen">
      <div className="brand brand-start">
        <Image src={Popcorn} alt="popcorn" className="popcorn-logo" priority />
        <h1 className="app-title">PopChoice</h1>
      </div>
      <form onSubmit={onSubmit} className="start-form">
        <label htmlFor="people" className="sr-only">
          How many people?
        </label>
          <input
            className="form-control setup-control"
            type="number"
            name="people"
            id="people"
            placeholder="How many people?"
            required
          />
        <label htmlFor="time" className="sr-only">
          How much time do you have?
        </label>
          <input
            className="form-control setup-control"
            type="text"
            name="time"
            id="time"
            placeholder="How much time do you have?"
            required
          />
        <button type="submit" className="primary-button">
          Start
        </button>
      </form>
    </div>
  );
}
