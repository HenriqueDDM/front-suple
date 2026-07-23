import { useState, type FormEvent } from "react";
import { Navigate, useNavigate } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/shared/contexts/AuthContext";
import { env } from "@/config/env";
import { APP_LOGO_URL, APP_NAME, APP_SITE_URL, APP_TAGLINE } from "@/shared/constants/brand";
import { isPlatformAdmin } from "@/types/auth";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { ApiError } from "@/services/api/errors";

export function LoginPage() {
  const { login, user, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState(env.devEmail);
  const [password, setPassword] = useState(env.devPassword);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (!isLoading && isAuthenticated) {
    return <Navigate to={isPlatformAdmin(user) ? "/admin" : "/dashboard"} />;
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const authUser = await login({ email: email.trim(), password });
      await navigate({
        to: authUser.role === "SUPER_ADMIN" ? "/admin" : "/dashboard",
      });
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : "Não foi possível entrar. Verifique o backend e tente de novo.";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/15 via-background to-background"
      />
      <Card className="relative z-10 w-full max-w-md border-border/80 shadow-lg">
        <CardHeader className="space-y-3 text-center">
          <img
            src={APP_LOGO_URL}
            alt={APP_NAME}
            className="mx-auto h-16 w-16 object-contain"
          />
          <div>
            <CardTitle className="text-2xl">{APP_NAME}</CardTitle>
            <CardDescription className="mt-1">{APP_TAGLINE}</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </div>

            {error ? (
              <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {error}
              </p>
            ) : null}

            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Entrando...
                </>
              ) : (
                "Entrar"
              )}
            </Button>

            <p className="text-center text-xs text-muted-foreground">
              Conta demo do seed já preenchida. Use Entrar para acessar.
            </p>
            <p className="text-center text-xs text-muted-foreground">
              <a
                href={APP_SITE_URL}
                target="_blank"
                rel="noreferrer"
                className="underline-offset-2 hover:underline"
              >
                tradutto.com.br
              </a>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
