"use client";

import { Button } from "@repo/ui/components/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@repo/ui/components/card";
import { Input } from "@repo/ui/components/input";
import { useAppForm } from "@repo/ui/components/tanstack-form";
import { cn } from "@repo/ui/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useId } from "react";

import { authClient } from "@/lib/auth-client";
import { CheckIcon } from "lucide-react";
import { toast } from "sonner";
import { signinSchema, type SigninSchemaT } from "../schemas";

export function SigninForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const toastId = useId();
  const router = useRouter();

  const form = useAppForm({
    validators: { onChange: signinSchema },
    defaultValues: {
      email: "",
      password: "",
    },
    onSubmit: ({ value }) => handleSignin(value),
  });

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      e.stopPropagation();
      form.handleSubmit();
    },
    [form]
  );

  const handleSignin = async (values: SigninSchemaT) => {
    await authClient.signIn.email({
      email: values.email,
      password: values.password,
      fetchOptions: {
        onRequest() {
          toast.loading("Signing in...", { id: toastId });
        },
        onSuccess(ctx) {
          toast.success("User signed in successfully!", { id: toastId });
          window.location.href = "/admin/dashboard";
        },
        onError(ctx) {
          toast.error(`Failed: ${ctx.error.message}`, { id: toastId });
        },
      },
    });
  };

  return (
    <div className={cn("flex flex-col gap-8", className)} {...props}>
      <Card className="border-none shadow-[0_20px_50px_rgba(0,0,0,0.05)] rounded-[32px] overflow-hidden bg-white/80 backdrop-blur-xl ring-1 ring-black/5">
        <CardHeader className="pt-10 pb-2 text-center space-y-2">
          <CardTitle className="text-3xl font-heading font-black tracking-tight text-foreground">
            Welcome Back
          </CardTitle>
          <CardDescription className="text-base font-medium text-muted-foreground/80">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8 pt-6">
          <form.AppForm>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-5">
                <form.AppField
                  name="email"
                  children={(field) => (
                    <field.FormItem className="space-y-2">
                      <field.FormLabel className="text-xs font-bold uppercase tracking-widest text-muted-foreground/70 ml-1">Email Address</field.FormLabel>
                      <field.FormControl>
                        <Input
                          placeholder="name@company.com"
                          className="h-14 rounded-2xl border-black/5 bg-secondary/30 focus-visible:ring-primary focus-visible:border-primary transition-all text-base"
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          onBlur={field.handleBlur}
                        />
                      </field.FormControl>
                      <field.FormMessage className="text-xs font-bold text-rose-500" />
                    </field.FormItem>
                  )}
                />

                <form.AppField
                  name="password"
                  children={(field) => (
                    <field.FormItem className="space-y-2">
                      <div className="flex items-center justify-between ml-1">
                        <field.FormLabel className="text-xs font-bold uppercase tracking-widest text-muted-foreground/70">Password</field.FormLabel>
                        <Link
                          href="/forgot-password"
                          className="text-xs font-bold text-primary hover:text-primary/80 transition-colors"
                        >
                          Forgot Password?
                        </Link>
                      </div>
                      <field.FormControl>
                        <Input
                          type="password"
                          placeholder="••••••••"
                          className="h-14 rounded-2xl border-black/5 bg-secondary/30 focus-visible:ring-primary focus-visible:border-primary transition-all text-base"
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          onBlur={field.handleBlur}
                        />
                      </field.FormControl>
                      <field.FormMessage className="text-xs font-bold text-rose-500" />
                    </field.FormItem>
                  )}
                />
              </div>

              <Button
                type="submit"
                className="w-full h-14 rounded-2xl text-lg font-bold shadow-xl shadow-primary/20 hover:shadow-primary/30 active:scale-[0.98] transition-all"
                loading={form.state.isSubmitting}
                icon={form.state.isSubmitSuccessful && <CheckIcon className="size-5" />}
              >
                Sign In to Account
              </Button>

              <div className="relative py-2">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-black/5" />
                </div>
                <div className="relative flex justify-center text-xs uppercase font-bold tracking-widest">
                  <span className="bg-white px-4 text-muted-foreground/40 italic">New to CoreWavez?</span>
                </div>
              </div>

              <Button
                variant="outline"
                asChild
                className="w-full h-14 rounded-2xl text-lg font-bold border-black/5 hover:bg-secondary/50 transition-all"
              >
                <Link href="/signup">Create Free Account</Link>
              </Button>
            </form>
          </form.AppForm>
        </CardContent>
      </Card>
      <p className="text-center text-xs font-bold tracking-tight text-muted-foreground/60 max-w-[300px] mx-auto leading-relaxed">
        By continuing, you agree to our{" "}
        <a href="#" className="text-foreground hover:text-primary transition-colors underline decoration-black/10 underline-offset-4">Terms</a> and{" "}
        <a href="#" className="text-foreground hover:text-primary transition-colors underline decoration-black/10 underline-offset-4">Privacy Policy</a>
      </p>
    </div>
  );
}
