import { useId, type ReactElement, type ReactNode } from "react";
import { cloneElement } from "react";

type FieldControlProps = {
  id?: string;
  "aria-invalid"?: boolean;
  "aria-describedby"?: string;
};

type FormFieldProps = {
  label: string;
  error?: string;
  hint?: ReactNode;
  children: ReactElement<FieldControlProps>;
};

/** Liga rótulo, dica e erro ao controle via id, aria-invalid e aria-describedby. */
export function FormField({ label, error, hint, children }: FormFieldProps) {
  const id = useId();
  const hintId = hint ? `${id}-dica` : undefined;
  const errorId = error ? `${id}-erro` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-bold">
        {label}
      </label>
      {cloneElement(children, { id, "aria-invalid": Boolean(error), "aria-describedby": describedBy })}
      {hint && (
        <p id={hintId} className="text-xs text-muted-foreground">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} className="text-sm font-semibold text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
