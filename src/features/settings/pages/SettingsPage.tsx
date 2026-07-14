import { useEffect, useRef, useState } from "react";
import { useNavigate, useRouterState } from "@tanstack/react-router";
import { Store, Palette, Bell, Upload, Trash2 } from "lucide-react";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";
import { cn } from "@/lib/utils";
import { resizeImageToDataUrl } from "@/shared/utils/image";
import { toast } from "sonner";

type SettingsTab = "store" | "theme" | "prefs";

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

function parseSettingsTab(value: unknown): SettingsTab {
  if (value === "store" || value === "theme" || value === "prefs") {
    return value;
  }
  return "store";
}

export function SettingsPage() {
  const navigate = useNavigate({ from: "/settings" });
  const search = useRouterState({ select: (s) => s.location.search });
  const activeTab = parseSettingsTab((search as { tab?: unknown }).tab);
  const { theme, setTheme } = useTheme();
  const { storeSettings, updateStoreSettings } = useSettings();
  const { form: store, setField, reset } = useFormState(EMPTY_STORE_SETTINGS);
  const [preferences, setPreferences] = useState({
    lowStockAlerts: true,
    salesEmails: false,
    weeklyReport: true,
  });
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const logoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (storeSettings) reset(storeSettings);
  }, [storeSettings, reset]);

  const handleSaveStore = async () => {
    await updateStoreSettings(store);
    toast.success("Dados da loja salvos.");
  };

  const handleLogoPick = async (file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Selecione uma imagem (PNG ou JPG).");
      return;
    }

    setIsUploadingLogo(true);
    try {
      const dataUrl = await resizeImageToDataUrl(file, 160);
      setField("logoUrl", dataUrl);
      toast.success("Logo carregada. Salve as alterações para aplicar.");
    } catch {
      toast.error("Não foi possível processar a imagem.");
    } finally {
      setIsUploadingLogo(false);
      if (logoInputRef.current) logoInputRef.current.value = "";
    }
  };

  const handleRemoveLogo = () => {
    setField("logoUrl", "");
  };

  const setTab = (next: SettingsTab) => {
    void navigate({
      to: "/settings",
      search: { tab: next },
      replace: true,
    });
  };

  return (
    <>
      <PageHeader title="Configurações" description="Ajuste dados da loja e preferências." />

      <Tabs value={activeTab} onValueChange={(value) => setTab(value as SettingsTab)} className="space-y-6">
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
              <div className="flex flex-wrap items-center gap-4">
                <Avatar className="h-16 w-16 rounded-xl">
                  {store.logoUrl ? (
                    <AvatarImage src={store.logoUrl} alt={store.name || "Logo"} className="object-cover" />
                  ) : null}
                  <AvatarFallback className="rounded-xl bg-primary text-lg text-primary-foreground">
                    {store.name.slice(0, 2).toUpperCase() || "LJ"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-wrap gap-2">
                  <input
                    ref={logoInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    className="hidden"
                    onChange={(event) => void handleLogoPick(event.target.files?.[0])}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    disabled={isUploadingLogo}
                    onClick={() => logoInputRef.current?.click()}
                  >
                    <Upload className="h-4 w-4" />
                    {isUploadingLogo ? "Processando..." : "Enviar logo"}
                  </Button>
                  {store.logoUrl ? (
                    <Button type="button" variant="ghost" onClick={handleRemoveLogo}>
                      <Trash2 className="h-4 w-4" /> Remover
                    </Button>
                  ) : null}
                </div>
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
