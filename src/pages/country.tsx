import { useParams } from "react-router-dom";
import { searchCountry } from "../services/api";
import { useEffect, useState } from "react";

function Country() {
  const { countryname = "" } = useParams();

  interface Country {
    name: { common: string };
    flags: { png: string; alt: string };
    region: string;
    population: number;
    continents: [];
  }

  const [country, setCountry] = useState<Country>();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCountries = async () => {
      try {
        const fetchedcountry = await searchCountry(countryname);
        setCountry(fetchedcountry[0]);
      } catch (err) {
        console.log(err);
        setError("Failed to load countries ...");
      } finally {
        setLoading(false);
      }
    };
    loadCountries();
  }, []);

  return (
    <div>
      {error && <div className="error-message">{error}</div>}
      {loading ? (
        <div>Loading ...</div>
      ) : (
        // TODO Create webpage for specific country.
        // Pulling information from the API
        country && <div>{country.continents}</div>
      )}
    </div>
  );
}

export default Country;
