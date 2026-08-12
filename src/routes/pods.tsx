import { createFileRoute, redirect } from "@tanstack/react-router";

/** Legacy URL. The page now lives at /staffing/pods. */
export const Route = createFileRoute("/pods")({
  beforeLoad: () => {
    throw redirect({ to: "/staffing/pods", statusCode: 301 });
  },
});
