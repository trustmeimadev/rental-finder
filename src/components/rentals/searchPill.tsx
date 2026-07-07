import { Search, MapPin } from "lucide-react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Props = {
  hideNearMe?: boolean;
};

export default function SearchPill({ hideNearMe }: Props) {
  const navigate = useNavigate();
  const location = useLocation();
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");

  const isOnResultsPage =
    location.pathname === "/nearMe";
  const shouldHideNearMe = hideNearMe ?? isOnResultsPage;

  const handleSearch = () => {
    const trimmed = query.trim();

    if (!trimmed) {
      setError("Please enter a search term");
      return;
    }

    if (trimmed.length < 2) {
      setError("Search must be at least 2 characters");
      return;
    }

    setError("");
    navigate(`/search?q=${encodeURIComponent(trimmed)}`);
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
      { timeout: 5000, maximumAge: 60000 }
    );
  };

  return (
    <div className="space-y-2">
      <div
        className={`flex items-center gap-1.5 rounded-full border bg-white px-3 py-1 shadow-sm focus-within:ring-2 ${error
          ? "border-red-500 focus-within:border-red-600 focus-within:ring-red-100"
          : "border-green-500 focus-within:border-green-600 focus-within:ring-green-100"
          }`}
      >
        <Search className="h-4 w-4 shrink-0 text-gray-400" strokeWidth={2} />
        <Input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (error) setError("");
          }}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          placeholder="Search boarding house, apartment..."
          className="h-8 flex-1 border-0 bg-transparent px-0 text-sm shadow-none focus-visible:ring-0"
        />
        <Button
          onClick={handleSearch}
          className="h-7 shrink-0 rounded-full bg-green-600 px-4 text-xs font-semibold text-white hover:bg-green-700"
        >
          Search
        </Button>
      </div>

      {error && (
        <p className="px-3 text-xs font-medium text-red-600">{error}</p>
      )}

      {!shouldHideNearMe && (
        <Button
          onClick={handleNearMe}
          variant="outline"
          className="h-11 w-full gap-2 rounded-full border-2 border-green-500 bg-green-50 text-sm font-semibold text-green-700 hover:bg-green-100"
        >
          <MapPin className="h-4 w-4" strokeWidth={2.5} />
          Find rentals near me
        </Button>
      )}
    </div>
  );
}