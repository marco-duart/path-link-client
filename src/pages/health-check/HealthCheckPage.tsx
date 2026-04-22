import { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  FiActivity,
  FiAlertCircle,
  FiCheckCircle,
  FiClock,
  FiRefreshCw,
  FiServer,
  FiXCircle,
} from "react-icons/fi";
import { styled } from "@/assets/styles/themes/stitches.config";

type HealthStatus = "online" | "offline" | "unknown";

interface SystemEndpoint {
  name: string;
  url: string;
}

interface SystemHealthResult {
  name: string;
  url: string;
  status: HealthStatus;
  latencyMs?: number;
  checkedAt: string;
  httpStatus?: number;
  serviceStatus?: string;
  serviceTimestamp?: string;
  details?: string;
}

interface HealthResponsePayload {
  status?: string;
  timestamp?: string;
}

  const HEALTH_SYSTEMS: SystemEndpoint[] = [
    {
      name: "Checkin",
      url: "https://checkin.ibcsystem.com.br/api/v1/health",
    },
    {
      name: "IbCommerce",
      url: "https://api-ibccommerce.ibcsystem.com.br/api/v1/health",
    },
    {
      name: "Coliseum",
      url: "https://coliseumv2.ibcsystem.com.br/api/v1/health",
    },
    {
      name: "IbcSystem",
      url: "https://www.ibcsystem.com.br/api/v1/health",
    },
    {
      name: "IbcSystem Comercial",
      url: "https://comercial.ibcsystem.com.br/api/v1/health",
    },
    {
      name: "Payment Gateway",
      url: "https://api-pay-gateway.ibcsystem.com.br/api/v1/health",
    },
    {
      name: "Sales Track",
      url: "http://10.77.77.69:5173/api/v1/health",
    },
    {
      name: "Pedidos em Massa",
      url: "https://bulk-order.ibcsystem.com.br/health",
    },
    {
      name: "Vicidial",
      url: "http://vdweb.ibccoaching.com.br/vicidial/non_agent_api.php?source=healthcheck&user=ibcsystem&pass=Hxh8zXdW5vK4Q5Y4D9&function=version"
    }
  ];

  const REFRESH_INTERVAL_MS = 30_000;
  const REQUEST_TIMEOUT_MS = 8_000;

  const PageContainer = styled("div", {
    maxWidth: "1600px",
    margin: "0 auto",
    padding: "$lg",
  });

  const HeaderSection = styled("div", {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "$md",
    marginBottom: "$xl",

    "@xs": {
      flexDirection: "column",
      alignItems: "flex-start",
    },
  });

  const HeaderText = styled("div", {
    display: "flex",
    flexDirection: "column",
    gap: "$xs",
  });

  const Title = styled("h1", {
    margin: 0,
    display: "flex",
    alignItems: "center",
    gap: "$sm",
    fontSize: "2rem",
    color: "$textPrimary",
  });

  const Subtitle = styled("p", {
    margin: 0,
    color: "$textSecondary",
    fontSize: "$sm",
  });

  const HeaderActions = styled("div", {
    display: "flex",
    alignItems: "center",
    gap: "$sm",

    "@xs": {
      width: "100%",
      justifyContent: "space-between",
    },
  });

  const AutoRefreshPill = styled("div", {
    display: "inline-flex",
    alignItems: "center",
    gap: "$xs",
    padding: "$sm $md",
    borderRadius: "$full",
    border: "1px solid $borderPrimary",
    backgroundColor: "$bgSecondary",
    color: "$textSecondary",
    fontSize: "$sm",
    fontWeight: "$medium",
  });

  const RefreshButton = styled("button", {
    display: "inline-flex",
    alignItems: "center",
    gap: "$sm",
    padding: "$md $lg",
    borderRadius: "$md",
    border: "1px solid $borderPrimary",
    backgroundColor: "$bgSecondary",
    color: "$textPrimary",
    fontSize: "$sm",
    fontWeight: "$semibold",
    cursor: "pointer",
    transition: "all $normal",

    "&:hover": {
      borderColor: "$primaryColor",
      color: "$primaryColor",
    },

    "&:disabled": {
      opacity: 0.6,
      cursor: "not-allowed",
    },
  });

  const SummaryGrid = styled("div", {
    display: "grid",
    gridTemplateColumns: "repeat(6, minmax(0, 1fr))",
    gap: "$md",
    marginBottom: "$lg",

    "@lg": {
      gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    },

    "@xs": {
      gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    },
  });

  const SummaryCard = styled("div", {
    padding: "$md $lg",
    borderRadius: "$lg",
    border: "1px solid $borderPrimary",
    backgroundColor: "$bgSecondary",
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  });

  const SummaryLabel = styled("span", {
    color: "$textSecondary",
    fontSize: "$sm",
  });

  const SummaryValue = styled("strong", {
    color: "$textPrimary",
    fontSize: "$2xl",
  });

  const StatusGrid = styled("div", {
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: "$md",
    marginBottom: "$xl",

    "@lg": {
      gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    },

    "@xs": {
      gridTemplateColumns: "1fr",
    },
  });

  const StatusCard = styled(motion.div, {
    borderRadius: "$lg",
    padding: "$lg",
    border: "1px solid transparent",
    display: "grid",
    gridTemplateColumns: "auto 1fr auto",
    alignItems: "center",
    gap: "$md",
    minHeight: "96px",

    variants: {
      status: {
        online: {
          background:
            "linear-gradient(135deg, rgba(16, 185, 129, 0.18), rgba(5, 150, 105, 0.08))",
          borderColor: "rgba(16, 185, 129, 0.35)",
        },
        offline: {
          background:
            "linear-gradient(135deg, rgba(239, 68, 68, 0.18), rgba(153, 27, 27, 0.08))",
          borderColor: "rgba(239, 68, 68, 0.35)",
        },
        unknown: {
          background:
            "linear-gradient(135deg, rgba(245, 158, 11, 0.18), rgba(180, 83, 9, 0.08))",
          borderColor: "rgba(245, 158, 11, 0.35)",
        },
      },
    },
  });

  const StatusIconWrap = styled("div", {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "46px",
    height: "46px",
    borderRadius: "$full",
    backgroundColor: "rgba(255, 255, 255, 0.08)",
  });

  const StatusContent = styled("div", {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    minWidth: 0,
  });

  const StatusName = styled("strong", {
    color: "$textPrimary",
    fontSize: "$lg",
    lineHeight: 1.1,
  });

  const StatusMeta = styled("span", {
    color: "$textSecondary",
    fontSize: "$sm",
  });

  const DetailsPanel = styled("div", {
    backgroundColor: "$bgSecondary",
    border: "1px solid $borderPrimary",
    borderRadius: "$lg",
    overflow: "hidden",
  });

  const DetailsHeader = styled("div", {
    display: "grid",
    gridTemplateColumns: "1.3fr 120px 110px 1fr 1fr",
    gap: "$md",
    padding: "$md $lg",
    borderBottom: "1px solid $borderPrimary",
    backgroundColor: "$bgPrimary",
    color: "$textSecondary",
    fontSize: "$xs",
    fontWeight: "$semibold",
    letterSpacing: "0.08em",
    textTransform: "uppercase",

    "@md": {
      display: "none",
    },
  });

  const ResultsGrid = styled("div", {
    display: "flex",
    flexDirection: "column",
  });

  const SystemCard = styled(motion.div, {
    padding: "$md $lg",
    display: "flex",
    flexDirection: "column",
    gap: "$sm",
    borderBottom: "1px solid $borderPrimary",

    "&:last-child": {
      borderBottom: "none",
    },
  });

  const DetailsRow = styled("div", {
    display: "grid",
    gridTemplateColumns: "1.3fr 120px 110px 1fr 1fr",
    gap: "$md",
    alignItems: "center",

    "@md": {
      gridTemplateColumns: "1fr 1fr",
      alignItems: "flex-start",
    },

    "@xs": {
      gridTemplateColumns: "1fr",
    },
  });

  const SystemName = styled("h2", {
    margin: 0,
    fontSize: "$base",
    color: "$textPrimary",
  });

  const StatusBadge = styled("span", {
    display: "inline-flex",
    alignItems: "center",
    gap: "$xs",
    borderRadius: "$full",
    padding: "6px 10px",
    fontSize: "$xs",
    fontWeight: "$semibold",
    width: "fit-content",

    variants: {
      status: {
        online: {
          backgroundColor: "rgba(16, 185, 129, 0.16)",
          color: "#34d399",
        },
        offline: {
          backgroundColor: "rgba(239, 68, 68, 0.16)",
          color: "#f87171",
        },
        unknown: {
          backgroundColor: "rgba(245, 158, 11, 0.16)",
          color: "#fbbf24",
        },
      },
    },
  });

  const EndpointLink = styled("a", {
    color: "$textSecondary",
    fontSize: "$xs",
    wordBreak: "break-all",

    "&:hover": {
      color: "$primaryColor",
    },
  });

  const MetaLine = styled("div", {
    display: "flex",
    alignItems: "center",
    gap: "$xs",
    color: "$textSecondary",
    fontSize: "$sm",
  });

  const DetailCell = styled("div", {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    minWidth: 0,
  });

  const DetailLabel = styled("span", {
    display: "none",
    color: "$textMuted",
    fontSize: "$xs",
    textTransform: "uppercase",
    letterSpacing: "0.08em",

    "@md": {
      display: "block",
    },
  });

  const ErrorText = styled("p", {
    margin: 0,
    color: "#fda4af",
    fontSize: "$sm",
  });

  const EmptyState = styled("div", {
    padding: "$xl $lg",
    color: "$textSecondary",
  });

  function getStatusIcon(status: HealthStatus) {
    if (status === "online") {
      return <FiCheckCircle size={14} />;
    }

    if (status === "offline") {
      return <FiXCircle size={14} />;
    }

    return <FiAlertCircle size={14} />;
  }

  function getStatusLabel(status: HealthStatus) {
    if (status === "online") {
      return "Online";
    }

    if (status === "offline") {
      return "Offline";
    }

    return "Indefinido";
  }

  async function checkSystemHealth(
    system: SystemEndpoint,
  ): Promise<SystemHealthResult> {
    const startedAt = performance.now();
    const controller = new AbortController();
    const timeoutId = window.setTimeout(
      () => controller.abort(),
      REQUEST_TIMEOUT_MS,
    );

    try {
      const response = await fetch(system.url, {
        method: "GET",
        signal: controller.signal,
        cache: "no-store",
      });

      const latencyMs = Math.round(performance.now() - startedAt);
      let payload: HealthResponsePayload | null = null;

      try {
        payload = (await response.json()) as HealthResponsePayload;
      } catch {
        payload = null;
      }

      const normalizedStatus = payload?.status?.toLowerCase() ?? "";
      const hasPositiveStatusText =
        normalizedStatus.includes("funcion") || normalizedStatus.includes("ok");
      const isOnline = response.ok && (hasPositiveStatusText || !payload?.status);

      return {
        name: system.name,
        url: system.url,
        status: isOnline ? "online" : "offline",
        latencyMs,
        checkedAt: new Date().toISOString(),
        httpStatus: response.status,
        serviceStatus: payload?.status,
        serviceTimestamp: payload?.timestamp,
        details: isOnline ? undefined : payload?.status || `HTTP ${response.status}`,
      };
    } catch (error) {
      const latencyMs = Math.round(performance.now() - startedAt);

      let details = "Falha de rede ou bloqueio de CORS";

      if (error instanceof DOMException && error.name === "AbortError") {
        details = `Timeout de ${REQUEST_TIMEOUT_MS / 1000}s`;
      }

      return {
        name: system.name,
        url: system.url,
        status: "offline",
        latencyMs,
        checkedAt: new Date().toISOString(),
        details,
      };
    } finally {
      window.clearTimeout(timeoutId);
    }
  }

  export function HealthCheckPage() {
    const [results, setResults] = useState<SystemHealthResult[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [lastUpdatedAt, setLastUpdatedAt] = useState<string | null>(null);
    const [nextRefreshInMs, setNextRefreshInMs] = useState(REFRESH_INTERVAL_MS);

    const runHealthCheck = useCallback(async (showRefreshing = true) => {
      if (showRefreshing) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      try {
        const checks = await Promise.all(
          HEALTH_SYSTEMS.map((system) => checkSystemHealth(system)),
        );
        setResults(checks);
        setLastUpdatedAt(new Date().toISOString());
        setNextRefreshInMs(REFRESH_INTERVAL_MS);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    }, []);

    useEffect(() => {
      runHealthCheck(false);
    }, [runHealthCheck]);

    useEffect(() => {
      const timer = window.setInterval(() => {
        runHealthCheck(false);
      }, REFRESH_INTERVAL_MS);

      return () => window.clearInterval(timer);
    }, [runHealthCheck]);

    useEffect(() => {
      const timer = window.setInterval(() => {
        setNextRefreshInMs((current) =>
          current <= 1_000 ? REFRESH_INTERVAL_MS : current - 1_000,
        );
      }, 1_000);

      return () => window.clearInterval(timer);
    }, []);

    const summary = useMemo(() => {
      const total = results.length;
      const online = results.filter((item) => item.status === "online").length;
      const offline = results.filter((item) => item.status === "offline").length;
      const degraded = results.filter((item) => item.status === "unknown").length;

      return { total, online, offline, degraded };
    }, [results]);

    const renderedLastUpdated = lastUpdatedAt
      ? new Date(lastUpdatedAt).toLocaleString("pt-BR")
      : "-";
    const nextRefreshInSeconds = Math.max(1, Math.ceil(nextRefreshInMs / 1000));

    return (
      <PageContainer>
        <HeaderSection>
          <HeaderText>
            <Title>
              <FiActivity size={26} />
              Health Check de Sistemas
            </Title>
            <Subtitle>
              Painel contínuo para acompanhamento visual dos sistemas em uma tela compartilhada.
            </Subtitle>
          </HeaderText>

          <HeaderActions>
            <AutoRefreshPill>
              <FiClock size={14} />
              Auto refresh em {nextRefreshInSeconds}s
            </AutoRefreshPill>

            <RefreshButton
              onClick={() => runHealthCheck(true)}
              disabled={refreshing || loading}
            >
              <FiRefreshCw size={16} />
              {refreshing || loading ? "Atualizando..." : "Atualizar agora"}
            </RefreshButton>
          </HeaderActions>
        </HeaderSection>

        <SummaryGrid>
          <SummaryCard>
            <SummaryLabel>Total de sistemas</SummaryLabel>
            <SummaryValue>{summary.total}</SummaryValue>
          </SummaryCard>
          <SummaryCard>
            <SummaryLabel>Online</SummaryLabel>
            <SummaryValue style={{ color: "#34d399" }}>{summary.online}</SummaryValue>
          </SummaryCard>
          <SummaryCard>
            <SummaryLabel>Offline</SummaryLabel>
            <SummaryValue style={{ color: "#f87171" }}>{summary.offline}</SummaryValue>
          </SummaryCard>
          <SummaryCard>
            <SummaryLabel>Indefinidos</SummaryLabel>
            <SummaryValue style={{ color: "#fbbf24" }}>{summary.degraded}</SummaryValue>
          </SummaryCard>
          <SummaryCard>
            <SummaryLabel>Ultima atualizacao</SummaryLabel>
            <SummaryValue style={{ fontSize: "1.35rem" }}>
              {lastUpdatedAt ? new Date(lastUpdatedAt).toLocaleTimeString("pt-BR") : "-"}
            </SummaryValue>
          </SummaryCard>
          <SummaryCard>
            <SummaryLabel>Refresh automatico</SummaryLabel>
            <SummaryValue style={{ fontSize: "1.35rem" }}>30s</SummaryValue>
          </SummaryCard>
        </SummaryGrid>

        <MetaLine style={{ marginBottom: "16px" }}>
          <FiClock size={14} />
          Ultima verificacao: {renderedLastUpdated}
        </MetaLine>

        <StatusGrid>
          {results.map((result, index) => (
            <StatusCard
              key={result.name}
              status={result.status}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: index * 0.03 }}
            >
              <StatusIconWrap>
                {result.status === "online" ? (
                  <FiCheckCircle size={22} color="#34d399" />
                ) : result.status === "offline" ? (
                  <FiXCircle size={22} color="#f87171" />
                ) : (
                  <FiAlertCircle size={22} color="#fbbf24" />
                )}
              </StatusIconWrap>

              <StatusContent>
                <StatusName>{result.name}</StatusName>
                <StatusMeta>
                  {result.status === "online"
                    ? "Sistema operando normalmente"
                    : result.status === "offline"
                      ? result.details || "Sistema indisponível"
                      : "Status indefinido"}
                </StatusMeta>
              </StatusContent>

              <StatusBadge status={result.status}>
                <FiServer size={14} />
                {getStatusLabel(result.status)}
              </StatusBadge>
            </StatusCard>
          ))}
        </StatusGrid>

        <DetailsPanel>
          <DetailsHeader>
            <span>Sistema</span>
            <span>Status</span>
            <span>Latencia</span>
            <span>Timestamp API</span>
            <span>Detalhes</span>
          </DetailsHeader>

          <ResultsGrid>
            {results.map((result, index) => (
              <SystemCard
                key={`${result.name}-details`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.02 }}
              >
                <DetailsRow>
                  <DetailCell>
                    <DetailLabel>Sistema</DetailLabel>
                    <SystemName>{result.name}</SystemName>
                    <EndpointLink href={result.url} target="_blank" rel="noreferrer">
                      {result.url}
                    </EndpointLink>
                  </DetailCell>

                  <DetailCell>
                    <DetailLabel>Status</DetailLabel>
                    <StatusBadge status={result.status}>
                      {getStatusIcon(result.status)}
                      {getStatusLabel(result.status)}
                    </StatusBadge>
                  </DetailCell>

                  <DetailCell>
                    <DetailLabel>Latencia</DetailLabel>
                    <MetaLine>
                      {result.latencyMs !== undefined ? `${result.latencyMs} ms` : "-"}
                    </MetaLine>
                  </DetailCell>

                  <DetailCell>
                    <DetailLabel>Timestamp API</DetailLabel>
                    <MetaLine>{result.serviceTimestamp || "-"}</MetaLine>
                  </DetailCell>

                  <DetailCell>
                    <DetailLabel>Detalhes</DetailLabel>
                    <MetaLine>HTTP: {result.httpStatus ?? "-"}</MetaLine>
                    <MetaLine>Checado: {new Date(result.checkedAt).toLocaleTimeString("pt-BR")}</MetaLine>
                    {result.details && <ErrorText>{result.details}</ErrorText>}
                  </DetailCell>
                </DetailsRow>
              </SystemCard>
            ))}

            {!results.length && !loading && (
              <EmptyState>Nenhum sistema monitorado no momento.</EmptyState>
            )}
          </ResultsGrid>
        </DetailsPanel>

        {loading && (
          <MetaLine style={{ marginTop: "16px" }}>Carregando verificacoes...</MetaLine>
        )}
      </PageContainer>
    );
  }
