interface Country {
  img: string;
  img_alt: string;
  name: string;
  continent: string;
}

interface CountryCardProps {
  country: Country;
}

function CountryCard({ country }: CountryCardProps) {
  return (
    <div className="bg-teal-700 rounded-xl overflow-hidden shadow-lg px-1">
      <img
        src={country.img}
        alt={country.img_alt}
        className="max-w-full mx-auto h-40 object-contain rounded-xl pt-1 pb-1"
      />
      <div className="p-4">
        <a
          href={`/country/${country.name}`}
          className="no-underline hover:no-underline"
        >
          <h3 className="text-lg font-semibold text-[#edddd4] hover:text-white transition-colors">
            {country.name}
          </h3>
        </a>
        <p className="text-sm text-[#edddd4] opacity-80 mt-1">
          {country.continent}
        </p>
      </div>
    </div>
  );
}

export default CountryCard;
