import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { Table, Button } from "@/components/common";
import { ConditionalRender } from "@/components/ConditionalRender";
import { styled } from "@/assets/styles/themes/stitches.config";
import apiClient from "@/services/api/client";
import type { Machine } from "@/types";

const PageContainer = styled("div", {
  padding: "$lg",
  maxWidth: "1400px",
  margin: "0 auto",
});

const HeaderSection = styled("div", {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "$xl",
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

const FiltersCard = styled("div", {
  display: "grid",
  gridTemplateColumns: "repeat(5, minmax(0, 1fr))",
  gap: "$md",
  padding: "$lg",
  marginBottom: "$xl",
  backgroundColor: "$bgSecondary",
  border: "1px solid $borderPrimary",
  borderRadius: "$lg",

  "@lg": {
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
  },

  "@xs": {
    gridTemplateColumns: "1fr",
  },
});

const Field = styled("div", {
  display: "flex",
  flexDirection: "column",
  gap: "$sm",
});

const Label = styled("label", {
  fontSize: "$xs",
  fontWeight: "$semibold",
  color: "$textSecondary",
  textTransform: "uppercase",
  letterSpacing: "0.05em",
});

const Input = styled("input", {
  width: "100%",
  padding: "$md",
  backgroundColor: "$bgPrimary",
  border: "1px solid $borderPrimary",
  borderRadius: "$md",
  color: "$textPrimary",
  fontSize: "$sm",
});

const Select = styled("select", {
  width: "100%",
  padding: "$md",
  backgroundColor: "$bgPrimary",
  border: "1px solid $borderPrimary",
  borderRadius: "$md",
  color: "$textPrimary",
  fontSize: "$sm",
});

const FilterActions = styled("div", {
  display: "flex",
  alignItems: "flex-end",
  gap: "$sm",
});

interface MachineFilters {
  search: string;
  status: string;
  ip: string;
  deviceType: string;
  storageType: string;
  room: string;
}

const initialFilters: MachineFilters = {
  search: "",
  status: "",
  ip: "",
  deviceType: "",
  storageType: "",
  room: "",
};

export function MachinesPage() {
  const navigate = useNavigate();
  const [machines, setMachines] = useState<Machine[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<MachineFilters>(initialFilters);

  useEffect(() => {
    loadMachines();
  }, []);

  const loadMachines = async (nextFilters: MachineFilters = filters) => {
    try {
      setLoading(true);
      const params = Object.fromEntries(
        Object.entries(nextFilters).filter(([, value]) => value),
      );
      const data = await apiClient.getMachines(params);
      setMachines(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Erro ao carregar máquinas:", error);
      toast.error("Erro ao carregar máquinas");
      setMachines([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (machineId: string) => {
    if (!window.confirm("Tem certeza que deseja deletar esta máquina?")) {
      return;
    }

    try {
      await apiClient.deleteMachine(machineId);
      toast.success("Máquina deletada com sucesso");
      loadMachines();
    } catch (error: any) {
      console.error("Erro ao deletar máquina:", error);
      toast.error(error.response?.data?.message || "Erro ao deletar máquina");
    }
  };

  const applyFilters = () => {
    loadMachines(filters);
  };

  const clearFilters = () => {
    setFilters(initialFilters);
    loadMachines(initialFilters);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <PageContainer>
        <HeaderSection>
          <Title>Máquinas</Title>
          <ConditionalRender requiredLevel={30}>
            <Button onClick={() => navigate("/logistics/machines/new")}>+ Nova Máquina</Button>
          </ConditionalRender>
        </HeaderSection>

        <FiltersCard>
          <Field>
            <Label>Busca</Label>
            <Input
              value={filters.search}
              onChange={(event) => setFilters((prev) => ({ ...prev, search: event.target.value }))}
              placeholder="Etiqueta, IP, usuário, CPU, sala"
            />
          </Field>
          <Field>
            <Label>Status</Label>
            <Select
              value={filters.status}
              onChange={(event) => setFilters((prev) => ({ ...prev, status: event.target.value }))}
            >
              <option value="">Todos</option>
              <option value="available">Livre</option>
              <option value="in_use">Em uso</option>
              <option value="stopped">Parado</option>
              <option value="maintenance">Manutenção</option>
              <option value="retired">Baixado</option>
            </Select>
          </Field>
          <Field>
            <Label>IP</Label>
            <Input
              value={filters.ip}
              onChange={(event) => setFilters((prev) => ({ ...prev, ip: event.target.value }))}
              placeholder="Ex: 192.168.0"
            />
          </Field>
          <Field>
            <Label>Tipo</Label>
            <Input
              value={filters.deviceType}
              onChange={(event) => setFilters((prev) => ({ ...prev, deviceType: event.target.value }))}
              placeholder="Ex: desktop, notebook"
            />
          </Field>
          <Field>
            <Label>Armazenamento</Label>
            <Select
              value={filters.storageType}
              onChange={(event) => setFilters((prev) => ({ ...prev, storageType: event.target.value }))}
            >
              <option value="">Todos</option>
              <option value="SSD">SSD</option>
              <option value="HDD">HDD</option>
              <option value="NVME">NVME</option>
              <option value="EMMC">EMMC</option>
              <option value="HYBRID">HYBRID</option>
              <option value="OTHER">OTHER</option>
            </Select>
          </Field>
          <Field>
            <Label>Sala</Label>
            <Input
              value={filters.room}
              onChange={(event) => setFilters((prev) => ({ ...prev, room: event.target.value }))}
              placeholder="Ex: Sala 02"
            />
          </Field>
          <FilterActions>
            <Button variant="secondary" onClick={clearFilters}>Limpar</Button>
            <Button onClick={applyFilters}>Filtrar</Button>
          </FilterActions>
        </FiltersCard>

        <Table
          columns={[
            {
              key: "assetTag",
              label: "Etiqueta",
              width: "140px",
              render: (value: string) => <strong>{value}</strong>,
            },
            {
              key: "status",
              label: "Status",
              width: "120px",
              render: (value: string) => {
                const statusLabel: Record<string, string> = {
                  available: "Livre",
                  in_use: "Em uso",
                  stopped: "Parado",
                  maintenance: "Manutenção",
                  retired: "Baixado",
                };

                const statusColor: Record<string, string> = {
                  available: "#10b981",
                  in_use: "#f59e0b",
                  stopped: "#ef4444",
                  maintenance: "#38bdf8",
                  retired: "#94a3b8",
                };

                return (
                  <span style={{ color: statusColor[value] || "#cbd5e1", fontWeight: 600 }}>
                    {statusLabel[value] || value}
                  </span>
                );
              },
            },
            {
              key: "deviceType",
              label: "Tipo",
              width: "120px",
              render: (value: string) => value || "-",
            },
            {
              key: "ip",
              label: "IP",
              width: "140px",
              render: (value: string | undefined) => value || "-",
            },
            {
              key: "assignee",
              label: "Utilizador",
              render: (value: string | undefined) => value || "-",
            },
            {
              key: "cpu",
              label: "Hardware",
              render: (_value: string | undefined, row: Machine) => {
                const ram = row.ramGb ? `${row.ramGb}GB RAM` : null;
                const storage = row.storageType || row.storageGb
                  ? `${row.storageGb || "?"}GB ${row.storageType || "Storage"}`
                  : null;
                return [row.cpu, ram, storage].filter(Boolean).join(" | ") || "-";
              },
            },
            {
              key: "room",
              label: "Sala",
              width: "120px",
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
                      navigate(`/logistics/machines/${id}`);
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
                        navigate(`/logistics/machines/${id}/edit`);
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
          data={machines}
          rowKey="id"
          loading={loading}
          onRowClick={(row) => navigate(`/logistics/machines/${row.id}`)}
          empty="Nenhuma máquina cadastrada"
        />
      </PageContainer>
    </motion.div>
  );
}
