const BASE_URL = "https://restcountries.com/v3.1";

export const getAllCountries = async () => {
  const response = await fetch(`${BASE_URL}/all?fields=name,flags,region`);
  const data = await response.json();
  return data;
};

export const searchCountries = async (query: string) => {
  const response = await fetch(`${BASE_URL}/name/${encodeURIComponent(query)}`);
  const data = await response.json();
  return data;
};

export const searchCountry = async (query: string) => {
  const response = await fetch(
    `${BASE_URL}/name/${encodeURIComponent(query)}?fullText=true`,
  );
  const data = await response.json();
  return data;
};
