import { Form, redirect, useNavigate } from "react-router";
import type { Route } from "./+types/edit-city";


import { getCity, updateCity } from "../data";

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
    const updates = Object.fromEntries(formData);
    await updateCity(params.cityId, updates);
    return redirect(`/cities/${params.cityId}`);
  }

export default function EditCity({
  loaderData,
}: Route.ComponentProps) {
  const { city } = loaderData;
  const navigate = useNavigate();

  return (
    <Form key={city.id} id="contact-form" method="post">                        
      <p>
        <span>Name:</span> 
        <input
          aria-label="Name"
          defaultValue={city.name}
          name="name"
          placeholder={city.name}
          type="text"
        />
      </p>
      <p>
        <span>Population:</span> 
        <input
          aria-label="Population"
          defaultValue={city.population?.toLocaleString()}
          name="population"
          placeholder={city.population?.toLocaleString()}
          type="number"
        />
      </p>
      <p>
        <span>Country:</span> 
        <input
          aria-label="Country"
          defaultValue={city.country}
          name="country"
          placeholder={city.country}
          type="text"
        />
      </p>      <p>
        <span>Thumb:</span> 
        <input
          aria-label="Country"
          defaultValue={city.avatar}
          name="avatar"
          type="text"
        />
      </p>
      <label>
        <span>Notes:</span>
        <textarea
          defaultValue={city.notes}
          name="notes"
          rows={6}
        />
      </label>
      
      <p>
        <button type="submit">Save</button>
        <button onClick={() => navigate(-1)} type="button">
            Cancel
        </button>
      </p>
    </Form>

  );
}
