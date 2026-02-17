import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  type SortingState,
  type ColumnFiltersState,
  type PaginationState,
} from "@tanstack/react-table";
import { createColumnHelper } from "@tanstack/react-table";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { styled } from "@/assets/styles/themes/stitches.config";
import { ConditionalRender } from "@/components/ConditionalRender";
import { usePermission } from "@/hooks/usePermission";
import apiClient from "@/services/api/client";
import type { Repository } from "@/types";
import {
  FiEye,
  FiEdit2,
  FiTrash2,
  FiChevronUp,
  FiChevronDown,
  FiChevronsLeft,
  FiChevronsRight,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";

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

const Button = styled("button", {
  padding: "$md $lg",
  borderRadius: "$md",
  fontSize: "$sm",
  fontWeight: "$semibold",
  border: "none",
  cursor: "pointer",
  transition: "all $normal",
  display: "flex",
  alignItems: "center",
  gap: "$sm",

  variants: {
    variant: {
      primary: {
        backgroundColor: "$primaryColor",
        color: "$bgPrimary",

        "&:hover": {
          backgroundColor: "$borderAccent",
          transform: "translateY(-2px)",
        },
      },
      secondary: {
        backgroundColor: "$bgTertiary",
        color: "$textPrimary",
        border: "1px solid $borderPrimary",

        "&:hover": {
          backgroundColor: "$borderPrimary",
        },
      },
      danger: {
        backgroundColor: "#ef4444",
        color: "$bgPrimary",

        "&:hover": {
          backgroundColor: "#dc2626",
        },
      },
      ghost: {
        backgroundColor: "transparent",
        color: "$textSecondary",
        border: "none",

        "&:hover": {
          color: "$primaryColor",
        },
      },
    },
  },
});

const TableContainer = styled(motion.div, {
  backgroundColor: "$bgSecondary",
  border: "1px solid $borderPrimary",
  borderRadius: "$lg",
  overflow: "hidden",
});

const StyledTable = styled("table", {
  width: "100%",
  borderCollapse: "collapse",

  "& thead": {
    backgroundColor: "$bgPrimary",
    borderBottom: "2px solid $borderPrimary",
  },

  "& th": {
    padding: "$md $lg",
    textAlign: "left",
    fontSize: "$sm",
    fontWeight: "$semibold",
    color: "$textSecondary",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },

  "& tbody tr": {
    borderBottom: "1px solid $borderPrimary",
    transition: "all $normal",

    "&:hover": {
      backgroundColor: "$bgPrimary",
    },
  },

  "& td": {
    padding: "$md $lg",
    fontSize: "$sm",
    color: "$textPrimary",
  },
});

const ActionCell = styled("div", {
  display: "flex",
  gap: "$sm",
  alignItems: "center",
});

const SortIcon = styled("span", {
  display: "inline-flex",
  alignItems: "center",
  gap: "$xs",
  cursor: "pointer",
  userSelect: "none",
});

const PaginationContainer = styled("div", {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "$lg",
  borderTop: "1px solid $borderPrimary",
  gap: "$md",

  "@xs": {
    flexDirection: "column",
    justifyContent: "center",
  },
});

const PaginationButtons = styled("div", {
  display: "flex",
  gap: "$xs",
  alignItems: "center",
});

const EmptyState = styled("div", {
  padding: "$4xl $lg",
  textAlign: "center",
  color: "$textMuted",
});

export function RepositoriesPage() {
  const navigate = useNavigate();
  const { canAccess } = usePermission();
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(true);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  useEffect(() => {
    loadRepositories();
  }, []);

  const loadRepositories = async () => {
    try {
      setLoading(true);
      const data = await apiClient.getRepositories();
      setRepositories(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Erro ao carregar repositórios:", error);
      toast.error("Erro ao carregar repositórios");
      setRepositories([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (repositoryId: string) => {
    if (!window.confirm("Tem certeza que deseja deletar este repositório?")) {
      return;
    }

    try {
      await apiClient.deleteRepository(repositoryId);
      toast.success("Repositório deletado com sucesso");
      loadRepositories();
    } catch (error: any) {
      console.error("Erro ao deletar:", error);
      toast.error(
        error.response?.data?.message || "Erro ao deletar repositório",
      );
    }
  };

  const columnHelper = createColumnHelper<Repository>();

  const columns = useMemo(
    () => [
      columnHelper.accessor("name", {
        header: "Nome",
        size: 220,
        cell: (info) => <strong>{info.getValue()}</strong>,
      }),
      columnHelper.accessor("techStack", {
        header: "Stack",
        size: 200,
        cell: (info) => (
          <span style={{ color: "#8b5cf6", fontWeight: 500 }}>
            {info.getValue()}
          </span>
        ),
      }),
      columnHelper.accessor("url", {
        header: "URL",
        size: 220,
        cell: (info) => (
          <a
            href={info.getValue()}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#0ea5e9", textDecoration: "none" }}
          >
            Abrir
          </a>
        ),
      }),
      columnHelper.accessor("requiredLevel", {
        header: "Nível Requerido",
        size: 160,
        cell: (info) => {
          const level = info.getValue();
          const levelNames: Record<number, string> = {
            10: "Auxiliar",
            20: "Técnico",
            30: "Gestor",
            40: "Gerente",
            50: "Admin",
          };
          return <span>{levelNames[level] || `Nível ${level}`}</span>;
        },
      }),
      columnHelper.display({
        id: "actions",
        header: "Ações",
        size: 220,
        cell: (info) => {
          const repository = info.row.original;
          return (
            <ActionCell>
              <Button
                variant="secondary"
                onClick={() => navigate(`/repositories/${repository.id}`)}
                title="Visualizar"
              >
                <FiEye size={16} />
                Ver
              </Button>
              {canAccess(40) && (
                <Button
                  variant="secondary"
                  onClick={() =>
                    navigate(`/repositories/${repository.id}/edit`)
                  }
                  title="Editar"
                >
                  <FiEdit2 size={16} />
                </Button>
              )}
              {canAccess(50) && (
                <Button
                  variant="danger"
                  onClick={() => handleDelete(repository.id)}
                  title="Deletar"
                >
                  <FiTrash2 size={16} />
                </Button>
              )}
            </ActionCell>
          );
        },
      }),
    ],
    [navigate, canAccess],
  );

  const table = useReactTable({
    data: repositories,
    columns,
    state: {
      sorting,
      columnFilters,
      pagination,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <PageContainer>
        <HeaderSection>
          <Title>Repositórios</Title>
          <ConditionalRender requiredLevel={30}>
            <Button
              variant="primary"
              onClick={() => navigate("/repositories/new")}
            >
              + Novo Repositório
            </Button>
          </ConditionalRender>
        </HeaderSection>

        <TableContainer>
          {loading ? (
            <EmptyState>Carregando...</EmptyState>
          ) : repositories.length === 0 ? (
            <EmptyState>Nenhum repositório encontrado</EmptyState>
          ) : (
            <>
              <StyledTable>
                <thead>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <th
                          key={header.id}
                          style={{
                            width: header.getSize(),
                          }}
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {header.isPlaceholder ? null : (
                            <SortIcon>
                              {flexRender(
                                header.column.columnDef.header,
                                header.getContext(),
                              )}
                              {{
                                asc: <FiChevronUp size={14} />,
                                desc: <FiChevronDown size={14} />,
                              }[header.column.getIsSorted() as string] ?? null}
                            </SortIcon>
                          )}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody>
                  {table.getRowModel().rows.map((row) => (
                    <tr key={row.id}>
                      {row.getVisibleCells().map((cell) => (
                        <td
                          key={cell.id}
                          style={{
                            width: cell.column.getSize(),
                          }}
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </StyledTable>

              <PaginationContainer>
                <div>
                  Página {table.getState().pagination.pageIndex + 1} de{" "}
                  {table.getPageCount()} ({table.getRowModel().rows.length}{" "}
                  registros nesta página)
                </div>
                <PaginationButtons>
                  <Button
                    variant="ghost"
                    onClick={() => table.setPageIndex(0)}
                    disabled={!table.getCanPreviousPage()}
                  >
                    <FiChevronsLeft size={16} />
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                  >
                    <FiChevronLeft size={16} />
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                  >
                    <FiChevronRight size={16} />
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                    disabled={!table.getCanNextPage()}
                  >
                    <FiChevronsRight size={16} />
                  </Button>
                </PaginationButtons>
              </PaginationContainer>
            </>
          )}
        </TableContainer>
      </PageContainer>
    </motion.div>
  );
}
