import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { verifyAppointmentPayment } from "@/services/payment/payment.service";

interface PaymentSuccessPageProps {
  searchParams: Promise<{
    session_id?: string;
    appointmentId?: string;
  }>;
}

export default async function PaymentSuccessPage({
  searchParams,
}: PaymentSuccessPageProps) {
  const params = await searchParams;
  const appointmentId = params.appointmentId;
  const verification = params.session_id
    ? await verifyAppointmentPayment(params.session_id)
    : null;
  const paymentConfirmed =
    verification?.success && verification.data?.paymentStatus === "PAID";

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 bg-muted/20">
      <Card className="w-full max-w-lg border-green-500/30 shadow-lg text-center">
        <CardHeader className="space-y-4 pb-2">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-950/60 text-green-600 dark:text-green-400">
            <CheckCircle2 className="h-10 w-10 animate-in zoom-in-75 duration-300" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold tracking-tight text-foreground">
              {paymentConfirmed ? "Payment Successful!" : "Payment Processing"}
            </CardTitle>
            <CardDescription className="text-muted-foreground mt-1.5">
              {paymentConfirmed
                ? "Your consultation booking has been confirmed and registered with the doctor."
                : "We are verifying your payment. Your appointment status will update as soon as Stripe confirms it."}
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-4 pt-4">
          <div className="rounded-xl bg-card border p-4 text-left space-y-2.5 text-sm">
            <div className="flex justify-between items-center text-muted-foreground">
              <span>Status</span>
              <span className="font-semibold text-green-600 dark:text-green-400 uppercase text-xs tracking-wider bg-green-100 dark:bg-green-950/50 px-2 py-0.5 rounded-full">
                {paymentConfirmed ? "PAID & CONFIRMED" : "CONFIRMATION PENDING"}
              </span>
            </div>

            {appointmentId && (
              <div className="flex justify-between items-center text-muted-foreground">
                <span>Appointment Ref</span>
                <span className="font-mono text-xs text-foreground font-medium">
                  {appointmentId.slice(0, 13)}...
                </span>
              </div>
            )}

            <div className="border-t pt-2.5 flex justify-between items-center text-muted-foreground text-xs">
              <span>Next Step:</span>
              <span className="text-foreground">
                Check dashboard for schedule details
              </span>
            </div>
          </div>

          <p className="text-xs text-muted-foreground">
            A confirmation receipt and notification has been dispatched to your
            account.
          </p>
        </CardContent>

        <CardFooter className="flex flex-col sm:flex-row gap-3 pt-2">
          <Button asChild className="w-full sm:flex-1" variant="default">
            <Link href="/dashboard/my-appointments">
              <span>My Appointments</span>
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>

          <Button asChild className="w-full sm:flex-1" variant="outline">
            <Link href="/dashboard">Go to Dashboard</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
