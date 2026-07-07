import { useState } from "react";
import { useParams } from "react-router-dom";
import { Grid3x3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { PhotoSection } from "@/mocks/listings";
import PhotoTourSheet from "./photoTourSheet";

type Props = {
  photos: string[];
  title: string;
  photoSections?: PhotoSection[];
};

export default function PhotoGallery({ photos, title, photoSections }: Props) {
  const [activePhoto, setActivePhoto] = useState(0);
  const [isTourOpen, setIsTourOpen] = useState(false);
  const { id } = useParams();
  const hasEnoughPhotos = photos.length >= 5;
  const mainPhoto = photos[0];
  const sidePhotos = photos.slice(1, 5);

  const openTour = () => {
    if (id) setIsTourOpen(true);
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    setActivePhoto(Math.round(el.scrollLeft / el.clientWidth));
  };

  return (
    <>
      {/* Mobile */}
      <div className="relative md:hidden">
        <div
          onScroll={handleScroll}
          className="flex aspect-[4/3] w-full snap-x snap-mandatory overflow-x-auto scroll-smooth scrollbar-hide"
        >
          {photos.map((src, i) => (
            <div
              key={i}
              onClick={openTour}
              className="h-full w-full shrink-0 cursor-pointer snap-center bg-gray-100 bg-cover bg-center"
              style={{ backgroundImage: `url(${src})` }}
              role="img"
              aria-label={`${title} photo ${i + 1}`}
            />
          ))}
        </div>

        {photos.length > 1 && (
          <div className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-3 py-1 text-xs font-medium text-white">
            {activePhoto + 1} / {photos.length}
          </div>
        )}
      </div>

      {/* Desktop */}
      <div className="hidden md:block">
        <div className="relative grid aspect-[2/1] w-full grid-cols-4 grid-rows-2 gap-2 overflow-hidden rounded-2xl">
          <div
            onClick={openTour}
            className="col-span-2 row-span-2 cursor-pointer bg-gray-100 bg-cover bg-center transition-opacity hover:opacity-95"
            style={{ backgroundImage: `url(${mainPhoto})` }}
          />
          {sidePhotos.map((src, i) => (
            <div
              key={i}
              onClick={openTour}
              className="cursor-pointer bg-gray-100 bg-cover bg-center transition-opacity hover:opacity-95"
              style={{ backgroundImage: `url(${src})` }}
            />
          ))}

          {!hasEnoughPhotos &&
            Array.from({ length: 4 - sidePhotos.length }).map((_, i) => (
              <div key={`empty-${i}`} className="bg-gray-100" />
            ))}

          {photos.length > 1 && (
            <Button
              variant="outline"
              onClick={openTour}
              className="absolute bottom-4 right-4 gap-2 rounded-lg border-gray-900 bg-white text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-50"
            >
              <Grid3x3 className="h-4 w-4" />
              Show all photos
            </Button>
          )}
        </div>
      </div>

      <PhotoTourSheet
        isOpen={isTourOpen}
        onOpenChange={setIsTourOpen}
        photos={photos}
        title={title}
        photoSections={photoSections}
      />
    </>
  );
}