import { Star } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    getReviewsByListingId,
    getAverageRating,
    type Review,
} from "@/mocks/reviews";

type Props = {
    listingId: string;
};

function formatRelativeDate(dateStr: string): string {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) {
        const weeks = Math.floor(diffDays / 7);
        return `${weeks} ${weeks === 1 ? "week" : "weeks"} ago`;
    }
    if (diffDays < 365) {
        const months = Math.floor(diffDays / 30);
        return `${months} ${months === 1 ? "month" : "months"} ago`;
    }
    const years = Math.floor(diffDays / 365);
    return `${years} ${years === 1 ? "year" : "years"} ago`;
}

function StarRating({ rating }: { rating: number }) {
    return (
        <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
                <Star
                    key={star}
                    className={`h-3 w-3 ${star <= rating
                        ? "fill-gray-900 text-gray-900"
                        : "fill-gray-200 text-gray-200"
                        }`}
                />
            ))}
        </div>
    );
}

function ReviewCard({ review }: { review: Review }) {
    const [expanded, setExpanded] = useState(false);
    const isLong = review.comment.length > 120;
    const displayText =
        isLong && !expanded
            ? review.comment.slice(0, 120) + "..."
            : review.comment;

    return (
        <div className="flex h-full w-[85%] shrink-0 snap-start flex-col rounded-2xl p-1 sm:w-[45%] md:w-[32%]">
            <div className="mb-2 flex items-center gap-2">
                <StarRating rating={review.rating} />
                <span className="text-xs text-gray-500">·</span>
                <span className="text-xs text-gray-700">
                    {formatRelativeDate(review.date)}
                </span>
            </div>

            <p className="flex-1 text-sm leading-relaxed text-gray-900">
                {displayText}
                {isLong && !expanded && (
                    <button
                        onClick={() => setExpanded(true)}
                        className="ml-1 font-semibold text-gray-900 underline"
                    >
                        Show more
                    </button>
                )}
            </p>

            <div className="mt-4 flex items-center gap-3">
                {review.authorAvatar ? (
                    <img
                        src={review.authorAvatar}
                        alt={review.authorName}
                        className="h-10 w-10 rounded-full object-cover"
                    />
                ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 text-sm font-semibold text-gray-700">
                        {review.authorName.charAt(0)}
                    </div>
                )}
                <div>
                    <p className="text-sm font-semibold text-gray-900">
                        {review.authorName}
                    </p>
                    {review.location && (
                        <p className="text-xs text-gray-500">{review.location}</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function ReviewsSection({ listingId }: Props) {
    const reviews = getReviewsByListingId(listingId);
    const averageRating = getAverageRating(listingId);

    if (reviews.length === 0) return null;

    return (
        <section className="mt-8">
            <div className="mb-4 flex items-center gap-2">
                <Star className="h-5 w-5 fill-gray-900 text-gray-900" />
                <h2 className="text-lg font-bold text-gray-900">
                    {averageRating.toFixed(1)} · {reviews.length}{" "}
                    {reviews.length === 1 ? "review" : "reviews"}
                </h2>
            </div>

            <div className="scrollbar-hide flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2">
                {reviews.map((review) => (
                    <ReviewCard key={review.id} review={review} />
                ))}
            </div>

            <Dialog>
                <DialogTrigger>
                    <Button
                        variant="outline"
                        className="mt-4 w-full text-sm font-semibold bg-transparent "
                    >
                        Show all {reviews.length} reviews
                    </Button>
                </DialogTrigger>
                <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Star className="h-5 w-5 fill-gray-900 text-gray-900" />
                            {averageRating.toFixed(1)} · {reviews.length}{" "}
                            {reviews.length === 1 ? "review" : "reviews"}
                        </DialogTitle>
                    </DialogHeader>

                    <div className="mt-4 space-y-6">
                        {reviews.map((review) => (
                            <div
                                key={review.id}
                                className="border-b border-gray-100 pb-6 last:border-b-0 last:pb-0"
                            >
                                <div className="mb-3 flex items-center gap-3">
                                    {review.authorAvatar ? (
                                        <img
                                            src={review.authorAvatar}
                                            alt={review.authorName}
                                            className="h-10 w-10 rounded-full object-cover"
                                        />
                                    ) : (
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 text-sm font-semibold text-gray-700">
                                            {review.authorName.charAt(0)}
                                        </div>
                                    )}
                                    <div>
                                        <p className="text-sm font-semibold text-gray-900">
                                            {review.authorName}
                                        </p>
                                        {review.location && (
                                            <p className="text-xs text-gray-500">
                                                {review.location}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="mb-2 flex items-center gap-2">
                                    <StarRating rating={review.rating} />
                                    <span className="text-xs text-gray-500">·</span>
                                    <span className="text-xs text-gray-700">
                                        {formatRelativeDate(review.date)}
                                    </span>
                                </div>

                                <p className="text-sm leading-relaxed text-gray-900">
                                    {review.comment}
                                </p>
                            </div>
                        ))}
                    </div>
                </DialogContent>
            </Dialog>
        </section>
    );
}