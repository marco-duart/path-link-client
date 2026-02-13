import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { FaArrowLeft } from 'react-icons/fa';
import { Card, Button } from '@/components/common';
import { ConditionalRender } from '@/components/ConditionalRender';
import apiClient from '@/services/api/client';
import { styled } from '@/assets/styles/themes/stitches.config';

const PageContainer = styled('div', {
  padding: '$spacing-xl',
  maxWidth: '1200px',
  margin: '0 auto',
});

const BackButton = styled('button', {
  display: 'flex',
  alignItems: 'center',
  gap: '$spacing-sm',
  background: 'none',
  border: 'none',
  color: '$text-primary',
  fontSize: '1rem',
  cursor: 'pointer',
  marginBottom: '$spacing-lg',
  padding: 0,
  transition: 'color 0.2s',

  '&:hover': {
    color: '$primary',
  },
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

const StepsSection = styled('div', {
  marginTop: '$spacing-2xl',
});

const StepsGrid = styled('div', {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
  gap: '$spacing-lg',
  marginTop: '$spacing-lg',
});

const StepCard = styled('div', {
  background: '$bg-secondary',
  border: '1px solid $border',
  borderRadius: '8px',
  padding: '$spacing-lg',
  cursor: 'pointer',
  transition: 'all 0.2s',

  '&:hover': {
    borderColor: '$primary',
    transform: 'translateY(-2px)',
  },
});

const StepNumber = styled('span', {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '32px',
  height: '32px',
  borderRadius: '50%',
  background: '$primary',
  color: '$bg-primary',
  fontWeight: '700',
  fontSize: '0.875rem',
  marginBottom: '$spacing-sm',
});

const StepTitle = styled('h3', {
  color: '$text-primary',
  fontSize: '1.125rem',
  fontWeight: 600,
  margin: '0 0 $spacing-xs 0',
});

const StepDescription = styled('p', {
  color: '$text-secondary',
  fontSize: '0.875rem',
  margin: 0,
  lineHeight: 1.4,
});

interface Process {
  id: number;
  name: string;
  description: string;
  category: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Step {
  id: number;
  name: string;
  description: string;
  order: number;
  processId: number;
}

export function ProcessDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [process, setProcess] = useState<Process | null>(null);
  const [steps, setSteps] = useState<Step[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadProcess();
      loadSteps();
    }
  }, [id]);

  const loadProcess = async () => {
    try {
      const data = await apiClient.request('get', `/processes/${id}`);
      setProcess(data as Process);
    } catch (error) {
      console.error('Erro ao carregar processo:', error);
      toast.error('Erro ao carregar processo');
      navigate('/processes');
    } finally {
      setLoading(false);
    }
  };

  const loadSteps = async () => {
    try {
      const data = await apiClient.request('get', `/processes/${id}/steps`);
      setSteps(data as Step[]);
    } catch (error) {
      console.error('Erro ao carregar passos:', error);
      toast.error('Erro ao carregar passos');
    }
  };

  if (loading || !process) {
    return (
      <PageContainer>
        <BackButton onClick={() => navigate('/processes')}>
          <FaArrowLeft size={18} />
          Voltar
        </BackButton>
        <div style={{ color: '#cbd5e1' }}>Carregando...</div>
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
        <BackButton onClick={() => navigate('/processes')}>
          <FaArrowLeft size={18} />
          Voltar
        </BackButton>

        <ContentGrid>
          <Card title="Informações do Processo">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ color: '#cbd5e1', fontSize: '0.875rem' }}>
                  Nome
                </label>
                <p style={{ color: '$text-primary', margin: '0.5rem 0 0 0' }}>
                  {process.name}
                </p>
              </div>

              <div>
                <label style={{ color: '#cbd5e1', fontSize: '0.875rem' }}>
                  Descrição
                </label>
                <p style={{ color: '$text-primary', margin: '0.5rem 0 0 0' }}>
                  {process.description || 'Sem descrição'}
                </p>
              </div>

              <div>
                <label style={{ color: '#cbd5e1', fontSize: '0.875rem' }}>
                  Categoria
                </label>
                <p style={{ color: '$text-primary', margin: '0.5rem 0 0 0' }}>
                  {process.category || '-'}
                </p>
              </div>

              <div>
                <label style={{ color: '#cbd5e1', fontSize: '0.875rem' }}>
                  Status
                </label>
                <p
                  style={{
                    color: process.isActive ? '#10b981' : '#ef4444',
                    margin: '0.5rem 0 0 0',
                    fontWeight: 600,
                  }}
                >
                  {process.isActive ? 'Ativo' : 'Inativo'}
                </p>
              </div>
            </div>
          </Card>

          <Card title="Ações">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <ConditionalRender requiredLevel={30}>
                <Button
                  variant="secondary"
                  fullWidth
                  onClick={() => navigate(`/processes/${id}/edit`)}
                >
                  Editar Processo
                </Button>
                <Button
                  variant="primary"
                  fullWidth
                  onClick={() => navigate(`/processes/${id}/steps/new`)}
                >
                  + Novo Passo
                </Button>
              </ConditionalRender>
            </div>
          </Card>
        </ContentGrid>

        <StepsSection>
          <h2 style={{ color: '$text-primary', margin: '0 0 1rem 0' }}>
            Passos do Processo ({steps.length})
          </h2>

          {steps.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                padding: '2rem',
                color: '#cbd5e1',
              }}
            >
              Nenhum passo cadastrado ainda
            </div>
          ) : (
            <StepsGrid>
              {steps.map((step) => (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: step.order * 0.05 }}
                  onClick={() => navigate(`/processes/${id}/steps/${step.id}`)}
                >
                  <StepCard>
                    <StepNumber>{step.order}</StepNumber>
                    <StepTitle>{step.name}</StepTitle>
                    <StepDescription>{step.description}</StepDescription>
                  </StepCard>
                </motion.div>
              ))}
            </StepsGrid>
          )}
        </StepsSection>
      </PageContainer>
    </motion.div>
  );
}
