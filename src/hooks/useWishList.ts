import { useEffect, useState } from "react";

const STORAGE_KEY = "rentapolo_wishlist";

function getWishlist(): string[] {
    if (typeof window === "undefined") return [];
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch {
        return [];
    }
}

function saveWishlist(ids: string[]) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
        window.dispatchEvent(new Event("wishlist-updated"));
    } catch {
        // ignore
    }
}

export function useWishlist() {
    const [wishlist, setWishlist] = useState<string[]>(getWishlist);

    useEffect(() => {
        const handler = () => setWishlist(getWishlist());
        window.addEventListener("wishlist-updated", handler);
        window.addEventListener("storage", handler);
        return () => {
            window.removeEventListener("wishlist-updated", handler);
            window.removeEventListener("storage", handler);
        };
    }, []);

    const isFavorite = (id: string) => wishlist.includes(id);

    const toggleFavorite = (id: string) => {
        const current = getWishlist();
        const updated = current.includes(id)
            ? current.filter((x) => x !== id)
            : [...current, id];
        saveWishlist(updated);
        setWishlist(updated);
    };

    return { wishlist, isFavorite, toggleFavorite };
}
