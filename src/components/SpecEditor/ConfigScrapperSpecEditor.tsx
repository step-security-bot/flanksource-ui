import { useMemo } from "react";
import SpecEditor, { SpecType } from "./SpecEditor";
import AWSConfigsFormEditor from "../Forms/Configs/AWSConfigsFormEditor";
import KubernetesConfigsFormEditor from "../Forms/Configs/KubernetesConfigsFormEditor";

type ConfigScrapperSpecEditorProps = {
  spec?: Record<string, any>;
  onSubmit?: (spec: Record<string, any>) => void;
  canEdit?: boolean;
  deleteHandler?: (id: string) => void;
};

export default function ConfigScrapperSpecEditor({
  spec,
  onSubmit = () => {},
  canEdit = true,
  deleteHandler
}: ConfigScrapperSpecEditorProps) {
  const configTypes: SpecType[] = useMemo(
    () => [
      {
        name: "kubernetes",
        description: "Edit kubernetes configs",
        canEdit: canEdit,
        updateSpec: (value: Record<string, any>) => {
          onSubmit(value);
        },
        loadSpec: () => {
          // probably need to query the spec from the backend
          return spec ?? {};
        },
        icon: "kubernetes",
        configForm: KubernetesConfigsFormEditor,
        formFieldName: "spec.kubernetes.0"
      },
      {
        name: "aws",
        description: "Edit aws configs",
        canEdit: canEdit,
        updateSpec: (value: Record<string, any>) => {
          onSubmit(value);
        },
        loadSpec: () => {
          // probably need to query the spec from the backend
          return spec ?? {};
        },
        configForm: AWSConfigsFormEditor,
        icon: "aws",
        formFieldName: "spec.aws.0"
      },
      {
        name: "File",
        canEdit: canEdit,
        updateSpec: (value: Record<string, any>) => {
          onSubmit(value);
        },
        loadSpec: () => {
          return spec ?? {};
        },
        icon: "file",
        configForm: null,
        formFieldName: "spec",
        rawSpecInput: true
      },
      {
        name: "Git",
        canEdit: canEdit,
        updateSpec: (value: Record<string, any>) => {
          onSubmit(value);
        },
        loadSpec: () => {
          return spec ?? {};
        },
        icon: "git",
        configForm: null,
        formFieldName: "spec",
        rawSpecInput: true
      },
      {
        name: "HTTP",
        canEdit: canEdit,
        updateSpec: (value: Record<string, any>) => {
          onSubmit(value);
        },
        loadSpec: () => {
          return spec ?? {};
        },
        icon: "http",
        configForm: null,
        formFieldName: "spec",
        rawSpecInput: true
      },
      {
        name: "Azure DevOps",
        canEdit: canEdit,
        updateSpec: (value: Record<string, any>) => {
          onSubmit(value);
        },
        loadSpec: () => {
          return spec ?? {};
        },
        icon: "azure",
        configForm: null,
        formFieldName: "spec",
        rawSpecInput: true
      },
      {
        name: "Custom Config Spec",
        canEdit: canEdit,
        updateSpec: (value: Record<string, any>) => {
          onSubmit(value);
        },
        loadSpec: () => {
          return spec ?? {};
        },
        icon: "code",
        configForm: null,
        formFieldName: "spec",
        rawSpecInput: true
      }
    ],
    [canEdit, onSubmit, spec]
  );

  // there should only be one spec, so we can just grab the first key
  const selectedSpec = spec ? Object.keys(spec.spec)[0] : undefined;

  return (
    <SpecEditor
      types={configTypes}
      format="yaml"
      resourceName="Config Scraper"
      canEdit={!!spec}
      selectedSpec={selectedSpec}
      deleteHandler={deleteHandler}
    />
  );
}
