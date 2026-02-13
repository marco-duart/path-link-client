import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { styled } from '@/assets/styles/themes/stitches.config';
import { RoleLevel } from '@/types';
import apiClient from '@/services/api/client';

const repositorySchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  url: z.string().url('URL inválida').min(1, 'URL é obrigatória'),
  techStack: z.string().min(1, 'Stack é obrigatória'),
  description: z.string().optional(),
  requiredLevel: z.number().min(0, 'Nível é obrigatório'),
});

type RepositoryFormData = z.infer<typeof repositorySchema>;

const PageContainer = styled('div', {
  padding: '$lg',
  maxWidth: '900px',
  margin: '0 auto',
});

const FormSection = styled(motion.div, {
  backgroundColor: '$bgSecondary',
  border: '1px solid $borderPrimary',
  borderRadius: '$lg',
  padding: '$xl',
  marginBottom: '$xl',
});

const Title = styled('h1', {
  fontSize: '2rem',
  fontWeight: 700,
  color: '$textPrimary',
  marginBottom: '$lg',
});

const FormGroup = styled('div', {
  marginBottom: '$lg',

  '&:last-of-type': {
    marginBottom: 0,
  },
});

const Label = styled('label', {
  display: 'block',
  fontSize: '$sm',
  fontWeight: '$semibold',
  color: '$textPrimary',
  marginBottom: '$md',
});

const Input = styled('input', {
  width: '100%',
  padding: '$md',
  backgroundColor: '$bgPrimary',
  border: '1px solid $borderPrimary',
  borderRadius: '$md',
  color: '$textPrimary',
  fontSize: '$sm',
  transition: 'all $normal',

  '&:focus': {
    outline: 'none',
    borderColor: '$primaryColor',
    boxShadow: '0 0 0 3px rgba(14, 165, 233, 0.1)',
  },

  '&::placeholder': {
    color: '$textMuted',
  },
});

const Textarea = styled('textarea', {
  width: '100%',
  padding: '$md',
  backgroundColor: '$bgPrimary',
  border: '1px solid $borderPrimary',
  borderRadius: '$md',
  color: '$textPrimary',
  fontSize: '$sm',
  transition: 'all $normal',
  minHeight: '120px',
  fontFamily: 'inherit',
  resize: 'vertical',

  '&:focus': {
    outline: 'none',
    borderColor: '$primaryColor',
    boxShadow: '0 0 0 3px rgba(14, 165, 233, 0.1)',
  },

  '&::placeholder': {
    color: '$textMuted',
  },
});

const Select = styled('select', {
  width: '100%',
  padding: '$md',
  backgroundColor: '$bgPrimary',
  border: '1px solid $borderPrimary',
  borderRadius: '$md',
  color: '$textPrimary',
  fontSize: '$sm',
  transition: 'all $normal',

  '&:focus': {
    outline: 'none',
    borderColor: '$primaryColor',
    boxShadow: '0 0 0 3px rgba(14, 165, 233, 0.1)',
  },

  '& option': {
    backgroundColor: '$bgPrimary',
    color: '$textPrimary',
  },
});

const ErrorMessage = styled('span', {
  fontSize: '$xs',
  color: '$errorColor',
  marginTop: '$xs',
  display: 'block',
});

const ButtonGroup = styled('div', {
  display: 'flex',
  gap: '$md',
  marginTop: '$2xl',
  justifyContent: 'flex-end',

  '@xs': {
    flexDirection: 'column',
  },
});

const Button = styled('button', {
  padding: '$md $lg',
  borderRadius: '$md',
  fontSize: '$sm',
  fontWeight: '$semibold',
  border: 'none',
  cursor: 'pointer',
  transition: 'all $normal',

  variants: {
    variant: {
      primary: {
        backgroundColor: '$primaryColor',
        color: '$bgPrimary',

        '&:hover': {
          backgroundColor: '$borderAccent',
          transform: 'translateY(-2px)',
        },
      },
      secondary: {
        backgroundColor: '$bgTertiary',
        color: '$textPrimary',
        border: '1px solid $borderPrimary',

        '&:hover': {
          backgroundColor: '$borderPrimary',
        },
      },
    },
  },

  defaultVariants: {
    variant: 'primary',
  },
});

