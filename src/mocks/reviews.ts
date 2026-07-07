export type Review = {
    id: string;
    listingId: string;
    authorName: string;
    authorAvatar?: string;
    rating: number;
    date: string;
    comment: string;
    location?: string;
};

export const MOCK_REVIEWS: Review[] = [
    {
        id: "r1",
        listingId: "1",
        authorName: "Gabrielle",
        authorAvatar: "https://i.pravatar.cc/150?img=1",
        rating: 5,
        date: "2026-06-25",
        comment:
            "Thank you so much! The photos turned out beautifully. The room is exactly as advertised and the landlord was very accommodating.",
        location: "Polomolok",
    },
    {
        id: "r2",
        listingId: "1",
        authorName: "Jemima",
        authorAvatar: "https://i.pravatar.cc/150?img=5",
        rating: 5,
        date: "2026-06-20",
        comment:
            "It was absolutely amazing! I had the best time here. The location is perfect and everything is well-maintained. Highly recommended!",
        location: "General Santos",
    },
    {
        id: "r3",
        listingId: "1",
        authorName: "Mark",
        authorAvatar: "https://i.pravatar.cc/150?img=12",
        rating: 4,
        date: "2026-06-15",
        comment:
            "Great place, close to work at Dolefil. Quiet neighborhood and clean facilities.",
        location: "Koronadal",
    },
    {
        id: "r4",
        listingId: "2",
        authorName: "Sarah",
        authorAvatar: "https://i.pravatar.cc/150?img=9",
        rating: 5,
        date: "2026-06-10",
        comment:
            "Perfect for students! Very near Notre Dame-Siena. The Wi-Fi is fast and the kitchen is well-equipped.",
        location: "Tupi",
    },
    {
        id: "r5",
        listingId: "3",
        authorName: "James",
        authorAvatar: "https://i.pravatar.cc/150?img=13",
        rating: 5,
        date: "2026-06-05",
        comment:
            "Excellent private room! The bathroom is immaculate and having aircon is a huge plus. Landlord is responsive.",
    },
];

export function getReviewsByListingId(listingId: string): Review[] {
    return MOCK_REVIEWS.filter((r) => r.listingId === listingId);
}

export function getAverageRating(listingId: string): number {
    const reviews = getReviewsByListingId(listingId);
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    return sum / reviews.length;
}