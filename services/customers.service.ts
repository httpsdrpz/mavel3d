import { customers as seedCustomers } from "@/lib/customers";
import type { Customer } from "@/lib/types";

export function getCustomers(): Customer[] {
  return seedCustomers;
}

export function getCustomerById(id: string): Customer | undefined {
  return seedCustomers.find((customer) => customer.id === id);
}
