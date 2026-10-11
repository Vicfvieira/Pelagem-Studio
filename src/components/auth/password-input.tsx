"use client";

import { useState, type ComponentProps } from "react";
import { Eye, EyeOff } from "lucide-react";

import { Input } from "@/components/ui/input";

/** Campo de senha com botão de mostrar/ocultar acessível. */
export function PasswordInput(props: Omit<ComponentProps<"input">, "type">) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <Input {...props} type={visible ? "text" : "password"} className="pr-14" />
      <button
        type="button"
        onClick={() => setVisible((value) => !value)}
        aria-pressed={visible}
        aria-label={visible ? "Ocultar senha" : "Mostrar senha"}
        className="absolute inset-y-1 right-1 grid w-11 place-items-center rounded-xl text-muted-foreground outline-none hover:bg-accent focus-visible:ring-[3px] focus-visible:ring-ring/60"
      >
        {visible ? <EyeOff className="size-5" aria-hidden="true" /> : <Eye className="size-5" aria-hidden="true" />}
      </button>
    </div>
  );
}
