import React from 'react';
import { useNavigate } from 'react-router-dom';
import { styled } from '@/assets/styles/themes/stitches.config';
import { useAuth } from '@/contexts/AuthContext';
import { usePermission } from '@/hooks/usePermission';
import { ConditionalRender } from '@/components/ConditionalRender';
import { motion } from 'framer-motion';
import { FiBook, FiDatabase, FiGitBranch, FiLink2, FiPackage } from 'react-icons/fi';

const PageContainer = styled('div', {
  padding: '$xl',
  maxWidth: '1400px',

  '@xs': {
    padding: '$lg',
  },
});

const Header = styled('div', {
  marginBottom: '$3xl',
});

const Title = styled('h1', {
  fontSize: '$4xl',
  fontWeight: '$bold',
  color: '$textPrimary',
  marginBottom: '$md',

  '@xs': {
    fontSize: '$2xl',
  },
});

const Subtitle = styled('p', {
  fontSize: '$lg',
  color: '$textSecondary',
  marginBottom: '$lg',

  '@xs': {
    fontSize: '$base',
  },
});

const WelcomeCard = styled(motion.div, {
  background: 'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)',
  borderRadius: '$lg',
  padding: '$xl',
  marginBottom: '$3xl',
  color: '$bgPrimary',

  '@xs': {
    padding: '$lg',
  },
});

const WelcomeTitle = styled('h2', {
  fontSize: '$2xl',
  fontWeight: '$bold',
  marginBottom: '$sm',

  '@xs': {
    fontSize: '$xl',
  },
});

const WelcomeText = styled('p', {
  fontSize: '$base',
  opacity: '0.9',
  marginBottom: '$lg',
  maxWidth: '500px',
});

const QuickAccessButton = styled('button', {
  paddingLeft: '$lg',
  paddingRight: '$lg',
  paddingTop: '$md',
  paddingBottom: '$md',
  backgroundColor: '$bgPrimary',
  color: '$primaryColor',
  border: 'none',
  borderRadius: '$md',
  fontWeight: '$semibold',
  cursor: 'pointer',
  transition: 'all $normal',
  fontSize: '$sm',

  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '$lg',
  },
});

const CardGrid = styled('div', {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
  gap: '$lg',
  marginBottom: '$3xl',

  '@xs': {
    gridTemplateColumns: '1fr',
  },
});

const Card = styled(motion.div, {
  backgroundColor: '$bgSecondary',
  border: '1px solid $borderPrimary',
  borderRadius: '$lg',
  padding: '$lg',
  cursor: 'pointer',
  transition: 'all $normal',

  '&:hover': {
    borderColor: '$primaryColor',
    boxShadow: '$lg',
    transform: 'translateY(-4px)',
  },
});

const CardIcon = styled('div', {
  fontSize: '$3xl',
  marginBottom: '$md',
  width: '$2xl',
  height: '$2xl',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '$md',
  backgroundColor: '$bgTertiary',
});

const CardTitle = styled('h3', {
  fontSize: '$lg',
  fontWeight: '$semibold',
  color: '$textPrimary',
  marginBottom: '$sm',
});

const CardDescription = styled('p', {
  fontSize: '$sm',
  color: '$textSecondary',
  marginBottom: '$lg',
});

const CardButton = styled('button', {
  width: '100%',
  paddingTop: '$md',
  paddingBottom: '$md',
  backgroundColor: '$primaryColor',
  color: '$bgPrimary',
  border: 'none',
  borderRadius: '$md',
  fontWeight: '$semibold',
  cursor: 'pointer',
  fontSize: '$sm',
  transition: 'all $normal',

  '&:hover': {
    backgroundColor: '$borderAccent',
  },
});

interface QuickAccessCard {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  path: string;
  minLevel?: number;
}

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { } = usePermission();

  const quickAccessCards: QuickAccessCard[] = [
    {
      id: 'processes',
      title: 'Processos',
      description: 'Veja e gerencie todos os processos documentados',
      icon: <FiBook size={32} />,
      path: '/processes',
    },
    {
      id: 'databases',
      title: 'Bancos de Dados',
      description: 'Acesse informações sobre bancos de dados',
      icon: <FiDatabase size={32} />,
      path: '/databases',
      minLevel: 20,
    },
    {
      id: 'repositories',
      title: 'Repositórios',
      description: 'Gerencie repositórios de código',
      icon: <FiGitBranch size={32} />,
      path: '/repositories',
      minLevel: 20,
    },
    {
      id: 'links',
      title: 'Links Úteis',
      description: 'Acesso rápido a recursos importantes',
      icon: <FiLink2 size={32} />,
      path: '/links',
      minLevel: 20,
    },
    {
      id: 'items',
      title: 'Itens de Configuração',
      description: 'Consulte itens de configuração do sistema',
      icon: <FiPackage size={32} />,
      path: '/configuration-items',
      minLevel: 20,
    },
  ];

  return (
    <PageContainer>
      <Header>
        <Title>Bem-vindo ao Path Link</Title>
        <Subtitle>Sistema de Documentação para Equipe de TI</Subtitle>
      </Header>

      <WelcomeCard
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <WelcomeTitle>Olá, {user?.name}!</WelcomeTitle>
        <WelcomeText>
          Você está logado como <strong>{`${user?.roleName} (Nível ${user?.roleLevel})`}</strong>. 
          Este sistema foi desenvolvido para facilitar a documentação e o acesso à informações críticas da infraestrutura de TI.
        </WelcomeText>
        <QuickAccessButton onClick={() => navigate('/processes')}>
          Ver Processos
        </QuickAccessButton>
      </WelcomeCard>

      <Title style={{ fontSize: '$2xl' as any, marginBottom: '$lg' }}>
        Acesso Rápido
      </Title>

      <CardGrid>
        {quickAccessCards.map((card) => (
          <ConditionalRender
            key={card.id}
            requiredLevel={card.minLevel}
          >
            <Card
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => navigate(card.path)}
            >
              <CardIcon css={{ color: '$primaryColor' }}>
                {card.icon}
              </CardIcon>
              <CardTitle>{card.title}</CardTitle>
              <CardDescription>{card.description}</CardDescription>
              <CardButton>Acessar</CardButton>
            </Card>
          </ConditionalRender>
        ))}
      </CardGrid>
    </PageContainer>
  );
};
