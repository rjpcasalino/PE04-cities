////////////////////////////////////////////////////////////////////////////////
// 🛑 Nothing in here has anything to do with React Router, it's just a fake database
////////////////////////////////////////////////////////////////////////////////

import { matchSorter } from "match-sorter";
// @ts-expect-error - no types, but it's a tiny function
import sortBy from "sort-by";
import invariant from "tiny-invariant";

type CityMutation = {
  id?: string;
  avatar?: string;
  name?: string;
  population?: number;
  country?: string;
  notes?: string;
  favorite?: boolean;
};

export type CityRecord = CityMutation & {
  id: string;
  createdAt: string;
};

////////////////////////////////////////////////////////////////////////////////
// This is just a fake DB table. In a real app you'd be talking to a real db or
// fetching from an existing API.
const fakeCities = {
  records: {} as Record<string, CityRecord>,

  async getAll(): Promise<CityRecord[]> {
    return Object.keys(fakeCities.records)
      .map((key) => fakeCities.records[key])
      .sort(sortBy("-createdAt", "last"));
  },

  async get(id: string): Promise<CityRecord | null> {
    return fakeCities.records[id] || null;
  },

  async create(values: CityMutation): Promise<CityRecord> {
    const id = values.id || Math.random().toString(36).substring(2, 9);
    const createdAt = new Date().toISOString();
    const newCity = { id, createdAt, ...values };
    fakeCities.records[id] = newCity;
    return newCity;
  },

  async set(id: string, values: CityMutation): Promise<CityRecord> {
    const city = await fakeCities.get(id);
    invariant(city, `No city found for ${id}`);
    const updatedCity = { ...city, ...values };
    fakeCities.records[id] = updatedCity;
    return updatedCity;
  },

  destroy(id: string): null {
    delete fakeCities.records[id];
    return null;
  },
};

////////////////////////////////////////////////////////////////////////////////
// Handful of helper functions to be called from route loaders and actions
export async function getCities(query?: string | null) {
  await new Promise((resolve) => setTimeout(resolve, 500));
  let cities = await fakeCities.getAll();
  if (query) {
    cities = matchSorter(cities, query, {
      keys: ["name"],
    });
  }
  return cities.sort(sortBy("name", "createdAt"));
}

export async function createEmptyCity() {
  const city = await fakeCities.create({});
  return city;
}

export async function getCity(id: string) {
  return fakeCities.get(id);
}

export async function updateCity(id: string, updates: CityMutation) {
  const city = await fakeCities.get(id);
  if (!city) {
    throw new Error(`No city found for ${id}`);
  }
  await fakeCities.set(id, { ...city, ...updates });
  return city;
}

export async function deleteCity(id: string) {
  fakeCities.destroy(id);
}

[
  {
    avatar:
      "https://sessionize.com/image/124e-400o400o2-wHVdAuNaxi8KJrgtN3ZKci.jpg",
    name: "Seattle",
    population: 800000,
    country: "USA",
    notes: "none",
    favorite: true,
  },
  {
    avatar:
      "https://sessionize.com/image/1940-400o400o2-Enh9dnYmrLYhJSTTPSw3MH.jpg",
    name: "New York City",
    population: 1000000,
    country: "USA",
    notes: "none",
    favorite: true,
  },
].forEach((city) => {
  fakeCities.create({
    ...city,
    id: `${city.name
      .toLowerCase()
      .split(" ")
      .join("_")}-${city.country.toLocaleLowerCase()}`,
  });
});
