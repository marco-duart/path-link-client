import { useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { Card, Button } from "@/components/common";
import apiClient from "@/services/api/client";
import { styled } from "@/assets/styles/themes/stitches.config";

const PageContainer = styled("div", {
  padding: "$spacing-xl",
  maxWidth: "900px",
  margin: "0 auto",
});

const Title = styled("h1", {
  fontSize: "2rem",
  fontWeight: 700,
  color: "$text-primary",
  margin: "0 0 $spacing-2xl 0",
});

const SectionTitle = styled("h2", {
  fontSize: "1.25rem",
  fontWeight: 600,
  color: "$text-primary",
  margin: "$spacing-2xl 0 $spacing-lg 0",
  paddingBottom: "$spacing-lg",
  borderBottom: "1px solid $border",
});

const FormGroup = styled("div", {
  marginBottom: "$spacing-lg",
});

const Label = styled("label", {
  display: "block",
  fontSize: "0.875rem",
  fontWeight: 500,
  color: "$text-secondary",
  marginBottom: "$spacing-sm",
});

const Input = styled("input", {
  width: "100%",
  padding: "$spacing-sm $spacing-md",
  background: "$bg-secondary",
  border: "1px solid $border",
  borderRadius: "6px",
  color: "$text-primary",
  fontSize: "0.875rem",
  transition: "border-color 0.2s",

  "&:focus": {
    outline: "none",
    borderColor: "$primary",
  },
});

const ButtonGroup = styled("div", {
  display: "flex",
  gap: "$spacing-md",
  marginTop: "$spacing-lg",
});

export function SettingsPage() {
  const [settings, setSettings] = useState({
    appName: "Path Link",
    contactEmail: "admin@pathlink.local",
    maxUploadSize: 10485760,
    sessionTimeout: 3600,
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]:
        name === "maxUploadSize" || name === "sessionTimeout"
          ? parseInt(value)
          : value,
    }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      await apiClient.request("post", "/settings", settings);
      toast.success("Configurações salvas com sucesso");
    } catch (error) {
      console.error("Erro ao salvar configurações:", error);
      toast.error("Erro ao salvar configurações");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSettings({
      appName: "Path Link",
      contactEmail: "admin@pathlink.local",
      maxUploadSize: 10485760,
      sessionTimeout: 3600,
    });
    toast.success("Configurações redefinidas");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <PageContainer>
        <Title>Configurações do Sistema</Title>

        <Card title="Informações Gerais">
          <FormGroup>
            <Label htmlFor="appName">Nome da Aplicação</Label>
            <Input
              id="appName"
              type="text"
              name="appName"
              value={settings.appName}
              onChange={handleChange}
              placeholder="Nome da aplicação"
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="contactEmail">Email de Contato</Label>
            <Input
              id="contactEmail"
              type="email"
              name="contactEmail"
              value={settings.contactEmail}
              onChange={handleChange}
              placeholder="Email de contato"
            />
          </FormGroup>
        </Card>

        <Card title="Limites e Timeouts">
          <FormGroup>
            <Label htmlFor="maxUploadSize">
              Tamanho Máximo de Upload (bytes)
            </Label>
            <Input
              id="maxUploadSize"
              type="number"
              name="maxUploadSize"
              value={settings.maxUploadSize}
              onChange={handleChange}
              placeholder="10485760"
            />
            <span
              style={{
                fontSize: "0.75rem",
                color: "#94a3b8",
                marginTop: "0.25rem",
                display: "block",
              }}
            >
              Padrão: 10 MB (10485760 bytes)
            </span>
          </FormGroup>

          <FormGroup>
            <Label htmlFor="sessionTimeout">Session Timeout (segundos)</Label>
            <Input
              id="sessionTimeout"
              type="number"
              name="sessionTimeout"
              value={settings.sessionTimeout}
              onChange={handleChange}
              placeholder="3600"
            />
            <span
              style={{
                fontSize: "0.75rem",
                color: "#94a3b8",
                marginTop: "0.25rem",
                display: "block",
              }}
            >
              Padrão: 3600 segundos (1 hora)
            </span>
          </FormGroup>
        </Card>

        <div style={{ marginTop: "$spacing-2xl" }}>
          <SectionTitle>Ações</SectionTitle>
          <Card>
            <ButtonGroup>
              <Button variant="primary" onClick={handleSave} loading={loading}>
                Salvar Alterações
              </Button>
              <Button variant="secondary" onClick={handleReset}>
                Redefinir
              </Button>
            </ButtonGroup>
          </Card>
        </div>

        <div style={{ marginTop: "$spacing-2xl" }}>
          <SectionTitle>Informações do Sistema</SectionTitle>
          <Card>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "$spacing-lg",
              }}
            >
              <div>
                <Label>Versão</Label>
                <p style={{ color: "$text-primary", margin: "0.5rem 0 0 0" }}>
                  1.0.0
                </p>
              </div>
              <div>
                <Label>Ambiente</Label>
                <p style={{ color: "$text-primary", margin: "0.5rem 0 0 0" }}>
                  {import.meta.env.VITE_ENV || "development"}
                </p>
              </div>
              <div>
                <Label>API URL</Label>
                <p
                  style={{
                    color: "#0ea5e9",
                    margin: "0.5rem 0 0 0",
                    fontSize: "0.875rem",
                  }}
                >
                  {import.meta.env.VITE_API_URL}
                </p>
              </div>
              <div>
                <Label>Last Build</Label>
                <p
                  style={{
                    color: "$text-primary",
                    margin: "0.5rem 0 0 0",
                    fontSize: "0.875rem",
                  }}
                >
                  {new Date().toLocaleDateString("pt-BR")}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </PageContainer>
    </motion.div>
  );
}
