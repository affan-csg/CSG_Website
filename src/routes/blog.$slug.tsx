import { createFileRoute, redirect } from "@tanstack/react-router";

/** Legacy URL. Posts now live at /insights/$slug. */
export const Route = createFileRoute("/blog/$slug")({
  beforeLoad: ({ params }) => {
    throw redirect({ to: "/insights/$slug", params: { slug: params.slug }, statusCode: 301 });
  },
});
