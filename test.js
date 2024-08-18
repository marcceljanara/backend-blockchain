import CryptoJS from 'crypto-js';

// Example usage
const aesKey = CryptoJS.enc.Utf8.parse('XiFUvRHM5FN8Qk8vIDngNJezQ0vvxh5n'); // Key must be a WordArray
const encryptedText = 'tDoMSks1jX3dNuh6Y5wocw4yVzrvWBbT6kjIaMzcQgzrYVwf8uRjKyMtWk5bvoEX+1QeLjsGVjU3yHpfXNX7uZ7VDnYQ84C2CKqsHmcjlfu0Z22f+3yrpVWUnXIn+PWiAEkXaa+kSSR4Ai2Cg28yGg=='; // Replace with your actual encrypted text

// Decode base64 ciphertext
const encryptedBytes = CryptoJS.enc.Base64.parse(encryptedText);

// Extract IV (first 16 bytes) and encrypted data
const iv = CryptoJS.lib.WordArray.create(encryptedBytes.words.slice(0, 4)); // 16 bytes
const encryptedData = CryptoJS.lib.WordArray.create(encryptedBytes.words.slice(4));

// Decrypt
const decryptedBytes = CryptoJS.AES.decrypt({ ciphertext: encryptedData }, aesKey, {
  iv,
  mode: CryptoJS.mode.CBC,
  padding: CryptoJS.pad.Pkcs7,
});

// Convert decrypted bytes to string
const decryptedText = decryptedBytes.toString(CryptoJS.enc.Utf8);
console.log('Decrypted text:', decryptedText);
