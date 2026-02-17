import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { styled } from "@/assets/styles/themes/stitches.config";
import apiClient from "@/services/api/client";

const userSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  email: z.string().email("Email inválido"),
  password: z.string().optional(),
  roleLevel: z.number().min(0, "Role é obrigatória"),
  departmentId: z.number().min(1, "Departamento é obrigatório"),
  teamId: z.number().optional(),
});

type UserFormData = z.infer<typeof userSchema>;

const PageContainer = styled("div", {
  padding: "$lg",
  maxWidth: "900px",
  margin: "0 auto",
});

const Header = styled("div", {
  display: "flex",
  alignItems: "center",
  gap: "$lg",
  marginBottom: "$2xl",
});

const BackButton = styled("button", {
  backgroundColor: "transparent",
  border: "none",
  color: "$textPrimary",
  cursor: "pointer",
  fontSize: "1.5rem",
  padding: "$sm",
  borderRadius: "$md",
  transition: "all $normal",

  "&:hover": {
    backgroundColor: "$bgTertiary",
    color: "$primaryColor",
  },
});

const Title = styled("h1", {
  fontSize: "2rem",
  fontWeight: 700,
  color: "$textPrimary",
  margin: 0,
});

const FormSection = styled(motion.div, {
  backgroundColor: "$bgSecondary",
  border: "1px solid $borderPrimary",
  borderRadius: "$lg",
  padding: "$xl",
  marginBottom: "$xl",
});

const FormGroup = styled("div", {
  marginBottom: "$lg",

  "&:last-of-type": {
    marginBottom: 0,
  },
});

const Label = styled("label", {
  display: "block",
  fontSize: "$sm",
  fontWeight: "$semibold",
  color: "$textPrimary",
  marginBottom: "$md",
});

const Input = styled("input", {
  width: "100%",
  padding: "$md",
  backgroundColor: "$bgPrimary",
  border: "1px solid $borderPrimary",
  borderRadius: "$md",
  color: "$textPrimary",
  fontSize: "$sm",
  transition: "all $normal",

  "&:focus": {
    outline: "none",
    borderColor: "$primaryColor",
    boxShadow: "0 0 0 3px rgba(14, 165, 233, 0.1)",
  },

  "&::placeholder": {
    color: "$textMuted",
  },
});

const Select = styled("select", {
  width: "100%",
  padding: "$md",
  backgroundColor: "$bgPrimary",
  border: "1px solid $borderPrimary",
  borderRadius: "$md",
  color: "$textPrimary",
  fontSize: "$sm",
  transition: "all $normal",

  "&:focus": {
    outline: "none",
    borderColor: "$primaryColor",
    boxShadow: "0 0 0 3px rgba(14, 165, 233, 0.1)",
  },

  "& option": {
    backgroundColor: "$bgPrimary",
    color: "$textPrimary",
  },
});

const ErrorMessage = styled("span", {
  fontSize: "$xs",
  color: "$errorColor",
  marginTop: "$xs",
  display: "block",
});

const ButtonGroup = styled("div", {
  display: "flex",
  gap: "$md",
  marginTop: "$2xl",
  justifyContent: "flex-end",

  "@xs": {
    flexDirection: "column",
  },
});

const Button = styled("button", {
  padding: "$md $lg",
  borderRadius: "$md",
  fontSize: "$sm",
  fontWeight: "$semibold",
  border: "none",
  cursor: "pointer",
  transition: "all $normal",

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
    },
  },

  defaultVariants: {
    variant: "primary",
  },
});

const Row = styled("div", {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "$lg",

  "@xs": {
    gridTemplateColumns: "1fr",
  },
});

interface Department {
  id: number;
  name: string;
}

interface Team {
  id: number;
  name: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  roleLevel: number;
  department?: { id: number; name: string };
  team?: { id: number; name: string };
}

interface UserFormProps {
  isEditing?: boolean;
}

