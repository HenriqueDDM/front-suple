import { parseNfeXml } from "@/shared/utils/nfe-xml";
import { mockProductsService } from "@/services/mock/mock-products.service";
import { mockSuppliersService } from "@/services/mock/mock-suppliers.service";
import type { IPurchasesService } from "@/services/interfaces/purchases.service";
import type {
  ConfirmPurchaseImportDto,
  PurchaseImportPreview,
  PurchaseInvoice,
} from "@/types/api/purchases";

class MockPurchasesService implements IPurchasesService {
  private store: PurchaseInvoice[] = [];
  private xmlStore = new Map<string, string>();

  async previewImport(xml: string, fileName?: string): Promise<PurchaseImportPreview> {
    const parsed = parseNfeXml(xml, fileName);
    const products = await mockProductsService.findAll();

    const isDuplicate = parsed.accessKey
      ? this.store.some((invoice) => invoice.accessKey === parsed.accessKey)
      : false;

    const items = parsed.items.map((item) => {
      const suggested = products.find(
        (product) => product.name.toLowerCase() === item.description.trim().toLowerCase(),
      );
      return {
        description: item.description,
        quantity: item.quantity,
        unitCost: item.unitCost,
        ncm: item.ncm,
        suggestedProductId: suggested?.id ?? null,
        suggestedProductName: suggested?.name ?? null,
        suggestedSalePrice: suggested?.salePrice ?? Math.round(item.unitCost * 1.5 * 100) / 100,
      };
    });

    return {
      supplierName: parsed.supplierName,
      supplierCnpj: parsed.supplierCnpj,
      accessKey: parsed.accessKey,
      number: parsed.number,
      issueDate: parsed.issueDate,
      paymentMethod: parsed.paymentMethod,
      installments: parsed.installments,
      items,
      isDuplicate,
    };
  }

  async confirmImport(dto: ConfirmPurchaseImportDto): Promise<PurchaseInvoice> {
    if (dto.accessKey && this.store.some((invoice) => invoice.accessKey === dto.accessKey)) {
      throw new Error("Esta nota já foi importada.");
    }

    let supplierId: string | null = null;
    let supplierName = dto.supplierName ?? "";
    if (dto.supplierCnpj || dto.supplierName) {
      const suppliers = await mockSuppliersService.findAll();
      const cnpj = (dto.supplierCnpj ?? "").replace(/\D/g, "");
      const existing =
        suppliers.find((s) => cnpj && s.cnpj.replace(/\D/g, "") === cnpj) ??
        suppliers.find(
          (s) => s.name.toLowerCase() === (dto.supplierName ?? "").trim().toLowerCase(),
        );
      if (existing) {
        supplierId = existing.id;
        supplierName = existing.name;
      } else {
        const created = await mockSuppliersService.create({
          name: dto.supplierName ?? "Fornecedor",
          cnpj: cnpj,
          contactName: "",
          phone: "",
          email: "",
          notes: "Cadastrado via importação de NF-e",
        });
        supplierId = created.id;
        supplierName = created.name;
      }
    }

    const invoiceItems = [];
    for (const item of dto.items) {
      let productId = item.productId ?? null;
      if (productId) {
        const product = await mockProductsService.findById(productId);
        if (!product) throw new Error(`Produto ${productId} não encontrado`);
        await mockProductsService.update(productId, {
          quantity: product.quantity + item.quantity,
          purchasePrice: item.unitCost,
          salePrice: item.salePrice,
          ncm: item.ncm ?? product.ncm,
          supplierId,
          supplier: supplierName,
        });
      } else {
        const created = await mockProductsService.create({
          name: item.createProductName ?? item.description,
          brand: "",
          category: "Importado",
          barcode: `NFE-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          purchasePrice: item.unitCost,
          salePrice: item.salePrice,
          quantity: item.quantity,
          ncm: item.ncm ?? "",
          supplierId,
          supplier: supplierName,
        });
        productId = created.id;
      }

      invoiceItems.push({
        productId,
        description: item.description,
        quantity: item.quantity,
        unitCost: item.unitCost,
        salePrice: item.salePrice,
        ncm: item.ncm ?? "",
      });
    }

    const total = dto.items.reduce((sum, item) => sum + item.quantity * item.unitCost, 0);
    const invoice: PurchaseInvoice = {
      id: crypto.randomUUID(),
      supplierId,
      supplierName,
      number: dto.number ?? null,
      issueDate: dto.issueDate ?? null,
      accessKey: dto.accessKey ?? "",
      paymentMethod: dto.paymentMethod ?? "",
      installments: dto.installments ?? [],
      total,
      itemCount: dto.items.length,
      items: invoiceItems,
      createdAt: new Date().toISOString(),
    };

    this.store = [invoice, ...this.store];
    this.xmlStore.set(invoice.id, dto.xml);
    return invoice;
  }

  async findAll(): Promise<PurchaseInvoice[]> {
    return [...this.store];
  }

  async findById(id: string): Promise<PurchaseInvoice | null> {
    return this.store.find((invoice) => invoice.id === id) ?? null;
  }

  async getXml(id: string): Promise<string | null> {
    return this.xmlStore.get(id) ?? null;
  }

  async findBySupplier(supplierId: string): Promise<PurchaseInvoice[]> {
    return this.store.filter((invoice) => invoice.supplierId === supplierId);
  }
}

export const mockPurchasesService = new MockPurchasesService();
