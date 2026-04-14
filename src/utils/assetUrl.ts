const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/v1";

function getBackendOrigin(): string {
  try {
    return new URL(API_BASE_URL).origin;
  } catch {
    return window.location.origin;
  }
}

export function resolveUploadUrl(assetUrl?: string | null): string | null {
  if (!assetUrl) return null;

  if (/^https?:\/\//i.test(assetUrl)) {
    return assetUrl;
  }

  const normalizedPath = assetUrl.startsWith("/uploads")
    ? assetUrl
    : `/uploads/${assetUrl.replace(/^\/+/, "")}`;

  return `${getBackendOrigin()}${normalizedPath}`;
}
