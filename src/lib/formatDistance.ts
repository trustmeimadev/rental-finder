export function formatDistance(km: number): string {
  if (km < 1) return `${Math.round(km * 1000)} m away`;
  return `${km.toFixed(1)} km away`;
}

// Walking: ~5 km/h (average pace)
export function walkingTime(km: number): string {
  const minutes = Math.round((km / 5) * 60);
  if (minutes < 1) return "<1 min walk";
  return `${minutes} min walk`;
}

// Tricycle: ~20 km/h (local PH context, traffic-adjusted)
export function tricycleTime(km: number): string {
  const minutes = Math.round((km / 20) * 60);
  if (minutes < 1) return "<1 min tricycle";
  return `${minutes} min tricycle`;
}

// Motorcycle: ~30 km/h (urban traffic)
export function motorcycleTime(km: number): string {
  const minutes = Math.round((km / 30) * 60);
  if (minutes < 1) return "<1 min motor";
  return `${minutes} min motor`;
}

// Car: ~25 km/h (urban traffic, slower than motor due to traffic)
export function carTime(km: number): string {
  const minutes = Math.round((km / 25) * 60);
  if (minutes < 1) return "<1 min drive";
  return `${minutes} min drive`;
}

// All-in-one: pick the most sensible mode based on distance
export function bestTravelTime(km: number): string {
  if (km <= 1) return walkingTime(km);
  if (km <= 3) return tricycleTime(km);
  return motorcycleTime(km);
}

// Get all modes for a distance (useful for detailed display)
export function allTravelTimes(km: number) {
  return {
    walk: walkingTime(km),
    tricycle: tricycleTime(km),
    motor: motorcycleTime(km),
    car: carTime(km),
  };
}