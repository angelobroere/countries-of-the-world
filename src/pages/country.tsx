import { useParams } from "react-router-dom";
import { searchCountry } from "../services/api";
import { getCountryWiki } from "../services/wiki_api";
import { useEffect, useState } from "react";

function Country() {
  const { countryname = "" } = useParams();

  type Currency = {
    symbol: string;
    name: string;
  };

  interface Country {
    name: { common: string; official: string };
    flags: { png: string; alt: string };
    coatOfArms: { png: string; alt: string };
    maps: { openStreetMaps: string };
    latlng: number[];
    region: string;
    population: number;
    area: number;
    continents: string[];
    languages: Record<string, string>;
    capital: Record<number, string>;
    currencies: Record<string, Currency>;
  }

  interface CountryWiki {
    extract: string;
    content_urls: {
      desktop: {
        page: string;
      };
    };
  }

  const [country, setCountry] = useState<Country>();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [countryWiki, setCountyWiki] = useState<CountryWiki>();

  useEffect(() => {
    const loadCountry = async () => {
      try {
        const fetchedcountry = await searchCountry(countryname);
        setCountry(fetchedcountry[0]);
      } catch (err) {
        console.log(err);
        setError("Failed to load country information.");
      } finally {
        setLoading(false);
      }
    };
    loadCountry();
  }, []);

  useEffect(() => {
    const loadCountryWiki = async () => {
      try {
        const fetchedwiki = await getCountryWiki(countryname);
        setCountyWiki(fetchedwiki);
      } catch (err) {
        console.log(err);
        setError("Failed to load country wiki");
      } finally {
        setLoading(false);
      }
    };
    loadCountryWiki();
  }, []);

  return (
    <>
      <div className="min-h-[95vh] bg-gray-50 font-sans">
        <header className="flex flex-col sm:flex-row items-center justify-center px-8 py-10 bg-white shadow gap-6 sm:gap-16">
          <h1 className="text-4xl font-bold text-center text-gray-800 tracking-tight">
            <a href="/">🌍 Countries of the World</a>
          </h1>
        </header>
        <main className="p-8 max-w-6xl mx-auto">
          {error && <div className="error-message">{error}</div>}
          {loading ? (
            <div>Loading ...</div>
          ) : (
            country && (
              <div>
                <h2 className="text-3xl">{country.name.common}</h2>
                {country.name.common != country.name.official && (
                  <h5 className="text-xl">{country.name.official}</h5>
                )}
                {Object.values(country.capital).length > 1 ? (
                  <p>Capitals: {Object.values(country.capital).join(", ")}</p>
                ) : (
                  <p>Capital: {Object.values(country.capital)}</p>
                )}
                {country.continents.length > 1 ? (
                  <p>Continents: {country.continents.join(", ")}</p>
                ) : (
                  <p>Continent: {country.continents}</p>
                )}

                <p>Population: {country.population.toLocaleString()}</p>
                {Object.values(country.languages).length > 1 ? (
                  <p>
                    Languages: {Object.values(country.languages).join(", ")}
                  </p>
                ) : (
                  <p>Language: {Object.values(country.languages)}</p>
                )}
                <p>Area: {country.area.toLocaleString()} km²</p>
                <p>
                  {Object.entries(country.currencies).length > 1
                    ? "Currencies: "
                    : "Currency: "}
                  {Object.entries(country.currencies).map(
                    ([code, currency], index, arr) => (
                      <span key={code}>
                        {currency.symbol} ({currency.name})
                        {index < arr.length - 1 ? ", " : ""}
                      </span>
                    ),
                  )}
                </p>

                {countryWiki && (
                  <p>
                    {countryWiki.extract} [
                    <a
                      className="text-blue"
                      href={countryWiki.content_urls.desktop.page}
                      target="_blank"
                    >
                      wiki
                    </a>
                    ]
                  </p>
                )}

                <img src={country.flags.png} alt={country.flags.alt} />
                <img
                  src={country.coatOfArms.png}
                  alt={country.coatOfArms.alt}
                />

                {country.latlng?.length > 0 && (
                  <iframe
                    width="100%"
                    height="400"
                    src={`https://www.openstreetmap.org/export/embed.html?bbox=${country.latlng[1] - 5},${country.latlng[0] - 5},${country.latlng[1] + 5},${country.latlng[0] + 5}&layer=mapnik`}
                  />
                )}
              </div>
            )
          )}
        </main>
      </div>
      <footer className="flex justify-center min-h-[5vh] px-8 py-4 bg-white shadow-lg mb-0 w-full">
        <a
          href="https://github.com/angelobroere"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className="flex items-center gap-2 [&>svg]:h-10 [&>svg]:w-10">
            Created by Angelo -
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 496 512"
            >
              <path d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3 .3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5 .3-6.2 2.3zm44.2-1.7c-2.9 .7-4.9 2.6-4.6 4.9 .3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3 .7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3 .3 2.9 2.3 3.9 1.6 1 3.6 .7 4.3-.7 .7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3 .7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3 .7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z" />
            </svg>
          </span>
        </a>
      </footer>
    </>
  );
}

export default Country;
