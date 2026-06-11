"use client";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import {
  Activity,
  Banknote,
  CalendarClock,
  CircleDollarSign,
  CreditCard,
  Star,
  Stethoscope,
  Users,
} from "lucide-react";
import Link from "next/link";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from "recharts";

type CountByLabel = {
  status?: string;
  role?: string;
  count: number;
};

type AdminAnalyticsData = {
  patientCount: number;
  doctorCount: number;
  adminCount: number;
  appointmentCount: number;
  paymentCount: number;
  totalRevenue: number;
  periodRevenue: number;
  canceledAppointmentRate: number;
  dateRange: {
    startDate: string;
    endDate: string;
    granularity: "day" | "week" | "month";
  };
  userRoleDistribution: CountByLabel[];
  userStatusDistribution: CountByLabel[];
  paidVsUnpaidAppointments: CountByLabel[];
  topSpecialties: {
    id: string;
    title: string;
    doctorCount: number;
  }[];
  topRatedDoctors: {
    id: string;
    name: string;
    designation: string;
    averageRating: number;
    reviewCount: number;
    appointmentCount: number;
  }[];
  barChartData: {
    month: string;
    count: number;
  }[];
  pieChartData: CountByLabel[];
};

interface AdminAnalyticsDashboardProps {
  data: AdminAnalyticsData;
  activeRange: string;
}

const appointmentChartConfig = {
  count: {
    label: "Appointments",
    color: "#2563eb",
  },
} satisfies ChartConfig;

const statusChartConfig = {
  count: {
    label: "Appointments",
    color: "#0f766e",
  },
} satisfies ChartConfig;

const roleChartConfig = {
  count: {
    label: "Users",
    color: "#7c3aed",
  },
} satisfies ChartConfig;

const pieColors = ["#2563eb", "#0f766e", "#f59e0b", "#dc2626", "#7c3aed"];

const formatEnum = (value?: string) =>
  value ? value.replaceAll("_", " ") : "Unknown";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value || 0);

const getDateLabel = (value: string, granularity: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  if (granularity === "month") return format(date, "MMM yyyy");
  if (granularity === "week") return format(date, "MMM d");
  return format(date, "MMM d");
};

