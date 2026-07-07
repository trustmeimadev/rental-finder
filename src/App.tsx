import { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Home from "@/pages/home";
import BottomNav from "@/components/layout/bottomNav";
import ListingDetails from "@/pages/listingDetails";
import NearMe from "@/pages/nearMe";
import SearchPage from "@/pages/search";
import LandlordDashboard from "@/pages/landlord/dashboard";



function AppContent() {
  const location = useLocation();
  // const hideBottomNav = location.pathname.startsWith("/listing/");
  

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname, location.search]);

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/favorites" element={<div className="p-8">Wishlists (soon)</div>} />
        <Route path="/login" element={<div className="p-8">Log in (soon)</div>} />
        <Route path="/listing/:id" element={<ListingDetails />} />
        <Route path="/nearMe" element={<NearMe />} />


        <Route path="/landlord/dashboard" element={<LandlordDashboard />} />
      </Routes>
      <BottomNav />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}