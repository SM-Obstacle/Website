import { Slot } from "@radix-ui/react-slot";
import type { Ref } from "react";
import {
  type HTMLStyledProps,
  styled,
} from "@/../@shadow-panda/styled-system/jsx";
import { button } from "../../../@shadow-panda/styled-system/recipes";

function BaseButton({
  asChild = false,
  ref,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  asChild?: boolean;
  ref?: Ref<HTMLButtonElement>;
}) {
  const Comp = asChild ? Slot : "button";
  return <Comp {...props} />;
}

export const Button = styled(BaseButton, button);
export type ButtonProps = HTMLStyledProps<typeof Button>;
