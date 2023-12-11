import { TupleToUnion } from "type-fest";
import { Icon } from "../../../Icon";
import { TopologyIcon } from "../../../Icons/TopologyIcon";
import { SearchInListIcon } from "../../../Icons/SearchInListIcon";
import { LogsIcon } from "../../../Icons/LogsIcon";

export const createIntegrationOption = [
  "AWS",
  "Azure",
  "Prometheus",
  "Flux",
  "Kubernetes",
  "Mission Control",
  "Log Backends",
  "Custom Topology",
  "Catalog Scraper"
] as const;

export type CreateIntegrationOption = TupleToUnion<
  typeof createIntegrationOption
>;

export const IntegrationsOptionToIconMap = new Map<
  CreateIntegrationOption,
  React.ReactNode
>([
  ["AWS", <Icon key="aws-icon" name="aws" />],
  ["Azure", <Icon key="azure-icon" name="azure" />],
  ["Prometheus", <Icon key="prometheus-icon" name="prometheus" />],
  ["Flux", <Icon key="flux-icon" name="flux" />],
  ["Kubernetes", <Icon key="kubernetes-icon" name="kubernetes" />],
  [
    "Mission Control",
    <Icon key="mission-control-icon" name="mission-control" />
  ],
  ["Custom Topology", <TopologyIcon className="h-5 w-5" key="topology-icon" />],
  [
    "Catalog Scraper",
    <SearchInListIcon className="h-5 w-5" key="catalog-icon" />
  ],
  ["Log Backends", <LogsIcon className="h-5 w-5" key="logs-icon" />]
]);

type AddTopologyOptionsListProps = {
  onSelectOption: (options: CreateIntegrationOption) => void;
};

export default function AddIntegrationOptionsList({
  onSelectOption
}: AddTopologyOptionsListProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap p-2">
        {createIntegrationOption.map((item) => {
          return (
            <div className="flex flex-col w-1/4 p-2" key={item}>
              <div
                role="button"
                className="flex flex-col items-center space-y-2 justify-center p-2 border border-gray-300 hover:border-blue-200 hover:bg-gray-100 rounded-md text-center h-20"
                onClick={(e) => {
                  onSelectOption(item);
                }}
              >
                <div className="flex flex-col items-center justify-center">
                  {IntegrationsOptionToIconMap.get(item)}
                </div>
                <div>{item}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
