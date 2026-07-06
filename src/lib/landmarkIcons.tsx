
import { Building2, GraduationCap, Landmark, ShoppingCart, MapPin } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export const LANDMARK_ICONS: Record<string, LucideIcon> = {
  "Cannery Site": Building2,
  "Notre Dame-Siena": GraduationCap,
  "Poblacion": Landmark,
  "Public Market": ShoppingCart,
};

export function getLandmarkIcon(name: string): LucideIcon {
  return LANDMARK_ICONS[name] || MapPin;
}