import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { XCircle, RefreshCw, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface PaymentFailedPageProps {
  searchParams: Promise<{
    appointmentId?: string;
  }>;
}

export default async function PaymentFailedPage({
  searchParams,
}: PaymentFailedPageProps) {
  const params = await searchParams;
  const appointmentId = params.appointmentId;

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 bg-muted/20">
      <Card className="w-full max-w-lg border-destructive/30 shadow-lg text-center">
        <CardHeader className="space-y-4 pb-2">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 text-destructive">
            <XCircle className="h-10 w-10 animate-in zoom-in-75 duration-300" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold tracking-tight text-foreground">
              Payment Incomplete
            </CardTitle>
            <CardDescription className="text-muted-foreground mt-1.5">
              We couldn&apos;t complete your payment or the checkout session was
              canceled.
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-4 pt-4">
          <div className="rounded-xl bg-card border p-4 text-left space-y-2 text-sm text-muted-foreground">
            <p className="text-foreground font-medium">Why did this happen?</p>
            <ul className="list-disc list-inside space-y-1 text-xs">
              <li>Card declined by issuing bank or insufficient balance.</li>
              <li>Checkout session was manually closed or expired.</li>
              <li>Network interruption during Stripe payment handshake.</li>
            </ul>
            {appointmentId && (
              <p className="text-xs text-muted-foreground pt-1 border-t">
                Appointment Reference:{" "}
                <span className="font-mono font-medium text-foreground">
                  {appointmentId.slice(0, 13)}...
                </span>
              </p>
            )}
          </div>

          <p className="text-xs text-muted-foreground">
            Don&apos;t worry! Your appointment slot is temporarily reserved in
            unpaid status. You can retry payment anytime from your appointments
            dashboard.
          </p>
        </CardContent>

        <CardFooter className="flex flex-col sm:flex-row gap-3 pt-2">
          <Button asChild className="w-full sm:flex-1" variant="default">
            <Link href="/dashboard/my-appointments">
              <RefreshCw className="mr-2 h-4 w-4" />
              <span>Retry in Appointments</span>
            </Link>
          </Button>

          <Button asChild className="w-full sm:flex-1" variant="outline">
            <Link href="/consultation">
              <ArrowLeft className="mr-2 h-4 w-4" />
              <span>Back to Doctors</span>
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
