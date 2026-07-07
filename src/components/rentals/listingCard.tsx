import { CheckCircle2, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getUnitLabel } from "@/lib/unitLabel";
import type { Listing } from "@/mocks/listings";
import { MOCK_LANDLORDS } from "@/mocks/landlords";
import { useWishlist } from "@/hooks/useWishList";

type Props = { listing: Listing };

const PROPERTY_TYPE_LABEL: Record<Listing["propertyType"], string> = {
  boarding_house: "Boarding house",
  apartment: "Apartment",
  bedspace: "Bedspace",
  dorm: "Dorm",
  room: "Room",
};

export default function ListingCard({ listing }: Props) {
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite } = useWishlist();

  const price = new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    maximumFractionDigits: 0,
  }).format(listing.pricePerMonth);

  const unitLabel = getUnitLabel(listing.propertyType, listing.availableUnits);
  const propertyTypeLabel = PROPERTY_TYPE_LABEL[listing.propertyType];
  const isFull = listing.availableUnits === 0;
  const favorited = isFavorite(listing.id);

  const landlord = MOCK_LANDLORDS[listing.landlordId];
  const isVerified = landlord?.isVerified ?? false;

  const handleHeartClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(listing.id);
  };

  return (
    <div
      onClick={() => navigate(`/listing/${listing.id}`)}
      className="group cursor-pointer"
    >
      <div
        className="relative aspect-square w-full overflow-hidden rounded-2xl bg-muted bg-cover bg-center transition-transform active:scale-[0.98]"
        style={{ backgroundImage: `url(${listing.photos[0]})` }}
      >
        {isVerified && (
          <div className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-white/95 px-2 py-0.5 shadow-sm">
            <CheckCircle2 className="h-3 w-3 text-green-600" />
            <span className="text-[10px] font-semibold text-gray-900">
              Verified
            </span>
          </div>
        )}

        <button
          onClick={handleHeartClick}
          aria-label={favorited ? "Remove from wishlist" : "Add to wishlist"}
          className="absolute right-2 top-2 transition-transform active:scale-90"
        >
          <Heart
            className={`h-4 w-4 transition-colors ${favorited
              ? "fill-red-500 text-red-500"
              : "fill-black/25 text-white"
              }`}
            strokeWidth={2.25}
          />
        </button>
      </div>

      <div className="mt-1">
        <h3 className="text-[13px] font-medium leading-snug text-gray-900 line-clamp-1">
          {listing.title}
        </h3>

        <p className="text-[12px] text-gray-500">
          {propertyTypeLabel} · {listing.barangay}
        </p>

        <p className="flex items-baseline gap-1 text-[13px]">
          <span className="font-bold text-gray-900">{price}</span>
          <span className="text-[11px] text-gray-500">/month</span>
          {!isFull && (
            <>
              <span className="text-gray-300">·</span>
              <span className="text-[11px] text-gray-500">
                {listing.availableUnits} {unitLabel} left
              </span>
            </>
          )}
          {isFull && (
            <>
              <span className="text-gray-300">·</span>
              <span className="text-[11px] font-medium text-red-500">Full</span>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
