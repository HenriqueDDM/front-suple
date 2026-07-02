import { useMemo, useState } from "react";
import { Plus, Minus, Trash2, ShoppingCart, User, Search } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { EmptyState } from "@/components/EmptyState";
import { useProducts } from "@/hooks/useProducts";
import { customers } from "@/services/mock/customers";
import { formatCurrency, paymentMethodLabel } from "@/utils/format";
import type { PaymentMethod, Product } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

interface CartLine {
  product: Product;
  quantity: number;
}

export function SalesPage() {
  const { items: products } = useProducts();
  const [productQuery, setProductQuery] = useState("");
  const [customerId, setCustomerId] = useState<string>("walkin");
  const [cart, setCart] = useState<CartLine[]>([]);
  const [discount, setDiscount] = useState(0);
  const [payment, setPayment] = useState<PaymentMethod>("pix");

  const filtered = useMemo(
    () =>
      products.filter(
        (p) =>
          p.quantity > 0 &&
          p.name.toLowerCase().includes(productQuery.toLowerCase()),
      ),
    [products, productQuery],
  );

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((l) => l.product.id === product.id);
      if (existing) {
        return prev.map((l) =>
          l.product.id === product.id ? { ...l, quantity: l.quantity + 1 } : l,
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const changeQty = (id: string, delta: number) =>
    setCart((prev) =>
      prev
        .map((l) =>
          l.product.id === id
            ? { ...l, quantity: Math.max(0, l.quantity + delta) }
            : l,
        )
        .filter((l) => l.quantity > 0),
    );

  const removeLine = (id: string) =>
    setCart((prev) => prev.filter((l) => l.product.id !== id));

  const subtotal = cart.reduce((s, l) => s + l.product.salePrice * l.quantity, 0);
  const total = Math.max(0, subtotal - discount);

  const finalize = () => {
    if (cart.length === 0) {
      toast.error("Adicione produtos ao carrinho.");
      return;
    }
    toast.success(`Venda finalizada — ${formatCurrency(total)}`, {
      description: `${paymentMethodLabel[payment]} · ${cart.length} item(s)`,
    });
    setCart([]);
    setDiscount(0);
  };

  return (
    <>
      <PageHeader title="Vendas (PDV)" description="Registre uma nova venda." />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        {/* Left — catalog */}
        <div className="space-y-4 lg:col-span-3">
          <Card>
            <CardContent className="space-y-4 p-4 sm:p-6">
              <div className="space-y-2">
                <Label>Cliente</Label>
                <Select value={customerId} onValueChange={setCustomerId}>
                  <SelectTrigger>
                    <User className="h-4 w-4 text-muted-foreground" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="walkin">Consumidor final</SelectItem>
                    {customers.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={productQuery}
                  onChange={(e) => setProductQuery(e.target.value)}
                  placeholder="Pesquisar produto..."
                  className="pl-9"
                />
              </div>

              <ScrollArea className="h-[420px] pr-3">
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {filtered.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => addToCart(p)}
                      className="flex items-center gap-3 rounded-lg border border-border p-2.5 text-left transition-colors hover:border-primary/40 hover:bg-accent"
                    >
                      <img
                        src={p.imageUrl}
                        alt={p.name}
                        className="h-11 w-11 shrink-0 rounded-md object-cover"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">{p.name}</p>
                        <p className="text-xs text-muted-foreground">{p.brand}</p>
                      </div>
                      <span className="shrink-0 text-sm font-semibold text-primary">
                        {formatCurrency(p.salePrice)}
                      </span>
                    </button>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Right — cart */}
        <div className="lg:col-span-2">
          <Card className="lg:sticky lg:top-20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" /> Carrinho
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {cart.length === 0 ? (
                <EmptyState
                  icon={ShoppingCart}
                  title="Carrinho vazio"
                  description="Selecione produtos ao lado."
                />
              ) : (
                <ScrollArea className="max-h-64 pr-2">
                  <div className="space-y-2">
                    {cart.map((l) => (
                      <div
                        key={l.product.id}
                        className="flex items-center gap-2 rounded-lg border border-border p-2"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium">
                            {l.product.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatCurrency(l.product.salePrice)}
                          </p>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => changeQty(l.product.id, -1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-6 text-center text-sm">{l.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => changeQty(l.product.id, 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-destructive"
                            onClick={() => removeLine(l.product.id)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              )}

              <div className="space-y-3 border-t border-border pt-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <Label className="text-muted-foreground">Desconto</Label>
                  <Input
                    type="number"
                    value={discount}
                    onChange={(e) => setDiscount(Number(e.target.value))}
                    className="h-8 w-28 text-right"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Forma de pagamento</Label>
                  <Select
                    value={payment}
                    onValueChange={(v) => setPayment(v as PaymentMethod)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pix">Pix</SelectItem>
                      <SelectItem value="credit">Crédito</SelectItem>
                      <SelectItem value="debit">Débito</SelectItem>
                      <SelectItem value="cash">Dinheiro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between border-t border-border pt-3 text-lg font-semibold">
                  <span>Total</span>
                  <span className="text-primary">{formatCurrency(total)}</span>
                </div>
              </div>

              <Button size="lg" className="h-12 w-full text-base" onClick={finalize}>
                Finalizar Venda
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
