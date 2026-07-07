import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Plus, X, Check } from "lucide-react";
import { Switch } from "@/components/ui/switch";

const DEFAULT_PROPERTY_TYPES = [
  "Apartment",
  "Boarding",
  "Room",
  "Bedspace",
  "Dorm",
];

const DEFAULT_LANDMARKS = [
  "Cannery Site",
  "Poblacion",
  "Notre Dame-Siena",
  "Public Market",
];

const DEFAULT_AMENITIES = [
  "Wi-Fi",
  "Aircon",
  "Kitchen",
  "Private CR",
  "Parking",
  "Laundry",
  "Meals",
];

const DEFAULT_CAPACITY = ["1", "2", "3", "4", "5+"];
const DEFAULT_RATINGS = ["3.0+", "3.5+", "4.0+", "4.5+", "5.0"];

const MIN_PRICE = 0;
const MAX_PRICE = 30000;
const PRICE_STEP = 500;

const formatPeso = (n: number) =>
  new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    maximumFractionDigits: 0,
  }).format(n);

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

type TagSectionProps = {
  title: string;
  presets: string[];
  selected: string[];
  onToggle: (v: string) => void;
  placeholder: string;
  subtitle?: string;
};

function TagSection({
  title,
  presets,
  selected,
  onToggle,
  placeholder,
  subtitle,
}: TagSectionProps) {
  const [customValue, setCustomValue] = useState("");
  const [customTags, setCustomTags] = useState<string[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isAdding && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isAdding]);

  const handleAdd = () => {
    const v = customValue.trim();
    if (!v) {
      setIsAdding(false);
      return;
    }
    if (customTags.includes(v) || presets.includes(v)) {
      setCustomValue("");
      setIsAdding(false);
      return;
    }
    setCustomTags((prev) => [...prev, v]);
    onToggle(v);
    setCustomValue("");
    setIsAdding(false);
  };

  const handleCancel = () => {
    setCustomValue("");
    setIsAdding(false);
  };

  const handleRemoveCustom = (tag: string) => {
    setCustomTags((prev) => prev.filter((t) => t !== tag));
    if (selected.includes(tag)) onToggle(tag);
  };

  const allTags = [...presets, ...customTags];

  return (
    <div>
      <div className="flex items-baseline justify-between">
        <h3 className="text-xs font-bold text-gray-900">{title}</h3>
        {subtitle && <p className="text-[10px] text-gray-500">{subtitle}</p>}
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-1.5">
        {allTags.map((tag) => {
          const isSelected = selected.includes(tag);
          const isCustom = customTags.includes(tag);
          return (
            <button
              key={tag}
              onClick={() => onToggle(tag)}
              className={`group flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-semibold transition-colors ${
                isSelected
                  ? "border-green-600 bg-green-50 text-green-700"
                  : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
              }`}
            >
              {tag}
              {isCustom && (
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveCustom(tag);
                  }}
                  className="ml-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full hover:bg-gray-200"
                >
                  <X className="h-2.5 w-2.5" />
                </span>
              )}
            </button>
          );
        })}

        {isAdding ? (
          <div className="flex items-center gap-1 rounded-full border border-green-500 bg-white px-2 py-0.5 shadow-sm">
            <Input
              ref={inputRef}
              type="text"
              value={customValue}
              onChange={(e) => setCustomValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAdd();
                }
                if (e.key === "Escape") handleCancel();
              }}
              onBlur={() => {
                // Small delay so button clicks register
                setTimeout(() => {
                  if (customValue.trim()) handleAdd();
                  else handleCancel();
                }, 150);
              }}
              placeholder={placeholder}
              className="h-6 w-32 border-0 bg-transparent p-0 text-[11px] font-semibold shadow-none placeholder:text-gray-400 focus-visible:ring-0"
            />
            <button
              onMouseDown={(e) => e.preventDefault()}
              onClick={handleAdd}
              className="flex h-4 w-4 items-center justify-center rounded-full bg-green-600 text-white hover:bg-green-700"
            >
              <Check className="h-2.5 w-2.5" strokeWidth={3} />
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-0.5 rounded-full border border-dashed border-gray-300 px-2.5 py-1 text-[11px] font-semibold text-gray-500 hover:border-green-500 hover:text-green-700"
          >
            <Plus className="h-3 w-3" strokeWidth={2.5} />
          </button>
        )}
      </div>
    </div>
  );
}

