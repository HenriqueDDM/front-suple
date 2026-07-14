import { useCallback, useMemo, useState } from "react";
import { ShoppingCart, User } from "lucide-react";
import { PageHeader } from "@/shared/components/PageHeader";
import { EmptyState } from "@/shared/components/EmptyState";
import { SearchInput } from "@/shared/components/SearchInput";
import { PaymentMethodSelect } from "@/shared/components/PaymentMethodSelect";
import { SalesProductCard } from "@/features/sales/components/SalesProductCard";
import { CartLineItem } from "@/features/sales/components/CartLineItem";
import { useProducts } from "@/features/products/hooks/useProducts";
import { useSales } from "@/features/sales/hooks/useSales";
import { useSearchFilter } from "@/shared/hooks/useSearchFilter";
import { useCustomers } from "@/features/customers/hooks/useCustomers";
import { WALK_IN_CUSTOMER_ID } from "@/shared/constants/sales";
import { formatCurrency, paymentMethodLabel } from "@/shared/utils/format";
import { parseNumericInput } from "@/shared/utils/number";
import { ApiError } from "@/services";
import type { PaymentMethod, Product } from "@/types";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { ScrollArea } from "@/shared/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/select";
import { toast } from "sonner";

interface CartLine {
  product: Product;
  quantity: number;
}

export function SalesPage() {
  const { items: products } = useProducts();
  const { items: customers } = useCustomers();
  const { createSale } = useSales();
  const [searchQuery, setSearchQuery] = useState("");
  const [customerId, setCustomerId] = useState<string>(WALK_IN_CUSTOMER_ID);
  const [cart, setCart] = useState<CartLine[]>([]);
  const [discount, setDiscount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("pix");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getProductSearchText = useCallback((product: Product) => product.name, []);

  const availableProducts = useMemo(
    () => products.filter((product) => product.quantity > 0),
    [products],
  );

  const filteredProducts = useSearchFilter(availableProducts, searchQuery, getProductSearchText);

  const cartQtyByProduct = useMemo(() => {
    const map = new Map<string, number>();
    for (const line of cart) {
      map.set(line.product.id, line.quantity);
    }
    return map;
  }, [cart]);

  const addToCart = useCallback(
    (product: Product) => {
      const inCart = cartQtyByProduct.get(product.id) ?? 0;
      if (inCart >= product.quantity) {
        toast.error(`Estoque insuficiente de ${product.name}.`);
        return;
      }

      setCart((current) => {
        const existingLine = current.find((line) => line.product.id === product.id);
        if (existingLine) {
          return current.map((line) =>
            line.product.id === product.id ? { ...line, quantity: line.quantity + 1 } : line,
          );
        }
        return [...current, { product, quantity: 1 }];
      });
    },
    [cartQtyByProduct],
  );

  const changeQuantity = useCallback(
    (productId: string, delta: number) => {
      setCart((current) =>
        current
          .map((line) => {
            if (line.product.id !== productId) return line;
            const nextQty = Math.max(0, line.quantity + delta);
            if (delta > 0 && nextQty > line.product.quantity) {
              toast.error(`Estoque insuficiente de ${line.product.name}.`);
              return line;
            }
            return { ...line, quantity: nextQty };
          })
          .filter((line) => line.quantity > 0),
      );
    },
    [],
  );

  const removeLine = useCallback((productId: string) => {
    setCart((current) => current.filter((line) => line.product.id !== productId));
  }, []);

  const subtotal = useMemo(
    () => cart.reduce((sum, line) => sum + line.product.salePrice * line.quantity, 0),
    [cart],
  );

  const total = useMemo(() => Math.max(0, subtotal - discount), [subtotal, discount]);

  const handleFinalize = useCallback(async () => {
    if (cart.length === 0) {
      toast.error("Adicione produtos ao carrinho.");
      return;
    }

    for (const line of cart) {
      if (line.quantity > line.product.quantity) {
        toast.error(`Estoque insuficiente de ${line.product.name}.`);
        return;
      }
    }

    setIsSubmitting(true);
    try {
      await createSale({
        customerId: customerId === WALK_IN_CUSTOMER_ID ? null : customerId,
        items: cart.map((line) => ({
          productId: line.product.id,
          quantity: line.quantity,
        })),
        discount,
        paymentMethod,
      });

      toast.success(`Venda finalizada — ${formatCurrency(total)}`, {
        description: `${paymentMethodLabel[paymentMethod]} · ${cart.length} item(s)`,
      });

      setCart([]);
      setDiscount(0);
      setCustomerId(WALK_IN_CUSTOMER_ID);
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : error instanceof Error
            ? error.message
            : "Não foi possível finalizar a venda.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  }, [cart, createSale, customerId, discount, paymentMethod, total]);

  return (
    <>
      <PageHeader title="Vendas (PDV)" description="Registre uma nova venda." />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
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
                    <SelectItem value={WALK_IN_CUSTOMER_ID}>Consumidor final</SelectItem>
                    {customers.map((customer) => (
                      <SelectItem key={customer.id} value={customer.id}>
                        {customer.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <SearchInput
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Pesquisar produto..."
              />

              <ScrollArea className="h-[420px] pr-3">
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {filteredProducts.map((product) => (
                    <SalesProductCard key={product.id} product={product} onAddToCart={addToCart} />
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

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
                    {cart.map((line) => (
                      <CartLineItem
                        key={line.product.id}
                        product={line.product}
                        quantity={line.quantity}
                        onChangeQuantity={changeQuantity}
                        onRemove={removeLine}
                      />
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
                    onChange={(event) => setDiscount(parseNumericInput(event.target.value))}
                    className="h-8 w-28 text-right"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Forma de pagamento</Label>
                  <PaymentMethodSelect value={paymentMethod} onValueChange={setPaymentMethod} />
                </div>
                <div className="flex items-center justify-between border-t border-border pt-3 text-lg font-semibold">
                  <span>Total</span>
                  <span className="text-primary">{formatCurrency(total)}</span>
                </div>
              </div>

              <Button
                size="lg"
                className="h-12 w-full text-base"
                onClick={() => void handleFinalize()}
                disabled={isSubmitting || cart.length === 0}
              >
                {isSubmitting ? "Finalizando..." : "Finalizar Venda"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
