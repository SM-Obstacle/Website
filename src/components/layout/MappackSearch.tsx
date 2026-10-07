"use client";

import { CalendarSearch } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { searchMappack } from "@/lib/actions/mappack";

export default function MappackSearch({
  withLabel = false,
}: {
  withLabel?: boolean;
}) {
  const trigger = (
    <DialogTrigger asChild>
      <Button
        className={
          withLabel
            ? "flex w-full items-center justify-start gap-3 rounded-full bg-inherit px-4 py-3 text-lg text-foreground transition-colors hover:bg-accent hover:text-foreground"
            : "cursor-pointer bg-inherit text-foreground transition-colors hover:bg-transparent hover:text-primary"
        }
        size={withLabel ? "default" : "icon"}
      >
        <CalendarSearch
          className={
            withLabel ? "size-5" : "size-[calc(var(--logo-size)-1rem)]"
          }
        />
        {withLabel ? (
          "Search mappack"
        ) : (
          <span className="sr-only">Search mappack</span>
        )}
      </Button>
    </DialogTrigger>
  );

  return (
    <Dialog>
      {withLabel ? (
        trigger
      ) : (
        <Tooltip>
          <TooltipTrigger asChild>{trigger}</TooltipTrigger>
          <TooltipContent side="right">Search mappack</TooltipContent>
        </Tooltip>
      )}

      <DialogContent>
        <form action={searchMappack}>
          <div className="flex flex-col gap-2">
            <DialogHeader>
              <DialogTitle>Search mappack</DialogTitle>
              <DialogDescription>
                Search a mappack by its MX ID.
              </DialogDescription>
            </DialogHeader>

            <div className="flex flex-col gap-1">
              <Label htmlFor="mappack-search-mx-id">Mappack MX ID</Label>
              <Input
                type="number"
                id="mappack-search-mx-id"
                name="mappack-search-mx-id"
                placeholder="ex: 53"
              />
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit">Search</Button>
            </DialogFooter>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
