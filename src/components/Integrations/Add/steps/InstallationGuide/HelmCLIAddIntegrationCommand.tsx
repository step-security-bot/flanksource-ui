import CodeBlock from "../../../../CodeBlock/CodeBlock";
import { HelmChartValues } from "./InstallationInstructions";

type Props = {
  name: string;
  chartValues: HelmChartValues;
};

export default function HelmCLIAddIntegrationCommand({
  chartValues,
  name
}: Props) {
  return (
    <CodeBlock
      className="flex flex-col flex-1 text-sm text-left gap-2 bg-white text-black rounded-lg p-4 pl-6"
      code={`helm repo add flanksource https://flanksource.github.io/charts
                    
helm install ${name} ${chartValues.name} --version ${chartValues?.version}                  
`}
    />
  );
}
