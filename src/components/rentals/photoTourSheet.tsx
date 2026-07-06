import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { MOCK_LISTINGS } from "@/mocks/listings";

export default function PhotoTour() {
  const { id } = useParams();
  const navigate = useNavigate();
  const listing = MOCK_LISTINGS.find((l) => l.id === id);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!listing) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Listing not found</p>
      </div>
    );
  }

  const sections =
    listing.photoSections && listing.photoSections.length > 0
      ? listing.photoSections
      : [{ id: "all", label: "All photos", subtitle: undefined, photos: listing.photos }];

  return (
    <div className="min-h-screen bg-white">
      {/* Sticky header */}
      <div className="sticky top-0 z-10 flex items-center gap-4 border-b border-border bg-white px-4 py-3">
        <button
          onClick={() => navigate(-1)}
          className="rounded-full p-1 hover:bg-gray-100"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-base font-bold">Photo tour</h1>
      </div>

      {/* Sections */}
      <div className="mx-auto max-w-screen-md space-y-10 px-4 pt-6 pb-20">
        {sections.map((s) => (
          <section key={s.id}>
            <h2 className="text-2xl font-bold">{s.label}</h2>
            {s.subtitle && (
              <p className="mt-1 text-base text-muted-foreground">
                {s.subtitle}
              </p>
            )}

            <div className="mt-4 grid grid-cols-2 gap-2">
              {s.photos.map((src, i) => (
                <div
                  key={i}
                  className="aspect-square w-full overflow-hidden rounded-xl bg-gray-100"
                >
                  <img
                    src={src}
                    alt={s.label}
                    className="h-full w-full object-cover"
                  />
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}