import { useField, useFormikContext } from "formik";
import { isEmpty } from "lodash";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import YAML from "yaml";
import useDebounce from "../../../hooks/useDebounce";

const CodeEditor = dynamic(
  () => import("../../CodeEditor").then((m) => m.CodeEditor),
  {
    ssr: false
  }
);

type FormikCodeEditorProps = {
  format?: string;
  fieldName: string;
  className?: string;
  schemaFilePrefix?: "component" | "canary" | "system" | "scrape_config";
  labelClassName?: string;
  label?: string;
  disabled?: boolean;
  required?: boolean;
};

export function FormikCodeEditor({
  format = "yaml",
  fieldName,
  schemaFilePrefix,
  label,
  labelClassName,
  disabled,
  className = "flex flex-col h-[min(1000px,calc(90vh))]",
  required = false
}: FormikCodeEditorProps) {
  const { setFieldValue } = useFormikContext<Record<string, any>>();

  const [field] = useField({
    name: fieldName,
    type: "text",
    required,
    validate: (value) => {
      if (required && !value) {
        return "This field is required";
      }
    }
  });

  const { value: specFormValue } = field;

  // we want to debounce the code editor value so that we can avoid the code
  // editor jumping around when the user is typing
  const [codeEditorValue, setCodeEditorValue] = useState<string | undefined>();

  // we want to set the value of the formik field to the internal state of the
  // code editor, so that we can avoid the code editor jumping around when the
  // user is typing
  useEffect(() => {
    // only do this if the specFormValue is not empty and the codeEditorValue
    // is undefined
    if (!isEmpty(specFormValue) && codeEditorValue === undefined) {
      if (format === "yaml" || format === "json") {
        const value =
          format === "yaml"
            ? YAML.stringify(specFormValue, {
                sortMapEntries: true
              })
            : JSON.stringify(specFormValue, null, 2);
        setCodeEditorValue(value);
        // if format is not yaml or json, we just set the value to the
        // specFormValue, without any formatting
      } else {
        setCodeEditorValue(specFormValue);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [specFormValue]);

  const debouncedValues = useDebounce(codeEditorValue, 300);

  // here, we format the internal state of the code editor value and set the
  // formik field value to it, we want to do this so that we can avoid the code
  // editor jumping around when the user is typing, due to formatting
  useEffect(() => {
    try {
      if (format === "yaml" || format === "json") {
        if (debouncedValues) {
          setFieldValue(
            fieldName,
            format === "yaml"
              ? YAML.parse(debouncedValues)
              : JSON.parse(debouncedValues)
          );
        } else {
          setFieldValue(fieldName, undefined);
        }
      } else {
        setFieldValue(fieldName, debouncedValues);
      }
    } catch (e) {
      // do nothing, we don't want to set the values if the user is typing
    }
  }, [debouncedValues, fieldName, format, setFieldValue]);

  return (
    <div className={className}>
      {label && (
        <label className={`form-label ${labelClassName}`}>{label}</label>
      )}
      <CodeEditor
        onChange={(v) => {
          if (v) {
            setCodeEditorValue(v);
          } else {
            setCodeEditorValue(undefined);
            // if the value is empty, we want to set to undefined
            setFieldValue(fieldName, undefined);
          }
        }}
        value={codeEditorValue}
        language={format}
        schemaFilePrefix={schemaFilePrefix}
        readOnly={disabled}
      />
    </div>
  );
}
