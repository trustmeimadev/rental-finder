import { useEffect, useRef, useState } from "react";
import { ArrowLeft, X, ChevronLeft, ChevronRight } from "lucide-react";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import type { PhotoSection } from "@/mocks/listings";

type PhotoTourSheetProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  photos: string[];
  title: string;
  photoSections?: PhotoSection[];
};

export default function PhotoTourSheet({
  isOpen,
  onOpenChange,
  photos,
  title,
  photoSections,
}: PhotoTourSheetProps) {
  const sections: PhotoSection[] =
    photoSections && photoSections.length > 0
      ? photoSections
      : [{ id: "all", label: "All photos", photos }];

  const flatPhotos = sections.flatMap((s) => s.photos);

  const [activeId, setActiveId] = useState(sections[0]?.id || "");
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);
  
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const isProgrammaticScrollRef = useRef(false);
  const scrollTimeoutRef = useRef<number | null>(null);

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (selectedPhotoIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        setSelectedPhotoIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : prev));
      } else if (e.key === "ArrowRight") {
        setSelectedPhotoIndex((prev) =>
          prev !== null && prev < flatPhotos.length - 1 ? prev + 1 : prev
        );
      } else if (e.key === "Escape") {
        setSelectedPhotoIndex(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedPhotoIndex, flatPhotos]);

  // Sync scroll to update the active tab
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || !isOpen) return;

    const handleScroll = () => {
      if (isProgrammaticScrollRef.current) return;

      const containerRect = container.getBoundingClientRect();
      const scrollTop = container.scrollTop;
      let currentId = sections[0]?.id || "";

      for (const s of sections) {
        const el = sectionRefs.current[s.id];
        if (el) {
          const elRect = el.getBoundingClientRect();
          // Calculate top relative to the container's top
          const relativeTop = elRect.top - containerRect.top + scrollTop;
          // Set active if the section has reached the top threshold
          if (relativeTop <= scrollTop + 100) {
            currentId = s.id;
          }
        }
      }
      setActiveId((prev) => (prev === currentId ? prev : currentId));
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    // Trigger once on mount/open to select active section
    handleScroll();
    return () => container.removeEventListener("scroll", handleScroll);
  }, [sections, isOpen]);

  // Auto-center active thumbnail for mobile view
  useEffect(() => {
    const container = tabsRef.current;
    if (!container || !isOpen) return;
    const activeTab = container.querySelector(
      `[data-tab-id="${activeId}"]`
    ) as HTMLElement | null;
    if (!activeTab) return;

    const containerRect = container.getBoundingClientRect();
    const tabRect = activeTab.getBoundingClientRect();

    const scrollOffset =
      activeTab.offsetLeft -
      container.offsetLeft -
      containerRect.width / 2 +
      tabRect.width / 2;

    container.scrollTo({ left: scrollOffset, behavior: "smooth" });
  }, [activeId, isOpen]);

  const scrollToSection = (sid: string) => {
    const el = sectionRefs.current[sid];
    const container = scrollContainerRef.current;
    if (!el || !container) return;

    setActiveId(sid);
    isProgrammaticScrollRef.current = true;

    const containerRect = container.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();
    const relativeTop = elRect.top - containerRect.top + container.scrollTop;
    
    // Add offset matching desktop/mobile padding
    const offset = 24; 
    container.scrollTo({ top: relativeTop - offset, behavior: "smooth" });

    if (scrollTimeoutRef.current) {
      window.clearTimeout(scrollTimeoutRef.current);
    }
    scrollTimeoutRef.current = window.setTimeout(() => {
      isProgrammaticScrollRef.current = false;
    }, 700);
  };

  const showPrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedPhotoIndex !== null && selectedPhotoIndex > 0) {
      setSelectedPhotoIndex(selectedPhotoIndex - 1);
    }
  };

  const showNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedPhotoIndex !== null && selectedPhotoIndex < flatPhotos.length - 1) {
      setSelectedPhotoIndex(selectedPhotoIndex + 1);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      setSelectedPhotoIndex(null);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        showCloseButton={false}
        className="fixed inset-0 z-50 flex h-full w-full max-w-none flex-col border-none bg-white p-0 sm:max-w-none md:max-w-none [&>button]:hidden focus:outline-none"
      >
        {/* Hidden but required for accessibility title */}
        <div className="sr-only">
          <SheetTitle>{title} - Photo Tour</SheetTitle>
        </div>

        {/* Outer Flex Container */}
        <div className="flex h-full w-full flex-col overflow-hidden">
          
          {/* Header Bar */}
          <header className="flex h-16 shrink-0 items-center justify-between border-b border-gray-100 px-6">
            <button
              onClick={() => onOpenChange(false)}
              className="group flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-gray-100 active:scale-95"
              aria-label="Close photo tour"
            >
              <ArrowLeft className="h-5 w-5 text-gray-700 transition-transform group-hover:-translate-x-0.5" />
            </button>
            <span className="text-sm font-semibold text-gray-900 line-clamp-1 max-w-[60%]">
              {title}
            </span>
            <button
              onClick={() => onOpenChange(false)}
              className="flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-gray-100 active:scale-95"
              aria-label="Close photo tour"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </header>

          {/* Main Content Area */}
          <div className="flex flex-1 overflow-hidden">
            
            {/* Desktop Left Sidebar Category Navigation */}
            <aside className="hidden w-80 shrink-0 flex-col gap-6 border-r border-gray-100 bg-white p-8 md:flex overflow-y-auto">
              <h2 className="text-2xl font-bold tracking-tight text-gray-950">Photo Tour</h2>
              <nav className="flex flex-col gap-2">
                {sections.map((s) => {
                  const isActive = activeId === s.id;
                  return (
                    <button
                      key={s.id}
                      onClick={() => scrollToSection(s.id)}
                      className={`group flex items-center justify-between rounded-xl px-4 py-3 text-left transition-all ${
                        isActive
                          ? "bg-gray-900 text-white font-medium shadow-md shadow-gray-900/10"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                    >
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">{s.label}</span>
                        <span
                          className={`text-xs ${
                            isActive ? "text-gray-300" : "text-gray-400 group-hover:text-gray-500"
                          }`}
                        >
                          {s.photos.length} {s.photos.length === 1 ? "photo" : "photos"}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </nav>
            </aside>

            {/* Right Pane / Scrollable container (Both Desktop & Mobile) */}
            <div className="flex flex-1 flex-col overflow-hidden">
              
              {/* Mobile-Only Horizontal Navigation */}
              <div
                ref={tabsRef}
                className="flex shrink-0 gap-4 border-b border-gray-50 bg-white px-6 py-4 overflow-x-auto scrollbar-hide md:hidden"
              >
                {sections.map((s) => {
                  const isActive = activeId === s.id;
                  return (
                    <button
                      key={s.id}
                      data-tab-id={s.id}
                      onClick={() => scrollToSection(s.id)}
                      className="flex shrink-0 flex-col gap-1.5 focus:outline-none"
                    >
                      <div
                        role="img"
                        aria-label={`${s.label} thumbnail`}
                        className={`h-16 w-24 rounded-xl bg-gray-100 bg-cover bg-center transition-all ${
                          isActive
                            ? "ring-2 ring-gray-900 ring-offset-2 scale-95"
                            : "opacity-70 hover:opacity-100"
                        }`}
                        style={{ backgroundImage: `url(${s.photos[0]})` }}
                      />
                      <span
                        className={`text-[11px] text-center font-medium ${
                          isActive ? "text-gray-900 font-bold" : "text-gray-500"
                        }`}
                      >
                        {s.label}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Vertically scrolling photos */}
              <div
                ref={scrollContainerRef}
                className="flex-1 overflow-y-auto bg-gray-50/50 p-6 md:p-12 scroll-smooth"
              >
                <div className="mx-auto max-w-3xl space-y-12 pb-24">
                  {sections.map((s) => (
                    <section
                      key={s.id}
                      ref={(el) => {
                        sectionRefs.current[s.id] = el as HTMLDivElement | null;
                      }}
                      className="scroll-mt-6"
                    >
                      <div className="mb-4">
                        <h3 className="text-xl font-bold text-gray-900 md:text-2xl">
                          {s.label}
                        </h3>
                        {s.subtitle && (
                          <p className="mt-1 text-sm text-gray-500 md:text-base">
                            {s.subtitle}
                          </p>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-3 md:gap-4">
                        {s.photos.map((src, i) => {
                          const totalPhotos = s.photos.length;
                          let isFullWidth = false;
                          if (totalPhotos === 1) {
                            isFullWidth = true;
                          } else if (totalPhotos === 2) {
                            isFullWidth = false;
                          } else if (totalPhotos === 3) {
                            isFullWidth = i === 0;
                          } else if (totalPhotos === 4) {
                            isFullWidth = i === 0 || i === 3;
                          } else {
                            if (i === 0) {
                              isFullWidth = true;
                            } else if (totalPhotos % 2 === 0 && i === totalPhotos - 1) {
                              isFullWidth = true;
                            }
                          }

                          const flatIndex = flatPhotos.indexOf(src);
                          const aspectClass = isFullWidth ? "aspect-[16/10] col-span-2" : "aspect-[4/3] col-span-1";

                          return (
                            <div
                              key={i}
                              onClick={() => setSelectedPhotoIndex(flatIndex)}
                              className={`group relative w-full cursor-pointer overflow-hidden rounded-2xl border border-gray-200/50 bg-gray-100 shadow-sm transition-all hover:shadow-md hover:border-gray-300 active:scale-[0.995] ${aspectClass}`}
                            >
                              <img
                                src={src}
                                alt={`${s.label} photo ${i + 1}`}
                                className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.025]"
                                loading="lazy"
                              />
                              {/* Visual highlight and hover zoom indicator */}
                              <div className="absolute inset-0 bg-black/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex items-center justify-center">
                                <span className="rounded-full bg-black/50 px-3.5 py-2 text-xs font-semibold text-white tracking-wide shadow-md opacity-0 scale-95 transition-all duration-300 group-hover:opacity-100 group-hover:scale-100">
                                  View Photo
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </section>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Fullscreen Lightbox Overlay */}
        {selectedPhotoIndex !== null && (
          <div
            onClick={handleBackdropClick}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/95 transition-all duration-300"
          >
            {/* Top Bar */}
            <div className="absolute top-0 inset-x-0 flex h-20 items-center justify-between px-6 text-white bg-gradient-to-b from-black/60 to-transparent pointer-events-none">
              <span className="text-sm font-medium">
                {selectedPhotoIndex + 1} / {flatPhotos.length}
              </span>
              <button
                onClick={() => setSelectedPhotoIndex(null)}
                className="rounded-full p-2.5 bg-black/30 hover:bg-white/10 active:scale-95 transition-all pointer-events-auto"
                aria-label="Close viewer"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Left navigation arrow */}
            {selectedPhotoIndex > 0 && (
              <button
                onClick={showPrev}
                className="absolute left-4 md:left-8 z-10 rounded-full p-3 bg-black/30 hover:bg-white/10 active:scale-90 transition-all text-white border border-white/10"
                aria-label="Previous photo"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
            )}

            {/* Main fullscreen image container */}
            <div className="max-h-[85vh] max-w-[90vw] select-none flex items-center justify-center">
              <img
                src={flatPhotos[selectedPhotoIndex]}
                alt="Fullscreen listing view"
                className="max-h-[85vh] max-w-[90vw] object-contain rounded-lg shadow-2xl transition-all duration-300"
              />
            </div>

            {/* Right navigation arrow */}
            {selectedPhotoIndex < flatPhotos.length - 1 && (
              <button
                onClick={showNext}
                className="absolute right-4 md:right-8 z-10 rounded-full p-3 bg-black/30 hover:bg-white/10 active:scale-90 transition-all text-white border border-white/10"
                aria-label="Next photo"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            )}
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

