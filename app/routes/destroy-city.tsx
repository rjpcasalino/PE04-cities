import { redirect } from "react-router";
import type { Route } from "./+types/destroy-city";

import { deleteCity } from "../data";

export async function action({ params }: Route.ActionArgs) {
  await deleteCity(params.cityId);
  return redirect("/");
}
