import Form from "next/form";
import Block, { SubBlock } from "@/components/ui/Block";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { H2, H3 } from "@/components/ui/typography";
import { css } from "../../../@shadow-panda/styled-system/css";

function FilterInput({
  label,
  inputType,
  id,
}: {
  label: string;
  inputType: React.ComponentProps<typeof Input>["type"];
  id: string;
}) {
  return (
    <div
      className={css({
        display: "flex",
        flexDir: "column",
        gap: "token(spacing.1)",
      })}
    >
      <Label htmlFor={id}>{label}</Label>
      <Input type={inputType} id={id} name={id} />
    </div>
  );
}

export default function RecordsFilter() {
  return (
    <Block
      className={css({
        height: "fit-content",
      })}
      titleBar={<H2>Filters</H2>}
    >
      <Form action="/records">
        <div
          className={css({
            display: "flex",
            flexDir: "column",
            gap: 3,
          })}
        >
          {/* Player filter */}
          <SubBlock>
            <div
              className={css({
                display: "flex",
                flexDir: "column",
                gap: 1,
              })}
            >
              <H3>Player</H3>
              <FilterInput id="playerLogin" inputType="text" label="Login" />
              <FilterInput id="playerName" inputType="text" label="Name" />
            </div>
          </SubBlock>

          {/* Map filter */}
          <SubBlock>
            <div
              className={css({
                display: "flex",
                flexDir: "column",
                gap: 1,
              })}
            >
              <H3>Map</H3>
              <FilterInput id="mapUid" inputType="text" label="Map UID" />
              <FilterInput id="mapName" inputType="text" label="Name" />
            </div>
          </SubBlock>

          {/* Record filter */}
          <SubBlock>
            <div
              className={css({
                display: "flex",
                flexDir: "column",
                gap: 1,
              })}
            >
              <H3>Record</H3>
              <p>Before date</p>
              <p>After date</p>
              <p>Time greater than</p>
              <p>Time lower than</p>
            </div>
          </SubBlock>

          <Button type="submit" rounded="full">
            Filter
          </Button>
        </div>
      </Form>
    </Block>
  );
}
