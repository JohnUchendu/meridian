"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { ShieldCheck, TrendingUp } from "lucide-react";
import { loginAction, registerAction, type AuthState } from "./actions";

export default function AuthPage() {
  const [loginState, loginFormAction, loginPending] = useActionState<AuthState, FormData>(loginAction, undefined);
  const [registerState, registerFormAction, registerPending] = useActionState<AuthState, FormData>(registerAction, undefined);

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden gradient-navy lg:flex lg:flex-col lg:justify-between p-10">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-gradient-to-br from-[oklch(0.86_0.13_88)] to-[oklch(0.62_0.14_82)] text-[oklch(0.16_0.05_265)]">
            <TrendingUp className="h-4 w-4" strokeWidth={2.75} />
          </div>
          <span className="font-bold">Meridian<span className="gold-gradient"> Capital</span></span>
        </Link>
        <div>
          <h2 className="max-w-md text-3xl font-bold leading-tight">
            Trade global markets<br />with <span className="gold-gradient">institutional-grade</span> execution.
          </h2>
          <ul className="mt-8 space-y-3 text-sm text-muted-foreground">
            <li className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-[color:var(--gold)]" />Segregated client funds in tier-1 banks</li>
            <li className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-[color:var(--gold)]" />Negative balance protection</li>
            <li className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-[color:var(--gold)]" />24/7 multilingual support</li>
          </ul>
        </div>
        <div className="text-xs text-muted-foreground">© {new Date().getFullYear()} Meridian Capital Ltd.</div>
      </div>
      <div className="flex items-center justify-center bg-background p-6">
        <Card className="w-full max-w-md border-border/60 bg-card/60">
          <CardContent className="p-6">
            <Tabs defaultValue="login">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Sign in</TabsTrigger>
                <TabsTrigger value="register">Open account</TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="mt-6">
                <form className="space-y-4" action={loginFormAction}>
                  <div><Label htmlFor="e1">Email</Label><Input id="e1" name="email" type="email" required className="mt-2" placeholder="you@example.com" /></div>
                  <div><Label htmlFor="p1">Password</Label><Input id="p1" name="password" type="password" required className="mt-2" placeholder="••••••••" /></div>
                  {loginState?.error && <p className="text-sm text-destructive">{loginState.error}</p>}
                  <div className="flex items-center justify-between text-sm">
                    <label className="flex items-center gap-2"><Checkbox />Remember me</label>
                    <Link href="/auth" className="text-[color:var(--gold)] hover:underline">Forgot password?</Link>
                  </div>
                  <Button type="submit" disabled={loginPending} className="w-full">{loginPending ? "Signing in..." : "Sign in"}</Button>
                  <p className="text-center text-xs text-muted-foreground">Protected by 2FA & KYC verification.</p>
                </form>
              </TabsContent>

              <TabsContent value="register" className="mt-6">
                <form className="space-y-4" action={registerFormAction}>
                  <div className="grid grid-cols-2 gap-3">
                    <div><Label htmlFor="fn">First name</Label><Input id="fn" name="firstName" required className="mt-2" /></div>
                    <div><Label htmlFor="ln">Last name</Label><Input id="ln" name="lastName" required className="mt-2" /></div>
                  </div>
                  <div><Label htmlFor="e2">Email</Label><Input id="e2" name="email" type="email" required className="mt-2" /></div>
                  <div><Label htmlFor="p2">Password</Label><Input id="p2" name="password" type="password" required className="mt-2" minLength={8} /></div>
                  {registerState?.error && <p className="text-sm text-destructive">{registerState.error}</p>}
                  <label className="flex items-start gap-2 text-xs text-muted-foreground"><Checkbox className="mt-0.5" required />I agree to the Terms, Privacy Policy and Risk Disclosure.</label>
                  <Button type="submit" disabled={registerPending} className="w-full">{registerPending ? "Creating account..." : "Create account"}</Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
