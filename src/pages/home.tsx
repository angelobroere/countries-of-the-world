import CountryCard from "../components/CountryCard";
import { useState, useEffect } from "react";
import { searchCountries, getAllCountries } from "../services/api.ts";

interface Country {
  name: { common: string; official: string };
  flags: { png: string; alt: string };
  region: string;
}

function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [countries, setCountries] = useState<Country[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedRegion, setSelectedRegion] = useState("");
  const [sortMode, setSortMode] = useState("random");

  useEffect(() => {
    const loadCountries = async () => {
      try {
        const allCountries = await getAllCountries();
        setCountries([...allCountries].sort(() => Math.random() - 0.5));
      } catch (err) {
        console.error(err);
        setError("Failed to load countries.");
      } finally {
        setLoading(false);
      }
    };
    loadCountries();
  }, []);

  const handleSearch = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!searchQuery.trim() || loading) return;
    setLoading(true);
    try {
      const results = await searchCountries(searchQuery);
      setCountries(results);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to load countries.");
    } finally {
      setLoading(false);
    }
  };

  const filteredCountries = countries.filter((country) => {
    const matchesSearch = country.name.common
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesRegion = selectedRegion
      ? country.region === selectedRegion
      : true;
    return matchesSearch && matchesRegion;
  });

  function sortCountries(countries: Country[], mode: string) {
    const sorted = [...countries];

    if (mode === "az") {
      sorted.sort((a, b) => a.name.common.localeCompare(b.name.common));
    }
    if (mode === "za") {
      sorted.sort((a, b) => b.name.common.localeCompare(a.name.common));
    }
    if (mode === "random") {
      sorted.sort(() => Math.random() - 0.5);
    }
    return sorted;
  }

  const sortedCountries = sortCountries(filteredCountries, sortMode);

  return (
    <>
    <div className="min-h-[95vh] bg-gray-50 font-sans">
      {/* Header & Controls */}
      <header className="flex flex-col sm:flex-row items-center justify-center px-8 py-10 bg-white shadow gap-6 sm:gap-16">
        <h1 className="text-4xl font-bold text-center text-gray-800 tracking-tight">
          🌍 Countries of the World
        </h1>

        <form
          onSubmit={handleSearch}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <input
            type="text"
            placeholder="Search for a country..."
            className="w-full sm:flex-1 px-4 py-2.5 rounded-xl border border-gray-200 bg-white shadow-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <label className="text-sm text-gray-500 whitespace-nowrap">
            Region:
          </label>
          <select
            className="px-3 py-2.5 rounded-xl border border-gray-200 bg-white shadow-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition cursor-pointer"
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
          >
            <option value="">All</option>
            <option value="Africa">Africa</option>
            <option value="Americas">Americas</option>
            <option value="Asia">Asia</option>
            <option value="Europe">Europe</option>
            <option value="Oceania">Oceania</option>
          </select>

          <label className="text-sm text-gray-500 whitespace-nowrap">
            Order:
          </label>
          <select
            className="px-3 py-2.5 rounded-xl border border-gray-200 bg-white shadow-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition cursor-pointer"
            value={sortMode}
            onChange={(e) => setSortMode(e.target.value)}
          >
            <option value="random">Random</option>
            <option value="az">A-Z</option>
            <option value="za">Z-A</option>
          </select>
        </form>
      </header>

      {/* Error */}
      {error && (
        <p className="text-center text-red-500 text-sm px-4">{error}</p>
      )}

      {/* Country Grid */}
      {loading ? (
        <div className="flex justify-center items-center h-48 text-gray-400 text-lg">
          Loading...
        </div>
      ) : (
        <main className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-8 max-w-6xl mx-auto">
          {sortedCountries.map((country, index) => (
            <CountryCard
              key={index}
              country={{
                img: country.flags.png,
                img_alt: country.flags.alt,
                name: country.name.common,
                continent: country.region,
              }}
            />
          ))}
        </main>
      )}
      
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

export default Home;
