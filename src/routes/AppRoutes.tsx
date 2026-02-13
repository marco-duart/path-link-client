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
import { ProcessesPage, ProcessDetailPage, CreateProcessPage } from '../pages/processes';
import { DatabasesPage, DatabaseForm, DatabaseDetailPage } from '../pages/databases';
import { RepositoriesPage, RepositoryForm, RepositoryDetailPage } from '../pages/repositories';
import { LinksPage } from '../pages/links';
import { UsersPage, SettingsPage } from '../pages/admin';

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

          <Route path="/databases" element={<DatabasesPage />} />
          <Route path="/databases/new" element={<ProtectedRoute requiredLevel={30}><DatabaseForm /></ProtectedRoute>} />
          <Route path="/databases/:id" element={<DatabaseDetailPage />} />
          <Route path="/databases/:id/edit" element={<ProtectedRoute requiredLevel={40}><DatabaseForm isEditing={true} /></ProtectedRoute>} />

          <Route path="/repositories" element={<RepositoriesPage />} />
          <Route path="/repositories/new" element={<ProtectedRoute requiredLevel={30}><RepositoryForm /></ProtectedRoute>} />
          <Route path="/repositories/:id" element={<RepositoryDetailPage />} />
          <Route path="/repositories/:id/edit" element={<ProtectedRoute requiredLevel={40}><RepositoryForm isEditing={true} /></ProtectedRoute>} />

          <Route path="/links" element={<LinksPage />} />

          <Route path="/profile" element={<ProfilePage />} />

          <Route path="/admin/users" element={<ProtectedRoute requiredLevel={50}><UsersPage /></ProtectedRoute>} />
          <Route path="/admin/settings" element={<ProtectedRoute requiredLevel={99}><SettingsPage /></ProtectedRoute>} />
        </Route>

        <Route path="/404" element={<NotFoundPage />} />

        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </BrowserRouter>
  );
};