const Row = styled('div', {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '$lg',

  '@xs': {
    gridTemplateColumns: '1fr',
  },
});

interface RepositoryFormProps {
  isEditing?: boolean;
}

export const RepositoryForm: React.FC<RepositoryFormProps> = ({
  isEditing = false,
}) => {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const [loading, setLoading] = useState(!!id && isEditing);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<RepositoryFormData>({
    resolver: zodResolver(repositorySchema),
    defaultValues: {
      requiredLevel: RoleLevel.Auxiliar,
    },
  });

  useEffect(() => {
    if (isEditing && id) {
      loadRepository(id);
    }
  }, [id, isEditing]);

  const loadRepository = async (repositoryId: string) => {
    try {
      const data = await apiClient.getRepository(repositoryId);
      reset({
        name: data.name,
        url: data.url,
        techStack: data.techStack,
        description: data.description,
        requiredLevel: data.requiredLevel,
      });
    } catch (error) {
      console.error('Erro ao carregar repositório:', error);
      toast.error('Erro ao carregar repositório');
      navigate('/repositories');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: RepositoryFormData) => {
    try {
      if (isEditing && id) {
        await apiClient.updateRepository(id, data);
        toast.success('Repositório atualizado com sucesso');
      } else {
        await apiClient.createRepository(data);
        toast.success('Repositório criado com sucesso');
      }
      navigate('/repositories');
    } catch (error: any) {
      console.error('Erro:', error);
      toast.error(error.response?.data?.message || 'Erro ao salvar repositório');
    }
  };

  if (loading) {
    return (
      <PageContainer>
        <FormSection>
          <p>Carregando...</p>
        </FormSection>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <FormSection
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Title>
          {isEditing ? 'Editar Repositório' : 'Novo Repositório'}
        </Title>

        <form onSubmit={handleSubmit(onSubmit)}>
          <FormGroup>
            <Label>Nome</Label>
            <Input
              type="text"
              placeholder="Ex: Portal de Clientes"
              {...register('name')}
            />
            {errors.name && <ErrorMessage>{errors.name.message}</ErrorMessage>}
          </FormGroup>

          <Row>
            <FormGroup>
              <Label>URL</Label>
              <Input
                type="text"
                placeholder="https://github.com/empresa/projeto"
                {...register('url')}
              />
              {errors.url && <ErrorMessage>{errors.url.message}</ErrorMessage>}
            </FormGroup>

            <FormGroup>
              <Label>Stack</Label>
              <Input
                type="text"
                placeholder="React, Node, PostgreSQL"
                {...register('techStack')}
              />
              {errors.techStack && (
                <ErrorMessage>{errors.techStack.message}</ErrorMessage>
              )}
            </FormGroup>
          </Row>

          <Row>
            <FormGroup>
              <Label>Nível de Acesso Requerido</Label>
              <Select {...register('requiredLevel', { valueAsNumber: true })}>
                <option value={RoleLevel.Auxiliar}>Auxiliar (10)</option>
                <option value={RoleLevel.Técnico}>Técnico (20)</option>
                <option value={RoleLevel.Gestor}>Gestor (30)</option>
                <option value={RoleLevel.Gerente}>Gerente (40)</option>
                <option value={RoleLevel.Administrador}>Administrador (50)</option>
              </Select>
              {errors.requiredLevel && (
                <ErrorMessage>{errors.requiredLevel.message}</ErrorMessage>
              )}
            </FormGroup>
          </Row>

          <FormGroup>
            <Label>Descrição</Label>
            <Textarea
              placeholder="Contexto, objetivos e observações sobre este repositório"
              {...register('description')}
            />
            {errors.description && (
              <ErrorMessage>{errors.description.message}</ErrorMessage>
            )}
          </FormGroup>

          <ButtonGroup>
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate('/repositories')}
            >
              Cancelar
            </Button>
            <Button type="submit" variant="primary" disabled={isSubmitting}>
              {isSubmitting
                ? 'Salvando...'
                : isEditing
                  ? 'Atualizar'
                  : 'Criar'}
            </Button>
          </ButtonGroup>
        </form>
      </FormSection>
    </PageContainer>
  );
};
