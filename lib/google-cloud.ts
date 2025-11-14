/**
 * Google Cloud / Vertex AI Authentication Utilities
 * 
 * Supports multiple authentication methods:
 * 1. Access token via GOOGLE_CLOUD_ACCESS_TOKEN env var
 * 2. Application Default Credentials (ADC) - for local dev with gcloud auth
 * 3. Service account JSON via GOOGLE_APPLICATION_CREDENTIALS
 * 4. Metadata server (when running on GCP)
 */

import { logger } from "./utils"

export interface GoogleCloudConfig {
  projectId: string
  location: string
  accessToken?: string
}

/**
 * Get Google Cloud access token
 * Tries multiple methods in order:
 * 1. Environment variable GOOGLE_CLOUD_ACCESS_TOKEN
 * 2. Metadata server (if running on GCP)
 * 3. Returns null (will rely on ADC or service account)
 */
export async function getGoogleCloudAccessToken(): Promise<string | null> {
  // Method 1: Direct access token from env
  if (process.env.GOOGLE_CLOUD_ACCESS_TOKEN) {
    return process.env.GOOGLE_CLOUD_ACCESS_TOKEN
  }

  // Method 2: Try metadata server (if running on GCP)
  try {
    const metadataResponse = await fetch(
      "http://metadata.google.internal/computeMetadata/v1/instance/service-accounts/default/token",
      {
        headers: {
          "Metadata-Flavor": "Google",
        },
        // Add timeout to avoid hanging
        signal: AbortSignal.timeout(2000),
      }
    )

    if (metadataResponse.ok) {
      const metadata = await metadataResponse.json()
      logger.debug("Retrieved access token from metadata server")
      return metadata.access_token
    }
  } catch (error) {
    // Not running on GCP or metadata server unavailable - this is fine
    logger.debug("Metadata server not available (not running on GCP)")
  }

  // Method 3: Will rely on Application Default Credentials or service account
  return null
}

/**
 * Get Google Cloud configuration
 */
export async function getGoogleCloudConfig(): Promise<GoogleCloudConfig | null> {
  const projectId = process.env.GOOGLE_CLOUD_PROJECT_ID
  if (!projectId) {
    return null
  }

  const location = process.env.GOOGLE_CLOUD_LOCATION || "us-central1"
  const accessToken = await getGoogleCloudAccessToken()

  return {
    projectId,
    location,
    accessToken: accessToken || undefined,
  }
}

/**
 * Build Vertex AI API endpoint URL
 */
export function buildVertexAIEndpoint(
  projectId: string,
  location: string,
  model: string
): string {
  return `https://aiplatform.googleapis.com/v1/projects/${projectId}/locations/${location}/publishers/google/models/${model}:generateContent`
}

/**
 * Get authorization headers for Vertex AI API
 * Returns headers with Authorization if token is available
 */
export async function getVertexAIHeaders(): Promise<Record<string, string>> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  }

  const token = await getGoogleCloudAccessToken()
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  return headers
}

