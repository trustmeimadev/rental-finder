import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  BadgeCheck,
  MapPin,
  Info,
  BedDouble,
  Phone,
  Mail,
  Calendar,
  Check,
  ShieldCheck,
  Navigation,
  ExternalLink,
  BarChart3,
  TrendingDown,
  TrendingUp,
  MessageCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import PhotoGallery from "@/components/rentals/photoGallery";
import StickyActionBar from "@/components/rentals/stickyActionBar";
import PageShell from "@/components/layout/pageShell";
import { MOCK_LISTINGS, type Listing } from "@/mocks/listings";
import { MOCK_LANDLORDS } from "@/mocks/landlords";
import { getUnitLabel } from "@/lib/unitLabel";
import { getLandmarkIcon } from "@/lib/landmarkIcons";
import { defaultIcon } from "@/lib/leafletIcon";

const PROPERTY_TYPE_LABEL: Record<Listing["propertyType"], string> = {
  boarding_house: "Boarding house",
  apartment: "Apartment",
  bedspace: "Bedspace",
  dorm: "Dorm",
  room: "Room",
};

const formatPeso = (n: number) =>
  new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    maximumFractionDigits: 0,
  }).format(n);

const AVAILABILITY_STYLES: Record<Listing["availability"], string> = {
  available: "bg-green-100 text-green-700",
  reserved: "bg-yellow-100 text-yellow-700",
  occupied: "bg-gray-200 text-gray-700",
};

