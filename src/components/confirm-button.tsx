import {useEffect, useState} from "react";
import {Button} from "@/components/ui/button";

const CONFIRM_TIMEOUT_MS = 3000;

interface ConfirmButtonProps extends Omit<
  React.ComponentProps<typeof Button>,
  "onClick"
> {
  onConfirm: () => void;
  confirmLabel?: React.ReactNode;
}

export function ConfirmButton({
  onConfirm,
  confirmLabel = "confirm",
  children,
  variant,
  disabled,
  ...props
}: ConfirmButtonProps) {
  const [isConfirming, setIsConfirming] = useState(false);

  useEffect(() => {
    if (!isConfirming) {
      return;
    }

    const timeoutId = setTimeout(() => {
      setIsConfirming(false);
    }, CONFIRM_TIMEOUT_MS);

    return () => clearTimeout(timeoutId);
  }, [isConfirming]);

  if (isConfirming) {
    return (
      <Button
        {...props}
        variant="destructive"
        disabled={disabled}
        onClick={() => {
          setIsConfirming(false);
          onConfirm();
        }}
      >
        {confirmLabel}
      </Button>
    );
  }

  return (
    <Button
      {...props}
      variant={variant}
      disabled={disabled}
      onClick={() => setIsConfirming(true)}
    >
      {children}
    </Button>
  );
}
