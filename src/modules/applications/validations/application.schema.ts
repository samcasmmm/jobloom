import { z } from 'zod';

export const ApplicationSourceSchema = z.enum([
  'LinkedIn',
  'Referral',
  'Naukri',
  'Wellfound',
  'Company Site',
  'Other',
]);

export const ApplicationStatusSchema = z.enum([
  'Wishlist',
  'Applied',
  'OA',
  'Interview',
  'Offer',
  'Rejected',
  'Ghosted',
]);

export const ApplicationFormSchema = z.object({
  company: z.string().min(1, 'Company name is required').max(100),
  role: z.string().min(1, 'Role is required').max(100),
  jobLink: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  location: z.string().max(100).optional().or(z.literal('')),
  salaryMin: z.number().min(0).optional(),
  salaryMax: z.number().min(0).optional(),
  source: ApplicationSourceSchema,
  status: ApplicationStatusSchema,
  appliedDate: z.string().min(1, 'Applied date is required'),
  followUpDate: z.string().optional().or(z.literal('')),
});

export type ApplicationFormData = z.infer<typeof ApplicationFormSchema>;
