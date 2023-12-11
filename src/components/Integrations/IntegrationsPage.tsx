import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { getIntegrationsWithJobStatus } from "../../api/schemaResources";
import { BreadcrumbNav, BreadcrumbRoot } from "../BreadcrumbNav";
import { Head } from "../Head/Head";
import { SearchLayout } from "../Layout";
import IntegrationsList from "./IntegrationsList";
import AddIntegrationModal from "./Add/AddIntegrationModal";

export default function IntegrationsPage() {
  const [{ pageIndex, pageSize }, setPageState] = useState({
    pageIndex: 0,
    pageSize: 150
  });

  const { data, refetch, isLoading, isRefetching } = useQuery({
    queryKey: ["integrations", { pageIndex, pageSize }],
    queryFn: () => {
      return getIntegrationsWithJobStatus(pageIndex, pageSize);
    }
  });

  const integrations = data?.data ?? [];
  const totalEntries = data?.totalEntries;
  const pageCount = totalEntries ? Math.ceil(totalEntries / pageSize) : -1;

  return (
    <>
      <Head prefix="Settings - Integrations" />
      <SearchLayout
        title={
          <BreadcrumbNav
            list={[
              <BreadcrumbRoot
                key={"integrations-settings"}
                link="/settings/integrations"
              >
                Integrations
              </BreadcrumbRoot>,
              <AddIntegrationModal key="add-integration" refresh={refetch} />
            ]}
          />
        }
        onRefresh={refetch}
        contentClass="p-0 h-full"
        loading={isLoading || isRefetching}
      >
        <div className="flex flex-col flex-1 p-6 pb-0 h-full w-full">
          <div className="max-w-screen-xl mx-auto flex flex-col">
            <IntegrationsList
              data={integrations ?? []}
              onRowClick={(row) => {
                // do something
              }}
              isLoading={isLoading || isRefetching}
              pageCount={pageCount}
              pageIndex={pageIndex}
              pageSize={pageSize}
              setPageState={setPageState}
            />
          </div>
        </div>
      </SearchLayout>
    </>
  );
}
