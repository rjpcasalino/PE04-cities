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

async function getSeattleImage() {                                              
  const url =                                                                   
  'https://commons.wikimedia.org/w/index.php?search=Seattle&title=Special:MediaSearch&type=image'                                                                   
  try {                                                                         
    const response = await fetch(url);                                          
    if (response.ok) {                                                          
      const data = await response.text();                                       
      // Use a regex to extract the image URL from the response                 
      const imageUrlRegex = /\s*([^,]+)\.jpg/g;                            
      let match;                                                                
      while ((match = imageUrlRegex.exec(data)) !== null) {                     
        const imageUrl = match[1];
        console.debug(imageUrl)                                                            
      }                                                                         
    } else {
      console.error(`Error: ${response.status} - ${response.statusText}`);
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

getSeattleImage()


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
      "https://upload.wikimedia.org/wikipedia/commons/thumb/7/76/Vista_de_Seattle%2C_Washington%2C_Estados_Unidos%2C_2017-09-02%2C_DD_07-08_HDR.jpg/800px-Vista_de_Seattle%2C_Washington%2C_Estados_Unidos%2C_2017-09-02%2C_DD_07-08_HDR.jpg?20180116190821",
    name: "Seattle",
    population: 800000,
    country: "USA",
    notes: "none",
    favorite: true,
  },
  {
    avatar:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/View_of_Empire_State_Building_from_Rockefeller_Center_New_York_City_dllu.jpg/640px-View_of_Empire_State_Building_from_Rockefeller_Center_New_York_City_dllu.jpg",
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
