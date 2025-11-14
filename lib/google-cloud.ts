/**
 * Google Cloud / Vertex AI Authentication Utilities
 * 
 * Supports multiple authentication methods:
 * 1. API Key via GOOGLE_CLOUD_API_KEY or VERTEX_AI_API_KEY (simplest)
 * 2. Access token via GOOGLE_CLOUD_ACCESS_TOKEN env var
 * 3. Application Default Credentials (ADC) - for local dev with gcloud auth
 * 4. Service account JSON via GOOGLE_APPLICATION_CREDENTIALS
 * 5. Metadata server (when running on GCP)
 */

import { GoogleAuth } from "google-auth-library"
import { logger } from "./utils"

export interface GoogleCloudConfig {
  projectId: string
  location: string
  accessToken?: string
  apiKey?: string
}

/**
 * Get Google Cloud access token
 * Tries multiple methods in order:
 * 1. Environment variable GOOGLE_CLOUD_ACCESS_TOKEN
 * 2. Metadata server (if running on GCP)
 * 3. Application Default Credentials (ADC) via Google Auth Library
 */
export async function getGoogleCloudAccessToken(): Promise<string | null> {
  // Method 1: Direct access token from env
  if (process.env.GOOGLE_CLOUD_ACCESS_TOKEN) {
    logger.debug("Using access token from GOOGLE_CLOUD_ACCESS_TOKEN env var")
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

  // Method 3: Service account from individual env vars (like Renoir project)
  if (
    process.env.GOOGLE_CLIENT_EMAIL &&
    process.env.GOOGLE_PRIVATE_KEY &&
    process.env.GOOGLE_CLIENT_ID
  ) {
    try {
      const credentials = {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"), // Handle escaped newlines
        client_id: process.env.GOOGLE_CLIENT_ID,
        project_id: process.env.GOOGLE_CLOUD_PROJECT_ID || process.env.GOOGLE_PROJECT_ID,
      }

      const auth = new GoogleAuth({
        credentials,
        scopes: ["https://www.googleapis.com/auth/cloud-platform"],
      })
      const client = await auth.getClient()
      const accessToken = await client.getAccessToken()
      
      if (accessToken.token) {
        logger.debug("Retrieved access token from service account env vars")
        return accessToken.token
      }
    } catch (error) {
      logger.warn("Failed to get access token from service account env vars", error)
    }
  }

  // Method 4: Use Application Default Credentials (ADC) - works locally, not on Vercel
  try {
    const auth = new GoogleAuth({
      scopes: ["https://www.googleapis.com/auth/cloud-platform"],
    })
    const client = await auth.getClient()
    const accessToken = await client.getAccessToken()
    
    if (accessToken.token) {
      logger.debug("Retrieved access token from Application Default Credentials")
      return accessToken.token
    }
  } catch (error) {
    logger.warn("Failed to get access token from ADC", error)
    // This is okay - might not be configured yet
  }

  return null
}

/**
 * Get Google Cloud API key from environment
 * Checks GOOGLE_CLOUD_API_KEY and VERTEX_AI_API_KEY
 */
export function getGoogleCloudApiKey(): string | null {
  return process.env.GOOGLE_CLOUD_API_KEY || process.env.VERTEX_AI_API_KEY || null
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
  const apiKey = getGoogleCloudApiKey()
  const accessToken = await getGoogleCloudAccessToken()

  return {
    projectId,
    location,
    accessToken: accessToken || undefined,
    apiKey: apiKey || undefined,
  }
}

/**
 * Build Vertex AI API endpoint URL
 * If apiKey is provided, adds it as a query parameter
 */
export function buildVertexAIEndpoint(
  projectId: string,
  location: string,
  model: string,
  method: "generateContent" | "predictLongRunning" | "fetchPredictOperation" = "generateContent",
  apiKey?: string
): string {
  const baseUrl = `https://${location}-aiplatform.googleapis.com/v1/projects/${projectId}/locations/${location}/publishers/google/models/${model}`
  
  let endpoint: string
  if (method === "predictLongRunning") {
    endpoint = `${baseUrl}:predictLongRunning`
  } else if (method === "fetchPredictOperation") {
    endpoint = `${baseUrl}:fetchPredictOperation`
  } else {
    endpoint = `${baseUrl}:generateContent`
  }
  
  // Add API key as query parameter if provided
  if (apiKey) {
    endpoint += `?key=${encodeURIComponent(apiKey)}`
  }
  
  return endpoint
}

/**
 * Get authorization headers for Vertex AI API
 * Returns headers with Authorization if token is available
 * Note: If API key is used, it's added to the URL query string, not headers
 */
export async function getVertexAIHeaders(useApiKey = false): Promise<Record<string, string>> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  }

  // Only add Bearer token if not using API key
  if (!useApiKey) {
    const token = await getGoogleCloudAccessToken()
    if (token) {
      headers.Authorization = `Bearer ${token}`
    }
  }

  return headers
}

