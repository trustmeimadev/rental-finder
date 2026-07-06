import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { List, Map as MapIcon } from "lucide-react";
import SearchPill from "@/components/rentals/searchPill";
import ListingCard from "@/components/rentals/listingCard";
import PageShell from "@/components/layout/pageShell";
import { Skeleton } from "@/components/ui/skeleton";
import { MOCK_LISTINGS, type Listing } from "@/mocks/listings";

type ViewMode = "list" | "map";

export default function NearMe() {
  const [searchParams] = useSearchParams();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>("list");

  const nearMe = searchParams.get("nearMe") === "1";
  const keyword = searchParams.get("q") || "";
  const landmark = searchParams.get("landmark") || "";

  useEffect(() => {
    const t = setTimeout(() => {
      let results = MOCK_LISTINGS.filter((l) => l.availability === "available");

      if (keyword) {
        const q = keyword.toLowerCase();
        results = results.filter(
          (l) =>
            l.title.toLowerCase().includes(q) ||
            l.barangay.toLowerCase().includes(q) ||
            l.address.toLowerCase().includes(q),
        );
      }

      if (landmark) {
        results = results.filter((l) =>
          l.nearLandmarks.some((lm) => lm.name === landmark),
        );
      }

      setListings(results);
      setLoading(false);
    }, 300);
    return () => clearTimeout(t);
  }, [keyword, landmark, nearMe]);

  const getHeaderText = () => {
    if (nearMe) return "Rentals near you";
    if (landmark) return `Rentals near ${landmark}`;
    if (keyword) return `Results for "${keyword}"`;
    return "All rentals";
  };

  return (
    <PageShell>
      {/* Sticky search pill */}
      <div className="sticky top-0 z-10 bg-background pt-4 pb-3">
        <SearchPill />
      </div>

      {/* View toggle */}
      <div className="mt-2 flex gap-2">
        <button
          onClick={() => setViewMode("list")}
          className={`flex flex-1 items-center justify-center gap-2 rounded-full py-2.5 text-sm font-semibold transition-colors ${
            viewMode === "list"
              ? "bg-green-600 text-white"
              : "bg-white text-gray-700 hover:bg-gray-50"
          }`}
        >
          <List className="h-4 w-4" />
          List
        </button>
        <button
          onClick={() => setViewMode("map")}
          className={`flex flex-1 items-center justify-center gap-2 rounded-full py-2.5 text-sm font-semibold transition-colors ${
            viewMode === "map"
              ? "bg-green-600 text-white"
              : "bg-white text-gray-700 hover:bg-gray-50"
          }`}
        >
          <MapIcon className="h-4 w-4" />
          Map
        </button>
      </div>

      {/* Header + count */}
      <div className="mt-6">
        <h1 className="text-lg font-bold text-gray-900">{getHeaderText()}</h1>
        {!loading && (
          <p className="mt-1 text-sm text-muted-foreground">
            {listings.length} {listings.length === 1 ? "rental" : "rentals"}{" "}
            found
          </p>
        )}
      </div>

      {/* Results */}
      {viewMode === "list" ? (
        <div className="mt-4">
          {loading ? (
            <div className="scrollbar-hide flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth pb-2">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="w-[45%] shrink-0 snap-start sm:w-[30%] md:w-[22%]"
                >
                  <Skeleton className="aspect-square w-full rounded-2xl" />
                  <Skeleton className="mt-2 h-4 w-3/4" />
                  <Skeleton className="mt-1 h-3 w-1/2" />
                </div>
              ))}
            </div>
          ) : listings.length === 0 ? (
            <div className="mt-8 rounded-xl border border-border p-8 text-center">
              <p className="text-sm font-semibold text-gray-900">
                No rentals found
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Try a different search or landmark
              </p>
            </div>
          ) : (
            <div className="scrollbar-hide flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth pb-2">
              {listings.map((l) => (
                <div
                  key={l.id}
                  className="w-[45%] shrink-0 snap-start sm:w-[30%] md:w-[22%]"
                >
                  <ListingCard listing={l} />
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="mt-4 flex aspect-[3/4] w-full items-center justify-center rounded-xl border border-border bg-gray-50">
          <div className="text-center">
            <MapIcon className="mx-auto h-8 w-8 text-gray-400" />
            <p className="mt-2 text-sm font-semibold text-gray-900">
              Map view coming soon
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {listings.length} pins would appear here
            </p>
          </div>
        </div>
      )}
    </PageShell>
  );
}