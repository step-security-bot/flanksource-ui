import { useMemo } from "react";
import { SchemaResourceWithJobStatus } from "../../api/schemaResources";
import { DataTable } from "../DataTable";
import { integrationsTableColumns } from "./Table/InetgrationsTableColumns";

type IntegrationsListProps = {
  data: SchemaResourceWithJobStatus[];
  onRowClick: (row: SchemaResourceWithJobStatus) => void;
  pageCount: number;
  pageIndex: number;
  pageSize: number;
  isLoading: boolean;
  setPageState?: (state: { pageIndex: number; pageSize: number }) => void;
};

export default function IntegrationsList({
  data,
  onRowClick,
  pageCount,
  pageIndex,
  pageSize,
  isLoading = false,
  setPageState = () => {}
}: IntegrationsListProps) {
  const pagination = useMemo(() => {
    return {
      setPagination: setPageState,
      pageIndex,
      pageSize,
      pageCount,
      remote: true,
      enable: true,
      loading: isLoading
    };
  }, [setPageState, pageIndex, pageSize, pageCount, isLoading]);

  return (
    <DataTable
      data={data}
      handleRowClick={(row) => onRowClick(row.original)}
      columns={integrationsTableColumns}
      pagination={pagination}
      isLoading={isLoading}
    />
  );
}
