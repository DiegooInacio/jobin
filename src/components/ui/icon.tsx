import type { SVGProps } from "react";

const paths = {
  close: "m6 6 12 12 M18 6 6 18",
  chevronDown: "m6 9 6 6 6-6",
  filter: "M4 7h16 M4 17h16 M9 4v6 M15 14v6",
  check: "M9 12l2 2 4-4 M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0Z",
  closed: "m8 8 8 8 M16 8l-8 8 M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0Z",
  board: "M3 3h18v18H3z M9 3v18 M15 3v18 M5.5 7h1 M11.5 7h1 M17.5 7h1",
  sparkles:
    "m12 3 2.4 6.6L21 12l-6.6 2.4L12 21l-2.4-6.6L3 12l6.6-2.4L12 3Z M20 2v4 M18 4h4",
  user: "M20 21v-2a7 7 0 0 0-14 0v2 M17 7a5 5 0 1 1-10 0 5 5 0 0 1 10 0Z",
  file: "M14 2H5v20h14V7l-5-5Z M14 2v6h5 M8 12h8 M8 16h5",
  search: "M21 21l-5-5 M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z",
  arrow: "M5 12h14 M13 6l6 6-6 6",
  location:
    "M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z M15 10a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z",
  briefcase: "M3 7h18v14H3z M8 7V3h8v4 M3 12c6 3 12 3 18 0 M12 11v5",
  chevron: "m9 5 7 7-7 7",
} satisfies Record<string, string>;

export type IconName = keyof typeof paths;

export function Icon({
  name,
  ...props
}: SVGProps<SVGSVGElement> & { name: IconName }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d={paths[name]} />
    </svg>
  );
}
