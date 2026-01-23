import Form from "next/form";
import Block, { SubBlock } from "@/components/ui/organisms/Block";
import { Button } from "@/components/ui/molecules/Button";
import { H2, H3 } from "@/components/ui/atoms/typography";
import { css, Styles } from "../../../@shadow-panda/styled-system/css";
import NonOverwritingForm from "./NonOverwritingForm";
import { Input } from "@/components/ui/molecules/Input";
import { Label } from "@/components/ui/molecules/Label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/Popover";
import { CalendarIcon } from "lucide-react";
import { icon } from "../../../@shadow-panda/styled-system/recipes";
import { Calendar } from "@/components/ui/organisms/Calendar";
import RecordDatePicker from "./date-picker/RecordDatePicker";
import RecordTimePicker from "./time-picker/RecordTimePicker";

const inputStyle = {
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

export default function RecordsFilter() {
  return (
    <NonOverwritingForm action="/records" height={0}>
      <Block
        className={css({
          display: "flex",
          flexDir: "column",
          gap: "token(spacing.2)",
          height: "calc(token(sizes.logoSize) + token(spacing.2) * 2)",
          overflow: "hidden",
          lg: {
            height: "revert",
            overflow: "revert",
          },
        })}
        titleBar={
          <H2
            className={css({
              fontWeight: "extrabold",
              height: "calc(token(sizes.logoSize) / 1.5)",
            })}
          >
            Filters
          </H2>
        }
      >
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
              maxHeight:
                "calc(100vh - token(sizes.logoSize) * 2.5 - token(spacing.2) * 10)",
            })}
          >
            <div
              className={css({
                display: "flex",
                flexDir: "column",
                gap: "token(spacing.2)",
              })}
            >
              {/* Player filter */}
              <FilterBlock title="Player">
                <FilterInput id="playerLogin" label="Login">
                  <Input
                    type="text"
                    id="playerLogin"
                    name="playerLogin"
                    className={css(inputStyle)}
                  />
                </FilterInput>
                <FilterInput id="playerName" label="Name">
                  <Input
                    type="text"
                    id="playerName"
                    name="playerName"
                    className={css(inputStyle)}
                  />
                </FilterInput>
              </FilterBlock>

              {/* Map filter */}
              <FilterBlock title="Map">
                <FilterInput id="mapUid" label="Map UID">
                  <Input
                    type="text"
                    id="mapUid"
                    name="mapUid"
                    className={css(inputStyle)}
                  />
                </FilterInput>
                <FilterInput id="mapName" label="Name">
                  <Input
                    type="text"
                    id="mapName"
                    name="mapName"
                    className={css(inputStyle)}
                  />
                </FilterInput>
              </FilterBlock>

              {/* Record filter */}
              <FilterBlock title="Record">
                <FilterInput id="beforeDate" label="Before date">
                  <RecordDatePicker name="beforeDate" />
                </FilterInput>
                <FilterInput id="afterDate" label="After date">
                  <RecordDatePicker name="afterDate" />
                </FilterInput>
                <FilterInput id="timeGt" label="Time greater than">
                  <RecordTimePicker name="timeGt" />
                </FilterInput>
                <FilterInput id="timeLt" label="Time lower than">
                  <RecordTimePicker name="timeLt" />
                </FilterInput>
              </FilterBlock>
            </div>
          </div>
          <SubmitButton />
        </div>
      </Block>
    </NonOverwritingForm>
  );
}
