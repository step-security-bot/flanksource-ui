import { useContext } from "react";
import { AuthContext } from "../../../../../context";
import { JSONViewer } from "../../../../JSONViewer";
import { CreateIntegrationOption } from "../AddIntegrationOptionsList";
import { HelmChartValues } from "./InstallationInstructions";

type Props = {
  name: string;
  helmChartValues: HelmChartValues;
  selectedOption: CreateIntegrationOption;
};

export default function FluxAddIntegrationCommand({
  name,
  helmChartValues,
  selectedOption
}: Props) {
  const { backendUrl } = useContext(AuthContext);

  const yaml = `apiVersion: v1
kind: Namespace
metadata:
  name:  mission-control
---
apiVersion: source.toolkit.fluxcd.io/v1beta1
kind: HelmRepository
metadata:
  name: flanksource
  namespace: mission-control
spec:
  interval: 5m0s
  url: https://flanksource.github.io/charts
---
apiVersion: helm.toolkit.fluxcd.io/v2beta1
kind: HelmRelease
metadata:
  name: mission-control
  namespace: mission-control
spec:
  chart:
    spec:
      chart: ${helmChartValues.name}
      sourceRef:
        kind: HelmRepository
        name: flanksource
        namespace: mission-control
      interval: 1m
  ${
    selectedOption !== "Kubernetes"
      ? `
  values:
    upstream:
      createSecret: true
      host:  ${backendUrl}
      username: <username>
      password: <password>
`
      : undefined
  }
---
apiVersion: helm.toolkit.fluxcd.io/v2beta1
kind: HelmRelease
metadata:
  name: mission-control-kubernetes
  namespace: mission-control
spec:
  chart:
    spec:
      chart: mission-control-kubernetes
      sourceRef:
        kind: HelmRepository
        name: flanksource
        namespace: mission-control
  values:
    clusterName: ${name}
    interval: <interval>
  `;

  return (
    <div className="flex flex-col flex-1 p-4 gap-4 overflow-y-auto">
      <JSONViewer code={yaml} format="yaml" showLineNo />
    </div>
  );
}
