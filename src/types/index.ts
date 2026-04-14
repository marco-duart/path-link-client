// Role Levels - baseado no backend
export const RoleLevel = {
  Auxiliar: 10,
  Técnico: 20,
  Gestor: 30,
  Gerente: 40,
  Administrador: 50,
} as const;

export const RoleNames = {
  [RoleLevel.Auxiliar]: "Auxiliar",
  [RoleLevel.Técnico]: "Técnico",
  [RoleLevel.Gestor]: "Gestor",
  [RoleLevel.Gerente]: "Gerente",
  [RoleLevel.Administrador]: "Administrador",
};

export type RoleName =
  | "Auxiliar"
  | "Técnico"
  | "Gestor"
  | "Gerente"
  | "Administrador";

// Auth Types
export interface User {
  id: number;
  name: string;
  email: string;
  roleName: RoleName;
  department?: {
    id: string;
    name: string;
  };
  team?: {
    id: number;
    name: string;
  };
}

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
}

export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
}

// Process Types
export interface Process {
  id: string;
  name: string;
  description?: string;
  category: string;
  isActive: boolean;
  requiredLevel: number;
  createdBy: User;
  steps: Step[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateProcessDTO {
  name: string;
  description?: string;
  category: string;
  requiredLevel?: number;
}

export interface UpdateProcessDTO extends Partial<CreateProcessDTO> {}

// Step Types
export interface Step {
  id: number;
  processId: string;
  stepNumber: number;
  title: string;
  instructions: string;
  expectedResult?: string;
  notes?: string;
  isOptional?: boolean;
  stepAssets: StepAsset[];
  stepRelationships: StepRelationship[];
}

export interface CreateStepDTO {
  processId: string;
  stepNumber: number;
  title: string;
  instructions: string;
  expectedResult?: string;
  notes?: string;
  isOptional?: boolean;
}

export interface UpdateStepDTO extends Partial<CreateStepDTO> {}

// Asset Types
export interface Asset {
  id: string;
  filename: string;
  url: string;
  mimeType: string;
  requiredLevel?: number;
  uploadedBy: User;
  stepAssets: StepAsset[];
}

// StepAsset Types
export interface StepAsset {
  id: number;
  stepId: number;
  assetId: string;
  caption?: string;
  step?: Step;
  asset?: Asset;
}

export interface CreateStepAssetDTO {
  stepId: number;
  assetId: string;
  caption?: string;
}

// StepRelationship Types
export interface StepRelationship {
  id: number;
  stepId: number;
  relatedModel: string;
  relatedId: string;
  step?: Step;
  relatedObject?: {
    name: string;
    [key: string]: unknown;
  };
}

export interface CreateStepRelationshipDTO {
  stepId: number;
  relatedModel: string;
  relatedId: string;
}

// User Types
export interface UserAccount {
  id: number;
  name: string;
  email: string;
  roleName: RoleName;
  department?: {
    id: string;
    name: string;
  };
  team?: {
    id: number;
    name: string;
  };
}

export interface CreateUserDTO {
  name: string;
  email: string;
  password: string;
  roleName: RoleName;
  departmentId?: string;
  teamId?: number;
}

export interface UpdateUserDTO extends Partial<
  Omit<CreateUserDTO, "password">
> {}

// Team Types
export interface Team {
  id: number;
  name: string;
  departmentId: string;
  users: UserAccount[];
}

export interface CreateTeamDTO {
  name: string;
  departmentId: string;
}

export interface UpdateTeamDTO extends Partial<CreateTeamDTO> {}

// Department Types
export interface Department {
  id: string;
  name: string;
  teams: Team[];
  users: UserAccount[];
}

export interface CreateDepartmentDTO {
  name: string;
}

export interface UpdateDepartmentDTO extends Partial<CreateDepartmentDTO> {}

// Account Types
export interface Account {
  id: string;
  name: string;
  type: string;
  username: string;
  passwordEncrypted?: string;
  url?: string;
  notes?: string;
  twoFactorQrAsset?: Asset | null;
  requiredLevel: number;
}

export interface CreateAccountDTO {
  name: string;
  type: string;
  username: string;
  passwordEncrypted: string;
  url?: string;
  notes?: string;
  twoFactorQrAssetId?: string | null;
  requiredLevel: number;
}

export interface UpdateAccountDTO extends Partial<CreateAccountDTO> {}

// Link Types
export interface Link {
  id: string;
  name: string;
  url: string;
  description?: string;
  requiredLevel?: number;
}

export interface CreateLinkDTO {
  name: string;
  url: string;
  description?: string;
  requiredLevel: number;
}

export interface UpdateLinkDTO extends Partial<CreateLinkDTO> {}

// Configuration Item Types
export interface ConfigurationItem {
  id: string;
  name: string;
  type: string;
  details: string;
  notes?: string;
  requiredLevel: number;
}

export interface CreateConfigurationItemDTO {
  name: string;
  type: string;
  details: string;
  notes?: string;
  requiredLevel: number;
}

export interface UpdateConfigurationItemDTO extends Partial<CreateConfigurationItemDTO> {}

// Repository Types
export interface Repository {
  id: string;
  name: string;
  url: string;
  techStack: string;
  description?: string;
  requiredLevel: number;
}

export interface CreateRepositoryDTO {
  name: string;
  url: string;
  techStack: string;
  description?: string;
  requiredLevel: number;
}

export interface UpdateRepositoryDTO extends Partial<CreateRepositoryDTO> {}

// Deploy Types
export interface Deploy {
  id: string;
  name: string;
  type: string;
  environment: string;
  region?: string;
  endpoint: string;
  description?: string;
  notes?: string;
  credentialsId?: string;
  departmentId?: string;
  teamId?: number;
  requiredLevel: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateDeployDTO {
  name: string;
  type: string;
  environment: string;
  region?: string;
  endpoint: string;
  description?: string;
  notes?: string;
  credentialsId?: string;
  departmentId?: string;
  teamId?: number;
  requiredLevel?: number;
}

export interface UpdateDeployDTO extends Partial<CreateDeployDTO> {}

// Database Types
export interface Database {
  id: string;
  name: string;
  type: string;
  host: string;
  port: number;
  credentialsEncrypted: string;
  notes?: string;
  requiredLevel: number;
}

export interface CreateDatabaseDTO {
  name: string;
  type: string;
  host: string;
  port: number;
  credentialsEncrypted: string;
  notes?: string;
  requiredLevel: number;
}

export interface UpdateDatabaseDTO extends Partial<CreateDatabaseDTO> {}

// Environment Variable Types
export interface EnvironmentVariable {
  id: string;
  name: string;
  valueEncrypted: string;
  description?: string;
  scope: string;
  requiredLevel: number;
}

export interface CreateEnvironmentVariableDTO {
  name: string;
  value: string;
  description?: string;
  scope: string;
  requiredLevel: number;
}

export interface UpdateEnvironmentVariableDTO extends Partial<CreateEnvironmentVariableDTO> {}

// API Response Types
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code?: string;
  };
}
