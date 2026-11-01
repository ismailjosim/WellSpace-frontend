import LoginForm from "@/components/modules/Auth/LoginForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BrandLogo } from "@/components/shared/BrandLogo";

const LoginPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string }>;
}) => {
  const { redirect } = (await searchParams) || {};
  return (
    <div className="relative min-h-[90vh] flex items-center justify-center p-4 bg-gradient-to-b from-background via-accent/20 to-background overflow-hidden">
      {/* Ambient decorative glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

      <Card className="relative w-full max-w-md rounded-3xl border border-border/60 bg-card/85 backdrop-blur-xl shadow-2xl p-2 sm:p-4">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <BrandLogo href="/" textSize="xl" />
          </div>
          <div className="space-y-1">
            <CardTitle className="text-2xl font-bold tracking-tight text-foreground">Welcome Back</CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              Sign in with your verified credentials to access care
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          <LoginForm redirect={redirect} />
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
