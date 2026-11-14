/* eslint-disable @typescript-eslint/no-explicit-any */
import { getAllNotifications } from "@/services/notification/notification.server";
import Link from "next/link";
import {
  Bell,
  Calendar,
  CreditCard,
  FileText,
  ChevronRight,
  Clock,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export default async function NotificationsCenterPage() {
  const result = await getAllNotifications("limit=50");
  const notifications = result?.data?.notifications || [];
  const unreadCount = result?.data?.unreadCount || 0;

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "APPOINTMENT_BOOKED":
      case "APPOINTMENT_STATUS_UPDATED":
        return <Calendar className="h-5 w-5 text-primary" />;
      case "PAYMENT_COMPLETED":
        return <CreditCard className="h-5 w-5 text-emerald-500" />;
      case "PRESCRIPTION_CREATED":
        return <FileText className="h-5 w-5 text-blue-500" />;
      default:
        return <Bell className="h-5 w-5 text-primary" />;
    }
  };

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Notifications Inbox
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Stay updated with your appointments, medical prescriptions, and
            billing notices.
          </p>
        </div>
        {unreadCount > 0 && (
          <Badge
            variant="destructive"
            className="px-3 py-1 text-xs self-start sm:self-auto"
          >
            {unreadCount} Unread {unreadCount === 1 ? "Message" : "Messages"}
          </Badge>
        )}
      </div>

      <Card className="border shadow-sm overflow-hidden">
        <CardContent className="p-0 divide-y">
          {notifications.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mx-auto text-muted-foreground">
                <Bell className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-foreground">
                No notifications yet
              </h3>
              <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                You will receive alerts here when your consultations are booked,
                updated, or prescribed.
              </p>
            </div>
          ) : (
            notifications.map((item: any) => (
              <Link
                key={item.id}
                href={`/notifications/${item.id}`}
                className="flex items-start gap-4 p-5 hover:bg-accent/40 transition-colors group cursor-pointer"
              >
                <div
                  className={`mt-0.5 h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${item.isRead ? "bg-muted text-muted-foreground" : "bg-primary/10 text-primary"}`}
                >
                  {getTypeIcon(item.type)}
                </div>

                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <h3
                      className={`text-sm font-semibold truncate ${item.isRead ? "text-foreground" : "text-primary font-bold"}`}
                    >
                      {item.title}
                    </h3>
                    <span className="text-xs text-muted-foreground whitespace-nowrap flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {new Date(item.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                    {item.message}
                  </p>
                </div>

                <div className="self-center pl-2 text-muted-foreground group-hover:text-primary transition-colors">
                  <ChevronRight className="h-5 w-5" />
                </div>
              </Link>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
