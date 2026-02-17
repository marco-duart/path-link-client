import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { styled } from "@/assets/styles/themes/stitches.config";
import toast from "react-hot-toast";
import apiClient from "@/services/api/client";
import {
  FiLink,
  FiKey,
  FiSettings,
  FiChevronDown,
  FiChevronUp,
  FiCheck,
} from "react-icons/fi";

const SectionContainer = styled("div", {
  display: "flex",
  flexDirection: "column",
  gap: "$lg",
});

const SectionTitle = styled("h3", {
  fontSize: "$base",
  fontWeight: "$semibold",
  color: "$textPrimary",
  margin: 0,
  display: "flex",
  alignItems: "center",
  gap: "$sm",

  "& svg": {
    color: "$primaryColor",
  },
});

const TabsContainer = styled("div", {
  display: "flex",
  gap: "$sm",
  borderBottom: "1px solid $borderPrimary",
  overflowX: "auto",
});

const Tab = styled("button", {
  padding: "$md $lg",
  backgroundColor: "transparent",
  border: "none",
  borderBottom: "2px solid transparent",
  color: "$textSecondary",
  cursor: "pointer",
  fontSize: "$sm",
  fontWeight: "$semibold",
  transition: "all $normal",
  display: "flex",
  alignItems: "center",
  gap: "$sm",
  whiteSpace: "nowrap",

  "&:hover": {
    color: "$textPrimary",
  },

  variants: {
    active: {
      true: {
        color: "$primaryColor",
        borderBottomColor: "$primaryColor",
      },
    },
  },
});

const ContentContainer = styled("div", {
  display: "flex",
  flexDirection: "column",
  gap: "$md",
});

const SearchInput = styled("input", {
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
    boxShadow: "0 0 0 3px rgba(99, 102, 241, 0.1)",
  },

  "&::placeholder": {
    color: "$textSecondary",
  },
});

const ResourcesList = styled("div", {
  display: "flex",
  flexDirection: "column",
  gap: "$sm",
  maxHeight: "300px",
  overflowY: "auto",
});

const ResourceItem = styled("label", {
  display: "flex",
  alignItems: "center",
  gap: "$md",
  padding: "$md",
  backgroundColor: "$bgPrimary",
  border: "1px solid $borderPrimary",
  borderRadius: "$md",
  cursor: "pointer",
  transition: "all $normal",

  "&:hover": {
    backgroundColor: "$bgSecondary",
    borderColor: "$primaryColor",
  },

  variants: {
    selected: {
      true: {
        backgroundColor: "rgba(99, 102, 241, 0.1)",
        borderColor: "$primaryColor",
      },
    },
  },
});

const Checkbox = styled("input", {
  width: "18px",
  height: "18px",
  cursor: "pointer",
  accentColor: "$primaryColor",
  flexShrink: 0,
});

const ResourceInfo = styled("div", {
  flex: 1,
  minWidth: 0,
});

const ResourceName = styled("p", {
  fontSize: "$sm",
  fontWeight: "$semibold",
  color: "$textPrimary",
  margin: 0,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
});

const ResourceDescription = styled("p", {
  fontSize: "$xs",
  color: "$textSecondary",
  margin: 0,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
});

const SelectedItemsContainer = styled("div", {
  display: "flex",
  flexWrap: "wrap",
  gap: "$sm",
  padding: "$md",
  backgroundColor: "$bgPrimary",
  borderRadius: "$md",
  border: "1px solid $borderPrimary",
  minHeight: "40px",
});

const SelectedItem = styled(motion.div, {
  display: "flex",
  alignItems: "center",
  gap: "$sm",
  padding: "$sm $md",
  backgroundColor: "$bgSecondary",
  borderRadius: "$md",
  border: "1px solid $borderPrimary",
  fontSize: "$xs",
  color: "$textPrimary",

  "& button": {
    background: "none",
    border: "none",
    color: "$textSecondary",
    cursor: "pointer",
    padding: 0,
    marginLeft: "$xs",
    transition: "color $normal",

    "&:hover": {
      color: "#ef4444",
    },
  },
});

const EmptyState = styled("div", {
  padding: "$xl",
  textAlign: "center",
  color: "$textSecondary",
  fontSize: "$sm",
});

const NoResults = styled("div", {
  padding: "$md",
  textAlign: "center",
  color: "$textSecondary",
  fontSize: "$sm",
});

const ToggleButton = styled("button", {
  padding: "$md",
  backgroundColor: "$bgPrimary",
  border: "1px solid $borderPrimary",
  borderRadius: "$md",
  color: "$textPrimary",
  cursor: "pointer",
  fontSize: "$sm",
  fontWeight: "$semibold",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  transition: "all $normal",

  "&:hover": {
    backgroundColor: "$bgSecondary",
    borderColor: "$primaryColor",
  },
});

