import {
    Form,
    Link,
    NavLink,
    Outlet,
    useNavigation,
    useSubmit,
  } from "react-router";
  import { getCities, getCity } from "../data";
  import type { Route } from "./+types/sidebar";
  import { useEffect } from "react";
  
  export async function loader({
    request,
  }: Route.LoaderArgs) {
      const url = new URL(request.url);
      const q = url.searchParams.get("q");
      const cities = await getCities (q);
      return { cities, q };
  }
    
  export default function SidebarLayout({
    loaderData,
  }: Route.ComponentProps) {
    const { cities, q } = loaderData;
  
    const navigation = useNavigation();
    const submit = useSubmit();
    const searching =
    navigation.location &&
    new URLSearchParams(navigation.location.search).has(
      "q"
    );
  
    useEffect(() => {
      const searchField = document.getElementById("q");
      if (searchField instanceof HTMLInputElement) {
        searchField.value = q || "";
      }
    }, [q]);
  
    return (
      <>
        <div id="sidebar">
          <h1>
            <Link to="about">React Router Cities</Link>
          </h1>
          <div>
            <Form id="search-form"
              onChange={(event) => {
                const isFirstSearch = q === null;
                submit(event.currentTarget, {
                  replace: !isFirstSearch,
                });
              }}
              role="search"
              >
              <input
                aria-label="Search cities"
                className={
                  navigation.state === "loading" && !searching
                    ? "loading"
                    : ""
                }
                defaultValue={q || ""}
                id="q"
                name="q"
                placeholder="Search"
                type="search"
              />
              <div
                aria-hidden
                hidden={!searching}
                id="search-spinner"
              />
            </Form>
            <Form method="post">
              <button type="submit">New</button>
            </Form>
          </div>
          <nav>
            {cities.length ? (
              <ul>
                {cities.map((city) => (
                  <li key={city.id}>
                    <NavLink className={({ isActive, isPending }) =>
                    isActive
                      ? "active"
                      : isPending
                      ? "pending"
                      : ""
                  }
                  to={`cities/${city.id}`}
                >
                      {city.name ? (
                        <>
                          {city.name} {city.population?.toLocaleString()}
                        </>
                      ) : (
                        <i>No Name</i>
                      )}
                      {city.favorite ? (
                        <span>★</span>
                      ) : null}
                    </NavLink>
                  </li>
                ))}
              </ul>
            ) : (
              <p>
                <i>No cities</i>
              </p>
            )}
          </nav>
        </div>
        <div className={navigation.state === "loading" ? "loading" : ""} id="detail">
          <Outlet />
        </div>
      </>
    );
  }
  