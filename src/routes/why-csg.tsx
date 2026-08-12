import { createFileRoute, redirect } from "@tanstack/react-router";

/** Legacy URL. Why CSG is now a section on /our-story. */
export const Route = createFileRoute("/why-csg")({
  beforeLoad: () => {
    throw redirect({ to: "/our-story", hash: "why-csg", statusCode: 301 });
  },
});
