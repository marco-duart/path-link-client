import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/common';
import { styled } from '@/assets/styles/themes/stitches.config';
import { FiArrowLeft } from 'react-icons/fi';

const Container = styled('div', {
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '$spacing-lg',
  background: '$bg-primary',
});

const ContentBox = styled('div', {
  textAlign: 'center',
  maxWidth: '500px',
});

const Number = styled('div', {
  fontSize: '8rem',
  fontWeight: 900,
  color: '$primary',
  lineHeight: 1,
  marginBottom: '$spacing-lg',
  background: 'linear-gradient(135deg, $primary, $secondary)',
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
});

const Title = styled('h1', {
  fontSize: '2.5rem',
  fontWeight: 700,
  color: '$text-primary',
  marginBottom: '$spacing-md',
});

const Description = styled('p', {
  fontSize: '1.125rem',
  color: '$text-secondary',
  marginBottom: '$spacing-2xl',
  lineHeight: 1.6,
});

const ButtonContainer = styled('div', {
  display: 'flex',
  gap: '$spacing-md',
  justifyContent: 'center',

  '@md': {
    flexDirection: 'column',
  },
});

export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <Container>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        <ContentBox>
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <Number>404</Number>
          </motion.div>

          <Title>Página não encontrada</Title>

          <Description>
            Desculpe, a página que você está procurando não existe ou foi removida.
            Que tal voltar para a página inicial?
          </Description>

          <ButtonContainer>
            <Button
              variant="primary"
              onClick={() => navigate('/')}
              size="md"
            >
              <FiArrowLeft style={{ marginRight: '8px' }} />
              Voltar para Home
            </Button>
            <Button
              variant="secondary"
              onClick={() => navigate(-1)}
              size="md"
            >
              Voltar
            </Button>
          </ButtonContainer>
        </ContentBox>
      </motion.div>
    </Container>
  );
}
