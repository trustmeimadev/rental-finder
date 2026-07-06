import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { MOCK_LISTINGS, type PhotoSection } from "@/mocks/listings";
import PageShell from "@/components/layout/pageShell";

export default function PhotoTour() {
  const { id } = useParams();
  const navigate = useNavigate();
  const listing = MOCK_LISTINGS.find((l) => l.id === id);

  const sections: PhotoSection[] = listing
    ? listing.photoSections && listing.photoSections.length > 0
      ? listing.photoSections
      : [{ id: "all", label: "All photos", photos: listing.photos }]
    : [];

  const [activeId, setActiveId] = useState(sections[0]?.id || "");
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const tabsRef = useRef<HTMLDivElement>(null);
  const isProgrammaticScrollRef = useRef(false);
  const scrollTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Track active section on window scroll
  useEffect(() => {
    const handleScroll = () => {
      if (isProgrammaticScrollRef.current) return;

      const scrollTop = window.scrollY + 100;
      let currentId = sections[0]?.id || "";
      for (const s of sections) {
        const el = sectionRefs.current[s.id];
        if (el && el.offsetTop <= scrollTop) {
          currentId = s.id;
        }
      }
      setActiveId((prev) => (prev === currentId ? prev : currentId));
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [sections]);

  // Auto-center active thumbnail — pure horizontal, doesn't affect window scroll
  useEffect(() => {
    const container = tabsRef.current;
    if (!container) return;
    const activeTab = container.querySelector(
      `[data-tab-id="${activeId}"]`
    ) as HTMLElement | null;
    if (!activeTab) return;

    const containerRect = container.getBoundingClientRect();
    const tabRect = activeTab.getBoundingClientRect();

    // Center the tab within the container
    const scrollOffset =
      activeTab.offsetLeft -
      container.offsetLeft -
      containerRect.width / 2 +
      tabRect.width / 2;

    container.scrollTo({ left: scrollOffset, behavior: "smooth" });
  }, [activeId]);

  const scrollToSection = (sid: string) => {
    const el = sectionRefs.current[sid];
    if (!el) return;

    setActiveId(sid);
    isProgrammaticScrollRef.current = true;

    const offset = 70;
    window.scrollTo({ top: el.offsetTop - offset, behavior: "smooth" });

    if (scrollTimeoutRef.current) {
      window.clearTimeout(scrollTimeoutRef.current);
    }
    scrollTimeoutRef.current = window.setTimeout(() => {
      isProgrammaticScrollRef.current = false;
    }, 700);
  };

  if (!listing) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Listing not found</p>
      </div>
    );
  }

  return (
    <PageShell>
      {/* Sticky header */}
      <div className="sticky top-0 z-20 grid grid-cols-[auto_1fr_auto] items-center border-b border-border bg-white px-4 py-3">
        <button
          onClick={() => navigate(-1)}
          className="rounded-full p-1 hover:bg-gray-100"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-center text-base font-bold">Photo tour</h1>
        <div className="w-7" />
      </div>

      {/* Thumbnails */}
      <div
        ref={tabsRef}
        className="flex gap-4 overflow-x-auto px-4 pt-4 pb-4 scrollbar-hide"
      >
        {sections.map((s) => (
          <button
            key={s.id}
            data-tab-id={s.id}
            onClick={() => scrollToSection(s.id)}
            className="flex shrink-0 flex-col gap-2"
          >
            <div
              role="img"
              aria-label={`${s.label} thumbnail`}
              className={`h-28 w-36 rounded-2xl bg-gray-100 bg-cover bg-center transition-all ${
                activeId === s.id ? "ring-2 ring-gray-900 ring-offset-2" : ""
              }`}
              style={{ backgroundImage: `url(${s.photos[0]})` }}
            />
            <span
              className={`text-left text-base ${
                activeId === s.id
                  ? "font-semibold text-gray-900"
                  : "text-gray-800"
              }`}
            >
              {s.label}
            </span>
          </button>
        ))}
      </div>

      {/* Sections */}
      <div className="mx-auto max-w-screen-md space-y-12 px-4 pt-6 pb-20">
        {sections.map((s) => (
          <section
            key={s.id}
            ref={(el) => {
              sectionRefs.current[s.id] = el as HTMLDivElement | null;
            }}
          >
            <h2 className="text-3xl font-bold">{s.label}</h2>
            {s.subtitle && (
              <p className="mt-2 text-lg text-muted-foreground">
                {s.subtitle}
              </p>
            )}

            <div className="mt-6 grid grid-cols-2 gap-3">
              {s.photos.map((src, i) => (
                <div
                  key={i}
                  role="img"
                  aria-label={`${s.label} photo ${i + 1}`}
                  className="aspect-square w-full overflow-hidden rounded-xl bg-gray-100 bg-cover bg-center"
                  style={{ backgroundImage: `url(${src})` }}
                />
              ))}
            </div>
          </section>
        ))}
      </div>
    </PageShell>
  );
}