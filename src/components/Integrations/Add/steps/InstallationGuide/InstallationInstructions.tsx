import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import YAML from "yaml";
import FormSkeletonLoader from "../../../../SkeletonLoader/FormSkeletonLoader";
import { Tab, Tabs } from "../../../../Tabs/Tabs";
import { CreateIntegrationOption } from "../AddIntegrationOptionsList";
import { selectedOptionToSpecMap } from "../TemplateIntegrationOption";
import FluxAddIntegrationCommand from "./FluxAddIntegrationCommand";
import HelmCLIAddIntegrationCommand from "./HelmCLIAddIntegrationCommand";

export type HelmChartValues = {
  apiVersion: string;
  name: string;
  description: string;
  type: string;
  version: string;
  appVersion: string;
};

type Props = {
  selectedOption: CreateIntegrationOption;
  formValues: Record<string, any>;
};

export default function InstallationInstructions({
  selectedOption,
  formValues
}: Props) {
  const [activeSpecTab, setActiveSpecTab] = useState<"Helm CLI" | "Flux">(
    "Flux"
  );

  const { data: helmChartValues, isLoading: isLoadingSpec } = useQuery({
    queryKey: ["Github", "mission-control-registry", "values", selectedOption],
    queryFn: async () => {
      const url = selectedOptionToSpecMap.get(selectedOption!);
      const response = await fetch(url?.chartValuesURL!);
      const data = await response.text();
      return YAML.parse(data) as HelmChartValues;
    },
    enabled:
      !!selectedOption &&
      selectedOption !== "Custom Topology" &&
      selectedOption !== "Catalog Scraper"
  });

  if (isLoadingSpec || !helmChartValues) {
    return (
      <div className="flex flex-col gap-2 p-4 overflow-y-auto h-full">
        <FormSkeletonLoader />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-auto">
      <Tabs
        activeTab={activeSpecTab}
        onSelectTab={(v) => setActiveSpecTab(v as any)}
      >
        <Tab label="Flux" value="Flux" className="flex flex-col h-auto p-2">
          <FluxAddIntegrationCommand
            selectedOption={selectedOption}
            name={formValues.name}
            helmChartValues={helmChartValues}
          />
        </Tab>

        <Tab
          className="flex flex-col h-auto p-2"
          label="Helm CLI"
          value="Helm CLI"
        >
          <HelmCLIAddIntegrationCommand
            name={formValues.name}
            chartValues={helmChartValues}
          />
        </Tab>
      </Tabs>
    </div>
  );
}
