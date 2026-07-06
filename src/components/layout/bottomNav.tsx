import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Search, Heart, User } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { to: "/", icon: Search, label: "Explore" },
  { to: "/favorites", icon: Heart, label: "Wishlists" },
  { to: "/login", icon: User, label: "Log in" },
];

export default function BottomNav() {
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;

      if (currentY < 10) {
        setVisible(true);
      } else if (currentY > lastScrollY) {
        setVisible(false);
      } else if (currentY < lastScrollY) {
        setVisible(true);
      }

      setLastScrollY(currentY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <nav
      className={cn(
        "fixed bottom-0 left-0 right-0 z-30 border-t border-border bg-white transition-transform duration-300 md:hidden",
        visible ? "translate-y-0" : "translate-y-full"
      )}
    >
      <div className="mx-auto flex max-w-screen-md items-center justify-around px-2 py-2">
        {tabs.map(({ to, icon: Icon, label }) => {
          const isActive =
            to === "/" ? location.pathname === "/" : location.pathname.startsWith(to);

          return (
            <NavLink
              key={to}
              to={to}
              className="flex flex-1 flex-col items-center gap-1 py-1"
            >
              <Icon
                className={cn(
                  "h-6 w-6 transition-colors",
                  isActive ? "text-green-600" : "text-gray-500"
                )}
                strokeWidth={isActive ? 2.5 : 2}
                fill={isActive && label === "Wishlists" ? "currentColor" : "none"}
              />
              <span
                className={cn(
                  "text-[11px] font-semibold transition-colors",
                  isActive ? "text-green-600" : "text-gray-500"
                )}
              >
                {label}
              </span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
``