function MetricCard({
  title,
  value,
  description,
  icon: Icon,
}: {
  title: string;
  value: string | number;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div>
          <CardDescription>{title}</CardDescription>
          <CardTitle className="mt-2 text-2xl font-semibold tabular-nums">
            {value}
          </CardTitle>
        </div>
        <div className="rounded-md border bg-muted p-2">
          <Icon className="h-5 w-5 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

function ProgressBar({ value }: { value: number }) {
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
      <div
        className="h-full rounded-full bg-primary transition-all"
        style={{ width: `${Math.min(Math.max(value, 0), 100)}%` }}
      />
    </div>
  );
}

export default function AdminAnalyticsDashboard({
  data,
  activeRange,
}: AdminAnalyticsDashboardProps) {
  const totalUsers = data.patientCount + data.doctorCount + data.adminCount;
  const maxSpecialtyDoctors = Math.max(
    ...data.topSpecialties.map((specialty) => specialty.doctorCount),
    1,
  );
  const activeUsers =
    data.userStatusDistribution.find((item) => item.status === "ACTIVE")
      ?.count || 0;
  const blockedUsers =
    data.userStatusDistribution.find((item) => item.status === "BLOCKED")
      ?.count || 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Analytics</h1>
          <p className="mt-2 text-muted-foreground">
            Platform operations, revenue, appointments, and provider quality.
          </p>
        </div>
        <Tabs value={activeRange} className="w-full lg:w-auto">
          <TabsList className="w-full grid grid-cols-4 lg:w-fit">
            <TabsTrigger value="7" asChild>
              <Link href="/admin/dashboard?range=7">7d</Link>
            </TabsTrigger>
            <TabsTrigger value="30" asChild>
              <Link href="/admin/dashboard?range=30">30d</Link>
            </TabsTrigger>
            <TabsTrigger value="90" asChild>
              <Link href="/admin/dashboard?range=90&granularity=week">90d</Link>
            </TabsTrigger>
            <TabsTrigger value="365" asChild>
              <Link href="/admin/dashboard?range=365&granularity=month">
                1y
              </Link>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title="Total Users"
          value={totalUsers.toLocaleString()}
          description={`${activeUsers.toLocaleString()} active, ${blockedUsers.toLocaleString()} blocked`}
          icon={Users}
        />
        <MetricCard
          title="Appointments"
          value={data.appointmentCount.toLocaleString()}
          description={`${data.canceledAppointmentRate}% canceled in selected range`}
          icon={CalendarClock}
        />
        <MetricCard
          title="Period Revenue"
          value={formatCurrency(data.periodRevenue)}
          description={`${data.paymentCount.toLocaleString()} payment records in selected range`}
          icon={CircleDollarSign}
        />
        <MetricCard
          title="All-Time Revenue"
          value={formatCurrency(data.totalRevenue)}
          description="Collected from paid appointment payments"
          icon={Banknote}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(360px,0.55fr)]">
        <Card>
          <CardHeader>
            <CardTitle>Appointment Trend</CardTitle>
            <CardDescription>
              {format(new Date(data.dateRange.startDate), "PP")} to{" "}
              {format(new Date(data.dateRange.endDate), "PP")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={appointmentChartConfig}
              className="h-[320px] w-full"
            >
              <AreaChart
                accessibilityLayer
                data={data.barChartData.map((item) => ({
                  ...item,
                  label: getDateLabel(item.month, data.dateRange.granularity),
                }))}
                margin={{ left: 0, right: 16 }}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="label"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  minTickGap={24}
                />
                <YAxis tickLine={false} axisLine={false} width={32} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area
                  dataKey="count"
                  type="monotone"
                  fill="var(--color-count)"
                  fillOpacity={0.18}
                  stroke="var(--color-count)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Appointment Status</CardTitle>
            <CardDescription>Current selected period</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={statusChartConfig}
              className="h-[320px] w-full"
            >
              <PieChart accessibilityLayer>
                <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                <Pie
                  data={data.pieChartData.map((item) => ({
                    name: formatEnum(item.status),
                    count: item.count,
                  }))}
                  dataKey="count"
                  nameKey="name"
                  innerRadius={62}
                  outerRadius={102}
                  paddingAngle={3}
                >
                  {data.pieChartData.map((item, index) => (
                    <Cell
                      key={`${item.status}-${index}`}
                      fill={pieColors[index % pieColors.length]}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>User Mix</CardTitle>
            <CardDescription>Total users by role</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={roleChartConfig} className="h-[260px]">
              <BarChart
                accessibilityLayer
                data={data.userRoleDistribution.map((item) => ({
                  role: formatEnum(item.role),
                  count: item.count,
                }))}
              >
                <CartesianGrid vertical={false} />
                <XAxis dataKey="role" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} width={32} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="count" fill="var(--color-count)" radius={4} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment Status</CardTitle>
            <CardDescription>Paid vs unpaid appointments</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.paidVsUnpaidAppointments.map((item) => (
              <div key={item.status} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">
                      {formatEnum(item.status)}
                    </span>
                  </div>
                  <span className="tabular-nums">{item.count}</span>
                </div>
                <ProgressBar
                  value={
                    data.appointmentCount
                      ? (item.count / data.appointmentCount) * 100
                      : 0
                  }
                />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Specialties</CardTitle>
            <CardDescription>By assigned doctor count</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.topSpecialties.map((specialty) => (
              <div key={specialty.id} className="space-y-2">
                <div className="flex items-center justify-between gap-3 text-sm">
                  <div className="flex min-w-0 items-center gap-2">
                    <Stethoscope className="h-4 w-4 shrink-0 text-muted-foreground" />
                    <span className="truncate font-medium">
                      {specialty.title}
                    </span>
                  </div>
                  <Badge variant="outline">
                    {specialty.doctorCount} doctors
                  </Badge>
                </div>
                <ProgressBar
                  value={(specialty.doctorCount / maxSpecialtyDoctors) * 100}
                />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Top-Rated Doctors</CardTitle>
          <CardDescription>
            Ranking by average rating, with review and appointment volume.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
            {data.topRatedDoctors.map((doctor) => (
              <div key={doctor.id} className="rounded-md border p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate font-medium">{doctor.name}</p>
                    <p className="mt-1 truncate text-xs text-muted-foreground">
                      {doctor.designation}
                    </p>
                  </div>
                  <Badge variant="secondary" className="shrink-0">
                    <Star className="mr-1 h-3 w-3" />
                    {doctor.averageRating.toFixed(1)}
                  </Badge>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                  <div className="rounded-md bg-muted p-2">
                    <p className="text-xs text-muted-foreground">Reviews</p>
                    <p className="font-medium tabular-nums">
                      {doctor.reviewCount}
                    </p>
                  </div>
                  <div className="rounded-md bg-muted p-2">
                    <p className="text-xs text-muted-foreground">
                      Appointments
                    </p>
                    <p className="font-medium tabular-nums">
                      {doctor.appointmentCount}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Operational Health</CardTitle>
          <CardDescription>Fast signals for admin review</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-3">
          <div className="flex items-center gap-3 rounded-md border p-4">
            <Activity className="h-5 w-5 text-green-600" />
            <div>
              <p className="font-medium">Active Accounts</p>
              <p className="text-sm text-muted-foreground">
                {activeUsers.toLocaleString()} users can access the platform
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-md border p-4">
            <Users className="h-5 w-5 text-amber-600" />
            <div>
              <p className="font-medium">Blocked Accounts</p>
              <p className="text-sm text-muted-foreground">
                {blockedUsers.toLocaleString()} accounts need review
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-md border p-4">
            <CalendarClock className="h-5 w-5 text-red-600" />
            <div>
              <p className="font-medium">Canceled Rate</p>
              <p className="text-sm text-muted-foreground">
                {data.canceledAppointmentRate}% of appointments in range
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
