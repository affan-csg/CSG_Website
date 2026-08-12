import { createFileRoute, redirect } from "@tanstack/react-router";

/** Legacy URL. The page now lives at /staffing. */
export const Route = createFileRoute("/services/")({
  beforeLoad: () => {
    throw redirect({ to: "/staffing", statusCode: 301 });
  },
});
