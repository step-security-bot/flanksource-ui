import { useSettingsCreateResource } from "../../../../api/query-hooks/mutations/useSettingsResourcesMutations";
import { schemaResourceTypes } from "../../../SchemaResourcePage/resourceTypes";
import ConfigScrapperSpecEditor from "../../../SpecEditor/ConfigScrapperSpecEditor";

type Props = {
  onSuccess: () => void;
  onBack: () => void;
};

export default function CatalogFormOption({ onSuccess, onBack }: Props) {
  const resourceInfo = schemaResourceTypes.find(
    (resource) => resource.name === "Catalog Scraper"
  );

  const { mutate: createResource } = useSettingsCreateResource(
    resourceInfo!,
    onSuccess
  );

  return (
    <div className="flex flex-col gap-2 overflow-y-auto h-full">
      <ConfigScrapperSpecEditor
        resourceInfo={{
          table: "config_scrapers",
          api: "config-db",
          name: "Catalog Scraper"
        }}
        onSubmit={createResource}
        onBack={onBack}
      />
    </div>
  );
}
