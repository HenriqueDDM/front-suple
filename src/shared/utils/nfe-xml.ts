// Port of backend NF-e parser for mock mode and client-side preview fallback.

export interface NfeInstallment {
  number: string;
  dueDate: string;
  amount: number;
}

export interface NfeItem {
  description: string;
  quantity: number;
  unitCost: number;
  ncm: string | null;
}

export interface ParsedNfeXml {
  supplierName: string | null;
  supplierCnpj: string | null;
  accessKey: string | null;
  number: string | null;
  issueDate: string | null;
  paymentMethod: string;
  installments: NfeInstallment[];
  items: NfeItem[];
}

function extractTag(xml: string, tag: string): string | null {
  const re = new RegExp(`<${tag}[^>]*>([^<]*)<\\/${tag}>`, "s");
  const match = xml.match(re);
  return match ? match[1].trim() : null;
}

export function extractAccessKey(xml: string, fileName?: string): string | null {
  const idMatch = xml.match(/<infNFe[^>]*\bId\s*=\s*"NFe(\d{44})"/i);
  if (idMatch) return idMatch[1];

  const chMatch = xml.match(/<chNFe>\s*(\d{44})\s*<\/chNFe>/i);
  if (chMatch) return chMatch[1];

  const anyMatch = xml.match(/(?<!\d)(\d{44})(?!\d)/);
  if (anyMatch) return anyMatch[1];

  if (fileName) {
    const fnDigits = fileName.replace(/\D/g, "");
    if (fnDigits.length === 44) return fnDigits;
    const m = fnDigits.match(/\d{44}/);
    if (m) return m[0];
  }

  return null;
}

function parseInstallments(xml: string): NfeInstallment[] {
  const installments: NfeInstallment[] = [];
  const dupRegex = /<dup[^>]*>([\s\S]*?)<\/dup>/g;
  let dupMatch: RegExpExecArray | null;

  while ((dupMatch = dupRegex.exec(xml)) !== null) {
    const block = dupMatch[1];
    const number = extractTag(block, "nDup") ?? "";
    const dueDate = extractTag(block, "dVenc");
    const amountStr = extractTag(block, "vDup");
    if (!dueDate || amountStr == null) continue;

    const amount = Number.parseFloat(amountStr);
    if (!Number.isFinite(amount)) continue;

    installments.push({ number, dueDate, amount });
  }

  return installments;
}

function detectPaymentMethod(xml: string, installments: NfeInstallment[]): string {
  if (installments.length > 0) return "boleto";

  const tPagMatch = xml.match(/<tPag>(\d+)<\/tPag>/);
  if (tPagMatch) {
    switch (tPagMatch[1]) {
      case "01":
        return "cash";
      case "03":
        return "credit";
      case "04":
        return "debit";
      case "15":
        return "boleto";
      case "17":
        return "pix";
      default:
        break;
    }
  }

  return "";
}

export function parseNfeXml(xml: string, fileName?: string): ParsedNfeXml {
  const accessKey = extractAccessKey(xml, fileName);
  const installments = parseInstallments(xml);
  const paymentMethod = detectPaymentMethod(xml, installments);

  const emitMatch = xml.match(/<emit[^>]*>([\s\S]*?)<\/emit>/);
  let supplierName: string | null = null;
  let supplierCnpj: string | null = null;
  if (emitMatch) {
    supplierName = extractTag(emitMatch[1], "xNome");
    const cnpjDigits = (extractTag(emitMatch[1], "CNPJ") ?? "").replace(/\D/g, "");
    supplierCnpj = cnpjDigits.length ? cnpjDigits : null;
  }

  const ideMatch = xml.match(/<ide[^>]*>([\s\S]*?)<\/ide>/);
  const number = ideMatch ? extractTag(ideMatch[1], "nNF") : null;
  const issueDateRaw = ideMatch
    ? extractTag(ideMatch[1], "dhEmi") ?? extractTag(ideMatch[1], "dEmi")
    : null;
  const issueDate = issueDateRaw ? issueDateRaw.slice(0, 10) : null;

  const items: NfeItem[] = [];
  const detRegex = /<det[^>]*>([\s\S]*?)<\/det>/g;
  let detMatch: RegExpExecArray | null;

  while ((detMatch = detRegex.exec(xml)) !== null) {
    const detBlock = detMatch[1];
    const prodMatch = detBlock.match(/<prod[^>]*>([\s\S]*?)<\/prod>/);
    if (!prodMatch) continue;

    const prodBlock = prodMatch[1];
    const description = extractTag(prodBlock, "xProd");
    const quantityStr = extractTag(prodBlock, "qCom");
    const unitCostStr = extractTag(prodBlock, "vUnCom");
    const ncmRaw = extractTag(prodBlock, "NCM");

    if (!description || quantityStr == null || unitCostStr == null) continue;

    const quantity = Math.round(Number.parseFloat(quantityStr));
    const unitCost = Number.parseFloat(unitCostStr);
    if (!Number.isFinite(quantity) || quantity <= 0 || !Number.isFinite(unitCost)) continue;

    const ncmDigits = (ncmRaw ?? "").replace(/\D/g, "");
    items.push({
      description,
      quantity,
      unitCost,
      ncm: ncmDigits.length ? ncmDigits : null,
    });
  }

  return {
    supplierName,
    supplierCnpj,
    accessKey,
    number,
    issueDate,
    paymentMethod,
    installments,
    items,
  };
}
