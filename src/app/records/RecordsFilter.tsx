import Form from "next/form";
import Block, { SubBlock } from "@/components/ui/organisms/Block";
import { Button } from "@/components/ui/molecules/Button";
import { H2, H3 } from "@/components/ui/atoms/typography";
import { css } from "../../../@shadow-panda/styled-system/css";
import NonOverwritingForm from "./NonOverwritingForm";
import { Input } from "@/components/ui/molecules/Input";
import { Label } from "@/components/ui/molecules/Label";
import RecordDatePicker from "./RecordDatePicker";

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
      <Label htmlFor={id}>{label}</Label>
      {children}
    </div>
  );
}

function FilterBlock({
  title,
  children,
}: React.PropsWithChildren<{ title: string }>) {
  return (
    <SubBlock>
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

export default function RecordsFilter() {
  return (
    <NonOverwritingForm action="/records">
      <Block
        className={css({
          display: "flex",
          flexDir: "column",
          gap: 3,
        })}
        titleBar={
          <H2
            className={css({
              fontWeight: "extrabold",
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
            gap: 3,
            overflowY: "scroll",
          })}
        >
          {/* Player filter */}
          <FilterBlock title="Player">
            <FilterInput id="playerLogin" label="Login">
              <Input type="text" id="playerLogin" name="playerLogin" />
            </FilterInput>
            <FilterInput id="playerName" label="Name">
              <Input type="text" id="playerName" name="playerName" />
            </FilterInput>
          </FilterBlock>

          {/* Map filter */}
          <FilterBlock title="Map">
            <FilterInput id="mapUid" label="Map UID">
              <Input type="text" id="mapUid" name="mapUid" />
            </FilterInput>
            <FilterInput id="mapName" label="Name">
              <Input type="text" id="mapName" name="mapName" />
            </FilterInput>
          </FilterBlock>

          {/* Record filter */}
          <FilterBlock title="Record">
            <FilterInput id="beforeDate" label="Before date">
              <RecordDatePicker name="beforeDate" />
            </FilterInput>
            <p>After date</p>
            <p>Time greater than</p>
            <p>Time lower than</p>
          </FilterBlock>
        </div>
        <Button type="submit" rounded="full">
          Filter
        </Button>
      </Block>
    </NonOverwritingForm>
  );
}
