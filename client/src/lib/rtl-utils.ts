import { useDirection } from "@/hooks/useDirection";
import { cn } from "@/lib/utils";

/**
 * RTL utility functions for systematic direction handling
 */

/**
 * Swaps classes based on RTL state
 * @param ltrClass Class to use in LTR mode
 * @param rtlClass Class to use in RTL mode
 * @returns The appropriate class based on current direction
 */
export function rtlSwap(ltrClass: string, rtlClass: string): string {
  const { isRTL } = useDirection();
  return isRTL ? rtlClass : ltrClass;
}

/**
 * Returns margin/padding classes based on direction
 * Use this instead of ml-X/mr-X for direction-aware spacing
 */
export function useRTLSpacing() {
  const { isRTL } = useDirection();
  return {
    ms: (value: string) => isRTL ? `mr-${value}` : `ml-${value}`, // margin-start
    me: (value: string) => isRTL ? `ml-${value}` : `mr-${value}`, // margin-end
    ps: (value: string) => isRTL ? `pr-${value}` : `pl-${value}`, // padding-start
    pe: (value: string) => isRTL ? `pl-${value}` : `pr-${value}`, // padding-end
    // Logical properties (preferred when supported)
    msLogical: (value: string) => `ms-${value}`, // margin-inline-start
    meLogical: (value: string) => `me-${value}`, // margin-inline-end
    psLogical: (value: string) => `ps-${value}`, // padding-inline-start
    peLogical: (value: string) => `pe-${value}`, // padding-inline-end
  };
}

/**
 * Returns text alignment classes based on direction
 */
export function useRTLText() {
  const { isRTL } = useDirection();
  return {
    textStart: "text-start",
    textEnd: "text-end",
    textLeft: isRTL ? "text-right" : "text-left",
    textRight: isRTL ? "text-left" : "text-right",
  };
}

/**
 * Returns flex direction classes based on RTL
 */
export function useRTLFlex() {
  const { isRTL } = useDirection();
  return {
    row: isRTL ? "flex-row-reverse" : "flex-row",
    rowReverse: isRTL ? "flex-row" : "flex-row-reverse",
  };
}

/**
 * Returns position classes (left/right) based on RTL
 */
export function useRTLPosition() {
  const { isRTL } = useDirection();
  return {
    left: isRTL ? "right-0" : "left-0",
    right: isRTL ? "left-0" : "right-0",
    leftAuto: isRTL ? "right-auto" : "left-auto",
    rightAuto: isRTL ? "left-auto" : "right-auto",
  };
}

/**
 * Returns border classes based on RTL
 */
export function useRTLBorder() {
  const { isRTL } = useDirection();
  return {
    borderL: isRTL ? "border-r" : "border-l",
    borderR: isRTL ? "border-l" : "border-r",
    borderL0: isRTL ? "border-r-0" : "border-l-0",
    borderR0: isRTL ? "border-l-0" : "border-r-0",
  };
}

/**
 * Helper to conditionally apply classes based on RTL
 */
export function rtlClass(ltrClasses: string, rtlClasses: string): string {
  const { isRTL } = useDirection();
  return cn(isRTL ? rtlClasses : ltrClasses);
}

/**
 * Returns rounded corner classes based on RTL
 * Useful for items that should have rounded corners on the "start" or "end"
 */
export function useRTLRounded() {
  const { isRTL } = useDirection();
  return {
    roundedStart: isRTL ? "rounded-r" : "rounded-l",
    roundedEnd: isRTL ? "rounded-l" : "rounded-r",
    roundedStartFull: isRTL ? "rounded-r-full" : "rounded-l-full",
    roundedEndFull: isRTL ? "rounded-l-full" : "rounded-r-full",
  };
}
