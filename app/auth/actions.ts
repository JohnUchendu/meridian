"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { sql } from "@/db/client";
import { createSession, destroySession, hashPassword, verifyPassword } from "@/lib/auth";
import { sendWelcomeEmail } from "@/lib/email";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const registerSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8),
});

export type AuthState = { error?: string } | undefined;

export async function loginAction(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) return { error: "Please enter a valid email and password." };

  const { email, password } = parsed.data;
  const rows = await sql`select id, password_hash, role from users where email = ${email}`;
  const user = rows[0];
  if (!user) return { error: "Invalid email or password." };

  const valid = await verifyPassword(password, user.password_hash as string);
  if (!valid) return { error: "Invalid email or password." };

  await createSession({ userId: user.id as string, role: user.role as "client" | "admin" });
  redirect(user.role === "admin" ? "/admin" : "/dashboard");
}

export async function registerAction(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const parsed = registerSchema.safeParse({
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) return { error: "Please fill in all fields (password min 8 characters)." };

  const { firstName, lastName, email, password } = parsed.data;

  const existing = await sql`select id from users where email = ${email}`;
  if (existing.length > 0) return { error: "An account with this email already exists." };

  const passwordHash = await hashPassword(password);
  const rows = await sql`
    insert into users (first_name, last_name, email, password_hash)
    values (${firstName}, ${lastName}, ${email}, ${passwordHash})
    returning id, role
  `;
  const user = rows[0];

  await sendWelcomeEmail(email, firstName).catch((err) => console.error("welcome email failed", err));
  await createSession({ userId: user.id as string, role: user.role as "client" | "admin" });
  redirect("/dashboard");
}

export async function logoutAction() {
  await destroySession();
  redirect("/auth");
}
