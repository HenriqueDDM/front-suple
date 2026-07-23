import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Menu, X } from "lucide-react";
import { APP_LOGO_URL, APP_NAME, APP_SHORT_NAME } from "@/shared/constants/brand";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "#problema", label: "Problema" },
  { href: "#recursos", label: "Recursos" },
  { href: "#precos", label: "Planos" },
  { href: "#faq", label: "FAQ" },
] as const;

export function LandingNav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled
          ? "border-b border-white/10 bg-[#0a1430]/85 backdrop-blur-xl"
          : "bg-transparent",
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <a href="#topo" className="flex items-center gap-2.5" aria-label={APP_NAME}>
          <img src={APP_LOGO_URL} alt="" className="h-9 w-9 object-contain" />
          <span className="font-[family-name:var(--font-landing-display)] text-[17px] font-bold tracking-tight text-white">
            {APP_SHORT_NAME}
            <span className="text-[#19D4E3]"> Suplementos</span>
          </span>
        </a>

        <nav className="hidden items-center gap-7 md:flex">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-white/65 transition-colors hover:text-white"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <Link
            to="/login"
            className="inline-flex h-10 items-center rounded-xl px-4 text-sm font-semibold text-white/80 transition-colors hover:text-white"
          >
            Entrar
          </Link>
          <a
            href="#precos"
            className="inline-flex h-10 items-center gap-2 rounded-xl bg-gradient-to-r from-[#1B4DE0] to-[#19D4E3] px-5 text-sm font-semibold text-white transition-transform hover:scale-[1.03] active:scale-95"
          >
            Ver planos <ArrowRight className="h-4 w-4" />
          </a>
        </div>

        <button
          type="button"
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          className="grid h-10 w-10 place-items-center rounded-xl text-white md:hidden"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open ? (
        <div className="border-t border-white/10 bg-[#0a1430] px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-3">
            {LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-white/80"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <Link
              to="/login"
              className="text-sm font-semibold text-white"
              onClick={() => setOpen(false)}
            >
              Entrar
            </Link>
            <a
              href="#precos"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#1B4DE0] to-[#19D4E3] text-sm font-semibold text-white"
              onClick={() => setOpen(false)}
            >
              Ver planos
            </a>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
