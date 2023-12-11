import { useAtom } from "jotai";
import React, { useEffect, useState } from "react";
import { Button } from "../Button";
import SpecEditorForm from "../Forms/SpecEditorForm";
import { Icon } from "../Icon";
import { integrationsModalSubTitle } from "../Integrations/Add/AddIntegrationModal";
import { modalHelpLinkAtom } from "../Modal";
import { SchemaResourceType } from "../SchemaResourcePage/resourceTypes";

export type SpecType = {
  name: string;
  label?: string;
  icon: string | React.FC;
  loadSpec: () => Record<string, any>;
  updateSpec: (spec: Record<string, any>) => void;
  configForm: React.FC<{ fieldName: string; specsMapField: string }> | null;
  /**
   *
   * the field name is the name of the field in the spec that this config editor
   * is editing (e.g. "kubernetes" or "kubernetes.0")
   *
   * #### Example
   *
   * if the spec is: `{ spec: { "kubernetes": { ... } }}` then the field name is `"kubernetes"`
   * and, in this case, it returns an object
   *
   * if the spec is `{ { kubernetes: [{ ... }] }}` then the field name is `"kubernetes.0"`
   * and, in this case, it returns an array of one item
   *
   */
  specsMapField: string;
  rawSpecInput?: boolean;
  schemaFilePrefix: "component" | "canary" | "system" | "scrape_config";
  docsLink?: string;
};

type SpecEditorProps = {
  types: SpecType[];
  format?: "json" | "yaml";
  resourceInfo: Pick<SchemaResourceType, "api" | "table" | "name">;
  selectedSpec?: string;
  canEdit?: boolean;
  cantEditMessage?: string;
  onBack?: () => void;
};

export default function SpecEditor({
  types,
  format = "yaml",
  resourceInfo,
  selectedSpec,
  canEdit = false,
  cantEditMessage,
  onBack
}: SpecEditorProps) {
  const [, setModalHelpLink] = useAtom(modalHelpLinkAtom);
  const [, setIntegrationsModalSubTitle] = useAtom(integrationsModalSubTitle);

  const [selectedSpecItem, setSelectedSpecItem] = useState<
    SpecType | undefined
  >(() => {
    if (selectedSpec) {
      const selectedType = types.find(({ name }) => name === selectedSpec);
      if (selectedType) {
        return selectedType;
      }
      return types.find(({ name }) => name === "custom");
    }
    return undefined;
  });

  // if the types change, we need to update the selectedSpecItem to the new
  // item, so that the form is updated, a good example is when we toggle canEdit
  useEffect(() => {
    if (selectedSpecItem) {
      setSelectedSpecItem(
        types.find(({ name }) => name === selectedSpecItem.name)
      );
    }
    // don't add selectedSpecItem to the dependency list, because we don't want
    // to initiate a race condition
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [types]);

  return (
    <div className="flex flex-col w-full flex-1 h-full overflow-y-auto">
      {selectedSpecItem ? (
        <div className="flex flex-col space-y-2 flex-1 overflow-y-auto">
          <SpecEditorForm
            configForm={selectedSpecItem.configForm}
            updateSpec={selectedSpecItem.updateSpec}
            onBack={() => {
              setSelectedSpecItem(undefined);
            }}
            loadSpec={selectedSpecItem.loadSpec}
            rawSpecInput={selectedSpecItem.rawSpecInput}
            specFormat={format}
            resourceInfo={resourceInfo}
            specsMapField={selectedSpecItem.specsMapField}
            schemaFilePrefix={selectedSpecItem.schemaFilePrefix}
            canEdit={canEdit}
            cantEditMessage={cantEditMessage}
          />
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap p-2">
            {types.map((type) => (
              <div key={type.name} className="flex flex-col w-1/5 p-2">
                <div
                  onClick={() => {
                    setSelectedSpecItem(type);
                    setModalHelpLink(type.docsLink);
                    setIntegrationsModalSubTitle(type.label ?? type.name);
                  }}
                  role={"button"}
                  className="flex flex-col items-center space-y-2 justify-center p-2 border border-gray-300 hover:border-blue-200 hover:bg-gray-100 rounded-md text-center h-20"
                  key={type.name}
                >
                  {typeof type.icon === "string" ? (
                    <Icon name={type.icon} className="w-5 h-5" />
                  ) : (
                    <type.icon />
                  )}
                  <span>{type.label ?? type.name}</span>
                </div>
              </div>
            ))}
          </div>
          {onBack && (
            <div className={`flex flex-row  bg-gray-100 p-4`}>
              <Button
                type="button"
                text="Back"
                className="btn-default btn-btn-secondary-base btn-secondary"
                onClick={onBack}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
