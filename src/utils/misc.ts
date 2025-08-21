"use server";
import bcrypt from "bcryptjs";
import { signOut } from "@/auth";
/**
 * Verify if a plain-text password matches the hashed password.
 * @param {string} plainPassword - The plain text password to verify.
 * @param {string} hashedPassword - The hashed password to compare against.
 * @returns {Promise<boolean>} - Returns true if match, false if not.
 */

export async function verifyPassword(
  plainPassword: string,
  hashedPassword: string,
) {
  try {
    const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
    return isMatch;
  } catch (err) {
    console.error("Error verifying password:", err);
    return false;
  }
}

export const signOutAdmin = async () => {
  await signOut();
};

// Returns something like: +8501911234567
export async function randomNorthKoreaMobile(): Promise<string> {
  const country = "+850";
  const prefixes = ["191", "192", "195"]; // mobile prefixes
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];

  // Mobile NSN is 10 digits total → 3 (prefix) + 7 = 10
  let rest = "";
  for (let i = 0; i < 7; i++) rest += Math.floor(Math.random() * 10);

  return country + prefix + rest;
}

// Simple validator for E.164 NK mobiles
export const isNkMobile = async (s: string) =>
  /^\+850(191|192|195)\d{7}$/.test(s);
