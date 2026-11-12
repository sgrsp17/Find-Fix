import { z } from 'zod';

/** Perfis de utilizador da plataforma (cada um é uma coleção de autenticação própria no Payload). */
export const userRoles = ['client', 'professional', 'staff'] as const;
export type UserRole = (typeof userRoles)[number];

// ---------------------------------------------------------------------------
// Autenticação (pedidos que a app envia à API)
// ---------------------------------------------------------------------------

export const emailSchema = z.email('Email inválido');
export const passwordSchema = z
  .string()
  .min(8, 'A palavra-passe tem de ter pelo menos 8 caracteres');

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Indica a palavra-passe'),
});
export type LoginInput = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  nome: z.string().trim().min(1, 'Indica o nome'),
});
export type RegisterInput = z.infer<typeof registerSchema>;

// ---------------------------------------------------------------------------
// Diagnóstico por IA (valida a resposta do modelo antes de a usar)
// ---------------------------------------------------------------------------

export const urgencySchema = z.enum(['low', 'medium', 'high']);
export type Urgency = z.infer<typeof urgencySchema>;

export const repairDiagnosisSchema = z.object({
  probableCauses: z.array(z.string().min(1)).min(1),
  urgency: urgencySchema,
  priceRange: z
    .object({
      min: z.number().nonnegative(),
      max: z.number().nonnegative(),
      currency: z.literal('EUR'),
    })
    .refine((p) => p.max >= p.min, 'O máximo tem de ser >= ao mínimo'),
});
export type RepairDiagnosis = z.infer<typeof repairDiagnosisSchema>;
