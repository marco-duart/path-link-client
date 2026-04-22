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
import { SoftwaresPage } from '../pages/softwares/SoftwaresPage';
import { SoftwareForm } from '../pages/softwares/SoftwareForm';
import { SoftwareDetailPage } from '../pages/softwares/SoftwareDetailPage';
import { RepositoriesPage, RepositoryForm, RepositoryDetailPage } from '../pages/repositories';
import { DeploysPage, DeployForm, DeployDetailPage } from '../pages/deploys';
import { LinksPage, LinkDetailPage, LinkForm } from '../pages/links';
import { ConfigurationItemsPage, ConfigurationItemDetailPage, ConfigurationItemForm } from '../pages/configuration-items';
import { EnvironmentVariablesPage, EnvironmentVariableDetailPage, EnvironmentVariableForm } from '../pages/environment-variables';
import { AccountsPage, AccountDetailPage, AccountForm } from '../pages/accounts';
import { MachinesPage } from '../pages/logistics/MachinesPage';
import { MachineForm } from '../pages/logistics/MachineForm';
import { MachineDetailPage } from '../pages/logistics/MachineDetailPage';
import { HealthCheckPage } from '../pages/health-check';
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

          <Route path="/health-check" element={<ProtectedRoute feature="healthCheck"><HealthCheckPage /></ProtectedRoute>} />

          <Route path="/processes" element={<ProtectedRoute feature="processes"><ProcessesPage /></ProtectedRoute>} />
          <Route path="/processes/new" element={<ProtectedRoute requiredLevel={30} feature="processes"><CreateProcessPage /></ProtectedRoute>} />
          <Route path="/processes/:id" element={<ProtectedRoute feature="processes"><ProcessDetailPage /></ProtectedRoute>} />
          <Route path="/processes/:id/steps/new" element={<ProtectedRoute requiredLevel={30} feature="processes"><CreateStepPage /></ProtectedRoute>} />
          <Route path="/processes/:id/steps/:stepId/edit" element={<ProtectedRoute requiredLevel={30} feature="processes"><EditStepPage /></ProtectedRoute>} />

          <Route path="/databases" element={<ProtectedRoute feature="databases"><DatabasesPage /></ProtectedRoute>} />
          <Route path="/databases/new" element={<ProtectedRoute requiredLevel={30} feature="databases"><DatabaseForm /></ProtectedRoute>} />
          <Route path="/databases/:id" element={<ProtectedRoute feature="databases"><DatabaseDetailPage /></ProtectedRoute>} />
          <Route path="/databases/:id/edit" element={<ProtectedRoute requiredLevel={40} feature="databases"><DatabaseForm isEditing={true} /></ProtectedRoute>} />

          <Route path="/softwares" element={<ProtectedRoute feature="softwares"><SoftwaresPage /></ProtectedRoute>} />
          <Route path="/softwares/new" element={<ProtectedRoute requiredLevel={30} feature="softwares"><SoftwareForm /></ProtectedRoute>} />
          <Route path="/softwares/:id" element={<ProtectedRoute feature="softwares"><SoftwareDetailPage /></ProtectedRoute>} />
          <Route path="/softwares/:id/edit" element={<ProtectedRoute requiredLevel={40} feature="softwares"><SoftwareForm isEditing={true} /></ProtectedRoute>} />

          <Route path="/repositories" element={<ProtectedRoute feature="repositories"><RepositoriesPage /></ProtectedRoute>} />
          <Route path="/repositories/new" element={<ProtectedRoute requiredLevel={30} feature="repositories"><RepositoryForm /></ProtectedRoute>} />
          <Route path="/repositories/:id" element={<ProtectedRoute feature="repositories"><RepositoryDetailPage /></ProtectedRoute>} />
          <Route path="/repositories/:id/edit" element={<ProtectedRoute requiredLevel={40} feature="repositories"><RepositoryForm isEditing={true} /></ProtectedRoute>} />

          <Route path="/deploys" element={<ProtectedRoute feature="deploys"><DeploysPage /></ProtectedRoute>} />
          <Route path="/deploys/new" element={<ProtectedRoute requiredLevel={30} feature="deploys"><DeployForm /></ProtectedRoute>} />
          <Route path="/deploys/:id" element={<ProtectedRoute feature="deploys"><DeployDetailPage /></ProtectedRoute>} />
          <Route path="/deploys/:id/edit" element={<ProtectedRoute requiredLevel={40} feature="deploys"><DeployForm isEditing={true} /></ProtectedRoute>} />

          <Route path="/links" element={<ProtectedRoute feature="links"><LinksPage /></ProtectedRoute>} />
          <Route path="/links/new" element={<ProtectedRoute requiredLevel={30} feature="links"><LinkForm /></ProtectedRoute>} />
          <Route path="/links/:id" element={<ProtectedRoute feature="links"><LinkDetailPage /></ProtectedRoute>} />
          <Route path="/links/:id/edit" element={<ProtectedRoute requiredLevel={40} feature="links"><LinkForm isEditing={true} /></ProtectedRoute>} />

          <Route path="/configuration-items" element={<ProtectedRoute feature="configurationItems"><ConfigurationItemsPage /></ProtectedRoute>} />
          <Route path="/configuration-items/new" element={<ProtectedRoute requiredLevel={30} feature="configurationItems"><ConfigurationItemForm /></ProtectedRoute>} />
          <Route path="/configuration-items/:id" element={<ProtectedRoute feature="configurationItems"><ConfigurationItemDetailPage /></ProtectedRoute>} />
          <Route path="/configuration-items/:id/edit" element={<ProtectedRoute requiredLevel={40} feature="configurationItems"><ConfigurationItemForm isEditing={true} /></ProtectedRoute>} />

          <Route path="/environment-variables" element={<ProtectedRoute feature="environmentVariables"><EnvironmentVariablesPage /></ProtectedRoute>} />
          <Route path="/environment-variables/new" element={<ProtectedRoute requiredLevel={30} feature="environmentVariables"><EnvironmentVariableForm /></ProtectedRoute>} />
          <Route path="/environment-variables/:id" element={<ProtectedRoute feature="environmentVariables"><EnvironmentVariableDetailPage /></ProtectedRoute>} />
          <Route path="/environment-variables/:id/edit" element={<ProtectedRoute requiredLevel={40} feature="environmentVariables"><EnvironmentVariableForm isEditing={true} /></ProtectedRoute>} />

          <Route path="/accounts" element={<ProtectedRoute feature="accounts"><AccountsPage /></ProtectedRoute>} />
          <Route path="/accounts/new" element={<ProtectedRoute requiredLevel={40} feature="accounts"><AccountForm /></ProtectedRoute>} />
          <Route path="/accounts/:id" element={<ProtectedRoute feature="accounts"><AccountDetailPage /></ProtectedRoute>} />
          <Route path="/accounts/:id/edit" element={<ProtectedRoute requiredLevel={40} feature="accounts"><AccountForm isEditing={true} /></ProtectedRoute>} />

          <Route path="/logistics/machines" element={<ProtectedRoute feature="machines"><MachinesPage /></ProtectedRoute>} />
          <Route path="/logistics/machines/new" element={<ProtectedRoute requiredLevel={30} feature="machines"><MachineForm /></ProtectedRoute>} />
          <Route path="/logistics/machines/:id" element={<ProtectedRoute feature="machines"><MachineDetailPage /></ProtectedRoute>} />
          <Route path="/logistics/machines/:id/edit" element={<ProtectedRoute requiredLevel={40} feature="machines"><MachineForm isEditing={true} /></ProtectedRoute>} />

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
