import { useEffect, useRef, useState } from "react";
import { useNavigate, useRouterState } from "@tanstack/react-router";
import { Bell, Check, Palette, Store, Trash2, Upload } from "lucide-react";
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
  primaryColor: "#6d5dfc",
  interfaceRadius: "rounded",
  plan: "basic",
  lowStockAlerts: true,
  salesEmails: false,
  weeklyReport: true,
};

const COLOR_PRESETS = [
  { name: "Violeta", value: "#6d5dfc" },
  { name: "Azul", value: "#2563eb" },
  { name: "Verde", value: "#059669" },
  { name: "Laranja", value: "#ea580c" },
  { name: "Rosa", value: "#db2777" },
  { name: "Grafite", value: "#334155" },
] as const;

const RADIUS_OPTIONS = [
  { value: "compact" as const, label: "Compacto", radius: "rounded-md" },
  { value: "rounded" as const, label: "Moderno", radius: "rounded-xl" },
  { value: "soft" as const, label: "Suave", radius: "rounded-2xl" },
] as const;

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
  const { theme, setTheme, setBranding } = useTheme();
  const { storeSettings, updateStoreSettings } = useSettings();
  const { form: store, setField, reset } = useFormState(EMPTY_STORE_SETTINGS);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const logoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!storeSettings) return;
    reset(storeSettings);
    setBranding(storeSettings.primaryColor, storeSettings.interfaceRadius);
  }, [storeSettings, reset, setBranding]);

  const saveSettings = async (successMessage: string) => {
    const { plan: _plan, ...editableSettings } = store;
    await updateStoreSettings(editableSettings);
    toast.success(successMessage);
  };

  const updateBranding = (primaryColor: string, interfaceRadius = store.interfaceRadius) => {
    setField("primaryColor", primaryColor);
    setBranding(primaryColor, interfaceRadius);
  };

  const updateRadius = (interfaceRadius: StoreSettings["interfaceRadius"]) => {
    setField("interfaceRadius", interfaceRadius);
    setBranding(store.primaryColor, interfaceRadius);
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

      <Tabs
        value={activeTab}
        onValueChange={(value) => setTab(value as SettingsTab)}
        className="space-y-6"
      >
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
                    <AvatarImage
                      src={store.logoUrl}
                      alt={store.name || "Logo"}
                      className="object-cover"
                    />
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
                <Button onClick={() => void saveSettings("Dados da loja salvos.")}>
                  Salvar alterações
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="theme">
          <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
            <Card>
              <CardHeader>
                <CardTitle>Identidade visual</CardTitle>
                <CardDescription>Deixe o sistema com a personalidade da sua marca.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-7">
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium">Cor principal</p>
                    <p className="text-sm text-muted-foreground">
                      Aplicada em botões, menu, gráficos e destaques.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {COLOR_PRESETS.map((color) => (
                      <button
                        key={color.value}
                        type="button"
                        title={color.name}
                        onClick={() => updateBranding(color.value)}
                        className="grid h-10 w-10 place-items-center rounded-full border-2 border-background shadow-sm ring-offset-background transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        style={{ backgroundColor: color.value }}
                        aria-label={`Usar cor ${color.name}`}
                      >
                        {store.primaryColor.toLowerCase() === color.value ? (
                          <Check className="h-4 w-4 text-white drop-shadow" />
                        ) : null}
                      </button>
                    ))}
                    <label className="relative grid h-10 cursor-pointer place-items-center rounded-full border bg-card px-4 text-xs font-medium transition-colors hover:bg-accent">
                      Personalizada
                      <input
                        type="color"
                        value={store.primaryColor}
                        onChange={(event) => updateBranding(event.target.value)}
                        className="absolute inset-0 cursor-pointer opacity-0"
                        aria-label="Escolher cor personalizada"
                      />
                    </label>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium">Estilo dos cantos</p>
                    <p className="text-sm text-muted-foreground">
                      Ajusta a personalidade de cards, campos e botões.
                    </p>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-3">
                    {RADIUS_OPTIONS.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => updateRadius(option.value)}
                        className={cn(
                          "border-2 p-3 text-left transition-all hover:-translate-y-0.5",
                          option.radius,
                          store.interfaceRadius === option.value
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/40",
                        )}
                      >
                        <div className={cn("mb-3 h-10 bg-primary/15", option.radius)} />
                        <span className="text-sm font-medium">{option.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <p className="text-sm font-medium">Modo de exibição</p>
                  <div className="grid grid-cols-2 gap-4 sm:max-w-md">
                    {(["light", "dark"] as const).map((themeOption) => (
                      <button
                        key={themeOption}
                        type="button"
                        onClick={() => setTheme(themeOption)}
                        aria-pressed={theme === themeOption}
                        className={cn(
                          "rounded-xl border-2 p-3 text-left transition-all hover:-translate-y-0.5",
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
                </div>

                <div className="flex justify-end">
                  <Button onClick={() => void saveSettings("Identidade visual aplicada.")}>
                    Salvar identidade visual
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="overflow-hidden">
              <div className="h-24 bg-primary p-5 text-primary-foreground">
                <p className="text-xs font-medium opacity-80">Prévia da marca</p>
                <p className="mt-1 truncate text-xl font-semibold">{store.name || "Sua loja"}</p>
              </div>
              <CardContent className="space-y-4 p-5">
                <div className="flex gap-3">
                  <div className="h-10 w-10 rounded-xl bg-primary/15" />
                  <div className="flex-1 space-y-2 pt-1">
                    <div className="h-2.5 w-2/3 rounded-full bg-foreground/15" />
                    <div className="h-2 w-1/2 rounded-full bg-muted" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="h-20 rounded-xl border bg-card" />
                  <div className="h-20 rounded-xl border bg-primary/8" />
                </div>
                <Button className="w-full">Ação principal</Button>
              </CardContent>
            </Card>
          </div>
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
                      checked={store[item.key]}
                      onCheckedChange={(checked) => setField(item.key, checked)}
                    />
                  </div>
                  {index < items.length - 1 && <Separator />}
                </div>
              ))}
              <div className="flex justify-end pt-5">
                <Button onClick={() => void saveSettings("Preferências salvas.")}>
                  Salvar preferências
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  );
}
