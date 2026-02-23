// utils/passwordDerivation.js
import { pbkdf2, scrypt, randomBytes, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

const pbkdf2Async = promisify(pbkdf2);
const scryptAsync = promisify(scrypt);

// PBKDF2 (Password-Based Key Derivation Function 2)
export async function hashPasswordPBKDF2(password) {
  const salt = randomBytes(16);
  const iterations = 100000; // Higher = slower = more secure
  const keylen = 64;
  const digest = "sha512";

  const hash = await pbkdf2Async(password, salt, iterations, keylen, digest);

  // Store salt + hash together
  return `${salt.toString("hex")}:${hash.toString("hex")}`;
}

export async function verifyPasswordPBKDF2(password, storedHash) {
  const [salt, hash] = storedHash.split(":");

  const derivedHash = await pbkdf2Async(
    password,
    Buffer.from(salt, "hex"),
    100000,
    64,
    "sha512"
  );

  return timingSafeEqual(Buffer.from(hash, "hex"), derivedHash);
}

// scrypt (Modern Alternative)
export async function hashPasswordScrypt(password) {
  const salt = randomBytes(16);
  const hash = await scryptAsync(password, salt, 64);

  return `${salt.toString("hex")}:${hash.toString("hex")}`;
}

export async function verifyPasswordScrypt(password, storedHash) {
  const [salt, hash] = storedHash.split(":");

  const derivedHash = await scryptAsync(password, Buffer.from(salt, "hex"), 64);

  return timingSafeEqual(Buffer.from(hash, "hex"), derivedHash);
}

// Demo PBKDF2
console.log("=== PBKDF2 Password Hashing ===\n");
const password1 = "MySecurePassword123!";
const hashed1 = await hashPasswordPBKDF2(password1);
console.log("Password:", password1);
console.log("Hashed (PBKDF2):", hashed1);

const valid1 = await verifyPasswordPBKDF2(password1, hashed1);
console.log("Verification:", valid1 ? " Valid" : "  Invalid");

const invalid1 = await verifyPasswordPBKDF2("WrongPassword", hashed1);
console.log("Wrong password:", invalid1 ? " Valid" : "  Invalid");

// Demo scrypt
console.log("\n=== scrypt Password Hashing ===\n");
const password2 = "AnotherPassword456!";
const hashed2 = await hashPasswordScrypt(password2);
console.log("Password:", password2);
console.log("Hashed (scrypt):", hashed2);

const valid2 = await verifyPasswordScrypt(password2, hashed2);
console.log("Verification:", valid2 ? " Valid" : "  Invalid");

// Derive Encryption Key from Password
export async function deriveKeyFromPassword(password, salt) {
  // Derive 256-bit key for AES-256
  const key = await scryptAsync(password, salt, 32);
  return key;
}

console.log("\n=== Key Derivation from Password ===\n");
const userPassword = "user-password";
const salt = randomBytes(16);
const derivedKey = await deriveKeyFromPassword(userPassword, salt);
console.log("Password:", userPassword);
console.log("Salt:", salt.toString("hex"));
console.log("Derived Key (32 bytes):", derivedKey.toString("hex"));

console.log("\n=== Best Practices ===\n");
console.log(" Use scrypt or PBKDF2 for password hashing");
console.log(" Always use unique salt per password");
console.log(" Store salt with the hash (it's not secret)");
console.log(" Use timingSafeEqual for comparison");
console.log(" Higher iterations = slower = more secure");
console.log("  NEVER hash passwords with SHA-256 alone");
console.log("  NEVER use MD5 or SHA-1 for passwords");
