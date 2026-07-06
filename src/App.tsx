import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Home from "@/pages/home";
import BottomNav from "@/components/layout/bottomNav";
import ListingDetails from "@/pages/listingDetails";
import PhotoTour from "@/pages/photoTour";
import NearMe from "@/pages/nearMe";

function AppContent() {
  const location = useLocation();
  const hideBottomNav = location.pathname.startsWith("/listing/");

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        {/* <Route path="/search" element={<div className="p-8">Search page (soon)</div>} /> */}
        <Route path="/favorites" element={<div className="p-8">Wishlists (soon)</div>} />
        <Route path="/login" element={<div className="p-8">Log in (soon)</div>} />
        <Route path="/listing/:id" element={<ListingDetails />} />
        <Route path="/listing/:id/photos" element={<PhotoTour />} />
        <Route path="/nearMe" element={<NearMe />} />
      </Routes>
      {!hideBottomNav && <BottomNav />}
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