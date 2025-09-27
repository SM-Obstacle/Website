import type React from "react";
import { styled } from "../../styled-system/jsx";
import type {
  JsxFactoryOptions,
  JsxRecipeProps,
  RecipeDefinition,
  RecipeSelection,
  RecipeVariantRecord,
} from "../../styled-system/types";

type Options<
  T extends React.ElementType,
  P extends RecipeVariantRecord,
> = JsxFactoryOptions<JsxRecipeProps<T, RecipeSelection<P>>>;

export function withClass<
  Target extends React.ElementType,
  P extends RecipeVariantRecord,
>(
  newClassName: string,
  element: Target,
  recipe: RecipeDefinition<P>,
  options?: Options<Target, P>,
) {
  const oldClassName = options?.defaultProps?.className;
  return styled(element, recipe, {
    ...options,
    defaultProps: {
      ...options?.defaultProps,
      className: oldClassName
        ? `${oldClassName} ${newClassName}`
        : newClassName,
    },
  } as Options<Target, P>);
}
