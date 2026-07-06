import { Search, MapPin } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SearchPill() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    const trimmed = query.trim();
    if (trimmed) {
      navigate(`/search?q=${encodeURIComponent(trimmed)}`);
    } else {
      navigate("/search");
    }
  };

  const handleNearMe = () => {
    if (!navigator.geolocation) {
      navigate("/search");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        navigate(`/search?lat=${latitude}&lng=${longitude}&nearMe=1`);
      },
      () => {
        navigate("/search");
      }
    );
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1.5 rounded-full border border-green-500 bg-white px-3 py-1 shadow-sm focus-within:border-green-600 focus-within:ring-2 focus-within:ring-green-100">
        <Search className="h-4 w-4 shrink-0 text-gray-400" strokeWidth={2} />
        <Input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
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

      <Button
        onClick={handleNearMe}
        variant="outline"
        className="h-11 w-full gap-2 rounded-full border-2 border-green-500 bg-green-50 text-sm font-semibold text-green-700 hover:bg-green-100"
      >
        <MapPin className="h-4 w-4" strokeWidth={2.5} />
        Find rentals near me
      </Button>
    </div>
  );
}