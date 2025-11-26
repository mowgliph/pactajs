import { z } from 'zod';

/**
 * Schema for creating a new example record
 */
export const createExampleSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255, 'Name must be less than 255 characters'),
  description: z.string().optional(),
  // Add other fields as needed based on your database schema
});

/**
 * Schema for updating an existing example record
 */
export const updateExampleSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255, 'Name must be less than 255 characters').optional(),
  description: z.string().optional(),
  // Add other fields as needed
});

/**
 * Schema for query parameters in list requests
 */
export const listExamplesQuerySchema = z.object({
  limit: z.string().optional().transform(val => val ? parseInt(val) : 10),
  offset: z.string().optional().transform(val => val ? parseInt(val) : 0),
  search: z.string().optional(),
});

/**
 * Schema for path parameters
 */
export const idParamSchema = z.object({
  id: z.string().min(1, 'ID is required'),
});

/**
 * Type exports for TypeScript
 */
export type CreateExampleInput = z.infer<typeof createExampleSchema>;
export type UpdateExampleInput = z.infer<typeof updateExampleSchema>;
export type ListExamplesQuery = z.infer<typeof listExamplesQuerySchema>;
export type IdParam = z.infer<typeof idParamSchema>;