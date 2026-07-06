import { Link } from "react-router-dom";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-16 border-t border-border bg-white">
      <div className="mx-auto flex max-w-screen-md flex-col gap-4 px-4 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>© {year} RentaPolo · Polomolok, South Cotabato</p>

        <div className="flex flex-wrap gap-x-4 gap-y-1">
          <Link to="/about" className="hover:text-gray-900 hover:underline">
            About
          </Link>
          <Link to="/help" className="hover:text-gray-900 hover:underline">
            Help
          </Link>
          <Link to="/privacy" className="hover:text-gray-900 hover:underline">
            Privacy
          </Link>
          <Link to="/terms" className="hover:text-gray-900 hover:underline">
            Terms
          </Link>
        </div>
      </div>
    </footer>
  );
}