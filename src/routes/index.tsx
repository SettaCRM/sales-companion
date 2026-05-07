import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Setta CRM — The white-label CRM for service businesses" },
      {
        name: "description",
        content:
          "Setta CRM is the white-label CRM built for service businesses. Manage contacts, deals, and pipelines tailored to your industry.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background px-6 text-center">
      <h1 className="text-5xl font-bold tracking-tight text-foreground sm:text-6xl">
        Setta CRM
      </h1>
      <p className="mt-4 max-w-xl text-lg text-muted-foreground">
        The white-label CRM for service businesses.
      </p>
      <div className="mt-8 flex gap-3">
        <Button asChild variant="outline">
          <Link to="/login">Log in</Link>
        </Button>
        <Button asChild>
          <Link to="/signup">Sign up</Link>
        </Button>
      </div>
    </main>
  );
}
