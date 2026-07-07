import { Globe, ExternalLink, Search } from "lucide-react";

/**
 * Dynamic "Also on the web" component.
 *
 * Instead of fake mock data, each result is a real deep-linked search URL
 * on a well-known platform (Booking.com, Agoda, OLX, Facebook Marketplace, etc.)
 * scoped to the user's exact query + "Polomolok".
 */

type Platform = {
  name: string;
  source: string;
  description: (query: string) => string;
  url: (query: string) => string;
  /** Tailwind text-color class for the title */
  color: string;
};

const PLATFORMS: Platform[] = [
  {
    name: "Booking.com",
    source: "booking.com",
    description: (q) => `Search "${q}" rooms & rentals`,
    url: (q) =>
      `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(q + " Polomolok")}`,
    color: "text-blue-700",
  },
  {
    name: "Agoda",
    source: "agoda.com",
    description: (q) => `Find "${q}" stays near Polomolok`,
    url: (q) =>
      `https://www.agoda.com/search?city=Polomolok&checkIn=&checkOut=&query=${encodeURIComponent(q)}`,
    color: "text-red-600",
  },
  {
    name: "Facebook Marketplace",
    source: "facebook.com/marketplace",
    description: (q) => `"${q}" for rent listings`,
    url: (q) =>
      `https://www.facebook.com/marketplace/category/propertyrentals/?query=${encodeURIComponent(q + " Polomolok")}`,
    color: "text-blue-600",
  },
  {
    name: "OLX Philippines",
    source: "olx.ph",
    description: (q) => `"${q}" rental listings on OLX`,
    url: (q) =>
      `https://www.olx.ph/items/q-${encodeURIComponent(q)}/`,
    color: "text-orange-600",
  },
  {
    name: "Lamudi Philippines",
    source: "lamudi.com.ph",
    description: (q) => `"${q}" for rent properties`,
    url: (q) =>
      `https://www.lamudi.com.ph/south-cotabato/house/for-rent/?q=${encodeURIComponent(q)}`,
    color: "text-green-700",
  },
  {
    name: "Google Search",
    source: "google.com",
    description: (q) => `Search "${q} Polomolok rentals" on Google`,
    url: (q) =>
      `https://www.google.com/search?q=${encodeURIComponent(q + " apartments boarding houses Polomolok for rent")}`,
    color: "text-gray-700",
  },
];

type Props = {
  query: string;
};

export default function AlsoOnTheWeb({ query }: Props) {
  const googleUrl = `https://www.google.com/search?q=${encodeURIComponent(
    query + " apartments boarding houses Polomolok for rent"
  )}`;

  return (
    <div className="mt-8">
      {/* Section header */}
      <div className="mb-4 flex items-center gap-3">
        <Globe className="h-5 w-5 shrink-0 text-blue-600" />
        <h2 className="text-lg font-bold text-gray-900">Also on the web</h2>
      </div>

      {/* Search Google CTA button */}
      <button
        onClick={() => window.open(googleUrl, "_blank", "noopener,noreferrer")}
        className="mb-4 flex w-full items-center gap-3 rounded-2xl border border-gray-200 bg-white px-5 py-4 shadow-sm transition-all hover:border-gray-300 hover:shadow-md active:scale-[0.98]"
      >
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-100">
          <Search className="h-4 w-4 text-gray-600" />
        </div>
        <div className="text-left">
          <p className="text-sm font-semibold text-gray-800">Search Google</p>
          <p className="mt-0.5 text-xs text-gray-400 truncate max-w-[220px]">
            {query} apartments · Polomolok
          </p>
        </div>
        <ExternalLink className="ml-auto h-4 w-4 shrink-0 text-gray-400" />
      </button>

      {/* Dynamic platform results */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        {PLATFORMS.map((platform, i) => (
          <button
            key={i}
            onClick={() =>
              window.open(platform.url(query), "_blank", "noopener,noreferrer")
            }
            className="flex w-full items-center justify-between border-b border-gray-100 px-5 py-4 text-left last:border-b-0 transition-colors hover:bg-gray-50 active:scale-[0.99]"
          >
            <div className="min-w-0 flex-1">
              <p className={`truncate text-sm font-semibold ${platform.color}`}>
                {platform.name}
              </p>
              <p className="mt-0.5 text-xs text-gray-500">
                {platform.source} · {platform.description(query)}
              </p>
            </div>
            <ExternalLink className="ml-3 h-4 w-4 shrink-0 text-gray-400" />
          </button>
        ))}
      </div>
    </div>
  );
}
