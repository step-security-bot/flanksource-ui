import { CellContext, ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";
import { SchemaResourceWithJobStatus } from "../../../api/schemaResources";
import { User } from "../../../api/types/users";
import { Age } from "../../../ui/Age";
import { DateCell } from "../../../ui/table";
import { Avatar } from "../../Avatar";
import { LogsIcon } from "../../Icons/LogsIcon";
import { SearchInListIcon } from "../../Icons/SearchInListIcon";
import { TopologyIcon } from "../../Icons/TopologyIcon";
import JobHistoryStatusColumn from "../../JobsHistory/JobHistoryStatusColumn";
import { JobHistoryStatus } from "../../JobsHistory/JobsHistoryTable";

function IntegrationListNameCell({
  row
}: CellContext<SchemaResourceWithJobStatus, any>) {
  const name = row.original.name;

  const icon = useMemo(() => {
    const type = row.original.integration_type;
    if (type === "scrapers") {
      return <SearchInListIcon className={"h-5 w-5"} />;
    }
    if (type === "topologies") {
      return <TopologyIcon className={"h-5 w-5"} />;
    }
    return <LogsIcon className={"h-5 w-5"} />;
  }, [row.original.integration_type]);

  return (
    <div className="flex items-center gap-2">
      {icon}
      <span className="truncate">{name}</span>
    </div>
  );
}

export const integrationsTableColumns: ColumnDef<SchemaResourceWithJobStatus>[] =
  [
    {
      id: "name",
      header: "Name",
      accessorKey: "name",
      size: 250,
      cell: IntegrationListNameCell
    },
    {
      id: "source",
      header: "Source",
      accessorKey: "source"
    },
    {
      id: "Created At",
      header: "Created At",
      accessorFn: (row) => row.created_at,
      cell: DateCell
    },
    {
      id: "Updated At",
      header: "Updated At",
      accessorFn: (row) => row.updated_at,
      cell: DateCell
    },
    {
      id: "job_status",
      accessorKey: "job_status",
      header: "Job Status",
      cell: ({ getValue }) => {
        const status = getValue<JobHistoryStatus>();
        return <JobHistoryStatusColumn status={status} />;
      }
    },
    {
      id: "last_run",
      header: "Last Run",
      cell: ({ row }) => {
        const startTime = row.original.job_time_start;
        return <Age from={startTime} suffix={true} />;
      }
    },
    {
      id: "created_by",
      header: "Created By",
      accessorFn: (row) => row.created_by,
      cell: ({ getValue }) => {
        const user = getValue<User>();
        return user ? <Avatar user={user} circular /> : null;
      }
    }
  ];
