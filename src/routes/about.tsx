import { createFileRoute, redirect } from "@tanstack/react-router";

/** Legacy URL. The page now lives at /our-story. */
export const Route = createFileRoute("/about")({
  beforeLoad: () => {
    throw redirect({ to: "/our-story", statusCode: 301 });
  },
});
