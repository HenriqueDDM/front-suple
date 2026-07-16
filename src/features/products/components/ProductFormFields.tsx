import { useMemo } from "react";
import { FormField } from "@/shared/components/forms/FormField";
import { FormGrid } from "@/shared/components/forms/FormGrid";
import { Input } from "@/shared/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/select";
import { parseNumericInput } from "@/shared/utils/number";
import { calculateSaleFromCost, pricingModeLabel } from "@/shared/utils/pricing";
import { formatCurrency } from "@/shared/utils/format";
import type { CreateProductDto } from "@/types/api";
import type { PricingMode, Supplier } from "@/types";

interface ProductFormFieldsProps {
  form: CreateProductDto;
  setField: <K extends keyof CreateProductDto>(key: K, value: CreateProductDto[K]) => void;
  categories: string[];
  suppliers: Supplier[];
}

const NONE_SUPPLIER = "__none__";

export function ProductFormFields({
  form,
  setField,
  categories,
  suppliers,
}: ProductFormFieldsProps) {
  const autoSale = useMemo(
    () => calculateSaleFromCost(form.purchasePrice, form.pricingMode, form.pricingValue),
    [form.purchasePrice, form.pricingMode, form.pricingValue],
  );

  const isAutoPricing = form.pricingMode !== "manual";

  const handlePurchaseChange = (value: number) => {
    setField("purchasePrice", value);
    const next = calculateSaleFromCost(value, form.pricingMode, form.pricingValue);
    if (next != null) setField("salePrice", next);
  };

  const handlePricingModeChange = (mode: PricingMode) => {
    setField("pricingMode", mode);
    const next = calculateSaleFromCost(form.purchasePrice, mode, form.pricingValue);
    if (next != null) setField("salePrice", next);
  };

  const handlePricingValueChange = (value: number) => {
    setField("pricingValue", value);
    const next = calculateSaleFromCost(form.purchasePrice, form.pricingMode, value);
    if (next != null) setField("salePrice", next);
  };

  const handleSupplierChange = (value: string) => {
    if (value === NONE_SUPPLIER) {
      setField("supplierId", null);
      setField("supplier", "");
      return;
    }
    const supplier = suppliers.find((item) => item.id === value);
    setField("supplierId", value);
    setField("supplier", supplier?.name ?? "");
  };

  return (
    <FormGrid>
      <FormField label="Nome" className="sm:col-span-2">
        <Input value={form.name} onChange={(event) => setField("name", event.target.value)} />
      </FormField>
      <FormField label="Marca">
        <Input value={form.brand} onChange={(event) => setField("brand", event.target.value)} />
      </FormField>
      <FormField label="Categoria">
        <Select value={form.category} onValueChange={(value) => setField("category", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FormField>
      <FormField label="Fornecedor">
        <Select
          value={form.supplierId ?? NONE_SUPPLIER}
          onValueChange={handleSupplierChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={NONE_SUPPLIER}>Sem fornecedor</SelectItem>
            {suppliers.map((supplier) => (
              <SelectItem key={supplier.id} value={supplier.id}>
                {supplier.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FormField>
      <FormField label="Código da loja (SKU)">
        <Input
          value={form.sku}
          onChange={(event) => setField("sku", event.target.value)}
          placeholder="Ex: WHEY-90"
        />
      </FormField>
      <FormField label="NCM">
        <Input
          value={form.ncm}
          onChange={(event) => setField("ncm", event.target.value)}
          placeholder="Ex: 21069090"
        />
      </FormField>
      <FormField label="Código de barras">
        <Input
          value={form.barcode}
          onChange={(event) => setField("barcode", event.target.value)}
        />
      </FormField>
      <FormField label="Preço de custo">
        <Input
          type="number"
          value={form.purchasePrice}
          onChange={(event) => handlePurchaseChange(parseNumericInput(event.target.value))}
        />
      </FormField>
      <FormField label="Tipo de precificação">
        <Select
          value={form.pricingMode}
          onValueChange={(value) => handlePricingModeChange(value as PricingMode)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {(["manual", "markup", "margin"] as PricingMode[]).map((mode) => (
              <SelectItem key={mode} value={mode}>
                {pricingModeLabel(mode)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FormField>
      {isAutoPricing ? (
        <FormField
          label={form.pricingMode === "markup" ? "Markup (%)" : "Margem (%)"}
        >
          <Input
            type="number"
            value={form.pricingValue}
            onChange={(event) =>
              handlePricingValueChange(parseNumericInput(event.target.value))
            }
          />
        </FormField>
      ) : null}
      <FormField label="Preço de venda">
        <Input
          type="number"
          value={form.salePrice}
          disabled={isAutoPricing}
          onChange={(event) => setField("salePrice", parseNumericInput(event.target.value))}
        />
        {isAutoPricing && autoSale != null ? (
          <p className="mt-1 text-xs text-muted-foreground">
            Calculado automaticamente: {formatCurrency(autoSale)}
          </p>
        ) : null}
      </FormField>
      <FormField label="Quantidade">
        <Input
          type="number"
          value={form.quantity}
          onChange={(event) => setField("quantity", parseNumericInput(event.target.value))}
        />
      </FormField>
      <FormField label="Estoque mínimo">
        <Input
          type="number"
          value={form.minStock}
          onChange={(event) => setField("minStock", parseNumericInput(event.target.value))}
        />
      </FormField>
      <FormField label="Imagem (URL)" className="sm:col-span-2">
        <Input
          value={form.imageUrl}
          onChange={(event) => setField("imageUrl", event.target.value)}
          placeholder="https://..."
        />
      </FormField>
    </FormGrid>
  );
}
