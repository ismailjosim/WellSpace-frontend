import AdminAnalyticsDashboard from "@/components/modules/Admin/Dashboard/AdminAnalyticsDashboard";
import { getDashboardMetaData } from "@/services/meta/dashboard.service";

type AdminDashboardPageProps = {
  searchParams?: Promise<{
    range?: string;
    granularity?: "day" | "week" | "month";
  }>;
};

export const dynamic = "force-dynamic";

const getRangeStartDate = (range: string) => {
  const days = Number(range);
  const safeDays = Number.isFinite(days) && days > 0 ? days : 30;
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - safeDays);
  return startDate.toISOString();
};

const AdminDashboardPage = async ({
  searchParams,
}: AdminDashboardPageProps) => {
  const params = await searchParams;
  const activeRange = params?.range || "30";
  const queryParams = new URLSearchParams({
    startDate: getRangeStartDate(activeRange),
    endDate: new Date().toISOString(),
    granularity:
      params?.granularity || (Number(activeRange) > 90 ? "month" : "day"),
  });

  const response = await getDashboardMetaData(queryParams.toString());

  if (!response?.success || !response?.data) {
    return (
      <div className="rounded-md border border-destructive/30 bg-destructive/5 p-6">
        <h1 className="text-2xl font-semibold">Admin Analytics</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {response?.message || "Unable to load dashboard analytics."}
        </p>
      </div>
    );
  }

  return (
    <AdminAnalyticsDashboard data={response.data} activeRange={activeRange} />
  );
};

export default AdminDashboardPage;
