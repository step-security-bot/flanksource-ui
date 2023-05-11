import { useMemo } from "react";
import SpecEditor, { SpecType } from "./SpecEditor";
import { HTTPHealthFormEditor } from "../Forms/Health/HTTPHealthFormEditor";
import { FaCog } from "react-icons/fa";
import { SchemaResourceType } from "../SchemaResourcePage/resourceTypes";

type HealthSpecEditorProps = {
  spec?: Record<string, any>;
  onSubmit?: (spec: Record<string, any>) => void;
  resourceInfo: SchemaResourceType;
};

export default function HealthSpecEditor({
  spec,
  onSubmit = () => {},
  resourceInfo
}: HealthSpecEditorProps) {
  const configTypes = useMemo(
    () =>
      [
        {
          name: "http",
          label: "HTTP",
          updateSpec: (value: Record<string, any>) => {
            onSubmit(value);
          },
          loadSpec: () => {
            return spec ?? {};
          },
          icon: "http",
          configForm: HTTPHealthFormEditor,
          specsMapField: "http.0",
          rawSpecInput: false
        },
        {
          name: "awsConfigRule",
          label: "AWS Config Rule",
          updateSpec: (value: Record<string, any>) => {
            onSubmit(value);
          },
          loadSpec: () => {
            return spec ?? {};
          },
          icon: "aws",
          configForm: null,
          specsMapField: "awsConfigRule.0",
          rawSpecInput: true
        },
        {
          name: "awsConfig",
          label: "AWS Config",
          updateSpec: (value: Record<string, any>) => {
            onSubmit(value);
          },
          loadSpec: () => {
            return spec ?? {};
          },
          icon: "aws-config",
          configForm: null,
          specsMapField: "awsConfig.0",
          rawSpecInput: true
        },
        {
          name: "github",
          label: "GitHub",
          updateSpec: (value: Record<string, any>) => {
            onSubmit(value);
          },
          loadSpec: () => {
            return spec ?? {};
          },
          icon: "github",
          configForm: null,
          specsMapField: "github.0",
          rawSpecInput: true
        },
        {
          name: "ec2",
          label: "EC2",
          updateSpec: (value: Record<string, any>) => {
            onSubmit(value);
          },
          loadSpec: () => {
            return spec ?? {};
          },
          icon: "ec2",
          configForm: null,
          specsMapField: "ec2.0",
          rawSpecInput: true
        },
        {
          name: "ldap",
          label: "LDAP",
          updateSpec: (value: Record<string, any>) => {
            onSubmit(value);
          },
          loadSpec: () => {
            return spec ?? {};
          },
          icon: "ldap",
          configForm: null,
          specsMapField: "ldap.0",
          rawSpecInput: true
        },
        {
          name: "pod",
          label: "Pod",
          updateSpec: (value: Record<string, any>) => {
            onSubmit(value);
          },
          loadSpec: () => {
            return spec ?? {};
          },
          icon: "pod",
          configForm: null,
          specsMapField: "pod.0",
          rawSpecInput: true
        },
        {
          name: "exec",
          label: "Exec",
          updateSpec: (value: Record<string, any>) => {
            onSubmit(value);
          },
          loadSpec: () => {
            return spec ?? {};
          },
          icon: "console",
          configForm: null,
          specsMapField: "exec.0",
          rawSpecInput: true
        },
        {
          name: "alertManager",
          label: "Alert Manager",
          updateSpec: (value: Record<string, any>) => {
            onSubmit(value);
          },
          loadSpec: () => {
            return spec ?? {};
          },
          icon: "alertManager",
          configForm: null,
          specsMapField: "alertManager.0",
          rawSpecInput: true
        },
        {
          name: "cloudwatch",
          label: "Cloud Watch",
          updateSpec: (value: Record<string, any>) => {
            onSubmit(value);
          },
          loadSpec: () => {
            return spec ?? {};
          },
          icon: "cloudwatch",
          configForm: null,
          specsMapField: "cloudwatch.0",
          rawSpecInput: true
        },
        {
          name: "elasticsearch",
          label: "Elastic Search",
          updateSpec: (value: Record<string, any>) => {
            onSubmit(value);
          },
          loadSpec: () => {
            return spec ?? {};
          },
          icon: "elasticsearch",
          configForm: null,
          specsMapField: "elasticsearch.0",
          rawSpecInput: true
        },
        {
          name: "redis",
          label: "Redis",
          updateSpec: (value: Record<string, any>) => {
            onSubmit(value);
          },
          loadSpec: () => {
            return spec ?? {};
          },
          icon: "redis",
          configForm: null,
          specsMapField: "redis.0",
          rawSpecInput: true
        },
        {
          name: "mongo",
          label: "Mongo DB",
          updateSpec: (value: Record<string, any>) => {
            onSubmit(value);
          },
          loadSpec: () => {
            return spec ?? {};
          },
          icon: "mongo",
          configForm: null,
          specsMapField: "mongo.0",
          rawSpecInput: true
        },
        {
          name: "dns",
          label: "DNS",
          updateSpec: (value: Record<string, any>) => {
            onSubmit(value);
          },
          loadSpec: () => {
            return spec ?? {};
          },
          icon: "dns",
          configForm: null,
          specsMapField: "dns.0",
          rawSpecInput: true
        },
        {
          name: "ping",
          label: "ICMP Ping",
          updateSpec: (value: Record<string, any>) => {
            onSubmit(value);
          },
          loadSpec: () => {
            return spec ?? {};
          },
          icon: "icmp",
          configForm: null,
          specsMapField: "ping.0",
          rawSpecInput: true
        },
        {
          name: "gcs",
          label: "GCS",
          updateSpec: (value: Record<string, any>) => {
            onSubmit(value);
          },
          loadSpec: () => {
            return spec ?? {};
          },
          icon: "gcp",
          configForm: null,
          specsMapField: "gcs.0",
          rawSpecInput: true
        },
        {
          name: "s3",
          label: "AWS S3",
          updateSpec: (value: Record<string, any>) => {
            onSubmit(value);
          },
          loadSpec: () => {
            return spec ?? {};
          },
          icon: "aws-s3-bucket",
          configForm: null,
          specsMapField: "s3.0",
          rawSpecInput: true
        },
        {
          name: "smb",
          label: "SMB",
          updateSpec: (value: Record<string, any>) => {
            onSubmit(value);
          },
          loadSpec: () => {
            return spec ?? {};
          },
          icon: "smb",
          configForm: null,
          specsMapField: "smb.0",
          rawSpecInput: true
        },
        {
          name: "sftp",
          label: "SFTP",
          updateSpec: (value: Record<string, any>) => {
            onSubmit(value);
          },
          loadSpec: () => {
            return spec ?? {};
          },
          icon: "sftp",
          configForm: null,
          specsMapField: "sftp.0",
          rawSpecInput: true
        },
        {
          name: "folder",
          label: "Folder",
          updateSpec: (value: Record<string, any>) => {
            onSubmit(value);
          },
          loadSpec: () => {
            return spec ?? {};
          },
          icon: "folder",
          configForm: null,
          specsMapField: "folder.0",
          rawSpecInput: true
        },
        {
          name: "prometheus",
          label: "Prometheus",
          updateSpec: (value: Record<string, any>) => {
            onSubmit(value);
          },
          loadSpec: () => {
            return spec ?? {};
          },
          icon: "prometheus",
          configForm: null,
          specsMapField: "prometheus.0",
          rawSpecInput: true
        },
        {
          name: "kubernetes",
          label: "Kubernetes",
          updateSpec: (value: Record<string, any>) => {
            onSubmit(value);
          },
          loadSpec: () => {
            return spec ?? {};
          },
          icon: "kubernetes",
          configForm: null,
          specsMapField: "kubernetes.0",
          rawSpecInput: true
        },
        {
          name: "sql",
          label: "SQL Query",
          updateSpec: (value: Record<string, any>) => {
            onSubmit(value);
          },
          loadSpec: () => {
            return spec ?? {};
          },
          icon: "postgres",
          configForm: null,
          specsMapField: "sql.0",
          rawSpecInput: true
        },
        {
          name: "custom",
          label: "Custom",
          updateSpec: (value: Record<string, any>) => {
            onSubmit(value);
          },
          loadSpec: () => {
            return spec ?? {};
          },
          icon: FaCog,
          configForm: null,
          specsMapField: "spec",
          rawSpecInput: true,
          schemaFilePrefix: "canary"
        }
      ].sort((a, b) => a.label.localeCompare(b.label)) as SpecType[],
    [onSubmit, spec]
  );

  // there should only be one spec, so we can just grab the first key
  const selectedSpec = spec ? Object.keys(spec)[0] : undefined;

  return (
    <SpecEditor
      types={configTypes}
      format="yaml"
      selectedSpec={selectedSpec}
      resourceInfo={resourceInfo}
    />
  );
}
