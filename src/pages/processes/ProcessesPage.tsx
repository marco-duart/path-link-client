import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { Table } from "@/components/common";
import { Button } from "@/components/common";
import { ConditionalRender } from "@/components/ConditionalRender";
import apiClient from "@/services/api/client";
import { styled } from "@/assets/styles/themes/stitches.config";

const PageContainer = styled("div", {
  padding: "$spacing-xl",
  maxWidth: "1400px",
  margin: "0 auto",
});

const HeaderSection = styled("div", {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "$spacing-2xl",

  "@md": {
    flexDirection: "column",
    gap: "$spacing-lg",
    alignItems: "flex-start",
  },
});

const Title = styled("h1", {
  fontSize: "2rem",
  fontWeight: 700,
  color: "$text-primary",
  margin: 0,
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

export function ProcessesPage() {
  const navigate = useNavigate();
  const [processes, setProcesses] = useState<Process[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProcesses();
  }, []);

  const loadProcesses = async () => {
    try {
      setLoading(true);
      const data = await apiClient.request("get", "/processes");
      setProcesses(data as Process[]);
    } catch (error) {
      console.error("Erro ao carregar processos:", error);
      toast.error("Erro ao carregar processos");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Tem certeza que deseja deletar este processo?")) {
      return;
    }

    try {
      await apiClient.request("delete", `/processes/${id}`);
      toast.success("Processo deletado com sucesso");
      loadProcesses();
    } catch (error) {
      console.error("Erro ao deletar:", error);
      toast.error("Erro ao deletar processo");
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
          <Title>Processos</Title>
          <ConditionalRender requiredLevel={30}>
            <Button
              variant="primary"
              onClick={() => navigate("/processes/new")}
            >
              + Novo Processo
            </Button>
          </ConditionalRender>
        </HeaderSection>

        <Table
          columns={[
            {
              key: "name",
              label: "Nome",
              width: "250px",
            },
            {
              key: "description",
              label: "Descrição",
              render: (value: any) => (
                <span style={{ color: "#cbd5e1", maxWidth: "300px" }}>
                  {value || "-"}
                </span>
              ),
            },
            {
              key: "category",
              label: "Categoria",
              width: "150px",
              render: (value: any) => (
                <span style={{ color: "#8b5cf6" }}>{value || "-"}</span>
              ),
            },
            {
              key: "isActive",
              label: "Status",
              width: "120px",
              render: (value: any) => (
                <span
                  style={{
                    color: value ? "#10b981" : "#ec4899",
                    fontWeight: 600,
                  }}
                >
                  {value ? "Ativo" : "Inativo"}
                </span>
              ),
            },
            {
              key: "id",
              label: "Ações",
              width: "200px",
              render: (id: number) => (
                <div style={{ display: "flex", gap: "8px" }}>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={(e: any) => {
                      e.stopPropagation();
                      navigate(`/processes/${id}`);
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
                        navigate(`/processes/${id}/edit`);
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
          data={processes}
          rowKey="id"
          loading={loading}
        />
      </PageContainer>
    </motion.div>
  );
}
