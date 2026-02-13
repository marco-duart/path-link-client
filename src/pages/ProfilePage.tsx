import { useAuth } from '@/contexts/AuthContext';
import { Card, Button } from '@/components/common';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { styled } from '@/assets/styles/themes/stitches.config';
import { getRoleColor, formatRoleName } from '@/utils/roleHelpers';

const PageContainer = styled('div', {
  padding: '$spacing-xl',
  maxWidth: '900px',
  margin: '0 auto',
});

const Title = styled('h1', {
  fontSize: '2rem',
  fontWeight: 700,
  color: '$text-primary',
  margin: '0 0 $spacing-2xl 0',
});

const ContentGrid = styled('div', {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '$spacing-lg',
  marginBottom: '$spacing-2xl',

  '@md': {
    gridTemplateColumns: '1fr',
  },
});

const InfoGroup = styled('div', {
  marginBottom: '$spacing-lg',

  '&:last-child': {
    marginBottom: 0,
  },
});

const Label = styled('label', {
  display: 'block',
  fontSize: '0.875rem',
  fontWeight: 500,
  color: '$text-secondary',
  marginBottom: '$spacing-sm',
});

const Value = styled('p', {
  color: '$text-primary',
  margin: 0,
  fontSize: '1rem',
  fontWeight: 500,
});

const RoleBadge = styled('span', {
  display: 'inline-block',
  padding: '0.5rem 1rem',
  borderRadius: '6px',
  fontSize: '0.875rem',
  fontWeight: 600,
});

export function ProfilePage() {
  const { user, logout } = useAuth();

  const handleChangePassword = async () => {
    // TODO: Implementar modal para mudar senha
    toast.error('Funcionalidade em desenvolvimento');
  };

  const handleLogout = () => {
    if (window.confirm('Tem certeza que deseja sair?')) {
      logout();
      toast.success('Desconectado com sucesso');
    }
  };

  if (!user) {
    return (
      <PageContainer>
        <Title>Perfil</Title>
        <Card>
          <p style={{ color: '#cbd5e1' }}>Carregando informações do usuário...</p>
        </Card>
      </PageContainer>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <PageContainer>
        <Title>Meu Perfil</Title>

        <ContentGrid>
          <Card title="Informações Pessoais">
            <InfoGroup>
              <Label>Nome</Label>
              <Value>{user.name}</Value>
            </InfoGroup>

            <InfoGroup>
              <Label>Email</Label>
              <Value>{user.email}</Value>
            </InfoGroup>

            <InfoGroup>
              <Label>Função</Label>
              <RoleBadge
                style={{
                  background: getRoleColor(user.roleName),
                  color: '#0f172a',
                }}
              >
                {formatRoleName(user.roleName)}
              </RoleBadge>
            </InfoGroup>

            {user.department && (
              <InfoGroup>
                <Label>Departamento</Label>
                <Value>{user.department.name}</Value>
              </InfoGroup>
            )}

            {user.team && (
              <InfoGroup>
                <Label>Time</Label>
                <Value>{user.team.name}</Value>
              </InfoGroup>
            )}
          </Card>

          <Card title="Ações">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <Button
                variant="secondary"
                fullWidth
                onClick={handleChangePassword}
              >
                Alterar Senha
              </Button>
              <Button
                variant="error"
                fullWidth
                onClick={handleLogout}
              >
                Sair
              </Button>
            </div>
          </Card>
        </ContentGrid>

        <Card title="Informações Adicionais">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '2rem',
            }}
          >
            <InfoGroup>
              <Label>ID</Label>
              <Value style={{ fontSize: '0.875rem', color: '#0ea5e9' }}>
                #{user.id}
              </Value>
            </InfoGroup>

            <InfoGroup>
              <Label>Nível de Acesso</Label>
              <Value style={{ fontSize: '0.875rem' }}>
                {user.roleLevel}
              </Value>
            </InfoGroup>
          </div>
        </Card>
      </PageContainer>
    </motion.div>
  );
}
