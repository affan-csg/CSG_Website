import { createFileRoute, redirect } from "@tanstack/react-router";

/** Legacy URL. The page now lives at /insights. */
export const Route = createFileRoute("/blog/")({
  beforeLoad: () => {
    throw redirect({ to: "/insights", statusCode: 301 });
  },
});
