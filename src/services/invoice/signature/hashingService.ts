
/**
 * Create a SHA-256 hash of data
 * @param data The data to hash
 * @returns The hash as an ArrayBuffer
 */
export async function createSHA256Hash(data: ArrayBuffer): Promise<ArrayBuffer> {
  return crypto.subtle.digest('SHA-256', data);
}

/**
 * Convert text to an ArrayBuffer for hashing
 * @param text The text to convert
 * @returns An ArrayBuffer containing the encoded text
 */
export function textToArrayBuffer(text: string): ArrayBuffer {
  return new TextEncoder().encode(text);
}
