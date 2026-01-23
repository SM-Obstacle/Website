import { css } from "../../../@shadow-panda/styled-system/css";
import { Input } from "@/components/ui/molecules/Input";
import RecordDatePicker from "./date-picker/RecordDatePicker";
import RecordTimePicker from "./time-picker/RecordTimePicker";
import FilterPanel, {
  inputStyle,
} from "@/components/ui/organisms/filter-panel/FilterPanel";

export default function RecordsFilter() {
  return (
    <FilterPanel
      action="/records"
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
            title: "Record",
            inputs: [
              {
                inputId: "beforeDate",
                label: "Before date",
                content: <RecordDatePicker name="beforeDate" />,
              },
              {
                inputId: "afterDate",
                label: "After date",
                content: <RecordDatePicker name="afterDate" />,
              },
              {
                inputId: "timeGt",
                label: "Time greater than",
                content: <RecordTimePicker name="timeGt" />,
              },
              {
                inputId: "timeLt",
                label: "Time lower than",
                content: <RecordTimePicker name="timeLt" />,
              },
            ],
          },
        ],
      }}
    />
  );
}
