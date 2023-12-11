import { useQuery } from "@tanstack/react-query";
import clsx from "clsx";
import { Form, Formik } from "formik";
import { useMemo } from "react";
import { Button } from "../../../Button";
import FormikKeyValueMapField from "../../../Forms/Formik/FormikKeyValueMapField";
import FormikTextInput from "../../../Forms/Formik/FormikTextInput";
import DeleteResource from "../../../SchemaResourcePage/Delete/DeleteResource";
import { schemaResourceTypes } from "../../../SchemaResourcePage/resourceTypes";
import FormSkeletonLoader from "../../../SkeletonLoader/FormSkeletonLoader";
import { CreateIntegrationOption } from "./AddIntegrationOptionsList";
import InstallationInstructions from "./InstallationGuide/InstallationInstructions";

export const selectedOptionToSpecMap = new Map<
  CreateIntegrationOption,
  {
    specURL: string;
    chartValuesURL: string;
    fluxTemplateURL: string;
  }
>([
  [
    "Flux",
    {
      specURL:
        "https://raw.githubusercontent.com/flanksource/mission-control-registry/main/topologies/flux/flux.yaml",
      chartValuesURL:
        "https://raw.githubusercontent.com/flanksource/mission-control-registry/main/charts/flux/Chart.yaml",
      fluxTemplateURL:
        "https://raw.githubusercontent.com/flanksource/mission-control-registry/main/topologies/flux/flux.yaml"
    }
  ],
  [
    "Kubernetes",
    {
      specURL:
        "https://raw.githubusercontent.com/flanksource/mission-control-registry/main/topologies/kubernetes/kubernetes.yaml",
      chartValuesURL:
        "https://raw.githubusercontent.com/flanksource/mission-control-registry/main/charts/kubernetes/Chart.yaml",
      fluxTemplateURL:
        "https://raw.githubusercontent.com/flanksource/mission-control-registry/main/topologies/kubernetes/kubernetes.yaml"
    }
  ],
  [
    "Prometheus",
    {
      specURL:
        "https://raw.githubusercontent.com/flanksource/mission-control-registry/main/topologies/prometheus/prometheus.yaml",
      chartValuesURL:
        "https://raw.githubusercontent.com/flanksource/mission-control-registry/main/charts/prometheus/Chart.yaml",
      fluxTemplateURL:
        "https://raw.githubusercontent.com/flanksource/mission-control-registry/main/topologies/prometheus/prometheus.yaml"
    }
  ],
  [
    "Mission Control",
    {
      specURL:
        "https://raw.githubusercontent.com/flanksource/mission-control-registry/main/topologies/mission-control/mission-control.yaml",
      chartValuesURL:
        "https://raw.githubusercontent.com/flanksource/mission-control-registry/main/charts/mission-control/Chart.yaml",
      fluxTemplateURL:
        "https://raw.githubusercontent.com/flanksource/mission-control-registry/main/topologies/mission-control/mission-control.yaml"
    }
  ]
]);

export type TopologyResource = {
  id: string;
  name: string;
  namespace: string;
  labels: Record<string, string>;
  spec: Record<string, any>;
};

type TopologyResourceFormProps = {
  topology?: TopologyResource;
  /**
   * The selected option from the create topology options list,
   * this is used to determine the initial values for the spec field
   * and is only used when creating a new topology. When updating a topology
   * the spec field is populated with the current topology's spec and this
   * prop is ignored.
   */
  selectedOption?: CreateIntegrationOption;
  onBack?: () => void;
  footerClassName?: string;
  onSuccess?: () => void;
};

export default function TemplateIntegrationOption({
  topology,
  onBack,
  selectedOption,
  footerClassName = "bg-gray-100 p-4",
  onSuccess = () => {}
}: TopologyResourceFormProps) {
  const { data: spec, isLoading: isLoadingSpec } = useQuery({
    queryKey: ["Github", "mission-control-registry", selectedOption],
    queryFn: async () => {
      const urls = selectedOptionToSpecMap.get(selectedOption!);
      if (!urls) {
        return {};
      }
      const response = await fetch(urls?.specURL!);
      const data = await response.text();
      return data as string;
    },
    enabled:
      !!selectedOption &&
      selectedOption !== "Custom Topology" &&
      selectedOption !== "Catalog Scraper",
    select: (data: any) => {
      try {
        return data;
      } catch (e) {
        console.error(e);
        return data;
      }
    }
  });

  const initialValues: TopologyResource = useMemo(() => {
    return {
      id: "",
      name: "",
      namespace: "",
      labels: {},
      spec: spec ?? {}
    };
  }, [spec]);

  if (
    selectedOption &&
    selectedOption !== "Custom Topology" &&
    selectedOption !== "Catalog Scraper" &&
    isLoadingSpec
  ) {
    return (
      <div className="flex flex-col gap-2 p-4 overflow-y-auto h-full">
        <FormSkeletonLoader />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 overflow-y-auto h-full">
      <Formik
        initialValues={initialValues}
        onSubmit={() => {
          onSuccess();
        }}
      >
        {({ isValid, handleSubmit, values }) => (
          <Form
            onSubmit={handleSubmit}
            className="flex flex-col flex-1 overflow-y-auto"
          >
            <div className="flex flex-col gap-4 p-4 overflow-y-auto flex-1">
              <FormikTextInput
                label={
                  selectedOption !== "Kubernetes" ? "Name" : "Cluster Name"
                }
                name="name"
                placeholder="Topology name"
              />

              {selectedOption === "Kubernetes" && (
                <FormikTextInput
                  label="Prometheus URL"
                  hint="The URL of the prometheus server to use when collecting metrics"
                  name="prometheusURL"
                  placeholder="Prometheus URL"
                />
              )}

              {selectedOption === "Prometheus" && (
                <FormikTextInput
                  label="URL"
                  name="url"
                  placeholder="Prometheus URL"
                />
              )}

              <FormikTextInput
                label="Namespace"
                name="namespace"
                placeholder="Namespace"
                defaultValue={"default"}
              />

              <FormikKeyValueMapField label="Labels" name="labels" outputJson />

              <InstallationInstructions
                selectedOption={selectedOption!}
                formValues={values}
              />
            </div>
            <div className={`flex flex-col ${footerClassName}`}>
              <div className="flex flex-1 flex-row items-center space-x-4 justify-end">
                {!topology?.id && (
                  <div className="flex flex-1 flex-row">
                    <Button
                      type="button"
                      text="Back"
                      className="btn-default btn-btn-secondary-base btn-secondary"
                      onClick={onBack}
                    />
                  </div>
                )}
                {!!topology?.id && (
                  <DeleteResource
                    resourceId={topology?.id}
                    resourceInfo={
                      schemaResourceTypes.find(
                        ({ name }) => name === "Topology"
                      )!
                    }
                  />
                )}

                <Button
                  disabled={!isValid}
                  type="submit"
                  text="Close"
                  className={clsx("btn-primary")}
                />
              </div>
            </div>
          </Form>
        )}
        {/*  */}
      </Formik>
    </div>
  );
}
