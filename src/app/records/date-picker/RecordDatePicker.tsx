import { Button } from "@/components/ui/molecules/Button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/Popover";
import { CalendarIcon } from "lucide-react";
import { icon } from "../../../../@shadow-panda/styled-system/recipes";
import CalendarContent from "./CalendarContent";
import { DateFilterWrapper } from "./DateFilterWrapper";
import CurrentDateSpan from "./CurrentDateSpan";

export default function RecordDatePicker({ name }: { name: string }) {
  return (
    <DateFilterWrapper name={name}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            rounded="full"
            justifyContent="flex-start"
            textAlign="left"
            fontWeight="normal"
          >
            <CalendarIcon className={icon()} />
            <CurrentDateSpan />
          </Button>
        </PopoverTrigger>
        <PopoverContent w="auto" p="0" align="start">
          <CalendarContent />
        </PopoverContent>
      </Popover>
    </DateFilterWrapper>
  );
}
