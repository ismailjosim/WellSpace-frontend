"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface AccordionContextValue {
  openItems: string[];
  toggleItem: (value: string) => void;
}

const AccordionContext = React.createContext<AccordionContextValue>({
  openItems: [],
  toggleItem: () => {},
});

const ItemContext = React.createContext<{ itemValue: string }>({
  itemValue: "",
});

export function Accordion({
  children,
  type = "single",
  collapsible = true,
  className,
}: {
  children: React.ReactNode;
  type?: "single" | "multiple";
  collapsible?: boolean;
  className?: string;
}) {
  const [openItems, setOpenItems] = React.useState<string[]>([]);

  const toggleItem = (val: string) => {
    setOpenItems((prev) => {
      if (prev.includes(val)) {
        return collapsible ? prev.filter((i) => i !== val) : prev;
      }
      return type === "single" ? [val] : [...prev, val];
    });
  };

  return (
    <AccordionContext.Provider value={{ openItems, toggleItem }}>
      <div className={cn("divide-y divide-border border-y", className)}>
        {children}
      </div>
    </AccordionContext.Provider>
  );
}

export function AccordionItem({
  value,
  children,
  className,
}: {
  value: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <ItemContext.Provider value={{ itemValue: value }}>
      <div className={cn("py-1", className)} data-value={value}>
        {children}
      </div>
    </ItemContext.Provider>
  );
}

export function AccordionTrigger({
  children,
  className,
  itemValue: propItemValue,
}: {
  children: React.ReactNode;
  className?: string;
  itemValue?: string;
}) {
  const { openItems, toggleItem } = React.useContext(AccordionContext);
  const { itemValue: contextItemValue } = React.useContext(ItemContext);
  const targetValue = propItemValue || contextItemValue;
  const isOpen = targetValue ? openItems.includes(targetValue) : false;

  return (
    <button
      type="button"
      onClick={() => targetValue && toggleItem(targetValue)}
      className={cn(
        "flex w-full items-center justify-between py-4 text-left font-medium transition-all hover:text-primary",
        className,
      )}
    >
      <span>{children}</span>
      <ChevronDown
        className={cn(
          "h-4 w-4 shrink-0 transition-transform duration-200 text-muted-foreground",
          isOpen && "rotate-180",
        )}
      />
    </button>
  );
}

export function AccordionContent({
  children,
  className,
  itemValue: propItemValue,
}: {
  children: React.ReactNode;
  className?: string;
  itemValue?: string;
}) {
  const { openItems } = React.useContext(AccordionContext);
  const { itemValue: contextItemValue } = React.useContext(ItemContext);
  const targetValue = propItemValue || contextItemValue;
  const isOpen = targetValue ? openItems.includes(targetValue) : false;

  if (!isOpen) return null;

  return (
    <div
      className={cn(
        "pb-4 pt-1 text-sm text-muted-foreground leading-relaxed animate-in fade-in-50 duration-200",
        className,
      )}
    >
      {children}
    </div>
  );
}
