"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

export type TeamPerson = {
  name: string;
  title: string;
  bio: string;
  photo?: string;
  photoClassName?: string;
};

function Portrait({
  person,
  className,
}: {
  person: TeamPerson;
  className?: string;
}) {
  const initials = person.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2);

  return (
    <div
      className={cn(
        "shrink-0 overflow-hidden rounded-full bg-gradient-to-br from-primary to-accent",
        className,
      )}
    >
      {person.photo ? (
        <img
          src={person.photo}
          alt={person.name}
          className={cn("h-full w-full object-cover", person.photoClassName)}
        />
      ) : (
        <span className="flex h-full w-full items-center justify-center text-2xl font-semibold text-white">
          {initials}
        </span>
      )}
    </div>
  );
}

export function TeamPanel({ people }: { people: TeamPerson[] }) {
  const [active, setActive] = useState<number | null>(null);
  const [shown, setShown] = useState(0);
  const person = people[shown];

  const toggle = (i: number) => {
    if (active === i) {
      setActive(null);
      return;
    }
    setShown(i);
    setActive(i);
  };

  return (
    <div className="mt-12">
      <div className="flex justify-center gap-6 sm:gap-12">
        {people.map((p, i) => {
          const selected = i === active;
          return (
            <button
              key={p.name}
              type="button"
              aria-expanded={selected}
              aria-controls="team-panel"
              onClick={() => toggle(i)}
              className="group flex w-28 flex-col items-center text-center focus-visible:outline-none sm:w-40"
            >
              <span
                className={cn(
                  "rounded-full p-1 transition",
                  selected
                    ? "bg-gradient-to-br from-primary to-accent shadow-lg"
                    : "bg-slate-200 group-hover:bg-slate-300 group-focus-visible:ring-2 group-focus-visible:ring-accent",
                )}
              >
                <Portrait
                  person={p}
                  className="h-24 w-24 border-2 border-white sm:h-32 sm:w-32"
                />
              </span>
              <span className="mt-3 text-sm font-semibold text-navy sm:text-base">{p.name}</span>
              <span className="text-xs font-medium text-accent sm:text-sm">{p.title}</span>
            </button>
          );
        })}
      </div>

      <div
        id="team-panel"
        role="region"
        aria-label={`${person.name} profile`}
        aria-hidden={active === null}
        className={cn(
          "grid transition-all duration-300 ease-out",
          active === null ? "grid-rows-[0fr] opacity-0" : "grid-rows-[1fr] opacity-100",
        )}
      >
        <div className="overflow-hidden">
          <div className="mx-auto mt-8 max-w-3xl rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex items-center gap-4">
          <Portrait person={person} className="h-14 w-14" />
          <div>
            <p className="font-semibold text-navy">{person.name}</p>
            <p className="text-sm font-medium text-accent">{person.title}</p>
          </div>
        </div>
        <div className="mt-5 space-y-3 text-sm leading-relaxed text-slate-600 sm:text-base">
          {person.bio.split("\n\n").map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
          </div>
        </div>
      </div>
    </div>
  );
}
