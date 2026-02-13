import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Table, Button } from '@/components/common';
import { ConditionalRender } from '@/components/ConditionalRender';
import { getRoleColor, formatRoleName } from '@/utils/roleHelpers';
import apiClient from '@/services/api/client';
import { styled } from '@/assets/styles/themes/stitches.config';

const PageContainer = styled('div', {
  padding: '$spacing-xl',
  maxWidth: '1400px',
  margin: '0 auto',
});

const HeaderSection = styled('div', {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '$spacing-2xl',

  '@md': {
    flexDirection: 'column',
    gap: '$spacing-lg',
    alignItems: 'flex-start',
  },
});

const Title = styled('h1', {
  fontSize: '2rem',
  fontWeight: 700,
  color: '$text-primary',
  margin: 0,
});

const RoleBadge = styled('span', {
  padding: '0.25rem 0.75rem',
  borderRadius: '4px',
  fontSize: '0.875rem',
  fontWeight: 500,
});

interface User {
  id: number;
  name: string;
  email: string;
  roleName: string;
  roleLevel: number;
  department?: { id: number; name: string };
  team?: { id: number; name: string };
  createdAt: string;
  updatedAt: string;
}

export function UsersPage() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await apiClient.request('get', '/users');
      setUsers(data as User[]);
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
      toast.error('Erro ao carregar usuários');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Tem certeza que deseja deletar este usuário?')) {
      return;
    }

    try {
      await apiClient.request('delete', `/users/${id}`);
      toast.success('Usuário deletado com sucesso');
      loadUsers();
    } catch (error) {
      console.error('Erro ao deletar:', error);
      toast.error('Erro ao deletar usuário');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <PageContainer>
        <HeaderSection>
          <Title>Gerenciamento de Usuários</Title>
          <ConditionalRender requiredLevel={99}>
            <Button
              variant="primary"
              onClick={() => navigate('/admin/users/new')}
            >
              + Novo Usuário
            </Button>
          </ConditionalRender>
        </HeaderSection>

        <Table
          columns={[
            {
              key: 'name',
              label: 'Nome',
              width: '180px',
            },
            {
              key: 'email',
              label: 'Email',
              width: '220px',
              render: (value) => (
                <span style={{ color: '#cbd5e1' }}>
                  {value}
                </span>
              ),
            },
            {
              key: 'roleName',
              label: 'Role',
              width: '140px',
              render: (roleName: any) => (
                <RoleBadge
                  style={{
                    background: getRoleColor(roleName),
                    color: '#0f172a',
                  }}
                >
                  {formatRoleName(roleName)}
                </RoleBadge>
              ),
            },
            {
              key: 'department',
              label: 'Departamento',
              width: '150px',
              render: (value: any) => (
                <span style={{ color: '#cbd5e1' }}>
                  {(value as any)?.name || '-'}
                </span>
              ),
            },
            {
              key: 'team',
              label: 'Time',
              width: '150px',
              render: (value: any) => (
                <span style={{ color: '#cbd5e1' }}>
                  {(value as any)?.name || '-'}
                </span>
              ),
            },
            {
              key: 'id',
              label: 'Ações',
              width: '200px',
              render: (id: number) => (
                <div style={{ display: 'flex', gap: '8px' }}>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={(e: any) => {
                      e.stopPropagation();
                      navigate(`/admin/users/${id}`);
                    }}
                  >
                    Ver
                  </Button>
                  <ConditionalRender requiredLevel={99}>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={(e: any) => {
                        e.stopPropagation();
                        navigate(`/admin/users/${id}/edit`);
                      }}
                    >
                      Editar
                    </Button>
                    <Button
                      size="sm"
                      variant="error"
                      onClick={(e: any) => {
                        e.stopPropagation();
                        handleDelete(id);
                      }}
                    >
                      Deletar
                    </Button>
                  </ConditionalRender>
                </div>
              ),
            },
          ]}
          data={users}
          rowKey="id"
          loading={loading}
        />
      </PageContainer>
    </motion.div>
  );
}
