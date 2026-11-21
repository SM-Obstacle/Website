import { PropsWithChildren, ReactNode } from "react";
import { Panel, SubPanel } from "./Panel";

export default function LoadErrorPanel({
  title,
  children,
}: PropsWithChildren<{ title?: ReactNode }>) {
  return (
    <Panel className="mx-auto w-full max-w-content h-full">
      <SubPanel className="w-full h-full p-8 flex items-center justify-center">
        <div className="font-bold text-lg">
          {title && <h1 className="text-2xl font-black mb-3">{title}</h1>}
          {children}
        </div>
      </SubPanel>
    </Panel>
  );
}