export default function ListingDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => {
      const found = MOCK_LISTINGS.find((l) => l.id === id);
      setListing(found || null);
      setLoading(false);
    }, 300);
    return () => clearTimeout(t);
  }, [id]);

  const comparison = useMemo(() => {
    if (!listing) return null;
    const sameType = MOCK_LISTINGS.filter(
      (l) => l.propertyType === listing.propertyType && l.id !== listing.id,
    );
    if (sameType.length === 0) return null;

    const avg =
      sameType.reduce((sum, l) => sum + l.pricePerMonth, 0) / sameType.length;
    const diff = listing.pricePerMonth - avg;
    const pct = Math.round((Math.abs(diff) / avg) * 100);
    const isBelow = diff < 0;

    const similar = sameType.slice(0, 3).map((l) => ({
      listing: l,
      diff: l.pricePerMonth - listing.pricePerMonth,
    }));

    return { avg, diff, pct, isBelow, similar };
  }, [listing]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white p-4">
        <Skeleton className="aspect-[4/3] w-full rounded-2xl" />
        <Skeleton className="mt-4 h-6 w-3/4" />
        <Skeleton className="mt-2 h-4 w-1/2" />
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="text-center">
          <p className="text-lg font-semibold">Listing not found</p>
          <Button onClick={() => navigate("/")} className="mt-4">
            Back to home
          </Button>
        </div>
      </div>
    );
  }

  const landlord = MOCK_LANDLORDS[listing.landlordId];
  const unitLabel = getUnitLabel(listing.propertyType, listing.availableUnits);
  const propertyTypeLabel = PROPERTY_TYPE_LABEL[listing.propertyType];
  const isFull =
    listing.availability === "occupied" || listing.availableUnits === 0;

  const openInMaps = () => {
    const { lat, lng } = listing.coordinates;
    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`,
      "_blank",
    );
  };

  return (
    <PageShell>
      <div className="sticky top-0 z-20 -mx-4 flex items-center justify-between bg-white/95 px-4 py-3 backdrop-blur">
        <button
          onClick={() => navigate(-1)}
          className="rounded-full bg-white p-2 shadow-md hover:scale-105 active:scale-95"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        {/* <div className="flex gap-2">
            <button className="rounded-full bg-white p-2 shadow-md hover:scale-105 active:scale-95">
                <Share className="h-5 w-5" />
            </button>
            <button className="rounded-full bg-white p-2 shadow-md hover:scale-105 active:scale-95">
                <Heart className="h-5 w-5" />
            </button>
            </div> */}
      </div>

      {/* Photo gallery */}
      <div className="-mx-4 -mt-14">
        <PhotoGallery
          photos={listing.photos}
          title={listing.title}
          photoSections={listing.photoSections}
        />
      </div>

      {/* HEADER */}
      <section className="mt-6">
        <Badge
          variant="outline"
          className={`rounded-full border-0 px-3 py-1 text-xs font-semibold capitalize ${
            AVAILABILITY_STYLES[listing.availability]
          }`}
        >
          {listing.availability}
        </Badge>

        <h1 className="mt-3 text-2xl leading-tight font-bold text-gray-900">
          {listing.title}
        </h1>

        <p className="mt-1 text-2xl font-bold text-green-700">
          {formatPeso(listing.pricePerMonth)}
          <span>/month</span>
        </p>

        <p className="text-muted-foreground mt-1 text-sm">
          {propertyTypeLabel} · {listing.barangay} · {listing.address}
        </p>
      </section>

      {/* KEY INFO */}
      <div className="border-border mt-4 grid grid-cols-3 gap-4 rounded-xl border p-4">
        <div>
          <p className="text-muted-foreground text-sm">Deposit</p>
          <p className="mt-1 text-base font-bold">
            {formatPeso(listing.deposit)}
          </p>
        </div>
        <div>
          <p className="text-muted-foreground text-sm">Advance</p>
          <p className="mt-1 text-base font-bold">
            {formatPeso(listing.advancePayment)}
          </p>
        </div>
        <div>
          <p className="text-muted-foreground text-sm">{unitLabel} available</p>
          <div className="mt-1 flex items-center gap-1.5">
            <BedDouble className="h-4 w-4 text-green-600" />
            <p className="text-base font-bold">{listing.availableUnits}</p>
          </div>
        </div>
      </div>

      {/* NEARBY LANDMARKS */}
      {listing.nearLandmarks.length > 0 && (
        <section className="mt-6">
          <h2 className="text-base font-bold">Nearby landmarks</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {listing.nearLandmarks.map((name) => {
              const Icon = getLandmarkIcon(name);
              return (
                <div
                  key={name}
                  className="flex items-center gap-1.5 rounded-full border border-green-200 bg-green-50 px-3 py-1.5 text-sm text-green-700"
                >
                  <MapPin className="h-3.5 w-3.5" />
                  <Icon className="h-3.5 w-3.5" />
                  <span>{name}</span>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* DESCRIPTION */}
      <section className="mt-6">
        <h2 className="text-base font-bold">Description</h2>
        <p className="mt-2 text-sm leading-relaxed text-gray-700">
          {listing.title}. Located at {listing.address}. Perfect for tenants
          looking for a place near {listing.nearLandmarks.join(", ")}. Message
          the landlord for viewing schedule.
        </p>
      </section>

      {/* AMENITIES */}
      <section className="mt-6">
        <h2 className="text-base font-bold">Amenities</h2>
        <div className="mt-3 grid grid-cols-2 gap-y-2 sm:grid-cols-3">
          {listing.amenities.map((amenity) => (
            <div key={amenity} className="flex items-center gap-2 text-sm">
              <Check className="h-4 w-4 text-green-600" strokeWidth={3} />
              <span className="text-gray-700">{amenity}</span>
            </div>
          ))}
        </div>
      </section>

      {/* HOUSE RULES */}
      <section className="mt-6">
        <h2 className="text-base font-bold">House rules</h2>
        <ul className="mt-3 space-y-2">
          {listing.houseRules.map((rule) => (
            <li key={rule} className="flex items-start gap-2 text-sm">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
              <span className="text-gray-700">{rule}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* LOCATION */}
      <section className="mt-8">
        <h2 className="text-base font-bold">Location</h2>
        <div className="border-border mt-3 aspect-[16/9] w-full overflow-hidden rounded-2xl border">
          <MapContainer
            center={[listing.coordinates.lat, listing.coordinates.lng]}
            zoom={15}
            scrollWheelZoom={false}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker
              position={[listing.coordinates.lat, listing.coordinates.lng]}
              icon={defaultIcon}
            />
          </MapContainer>
        </div>

        <div className="mt-3 space-y-2">
          <Button
            onClick={openInMaps}
            className="h-12 w-full gap-2 rounded-xl bg-green-600 text-base font-semibold text-white hover:bg-green-700"
          >
            <Navigation className="h-4 w-4" />
            Get directions
          </Button>
          <Button
            onClick={openInMaps}
            variant="outline"
            className="h-12 w-full gap-2 rounded-xl border-green-200 bg-green-50 text-base font-semibold text-green-700 hover:bg-green-100"
          >
            <ExternalLink className="h-4 w-4" />
            View on map
          </Button>
        </div>
      </section>

      {/* PRICE COMPARISON */}
      {comparison && comparison.similar.length > 0 && (
        <div className="border-border mt-8 rounded-xl border p-4">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-green-600" />
            <h2 className="text-base font-bold">Price comparison</h2>
          </div>

          <div className="mt-3 flex items-start gap-2 rounded-xl bg-gray-50 p-3 text-sm">
            {comparison.isBelow ? (
              <TrendingDown className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />
            ) : (
              <TrendingUp className="mt-0.5 h-4 w-4 shrink-0 text-orange-600" />
            )}
            <p className="text-gray-700">
              This listing is{" "}
              <span
                className={`font-bold ${
                  comparison.isBelow ? "text-green-700" : "text-orange-600"
                }`}
              >
                {comparison.pct}% {comparison.isBelow ? "below" : "above"}{" "}
                average
              </span>{" "}
              for {propertyTypeLabel}s in the area
            </p>
          </div>

          <div className="mt-4 space-y-2">
            {comparison.similar.map(({ listing: l, diff }) => (
              <div
                key={l.id}
                onClick={() => navigate(`/listing/${l.id}`)}
                className="border-border flex cursor-pointer items-center gap-3 rounded-xl border p-2.5 transition-colors hover:bg-gray-50"
              >
                <div
                  className="h-14 w-14 shrink-0 rounded-lg bg-gray-100 bg-cover bg-center"
                  style={{ backgroundImage: `url(${l.photos[0]})` }}
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{l.title}</p>
                  <p className="text-muted-foreground truncate text-xs">
                    {l.barangay} · {PROPERTY_TYPE_LABEL[l.propertyType]}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold">
                    {formatPeso(l.pricePerMonth)}/mo
                  </p>
                  <p
                    className={`text-xs font-semibold ${
                      diff > 0 ? "text-orange-600" : "text-green-700"
                    }`}
                  >
                    {diff > 0 ? "+" : ""}
                    {formatPeso(diff)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* LANDLORD */}
      {landlord && (
        <div className="border-border mt-8 rounded-xl border p-4">
          <div className="flex items-center gap-3">
            <div
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${landlord.avatarColor} text-sm font-bold text-white`}
            >
              {landlord.initials}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-1.5">
                <p className="text-base font-bold">{landlord.name}</p>
                {landlord.isVerified && (
                  <BadgeCheck className="h-4 w-4 text-green-600" />
                )}
              </div>
              <p className="text-muted-foreground text-xs">
                Joined{" "}
                {new Date(landlord.joinedAt).toLocaleDateString("en-PH", {
                  month: "short",
                  year: "numeric",
                })}
              </p>
            </div>

            {landlord.isVerified ? (
              <span className="shrink-0 rounded-full bg-green-50 px-2.5 py-1 text-[11px] font-semibold text-green-700">
                Verified
              </span>
            ) : (
              <span className="shrink-0 rounded-full bg-gray-100 px-2.5 py-1 text-[11px] font-semibold text-gray-600">
                Unverified
              </span>
            )}
          </div>

          <Separator className="my-4" />

          {!landlord.isVerified && (
            <div className="mb-4 flex items-start gap-2 rounded-lg bg-gray-50 p-3 text-xs text-gray-600">
              <Info className="h-4 w-4 shrink-0 text-gray-500" />
              <p>This landlord hasn't opted in for verification.</p>
            </div>
          )}

          <p className="text-muted-foreground text-xs font-semibold">
            Contact directly
          </p>

          <div className="mt-3 space-y-3">
            <button
              onClick={() => {
                window.location.href =
                  "tel:" + landlord.phone.replace(/\s/g, "");
              }}
              className="flex w-full items-center gap-3 text-left text-sm text-gray-700 hover:text-green-700"
            >
              <Phone className="h-4 w-4 text-green-600" />
              {landlord.phone}
            </button>
            <button
              onClick={() => {
                window.location.href = "mailto:" + landlord.email;
              }}
              className="flex w-full items-center gap-3 text-left text-sm text-gray-700 hover:text-green-700"
            >
              <Mail className="h-4 w-4 text-green-600" />
              {landlord.email}
            </button>
          </div>

          <Button
            variant="outline"
            disabled={isFull}
            className="mt-4 h-12 w-full gap-2 rounded-xl border-gray-200 text-base font-semibold hover:bg-gray-50 disabled:opacity-50"
          >
            <Calendar className="h-4 w-4" />
            Book a visit
          </Button>
        </div>
      )}

      <div className="h-20" />

      <StickyActionBar>
        <Button
          disabled={isFull}
          className="h-12 w-full gap-2 rounded-xl bg-green-600 text-base font-semibold text-white hover:bg-green-700 disabled:opacity-50"
        >
          <MessageCircle className="h-5 w-5" />
          {isFull ? "Fully occupied" : "Message landlord"}
        </Button>
      </StickyActionBar>
    </PageShell>
  );
}
