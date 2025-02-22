import { Form, useFetcher } from "react-router";

import type { CityRecord } from "../data";

import { getCity, updateCity } from "../data";
import type { Route } from "./+types/city";

export async function loader({ params }: Route.LoaderArgs) {
  const city = await getCity(params.cityId);
  if (!city) {
    throw new Response("Not Found", { status: 404 });
  }
  return { city };
}

export async function action({
  params,
  request,
}: Route.ActionArgs) {
  const formData = await request.formData();
  return updateCity(params.cityId, {
    favorite: formData.get("favorite") === "true",
  });
}


export default function Contact({
  loaderData,
}: Route.ComponentProps) {
  const { city } = loaderData;
  return (
    <div id="contact">
      <div>
        <img
          alt={`${city.name} avatar`}
          key={city.avatar}
          src={city.avatar}
        />
      </div>

      <div>
        <h1>
        {city.name ? (
            <>
              {city.name} {city.population}
            </>
          ) : (
            <i>No Name</i>
          )}
          <Favorite city={city} />
        </h1>
        <h2> {city.country} </h2>

        {city.notes ? <p>{city.notes}</p> : null}

        <div>
          <Form action="edit">
            <button type="submit">Edit</button>
          </Form>

          <Form
            action="destroy"
            method="post"
            onSubmit={(event) => {
              const response = confirm(
                "Please confirm you want to delete this record."
              );
              if (!response) {
                event.preventDefault();
              }
            }}
          >
            <button type="submit">Delete</button>
          </Form>
        </div>
      </div>
    </div>
  );
}

function Favorite({
  city,
}: {
  city: Pick<CityRecord, "favorite">;
}) {
  const fetcher = useFetcher();
  const favorite = fetcher.formData
  ? fetcher.formData.get("favorite") === "true"
  : city.favorite;

  return (
    <fetcher.Form method="post">
      <button
        aria-label={
          favorite
            ? "Remove from favorites"
            : "Add to favorites"
        }
        name="favorite"
        value={favorite ? "false" : "true"}
      >
        {favorite ? "★" : "☆"}
      </button>
      </fetcher.Form>
  );
}
