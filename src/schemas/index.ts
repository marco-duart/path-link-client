import { z } from 'zod';

// Login Schema
export const loginSchema = z.object({
  email: z
    .string({ required_error: 'Email é obrigatório' })
    .email('Email inválido')
    .min(3, 'Email deve ter no mínimo 3 caracteres')
    .max(255, 'Email deve ter no máximo 255 caracteres'),
  password: z
    .string({ required_error: 'Senha é obrigatória' })
    .min(6, 'Senha deve ter no mínimo 6 caracteres')
    .max(255, 'Senha deve ter no máximo 255 caracteres'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

// User Schema
export const createUserSchema = z.object({
  name: z
    .string({ required_error: 'Nome é obrigatório' })
    .min(3, 'Nome deve ter no mínimo 3 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres'),
  email: z
    .string({ required_error: 'Email é obrigatório' })
    .email('Email inválido')
    .max(255, 'Email deve ter no máximo 255 caracteres'),
  password: z
    .string({ required_error: 'Senha é obrigatória' })
    .min(8, 'Senha deve ter no mínimo 8 caracteres')
    .max(255, 'Senha deve ter no máximo 255 caracteres')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Senha deve conter maiúsculas, minúsculas e números'
    ),
  confirmPassword: z.string({ required_error: 'Confirmação de senha é obrigatória' }),
  roleName: z.enum(['Auxiliar', 'Técnico', 'Gestor', 'Gerente', 'Administrador'], {
    required_error: 'Role é obrigatório',
  }),
  departmentId: z.string().optional(),
  teamId: z.coerce.number().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'As senhas não correspondem',
  path: ['confirmPassword'],
});

export const updateUserSchema = z.object({
  name: z.string().optional(),
  email: z.string().email().optional(),
  roleName: z.enum(['Auxiliar', 'Técnico', 'Gestor', 'Gerente', 'Administrador']).optional(),
  departmentId: z.string().optional(),
  teamId: z.coerce.number().optional(),
});

export type CreateUserFormData = z.infer<typeof createUserSchema>;
export type UpdateUserFormData = z.infer<typeof updateUserSchema>;

// Process Schema
export const createProcessSchema = z.object({
  name: z
    .string({ required_error: 'Nome do processo é obrigatório' })
    .min(3, 'Nome deve ter no mínimo 3 caracteres')
    .max(255, 'Nome deve ter no máximo 255 caracteres'),
  description: z
    .string()
    .max(1000, 'Descrição deve ter no máximo 1000 caracteres')
    .optional(),
  category: z
    .string({ required_error: 'Categoria é obrigatória' })
    .min(1, 'Selecione uma categoria'),
  requiredLevel: z
    .coerce.number()
    .min(10, 'Nível mínimo é 10')
    .max(50, 'Nível máximo é 50')
    .optional()
    .default(10),
});

export const updateProcessSchema = createProcessSchema.partial();

export type CreateProcessFormData = z.infer<typeof createProcessSchema>;
export type UpdateProcessFormData = z.infer<typeof updateProcessSchema>;

// Step Schema
export const createStepSchema = z.object({
  processId: z.string({ required_error: 'Processo é obrigatório' }),
  stepNumber: z
    .coerce.number()
    .min(1, 'Número do passo deve ser maior que 0')
    .max(9999, 'Número do passo muito alto'),
  title: z
    .string({ required_error: 'Título é obrigatório' })
    .min(3, 'Título deve ter no mínimo 3 caracteres')
    .max(255, 'Título deve ter no máximo 255 caracteres'),
  instructions: z
    .string({ required_error: 'Instruções são obrigatórias' })
    .min(10, 'Instruções devem ter no mínimo 10 caracteres')
    .max(5000, 'Instruções devem ter no máximo 5000 caracteres'),
  expectedResult: z
    .string()
    .max(2000, 'Resultado esperado deve ter no máximo 2000 caracteres')
    .optional(),
  notes: z
    .string()
    .max(2000, 'Notas devem ter no máximo 2000 caracteres')
    .optional(),
  isOptional: z.boolean().optional().default(false),
});

export const updateStepSchema = createStepSchema.partial();

export type CreateStepFormData = z.infer<typeof createStepSchema>;
export type UpdateStepFormData = z.infer<typeof updateStepSchema>;

// Account Schema
export const createAccountSchema = z.object({
  name: z
    .string({ required_error: 'Nome da conta é obrigatório' })
    .min(2, 'Nome deve ter no mínimo 2 caracteres')
    .max(255, 'Nome deve ter no máximo 255 caracteres'),
  type: z
    .string({ required_error: 'Tipo de conta é obrigatório' })
    .min(1, 'Selecione um tipo'),
  username: z
    .string({ required_error: 'Nome de usuário é obrigatório' })
    .min(2, 'Nome de usuário deve ter no mínimo 2 caracteres')
    .max(150, 'Nome de usuário deve ter no máximo 150 caracteres'),
  passwordEncrypted: z
    .string({ required_error: 'Senha é obrigatória' })
    .min(4, 'Senha deve ter no mínimo 4 caracteres')
    .max(255, 'Senha deve ter no máximo 255 caracteres'),
  url: z
    .string()
    .url('URL inválida')
    .optional()
    .or(z.literal('')),
  notes: z
    .string()
    .max(2000, 'Notas devem ter no máximo 2000 caracteres')
    .optional(),
  requiredLevel: z
    .coerce.number()
    .min(10, 'Nível mínimo é 10')
    .max(50, 'Nível máximo é 50')
    .optional()
    .default(10),
});

export const updateAccountSchema = createAccountSchema.partial();

export type CreateAccountFormData = z.infer<typeof createAccountSchema>;
export type UpdateAccountFormData = z.infer<typeof updateAccountSchema>;

// Team Schema
export const createTeamSchema = z.object({
  name: z
    .string({ required_error: 'Nome do time é obrigatório' })
    .min(2, 'Nome deve ter no mínimo 2 caracteres')
    .max(255, 'Nome deve ter no máximo 255 caracteres'),
  departmentId: z
    .string({ required_error: 'Departamento é obrigatório' })
    .min(1, 'Selecione um departamento'),
});

export const updateTeamSchema = createTeamSchema.partial();

export type CreateTeamFormData = z.infer<typeof createTeamSchema>;
export type UpdateTeamFormData = z.infer<typeof updateTeamSchema>;

// Department Schema
export const createDepartmentSchema = z.object({
  name: z
    .string({ required_error: 'Nome do departamento é obrigatório' })
    .min(2, 'Nome deve ter no mínimo 2 caracteres')
    .max(255, 'Nome deve ter no máximo 255 caracteres'),
});

export const updateDepartmentSchema = createDepartmentSchema.partial();

export type CreateDepartmentFormData = z.infer<typeof createDepartmentSchema>;
export type UpdateDepartmentFormData = z.infer<typeof updateDepartmentSchema>;

// StepAsset Schema
export const createStepAssetSchema = z.object({
  stepId: z.coerce.number({ required_error: 'Step é obrigatório' }),
  assetId: z
    .string({ required_error: 'Asset é obrigatório' })
    .min(1, 'Selecione um asset'),
  caption: z
    .string()
    .max(255, 'Legenda deve ter no máximo 255 caracteres')
    .optional(),
});

export type CreateStepAssetFormData = z.infer<typeof createStepAssetSchema>;

// StepRelationship Schema
export const createStepRelationshipSchema = z.object({
  stepId: z.coerce.number({ required_error: 'Step é obrigatório' }),
  relatedModel: z
    .string({ required_error: 'Tipo de relacionamento é obrigatório' })
    .min(1, 'Selecione um tipo'),
  relatedId: z
    .string({ required_error: 'Item relacionado é obrigatório' })
    .min(1, 'Selecione um item'),
});

export type CreateStepRelationshipFormData = z.infer<typeof createStepRelationshipSchema>;
