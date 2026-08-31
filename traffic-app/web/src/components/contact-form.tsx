"use client";

import { useState } from "react";

const fields = [
  { id: "name", label: "Name", type: "text", placeholder: "Ada Lovelace" },
  { id: "email", label: "Work email", type: "email", placeholder: "ada@city.gov" },
  { id: "org", label: "Organization", type: "text", placeholder: "Metropolitan Transport" },
];

export function ContactForm() {
  const [sent, setSent] = useState(false);

  return (
    <form
      className="rounded-[10px] bg-surface p-8"
      onSubmit={(e) => {
        e.preventDefault();
        setSent(true);
      }}
    >
      <p className="eyebrow">Request access</p>
      <h2 className="mt-3 text-[28px] font-light tracking-[-0.02em]">
        Talk to the lab.
      </h2>
      <div className="mt-8 grid gap-5">
        {fields.map((f) => (
          <label key={f.id} className="block">
            <span className="font-mono text-[11px] tracking-[0.12em] uppercase text-ash">
              {f.label}
            </span>
            <input
              required
              id={f.id}
              name={f.id}
              type={f.type}
              placeholder={f.placeholder}
              className="mt-2 w-full rounded-[5px] border border-khaki bg-bone px-3 py-2.5 text-[15px] outline-none placeholder:text-ash focus:border-ember"
            />
          </label>
        ))}
        <label className="block">
          <span className="font-mono text-[11px] tracking-[0.12em] uppercase text-ash">
            What are you building?
          </span>
          <textarea
            required
            name="intent"
            rows={6}
            placeholder="Corridor, fleet, signal timing, research collaboration…"
            className="mt-2 w-full rounded-[5px] border border-khaki bg-bone px-3 py-2.5 text-[15px] outline-none placeholder:text-ash focus:border-ember"
          />
        </label>
        <button
          type="submit"
          className="rounded-pill bg-ember px-5 py-2.5 text-[15px] text-white hover:bg-ember-hover"
        >
          {sent ? "Received — we will reply" : "Send brief"}
        </button>
      </div>
    </form>
  );
}
