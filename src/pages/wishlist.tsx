import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import PageShell from "@/components/layout/pageShell";
import ListingCard from "@/components/rentals/listingCard";
import { useWishlist } from "@/hooks/useWishList";
import { MOCK_LISTINGS } from "@/mocks/listings";

const IS_LOGGED_IN = false;

export default function Wishlist() {
  const navigate = useNavigate();
  const { wishlist } = useWishlist();
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // ============ NOT LOGGED IN ============
  if (!IS_LOGGED_IN) {
    return (
      <PageShell>
        <div className="mx-auto max-w-sm pt-16 text-center">
          
          <h1 className="mt-4 text-lg font-bold text-gray-900">
            Log in to view your wishlist
          </h1>
          <p className="mt-1 text-xs text-gray-500">
            Sign in to manage and save your favorite rentals.
          </p>

          <Button
            onClick={() => navigate("/login")}
            className="mt-5 h-10 w-full rounded-lg bg-green-600 text-sm font-bold text-white hover:bg-green-700"
          >
            Log in
          </Button>

          <p className="mt-3 text-xs text-gray-500">
            No account?{" "}
            <button
              onClick={() => navigate("/login")}
              className="font-bold text-green-700 hover:text-green-800"
            >
              Sign up
            </button>
          </p>
        </div>
      </PageShell>
    );
  }

  // ============ LOGGED IN ============
  const favoriteListings = MOCK_LISTINGS.filter((l) =>
    wishlist.includes(l.id),
  );

  return (
    <PageShell>
      <div className="pt-4">
        <div className="flex items-baseline justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Wishlist</h1>
            <p className="mt-0.5 text-xs text-gray-500">
              {favoriteListings.length}{" "}
              {favoriteListings.length === 1 ? "saved rental" : "saved rentals"}
            </p>
          </div>

          {favoriteListings.length > 0 && (
            <button
              onClick={() => setShowClearConfirm(!showClearConfirm)}
              className="flex items-center gap-1 text-xs font-semibold text-gray-500 hover:text-red-600"
            >
              <Trash2 className="h-3.5 w-3.5" strokeWidth={2.5} />
              Clear
            </button>
          )}
        </div>

        {showClearConfirm && favoriteListings.length > 0 && (
          <div className="mt-3 flex items-center justify-between gap-2 rounded-lg border border-red-200 bg-red-50 p-3">
            <p className="text-xs font-semibold text-red-800">
              Remove all saved rentals?
            </p>
            <div className="flex gap-1.5">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="rounded-md bg-white px-3 py-1 text-[11px] font-semibold text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowClearConfirm(false)}
                className="rounded-md bg-red-600 px-3 py-1 text-[11px] font-semibold text-white hover:bg-red-700"
              >
                Clear all
              </button>
            </div>
          </div>
        )}
      </div>

      {favoriteListings.length === 0 ? (
        <div className="mt-8 rounded-lg border border-gray-200 bg-white p-6 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
            {/* <Heart className="h-5 w-5 text-gray-400" strokeWidth={2} /> */}
          </div>
          <p className="mt-3 text-sm font-semibold text-gray-900">
            No favorites yet
          </p>
          <p className="mt-1 text-xs text-gray-500">
            Tap the heart on any listing to save it here
          </p>
          <Button
            onClick={() => navigate("/")}
            variant="outline"
            className="mt-4 h-9 rounded-lg border-gray-200 px-4 text-xs font-semibold text-gray-900 hover:bg-gray-50"
          >
            Explore rentals
          </Button>
        </div>
      ) : (
        <div className="mt-4 grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-3 md:grid-cols-4">
          {favoriteListings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      )}

      <div className="h-20" />
    </PageShell>
  );
}
