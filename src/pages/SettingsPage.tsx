import { useState } from "react";
import { Store, Palette, Bell, Upload } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { useTheme } from "@/contexts/ThemeContext";
import { storeSettings } from "@/services/mock/settings";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [store, setStore] = useState(storeSettings);
  const [prefs, setPrefs] = useState({
    lowStockAlerts: true,
    salesEmails: false,
    weeklyReport: true,
  });

  const set = (key: keyof typeof store, value: string) =>
    setStore((s) => ({ ...s, [key]: value }));

  return (
    <>
      <PageHeader
        title="Configurações"
        description="Ajuste os dados e preferências da loja."
      />

      <Tabs defaultValue="store" className="space-y-6">
        <TabsList>
          <TabsTrigger value="store">
            <Store className="h-4 w-4" /> Loja
          </TabsTrigger>
          <TabsTrigger value="theme">
            <Palette className="h-4 w-4" /> Tema
          </TabsTrigger>
          <TabsTrigger value="prefs">
            <Bell className="h-4 w-4" /> Preferências
          </TabsTrigger>
        </TabsList>

        <TabsContent value="store">
          <Card>
            <CardHeader>
              <CardTitle>Dados da loja</CardTitle>
              <CardDescription>Informações exibidas em documentos.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16 rounded-xl">
                  <AvatarFallback className="rounded-xl bg-primary text-lg text-primary-foreground">
                    {store.name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <Button variant="outline">
                  <Upload className="h-4 w-4" /> Enviar logo
                </Button>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2 sm:col-span-2">
                  <Label>Nome</Label>
                  <Input value={store.name} onChange={(e) => set("name", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Telefone</Label>
                  <Input value={store.phone} onChange={(e) => set("phone", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input value={store.email} onChange={(e) => set("email", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>CNPJ</Label>
                  <Input value={store.cnpj} onChange={(e) => set("cnpj", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Endereço</Label>
                  <Input value={store.address} onChange={(e) => set("address", e.target.value)} />
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={() => toast.success("Dados da loja salvos.")}>
                  Salvar alterações
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="theme">
          <Card>
            <CardHeader>
              <CardTitle>Aparência</CardTitle>
              <CardDescription>Escolha o tema do sistema.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 sm:max-w-md">
                {(["light", "dark"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTheme(t)}
                    className={cn(
                      "rounded-xl border-2 p-3 text-left transition-colors",
                      theme === t
                        ? "border-primary"
                        : "border-border hover:border-muted-foreground/40",
                    )}
                  >
                    <div
                      className={cn(
                        "mb-3 h-20 rounded-lg border",
                        t === "light" ? "bg-[oklch(0.985_0_0)]" : "bg-[oklch(0.17_0.012_264)]",
                      )}
                    >
                      <div className="flex h-full gap-2 p-2">
                        <div
                          className={cn(
                            "w-1/3 rounded",
                            t === "light" ? "bg-white" : "bg-[oklch(0.21_0.014_264)]",
                          )}
                        />
                        <div className="flex-1 space-y-1.5">
                          <div className="h-2 w-3/4 rounded bg-primary/60" />
                          <div
                            className={cn(
                              "h-2 w-1/2 rounded",
                              t === "light" ? "bg-slate-200" : "bg-white/15",
                            )}
                          />
                        </div>
                      </div>
                    </div>
                    <span className="text-sm font-medium">
                      {t === "light" ? "Claro" : "Escuro"}
                    </span>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="prefs">
          <Card>
            <CardHeader>
              <CardTitle>Preferências</CardTitle>
              <CardDescription>Notificações e relatórios.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-1">
              {[
                {
                  key: "lowStockAlerts" as const,
                  title: "Alertas de estoque baixo",
                  desc: "Receba avisos quando produtos atingirem o mínimo.",
                },
                {
                  key: "salesEmails" as const,
                  title: "E-mails de vendas",
                  desc: "Confirmação por e-mail a cada venda registrada.",
                },
                {
                  key: "weeklyReport" as const,
                  title: "Relatório semanal",
                  desc: "Resumo de desempenho toda segunda-feira.",
                },
              ].map((item, i, arr) => (
                <div key={item.key}>
                  <div className="flex items-center justify-between gap-4 py-3">
                    <div className="min-w-0">
                      <p className="text-sm font-medium">{item.title}</p>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </div>
                    <Switch
                      checked={prefs[item.key]}
                      onCheckedChange={(v) =>
                        setPrefs((p) => ({ ...p, [item.key]: v }))
                      }
                    />
                  </div>
                  {i < arr.length - 1 && <Separator />}
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  );
}
