import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { TrendingDown, TrendingUp } from "lucide-react";
import { MOCK_LISTINGS, type Listing } from "@/mocks/listings";

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

type Props = {
  listing: Listing;
  limit?: number;
};

export default function PriceComparison({ listing, limit = 3 }: Props) {
  const navigate = useNavigate();

  const comparison = useMemo(() => {
    const sameType = MOCK_LISTINGS.filter(
      (l) => l.propertyType === listing.propertyType && l.id !== listing.id,
    );
    if (sameType.length === 0) return null;

    const avg =
      sameType.reduce((sum, l) => sum + l.pricePerMonth, 0) / sameType.length;
    const diff = listing.pricePerMonth - avg;
    const pct = Math.round((Math.abs(diff) / avg) * 100);
    const isBelow = diff < 0;

    const similar = sameType.slice(0, limit).map((l) => ({
      listing: l,
      diff: l.pricePerMonth - listing.pricePerMonth,
    }));

    return { avg, diff, pct, isBelow, similar };
  }, [listing, limit]);

  if (!comparison || comparison.similar.length === 0) return null;

  const propertyTypeLabel = PROPERTY_TYPE_LABEL[listing.propertyType];

  return (
    <section>
      <h2 className="text-base font-bold">Price comparison</h2>

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
            {comparison.pct}% {comparison.isBelow ? "below" : "above"} average
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
    </section>
  );
}