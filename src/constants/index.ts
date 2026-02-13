import { RoleLevel } from '../types';

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
export const API_TIMEOUT = 30000;

export const ROLE_PERMISSIONS = {
  [RoleLevel.Auxiliar]: {
    canViewProcesses: true,
    canCreateProcess: false,
    canEditProcess: false,
    canDeleteProcess: false,
    canViewSteps: true,
    canCreateStep: false,
    canEditStep: false,
    canDeleteStep: false,
    canViewUsers: false,
    canManageUsers: false,
    canViewAccounts: true,
    canCreateAccount: false,
    canEditAccount: false,
    canDeleteAccount: false,
    canViewTeams: false,
    canManageTeams: false,
    canViewDepartments: false,
    canManageDepartments: false,
    canAdminister: false,
  },
  [RoleLevel.Técnico]: {
    canViewProcesses: true,
    canCreateProcess: true,
    canEditProcess: true,
    canDeleteProcess: false,
    canViewSteps: true,
    canCreateStep: true,
    canEditStep: true,
    canDeleteStep: false,
    canViewUsers: true,
    canManageUsers: false,
    canViewAccounts: true,
    canCreateAccount: true,
    canEditAccount: true,
    canDeleteAccount: false,
    canViewTeams: true,
    canManageTeams: false,
    canViewDepartments: true,
    canManageDepartments: false,
    canAdminister: false,
  },
  [RoleLevel.Gestor]: {
    canViewProcesses: true,
    canCreateProcess: true,
    canEditProcess: true,
    canDeleteProcess: true,
    canViewSteps: true,
    canCreateStep: true,
    canEditStep: true,
    canDeleteStep: true,
    canViewUsers: true,
    canManageUsers: true,
    canViewAccounts: true,
    canCreateAccount: true,
    canEditAccount: true,
    canDeleteAccount: true,
    canViewTeams: true,
    canManageTeams: true,
    canViewDepartments: true,
    canManageDepartments: true,
    canAdminister: false,
  },
  [RoleLevel.Gerente]: {
    canViewProcesses: true,
    canCreateProcess: true,
    canEditProcess: true,
    canDeleteProcess: true,
    canViewSteps: true,
    canCreateStep: true,
    canEditStep: true,
    canDeleteStep: true,
    canViewUsers: true,
    canManageUsers: true,
    canViewAccounts: true,
    canCreateAccount: true,
    canEditAccount: true,
    canDeleteAccount: true,
    canViewTeams: true,
    canManageTeams: true,
    canViewDepartments: true,
    canManageDepartments: true,
    canAdminister: true,
  },
  [RoleLevel.Administrador]: {
    canViewProcesses: true,
    canCreateProcess: true,
    canEditProcess: true,
    canDeleteProcess: true,
    canViewSteps: true,
    canCreateStep: true,
    canEditStep: true,
    canDeleteStep: true,
    canViewUsers: true,
    canManageUsers: true,
    canViewAccounts: true,
    canCreateAccount: true,
    canEditAccount: true,
    canDeleteAccount: true,
    canViewTeams: true,
    canManageTeams: true,
    canViewDepartments: true,
    canManageDepartments: true,
    canAdminister: true,
  },
};

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  
  PROCESSES: '/processes',
  PROCESSES_CREATE: '/processes/new',
  PROCESSES_DETAIL: '/processes/:id',
  PROCESSES_EDIT: '/processes/:id/edit',
  
  STEPS: '/processes/:processId/steps',
  STEPS_CREATE: '/processes/:processId/steps/new',
  STEPS_DETAIL: '/processes/:processId/steps/:id',
  STEPS_EDIT: '/processes/:processId/steps/:id/edit',
  
  USERS: '/users',
  USERS_CREATE: '/users/new',
  USERS_DETAIL: '/users/:id',
  USERS_EDIT: '/users/:id/edit',
  
  ACCOUNTS: '/accounts',
  ACCOUNTS_CREATE: '/accounts/new',
  ACCOUNTS_DETAIL: '/accounts/:id',
  ACCOUNTS_EDIT: '/accounts/:id/edit',
  
  TEAMS: '/teams',
  TEAMS_CREATE: '/teams/new',
  TEAMS_DETAIL: '/teams/:id',
  TEAMS_EDIT: '/teams/:id/edit',
  
  DEPARTMENTS: '/departments',
  DEPARTMENTS_CREATE: '/departments/new',
  DEPARTMENTS_DETAIL: '/departments/:id',
  DEPARTMENTS_EDIT: '/departments/:id/edit',
  
  SETTINGS: '/settings',
  NOT_FOUND: '/404',
};

export const FORM_MESSAGES = {
  REQUIRED: 'Este campo é obrigatório',
  INVALID_EMAIL: 'Endereço de email inválido',
  PASSWORD_TOO_SHORT: 'A senha deve ter pelo menos 8 caracteres',
  PASSWORD_MISMATCH: 'As senhas não correspondem',
  INVALID_URL: 'URL inválida',
  INVALID_PHONE: 'Número de telefone inválido',
};

export const STATUS_MESSAGES = {
  LOADING: 'Carregando...',
  SAVING: 'Salvando...',
  DELETING: 'Excluindo...',
  SUCCESS: 'Operação realizada com sucesso!',
  ERROR: 'Algo deu errado. Tente novamente.',
  NOT_FOUND: 'Recurso não encontrado',
  UNAUTHORIZED: 'Você não tem permissão para acessar isso',
  FORBIDDEN: 'Acesso negado',
};

export const PROCESS_CATEGORIES = [
  'Infraestrutura',
  'Segurança',
  'Rede',
  'Banco de Dados',
  'Suporte',
  'Manutenção',
  'Backup',
  'Monitoramento',
  'Documentação',
  'Outro',
];

export const USER_ROLES = [
  { value: 'Auxiliar', label: 'Auxiliar', level: RoleLevel.Auxiliar },
  { value: 'Técnico', label: 'Técnico', level: RoleLevel.Técnico },
  { value: 'Gestor', label: 'Gestor', level: RoleLevel.Gestor },
  { value: 'Gerente', label: 'Gerente', level: RoleLevel.Gerente },
  { value: 'Administrador', label: 'Administrador', level: RoleLevel.Administrador },
];

export const ACCOUNT_TYPES = [
  'Email',
  'FTP',
  'SSH',
  'VPN',
  'Database',
  'API Key',
  'OAuth Token',
  'Outros',
];

export const TOAST_DURATIONS = {
  SHORT: 3000,
  MEDIUM: 5000,
  LONG: 7000,
};

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZES: [5, 10, 25, 50, 100],
};

export const FILE_UPLOAD = {
  MAX_SIZE: 10 * 1024 * 1024, // 10MB
  MAX_FILE_SIZE_MB: 10,
  ALLOWED_TYPES: [
    'image/jpeg',
    'image/png',
    'image/gif',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ],
};

export const ANIMATION_DURATIONS = {
  FAST: 150,
  BASE: 200,
  SLOW: 300,
  SLOWER: 500,
};
