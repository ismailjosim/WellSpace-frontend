"use client";

import { useState } from "react";
import { IFollowUpCareItem } from "@/services/prescription/followup.service";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  CalendarClock,
  Clock,
  Calendar,
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  FileText,
} from "lucide-react";
import Link from "next/link";
import { getInitials } from "@/lib/formatters.ts";

interface PatientFollowUpsWidgetProps {
  followUps: IFollowUpCareItem[];
}

export default function PatientFollowUpsWidget({
  followUps,
}: PatientFollowUpsWidgetProps) {
  const [activeTab, setActiveTab] = useState<"ACTIVE" | "ALL">("ACTIVE");

  const filteredItems = followUps.filter((item) => {
    if (activeTab === "ACTIVE") {
      return (
        item.followUpStatus === "PENDING" || item.followUpStatus === "OVERDUE"
      );
    }
    return true;
  });

  const getDueBadge = (targetDateStr: string, status: string) => {
    if (status === "BOOKED") {
      return (
        <Badge
          variant="default"
          className="bg-emerald-600 text-white text-[11px] gap-1"
        >
          <CheckCircle2 className="h-3 w-3" /> Booked
        </Badge>
      );
    }

    const now = new Date();
    const target = new Date(targetDateStr);
    const diffDays = Math.ceil(
      (target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
    );

    if (diffDays < 0) {
      return (
        <Badge
          variant="destructive"
          className="text-[11px] gap-1 animate-pulse"
        >
          <AlertCircle className="h-3 w-3" /> Overdue by {Math.abs(diffDays)}d
        </Badge>
      );
    }

    if (diffDays === 0) {
      return (
        <Badge
          variant="default"
          className="bg-amber-600 text-white text-[11px] gap-1"
        >
          <Clock className="h-3 w-3" /> Due Today
        </Badge>
      );
    }

    return (
      <Badge variant="secondary" className="text-[11px] font-medium gap-1">
        <Calendar className="h-3 w-3 text-primary" /> Due in {diffDays} days
      </Badge>
    );
  };

  return (
    <Card className="border shadow-sm overflow-hidden">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 bg-muted/20 border-b gap-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
            <CalendarClock className="h-4 w-4" />
          </div>
          <div>
            <CardTitle className="text-base font-bold">
              Upcoming Follow-Up Consultations
            </CardTitle>
            <CardDescription className="text-xs">
              Post-treatment check-ups recommended by your attending physicians.
            </CardDescription>
          </div>
        </div>

        <div className="flex items-center gap-1.5 self-end sm:self-auto">
          <Button
            size="sm"
            variant={activeTab === "ACTIVE" ? "default" : "ghost"}
            onClick={() => setActiveTab("ACTIVE")}
            className="h-7 text-xs px-2.5"
          >
            Action Needed (
            {
              followUps.filter(
                (f) =>
                  f.followUpStatus === "PENDING" ||
                  f.followUpStatus === "OVERDUE",
              ).length
            }
            )
          </Button>
          <Button
            size="sm"
            variant={activeTab === "ALL" ? "default" : "ghost"}
            onClick={() => setActiveTab("ALL")}
            className="h-7 text-xs px-2.5"
          >
            All Follow-Ups ({followUps.length})
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-4 space-y-3">
        {filteredItems.length === 0 ? (
          <div className="text-center py-6 text-xs text-muted-foreground">
            <CheckCircle2 className="h-8 w-8 text-emerald-500 mx-auto mb-2 opacity-80" />
            <p className="font-medium">
              No pending follow-up consultations at this time.
            </p>
            <p className="text-[11px] mt-0.5">
              Prescribed follow-up dates and clinical recovery checkpoints will
              appear here automatically.
            </p>
          </div>
        ) : (
          filteredItems.map((item) => {
            const specialty =
              item.doctor.doctorSpecialties?.[0]?.specialties?.title ||
              "Specialist";

            return (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-3.5 rounded-xl border bg-card hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <Avatar className="h-10 w-10 border shadow-xs">
                    <AvatarImage
                      src={item.doctor.profilePhoto || undefined}
                      alt={item.doctor.name}
                    />
                    <AvatarFallback className="text-xs">
                      {getInitials(item.doctor.name)}
                    </AvatarFallback>
                  </Avatar>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-sm">
                        Dr. {item.doctor.name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        • {specialty}
                      </span>
                      {getDueBadge(item.followUpDate, item.followUpStatus)}
                    </div>

                    <p className="text-xs text-muted-foreground line-clamp-1 italic">
                      &quot;{item.instructions}&quot;
                    </p>

                    <div className="flex items-center gap-3 text-[11px] text-muted-foreground font-mono">
                      <span>
                        Target Date:{" "}
                        {new Date(item.followUpDate).toLocaleDateString()}
                      </span>
                      <span>
                        Consultation Fee: ${item.doctor.appointmentFee}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                  <Link href={`/dashboard/my-prescriptions/${item.id}`}>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 text-xs gap-1"
                    >
                      <FileText className="h-3.5 w-3.5" /> View Rx
                    </Button>
                  </Link>

                  {item.followUpStatus !== "BOOKED" && (
                    <Link
                      href={`/consultation?searchTerm=${encodeURIComponent(item.doctor.name)}`}
                    >
                      <Button size="sm" className="h-8 text-xs gap-1">
                        Book Follow-Up <ChevronRight className="h-3.5 w-3.5" />
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}
