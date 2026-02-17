import axios, { AxiosError } from 'axios';
import type { AxiosInstance, InternalAxiosRequestConfig } from 'axios';

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  retry?: number;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/v1';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    this.client.interceptors.request.use(
      (config: CustomAxiosRequestConfig) => {
        const token = localStorage.getItem('access_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('access_token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  public getInstance(): AxiosInstance {
    return this.client;
  }

  public setAuthToken(token: string) {
    this.client.defaults.headers.common.Authorization = `Bearer ${token}`;
  }

  public removeAuthToken() {
    delete this.client.defaults.headers.common.Authorization;
  }

  // ==================== AUTH ====================
  async login(email: string, password: string) {
    const response = await this.client.post('/auth/login', { email, password });
    const { access_token, user } = response.data;
    localStorage.setItem('access_token', access_token);
    localStorage.setItem('user', JSON.stringify(user));
    return { access_token, user };
  }

  async register(name: string, email: string, password: string) {
    const response = await this.client.post('/auth/register', {
      name,
      email,
      password,
    });
    return response.data;
  }

  async me() {
    const response = await this.client.get('/auth/me');
    localStorage.setItem('user', JSON.stringify(response.data));
    return response.data;
  }

  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
  }

  // ==================== PROCESSES ====================
  async getProcesses(userLevel?: number) {
    const params = userLevel !== undefined ? { userLevel } : {};
    const response = await this.client.get('/processes', { params });
    return response.data;
  }

  async getProcess(id: string) {
    const response = await this.client.get(`/processes/${id}`);
    return response.data;
  }

  async createProcess(data: any) {
    const response = await this.client.post('/processes', data);
    return response.data;
  }

  async updateProcess(id: string, data: any) {
    const response = await this.client.patch(`/processes/${id}`, data);
    return response.data;
  }

  async deleteProcess(id: string) {
    await this.client.delete(`/processes/${id}`);
  }

  // ==================== STEPS ====================
  async getSteps(processId: string) {
    const response = await this.client.get(`/steps/process/${processId}`);
    return response.data;
  }

  async getStep(id: number) {
    const response = await this.client.get(`/steps/${id}`);
    return response.data;
  }

  async createStep(data: any) {
    const response = await this.client.post('/steps', data);
    return response.data;
  }

  async updateStep(id: number, data: any) {
    const response = await this.client.patch(`/steps/${id}`, data);
    return response.data;
  }

  async deleteStep(id: number) {
    await this.client.delete(`/steps/${id}`);
  }

  // ==================== ASSETS ====================
  async getAssets() {
    const response = await this.client.get('/assets');
    return response.data;
  }

  async getAsset(id: string) {
    const response = await this.client.get(`/assets/${id}`);
    return response.data;
  }

  async uploadAsset(file: File, metadata?: any) {
    const formData = new FormData();
    formData.append('file', file);
    if (metadata) {
      Object.keys(metadata).forEach((key) => {
        formData.append(key, metadata[key]);
      });
    }

    const response = await this.client.post('/assets/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  async deleteAsset(id: string) {
    await this.client.delete(`/assets/${id}`);
  }

  // ==================== STEP ASSETS ====================
  async getStepAssets(stepId: number) {
    const response = await this.client.get(`/step-assets?stepId=${stepId}`);
    return response.data;
  }

  async createStepAsset(data: any) {
    const response = await this.client.post('/step-assets', data);
    return response.data;
  }

  async deleteStepAsset(id: number) {
    await this.client.delete(`/step-assets/${id}`);
  }

  // ==================== STEP RELATIONSHIPS ====================
  async getStepRelationships(stepId: number) {
    const response = await this.client.get(
      `/step-relationships?stepId=${stepId}`
    );
    return response.data;
  }

  async createStepRelationship(data: any) {
    const response = await this.client.post('/step-relationships', data);
    return response.data;
  }

  async deleteStepRelationship(id: number) {
    await this.client.delete(`/step-relationships/${id}`);
  }

  // ==================== DEPARTMENTS ====================
  async getDepartments() {
    const response = await this.client.get('/departments');
    return response.data;
  }

  // ==================== TEAMS ====================
  async getTeams() {
    const response = await this.client.get('/teams');
    return response.data;
  }

  // ==================== USERS ====================
  async getUsers() {
    const response = await this.client.get('/users');
    return response.data;
  }

  // ==================== REPOSITORIES ====================
  async getRepositories() {
    const response = await this.client.get('/repositories');
    return response.data;
  }

  async getRepository(id: string) {
    const response = await this.client.get(`/repositories/${id}`);
    return response.data;
  }

  async createRepository(data: any) {
    const response = await this.client.post('/repositories', data);
    return response.data;
  }

  async updateRepository(id: string, data: any) {
    const response = await this.client.patch(`/repositories/${id}`, data);
    return response.data;
  }

  async deleteRepository(id: string) {
    await this.client.delete(`/repositories/${id}`);
  }

  // ==================== DATABASES ====================
  async getDatabases() {
    const response = await this.client.get('/databases');
    return response.data;
  }

  async getDatabase(id: string) {
    const response = await this.client.get(`/databases/${id}`);
    return response.data;
  }

  async createDatabase(data: any) {
    const response = await this.client.post('/databases', data);
    return response.data;
  }

  async updateDatabase(id: string, data: any) {
    const response = await this.client.patch(`/databases/${id}`, data);
    return response.data;
  }

  async deleteDatabase(id: string) {
    await this.client.delete(`/databases/${id}`);
  }

  // ==================== LINKS ====================
  async getLinks() {
    const response = await this.client.get('/links');
    return response.data;
  }

  async getLink(id: string) {
    const response = await this.client.get(`/links/${id}`);
    return response.data;
  }

  async createLink(data: any) {
    const response = await this.client.post('/links', data);
    return response.data;
  }

  async updateLink(id: string, data: any) {
    const response = await this.client.patch(`/links/${id}`, data);
    return response.data;
  }

  async deleteLink(id: string) {
    await this.client.delete(`/links/${id}`);
  }

  // ==================== CONFIGURATION ITEMS ====================
  async getConfigurationItems() {
    const response = await this.client.get('/configuration-items');
    return response.data;
  }

  async getConfigurationItem(id: string) {
    const response = await this.client.get(`/configuration-items/${id}`);
    return response.data;
  }

  async createConfigurationItem(data: any) {
    const response = await this.client.post('/configuration-items', data);
    return response.data;
  }

  async updateConfigurationItem(id: string, data: any) {
    const response = await this.client.patch(`/configuration-items/${id}`, data);
    return response.data;
  }

  async deleteConfigurationItem(id: string) {
    await this.client.delete(`/configuration-items/${id}`);
  }

  // ==================== ENVIRONMENT VARIABLES ====================
  async getEnvironmentVariables() {
    const response = await this.client.get('/environment-variables');
    return response.data;
  }

  async getEnvironmentVariable(id: string) {
    const response = await this.client.get(`/environment-variables/${id}`);
    return response.data;
  }

  async createEnvironmentVariable(data: any) {
    const response = await this.client.post('/environment-variables', data);
    return response.data;
  }

  async updateEnvironmentVariable(id: string, data: any) {
    const response = await this.client.patch(`/environment-variables/${id}`, data);
    return response.data;
  }

  async deleteEnvironmentVariable(id: string) {
    await this.client.delete(`/environment-variables/${id}`);
  }

  // ==================== ACCOUNTS ====================
  async getAccounts() {
    const response = await this.client.get('/accounts');
    return response.data;
  }

  async getAccount(id: string) {
    const response = await this.client.get(`/accounts/${id}`);
    return response.data;
  }

  async createAccount(data: any) {
    const response = await this.client.post('/accounts', data);
    return response.data;
  }

  async updateAccount(id: string, data: any) {
    const response = await this.client.patch(`/accounts/${id}`, data);
    return response.data;
  }

  async deleteAccount(id: string) {
    await this.client.delete(`/accounts/${id}`);
  }

  // ==================== GENERIC ====================
  async request<T>(
    method: 'get' | 'post' | 'put' | 'patch' | 'delete',
    url: string,
    data?: any
  ): Promise<T> {
    const response = await this.client[method](url, data);
    return response.data;
  }
}

export default new ApiClient();
