import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  BadgeCheck,
  //   MapPin,
  Info,
  BedDouble,
  Phone,
  Mail,
  Calendar,
  Check,
  ShieldCheck,
  Navigation,
  ExternalLink,
  //   BarChart3,
  //   TrendingDown,
  //   TrendingUp,
  PersonStanding,
  Bike,
  Car,
  MessageCircle,
  Users,
  Ruler,
  Maximize2,
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
import {
  formatDistance,
  walkingTime,
  motorcycleTime,
  carTime,
} from "@/lib/formatDistance";
import PriceComparison from "@/components/rentals/priceComparison";

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

// Reusable divider between major groups
function GroupDivider() {
  return <div className="border-border mt-10 border-t pt-8" />;
}

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
      {/* Top bar */}
      <div className="sticky top-0 z-20 -mx-4 flex items-center justify-between bg-white/95 px-4 py-3 backdrop-blur">
        <button
          onClick={() => navigate(-1)}
          className="rounded-full bg-white p-2 shadow-md hover:scale-105 active:scale-95"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
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
          <span className="text-lg">/month</span>
        </p>

        <p className="text-muted-foreground mt-1 text-sm">
          {propertyTypeLabel} · {listing.barangay} · {listing.address}
        </p>
      </section>

      {/* ==================== GROUP 1: ABOUT THE ROOM ==================== */}

      {/* Description */}
      <section className="mt-8">
        <h2 className="text-base font-bold">Description</h2>
        <p className="mt-2 text-sm leading-relaxed text-gray-700">
          {listing.title}. Located at {listing.address}. Perfect for tenants
          looking for a place near {listing.nearLandmarks.join(", ")}. Message
          the landlord for viewing schedule.
        </p>
      </section>

      {/* Room specifications */}
      {listing.roomSpecifications && (
        <section className="mt-6">
          <h2 className="text-base font-bold">Room specifications</h2>
          <div className="border-border mt-3 grid grid-cols-3 gap-4 rounded-xl border p-4">
            <div>
              <p className="text-muted-foreground text-xs">Deposit</p>
              <p className="mt-1 text-base font-bold">
                {formatPeso(listing.deposit)}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Advance</p>
              <p className="mt-1 text-base font-bold">
                {formatPeso(listing.advancePayment)}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">
                {unitLabel} available
              </p>
              <p className="mt-1 flex items-center gap-1 text-base font-bold">
                <BedDouble className="h-4 w-4 text-green-600" />
                {listing.availableUnits}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Capacity</p>
              <p className="mt-1 flex items-center gap-1 text-base font-bold">
                <Users className="h-4 w-4 text-green-600" />
                {listing.roomSpecifications.capacity}{" "}
                <span className="text-muted-foreground text-xs font-normal">
                  {listing.roomSpecifications.capacity === 1
                    ? "person"
                    : "people"}
                </span>
              </p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Floor area</p>
              <p className="mt-1 flex items-center gap-1 text-base font-bold">
                <Ruler className="h-4 w-4 text-green-600" />
                {listing.roomSpecifications.floorArea}
                <span className="text-muted-foreground text-xs font-normal">
                  m²
                </span>
              </p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Room size</p>
              <p className="mt-1 flex items-center gap-1 text-base font-bold">
                <Maximize2 className="h-4 w-4 text-green-600" />
                {listing.roomSpecifications.roomSize}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Amenities */}
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

      {/* Room materials */}
      {listing.roomMaterials && listing.roomMaterials.length > 0 && (
        <section className="mt-6">
          <h2 className="text-base font-bold">Room materials</h2>
          <div className="mt-3 grid grid-cols-2 gap-y-2 sm:grid-cols-3">
            {listing.roomMaterials.map((item) => (
              <div key={item} className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-green-600" strokeWidth={3} />
                <span className="text-gray-700">{item}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Inclusions */}
      {listing.inclusions && listing.inclusions.length > 0 && (
        <section className="mt-6">
          <h2 className="text-base font-bold">Inclusions</h2>
          <div className="mt-3 grid grid-cols-2 gap-y-2 sm:grid-cols-3">
            {listing.inclusions.map((item) => (
              <div key={item} className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-green-600" strokeWidth={3} />
                <span className="text-gray-700">{item}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ==================== GROUP 2: RULES & EXTRAS ==================== */}
      <GroupDivider />

      {/* House rules */}
      <section>
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

      {/* Good to know */}
      {listing.others && listing.others.length > 0 && (
        <section className="mt-6">
          <h2 className="text-base font-bold">Good to know</h2>
          <ul className="mt-3 space-y-2">
            {listing.others.map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm">
                <Check
                  className="mt-0.5 h-4 w-4 shrink-0 text-green-600"
                  strokeWidth={3}
                />
                <span className="text-gray-700">{item}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Nearby landmarks */}
      {listing.nearLandmarks.length > 0 && (
        <section className="mt-6">
          <h2 className="text-base font-bold">Nearby Landmarks</h2>
          <p className="text-muted-foreground mt-1 text-xs">
            Approximate distances from this location
          </p>
          <div className="mt-3 space-y-2">
            {listing.nearLandmarks.map(({ name, distance }) => {
              const Icon = getLandmarkIcon(name);
              return (
                <div key={name} className="border-border rounded-xl border p-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-50">
                      <Icon className="h-4 w-4 text-green-700" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-gray-900">
                        {name}
                      </p>
                      <p className="text-muted-foreground text-xs">
                        {formatDistance(distance)}
                      </p>
                    </div>
                  </div>

                  {/* Travel modes */}
                  <div className="border-border text-muted-foreground mt-3 flex flex-wrap gap-3 border-t pt-3 text-xs">
                    <span className="flex items-center gap-1">
                      <PersonStanding className="h-3.5 w-3.5" />
                      {walkingTime(distance)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Bike className="h-3.5 w-3.5" />
                      {motorcycleTime(distance)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Car className="h-3.5 w-3.5" />
                      {carTime(distance)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ==================== GROUP 3: WHERE ==================== */}
      <GroupDivider />

      <section>
        <h2 className="text-base font-bold">Location</h2>
        <p className="text-muted-foreground mt-1 text-sm">{listing.address}</p>

        <div className="border-border mt-4 aspect-[16/9] w-full overflow-hidden rounded-2xl border">
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

      <GroupDivider />

      <PriceComparison listing={listing} />

      {/* ==================== GROUP 4: LANDLORD ==================== */}
      {landlord && (
        <>
          <GroupDivider />
          <section>
            <h2 className="text-base font-bold">Meet your landlord</h2>
            <div className="border-border mt-3 rounded-xl border p-4">
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
          </section>
        </>
      )}

      {/* ==================== GROUP 5: COMPARE ==================== */}

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
