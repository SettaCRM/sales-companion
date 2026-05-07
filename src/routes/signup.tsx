import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const INDUSTRIES: { value: string; label: string }[] = [
  { value: "health_medical", label: "Health & Medical" },
  { value: "fitness_wellness_coaching", label: "Fitness, Wellness & Coaching" },
  { value: "beauty_personal_care", label: "Beauty & Personal Care" },
  { value: "home_services_trades", label: "Home Services & Trades" },
  { value: "automotive_transport", label: "Automotive & Transport" },
  { value: "real_estate_property", label: "Real Estate & Property" },
  { value: "finance_legal_professional", label: "Finance, Legal & Professional Services" },
  { value: "marketing_media_creative", label: "Marketing, Media & Creative" },
  { value: "technology_saas", label: "Technology & SaaS" },
  { value: "education_training", label: "Education & Training" },
  { value: "hospitality_events", label: "Hospitality, Events & Entertainment" },
  { value: "pet_animal", label: "Pet & Animal Services" },
  { value: "construction_industrial", label: "Construction & Industrial" },
  { value: "community_care_nonprofit", label: "Community, Care & Non-Profit" },
  { value: "sales_agencies_growth", label: "Sales, Agencies & Business Growth" },
  { value: "generic", label: "Other / General" },
];

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Sign up — Setta CRM" },
      {
        name: "description",
        content: "Create your Setta CRM account and get a CRM tailored to your industry.",
      },
    ],
  }),
  component: SignupPage,
});

const schema = z.object({
  fullName: z.string().trim().min(1, "Required").max(120),
  businessName: z.string().trim().min(1, "Required").max(120),
  industry: z.string().min(1, "Select an industry"),
  email: z.string().email(),
  password: z.string().min(8, "At least 8 characters"),
});
type FormValues = z.infer<typeof schema>;

function SignupPage() {
  const [submitted, setSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: FormValues) => {
    const { error } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
      options: {
        data: {
          full_name: values.fullName,
          business_name: values.businessName,
          industry: values.industry,
          signup_type: "sub_account",
        },
        emailRedirectTo: `${window.location.origin}/dashboard`,
      },
    });
    if (error) {
      toast.error(error.message);
      return;
    }
    setSubmitted(true);
    toast.success("Account created");
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Sign up</CardTitle>
          <CardDescription>Get your white-label CRM in minutes</CardDescription>
        </CardHeader>
        <CardContent>
          {submitted ? (
            <div className="space-y-4">
              <p className="text-sm">Check your email to confirm your account.</p>
              <Button asChild variant="outline" className="w-full">
                <Link to="/login">Back to login</Link>
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full name</Label>
                <Input id="fullName" {...register("fullName")} />
                {errors.fullName && (
                  <p className="text-sm text-destructive">{errors.fullName.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="businessName">Business name</Label>
                <Input id="businessName" {...register("businessName")} />
                {errors.businessName && (
                  <p className="text-sm text-destructive">{errors.businessName.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Industry</Label>
                <Controller
                  control={control}
                  name="industry"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your industry" />
                      </SelectTrigger>
                      <SelectContent>
                        {INDUSTRIES.map((i) => (
                          <SelectItem key={i.value} value={i.value}>
                            {i.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.industry && (
                  <p className="text-sm text-destructive">{errors.industry.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" {...register("email")} />
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" {...register("password")} />
                {errors.password && (
                  <p className="text-sm text-destructive">{errors.password.message}</p>
                )}
              </div>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Creating account..." : "Create account"}
              </Button>
            </form>
          )}
          <p className="mt-4 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="font-medium text-foreground underline">
              Log in
            </Link>
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
