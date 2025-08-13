import * as React from "react";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";

export const DropdownMenu = DropdownMenuPrimitive.Root;
export const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;

export const DropdownMenuContent = React.forwardRef(
  ({ className = "", ...props }, ref) => (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content
        ref={ref}
        className={`z-[9999] min-w-[8rem] overflow-hidden rounded-xl border border-white/20 bg-black/95 backdrop-blur-lg p-2 text-white shadow-2xl shadow-black/50 animate-in fade-in-0 slide-in-from-top-2 ${className}`}
        sideOffset={8}
        alignOffset={-4}
        {...props}
      />
    </DropdownMenuPrimitive.Portal>
  )
);
DropdownMenuContent.displayName = "DropdownMenuContent";

export const DropdownMenuItem = React.forwardRef(
  ({ className = "", ...props }, ref) => (
    <DropdownMenuPrimitive.Item
      ref={ref}
      className={`cursor-pointer select-none rounded-lg px-3 py-2.5 text-sm text-white outline-none transition-all duration-200 hover:bg-white/10 focus:bg-white/10 active:bg-white/20 active:scale-95 z-[9999] flex items-center gap-2 ${className}`}
      {...props}
    />
  )
);
DropdownMenuItem.displayName = "DropdownMenuItem";

export const DropdownMenuSeparator = React.forwardRef(
  ({ className = "", ...props }, ref) => (
    <DropdownMenuPrimitive.Separator
      ref={ref}
      className={`-mx-1 my-2 h-px bg-white/20 ${className}`}
      {...props}
    />
  )
);
DropdownMenuSeparator.displayName = "DropdownMenuSeparator";