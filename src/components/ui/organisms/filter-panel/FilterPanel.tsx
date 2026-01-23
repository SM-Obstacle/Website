import NonOverwritingForm from "@/components/NonOverwritingForm";
import { ExpanderWrapper } from "./ExpanderContext";
import FiltersWrapper from "./FiltersWrapper";
import { css, Styles } from "../../../../../@shadow-panda/styled-system/css";
import { SubBlock } from "../Block";
import { H3 } from "../../atoms/typography";
import { Button } from "../../molecules/Button";

export const inputStyle = {
  rounded: "full",
  mt: "token(spacing.1)",
} satisfies Styles;

function FilterInput({
  label,
  id,
  children,
}: React.PropsWithChildren<{
  label: string;
  id: string;
}>) {
  return (
    <div
      className={css({
        display: "flex",
        flexDir: "column",
        gap: "token(spacing.1)",
      })}
    >
      <label htmlFor={id}>{label}</label>
      {children}
    </div>
  );
}

function FilterBlock({
  title,
  children,
}: React.PropsWithChildren<{ title: string }>) {
  return (
    <SubBlock flexShrink={0}>
      <div
        className={css({
          display: "flex",
          flexDir: "column",
          gap: "token(spacing.1)",
          padding: "token(spacing.1)",
        })}
      >
        <H3
          className={css({
            ms: "token(spacing.2)",
            me: "token(spacing.2)",
            fontWeight: "bold",
          })}
        >
          {title}
        </H3>
        <div
          className={css({
            margin: "token(spacing.1)",
          })}
        >
          {children}
        </div>
      </div>
    </SubBlock>
  );
}

function SubmitButton() {
  return (
    <Button
      className={css({
        rounded: "full",
        bg: "black",
        color: "white",
        minH: "token(sizes.logoSize)",
        border: "solid transparent 1px",
        transition: "background-color .1s, border-color .1s",
        _hover: {
          bgColor: "#111",
          borderColor: "#333",
        },
        _active: {
          borderColor: "white",
        },
      })}
      type="submit"
    >
      Filter
    </Button>
  );
}

export interface FilterInputContent {
  inputId: string;
  label: string;
  content: React.ReactNode;
}

export interface FilterBlockContent {
  title: string;
  inputs: FilterInputContent[];
}

export interface FilterContent {
  blocks: FilterBlockContent[];
}

export default function FilterPanel({
  action,
  content,
}: {
  action: string;
  content: FilterContent;
}) {
  return (
    <ExpanderWrapper>
      <NonOverwritingForm action={action} height={0}>
        <FiltersWrapper>
          <div
            className={css({
              display: "flex",
              flexDir: "column",
              justifyContent: "space-between",
              gap: "token(spacing.2)",
            })}
          >
            <div
              className={css({
                overflowY: "scroll",
                rounded: "calc(token(sizes.logoSize) / 2)",
                maxHeight:
                  "calc(100vh - token(sizes.logoSize) * 2.5 - token(spacing.2) * 10)",
                "[data-expanded] &": {
                  maxHeight:
                    "calc(100vh - token(sizes.logoSize) * 2.5 - token(spacing.2) * 12)",
                },
              })}
            >
              <div
                className={css({
                  display: "flex",
                  flexDir: "column",
                  gap: "token(spacing.2)",
                })}
              >
                {content.blocks.map((block, i) => (
                  <FilterBlock title={block.title} key={`filterBlock${i}`}>
                    {block.inputs.map((input, j) => (
                      <FilterInput
                        id={input.inputId}
                        label={input.label}
                        key={`filterInput${i}_${j}`}
                      >
                        {input.content}
                      </FilterInput>
                    ))}
                  </FilterBlock>
                ))}
              </div>
            </div>
            <SubmitButton />
          </div>
        </FiltersWrapper>
      </NonOverwritingForm>
    </ExpanderWrapper>
  );
}
