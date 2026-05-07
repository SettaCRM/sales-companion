import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [{ title: "Dashboard — Setta CRM" }],
  }),
  component: DashboardPage,
});

interface SubAccount {
  id: string;
  business_name: string;
  industry: string;
  slug: string;
}

function DashboardPage() {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [subAccount, setSubAccount] = useState<SubAccount | null>(null);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      navigate({ to: "/login" });
    }
  }, [loading, user, navigate]);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    (async () => {
      const { data, error } = await supabase
        .from("sub_account_staff")
        .select("sub_account_id, role, sub_accounts(id, business_name, industry, slug)")
        .eq("user_id", user.id)
        .single();
      if (cancelled) return;
      if (!error && data) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setSubAccount((data as any).sub_accounts);
      }
      setFetching(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [user]);

  const handleSignOut = async () => {
    await signOut();
    navigate({ to: "/" });
  };

  if (loading || !user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-muted-foreground">Loading...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background px-6 py-10">
      <div className="mx-auto max-w-5xl space-y-8">
        <header className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {fetching
                ? "Welcome"
                : subAccount
                  ? `Welcome to ${subAccount.business_name}`
                  : "Welcome"}
            </h1>
            {subAccount && (
              <Badge variant="secondary" className="mt-2">
                {subAccount.industry}
              </Badge>
            )}
          </div>
          <Button variant="outline" onClick={handleSignOut}>
            Sign out
          </Button>
        </header>

        <Card>
          <CardHeader>
            <CardTitle>Pipeline</CardTitle>
            <CardDescription>
              Your pipeline will appear here.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex h-40 items-center justify-center rounded-md border border-dashed text-sm text-muted-foreground">
              Coming soon
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
