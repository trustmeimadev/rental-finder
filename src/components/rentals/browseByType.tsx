import { useNavigate } from "react-router-dom";
import {
  GraduationCap,
  BookOpen,
  Briefcase,
  Users,
  Building2,
  Bed,
  Home,
  Heart,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

type BrowseCategory = {
  id: string;
  label: string;
  description: string;
  icon: LucideIcon;
  bgColor: string;
  iconColor: string;
  searchQuery: string;
};

const CATEGORIES: BrowseCategory[] = [
  {
    id: "students",
    label: "For Students",
    description: "Near schools & colleges",
    icon: GraduationCap,
    bgColor: "bg-blue-50",
    iconColor: "text-blue-600",
    searchQuery: "student boarding house",
  },
  {
    id: "reviewers",
    label: "Board Exam Reviewers",
    description: "Quiet & focused stays",
    icon: BookOpen,
    bgColor: "bg-purple-50",
    iconColor: "text-purple-600",
    searchQuery: "quiet study room",
  },
  {
    id: "professionals",
    label: "Working Professionals",
    description: "Modern apartments",
    icon: Briefcase,
    bgColor: "bg-gray-50",
    iconColor: "text-gray-700",
    searchQuery: "apartment professional",
  },
  {
    id: "bedspacer",
    label: "Bedspacer",
    description: "Affordable shared rooms",
    icon: Bed,
    bgColor: "bg-orange-50",
    iconColor: "text-orange-600",
    searchQuery: "bedspace",
  },
  {
    id: "studio",
    label: "Studio Type",
    description: "Private compact units",
    icon: Home,
    bgColor: "bg-green-50",
    iconColor: "text-green-600",
    searchQuery: "studio apartment",
  },
  {
    id: "family",
    label: "For Family",
    description: "Spacious homes",
    icon: Heart,
    bgColor: "bg-pink-50",
    iconColor: "text-pink-600",
    searchQuery: "family apartment",
  },
  {
    id: "workers",
    label: "Dolefil Workers",
    description: "Near Cannery Site",
    icon: Building2,
    bgColor: "bg-yellow-50",
    iconColor: "text-yellow-700",
    searchQuery: "cannery worker",
  },
  {
    id: "group",
    label: "For Groups",
    description: "Roommate-friendly",
    icon: Users,
    bgColor: "bg-teal-50",
    iconColor: "text-teal-600",
    searchQuery: "boarding house group",
  },
];

export default function BrowseByType() {
  const navigate = useNavigate();

  return (
    <section className="mt-6">
      <div className="mb-3">
        <h2 className="text-base font-bold text-gray-900">
          Not sure where to start?
        </h2>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Pick a category that fits you best
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
        {CATEGORIES.map((category) => {
          const Icon = category.icon;
          return (
            <button
              key={category.id}
              onClick={() =>
                navigate(
                  `/search?q=${encodeURIComponent(category.searchQuery)}`,
                )
              }
              className="group flex items-center gap-2.5 rounded-xl border border-gray-200 bg-white p-2.5 text-left shadow-sm transition-all hover:border-gray-300 hover:shadow-md active:scale-[0.98]"
            >
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${category.bgColor} transition-transform group-hover:scale-110`}
              >
                <Icon className={`h-4 w-4 ${category.iconColor}`} />
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-semibold text-gray-900">
                  {category.label}
                </p>
                <p className="mt-0.5 truncate text-[10px] text-gray-500 leading-tight">
                  {category.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
