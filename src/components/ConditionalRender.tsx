import React from 'react';
import { usePermission } from '../hooks/usePermission';

interface ConditionalRenderProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  requiredLevel?: number;
  isAdmin?: boolean;
  isManager?: boolean;
  isAnalyst?: boolean;
}

export const ConditionalRender: React.FC<ConditionalRenderProps> = ({
  children,
  fallback = null,
  requiredLevel,
  isAdmin,
  isManager,
  isAnalyst,
}) => {
  const permission = usePermission();

  let canRender = true;

  if (requiredLevel !== undefined) {
    canRender = canRender && permission.canAccess(requiredLevel);
  }

  if (isAdmin !== undefined) {
    canRender = canRender && (isAdmin ? permission.isAdmin() : !permission.isAdmin());
  }

  if (isManager !== undefined) {
    canRender = canRender && (isManager ? permission.isManager() : !permission.isManager());
  }

  if (isAnalyst !== undefined) {
    canRender = canRender && (isAnalyst ? permission.isAnalyst() : !permission.isAnalyst());
  }

  return <>{canRender ? children : fallback}</>;
};

interface IfProps {
  condition: boolean;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const If: React.FC<IfProps> = ({ condition, children, fallback = null }) => {
  return <>{condition ? children : fallback}</>;
};
