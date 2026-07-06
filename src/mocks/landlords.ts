// src/mocks/landlords.ts
export type Landlord = {
  id: string;
  name: string;
  phone: string;
  email: string;
  initials: string;
  avatarColor: string;
  joinedAt: string;
  isVerified?: boolean; // Optional property to indicate if the landlord is verified
};

export const MOCK_LANDLORDS: Record<string, Landlord> = {
  l1: {
    id: "l1",
    name: "Dela Cruz Boarding",
    phone: "0917 234 5678",
    email: "rentals@delacruz.ph",
    initials: "DB",
    avatarColor: "bg-red-500",
    joinedAt: "2026-07-01",
    isVerified: true, 
  },
  l2: {
    id: "l2",
    name: "Reyes Residences",
    phone: "0918 456 7890",
    email: "info@reyesresidences.ph",
    initials: "RR",
    avatarColor: "bg-blue-500",
    joinedAt: "2026-06-15",
    isVerified: false,
  },
  l3: {
    id: "l3",
    name: "Santos Property",
    phone: "0920 111 2222",
    email: "hello@santosproperty.ph",
    initials: "SP",
    avatarColor: "bg-purple-500",
    joinedAt: "2026-05-20",
    isVerified: false,
  },
};