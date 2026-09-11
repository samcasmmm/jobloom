import { z } from 'zod';

export const ContactFormSchema = z.object({
  name: z.string().min(1, 'Contact name is required').max(100),
  role: z.string().max(100).optional().or(z.literal('')),
  company: z.string().max(100).optional().or(z.literal('')),
  linkedinUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  email: z.string().email('Must be a valid email').optional().or(z.literal('')),
  phone: z.string().max(30).optional().or(z.literal('')),
  notes: z.string().optional().or(z.literal('')),
  applicationIds: z.array(z.string()).default([]),
});

export type ContactFormData = z.infer<typeof ContactFormSchema>;
