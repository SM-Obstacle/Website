import { Input } from "@/components/ui/molecules/Input";
import FilterPanel, {
  inputStyle,
} from "@/components/ui/organisms/filter-panel/FilterPanel";
import { css } from "../../../@shadow-panda/styled-system/css";

export default function MapsFilter() {
  return (
    <FilterPanel
      action="/maps"
      content={{
        blocks: [
          {
            title: "Map",
            inputs: [
              {
                inputId: "mapUid",
                label: "Map UID",
                content: (
                  <Input
                    type="text"
                    id="mapUid"
                    name="mapUid"
                    className={css(inputStyle)}
                  />
                ),
              },
              {
                inputId: "mapName",
                label: "Name",
                content: (
                  <Input
                    type="text"
                    id="mapName"
                    name="mapName"
                    className={css(inputStyle)}
                  />
                ),
              },
            ],
          },
          {
            title: "Author",
            inputs: [
              {
                inputId: "playerLogin",
                label: "Login",
                content: (
                  <Input
                    type="text"
                    id="playerLogin"
                    name="playerLogin"
                    className={css(inputStyle)}
                  />
                ),
              },
              {
                inputId: "playerName",
                label: "Name",
                content: (
                  <Input
                    type="text"
                    id="playerName"
                    name="playerName"
                    className={css(inputStyle)}
                  />
                ),
              },
            ],
          },
        ],
      }}
    />
  );
}
