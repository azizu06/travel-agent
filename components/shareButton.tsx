"use client";
import { useState } from "react";

export default function ShareButton() {
  const [copied, setCopied] = useState(false);

  function copy() {
    const url = window.location.href;
    const done = () => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    };
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(url).then(done, done);
    } else {
      done();
    }
  }

  return (
    <button
      type="button"
      className={`share-btn${copied ? " copied" : ""}`}
      onClick={copy}
    >
      <svg className="i i-sm" viewBox="0 0 24 24">
        <path d="M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7" />
        <path d="M16 6l-4-4-4 4" />
        <path d="M12 2v13" />
      </svg>
      <span>{copied ? "Link copied" : "Copy share link"}</span>
    </button>
  );
}