export const UserForm: React.FC<UserFormProps> = ({ isEditing = false }) => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    reset,
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: isEditing
      ? undefined
      : {
          roleLevel: 10,
        },
  });

  const selectedDeptId = watch("departmentId");

  useEffect(() => {
    loadDepartmentsAndTeams();
    if (isEditing && id) {
      loadUser();
    }
  }, [id, isEditing]);

  useEffect(() => {
    if (selectedDeptId) {
      filterTeamsByDepartment(selectedDeptId);
    }
  }, [selectedDeptId]);

  const loadDepartmentsAndTeams = async () => {
    try {
      const depts = await apiClient.request("get", "/departments");
      setDepartments(depts as Department[]);

      const teamsData = await apiClient.request("get", "/teams");
      setTeams(teamsData as Team[]);
    } catch (error) {
      console.error("Erro ao carregar departamentos e times:", error);
      toast.error("Erro ao carregar dados");
    }
  };

  const loadUser = async () => {
    try {
      const user = await apiClient.request<User>("get", `/users/${id}`);
      
      // Filter teams by department if user has a department
      if (user.department?.id) {
        await filterTeamsByDepartment(user.department.id);
      }
      
      // Reset form with user data
      reset({
        name: user.name,
        email: user.email,
        roleLevel: user.roleLevel,
        departmentId: user.department?.id,
        teamId: user.team?.id,
      });
    } catch (error) {
      console.error("Erro ao carregar usuário:", error);
      toast.error("Erro ao carregar usuário");
      navigate("/admin/users");
    }
  };

  const filterTeamsByDepartment = async (deptId: number) => {
    try {
      const filteredTeams = await apiClient.request(
        "get",
        `/teams/department/${deptId}`
      );
      setTeams(filteredTeams as Team[]);
    } catch (error) {
      console.error("Erro ao filtrar times:", error);
      // If error, load all teams
      const allTeams = await apiClient.request("get", "/teams");
      setTeams(allTeams as Team[]);
    }
  };

  const onSubmit = async (data: UserFormData) => {
    try {
      const payload = {
        ...data,
        departmentId: Number(data.departmentId),
        teamId: data.teamId ? Number(data.teamId) : undefined,
      };

      if (isEditing && id) {
        await apiClient.request("put", `/users/${id}`, payload);
        toast.success("Usuário atualizado com sucesso");
      } else {
        if (!data.password) {
          toast.error("Senha é obrigatória para novo usuário");
          return;
        }
        await apiClient.request("post", "/users", payload);
        toast.success("Usuário criado com sucesso");
      }

      navigate("/admin/users");
    } catch (error) {
      console.error("Erro ao salvar:", error);
      toast.error("Erro ao salvar usuário");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <PageContainer>
        <Header>
          <BackButton onClick={() => navigate("/admin/users")}>
            ←
          </BackButton>
          <Title>{isEditing ? "Editar Usuário" : "Novo Usuário"}</Title>
        </Header>

        <FormSection
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <form onSubmit={handleSubmit(onSubmit)}>
            <Row>
              <FormGroup>
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  {...register("name")}
                  placeholder="Nome completo"
                />
                {errors.name && (
                  <ErrorMessage>{errors.name.message}</ErrorMessage>
                )}
              </FormGroup>

              <FormGroup>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  {...register("email")}
                  placeholder="email@example.com"
                  type="email"
                />
                {errors.email && (
                  <ErrorMessage>{errors.email.message}</ErrorMessage>
                )}
              </FormGroup>
            </Row>

            {!isEditing && (
              <FormGroup>
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  {...register("password")}
                  placeholder="Senha do usuário"
                  type="password"
                />
                {errors.password && (
                  <ErrorMessage>{errors.password.message}</ErrorMessage>
                )}
              </FormGroup>
            )}

            <Row>
              <FormGroup>
                <Label htmlFor="roleLevel">Role</Label>
                <Select id="roleLevel" {...register("roleLevel", { valueAsNumber: true })}>
                  <option value={10}>Auxiliar</option>
                  <option value={20}>Assistente</option>
                  <option value={30}>Analista</option>
                  <option value={40}>Coordenador</option>
                  <option value={50}>Gerente</option>
                  <option value={99}>Admin</option>
                </Select>
                {errors.roleLevel && (
                  <ErrorMessage>{errors.roleLevel.message}</ErrorMessage>
                )}
              </FormGroup>

              <FormGroup>
                <Label htmlFor="departmentId">Departamento</Label>
                <Select
                  id="departmentId"
                  {...register("departmentId", { valueAsNumber: true })}
                >
                  <option value="">Selecione um departamento</option>
                  {departments.map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.name}
                    </option>
                  ))}
                </Select>
                {errors.departmentId && (
                  <ErrorMessage>{errors.departmentId.message}</ErrorMessage>
                )}
              </FormGroup>
            </Row>

            <FormGroup>
              <Label htmlFor="teamId">Time</Label>
              <Select id="teamId" {...register("teamId", { valueAsNumber: true })}>
                <option value="">Selecione um time</option>
                {teams.map((team) => (
                  <option key={team.id} value={team.id}>
                    {team.name}
                  </option>
                ))}
              </Select>
            </FormGroup>

            <ButtonGroup>
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate("/admin/users")}
              >
                Cancelar
              </Button>
              <Button type="submit" variant="primary" disabled={isSubmitting}>
                {isSubmitting ? "Salvando..." : "Salvar"}
              </Button>
            </ButtonGroup>
          </form>
        </FormSection>
      </PageContainer>
    </motion.div>
  );
};
