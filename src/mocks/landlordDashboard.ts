export type SubscriptionState =
  | { status: "free" }
  | { status: "trial"; daysLeft: number; endsAt: string }
  | { status: "active"; endsAt: string }
  | { status: "expired"; endedAt: string };

export type LandlordStats = {
  totalListings: number;
  activeInquiries: number;
  activeTenants: number;
  monthlyRevenue: number;
  totalViews: number;
};

export type DashboardData = {
  landlordName: string;
  subscription: SubscriptionState;
  isVerified: boolean;
  stats: LandlordStats;
  recentInquiries: {
    id: string;
    tenantName: string;
    listingTitle: string;
    message: string;
    timeAgo: string;
    unread: boolean;
  }[];
};

export const MOCK_DASHBOARD: DashboardData = {
  landlordName: "Keyan Andy",
  subscription: {
    status: "trial",
    daysLeft: 29,
    endsAt: "2026-08-05",
  },
  isVerified: false,
  stats: {
    totalListings: 3,
    activeInquiries: 5,
    activeTenants: 8,
    monthlyRevenue: 24500,
    totalViews: 142,
  },
  recentInquiries: [
    {
      id: "i1",
      tenantName: "Maria Santos",
      listingTitle: "Cozy bedspace near Dolefil",
      message: "Hi! Available pa po ba yung bedspace?",
      timeAgo: "2h ago",
      unread: true,
    },
    {
      id: "i2",
      tenantName: "Juan Dela Cruz",
      listingTitle: "Student boarding house",
      message: "Can I schedule a viewing this weekend?",
      timeAgo: "5h ago",
      unread: true,
    },
    {
      id: "i3",
      tenantName: "Anna Reyes",
      listingTitle: "Private room near Public Market",
      message: "Thank you for accommodating my request!",
      timeAgo: "1d ago",
      unread: false,
    },
  ],
};