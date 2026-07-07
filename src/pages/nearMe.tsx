import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { List, Map as MapIcon } from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import SearchPill from "@/components/rentals/searchPill";
import ListingCard from "@/components/rentals/listingCard";
import PageShell from "@/components/layout/pageShell";
import { Skeleton } from "@/components/ui/skeleton";
import { MOCK_LISTINGS, type Listing } from "@/mocks/listings";
import AlsoOnTheWeb from "@/components/rentals/alsoOnTheWeb";
import { defaultIcon } from "@/lib/leafletIcon";

type ViewMode = "list" | "map";

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

function MapListingCard({ listing }: { listing: Listing }) {
  const navigate = useNavigate();

  const price = new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    maximumFractionDigits: 0,
  }).format(listing.pricePerMonth);

  return (
    <div className="w-48">
      <div
        className="aspect-[16/10] w-full overflow-hidden rounded-lg bg-cover bg-center"
        style={{ backgroundImage: `url(${listing.photos[0]})` }}
      />
      <div className="mt-2 px-0.5">
        <p className="line-clamp-1 text-xs font-semibold text-gray-900">
          {listing.title}
        </p>
        <p className="mt-0.5 text-[11px] text-gray-500">{listing.barangay}</p>
        <p className="mt-1 text-sm font-bold text-green-700">
          {price}
          <span className="text-[10px] font-normal text-gray-500">/month</span>
        </p>
        <button
          onClick={() => navigate(`/listing/${listing.id}`)}
          className="mt-2.5 w-full rounded-lg bg-green-600 py-2 text-[11px] font-semibold text-white hover:bg-green-700 active:scale-[0.98]"
        >
          View Details
        </button>
      </div>
    </div>
  );
}

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

  const grouped: GroupedListings = {};
  for (const listing of listings) {
    if (!grouped[listing.propertyType]) grouped[listing.propertyType] = [];
    grouped[listing.propertyType]!.push(listing);
  }

  const hasResults = listings.length > 0;

  const mapCenter: [number, number] =
    listings.length > 0
      ? [listings[0].coordinates.lat, listings[0].coordinates.lng]
      : [6.2148, 125.0633];

  return (
    <PageShell>
      <div className="sticky top-0 z-10 bg-background pt-4 pb-3">
        <SearchPill />
      </div>

      <div className="mt-2 flex gap-2">
        <button
          onClick={() => setViewMode("list")}
          className={`flex flex-1 items-center justify-center gap-2 rounded-full py-2.5 text-sm font-semibold transition-colors ${viewMode === "list"
            ? "bg-green-600 text-white"
            : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
        >
          <List className="h-4 w-4" />
          List
        </button>
        <button
          onClick={() => setViewMode("map")}
          className={`flex flex-1 items-center justify-center gap-2 rounded-full py-2.5 text-sm font-semibold transition-colors ${viewMode === "map"
            ? "bg-green-600 text-white"
            : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
        >
          <MapIcon className="h-4 w-4" />
          Map
        </button>
      </div>

      <div className="mt-6">
        <h1 className="text-lg font-bold text-gray-900">{getHeaderText()}</h1>
        {!loading && (
          <p className="mt-1 text-sm text-muted-foreground">
            {listings.length} {listings.length === 1 ? "rental" : "rentals"} found
          </p>
        )}
      </div>

      {viewMode === "list" ? (
        <div>
          {loading ? (
            <SkeletonRows />
          ) : !hasResults ? (
            <div className="mt-8 flex flex-col items-center text-center">
              <p className="text-sm font-semibold text-gray-900">
                No local rentals found
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Try a different search or landmark
              </p>
            </div>
          ) : (
            PROPERTY_TYPE_ORDER.map((type) =>
              grouped[type] && grouped[type]!.length > 0 ? (
                <HorizontalTypeRow
                  key={type}
                  label={PROPERTY_TYPE_LABEL[type]}
                  listings={grouped[type]!}
                />
              ) : null,
            )
          )}
        </div>
      ) : (
        <div className="mt-4">
          <div className="overflow-hidden rounded-2xl border border-border">
            <MapContainer
              center={mapCenter}
              zoom={14}
              scrollWheelZoom
              style={{ height: "75vh", width: "100%" }}
            >
              <TileLayer
                attribution="&copy; OpenStreetMap"
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {listings.map((listing) => (
                <Marker
                  key={listing.id}
                  position={[
                    listing.coordinates.lat,
                    listing.coordinates.lng,
                  ]}
                  icon={defaultIcon}
                >
                  <Popup>
                    <MapListingCard listing={listing} />
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </div>
      )}

      {!loading && (keyword || landmark) && (
        <AlsoOnTheWeb query={keyword || landmark} />
      )}

      <div className="h-20" />
    </PageShell>
  );
}