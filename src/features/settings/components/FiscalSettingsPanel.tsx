import { useEffect, useState } from "react";
import { FileText, Loader2 } from "lucide-react";
import { FormField } from "@/shared/components/forms/FormField";
import { FormGrid } from "@/shared/components/forms/FormGrid";
import { useFiscalSettings } from "@/features/settings/hooks/useFiscalSettings";
import type { FiscalSettings, UpdateFiscalSettingsDto } from "@/types/api";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";
import { Switch } from "@/shared/ui/switch";
import { Separator } from "@/shared/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { toast } from "sonner";

const EMPTY: FiscalSettings = {
  enabled: false,
  emitOnSale: true,
  provider: "simulated",
  environment: "homologacao",
  hasApiToken: false,
  cnpjEmitente: "",
  inscricaoEstadual: "",
  razaoSocial: "",
  nomeFantasia: "",
  logradouro: "",
  numero: "",
  bairro: "",
  municipio: "",
  uf: "",
  cep: "",
  defaultCfop: "5102",
  defaultCsosn: "102",
  defaultNcm: "21069090",
  cscId: "",
  hasCscToken: false,
};

export function FiscalSettingsPanel() {
  const { fiscalSettings, isLoading, updateFiscalSettings, isSaving } = useFiscalSettings();
  const [form, setForm] = useState<FiscalSettings>(EMPTY);
  const [apiToken, setApiToken] = useState("");
  const [cscToken, setCscToken] = useState("");

  useEffect(() => {
    if (fiscalSettings) setForm(fiscalSettings);
  }, [fiscalSettings]);

  const set = <K extends keyof FiscalSettings>(key: K, value: FiscalSettings[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    const dto: UpdateFiscalSettingsDto = {
      enabled: form.enabled,
      emitOnSale: form.emitOnSale,
      environment: form.environment,
      cnpjEmitente: form.cnpjEmitente,
      inscricaoEstadual: form.inscricaoEstadual,
      razaoSocial: form.razaoSocial,
      nomeFantasia: form.nomeFantasia,
      logradouro: form.logradouro,
      numero: form.numero,
      bairro: form.bairro,
      municipio: form.municipio,
      uf: form.uf,
      cep: form.cep,
      defaultCfop: form.defaultCfop,
      defaultCsosn: form.defaultCsosn,
      defaultNcm: form.defaultNcm,
      cscId: form.cscId,
    };
    if (apiToken.trim()) dto.apiToken = apiToken.trim();
    if (cscToken.trim()) dto.cscToken = cscToken.trim();

    try {
      await updateFiscalSettings(dto);
      setApiToken("");
      setCscToken("");
      toast.success("Configurações fiscais salvas.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Falha ao salvar.");
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center gap-2 p-6 text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> Carregando…
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" /> NFC-e
          </CardTitle>
          <CardDescription>
            Emissão de nota fiscal de consumidor via Focus NFe. Sem token, o sistema usa modo
            simulado (ideal para testes).
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-medium">Ativar emissão fiscal</p>
              <p className="text-sm text-muted-foreground">
                Habilita NFC-e nesta loja.
              </p>
            </div>
            <Switch
              checked={form.enabled}
              onCheckedChange={(checked) => set("enabled", checked)}
            />
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-medium">Emitir automaticamente na venda</p>
              <p className="text-sm text-muted-foreground">
                Gera a nota ao finalizar o PDV.
              </p>
            </div>
            <Switch
              checked={form.emitOnSale}
              onCheckedChange={(checked) => set("emitOnSale", checked)}
              disabled={!form.enabled}
            />
          </div>

          <Separator />

          <FormGrid>
            <FormField label="Ambiente">
              <Select
                value={form.environment}
                onValueChange={(value) =>
                  set("environment", value as FiscalSettings["environment"])
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="homologacao">Homologação</SelectItem>
                  <SelectItem value="producao">Produção</SelectItem>
                </SelectContent>
              </Select>
            </FormField>
            <FormField label="Provedor">
              <Input
                value={
                  form.hasApiToken
                    ? "Focus NFe (token configurado)"
                    : "Simulado (sem token)"
                }
                disabled
              />
            </FormField>
            <FormField label="Token Focus NFe" className="sm:col-span-2">
              <Input
                type="password"
                autoComplete="off"
                placeholder={
                  form.hasApiToken
                    ? "•••••••• (deixe em branco para manter)"
                    : "Cole o token da Focus NFe"
                }
                value={apiToken}
                onChange={(e) => setApiToken(e.target.value)}
              />
            </FormField>
          </FormGrid>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Emitente</CardTitle>
          <CardDescription>Dados do CNPJ que constarão na NFC-e.</CardDescription>
        </CardHeader>
        <CardContent>
          <FormGrid>
            <FormField label="CNPJ">
              <Input
                value={form.cnpjEmitente}
                onChange={(e) => set("cnpjEmitente", e.target.value)}
                placeholder="Somente números"
              />
            </FormField>
            <FormField label="Inscrição estadual">
              <Input
                value={form.inscricaoEstadual}
                onChange={(e) => set("inscricaoEstadual", e.target.value)}
              />
            </FormField>
            <FormField label="Razão social" className="sm:col-span-2">
              <Input
                value={form.razaoSocial}
                onChange={(e) => set("razaoSocial", e.target.value)}
              />
            </FormField>
            <FormField label="Nome fantasia" className="sm:col-span-2">
              <Input
                value={form.nomeFantasia}
                onChange={(e) => set("nomeFantasia", e.target.value)}
              />
            </FormField>
            <FormField label="Logradouro" className="sm:col-span-2">
              <Input
                value={form.logradouro}
                onChange={(e) => set("logradouro", e.target.value)}
              />
            </FormField>
            <FormField label="Número">
              <Input value={form.numero} onChange={(e) => set("numero", e.target.value)} />
            </FormField>
            <FormField label="Bairro">
              <Input value={form.bairro} onChange={(e) => set("bairro", e.target.value)} />
            </FormField>
            <FormField label="Município">
              <Input
                value={form.municipio}
                onChange={(e) => set("municipio", e.target.value)}
              />
            </FormField>
            <FormField label="UF">
              <Input
                value={form.uf}
                onChange={(e) => set("uf", e.target.value.toUpperCase().slice(0, 2))}
                maxLength={2}
              />
            </FormField>
            <FormField label="CEP">
              <Input value={form.cep} onChange={(e) => set("cep", e.target.value)} />
            </FormField>
          </FormGrid>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Padrões fiscais e CSC</CardTitle>
          <CardDescription>
            Valores padrão para produtos sem CFOP/CSOSN/NCM. CSC é exigido pela SEFAZ na NFC-e.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <FormGrid>
            <FormField label="CFOP padrão">
              <Input
                value={form.defaultCfop}
                onChange={(e) => set("defaultCfop", e.target.value)}
              />
            </FormField>
            <FormField label="CSOSN padrão">
              <Input
                value={form.defaultCsosn}
                onChange={(e) => set("defaultCsosn", e.target.value)}
              />
            </FormField>
            <FormField label="NCM padrão">
              <Input
                value={form.defaultNcm}
                onChange={(e) => set("defaultNcm", e.target.value)}
              />
            </FormField>
            <FormField label="CSC ID">
              <Input value={form.cscId} onChange={(e) => set("cscId", e.target.value)} />
            </FormField>
            <FormField label="CSC Token" className="sm:col-span-2">
              <Input
                type="password"
                autoComplete="off"
                placeholder={
                  form.hasCscToken
                    ? "•••••••• (deixe em branco para manter)"
                    : "Token CSC da SEFAZ"
                }
                value={cscToken}
                onChange={(e) => setCscToken(e.target.value)}
              />
            </FormField>
          </FormGrid>

          <Button type="button" onClick={() => void handleSave()} disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Salvando…
              </>
            ) : (
              "Salvar fiscal"
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
