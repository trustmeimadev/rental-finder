export type PhotoSection = {
  id: string;
  label: string;
  subtitle?: string;
  photos: string[];
};
export type Listing = {
  id: string;
  title: string;
  propertyType: "boarding_house" | "apartment" | "bedspace" | "dorm" | "room";
  pricePerMonth: number;
  deposit: number;
  advancePayment: number;
  address: string;
  barangay: string;
  coordinates: { lat: number; lng: number };
  photos: string[];
  amenities: string[];
  houseRules: string[];
  nearLandmarks: string[];
  availability: "available" | "reserved" | "occupied";
  landlordId: string;
  createdAt: string;
  totalUnits: number;
  availableUnits: number;
  photoSections?: PhotoSection[];
};



export const MOCK_LISTINGS: Listing[] = [
  {
    id: "1",
    title: "Cozy bedspace near Dolefil Cannery",
    propertyType: "bedspace",
    pricePerMonth: 2500,
    deposit: 2500,
    advancePayment: 2500,
    address: "Purok 5, Cannery Site",
    barangay: "Cannery Site",
    coordinates: { lat: 6.2158, lng: 125.0678 },
    photos: ["https://picsum.photos/seed/rp1/400/500"],
    amenities: ["Wi-Fi", "Water", "Electricity"],
    houseRules: ["No smoking", "No pets"],
    nearLandmarks: ["Cannery Site"],
    availability: "available",
    landlordId: "l1",
    // landlordVerified: true,
    createdAt: "2026-06-01",
    totalUnits: 10,
    availableUnits: 5,
  },
  {
    id: "2",
    title: "Student boarding house — Notre Dame area",
    propertyType: "boarding_house",
    pricePerMonth: 3200,
    deposit: 3200,
    advancePayment: 3200,
    address: "Notre Dame St, Poblacion",
    barangay: "Poblacion",
    coordinates: { lat: 6.2225, lng: 125.0662 },
    photos: ["https://picsum.photos/seed/rp2/400/500"],
    amenities: ["Wi-Fi", "Kitchen", "Laundry"],
    houseRules: ["Curfew 10pm"],
    nearLandmarks: ["Notre Dame-Siena", "Poblacion"],
    availability: "available",
    landlordId: "l2",
    // landlordVerified: true,
    createdAt: "2026-06-05",
    totalUnits: 8,
    availableUnits: 3,
  },
  {
    id: "3",
    title: "Private room near Public Market",
    propertyType: "room",
    pricePerMonth: 4500,
    deposit: 4500,
    advancePayment: 4500,
    address: "Rizal Ave, Poblacion",
    barangay: "Poblacion",
    coordinates: { lat: 6.2231, lng: 125.0641 },
    photos: ["https://picsum.photos/seed/rp3/400/500"],
    amenities: ["Wi-Fi", "Aircon", "Private CR"],
    houseRules: ["No overnight guests"],
    nearLandmarks: ["Public Market", "Poblacion"],
    availability: "available",
    landlordId: "l1",
    // landlordVerified: true,
    createdAt: "2026-06-10",
    totalUnits: 5,
    availableUnits: 2,

    photoSections: [
      {
        id: "living",
        label: "Living room",
        subtitle: "Sofa · Air conditioning",
        photos: [
          "https://picsum.photos/seed/rp3la/600/600",
          "https://picsum.photos/seed/rp3lb/600/600",
          "https://picsum.photos/seed/rp3lc/600/600",
          "https://picsum.photos/seed/rp3ld/600/600",
          "https://picsum.photos/seed/rp3le/600/600",
          "https://picsum.photos/seed/rp3lf/600/600",
        ],
      },
      {
        id: "kitchen",
        label: "Kitchen",
        subtitle: "Stove · Mini fridge · Rice cooker",
        photos: [
          "https://picsum.photos/seed/rp3ka/600/600",
          "https://picsum.photos/seed/rp3kb/600/600",
          "https://picsum.photos/seed/rp3kc/600/600",
          "https://picsum.photos/seed/rp3kd/600/600",
        ],
      },
      {
        id: "bedroom",
        label: "Bedroom",
        subtitle: "2 single beds · Wardrobe",
        photos: [
          "https://picsum.photos/seed/rp3ba/600/600",
          "https://picsum.photos/seed/rp3bb/600/600",
          "https://picsum.photos/seed/rp3bc/600/600",
          "https://picsum.photos/seed/rp3bd/600/600",
          "https://picsum.photos/seed/rp3be/600/600",
          "https://picsum.photos/seed/rp3bf/600/600",
        ],
      },
      {
        id: "bathroom",
        label: "Bathroom",
        subtitle: "Shower · Hot water",
        photos: [
          "https://picsum.photos/seed/rp3wa/600/600",
          "https://picsum.photos/seed/rp3wb/600/600",
          "https://picsum.photos/seed/rp3wc/600/600",
        ],
      },
    ],
  },
  {
    id: "4",
    title: "2BR apartment for professionals",
    propertyType: "apartment",
    pricePerMonth: 8500,
    deposit: 8500,
    advancePayment: 17000,
    address: "Maharlika Highway, Cannery Site",
    barangay: "Cannery Site",
    coordinates: { lat: 6.2149, lng: 125.0691 },
    photos: ["https://picsum.photos/seed/rp4/400/500"],
    amenities: ["Wi-Fi", "Aircon", "Kitchen", "Parking"],
    houseRules: ["No loud parties"],
    nearLandmarks: ["Cannery Site"],
    availability: "available",
    landlordId: "l3",
    // landlordVerified: false,
    createdAt: "2026-06-15",
    totalUnits: 3,
    availableUnits: 1,
  },
  {
    id: "5",
    title: "Affordable dorm — walk to Notre Dame",
    propertyType: "dorm",
    pricePerMonth: 1800,
    deposit: 1800,
    advancePayment: 1800,
    address: "San Lorenzo St, Poblacion",
    barangay: "Poblacion",
    coordinates: { lat: 6.2218, lng: 125.0658 },
    photos: ["https://picsum.photos/seed/rp5/400/500"],
    amenities: ["Wi-Fi", "Water"],
    houseRules: ["Girls only"],
    nearLandmarks: ["Notre Dame-Siena"],
    availability: "available",
    landlordId: "l2",
    // landlordVerified: true,
    createdAt: "2026-06-20",
    totalUnits: 12,
    availableUnits: 6,
  },
  {
    id: "6",
    title: "Bedspace with meals included",
    propertyType: "bedspace",
    pricePerMonth: 3500,
    deposit: 3500,
    advancePayment: 3500,
    address: "Cannery Rd, Cannery Site",
    barangay: "Cannery Site",
    coordinates: { lat: 6.2162, lng: 125.0682 },
    photos: ["https://picsum.photos/seed/rp6/400/500"],
    amenities: ["Wi-Fi", "Meals", "Laundry"],
    houseRules: ["No smoking"],
    nearLandmarks: ["Cannery Site"],
    availability: "available",
    landlordId: "l1",
    // landlordVerified: true,
    createdAt: "2026-06-25",
    totalUnits: 6,
    availableUnits: 2,
  },
];
