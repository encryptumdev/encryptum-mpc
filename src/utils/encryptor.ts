import crypto from "crypto";

// Function to encrypt text
export function encrypt(text: string, secretKey: string): string {
  // Generate secret hash with crypto to use for encryption
  const key = crypto
    .createHash("sha512")
    .update(secretKey)
    .digest("hex")
    .substring(0, 32);
  const encryptionIV = crypto
    .createHash("sha512")
    .update(secretKey)
    .digest("hex")
    .substring(0, 16);

  // Create a cipher object
  const cipher = crypto.createCipheriv("aes-256-cbc", key, encryptionIV);

  // Update the cipher with the text to be encrypted
  let encrypted = cipher.update(text, "utf8", "hex");

  // Finalize the encryption
  encrypted += cipher.final("hex");

  return encrypted;
}

// Function to decrypt text
export function decrypt(encryptedText: string, secretKey: string): string {
  // Generate secret hash with crypto to use for encryption
  const key = crypto
    .createHash("sha512")
    .update(secretKey)
    .digest("hex")
    .substring(0, 32);
  const encryptionIV = crypto
    .createHash("sha512")
    .update(secretKey)
    .digest("hex")
    .substring(0, 16);

  // Create a decipher object
  const decipher = crypto.createDecipheriv("aes-256-cbc", key, encryptionIV);

  // Update the decipher with the encrypted text
  let decrypted = decipher.update(encryptedText, "hex", "utf8");

  // Finalize the decryption
  decrypted += decipher.final("utf8");

  return decrypted;
}
