import { ZodType } from 'zod';
import { logger } from '@/utils/logger';

/**
 * Validates data against a Zod schema with proper error handling
 */
export function validateData<T>(schema: ZodType<T>, data: unknown): T {
  const result = schema.safeParse(data);
  
  if (!result.success) {
    const errorMessages = result.error.issues.map(
      (issue) => `${issue.path.join('.')}: ${issue.message}`
    ).join(', ');
    
    logger.error('Validation failed:', {
      errors: result.error.issues,
      errorMessages,
      data: typeof data === 'object' ? JSON.stringify(data, null, 2) : String(data)
    });
    
    throw new Error(`Data validation failed: ${errorMessages}`);
  }
  
  return result.data;
}

/**
 * Safely validates data, returning null if validation fails
 */
export function safeValidateData<T>(schema: ZodType<T>, data: unknown): T | null {
  const result = schema.safeParse(data);
  
  if (!result.success) {
    const errorMessages = result.error.issues.map(
      (issue) => `${issue.path.join('.')}: ${issue.message}`
    ).join(', ');
    
    logger.warn('Data validation failed (safe mode):', {
      errors: result.error.issues,
      errorMessages,
      data: typeof data === 'object' ? JSON.stringify(data, null, 2) : String(data)
    });
    
    return null;
  }
  
  return result.data;
}

/**
 * Validates an array of items, filtering out invalid ones
 */
export function validateArray<T>(schema: ZodType<T>, data: unknown[]): T[] {
  const validatedItems: T[] = [];
  const errors: string[] = [];
  
  data.forEach((item, index) => {
    const result = schema.safeParse(item);
    
    if (result.success) {
      validatedItems.push(result.data);
    } else {
      const errorMessages = result.error.issues.map(
        (issue) => `${issue.path.join('.')}: ${issue.message}`
      ).join(', ');
      errors.push(`Item ${index}: ${errorMessages}`);
    }
  });
  
  if (errors.length > 0) {
    logger.warn('Array validation partially failed:', {
      totalItems: data.length,
      validItems: validatedItems.length,
      invalidItems: errors.length,
      errors
    });
  }
  
  return validatedItems;
}

/**
 * Type guard to check if data is valid according to schema
 */
export function isValidData<T>(schema: ZodType<T>, data: unknown): data is T {
  return schema.safeParse(data).success;
}

/**
 * Creates a validated API response handler
 */
export function createValidatedResponse<T>(schema: ZodType<T>) {
  return {
    validate: (data: unknown) => validateData(schema, data),
    safeValidate: (data: unknown) => safeValidateData(schema, data),
    isValid: (data: unknown) => isValidData(schema, data),
    validateArray: (data: unknown[]) => validateArray(schema, data),
  };
}