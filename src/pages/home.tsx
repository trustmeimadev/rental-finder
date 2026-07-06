import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchPill from "@/components/rentals/searchPill";
import ListingCard from "@/components/rentals/listingCard";
import PageShell from "@/components/layout/pageShell";
import { Skeleton } from "@/components/ui/skeleton";
import { MOCK_LISTINGS, type Listing } from "@/mocks/listings";

const POPULAR_SEARCHES = [
  "Cannery Site",
  "Notre Dame-Siena",
  "Poblacion",
  "Public Market",
];

export default function Home() {
  const navigate = useNavigate();
  const [featured, setFeatured] = useState<Listing[]>([]);
  const [nearCannery, setNearCannery] = useState<Listing[]>([]);
  const [nearSiena, setNearSiena] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => {
      const available = MOCK_LISTINGS.filter((l) => l.availability === "available");
      setFeatured(available);
      setNearCannery(available.filter((l) => l.nearLandmarks.includes("Cannery Site")));
      setNearSiena(available.filter((l) => l.nearLandmarks.includes("Notre Dame-Siena")));
      setLoading(false);
    }, 300);
    return () => clearTimeout(t);
  }, []);

  return (
    <PageShell>
      <div className="sticky top-0 z-10 bg-background pt-4 pb-3">
        <SearchPill />
      </div>

      <section className="mt-2">
        <p className="mb-2 text-sm font-medium text-muted-foreground">
          Popular searches
        </p>
        <div className="flex flex-wrap gap-2">
          {POPULAR_SEARCHES.map((label) => (
            <button
              key={label}
              onClick={() =>
                navigate(`/search?landmark=${encodeURIComponent(label)}`)
              }
              className="rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-medium text-gray-700 transition-colors hover:border-gray-400 active:scale-95"
            >
              {label}
            </button>
          ))}
        </div>
      </section>

      <HorizontalListingRow
        title="Featured in Polomolok"
        listings={featured}
        loading={loading}
      />

      <HorizontalListingRow
        title="Popular in Cannery Site"
        listings={nearCannery}
        loading={loading}
      />

      <HorizontalListingRow
        title="Popular near Notre Dame-Siena"
        listings={nearSiena}
        loading={loading}
      />
    </PageShell>
  );
}

type RowProps = {
  title: string;
  listings: Listing[];
  loading: boolean;
};

function HorizontalListingRow({ title, listings, loading }: RowProps) {
  if (!loading && listings.length === 0) return null;

  return (
    <section className="mt-8">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-semibold">{title}</h2>
      </div>

      <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth pb-2 scrollbar-hide">
        {loading
          ? [...Array(4)].map((_, i) => (
              <div
                key={i}
                className="w-[45%] shrink-0 snap-start sm:w-[30%] md:w-[22%]"
              >
                <Skeleton className="aspect-square w-full rounded-2xl" />
                <Skeleton className="mt-2 h-4 w-3/4" />
                <Skeleton className="mt-1 h-3 w-1/2" />
              </div>
            ))
          : listings.map((l) => (
              <div
                key={l.id}
                className="w-[45%] shrink-0 snap-start sm:w-[30%] md:w-[22%]"
              >
                <ListingCard listing={l} />
              </div>
            ))}
      </div>
    </section>
  );
}