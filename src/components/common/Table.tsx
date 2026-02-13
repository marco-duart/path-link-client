import React from 'react';
import { styled } from '../../assets/styles/themes/stitches.config';
import { motion } from 'framer-motion';

interface TableColumn<T> {
  key: keyof T | string;
  label: string;
  render?: (value: any, row: T, rowIndex: number) => React.ReactNode;
  width?: string;
}

interface TableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  rowKey?: string | ((row: T, index: number) => string | number);
  loading?: boolean;
  empty?: React.ReactNode;
  onRowClick?: (row: T) => void;
  striped?: boolean;
  hoverable?: boolean;
}

const TableContainer = styled('div', {
  overflowX: 'auto',
  borderRadius: '$lg',
  border: '1px solid $borderPrimary',
  boxShadow: '$md',
});

const StyledTable = styled('table', {
  width: '100%',
  borderCollapse: 'collapse',
  backgroundColor: '$bgSecondary',

  variants: {
    striped: {
      true: {
        '& tbody tr:nth-child(odd)': {
          backgroundColor: '$bgPrimary',
        },
      },
    },
  },
});

const TableHead = styled('thead', {
  backgroundColor: '$bgTertiary',
  borderBottom: '2px solid $borderPrimary',
});

const TableHeaderCell = styled('th', {
  paddingLeft: '$lg',
  paddingRight: '$lg',
  paddingTop: '$md',
  paddingBottom: '$md',
  textAlign: 'left',
  fontWeight: '$semibold',
  fontSize: '$sm',
  color: '$textSecondary',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
});

const TableBody = styled('tbody', {});

const TableRow = styled('tr', {
  borderBottom: '1px solid $borderPrimary',
  transition: 'all $normal',

  variants: {
    hoverable: {
      true: {
        '&:hover': {
          backgroundColor: '$bgTertiary',
          cursor: 'pointer',
        },
      },
    },
  },
});

const TableCell = styled('td', {
  paddingLeft: '$lg',
  paddingRight: '$lg',
  paddingTop: '$md',
  paddingBottom: '$md',
  fontSize: '$sm',
  color: '$textPrimary',
});

const EmptyState = styled('div', {
  paddingTop: '$3xl',
  paddingBottom: '$3xl',
  textAlign: 'center',
  color: '$textSecondary',
});

const LoadingState = styled('div', {
  paddingTop: '$3xl',
  paddingBottom: '$3xl',
  textAlign: 'center',
  color: '$textSecondary',
  fontSize: '$lg',
});

/**
 * Componente de tabela genérica e reutilizável
 * Suporta customização de colunas, renderização customizada, carregamento e estado vazio
 */
export const Table = React.forwardRef<HTMLDivElement, TableProps<any>>(
  (
    {
      columns,
      data,
      rowKey = (_row, index) => index,
      loading = false,
      empty = 'Nenhum dado disponível',
      onRowClick,
      striped = true,
      hoverable = true,
    },
    ref
  ) => {
    const getRowKey = (row: any, index: number) => {
      if (typeof rowKey === 'function') {
        return rowKey(row, index);
      }
      return row[rowKey] || index;
    };

    if (loading) {
      return (
        <TableContainer ref={ref}>
          <StyledTable striped={striped}>
            <TableHead>
              <tr>
                {columns.map((col) => (
                  <TableHeaderCell
                    key={String(col.key)}
                    style={{
                      width: col.width,
                    }}
                  >
                    {col.label}
                  </TableHeaderCell>
                ))}
              </tr>
            </TableHead>
          </StyledTable>
          <LoadingState>Carregando...</LoadingState>
        </TableContainer>
      );
    }

    if (data.length === 0) {
      return (
        <TableContainer ref={ref}>
          <StyledTable striped={striped}>
            <TableHead>
              <tr>
                {columns.map((col) => (
                  <TableHeaderCell
                    key={String(col.key)}
                    style={{
                      width: col.width,
                    }}
                  >
                    {col.label}
                  </TableHeaderCell>
                ))}
              </tr>
            </TableHead>
          </StyledTable>
          <EmptyState>{empty}</EmptyState>
        </TableContainer>
      );
    }

    return (
      <TableContainer ref={ref}>
        <StyledTable striped={striped}>
          <TableHead>
            <tr>
              {columns.map((col) => (
                <TableHeaderCell
                  key={String(col.key)}
                  style={{
                    width: col.width,
                  }}
                >
                  {col.label}
                </TableHeaderCell>
              ))}
            </tr>
          </TableHead>
          <TableBody>
            {data.map((row, rowIndex) => (
              <TableRow
                key={getRowKey(row, rowIndex)}
                hoverable={hoverable && !!onRowClick}
                onClick={() => onRowClick?.(row)}
                as={motion.tr}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: rowIndex * 0.05 }}
              >
                {columns.map((col) => (
                  <TableCell key={String(col.key)}>
                    {col.render
                      ? col.render((row as any)[String(col.key)], row, rowIndex)
                      : (row as any)[String(col.key)]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </StyledTable>
      </TableContainer>
    );
  }
);

Table.displayName = 'Table';
