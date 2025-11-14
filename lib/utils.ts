import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Error handling utilities
export class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code?: string,
    public details?: unknown
  ) {
    super(message)
    this.name = 'AppError'
    Object.setPrototypeOf(this, AppError.prototype)
  }
}

export function createErrorResponse(error: unknown, defaultMessage = 'An error occurred') {
  if (error instanceof AppError) {
    return {
      success: false,
      error: error.message,
      code: error.code,
      details: error.details,
      statusCode: error.statusCode,
    }
  }

  if (error instanceof Error) {
    // Don't expose internal error details in production
    const isDevelopment = process.env.NODE_ENV === 'development'
    return {
      success: false,
      error: defaultMessage,
      details: isDevelopment ? error.message : undefined,
      statusCode: 500,
    }
  }

  return {
    success: false,
    error: defaultMessage,
    statusCode: 500,
  }
}

// Validation utilities
export function validateRequired<T extends Record<string, unknown>>(
  data: T,
  fields: (keyof T)[]
): { isValid: boolean; missing: string[] } {
  const missing: string[] = []
  
  for (const field of fields) {
    const value = data[field]
    if (value === undefined || value === null || value === '') {
      missing.push(String(field))
    }
  }
  
  return {
    isValid: missing.length === 0,
    missing,
  }
}

export function sanitizeString(input: unknown, maxLength = 10000): string {
  if (typeof input !== 'string') {
    return ''
  }
  
  // Remove null bytes and trim
  let sanitized = input.replace(/\0/g, '').trim()
  
  // Limit length
  if (sanitized.length > maxLength) {
    sanitized = sanitized.substring(0, maxLength)
  }
  
  return sanitized
}

export function sanitizeNumber(input: unknown, min?: number, max?: number): number | null {
  if (typeof input === 'number') {
    if (min !== undefined && input < min) return null
    if (max !== undefined && input > max) return null
    return input
  }
  
  if (typeof input === 'string') {
    const parsed = Number.parseFloat(input)
    if (Number.isNaN(parsed)) return null
    if (min !== undefined && parsed < min) return null
    if (max !== undefined && parsed > max) return null
    return parsed
  }
  
  return null
}

// Logging utility (replace console.log with this)
export const logger = {
  info: (message: string, ...args: unknown[]) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[INFO] ${message}`, ...args)
    }
  },
  error: (message: string, error?: unknown, ...args: unknown[]) => {
    console.error(`[ERROR] ${message}`, error, ...args)
  },
  warn: (message: string, ...args: unknown[]) => {
    console.warn(`[WARN] ${message}`, ...args)
  },
  debug: (message: string, ...args: unknown[]) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[DEBUG] ${message}`, ...args)
    }
  },
}

// Environment variable validation
export function validateEnvVars(required: string[]): { isValid: boolean; missing: string[] } {
  const missing: string[] = []
  
  for (const key of required) {
    if (!process.env[key]) {
      missing.push(key)
    }
  }
  
  return {
    isValid: missing.length === 0,
    missing,
  }
}

// Type guards
export function isString(value: unknown): value is string {
  return typeof value === 'string'
}

export function isNumber(value: unknown): value is number {
  return typeof value === 'number' && !Number.isNaN(value)
}

export function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

export function isArray(value: unknown): value is unknown[] {
  return Array.isArray(value)
}
