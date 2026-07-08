import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, ArrowLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import PageShell from "@/components/layout/pageShell";

type Role = "tenant" | "landlord";
type Mode = "login" | "register";

export default function Login() {
  const navigate = useNavigate();
  const [step, setStep] = useState<"role" | "form">("role");
  const [role, setRole] = useState<Role | null>(null);
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const isLogin = mode === "login";

  const handleRoleSelect = (r: Role) => {
    setRole(r);
    setStep("form");
  };

  const handleSubmit = () => {
    if (!email.trim() || !password.trim()) {
      setError("Please fill in all fields");
      return;
    }
    if (mode === "register" && !name.trim()) {
      setError("Please enter your name");
      return;
    }
    setError("");
    if (role === "landlord") navigate("/landlord");
    else navigate("/");
  };

  // ============ STEP 1: Role picker ============
  if (step === "role") {
    return (
      <PageShell hideFooter>
        <div className="mx-auto max-w-sm pt-4">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-1 text-xs font-semibold text-gray-500 hover:text-gray-900"
          >
            <ArrowLeft className="h-3.5 w-3.5" strokeWidth={2.5} />
            Back to home
          </button>

          <div className="mt-6">
            <h1 className="text-xl font-bold text-gray-900">Continue as</h1>
            <p className="mt-0.5 text-xs text-gray-500">
              Choose how you'll use RentaPolo
            </p>
          </div>

          <div className="mt-5 space-y-2">
            <button
              onClick={() => handleRoleSelect("tenant")}
              className="flex w-full items-center gap-3 rounded-lg border border-gray-200 bg-white p-4 text-left transition-colors hover:border-green-500 hover:bg-green-50/30"
            >
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-gray-900">Tenant</p>
                <p className="mt-0.5 text-[11px] text-gray-500">
                  Looking for a place to stay
                </p>
              </div>
              <ChevronRight
                className="h-4 w-4 shrink-0 text-gray-400"
                strokeWidth={2.5}
              />
            </button>

            <button
              onClick={() => handleRoleSelect("landlord")}
              className="flex w-full items-center gap-3 rounded-lg border border-gray-200 bg-white p-4 text-left transition-colors hover:border-green-500 hover:bg-green-50/30"
            >
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-gray-900">Landlord</p>
                <p className="mt-0.5 text-[11px] text-gray-500">
                  Listing property to rent
                </p>
              </div>
              <ChevronRight
                className="h-4 w-4 shrink-0 text-gray-400"
                strokeWidth={2.5}
              />
            </button>
          </div>

          <p className="mt-5 text-center text-xs text-gray-500">
            Just browsing?{" "}
            <button
              onClick={() => navigate("/")}
              className="font-bold text-green-700 hover:text-green-800"
            >
              Continue as guest
            </button>
          </p>
        </div>
      </PageShell>
    );
  }

  // ============ STEP 2: Form ============
  return (
    <PageShell hideFooter>
      <div className="mx-auto max-w-sm pt-4">
        <button
          onClick={() => setStep("role")}
          className="flex items-center gap-1 text-xs font-semibold text-gray-500 hover:text-gray-900"
        >
          <ArrowLeft className="h-3.5 w-3.5" strokeWidth={2.5} />
          Back
        </button>

        <div className="mt-6">
          <div className="mb-2 inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-semibold text-gray-700">
            {role === "tenant" ? "Tenant" : "Landlord"}
          </div>
          <h1 className="text-xl font-bold text-gray-900">
            {isLogin ? "Sign in" : "Create account"}
          </h1>
          <p className="mt-0.5 text-xs text-gray-500">
            {isLogin ? "Welcome back to RentaPolo" : "Join RentaPolo"}
          </p>
        </div>

        <div className="mt-5 space-y-3">
          {!isLogin && (
            <div>
              <label
                htmlFor="name"
                className="block text-[11px] font-semibold text-gray-700"
              >
                Name
              </label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Juan Dela Cruz"
                className="mt-1 h-10 rounded-lg border-gray-200 bg-white text-sm shadow-none focus-visible:border-green-500 focus-visible:ring-0"
              />
            </div>
          )}

          <div>
            <label
              htmlFor="email"
              className="block text-[11px] font-semibold text-gray-700"
            >
              Email
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="mt-1 h-10 rounded-lg border-gray-200 bg-white text-sm shadow-none focus-visible:border-green-500 focus-visible:ring-0"
            />
          </div>

          <div>
            <div className="flex items-baseline justify-between">
              <label
                htmlFor="password"
                className="block text-[11px] font-semibold text-gray-700"
              >
                Password
              </label>
              {isLogin && (
                <button className="text-[11px] font-semibold text-green-700 hover:text-green-800">
                  Forgot?
                </button>
              )}
            </div>
            <div className="relative mt-1">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="h-10 rounded-lg border-gray-200 bg-white pr-10 text-sm shadow-none focus-visible:border-green-500 focus-visible:ring-0"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" strokeWidth={2} />
                ) : (
                  <Eye className="h-4 w-4" strokeWidth={2} />
                )}
              </button>
            </div>
          </div>
        </div>

        {error && (
          <p className="mt-2 text-xs font-medium text-red-600">{error}</p>
        )}

        <Button
          onClick={handleSubmit}
          className="mt-4 h-11 w-full rounded-lg bg-green-600 text-sm font-bold text-white hover:bg-green-700"
        >
          {isLogin ? "Sign in" : "Create account"}
        </Button>

        <p className="mt-5 text-center text-xs text-gray-500">
          {isLogin ? "No account?" : "Already have an account?"}{" "}
          <button
            onClick={() => setMode(isLogin ? "register" : "login")}
            className="font-bold text-green-700 hover:text-green-800"
          >
            {isLogin ? "Sign up" : "Sign in"}
          </button>
        </p>

        {!isLogin && (
          <p className="mt-4 text-center text-[10px] text-gray-400">
            By continuing, you agree to our{" "}
            <span className="font-semibold">Terms</span> and{" "}
            <span className="font-semibold">Privacy Policy</span>
          </p>
        )}
      </div>
    </PageShell>
  );
}