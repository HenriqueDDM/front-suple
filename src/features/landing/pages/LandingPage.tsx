import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BarChart3,
  Bell,
  Boxes,
  Check,
  MessageCircle,
  Package,
  RefreshCw,
  ShieldCheck,
  ShoppingCart,
  Sparkles,
  Truck,
  Users,
} from "lucide-react";
import { LandingNav } from "@/features/landing/components/LandingNav";
import {
  APP_LOGO_URL,
  APP_NAME,
  APP_SHORT_NAME,
  APP_SITE_URL,
  APP_WHATSAPP,
} from "@/shared/constants/brand";
import {
  PLANS,
  discountPercent,
  formatBRL,
  yearlyInstallment,
  type Plan,
} from "@/shared/constants/plans";
import { cn } from "@/lib/utils";

const WA = `https://wa.me/55${APP_WHATSAPP}?text=${encodeURIComponent(
  "Olá! Quero conhecer o Tradutto Suplementos.",
)}`;
const WA_IMPLANTACAO = `https://wa.me/55${APP_WHATSAPP}?text=${encodeURIComponent(
  "Olá! Quero o plano de Diagnóstico + Implementação do Tradutto Suplementos.",
)}`;

const FAQ_ITEMS = [
  {
    q: "Preciso de cartão para testar?",
    a: "Não. Você fala com a gente, recebe o acesso e testa a operação da sua loja sem compromisso.",
  },
  {
    q: "Serve para loja pequena?",
    a: "Sim. O Essencial foi pensado para o dia a dia: PDV, estoque, clientes e relatórios — sem complicação.",
  },
  {
    q: "O que a IA faz de diferente?",
    a: "No Completo com IA, o sistema ajuda na recompra: avisa quem está na hora de voltar, destaca inativos e envia resumos semanais.",
  },
  {
    q: "Posso migrar depois?",
    a: "Pode. Comece no Essencial e suba para o Completo com IA ou peça implantação sob medida quando precisar.",
  },
];

