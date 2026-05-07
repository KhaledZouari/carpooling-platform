import type { ReactNode } from "react";

type RequiredFieldLabelProps = {
  children: ReactNode;
  className?: string;
  required?: boolean;
};

export function RequiredFieldLabel({
  children,
  className = "",
  required = false,
}: RequiredFieldLabelProps) {
  return (
    <span
      className={`field-label inline-flex items-center ${className}`.trim()}
    >
      <span>{children}</span>
      {required ? (
        <span aria-hidden="true" className="ml-1 text-primary">
          *
        </span>
      ) : null}
    </span>
  );
}
