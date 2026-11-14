import ResetPasswordForm from "@/components/ResetPasswordForm";

const ResetPasswordPage = async ({
  searchParams,
}: {
  searchParams?: Promise<{ redirect?: string; id?: string; token?: string }>;
}) => {
  const params = (await searchParams) || {};
  const redirect = params.redirect;
  const token = params.token;
  const id = params.id;
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6 rounded-3xl border bg-card p-8 shadow-xl">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold tracking-tight">
            Reset Your Password
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter your new password below to reset your account credentials.
          </p>
        </div>
        <ResetPasswordForm redirect={redirect} token={token} userId={id} />
      </div>
    </div>
  );
};

export default ResetPasswordPage;
