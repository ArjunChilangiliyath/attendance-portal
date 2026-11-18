
import { z } from 'zod';

// Reusable ID validation
export const requiredId = z
  .string()
  .trim()
  .min(1, 'ID is required');

// Optional ID validation
export const optionalId = requiredId
  .optional()
  .nullable();

// Validate an ID from URL parameters
export const idParam = z.object({
  params: z.object({
    id: requiredId,
  }),
  body: z.any().optional(),
  query: z.any().optional(),
});

// Validate pagination query parameters
export const paginationQuery = z.object({
  query: z
    .object({
      page: z.coerce
        .number()
        .int()
        .positive()
        .max(100000)
        .optional(),

      limit: z.coerce
        .number()
        .int()
        .positive()
        .max(100)
        .optional(),
    })
    .passthrough(),

  body: z.any().optional(),
  params: z.any().optional(),
});
