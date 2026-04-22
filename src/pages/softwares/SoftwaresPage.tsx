import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { Table, Button } from "@/components/common";
import { ConditionalRender } from "@/components/ConditionalRender";
import { styled } from "@/assets/styles/themes/stitches.config";
import apiClient from "@/services/api/client";
import type { Software } from "@/types";

const PageContainer = styled("div", {
  padding: "$lg",
  maxWidth: "1400px",
  margin: "0 auto",
});

const HeaderSection = styled("div", {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "$2xl",
  gap: "$lg",

  "@xs": {
    flexDirection: "column",
    alignItems: "flex-start",
  },
});

const Title = styled("h1", {
  fontSize: "2rem",
  fontWeight: 700,
  color: "$textPrimary",
  margin: 0,
});

export function SoftwaresPage() {
  const navigate = useNavigate();
  const [softwares, setSoftwares] = useState<Software[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSoftwares();
  }, []);

  const loadSoftwares = async () => {
    try {
      setLoading(true);
      const data = await apiClient.getSoftwares();
      setSoftwares(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Erro ao carregar softwares:", error);
      toast.error("Erro ao carregar softwares");
      setSoftwares([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (softwareId: string) => {
    if (!window.confirm("Tem certeza que deseja deletar este software?")) {
      return;
    }

    try {
      await apiClient.deleteSoftware(softwareId);
      toast.success("Software deletado com sucesso");
      loadSoftwares();
    } catch (error: any) {
      console.error("Erro ao deletar software:", error);
      toast.error(error.response?.data?.message || "Erro ao deletar software");
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
          <Title>Softwares</Title>
          <ConditionalRender requiredLevel={30}>
            <Button onClick={() => navigate("/softwares/new")}>+ Novo Software</Button>
          </ConditionalRender>
        </HeaderSection>

        <Table
          columns={[
            {
              key: "name",
              label: "Nome",
              width: "240px",
              render: (value: string) => <strong>{value}</strong>,
            },
            {
              key: "version",
              label: "Versão",
              width: "120px",
              render: (value: string | undefined) => value || "-",
            },
            {
              key: "downloadUrl",
              label: "Download",
              width: "140px",
              render: (value: string) => (
                <a
                  href={value}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "#0ea5e9", textDecoration: "none" }}
                  onClick={(event) => event.stopPropagation()}
                >
                  Abrir link
                </a>
              ),
            },
            {
              key: "description",
              label: "Descrição",
              render: (value: string | undefined) => value || "-",
            },
            {
              key: "id",
              label: "Ações",
              width: "220px",
              render: (id: string) => (
                <div style={{ display: "flex", gap: "8px" }}>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={(event) => {
                      event.stopPropagation();
                      navigate(`/softwares/${id}`);
                    }}
                  >
                    Ver
                  </Button>
                  <ConditionalRender requiredLevel={40}>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={(event) => {
                        event.stopPropagation();
                        navigate(`/softwares/${id}/edit`);
                      }}
                    >
                      Editar
                    </Button>
                    <Button
                      size="sm"
                      variant="error"
                      onClick={(event) => {
                        event.stopPropagation();
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
          data={softwares}
          rowKey="id"
          loading={loading}
          onRowClick={(row) => navigate(`/softwares/${row.id}`)}
          empty="Nenhum software cadastrado"
        />
      </PageContainer>
    </motion.div>
  );
}
