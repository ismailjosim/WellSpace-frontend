"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, RotateCcw, Home } from "lucide-react";
import Link from "next/link";

export default function CommonLayoutError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[Public Page Error]:", error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center p-4">
      <Card className="max-w-lg w-full border-destructive/20 shadow-lg text-center p-6">
        <CardContent className="space-y-5 pt-4">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
            <AlertTriangle className="h-8 w-8" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              Unable to Load Page
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              We encountered a temporary network or server issue while preparing
              this healthcare resource.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <Button onClick={() => reset()} className="gap-2">
              <RotateCcw className="h-4 w-4" />
              Reload Content
            </Button>
            <Link href="/">
              <Button variant="outline" className="w-full gap-2">
                <Home className="h-4 w-4" />
                Return to Home
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
