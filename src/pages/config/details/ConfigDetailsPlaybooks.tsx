import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { getPlaybookRuns } from "../../../api/services/playbooks";
import { ConfigDetailsTabs } from "../../../components/Configs/ConfigDetailsTabs";
import PlaybookRunsTable from "../../../components/Playbooks/Runs/PlaybookRunsList";

export function ConfigDetailsPlaybooksPage() {
  const { id } = useParams();

  const [{ pageIndex, pageSize }, setPageState] = useState({
    pageIndex: 0,
    pageSize: 200
  });

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["playbookRuns", { pageIndex, pageSize, configId: id }],
    queryFn: () =>
      getPlaybookRuns({
        pageIndex,
        pageSize,
        configId: id
      })
  });

  const playbookRuns = data?.data;

  const totalEntries = data?.totalEntries;

  const pagination = useMemo(() => {
    return {
      setPagination: setPageState,
      pageIndex,
      pageSize,
      pageCount: totalEntries ? Math.ceil(totalEntries / pageSize) : -1,
      remote: true,
      enable: true,
      loading: isLoading
    };
  }, [pageIndex, pageSize, totalEntries, isLoading]);

  return (
    <ConfigDetailsTabs
      pageTitlePrefix={"Config Playbooks"}
      isLoading={isLoading}
      refetch={refetch}
      activeTabName="Playbooks"
    >
      <div className={`flex flex-col flex-1 h-full space-y-2`}>
        <div className="flex flex-col h-full overflow-y-hidden">
          <PlaybookRunsTable
            data={playbookRuns ?? []}
            isLoading={isLoading}
            pagination={pagination}
          />
        </div>
      </div>
    </ConfigDetailsTabs>
  );
}