export function LandingPage() {
  return (
    <div
      id="topo"
      className="min-h-screen bg-[#f7f8fc] text-[#0a1430] [--font-landing-display:'Space_Grotesk',ui-sans-serif,system-ui,sans-serif]"
    >
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&display=swap"
      />

      <LandingNav />

      {/* HERO */}
      <section className="relative overflow-hidden bg-[#0a1430] text-white">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-32 top-[-10%] h-[40rem] w-[40rem] rounded-full bg-[#1B4DE0]/30 blur-[120px]" />
          <div className="absolute right-[-10%] top-[15%] h-[34rem] w-[34rem] rounded-full bg-[#19D4E3]/20 blur-[120px]" />
          <div
            className="absolute inset-0 opacity-[0.16]"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.06) 1px, transparent 1px)",
              backgroundSize: "48px 48px",
              maskImage: "radial-gradient(70% 60% at 50% 0%, black, transparent)",
              WebkitMaskImage: "radial-gradient(70% 60% at 50% 0%, black, transparent)",
            }}
          />
        </div>

        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 pb-20 pt-28 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:pb-28 lg:pt-32">
          <div className="animate-[fadeRise_0.7s_ease-out_both]">
            <p className="font-[family-name:var(--font-landing-display)] text-sm font-semibold tracking-[0.14em] text-[#19D4E3] uppercase">
              {APP_NAME}
            </p>
            <h1 className="mt-4 font-[family-name:var(--font-landing-display)] text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-[3.35rem]">
              Sua loja de suplementos,{" "}
              <span className="bg-gradient-to-r from-[#5E8BFF] to-[#19D4E3] bg-clip-text text-transparent">
                com recompra sob controle.
              </span>
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-white/65 sm:text-lg">
              PDV, estoque, clientes e relatórios — com alertas que fazem o cliente
              voltar quando o pote acaba.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href="#precos"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#1B4DE0] to-[#19D4E3] px-6 font-[family-name:var(--font-landing-display)] text-sm font-semibold text-white transition-transform hover:scale-[1.03] active:scale-95"
              >
                Ver planos <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href={WA}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-6 font-[family-name:var(--font-landing-display)] text-sm font-semibold text-white transition-colors hover:bg-white/10"
              >
                <MessageCircle className="h-4 w-4" /> Falar no WhatsApp
              </a>
            </div>
          </div>

          <div className="relative animate-[fadeRise_0.7s_ease-out_0.12s_both]">
            <div className="absolute -inset-6 rounded-[2rem] bg-gradient-to-br from-[#1B4DE0]/25 to-[#19D4E3]/15 blur-2xl" />
            <div className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#0d1b3d]/80 p-8 shadow-2xl backdrop-blur">
              <img
                src={APP_LOGO_URL}
                alt={APP_NAME}
                className="mx-auto h-44 w-44 object-contain sm:h-52 sm:w-52"
              />
              <div className="mt-6 grid grid-cols-3 gap-3 text-center">
                {[
                  { label: "PDV", value: "Rápido" },
                  { label: "Estoque", value: "No mínimo" },
                  { label: "Recompra", value: "Na hora" },
                ].map((item) => (
                  <div key={item.label} className="rounded-xl bg-white/5 px-2 py-3">
                    <p className="text-[11px] tracking-wide text-white/45 uppercase">{item.label}</p>
                    <p className="mt-1 font-[family-name:var(--font-landing-display)] text-sm font-semibold text-white">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="relative border-t border-white/10 bg-black/20">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-8 gap-y-2 px-4 py-4 text-center text-xs font-medium text-white/45 sm:text-sm">
            <span>Feito pra</span>
            <span className="text-white/70">Loja de bairro</span>
            <span className="text-white/20">•</span>
            <span className="text-white/70">Franquia</span>
            <span className="text-white/20">•</span>
            <span className="text-white/70">E-commerce omnichannel</span>
            <span className="text-white/20">•</span>
            <span className="text-white/70">Rede multi-loja</span>
          </div>
        </div>
      </section>

      {/* PROBLEMA */}
      <section id="problema" className="scroll-mt-20 py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <SectionHead
            eyebrow="O furo do caixa"
            title="Cliente some. Estoque vira surpresa. Venda não volta."
            sub="A loja vende bem no balcão — e perde margem no silêncio depois da venda."
          />
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            <PainCard
              stat="Semanal"
              title="pote acaba e ninguém avisa"
              desc="O cliente some sem recompra porque ninguém lembrou na hora certa."
            />
            <PainCard
              stat="Estoque"
              title="mínimo só no caderno"
              desc="Produto some da prateleira e a reposição vira urgência, não rotina."
            />
            <PainCard
              stat="Planilha"
              title="não fecha o dia"
              desc="Vendas, lucro e clientes ficam espalhados — e a decisão fica no feeling."
            />
          </div>
        </div>
      </section>

      {/* RECURSOS */}
      <section id="recursos" className="scroll-mt-20 bg-white py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <SectionHead
            eyebrow="O sistema"
            title="Tudo que a loja precisa — num só lugar."
            sub="Do PDV ao relatório semanal: operação clara e pós-venda que trabalha por você."
          />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon={<ShoppingCart className="h-5 w-5" />}
              title="PDV ágil"
              desc="Venda no balcão com desconto, brindes, PIX, cartão e dinheiro."
            />
            <FeatureCard
              icon={<Package className="h-5 w-5" />}
              title="Produtos & marcas"
              desc="Catálogo organizado com preço, estoque mínimo e fornecedor."
            />
            <FeatureCard
              icon={<Boxes className="h-5 w-5" />}
              title="Estoque vivo"
              desc="Entradas, saídas, NF-e e alertas quando bater o mínimo."
            />
            <FeatureCard
              icon={<Users className="h-5 w-5" />}
              title="Clientes"
              desc="Histórico, ticket e quem sumiu — pra reativar na hora certa."
            />
            <FeatureCard
              icon={<Truck className="h-5 w-5" />}
              title="Fornecedores"
              desc="Compras e notas vinculadas, sem perder o rastro do custo."
            />
            <FeatureCard
              icon={<BarChart3 className="h-5 w-5" />}
              title="Relatórios"
              desc="Faturamento, lucro, top produtos e resumo semanal por e-mail."
            />
            <FeatureCard
              icon={<Bell className="h-5 w-5" />}
              title="Alertas"
              desc="Estoque baixo, aniversário e recompra — no app e por e-mail."
            />
            <FeatureCard
              icon={<RefreshCw className="h-5 w-5" />}
              title="Recompra"
              desc="A IA ajuda a chamar quem está na janela de voltar a comprar."
            />
            <FeatureCard
              icon={<Sparkles className="h-5 w-5" />}
              title="Marca da loja"
              desc="Logo, cores e preferências — o painel com a cara do seu negócio."
            />
          </div>
        </div>
      </section>

      {/* PLANOS */}
      <section id="precos" className="scroll-mt-20 py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <SectionHead
            eyebrow="Planos"
            title="Três caminhos. Um objetivo: vender de novo."
            sub="Escolha a operação do dia a dia, o pacote com IA, ou a implantação sob medida."
          />
          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            {PLANS.map((plan) => (
              <PlanCard key={plan.id} plan={plan} />
            ))}
          </div>
          <p className="mx-auto mt-6 flex max-w-xl items-center justify-center gap-1.5 text-center text-xs text-[#5a6478]">
            <ShieldCheck className="h-3.5 w-3.5" />
            Teste com a gente · cancele quando quiser · fale direto com quem constrói
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-20 bg-white py-20 sm:py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <SectionHead eyebrow="FAQ" title="Antes de começar" />
          <div className="mt-10 divide-y divide-[#e6e9f2] rounded-2xl border border-[#e6e9f2] bg-[#f7f8fc]">
            {FAQ_ITEMS.map((item) => (
              <details key={item.q} className="group px-5 py-4">
                <summary className="cursor-pointer list-none font-[family-name:var(--font-landing-display)] text-[15px] font-semibold text-[#0a1430] marker:content-none [&::-webkit-details-marker]:hidden">
                  <span className="flex items-center justify-between gap-4">
                    {item.q}
                    <span className="text-[#1B4DE0] transition group-open:rotate-45">+</span>
                  </span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-[#5a6478]">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="relative overflow-hidden bg-[#0a1430] text-white">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-0 h-[28rem] w-[44rem] -translate-x-1/2 rounded-full bg-[#1B4DE0]/25 blur-[120px]" />
        </div>
        <div className="relative mx-auto max-w-3xl px-4 py-20 text-center sm:px-6 sm:py-28">
          <h2 className="font-[family-name:var(--font-landing-display)] text-3xl font-bold leading-tight tracking-tight sm:text-5xl">
            Coloque a recompra no piloto.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-white/65">
            Fale com a Tradutto, escolha o plano certo e rode a loja com estoque,
            vendas e clientes no mesmo sistema.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href={WA}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#1B4DE0] to-[#19D4E3] px-7 font-[family-name:var(--font-landing-display)] text-sm font-semibold text-white transition-transform hover:scale-[1.03] active:scale-95"
            >
              <MessageCircle className="h-4 w-4" /> Falar no WhatsApp
            </a>
            <Link
              to="/login"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-7 font-[family-name:var(--font-landing-display)] text-sm font-semibold text-white transition-colors hover:bg-white/10"
            >
              Já tenho conta
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-[#e6e9f2] bg-white">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-4 py-10 sm:flex-row sm:px-6">
          <div className="flex flex-col items-center gap-2 sm:items-start">
            <div className="flex items-center gap-2.5">
              <img src={APP_LOGO_URL} alt="" className="h-8 w-8 object-contain" />
              <span className="font-[family-name:var(--font-landing-display)] text-[15px] font-bold text-[#0a1430]">
                {APP_SHORT_NAME}
                <span className="text-[#1B4DE0]"> Suplementos</span>
              </span>
            </div>
            <p className="text-xs text-[#5a6478]">Sistemas que vendem por você · Tradutto IA</p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-[#5a6478]">
            <a href="#recursos" className="hover:text-[#0a1430]">
              Recursos
            </a>
            <a href="#precos" className="hover:text-[#0a1430]">
              Planos
            </a>
            <Link to="/login" className="hover:text-[#0a1430]">
              Entrar
            </Link>
            <a
              href={APP_SITE_URL}
              target="_blank"
              rel="noreferrer"
              className="hover:text-[#0a1430]"
            >
              tradutto.com.br
            </a>
          </div>
        </div>
        <div className="border-t border-[#e6e9f2] py-4 text-center text-xs text-[#5a6478]">
          © {new Date().getFullYear()} {APP_NAME}. Todos os direitos reservados.
        </div>
      </footer>

      <style>{`
        @keyframes fadeRise {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

function SectionHead({
  eyebrow,
  title,
  sub,
}: {
  eyebrow: string;
  title: string;
  sub?: string;
}) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <span className="font-[family-name:var(--font-landing-display)] text-[11px] font-semibold tracking-[0.18em] text-[#1B4DE0] uppercase">
        {eyebrow}
      </span>
      <h2 className="mt-2 font-[family-name:var(--font-landing-display)] text-3xl font-bold leading-tight tracking-tight text-[#0a1430] sm:text-4xl">
        {title}
      </h2>
      {sub ? <p className="mt-3 text-base leading-relaxed text-[#5a6478]">{sub}</p> : null}
    </div>
  );
}

function PainCard({
  stat,
  title,
  desc,
}: {
  stat: string;
  title: string;
  desc: string;
}) {
  return (
    <div className="rounded-2xl border border-[#e6e9f2] bg-white p-6 shadow-[0_10px_30px_-20px_rgba(10,20,48,0.35)]">
      <p className="font-[family-name:var(--font-landing-display)] text-2xl font-bold tracking-tight text-[#1B4DE0]">
        {stat}
      </p>
      <p className="mt-1 font-[family-name:var(--font-landing-display)] text-base font-semibold text-[#0a1430]">
        {title}
      </p>
      <p className="mt-2 text-sm leading-relaxed text-[#5a6478]">{desc}</p>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  desc,
}: {
  icon: ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="rounded-2xl border border-[#e6e9f2] bg-[#f7f8fc] p-6 transition-transform duration-200 hover:-translate-y-0.5">
      <span className="grid h-11 w-11 place-items-center rounded-xl bg-[#1B4DE0]/10 text-[#1B4DE0]">
        {icon}
      </span>
      <p className="mt-4 font-[family-name:var(--font-landing-display)] text-base font-semibold text-[#0a1430]">
        {title}
      </p>
      <p className="mt-2 text-sm leading-relaxed text-[#5a6478]">{desc}</p>
    </div>
  );
}

function PlanCard({ plan }: { plan: Plan }) {
  const off = discountPercent(plan);
  const parcel = yearlyInstallment(plan);
  const isDark = plan.id === "implantacao";

  return (
    <div
      className={cn(
        "relative flex flex-col overflow-hidden rounded-2xl border p-6",
        plan.featured && "border-[#1B4DE0] shadow-[0_20px_50px_-28px_rgba(27,77,224,0.55)] ring-1 ring-[#1B4DE0]/20",
        isDark
          ? "border-transparent bg-gradient-to-br from-[#0a1430] via-[#0f1f4a] to-[#12305f] text-white"
          : "border-[#e6e9f2] bg-white",
      )}
    >
      {plan.featured ? (
        <span className="absolute top-4 right-4 inline-flex items-center gap-1 rounded-md bg-[#1B4DE0] px-2.5 py-1 text-[11px] font-bold text-white">
          <Sparkles className="h-3 w-3" /> {plan.badge}
        </span>
      ) : null}

      <p
        className={cn(
          "font-[family-name:var(--font-landing-display)] text-sm font-semibold",
          isDark ? "text-[#19D4E3]" : "text-[#1B4DE0]",
        )}
      >
        {plan.name}
      </p>
      <p className={cn("mt-1 text-sm", isDark ? "text-white/60" : "text-[#5a6478]")}>
        {plan.summary}
      </p>

      <div className="mt-4">
        {plan.priceMonthly != null ? (
          <>
            {plan.listPriceMonthly ? (
              <p className={cn("text-sm", isDark ? "text-white/50" : "text-[#5a6478]")}>
                de <span className="line-through">{formatBRL(plan.listPriceMonthly)}</span>
                {off ? ` · ${off}% off` : ""} por
              </p>
            ) : null}
            <div className="mt-0.5 flex items-end gap-1">
              <span className="font-[family-name:var(--font-landing-display)] text-5xl font-bold tracking-tight">
                {formatBRL(plan.priceMonthly)}
              </span>
              <span className={cn("mb-1.5 text-sm", isDark ? "text-white/55" : "text-[#5a6478]")}>
                /mês
              </span>
            </div>
            {parcel && plan.priceYearly ? (
              <p className={cn("mt-1 text-sm", isDark ? "text-white/55" : "text-[#5a6478]")}>
                ou 12× {formatBRL(parcel)} no anual ({formatBRL(plan.priceYearly)})
              </p>
            ) : null}
          </>
        ) : (
          <>
            <p className="text-sm text-white/60">implementação</p>
            <p className="mt-0.5 font-[family-name:var(--font-landing-display)] text-4xl font-bold tracking-tight">
              {plan.priceLabel}
            </p>
            <p className="mt-1 text-sm text-white/55">
              Valor conforme módulos e tamanho da operação.
            </p>
          </>
        )}
      </div>

      <ul className="mt-5 space-y-2.5">
        {plan.features.map((feature) => (
          <li
            key={feature}
            className={cn(
              "flex items-start gap-2.5 text-sm",
              isDark ? "text-white/85" : "text-[#0a1430]",
            )}
          >
            <span
              className={cn(
                "mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full",
                isDark ? "bg-white/10 text-[#19D4E3]" : "bg-emerald-500/15 text-emerald-700",
              )}
            >
              <Check className="h-3.5 w-3.5" />
            </span>
            {feature}
          </li>
        ))}
      </ul>

      <div className="mt-auto pt-6">
        {plan.cta === "whatsapp" ? (
          <a
            href={WA_IMPLANTACAO}
            target="_blank"
            rel="noreferrer"
            className="flex h-11 items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 font-[family-name:var(--font-landing-display)] text-sm font-semibold text-white transition-colors hover:bg-white/15"
          >
            <MessageCircle className="h-4 w-4" /> Falar com a gente
          </a>
        ) : (
          <a
            href={WA}
            target="_blank"
            rel="noreferrer"
            className={cn(
              "flex h-11 items-center justify-center gap-2 rounded-xl font-[family-name:var(--font-landing-display)] text-sm font-semibold transition-transform hover:scale-[1.02] active:scale-95",
              plan.featured
                ? "bg-gradient-to-r from-[#1B4DE0] to-[#19D4E3] text-white"
                : "bg-[#0a1430] text-white",
            )}
          >
            Quero este plano <ArrowRight className="h-4 w-4" />
          </a>
        )}
      </div>
    </div>
  );
}