export default function SearchFilters({ open, onOpenChange }: Props) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([
    MIN_PRICE,
    MAX_PRICE,
  ]);
  const [minPriceInput, setMinPriceInput] = useState(String(MIN_PRICE));
  const [maxPriceInput, setMaxPriceInput] = useState(String(MAX_PRICE));
  const [selectedLandmarks, setSelectedLandmarks] = useState<string[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [selectedCapacity, setSelectedCapacity] = useState<string[]>([]);
  const [selectedRating, setSelectedRating] = useState<string[]>([]);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [availableOnly, setAvailableOnly] = useState(true);

  useEffect(() => {
    if (!open) return;
    const types = searchParams.get("types");
    setSelectedTypes(types ? types.split(",") : []);

    const minP = Number(searchParams.get("minPrice")) || MIN_PRICE;
    const maxP = Number(searchParams.get("maxPrice")) || MAX_PRICE;
    setPriceRange([minP, maxP]);
    setMinPriceInput(String(minP));
    setMaxPriceInput(String(maxP));

    const landmarks = searchParams.get("landmarks");
    setSelectedLandmarks(landmarks ? landmarks.split(",") : []);
    const amenities = searchParams.get("amenities");
    setSelectedAmenities(amenities ? amenities.split(",") : []);
    const capacity = searchParams.get("capacity");
    setSelectedCapacity(capacity ? capacity.split(",") : []);
    const rating = searchParams.get("rating");
    setSelectedRating(rating ? rating.split(",") : []);
    setVerifiedOnly(searchParams.get("verified") === "1");
    setAvailableOnly(searchParams.get("available") !== "0");
  }, [open, searchParams]);

  const toggle = (
    setter: (fn: (prev: string[]) => string[]) => void,
    value: string,
  ) => {
    setter((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
    );
  };

  const handleSliderChange = (v: number | readonly number[]) => {
    if (!Array.isArray(v)) return;
    const range = v as [number, number];
    setPriceRange(range);
    setMinPriceInput(String(range[0]));
    setMaxPriceInput(String(range[1]));
  };

  const commitMinPrice = () => {
    let n = Number(minPriceInput.replace(/[^\d]/g, ""));
    if (isNaN(n) || n < MIN_PRICE) n = MIN_PRICE;
    if (n > priceRange[1]) n = priceRange[1];
    setPriceRange([n, priceRange[1]]);
    setMinPriceInput(String(n));
  };

  const commitMaxPrice = () => {
    let n = Number(maxPriceInput.replace(/[^\d]/g, ""));
    if (isNaN(n) || n < priceRange[0]) n = priceRange[0];
    if (n > MAX_PRICE) n = MAX_PRICE;
    setPriceRange([priceRange[0], n]);
    setMaxPriceInput(String(n));
  };

  const handleClear = () => {
    setSelectedTypes([]);
    setPriceRange([MIN_PRICE, MAX_PRICE]);
    setMinPriceInput(String(MIN_PRICE));
    setMaxPriceInput(String(MAX_PRICE));
    setSelectedLandmarks([]);
    setSelectedAmenities([]);
    setSelectedCapacity([]);
    setSelectedRating([]);
    setVerifiedOnly(false);
    setAvailableOnly(true);
  };

  const handleApply = () => {
    const params = new URLSearchParams(searchParams);

    if (selectedTypes.length > 0) params.set("types", selectedTypes.join(","));
    else params.delete("types");
    if (priceRange[0] > MIN_PRICE)
      params.set("minPrice", String(priceRange[0]));
    else params.delete("minPrice");
    if (priceRange[1] < MAX_PRICE)
      params.set("maxPrice", String(priceRange[1]));
    else params.delete("maxPrice");
    if (selectedLandmarks.length > 0)
      params.set("landmarks", selectedLandmarks.join(","));
    else params.delete("landmarks");
    if (selectedAmenities.length > 0)
      params.set("amenities", selectedAmenities.join(","));
    else params.delete("amenities");
    if (selectedCapacity.length > 0)
      params.set("capacity", selectedCapacity.join(","));
    else params.delete("capacity");
    if (selectedRating.length > 0)
      params.set("rating", selectedRating.join(","));
    else params.delete("rating");
    if (verifiedOnly) params.set("verified", "1");
    else params.delete("verified");
    if (!availableOnly) params.set("available", "0");
    else params.delete("available");

    navigate(`/search?${params.toString()}`);
    onOpenChange(false);
  };

  const priceChanged = priceRange[0] > MIN_PRICE || priceRange[1] < MAX_PRICE;

  const activeCount =
    selectedTypes.length +
    (priceChanged ? 1 : 0) +
    selectedLandmarks.length +
    selectedAmenities.length +
    selectedCapacity.length +
    selectedRating.length +
    (verifiedOnly ? 1 : 0);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="flex w-full flex-col overflow-hidden p-0 sm:max-w-md"
      >
        <SheetHeader className="border-b border-gray-100 px-4 py-3 text-left">
          <SheetTitle className="text-base font-bold">Filters</SheetTitle>
        </SheetHeader>

        <div className="flex-1 space-y-5 overflow-y-auto px-4 py-4">
          <TagSection
            title="Property type"
            presets={DEFAULT_PROPERTY_TYPES}
            selected={selectedTypes}
            onToggle={(v) => toggle(setSelectedTypes, v)}
            placeholder="Studio, Condo..."
          />

          {/* Price range */}
          <div>
            <div className="flex items-baseline justify-between">
              <h3 className="text-xs font-bold text-gray-900">Price range</h3>
              <p className="text-[10px] text-gray-500">Per month</p>
            </div>

            <div className="mt-2 flex items-center gap-2">
              <div className="flex-1">
                <p className="text-[10px] text-gray-500">Min</p>
                <div className="mt-0.5 flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-2 focus-within:border-green-500">
                  <span className="text-xs text-gray-500">₱</span>
                  <Input
                    type="text"
                    inputMode="numeric"
                    value={minPriceInput}
                    onChange={(e) =>
                      setMinPriceInput(e.target.value.replace(/[^\d]/g, ""))
                    }
                    onBlur={commitMinPrice}
                    onKeyDown={(e) =>
                      e.key === "Enter" &&
                      (e.currentTarget.blur(), commitMinPrice())
                    }
                    className="h-8 border-0 bg-transparent px-0 text-xs font-bold shadow-none focus-visible:ring-0"
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="mt-4 text-gray-300">—</div>

              <div className="flex-1">
                <p className="text-[10px] text-gray-500">Max</p>
                <div className="mt-0.5 flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-2 focus-within:border-green-500">
                  <span className="text-xs text-gray-500">₱</span>
                  <Input
                    type="text"
                    inputMode="numeric"
                    value={maxPriceInput}
                    onChange={(e) =>
                      setMaxPriceInput(e.target.value.replace(/[^\d]/g, ""))
                    }
                    onBlur={commitMaxPrice}
                    onKeyDown={(e) =>
                      e.key === "Enter" &&
                      (e.currentTarget.blur(), commitMaxPrice())
                    }
                    className="h-8 border-0 bg-transparent px-0 text-xs font-bold shadow-none focus-visible:ring-0"
                    placeholder="30000"
                  />
                </div>
              </div>
            </div>

            <Slider
              min={MIN_PRICE}
              max={MAX_PRICE}
              step={PRICE_STEP}
              value={priceRange}
              onValueChange={handleSliderChange}
              className="mt-4"
            />

            <div className="mt-1.5 flex justify-between text-[10px] text-gray-400">
              <span>{formatPeso(MIN_PRICE)}</span>
              <span>{formatPeso(MAX_PRICE)}+</span>
            </div>
          </div>

          <TagSection
            title="Near landmark"
            presets={DEFAULT_LANDMARKS}
            selected={selectedLandmarks}
            onToggle={(v) => toggle(setSelectedLandmarks, v)}
            placeholder="City Hall, Terminal..."
          />

          <TagSection
            title="Must include"
            presets={DEFAULT_AMENITIES}
            selected={selectedAmenities}
            onToggle={(v) => toggle(setSelectedAmenities, v)}
            placeholder="Balcony, Rooftop..."
          />

          <div className="grid grid-cols-2 gap-4">
            <TagSection
              title="Capacity"
              presets={DEFAULT_CAPACITY}
              selected={selectedCapacity}
              onToggle={(v) => toggle(setSelectedCapacity, v)}
              placeholder="6, 8..."
            />

            <TagSection
              title="Min rating"
              presets={DEFAULT_RATINGS}
              selected={selectedRating}
              onToggle={(v) => toggle(setSelectedRating, v)}
              placeholder="3.8+"
            />
          </div>

          {/* Preferences */}
          {/* Preferences */}
          <div className="space-y-3 border-t border-gray-100 pt-4">
            <div className="flex items-center justify-between gap-3">
              <label htmlFor="verified-toggle" className="cursor-pointer">
                <p className="text-xs font-semibold text-gray-900">
                  Verified landlords only
                </p>
                <p className="text-[10px] text-gray-500">
                  Trusted property owners
                </p>
              </label>
              <Switch
                id="verified-toggle"
                checked={verifiedOnly}
                onCheckedChange={setVerifiedOnly}
                className="data-[state=checked]:bg-green-600"
              />
            </div>

            <div className="flex items-center justify-between gap-3">
              <label htmlFor="available-toggle" className="cursor-pointer">
                <p className="text-xs font-semibold text-gray-900">
                  Available now
                </p>
                <p className="text-[10px] text-gray-500">
                  Hide occupied listings
                </p>
              </label>
              <Switch
                id="available-toggle"
                checked={availableOnly}
                onCheckedChange={setAvailableOnly}
                className="data-[state=checked]:bg-green-600"
              />
            </div>
          </div>
        </div>

        <SheetFooter className="border-t border-gray-100 bg-white px-4 py-3">
          <div className="flex w-full gap-2">
            <Button
              onClick={handleClear}
              variant="ghost"
              className="h-10 flex-1 rounded-lg text-xs font-semibold text-gray-700 hover:bg-gray-100"
            >
              Clear all
            </Button>
            <Button
              onClick={handleApply}
              className="h-10 flex-1 rounded-lg bg-green-600 text-xs font-semibold text-white hover:bg-green-700"
            >
              Show results
              {activeCount > 0 && ` (${activeCount})`}
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
