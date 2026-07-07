import { Search, MapPin, SlidersHorizontal, X } from "lucide-react";
import { useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import SearchFilters from "@/components/rentals/searchFilters";

type Props = {
  hideNearMe?: boolean;
  hideFilters?: boolean;
};

export default function SearchPill({ hideNearMe, hideFilters }: Props) {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [error, setError] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const isOnResultsPage = location.pathname === "/nearMe";
  const shouldHideNearMe = hideNearMe ?? isOnResultsPage;

  const activeFilterCount = [
    searchParams.get("types"),
    searchParams.get("minPrice"),
    searchParams.get("maxPrice"),
    searchParams.get("landmarks"),
    searchParams.get("amenities"),
    searchParams.get("capacity"),
    searchParams.get("rating"),
    searchParams.get("verified"),
  ].filter(Boolean).length;

  const handleSearch = () => {
    const trimmed = query.trim();

    if (!trimmed) {
      setError("Please enter a search term");
      return;
    }

    if (trimmed.length < 2) {
      setError("At least 2 characters");
      return;
    }

    setError("");
    const params = new URLSearchParams(searchParams);
    params.set("q", trimmed);
    navigate(`/search?${params.toString()}`);
  };

  const handleClearQuery = () => {
    setQuery("");
    setError("");
  };

  const handleNearMe = () => {
    if (!navigator.geolocation) {
      navigate("/nearMe");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        navigate(`/nearMe?lat=${latitude}&lng=${longitude}&nearMe=1`);
      },
      () => {
        navigate("/nearMe");
      },
      { timeout: 5000, maximumAge: 60000 },
    );
  };

  return (
    <div className="space-y-2">
      <div
        className={`group relative flex items-center gap-1 rounded-full bg-white p-1 shadow-sm transition-all ${
          error
            ? "ring-2 ring-red-300"
            : "ring-1 ring-gray-200 focus-within:ring-2 focus-within:ring-green-500"
        }`}
      >
        {/* Search icon */}
        <div className="flex h-9 w-9 shrink-0 items-center justify-center">
          <Search
            className={`h-4 w-4 transition-colors ${
              query || error ? "text-green-600" : "text-gray-400"
            }`}
            strokeWidth={2.5}
          />
        </div>

        {/* Input */}
        <Input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (error) setError("");
          }}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          placeholder="Where to stay in Polomolok?"
          className="h-9 flex-1 border-0 bg-transparent px-0 text-sm shadow-none placeholder:text-gray-400 focus-visible:ring-0"
        />

        {/* Clear button */}
        {query && (
          <button
            onClick={handleClearQuery}
            className="mr-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-700"
            aria-label="Clear"
          >
            <X className="h-3.5 w-3.5" strokeWidth={2.5} />
          </button>
        )}

        {/* Divider */}
        {!hideFilters && (
          <div className="h-5 w-px shrink-0 bg-gray-200" />
        )}

        {/* Filter button */}
        {!hideFilters && (
          <button
            onClick={() => setFiltersOpen(true)}
            className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-gray-100"
            aria-label="Filters"
          >
            <SlidersHorizontal
              className="h-4 w-4 text-gray-700"
              strokeWidth={2.5}
            />
            {activeFilterCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-green-600 px-1 text-[9px] font-bold text-white ring-2 ring-white">
                {activeFilterCount}
              </span>
            )}
          </button>
        )}

        {/* Near me pill button */}
        {!shouldHideNearMe && (
          <button
            onClick={handleNearMe}
            className="flex h-9 shrink-0 items-center gap-1 rounded-full bg-green-600 px-3 text-xs font-semibold text-white shadow-sm transition-all hover:bg-green-700 active:scale-95"
            aria-label="Find near me"
          >
            <MapPin className="h-3.5 w-3.5" strokeWidth={2.5} />
            <span className="">Near me</span>
          </button>
        )}

        {/* Search button */}
        {shouldHideNearMe && (
          <button
            onClick={handleSearch}
            className="flex h-9 shrink-0 items-center gap-1 rounded-full bg-green-600 px-4 text-xs font-semibold text-white shadow-sm transition-all hover:bg-green-700 active:scale-95"
          >
            Search
          </button>
        )}
      </div>

      {error && (
        <p className="px-3 text-xs font-medium text-red-600">{error}</p>
      )}

      <SearchFilters open={filtersOpen} onOpenChange={setFiltersOpen} />
    </div>
  );
}