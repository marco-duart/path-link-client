import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { BaseLayout, } from '../components/base-layout';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { LoginPage } from '../pages/auth/LoginPage';
import { RegisterPage } from '../pages/auth/RegisterPage';
import { HomePage } from '../pages/HomePage';
import { ProfilePage } from '../pages/ProfilePage';
import { NotFoundPage } from '../pages/NotFoundPage';
import { ProcessesPage, ProcessDetailPage, CreateProcessPage, CreateStepPage, EditStepPage } from '../pages/processes';
import { DatabasesPage, DatabaseForm, DatabaseDetailPage } from '../pages/databases';
import { RepositoriesPage, RepositoryForm, RepositoryDetailPage } from '../pages/repositories';
import { LinksPage, LinkDetailPage, LinkForm } from '../pages/links';
import { ConfigurationItemsPage, ConfigurationItemDetailPage, ConfigurationItemForm } from '../pages/configuration-items';
import { EnvironmentVariablesPage, EnvironmentVariableDetailPage, EnvironmentVariableForm } from '../pages/environment-variables';
import { AccountsPage, AccountDetailPage, AccountForm } from '../pages/accounts';
import { UsersPage, UserDetailPage, UserForm, SettingsPage } from '../pages/admin';

const LoadingPage = () => (
  <div
    style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#0f172a',
      color: '#f8fafc',
    }}
  >
    <h1>Carregando...</h1>
  </div>
);

const AuthRedirect: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingPage />;
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

const AuthRequired: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingPage />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            <AuthRedirect>
              <LoginPage />
            </AuthRedirect>
          }
        />
        <Route
          path="/register"
          element={
            <AuthRedirect>
              <RegisterPage />
            </AuthRedirect>
          }
        />

        <Route
          path="/"
          element={
            <AuthRequired>
              <BaseLayout />
            </AuthRequired>
          }
        >
          <Route index element={<HomePage />} />

          <Route path="/processes" element={<ProcessesPage />} />
          <Route path="/processes/new" element={<ProtectedRoute requiredLevel={30}><CreateProcessPage /></ProtectedRoute>} />
          <Route path="/processes/:id" element={<ProcessDetailPage />} />
          <Route path="/processes/:id/steps/new" element={<ProtectedRoute requiredLevel={30}><CreateStepPage /></ProtectedRoute>} />
          <Route path="/processes/:id/steps/:stepId/edit" element={<ProtectedRoute requiredLevel={30}><EditStepPage /></ProtectedRoute>} />

          <Route path="/databases" element={<DatabasesPage />} />
          <Route path="/databases/new" element={<ProtectedRoute requiredLevel={30}><DatabaseForm /></ProtectedRoute>} />
          <Route path="/databases/:id" element={<DatabaseDetailPage />} />
          <Route path="/databases/:id/edit" element={<ProtectedRoute requiredLevel={40}><DatabaseForm isEditing={true} /></ProtectedRoute>} />

          <Route path="/repositories" element={<RepositoriesPage />} />
          <Route path="/repositories/new" element={<ProtectedRoute requiredLevel={30}><RepositoryForm /></ProtectedRoute>} />
          <Route path="/repositories/:id" element={<RepositoryDetailPage />} />
          <Route path="/repositories/:id/edit" element={<ProtectedRoute requiredLevel={40}><RepositoryForm isEditing={true} /></ProtectedRoute>} />

          <Route path="/links" element={<LinksPage />} />
          <Route path="/links/new" element={<ProtectedRoute requiredLevel={30}><LinkForm /></ProtectedRoute>} />
          <Route path="/links/:id" element={<LinkDetailPage />} />
          <Route path="/links/:id/edit" element={<ProtectedRoute requiredLevel={40}><LinkForm isEditing={true} /></ProtectedRoute>} />

          <Route path="/configuration-items" element={<ConfigurationItemsPage />} />
          <Route path="/configuration-items/new" element={<ProtectedRoute requiredLevel={30}><ConfigurationItemForm /></ProtectedRoute>} />
          <Route path="/configuration-items/:id" element={<ConfigurationItemDetailPage />} />
          <Route path="/configuration-items/:id/edit" element={<ProtectedRoute requiredLevel={40}><ConfigurationItemForm isEditing={true} /></ProtectedRoute>} />

          <Route path="/environment-variables" element={<EnvironmentVariablesPage />} />
          <Route path="/environment-variables/new" element={<ProtectedRoute requiredLevel={30}><EnvironmentVariableForm /></ProtectedRoute>} />
          <Route path="/environment-variables/:id" element={<EnvironmentVariableDetailPage />} />
          <Route path="/environment-variables/:id/edit" element={<ProtectedRoute requiredLevel={40}><EnvironmentVariableForm isEditing={true} /></ProtectedRoute>} />

          <Route path="/accounts" element={<AccountsPage />} />
          <Route path="/accounts/new" element={<ProtectedRoute requiredLevel={40}><AccountForm /></ProtectedRoute>} />
          <Route path="/accounts/:id" element={<AccountDetailPage />} />
          <Route path="/accounts/:id/edit" element={<ProtectedRoute requiredLevel={40}><AccountForm isEditing={true} /></ProtectedRoute>} />

          <Route path="/profile" element={<ProfilePage />} />

          <Route path="/admin/users" element={<ProtectedRoute requiredLevel={50}><UsersPage /></ProtectedRoute>} />
          <Route path="/admin/users/new" element={<ProtectedRoute requiredLevel={99}><UserForm /></ProtectedRoute>} />
          <Route path="/admin/users/:id" element={<ProtectedRoute requiredLevel={50}><UserDetailPage /></ProtectedRoute>} />
          <Route path="/admin/users/:id/edit" element={<ProtectedRoute requiredLevel={99}><UserForm isEditing={true} /></ProtectedRoute>} />
          <Route path="/admin/settings" element={<ProtectedRoute requiredLevel={99}><SettingsPage /></ProtectedRoute>} />
        </Route>

        <Route path="/404" element={<NotFoundPage />} />

        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </BrowserRouter>
  );
};
