import type { RouteConfig } from "@react-router/dev/routes";
import {
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  layout("layouts/sidebar.tsx", [
    index("routes/home.tsx"),
    route("cities/:cityId", "routes/city.tsx"),
    route(
      "city/:cityId/edit",
      "routes/edit-city.tsx"
    ),
    route(
      "cities/:cityId/destroy",
      "routes/destroy-city.tsx"
    ),
  ]),
  route("about", "routes/about.tsx"),
] satisfies RouteConfig;