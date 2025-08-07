import * as React from "react";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";

export const DropdownMenu = DropdownMenuPrimitive.Root;
export const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;

export const DropdownMenuContent = React.forwardRef(
  ({ className = "", ...props }, ref) => (
    <DropdownMenuPrimitive.Content
      ref={ref}
      className={`z-50 min-w-[8rem] overflow-hidden rounded-md border border-gray-200 bg-white p-1 text-black shadow-md animate-in fade-in-0 slide-in-from-top-2 ${className}`}
      {...props}
    />
  )
);
DropdownMenuContent.displayName = "DropdownMenuContent";

export const DropdownMenuItem = React.forwardRef(
  ({ className = "", ...props }, ref) => (
    <DropdownMenuPrimitive.Item
      ref={ref}
      className={`cursor-default select-none rounded-sm px-2 py-1.5 text-sm text-gray-700 outline-none transition-colors hover:bg-gray-100 focus:bg-gray-100 z-50 ${className}`}
      {...props}
    />
  )
);
DropdownMenuItem.displayName = "DropdownMenuItem";

export const DropdownMenuSeparator = React.forwardRef(
  ({ className = "", ...props }, ref) => (
    <DropdownMenuPrimitive.Separator
      ref={ref}
      className={`-mx-1 my-1 h-px bg-gray-200 ${className}`}
      {...props}
    />
  )
);
DropdownMenuSeparator.displayName = "DropdownMenuSeparator";
