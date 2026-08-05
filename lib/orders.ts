import { products } from "./products";
import { customers } from "./customers";
import type { Order, OrderItem, OrderStatus, PaymentMethod, Address, OrderTimelineEntry } from "./types";

const STATUS_SEQUENCE: OrderStatus[] = ["pendente", "pago", "enviado", "entregue"];

function addDays(date: string, days: number) {
  const d = new Date(date + "T00:00:00");
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

function buildTimeline(status: OrderStatus, createdAt: string): OrderTimelineEntry[] {
  if (status === "cancelado") {
    return [
      { status: "pendente", date: createdAt },
      { status: "cancelado", date: addDays(createdAt, 1) },
    ];
  }
  const upTo = STATUS_SEQUENCE.indexOf(status);
  return STATUS_SEQUENCE.slice(0, upTo + 1).map((s, i) => ({
    status: s,
    date: addDays(createdAt, i),
  }));
}

function itemsFor(productIds: { id: string; quantity: number }[]): OrderItem[] {
  return productIds.map(({ id, quantity }) => {
    const product = products.find((p) => p.id === id)!;
    return { productId: id, quantity, unitPrice: product.price };
  });
}

interface OrderSeed {
  number: string;
  customerId: string;
  items: { id: string; quantity: number }[];
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  address: Address;
  createdAt: string;
}

const seeds: OrderSeed[] = [
  { number: "MVL-100234", customerId: "cust-1", items: [{ id: "fone-aether-pro", quantity: 1 }], status: "entregue", paymentMethod: "cartao", address: customers[0].address, createdAt: "2026-06-02" },
  { number: "MVL-100241", customerId: "cust-2", items: [{ id: "notebook-vortex-14", quantity: 1 }, { id: "acc-mouse-glide", quantity: 1 }], status: "enviado", paymentMethod: "pix", address: customers[1].address, createdAt: "2026-06-18" },
  { number: "MVL-100255", customerId: "cust-3", items: [{ id: "phone-lumen-x", quantity: 1 }], status: "pago", paymentMethod: "cartao", address: customers[2].address, createdAt: "2026-07-01" },
  { number: "MVL-100262", customerId: "cust-4", items: [{ id: "watch-pulse-2", quantity: 1 }, { id: "band-fit-track", quantity: 1 }], status: "entregue", paymentMethod: "boleto", address: customers[3].address, createdAt: "2026-05-20" },
  { number: "MVL-100271", customerId: "cust-5", items: [{ id: "monitor-horizon-32", quantity: 1 }], status: "pendente", paymentMethod: "pix", address: customers[4].address, createdAt: "2026-07-22" },
  { number: "MVL-100284", customerId: "cust-1", items: [{ id: "acc-keyboard-mech", quantity: 1 }, { id: "acc-mouse-glide", quantity: 1 }], status: "cancelado", paymentMethod: "cartao", address: customers[0].address, createdAt: "2026-06-25" },
  { number: "MVL-100290", customerId: "cust-6", items: [{ id: "fone-nova-buds", quantity: 2 }], status: "entregue", paymentMethod: "pix", address: customers[5].address, createdAt: "2026-04-14" },
  { number: "MVL-100301", customerId: "cust-7", items: [{ id: "notebook-slate-air", quantity: 1 }], status: "enviado", paymentMethod: "cartao", address: customers[6].address, createdAt: "2026-07-10" },
  { number: "MVL-100312", customerId: "cust-8", items: [{ id: "phone-lumen-mini", quantity: 1 }, { id: "acc-charge-dock", quantity: 1 }], status: "pago", paymentMethod: "boleto", address: customers[7].address, createdAt: "2026-07-18" },
  { number: "MVL-100325", customerId: "cust-2", items: [{ id: "monitor-flow-27", quantity: 1 }], status: "entregue", paymentMethod: "cartao", address: customers[1].address, createdAt: "2026-05-05" },
  { number: "MVL-100338", customerId: "cust-3", items: [{ id: "acc-backpack-city", quantity: 1 }, { id: "fone-studio-max", quantity: 1 }], status: "pendente", paymentMethod: "pix", address: customers[2].address, createdAt: "2026-07-28" },
  { number: "MVL-100347", customerId: "cust-5", items: [{ id: "watch-pulse-lite", quantity: 1 }], status: "enviado", paymentMethod: "cartao", address: customers[4].address, createdAt: "2026-07-15" },
];

export const orders: Order[] = seeds.map((seed) => {
  const items = itemsFor(seed.items);
  const total = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  return {
    number: seed.number,
    customerId: seed.customerId,
    items,
    total,
    status: seed.status,
    paymentMethod: seed.paymentMethod,
    address: seed.address,
    timeline: buildTimeline(seed.status, seed.createdAt),
    createdAt: seed.createdAt,
  };
});
