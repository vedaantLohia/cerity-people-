"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export function TeamMember({
  name,
  title,
  bio,
  photo,
  photoClassName,
}: {
  name: string;
  title: string;
  bio: string;
  photo?: string;
  photoClassName?: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onDown = (e: PointerEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
    };
  }, [open]);

  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2);

  return (
    <div
      ref={ref}
      className="relative"
      onMouseEnter={(e) => {
        if (e.currentTarget.matches(":hover") && window.matchMedia("(hover: hover)").matches) {
          setOpen(true);
        }
      }}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-label={`View ${name}'s profile`}
        onClick={() => setOpen(true)}
        className="block w-full overflow-hidden rounded-xl border border-slate-200/80 bg-white text-left shadow-sm transition hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      >
        <div className="aspect-[4/3] overflow-hidden bg-gradient-to-br from-slate-200 to-slate-300">
          {photo ? (
            <img
              src={photo}
              alt={name}
              className={cn("h-full w-full object-cover", photoClassName)}
            />
          ) : null}
        </div>
        <div className="p-5">
          <h3 className="font-semibold text-navy">{name}</h3>
          <p className="text-sm font-medium text-accent">{title}</p>
          <p className="mt-2 text-xs font-medium text-slate-500">Hover or tap to read more</p>
        </div>
      </button>

      <div
        role="dialog"
        aria-label={`${name} profile`}
        onClick={() => setOpen(false)}
        className={cn(
          "absolute inset-x-0 top-0 z-20 origin-top rounded-xl border border-slate-200/80 bg-white p-5 shadow-2xl shadow-navy/20 transition duration-200",
          open ? "scale-100 opacity-100" : "pointer-events-none scale-95 opacity-0",
        )}
      >
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 shrink-0 overflow-hidden rounded-full bg-gradient-to-br from-primary to-accent">
            {photo ? (
              <img
                src={photo}
                alt={name}
                className={cn("h-full w-full object-cover", photoClassName)}
              />
            ) : (
              <span className="flex h-full w-full items-center justify-center text-lg font-semibold text-white">
                {initials}
              </span>
            )}
          </div>
          <div>
            <p className="font-semibold text-navy">{name}</p>
            <p className="text-sm font-medium text-accent">{title}</p>
          </div>
        </div>
        <p className="mt-4 text-sm leading-relaxed text-slate-600">{bio}</p>
      </div>
    </div>
  );
}
