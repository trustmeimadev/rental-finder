import { useNavigate } from "react-router-dom";
import {
  Building2,
  MessageCircle,
  Users,
  Eye,
  Plus,
  ChevronRight,
  BadgeCheck,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import PageShell from "@/components/layout/pageShell";
import { MOCK_DASHBOARD } from "@/mocks/landlordDashboard";

const formatPeso = (n: number) =>
  new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    maximumFractionDigits: 0,
  }).format(n);

function DashboardHeader({ name }: { name: string }) {
  return (
    <section className="pt-4">
      <p className="text-muted-foreground text-xs">Welcome back,</p>
      <h1 className="mt-0.5 text-xl leading-tight font-bold text-gray-900">
        {name}
      </h1>
    </section>
  );
}

function SubscriptionSection({
  subscription,
}: {
  subscription: typeof MOCK_DASHBOARD.subscription;
}) {
  if (subscription.status === "trial") {
    return (
      <div className="border-border mt-3 rounded-xl border p-3">
        <div className="flex items-center gap-1.5">
          <BadgeCheck className="h-3.5 w-3.5 text-green-600" />
          <p className="text-xs font-semibold text-gray-900">
            Manager plan — Trial
          </p>
        </div>
        <p className="mt-0.5 text-[11px] text-muted-foreground">
          {subscription.daysLeft} days left in your free trial
        </p>
      </div>
    );
  }

  if (subscription.status === "active") {
    return (
      <div className="border-border mt-3 rounded-xl border p-3">
        <div className="flex items-center gap-1.5">
          <BadgeCheck className="h-3.5 w-3.5 text-green-600" />
          <p className="text-xs font-semibold text-gray-900">
            Manager plan · Active
          </p>
        </div>
        <p className="mt-0.5 text-[11px] text-muted-foreground">
          Renews on {new Date(subscription.endsAt).toLocaleDateString("en-PH")}
        </p>
      </div>
    );
  }

  if (subscription.status === "expired") {
    return (
      <div className="border-border mt-3 flex items-center justify-between rounded-xl border p-3">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold text-gray-900">
            Manager plan expired
          </p>
          <p className="mt-0.5 text-[11px] text-muted-foreground">
            Renew to continue managing
          </p>
        </div>
        <Button
          size="sm"
          className="h-7 shrink-0 rounded-lg bg-green-600 px-3 text-[11px] font-semibold text-white hover:bg-green-700"
        >
          Renew
        </Button>
      </div>
    );
  }

  return (
    <div className="border-border mt-3 flex items-center justify-between rounded-xl border p-3">
      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold text-gray-900">Try Manager plan</p>
        <p className="mt-0.5 text-[11px] text-muted-foreground">
          1 month free trial
        </p>
      </div>
      <Button
        size="sm"
        className="h-7 shrink-0 rounded-lg bg-green-600 px-3 text-[11px] font-semibold text-white hover:bg-green-700"
      >
        Start trial
      </Button>
    </div>
  );
}

function VerificationSection({ isVerified }: { isVerified: boolean }) {
  return (
    <div className="border-border mt-2 rounded-xl border p-3">
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1">
            <p className="text-xs font-semibold text-gray-900">
              Verification status
            </p>
            {isVerified && (
              <BadgeCheck className="h-3.5 w-3.5 text-green-600" />
            )}
          </div>
          <p className="mt-0.5 text-[11px] text-muted-foreground">
            {isVerified ? "Verified landlord" : "Not verified"}
          </p>
        </div>

        {isVerified ? (
          <span className="shrink-0 rounded-full bg-green-50 px-2 py-0.5 text-[10px] font-semibold text-green-700">
            Verified
          </span>
        ) : (
          <Button
            variant="outline"
            size="sm"
            className="h-7 shrink-0 rounded-lg border-green-200 bg-green-50 px-2.5 text-[11px] font-semibold text-green-700 hover:bg-green-100"
          >
            Get verified · ₱150
          </Button>
        )}
      </div>

      {!isVerified && (
        <div className="mt-2 flex items-start gap-1.5 rounded-md bg-gray-50 p-2 text-[11px] text-gray-600">
          <Info className="h-3.5 w-3.5 shrink-0 text-gray-500" />
          <p>Optional but helps tenants trust your listings.</p>
        </div>
      )}
    </div>
  );
}

