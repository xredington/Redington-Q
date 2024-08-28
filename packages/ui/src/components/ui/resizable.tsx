"use client";

import { DragHandleDots2Icon } from "@radix-ui/react-icons";
import * as ResizablePrimitive from "react-resizable-panels";
import React, { forwardRef, useImperativeHandle, useRef } from "react";
import { cn } from "../../lib/utils";

// Define a type for the imperative handle
interface ImperativePanelGroupHandle {
  setLayout: (sizes: number[]) => void;
  getId: () => string;
  getLayout: () => number[];
}

// Define the component's props with TypeScript support
type ResizablePanelGroupProps = React.ComponentProps<typeof ResizablePrimitive.PanelGroup> & {
  ref?: React.Ref<ImperativePanelGroupHandle | null>;
};

// Forward ref for ResizablePanelGroup with TypeScript support
const ResizablePanelGroup = forwardRef<ImperativePanelGroupHandle, ResizablePanelGroupProps>(
  (props, ref) => {
    const internalRef = useRef<ImperativePanelGroupHandle | null>(null);

    // Expose imperative methods in a type-safe way
    useImperativeHandle(ref, () => ({
      setLayout: (sizes: number[]) => {
        if (internalRef.current) {
          internalRef.current.setLayout(sizes);
        }
      },
      getId: () => {
        if (internalRef.current) {
          return internalRef.current.getId();
        }
        return ""; // Provide a default value or handle error appropriately
      },
      getLayout: () => {
        if (internalRef.current) {
          return internalRef.current.getLayout();
        }
        return []; // Provide a default value or handle error appropriately
      },
    }));

    return (
      <ResizablePrimitive.PanelGroup
        ref={internalRef}
        className={cn(
          "flex h-full w-full data-[panel-group-direction=vertical]:flex-col",
          props.className
        )}
        {...props}
      />
    );
  }
);

// Define ResizablePanel with default types
const ResizablePanel: React.FC<React.ComponentProps<typeof ResizablePrimitive.Panel>> = ResizablePrimitive.Panel;

// Define ResizableHandle with TypeScript support
type ResizableHandleProps = React.ComponentProps<typeof ResizablePrimitive.PanelResizeHandle> & {
  withHandle?: boolean;
};

const ResizableHandle: React.FC<ResizableHandleProps> = ({ withHandle, className, ...props }) => (
  <ResizablePrimitive.PanelResizeHandle
    className={cn(
      "relative flex w-px items-center justify-center bg-border after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1 data-[panel-group-direction=vertical]:h-px data-[panel-group-direction=vertical]:w-full data-[panel-group-direction=vertical]:after:left-0 data-[panel-group-direction=vertical]:after:h-1 data-[panel-group-direction=vertical]:after:w-full data-[panel-group-direction=vertical]:after:-translate-y-1/2 data-[panel-group-direction=vertical]:after:translate-x-0 [&[data-panel-group-direction=vertical]>div]:rotate-90",
      className
    )}
    {...props}
  >
    {withHandle && (
      <div className="z-10 flex h-4 w-3 items-center justify-center rounded-sm border bg-border">
        <DragHandleDots2Icon className="h-2.5 w-2.5" />
      </div>
    )}
  </ResizablePrimitive.PanelResizeHandle>
);

export { ResizablePanelGroup, ResizablePanel, ResizableHandle};
