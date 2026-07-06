import { CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { getUnitLabel } from "@/lib/unitLabel";
import type { Listing } from "@/mocks/listings";
import { MOCK_LANDLORDS } from "@/mocks/landlords";

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

  const price = new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    maximumFractionDigits: 0,
  }).format(listing.pricePerMonth);

  const unitLabel = getUnitLabel(listing.propertyType, listing.availableUnits);
  const propertyTypeLabel = PROPERTY_TYPE_LABEL[listing.propertyType];
  const isFull = listing.availableUnits === 0;

  
const landlord = MOCK_LANDLORDS[listing.landlordId];
const isVerified = landlord?.isVerified ?? false;


  return (
    <div
      onClick={() => navigate(`/listing/${listing.id}`)}
      className="group cursor-pointer"
    >
      {/* Image container — square, rounded, no card border */}
      <div
        className="relative aspect-square w-full overflow-hidden rounded-2xl bg-muted bg-cover bg-center transition-transform active:scale-[0.98]"
        style={{ backgroundImage: `url(${listing.photos[0]})` }}
      >
        {/* Top-left badge */}
        {isVerified && (
          <Badge className="absolute left-2.5 top-2.5 gap-1 rounded-full bg-white px-2.5 py-0.5 text-[11px] font-semibold text-gray-900 shadow-sm hover:bg-white">
            <CheckCircle2 className="h-2.5 w-2.5 text-green-600" />
            Verified
          </Badge>
        )}

        
      </div>

      {/* Text below image */}
      <div className="mt-2">
        <h3 className="text-sm font-semibold leading-tight text-gray-900 line-clamp-1">
          {listing.title}
        </h3>

        <p className="mt-0.5 text-xs text-muted-foreground">
          {propertyTypeLabel} · {listing.barangay}
        </p>

        <p className="mt-0.5 text-xs text-gray-900">
          <span className="font-semibold">{price}</span>
          <span className="text-muted-foreground"> /month</span>
          {!isFull && (
            <>
              <span className="mx-1 text-muted-foreground">·</span>
              <span className="text-muted-foreground">
                {listing.availableUnits} {unitLabel} left
              </span>
            </>
          )}
          {isFull && (
            <>
              <span className="mx-1 text-muted-foreground">·</span>
              <span className="text-muted-foreground">Full</span>
            </>
          )}
        </p>
      </div>
    </div>
  );
}