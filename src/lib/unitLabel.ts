
import type { Listing } from "@/mocks/listings";

export function getUnitLabel(propertyType: Listing["propertyType"], count: number) {
  const isPlural = count !== 1;
  switch (propertyType) {
    case "bedspace":
    case "dorm":
      return isPlural ? "beds" : "bed";
    case "boarding_house":
      return isPlural ? "rooms" : "room";
    case "apartment":
      return isPlural ? "units" : "unit";
    case "room":
    default:
      return isPlural ? "rooms" : "room";
  }
}