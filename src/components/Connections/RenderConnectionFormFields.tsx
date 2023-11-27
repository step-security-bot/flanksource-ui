import FormikCheckbox from "../Forms/Formik/FormikCheckbox";
import { FormikCompactEnvVarSource } from "../Forms/Formik/FormikCompactEnvVarSource";
import { FormikEnvVarSource } from "../Forms/Formik/FormikEnvVarSource";
import FormikTextInput from "../Forms/Formik/FormikTextInput";
import FormikConnectionOptionsSwitchField from "./FormikConnectionOptionsSwitchField";
import { ConnectionFormFields } from "./connectionTypes";

interface FieldViewProps {
  field: ConnectionFormFields;
}

export default function RenderConnectionFormFields({ field }: FieldViewProps) {
  const type = field.type ?? "input";
  switch (type) {
    case "input":
      return (
        <FormikTextInput
          name={field.key}
          label={field.label}
          required={field.required}
          hint={field.hint}
          defaultValue={field.default?.toString()}
        />
      );
    case "numberInput":
      return (
        <FormikTextInput
          type="number"
          name={field.key}
          label={field.label}
          required={field.required}
          hint={field.hint}
          defaultValue={field.default?.toString()}
        />
      );
    case "checkbox":
      return (
        <FormikCheckbox
          name={field.key}
          label={field.label}
          labelClassName="text-sm font-semibold text-gray-700"
          required={field.required}
          hint={field.hint}
        />
      );
    case "EnvVarSource":
      return (
        <FormikEnvVarSource
          name={field.key}
          label={field.hideLabel ? undefined : field.label}
          variant={field.variant}
          hint={field.hint}
          required={field.required}
        />
      );
    case "switch":
      return <FormikConnectionOptionsSwitchField field={field} />;

    case "authentication":
      return (
        <FormikCompactEnvVarSource
          name={field.key}
          label={field.hideLabel ? undefined : field.label}
          variant={field.variant}
          hint={field.hint}
          required={field.required}
        />
      );
    default:
      return null;
  }
}
