import { useSearchParams, useNavigate } from "react-router-dom";
import { useMemo } from "react";
import { Search, ArrowLeft } from "lucide-react";
import { MOCK_LISTINGS, type Listing } from "@/mocks/listings";
import ListingCard from "@/components/rentals/listingCard";
import SearchPill from "@/components/rentals/searchPill";
import PageShell from "@/components/layout/pageShell";
import AlsoOnTheWeb from "@/components/rentals/alsoOnTheWeb";
import { Skeleton } from "@/components/ui/skeleton";

const PROPERTY_TYPE_LABEL: Record<Listing["propertyType"], string> = {
  boarding_house: "Boarding Houses",
  apartment: "Apartments",
  bedspace: "Bedspaces",
  dorm: "Dorms",
  room: "Rooms",
};

const PROPERTY_TYPE_ORDER: Listing["propertyType"][] = [
  "apartment",
  "boarding_house",
  "room",
  "bedspace",
  "dorm",
];

type GroupedListings = Partial<Record<Listing["propertyType"], Listing[]>>;

function HorizontalTypeRow({
  label,
  listings,
}: {
  label: string;
  listings: Listing[];
}) {
  if (listings.length === 0) return null;
  return (
    <section className="mt-8">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-base font-semibold text-gray-900">{label}</h2>
        <span className="text-xs text-muted-foreground">
          {listings.length} {listings.length === 1 ? "rental" : "rentals"}
        </span>
      </div>
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
    </section>
  );
}

function SkeletonRows() {
  return (
    <>
      {[1, 2].map((row) => (
        <section key={row} className="mt-8">
          <Skeleton className="mb-3 h-4 w-32 rounded" />
          <div className="scrollbar-hide flex gap-3 overflow-x-auto pb-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="w-[45%] shrink-0 sm:w-[30%] md:w-[22%]">
                <Skeleton className="aspect-square w-full rounded-2xl" />
                <Skeleton className="mt-2 h-4 w-3/4" />
                <Skeleton className="mt-1 h-3 w-1/2" />
              </div>
            ))}
          </div>
        </section>
      ))}
    </>
  );
}

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const q = searchParams.get("q") ?? "";
  const landmark = searchParams.get("landmark") ?? "";

  const displayQuery = q || landmark;
  const isFiltered = Boolean(displayQuery);

  const results = useMemo(() => {
    if (!q && !landmark) return MOCK_LISTINGS;

    return MOCK_LISTINGS.filter((listing) => {
      const searchLower = (q || landmark).toLowerCase();
      return (
        listing.title.toLowerCase().includes(searchLower) ||
        listing.barangay.toLowerCase().includes(searchLower) ||
        listing.address.toLowerCase().includes(searchLower) ||
        listing.nearLandmarks.some((lm) =>
          lm.name.toLowerCase().includes(searchLower)
        ) ||
        listing.propertyType.replace("_", " ").toLowerCase().includes(searchLower)
      );
    });
  }, [q, landmark]);

  // Group by property type
  const grouped: GroupedListings = {};
  for (const listing of results) {
    if (!grouped[listing.propertyType]) grouped[listing.propertyType] = [];
    grouped[listing.propertyType]!.push(listing);
  }

  const hasResults = results.length > 0;

  return (
    <PageShell>
      {/* Sticky top bar */}
      <div className="bg-background sticky top-0 z-10 pt-4 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(-1)}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gray-200 bg-white transition-colors hover:bg-gray-100 active:scale-95"
            aria-label="Go back"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div className="flex-1">
            <SearchPill hideNearMe />
          </div>
        </div>
      </div>

      {/* Results heading */}
      <div className="mt-4">
        {isFiltered ? (
          <h1 className="text-base font-bold text-gray-900">
            {hasResults ? (
              <>
                {results.length} result{results.length !== 1 ? "s" : ""}{" "}
                <span className="font-normal text-gray-500">
                  for &ldquo;{displayQuery}&rdquo;
                </span>
              </>
            ) : (
              <>
                No results{" "}
                <span className="font-normal text-gray-500">
                  for &ldquo;{displayQuery}&rdquo;
                </span>
              </>
            )}
          </h1>
        ) : (
          <h1 className="text-base font-bold text-gray-900">
            All listings{" "}
            <span className="font-normal text-gray-500">· {results.length}</span>
          </h1>
        )}
      </div>

      {/* Grouped results */}
      {hasResults ? (
        PROPERTY_TYPE_ORDER.map((type) =>
          grouped[type] && grouped[type]!.length > 0 ? (
            <HorizontalTypeRow
              key={type}
              label={PROPERTY_TYPE_LABEL[type]}
              listings={grouped[type]!}
            />
          ) : null
        )
      ) : isFiltered ? (
        // No results empty state
        <div className="mt-8 flex flex-col items-center text-center">
          <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
            <Search className="h-7 w-7 text-gray-400" />
          </div>
          <p className="text-base font-semibold text-gray-900">
            No local rentals found
          </p>
          <p className="mt-1 max-w-xs text-sm text-gray-500">
            We couldn&apos;t find any listings for &ldquo;{displayQuery}&rdquo;.
            Try a different search or check out other options below.
          </p>
          <button
            onClick={() => navigate("/")}
            className="mt-4 text-sm font-semibold text-green-700 hover:text-green-800"
          >
            Browse all listings →
          </button>
        </div>
      ) : (
        <SkeletonRows />
      )}

      {/* Also on the web — always shown when a query is active */}
      {isFiltered && displayQuery && (
        <AlsoOnTheWeb query={displayQuery} />
      )}

      <div className="h-20" />
    </PageShell>
  );
}
