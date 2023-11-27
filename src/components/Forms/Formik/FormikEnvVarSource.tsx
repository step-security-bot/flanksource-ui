import { useField } from "formik";
import { useEffect, useState } from "react";
import { Switch } from "../../Switch";
import FormikEnvVarK8SView from "./utils/FormikEnvVarK8SView";
import FormikEnvVarStaticView from "./utils/FormikEnvVarStaticView";

export type FormikEnvVarSourceProps = React.HTMLProps<
  HTMLInputElement | HTMLTextAreaElement
> & {
  variant?: "small" | "large";
  hint?: string;
};

export type EnvVarSourceType = "Static" | "Secret" | "ConfigMap";

export const configmapValueRegex = /^configmap:\/\/(.+)?\/(.+)?/;
export const secretValueRegex = /^secret:\/\/(.+)?\/(.+)?/;

export function FormikEnvVarSource({
  className,
  variant = "small",
  name,
  label,
  hint,
  disabled,
  readOnly,
  required,
  ...props
}: FormikEnvVarSourceProps) {
  const [type, setType] = useState<EnvVarSourceType>("Static");
  const prefix = `${name}.${type === "ConfigMap" ? "configmap" : "secret"}`;
  const [data, setData] = useState({
    static: "",
    name: "",
    key: ""
  });
  const [field, meta] = useField({
    name: name!,
    type: "text",
    required,
    validate: (value) => {
      if (required && !value) {
        return "This field is required";
      }
    }
  });

  useEffect(() => {
    const value = getValue();
    if (field.value !== value) {
      field.onChange({
        target: {
          name,
          value
        }
      });
    }
  }, [data]);

  useEffect(() => {
    if (field.value === getValue()) {
      return;
    }
    let value = field.value?.match(configmapValueRegex);
    value = value || field.value?.match(secretValueRegex);
    if (value?.length === 3 && field.value?.includes("configmap")) {
      setData({
        static: "",
        key: value[2],
        name: value[1]
      });
      setType("ConfigMap");
      return;
    }
    if (value?.length === 3 && field.value?.includes("secret")) {
      setData({
        static: "",
        key: value[2],
        name: value[1]
      });
      setType("Secret");
      return;
    }
    setData({
      static: field.value,
      key: "",
      name: ""
    });
    setType("Static");
  }, []);

  const getValue = () => {
    let value = "";
    if (type === "Static") {
      value = data.static;
    }
    if (type === "Secret" && data.name && data.key) {
      value = `secret://${data.name}/${data.key}`;
    }
    if (type === "ConfigMap" && data.name && data.key) {
      value = `configmap://${data.name}/${data.key}`;
    }
    return value;
  };

  return (
    <div className="flex flex-col space-y-2">
      <label className="font-semibold text-sm">{label}</label>
      <div className="flex flex-col space-y-2">
        <Switch
          options={["Static", "Secret", "ConfigMap"]}
          defaultValue={"None"}
          value={type}
          onChange={(v) => {
            if (readOnly || disabled) {
              return;
            }
            setData({
              static: "",
              key: "",
              name: ""
            });
            setType(v as EnvVarSourceType);
          }}
          className="w-[24rem]"
        />
        <div className="w-full">
          {type === "Static" ? (
            <FormikEnvVarStaticView
              name="name"
              variant="small"
              disabled={disabled}
              readOnly={readOnly}
              data={data}
              setData={setData}
            />
          ) : (
            <FormikEnvVarK8SView
              prefix={prefix}
              data={data}
              setData={setData}
            />
          )}
          {meta.touched && meta.error ? (
            <p className="text-sm text-red-500 w-full py-1">{meta.error}</p>
          ) : null}
        </div>
      </div>
      {hint && <p className="text-sm text-gray-500 py-1">{hint}</p>}
    </div>
  );
}