function OverviewSection({
  revenue,
  stats,
}: {
  revenue: number;
  stats: typeof MOCK_DASHBOARD.stats;
}) {
  return (
    <section className="mt-5">
      <h2 className="text-sm font-bold">Overview</h2>

      <div className="border-border mt-2 rounded-xl border p-3">
        <p className="text-[11px] text-muted-foreground">
          Expected this month
        </p>
        <p className="mt-0.5 text-xl font-bold text-green-700">
          {formatPeso(revenue)}
        </p>
        <p className="text-[11px] text-muted-foreground">
          From {stats.activeTenants} active tenants
        </p>
      </div>

      <div className="border-border mt-2 grid grid-cols-3 gap-3 rounded-xl border p-3">
        <div>
          <p className="text-[11px] text-muted-foreground">Listings</p>
          <p className="mt-0.5 flex items-center gap-1 text-sm font-bold">
            <Building2 className="h-3.5 w-3.5 text-green-600" />
            {stats.totalListings}
          </p>
        </div>
        <div>
          <p className="text-[11px] text-muted-foreground">Inquiries</p>
          <p className="mt-0.5 flex items-center gap-1 text-sm font-bold">
            <MessageCircle className="h-3.5 w-3.5 text-green-600" />
            {stats.activeInquiries}
          </p>
        </div>
        <div>
          <p className="text-[11px] text-muted-foreground">Views</p>
          <p className="mt-0.5 flex items-center gap-1 text-sm font-bold">
            <Eye className="h-3.5 w-3.5 text-green-600" />
            {stats.totalViews}
          </p>
        </div>
      </div>
    </section>
  );
}

function QuickActionsSection() {
  const navigate = useNavigate();

  return (
    <section className="mt-5">
      <h2 className="text-sm font-bold">Quick actions</h2>
      <div className="mt-2 flex gap-2">
        <Button
          onClick={() => navigate("/landlord/listings/new")}
          className="h-10 flex-1 gap-1.5 rounded-xl bg-green-600 text-xs font-semibold text-white hover:bg-green-700"
        >
          <Plus className="h-3.5 w-3.5" />
          Add listing
        </Button>
        <Button
          onClick={() => navigate("/landlord/tenants/new")}
          variant="outline"
          className="h-10 flex-1 gap-1.5 rounded-xl border-green-200 bg-green-50 text-xs font-semibold text-green-700 hover:bg-green-100"
        >
          <Users className="h-3.5 w-3.5" />
          Add tenant
        </Button>
      </div>
    </section>
  );
}

function InquiryRow({
  inquiry,
  onClick,
}: {
  inquiry: (typeof MOCK_DASHBOARD.recentInquiries)[0];
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="border-border flex w-full items-start gap-2.5 rounded-xl border p-2.5 text-left transition-colors hover:bg-gray-50"
    >
      <Avatar className="h-8 w-8 shrink-0">
        <AvatarFallback className="bg-green-100 text-[10px] font-bold text-green-700">
          {inquiry.tenantName
            .split(" ")
            .map((n) => n[0])
            .slice(0, 2)
            .join("")}
        </AvatarFallback>
      </Avatar>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <p className="truncate text-xs font-semibold text-gray-900">
            {inquiry.tenantName}
          </p>
          {inquiry.unread && (
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-green-600" />
          )}
        </div>
        <p className="text-muted-foreground truncate text-[10px]">
          {inquiry.listingTitle}
        </p>
        <p className="mt-0.5 line-clamp-1 text-[11px] text-gray-700">
          {inquiry.message}
        </p>
      </div>
      <span className="text-muted-foreground shrink-0 text-[10px]">
        {inquiry.timeAgo}
      </span>
    </button>
  );
}

function InquiriesSection({
  inquiries,
}: {
  inquiries: typeof MOCK_DASHBOARD.recentInquiries;
}) {
  const navigate = useNavigate();

  return (
    <section className="mt-5">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold">Recent inquiries</h2>
        {inquiries.length > 0 && (
          <button
            onClick={() => navigate("/landlord/inquiries")}
            className="flex items-center gap-0.5 text-[11px] font-semibold text-green-700"
          >
            See all
            <ChevronRight className="h-3 w-3" />
          </button>
        )}
      </div>

      {inquiries.length === 0 ? (
        <div className="border-border mt-2 flex flex-col items-center rounded-xl border py-6 text-center">
          <MessageCircle className="h-6 w-6 text-gray-300" />
          <p className="mt-1.5 text-xs font-semibold text-gray-900">
            No inquiries yet
          </p>
          <p className="text-muted-foreground mt-0.5 text-[11px]">
            Tenant messages will appear here
          </p>
        </div>
      ) : (
        <div className="mt-2 space-y-1.5">
          {inquiries.map((inq) => (
            <InquiryRow
              key={inq.id}
              inquiry={inq}
              onClick={() => navigate(`/landlord/inquiries/${inq.id}`)}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default function LandlordDashboard() {
  const data = MOCK_DASHBOARD;

  return (
    <PageShell>
      <DashboardHeader name={data.landlordName} />
      <SubscriptionSection subscription={data.subscription} />
      <VerificationSection isVerified={data.isVerified} />
      <OverviewSection
        revenue={data.stats.monthlyRevenue}
        stats={data.stats}
      />
      <QuickActionsSection />
      <InquiriesSection inquiries={data.recentInquiries} />
      <div className="h-20" />
    </PageShell>
  );
}