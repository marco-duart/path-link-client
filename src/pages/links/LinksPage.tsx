import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { FaExternalLinkAlt } from 'react-icons/fa';
import { Table, Button } from '@/components/common';
import { ConditionalRender } from '@/components/ConditionalRender';
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

interface Link {
  id: number;
  name: string;
  description: string;
  url: string;
  category: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export function LinksPage() {
  const navigate = useNavigate();
  const [links, setLinks] = useState<Link[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLinks();
  }, []);

  const loadLinks = async () => {
    try {
      setLoading(true);
      const data = await apiClient.request('get', '/links');
      setLinks(data as Link[]);
    } catch (error) {
      console.error('Erro ao carregar links:', error);
      toast.error('Erro ao carregar links');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Tem certeza que deseja deletar este link?')) {
      return;
    }

    try {
      await apiClient.request('delete', `/links/${id}`);
      toast.success('Link deletado com sucesso');
      loadLinks();
    } catch (error) {
      console.error('Erro ao deletar:', error);
      toast.error('Erro ao deletar link');
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
          <Title>Links Úteis</Title>
          <ConditionalRender requiredLevel={30}>
            <Button
              variant="primary"
              onClick={() => navigate('/links/new')}
            >
              + Novo Link
            </Button>
          </ConditionalRender>
        </HeaderSection>

        <Table
          columns={[
            {
              key: 'name',
              label: 'Nome',
              width: '200px',
            },
            {
              key: 'description',
              label: 'Descrição',
              render: (value: any) => (
                <span style={{ color: '#cbd5e1', maxWidth: '300px' }}>
                  {value || '-'}
                </span>
              ),
            },
            {
              key: 'category',
              label: 'Categoria',
              width: '150px',
              render: (value: any) => (
                <span style={{ color: '#8b5cf6' }}>
                  {value || '-'}
                </span>
              ),
            },
            {
              key: 'url',
              label: 'URL',
              width: '150px',
              render: (value: any) => (
                <a
                  href={value}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: '#0ea5e9',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  Abrir
                  <FaExternalLinkAlt size={12} />
                </a>
              ),
            },
            {
              key: 'isActive',
              label: 'Status',
              width: '120px',
              render: (value: any) => (
                <span
                  style={{
                    color: value ? '#10b981' : '#ef4444',
                    fontWeight: 600,
                  }}
                >
                  {value ? 'Ativo' : 'Inativo'}
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
                      navigate(`/links/${id}`);
                    }}
                  >
                    Ver
                  </Button>
                  <ConditionalRender requiredLevel={30}>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={(e: any) => {
                        e.stopPropagation();
                        navigate(`/links/${id}/edit`);
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
          data={links}
          rowKey="id"
          loading={loading}
        />
      </PageContainer>
    </motion.div>
  );
}
