import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Home, Search, Heart, User } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { to: "/", icon: Home, label: "Home", matchExact: true },
  { to: "/search", icon: Search, label: "Explore", matchPaths: ["/search", "/nearMe"] },
  { to: "/favorites", icon: Heart, label: "Wishlist" },
  { to: "/login", icon: User, label: "Profile" },
];

export default function BottomNav() {
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      if (currentY < 10) setVisible(true);
      else if (currentY > lastScrollY) setVisible(false);
      else if (currentY < lastScrollY) setVisible(true);
      setLastScrollY(currentY);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const isActive = (tab: (typeof tabs)[0]) => {
    if (tab.matchExact) return location.pathname === tab.to;
    if (tab.matchPaths) return tab.matchPaths.includes(location.pathname);
    return location.pathname.startsWith(tab.to);
  };

  return (
    <nav
      className={cn(
        "fixed bottom-0 left-0 right-0 z-40 border-t border-gray-200 bg-white transition-transform duration-300",
        visible ? "translate-y-0" : "translate-y-full",
      )}
    >
      <div className="mx-auto flex max-w-md items-center justify-around gap-1 px-3 py-3">
        {tabs.map((tab) => {
          const active = isActive(tab);
          const Icon = tab.icon;

          return (
            <NavLink
              key={tab.to}
              to={tab.to}
              className={cn(
                "flex items-center justify-center gap-2 rounded-full transition-all active:scale-95",
                active
                  ? "flex-1 bg-green-100 px-4 py-2.5 text-green-700"
                  : "px-3 py-2.5 text-gray-500",
              )}
            >
              <Icon
                className="h-5 w-5"
                strokeWidth={active ? 2.5 : 2}
                fill={active && tab.label === "Wishlist" ? "currentColor" : "none"}
              />
              {active && (
                <span className="text-xs font-semibold">{tab.label}</span>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
