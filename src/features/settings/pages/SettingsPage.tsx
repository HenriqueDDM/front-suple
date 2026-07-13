import { useEffect, useState } from "react";
import { Store, Palette, Bell, Upload } from "lucide-react";
import { PageHeader } from "@/shared/components/PageHeader";
import { FormField } from "@/shared/components/forms/FormField";
import { FormGrid } from "@/shared/components/forms/FormGrid";
import { useTheme } from "@/shared/contexts/ThemeContext";
import { useFormState } from "@/shared/hooks/useFormState";
import { useSettings } from "@/features/settings/hooks/useSettings";
import type { StoreSettings } from "@/types";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";
import { Switch } from "@/shared/ui/switch";
import { Separator } from "@/shared/ui/separator";
import { Avatar, AvatarFallback } from "@/shared/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const EMPTY_STORE_SETTINGS: StoreSettings = {
  name: "",
  phone: "",
  email: "",
  cnpj: "",
  address: "",
  logoUrl: "",
};

const PREFERENCE_ITEMS = [
  {
    key: "lowStockAlerts" as const,
    title: "Alertas de estoque baixo",
    description: "Receba avisos quando produtos atingirem o mínimo.",
  },
  {
    key: "salesEmails" as const,
    title: "E-mails de vendas",
    description: "Confirmação por e-mail a cada venda registrada.",
  },
  {
    key: "weeklyReport" as const,
    title: "Relatório semanal",
    description: "Resumo de desempenho toda segunda-feira.",
  },
];

export function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const { storeSettings, updateStoreSettings } = useSettings();
  const { form: store, setField, reset } = useFormState(EMPTY_STORE_SETTINGS);
  const [preferences, setPreferences] = useState({
    lowStockAlerts: true,
    salesEmails: false,
    weeklyReport: true,
  });

  useEffect(() => {
    if (storeSettings) reset(storeSettings);
  }, [storeSettings, reset]);

  const handleSaveStore = async () => {
    await updateStoreSettings(store);
    toast.success("Dados da loja salvos.");
  };

  return (
    <>
      <PageHeader title="Configurações" description="Ajuste os dados e preferências da loja." />

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

              <FormGrid>
                <FormField label="Nome" className="sm:col-span-2">
                  <Input
                    value={store.name}
                    onChange={(event) => setField("name", event.target.value)}
                  />
                </FormField>
                <FormField label="Telefone">
                  <Input
                    value={store.phone}
                    onChange={(event) => setField("phone", event.target.value)}
                  />
                </FormField>
                <FormField label="Email">
                  <Input
                    value={store.email}
                    onChange={(event) => setField("email", event.target.value)}
                  />
                </FormField>
                <FormField label="CNPJ">
                  <Input
                    value={store.cnpj}
                    onChange={(event) => setField("cnpj", event.target.value)}
                  />
                </FormField>
                <FormField label="Endereço">
                  <Input
                    value={store.address}
                    onChange={(event) => setField("address", event.target.value)}
                  />
                </FormField>
              </FormGrid>

              <div className="flex justify-end">
                <Button onClick={handleSaveStore}>Salvar alterações</Button>
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
                {(["light", "dark"] as const).map((themeOption) => (
                  <button
                    key={themeOption}
                    type="button"
                    onClick={() => setTheme(themeOption)}
                    aria-pressed={theme === themeOption}
                    className={cn(
                      "rounded-xl border-2 p-3 text-left transition-colors",
                      theme === themeOption
                        ? "border-primary"
                        : "border-border hover:border-muted-foreground/40",
                    )}
                  >
                    <div
                      className={cn(
                        "mb-3 h-20 rounded-lg border",
                        themeOption === "light"
                          ? "bg-[oklch(0.985_0_0)]"
                          : "bg-[oklch(0.17_0.012_264)]",
                      )}
                    >
                      <div className="flex h-full gap-2 p-2">
                        <div
                          className={cn(
                            "w-1/3 rounded",
                            themeOption === "light" ? "bg-white" : "bg-[oklch(0.21_0.014_264)]",
                          )}
                        />
                        <div className="flex-1 space-y-1.5">
                          <div className="h-2 w-3/4 rounded bg-primary/60" />
                          <div
                            className={cn(
                              "h-2 w-1/2 rounded",
                              themeOption === "light" ? "bg-slate-200" : "bg-white/15",
                            )}
                          />
                        </div>
                      </div>
                    </div>
                    <span className="text-sm font-medium">
                      {themeOption === "light" ? "Claro" : "Escuro"}
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
              {PREFERENCE_ITEMS.map((item, index, items) => (
                <div key={item.key}>
                  <div className="flex items-center justify-between gap-4 py-3">
                    <div className="min-w-0">
                      <p className="text-sm font-medium">{item.title}</p>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                    <Switch
                      checked={preferences[item.key]}
                      onCheckedChange={(checked) =>
                        setPreferences((current) => ({
                          ...current,
                          [item.key]: checked,
                        }))
                      }
                    />
                  </div>
                  {index < items.length - 1 && <Separator />}
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  );
}
