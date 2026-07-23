export type PlanId = "essencial" | "ia" | "implantacao";

export interface Plan {
  id: PlanId;
  name: string;
  summary: string;
  featured: boolean;
  badge: string | null;
  /** Preço de vitrine riscado (mensal), opcional. */
  listPriceMonthly: number | null;
  /** Preço mensal atual. Null = sob consulta. */
  priceMonthly: number | null;
  /** Preço anual total. */
  priceYearly: number | null;
  priceLabel?: string;
  cta: "trial" | "whatsapp";
  features: string[];
}

/** Catálogo comercial do Tradutto Suplementos (espelha a lógica do Petshop). */
export const PLANS: Plan[] = [
  {
    id: "essencial",
    name: "Essencial",
    summary: "Tudo pra rodar a loja no dia a dia.",
    featured: false,
    badge: null,
    listPriceMonthly: 399,
    priceMonthly: 297,
    priceYearly: 2497,
    cta: "trial",
    features: [
      "PDV e registro de vendas",
      "Catálogo de produtos, marcas e fornecedores",
      "Estoque com alerta de mínimo",
      "Clientes e histórico de compras",
      "Importação de NF-e (XML)",
      "Relatórios de vendas e desempenho",
      "Alertas de estoque baixo no app",
    ],
  },
  {
    id: "ia",
    name: "Completo com IA",
    summary: "Essencial + recompra automática e inteligência.",
    featured: true,
    badge: "Mais escolhido",
    listPriceMonthly: 1197,
    priceMonthly: 497,
    priceYearly: 4197,
    cta: "trial",
    features: [
      "Tudo do plano Essencial",
      "Alertas de recompra na hora certa",
      "Aniversários e clientes inativos",
      "E-mail de confirmação a cada venda",
      "Relatório semanal automático",
      "Sugestões de ofertas por IA",
      "Prioridade no suporte",
    ],
  },
  {
    id: "implantacao",
    name: "Diagnóstico + Implementação",
    summary: "Sob medida para a sua operação.",
    featured: false,
    badge: null,
    listPriceMonthly: null,
    priceMonthly: null,
    priceYearly: null,
    priceLabel: "a partir de R$ 1.000",
    cta: "whatsapp",
    features: [
      "Tudo do Completo com IA",
      "Módulos sob medida pra sua loja",
      "Multi-loja em uma só conta",
      "White-label com a sua marca",
      "Integrações e automações sob demanda",
      "Treinamento semanal nos 2 primeiros meses",
      "Acompanhamento próximo da Tradutto",
    ],
  },
];

export function formatBRL(value: number): string {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  });
}

export function yearlyInstallment(plan: Plan): number | null {
  if (!plan.priceYearly) return null;
  return Math.round((plan.priceYearly / 12) * 100) / 100;
}

export function discountPercent(plan: Plan): number | null {
  if (!plan.listPriceMonthly || !plan.priceMonthly) return null;
  return Math.round((1 - plan.priceMonthly / plan.listPriceMonthly) * 100);
}
