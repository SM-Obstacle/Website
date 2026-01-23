import { Input } from "@/components/ui/molecules/Input";
import FilterPanel, {
  inputStyle,
} from "@/components/ui/organisms/filter-panel/FilterPanel";
import { css } from "../../../@shadow-panda/styled-system/css";

export default function PlayersFilter() {
  return (
    <FilterPanel
      action="/players"
      content={{
        blocks: [
          {
            title: "Player",
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
