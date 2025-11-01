import { z } from 'zod';

// Define the schema for the checkout form
export const checkoutSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters long." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  address: z.string().min(10, { message: "Address must be at least 10 characters long." }),
  city: z.string().min(2, { message: "City must be at least 2 characters long." }),
  postalCode: z.string().regex(/^\d{4,10}$/, { message: "Postal code must be 4–10 digits." }),
});

// Infer the TypeScript type from the schema
export type CheckoutFormData = z.infer<typeof checkoutSchema>;

