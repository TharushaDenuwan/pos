import { z } from "zod";

export const checkoutSchema = z.object({
  customerName: z.string().min(2, "Name must be at least 2 characters"),
  customerEmail: z.string().email("Invalid email address"),
  customerPhone: z.string().min(10, "Phone number must be at least 10 digits"),
  customerAddress: z.string().min(5, "Address must be at least 5 characters"),
});

export type CheckoutFormValues = z.infer<typeof checkoutSchema>;