interface Resource {
  id: string;
  name: string;
  description?: string;
}

export interface SelectedResource {
  id: string;
  name: string;
  type:
    | "Link"
    | "EnvironmentVariable"
    | "ConfigurationItem"
    | "Account"
    | "Database"
    | "Repository";
}

interface ResourcesSelectorProps {
  onResourcesSelected: (resources: SelectedResource[]) => void;
  selectedResources?: SelectedResource[];
}

export function ResourcesSelector({
  onResourcesSelected,
  selectedResources = [],
}: ResourcesSelectorProps) {
  const [activeTab, setActiveTab] = useState<
    "links" | "envvars" | "config" | "accounts" | "databases" | "repositories"
  >("links");
  const [isExpanded, setIsExpanded] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const [links, setLinks] = useState<Resource[]>([]);
  const [envVars, setEnvVars] = useState<Resource[]>([]);
  const [configItems, setConfigItems] = useState<Resource[]>([]);
  const [accounts, setAccounts] = useState<Resource[]>([]);
  const [databases, setDatabases] = useState<Resource[]>([]);
  const [repositories, setRepositories] = useState<Resource[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const selectedIds = new Set(selectedResources.map((r) => r.id));

  useEffect(() => {
    loadResources();
  }, []);

  const loadResources = async () => {
    try {
      setIsLoading(true);
      const [
        linksData,
        envVarsData,
        configItemsData,
        accountsData,
        databasesData,
        repositoriesData,
      ] = await Promise.all([
        apiClient.getLinks(),
        apiClient.getEnvironmentVariables(),
        apiClient.getConfigurationItems(),
        apiClient.getAccounts(),
        apiClient.getDatabases(),
        apiClient.getRepositories(),
      ]);

      setLinks(
        Array.isArray(linksData)
          ? linksData.map((l: any) => ({
              id: l.id,
              name: l.name || l.title,
              description: l.description || l.url,
            }))
          : [],
      );

      setEnvVars(
        Array.isArray(envVarsData)
          ? envVarsData.map((e: any) => ({
              id: e.id,
              name: e.name || e.key,
              description: e.value?.substring(0, 50),
            }))
          : [],
      );

      setConfigItems(
        Array.isArray(configItemsData)
          ? configItemsData.map((c: any) => ({
              id: c.id,
              name: c.name,
              description: c.description?.substring(0, 50),
            }))
          : [],
      );

      setAccounts(
        Array.isArray(accountsData)
          ? accountsData.map((a: any) => ({
              id: a.id,
              name: a.name,
              description: a.email || a.description?.substring(0, 50),
            }))
          : [],
      );

      setDatabases(
        Array.isArray(databasesData)
          ? databasesData.map((d: any) => ({
              id: d.id,
              name: d.name,
              description: d.description?.substring(0, 50),
            }))
          : [],
      );

      setRepositories(
        Array.isArray(repositoriesData)
          ? repositoriesData.map((r: any) => ({
              id: r.id,
              name: r.name,
              description: r.description?.substring(0, 50),
            }))
          : [],
      );
    } catch (error) {
      console.error("Erro ao carregar recursos:", error);
      toast.error("Erro ao carregar recursos");
    } finally {
      setIsLoading(false);
    }
  };

  const filterResources = (items: Resource[]) => {
    return items.filter(
      (item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ??
          false),
    );
  };

  const handleToggleResource = (
    id: string,
    type:
      | "Link"
      | "EnvironmentVariable"
      | "ConfigurationItem"
      | "Account"
      | "Database"
      | "Repository",
    name: string,
  ) => {
    const newSelected = selectedResources.filter(
      (r) => !(r.id === id && r.type === type),
    );

    if (!selectedIds.has(id)) {
      newSelected.push({ id, type, name });
    }

    onResourcesSelected(newSelected);
  };

  const handleRemoveSelected = (id: string) => {
    const newSelected = selectedResources.filter((r) => r.id !== id);
    onResourcesSelected(newSelected);
  };

  const filteredLinks = filterResources(links);
  const filteredEnvVars = filterResources(envVars);
  const filteredConfigItems = filterResources(configItems);
  const filteredAccounts = filterResources(accounts);
  const filteredDatabases = filterResources(databases);
  const filteredRepositories = filterResources(repositories);

  return (
    <SectionContainer>
      <SectionTitle>
        <FiLink size={18} />
        Recursos Relacionados
      </SectionTitle>

      <ToggleButton onClick={() => setIsExpanded(!isExpanded)}>
        <span>
          {selectedResources.length > 0
            ? `${selectedResources.length} recurso(s) selecionado(s)`
            : "Selecionar recursos"}
        </span>
        {isExpanded ? <FiChevronUp size={18} /> : <FiChevronDown size={18} />}
      </ToggleButton>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <ContentContainer>
              <SearchInput
                type="text"
                placeholder="Buscar recursos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />

              <TabsContainer>
                <Tab
                  type="button"
                  active={activeTab === "links"}
                  onClick={() => setActiveTab("links")}
                >
                  <FiLink size={16} />
                  Links ({links.length})
                </Tab>
                <Tab
                  type="button"
                  active={activeTab === "envvars"}
                  onClick={() => setActiveTab("envvars")}
                >
                  <FiKey size={16} />
                  Variáveis ({envVars.length})
                </Tab>
                <Tab
                  type="button"
                  active={activeTab === "config"}
                  onClick={() => setActiveTab("config")}
                >
                  <FiSettings size={16} />
                  Config ({configItems.length})
                </Tab>
                <Tab
                  type="button"
                  active={activeTab === "accounts"}
                  onClick={() => setActiveTab("accounts")}
                >
                  👤 Contas ({accounts.length})
                </Tab>
                <Tab
                  type="button"
                  active={activeTab === "databases"}
                  onClick={() => setActiveTab("databases")}
                >
                  🗄️ BDs ({databases.length})
                </Tab>
                <Tab
                  type="button"
                  active={activeTab === "repositories"}
                  onClick={() => setActiveTab("repositories")}
                >
                  📦 Repos ({repositories.length})
                </Tab>
              </TabsContainer>

              {isLoading ? (
                <EmptyState>Carregando recursos...</EmptyState>
              ) : (
                <>
                  {activeTab === "links" && (
                    <ResourcesList>
                      {filteredLinks.length > 0 ? (
                        filteredLinks.map((link) => (
                          <ResourceItem
                            key={link.id}
                            selected={selectedIds.has(link.id)}
                          >
                            <Checkbox
                              type="checkbox"
                              checked={selectedIds.has(link.id)}
                              onChange={() =>
                                handleToggleResource(link.id, "Link", link.name)
                              }
                            />
                            <ResourceInfo>
                              <ResourceName>{link.name}</ResourceName>
                              {link.description && (
                                <ResourceDescription>
                                  {link.description}
                                </ResourceDescription>
                              )}
                            </ResourceInfo>
                            {selectedIds.has(link.id) && (
                              <FiCheck
                                size={18}
                                color="var(--colors-primaryColor)"
                              />
                            )}
                          </ResourceItem>
                        ))
                      ) : (
                        <NoResults>
                          {searchQuery
                            ? "Nenhum link encontrado"
                            : "Nenhum link disponível"}
                        </NoResults>
                      )}
                    </ResourcesList>
                  )}

                  {activeTab === "envvars" && (
                    <ResourcesList>
                      {filteredEnvVars.length > 0 ? (
                        filteredEnvVars.map((envVar) => (
                          <ResourceItem
                            key={envVar.id}
                            selected={selectedIds.has(envVar.id)}
                          >
                            <Checkbox
                              type="checkbox"
                              checked={selectedIds.has(envVar.id)}
                              onChange={() =>
                                handleToggleResource(
                                  envVar.id,
                                  "EnvironmentVariable",
                                  envVar.name,
                                )
                              }
                            />
                            <ResourceInfo>
                              <ResourceName>{envVar.name}</ResourceName>
                              {envVar.description && (
                                <ResourceDescription>
                                  {envVar.description}
                                </ResourceDescription>
                              )}
                            </ResourceInfo>
                            {selectedIds.has(envVar.id) && (
                              <FiCheck
                                size={18}
                                color="var(--colors-primaryColor)"
                              />
                            )}
                          </ResourceItem>
                        ))
                      ) : (
                        <NoResults>
                          {searchQuery
                            ? "Nenhuma variável encontrada"
                            : "Nenhuma variável disponível"}
                        </NoResults>
                      )}
                    </ResourcesList>
                  )}

                  {activeTab === "config" && (
                    <ResourcesList>
                      {filteredConfigItems.length > 0 ? (
                        filteredConfigItems.map((configItem) => (
                          <ResourceItem
                            key={configItem.id}
                            selected={selectedIds.has(configItem.id)}
                          >
                            <Checkbox
                              type="checkbox"
                              checked={selectedIds.has(configItem.id)}
                              onChange={() =>
                                handleToggleResource(
                                  configItem.id,
                                  "ConfigurationItem",
                                  configItem.name,
                                )
                              }
                            />
                            <ResourceInfo>
                              <ResourceName>{configItem.name}</ResourceName>
                              {configItem.description && (
                                <ResourceDescription>
                                  {configItem.description}
                                </ResourceDescription>
                              )}
                            </ResourceInfo>
                            {selectedIds.has(configItem.id) && (
                              <FiCheck
                                size={18}
                                color="var(--colors-primaryColor)"
                              />
                            )}
                          </ResourceItem>
                        ))
                      ) : (
                        <NoResults>
                          {searchQuery
                            ? "Nenhum config item encontrado"
                            : "Nenhum config item disponível"}
                        </NoResults>
                      )}
                    </ResourcesList>
                  )}

                  {activeTab === "accounts" && (
                    <ResourcesList>
                      {filteredAccounts.length > 0 ? (
                        filteredAccounts.map((account) => (
                          <ResourceItem
                            key={account.id}
                            selected={selectedIds.has(account.id)}
                          >
                            <Checkbox
                              type="checkbox"
                              checked={selectedIds.has(account.id)}
                              onChange={() =>
                                handleToggleResource(
                                  account.id,
                                  "Account",
                                  account.name,
                                )
                              }
                            />
                            <ResourceInfo>
                              <ResourceName>{account.name}</ResourceName>
                              {account.description && (
                                <ResourceDescription>
                                  {account.description}
                                </ResourceDescription>
                              )}
                            </ResourceInfo>
                            {selectedIds.has(account.id) && (
                              <FiCheck
                                size={18}
                                color="var(--colors-primaryColor)"
                              />
                            )}
                          </ResourceItem>
                        ))
                      ) : (
                        <NoResults>
                          {searchQuery
                            ? "Nenhuma conta encontrada"
                            : "Nenhuma conta disponível"}
                        </NoResults>
                      )}
                    </ResourcesList>
                  )}

                  {activeTab === "databases" && (
                    <ResourcesList>
                      {filteredDatabases.length > 0 ? (
                        filteredDatabases.map((database) => (
                          <ResourceItem
                            key={database.id}
                            selected={selectedIds.has(database.id)}
                          >
                            <Checkbox
                              type="checkbox"
                              checked={selectedIds.has(database.id)}
                              onChange={() =>
                                handleToggleResource(
                                  database.id,
                                  "Database",
                                  database.name,
                                )
                              }
                            />
                            <ResourceInfo>
                              <ResourceName>{database.name}</ResourceName>
                              {database.description && (
                                <ResourceDescription>
                                  {database.description}
                                </ResourceDescription>
                              )}
                            </ResourceInfo>
                            {selectedIds.has(database.id) && (
                              <FiCheck
                                size={18}
                                color="var(--colors-primaryColor)"
                              />
                            )}
                          </ResourceItem>
                        ))
                      ) : (
                        <NoResults>
                          {searchQuery
                            ? "Nenhum banco de dados encontrado"
                            : "Nenhum banco de dados disponível"}
                        </NoResults>
                      )}
                    </ResourcesList>
                  )}

                  {activeTab === "repositories" && (
                    <ResourcesList>
                      {filteredRepositories.length > 0 ? (
                        filteredRepositories.map((repository) => (
                          <ResourceItem
                            key={repository.id}
                            selected={selectedIds.has(repository.id)}
                          >
                            <Checkbox
                              type="checkbox"
                              checked={selectedIds.has(repository.id)}
                              onChange={() =>
                                handleToggleResource(
                                  repository.id,
                                  "Repository",
                                  repository.name,
                                )
                              }
                            />
                            <ResourceInfo>
                              <ResourceName>{repository.name}</ResourceName>
                              {repository.description && (
                                <ResourceDescription>
                                  {repository.description}
                                </ResourceDescription>
                              )}
                            </ResourceInfo>
                            {selectedIds.has(repository.id) && (
                              <FiCheck
                                size={18}
                                color="var(--colors-primaryColor)"
                              />
                            )}
                          </ResourceItem>
                        ))
                      ) : (
                        <NoResults>
                          {searchQuery
                            ? "Nenhum repositório encontrado"
                            : "Nenhum repositório disponível"}
                        </NoResults>
                      )}
                    </ResourcesList>
                  )}
                </>
              )}
            </ContentContainer>
          </motion.div>
        )}
      </AnimatePresence>

      {selectedResources.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
        >
          <div>
            <p
              style={{
                fontSize: "0.875rem",
                color: "var(--colors-textSecondary)",
                marginBottom: "0.5rem",
              }}
            >
              Recursos selecionados:
            </p>
            <SelectedItemsContainer>
              {selectedResources.length === 0 ? (
                <p
                  style={{
                    color: "var(--colors-textSecondary)",
                    margin: 0,
                    fontSize: "0.875rem",
                  }}
                >
                  Nenhum recurso selecionado
                </p>
              ) : (
                selectedResources.map((resource) => (
                  <SelectedItem
                    key={`${resource.type}-${resource.id}`}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                  >
                    <span>{resource.name}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSelected(resource.id)}
                      title={`Remover ${resource.name}`}
                    >
                      ✕
                    </button>
                  </SelectedItem>
                ))
              )}
            </SelectedItemsContainer>
          </div>
        </motion.div>
      )}
    </SectionContainer>
  );
}
