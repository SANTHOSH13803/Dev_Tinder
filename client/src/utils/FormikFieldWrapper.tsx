import { Field } from "formik";
import { FieldLabel } from "@/components/ui/field";

type FormikFieldWrapperProps = {
  name: string;
  label: string;
  component: React.ElementType;
  [key: string]: any;
};

const FormikFieldWrapper = ({
  name,
  label,
  component: Component,
  ...props
}: FormikFieldWrapperProps) => {
  return (
    <Field name={name}>
      {({ field, meta }: any) => (
        <div>
          <FieldLabel htmlFor={name}>{label}</FieldLabel>

          <Component id={name} {...field} {...props} />

          {meta.touched && meta.error && (
            <p className="mt-1 text-sm text-red-500">{meta.error}</p>
          )}
        </div>
      )}
    </Field>
  );
};

export default FormikFieldWrapper;
