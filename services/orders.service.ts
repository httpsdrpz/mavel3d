import { orders as seedOrders } from "@/lib/orders";
import type { Order } from "@/lib/types";

export function getOrders(): Order[] {
  return seedOrders;
}

export function getOrderByNumber(number: string): Order | undefined {
  return seedOrders.find((order) => order.number === number);
}

export function getOrdersByCustomer(customerId: string): Order[] {
  return seedOrders.filter((order) => order.customerId === customerId);
}
