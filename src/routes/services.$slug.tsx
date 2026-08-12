import { createFileRoute, redirect } from "@tanstack/react-router";

/** Legacy URL. Specialty pages now live at /staffing/$slug. */
export const Route = createFileRoute("/services/$slug")({
  beforeLoad: ({ params }) => {
    throw redirect({ to: "/staffing/$slug", params: { slug: params.slug }, statusCode: 301 });
  },
});
