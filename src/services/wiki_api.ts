const BASE_URL = "https://en.wikipedia.org/api/rest_v1/page/summary";

export const getCountryWiki = async (query: string) => {
  const response = await fetch(`${BASE_URL}/${encodeURIComponent(query)}`);
  const data = await response.json();
  return data;
};