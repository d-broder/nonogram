/**
 * Color constants and related utilities for the Nonogram application
 * Centralized color definitions to maintain consistency across components
 */

import type { PlayerColor } from "../types";

/**
 * Color value mappings for player colors
 * Used for styling player indicators, borders, and game elements
 */
export const COLOR_VALUES: Record<PlayerColor, string> = {
  red: "#ef4444",
  blue: "#3b82f6",
  green: "#22c55e",
  yellow: "#eab308",
  purple: "#a855f7",
  orange: "#f97316",
  pink: "#ec4899",
  teal: "#14b8a6",
};

/**
 * Available colors for player selection
 * Order determines the sequence shown in color picker components
 */
export const AVAILABLE_COLORS: PlayerColor[] = [
  "red",
  "blue",
  "green",
  "yellow",
  "purple",
  "orange",
  "pink",
  "teal",
];

/**
 * Utility function to get color value by player color key
 * @param color - Player color key
 * @returns CSS color value string
 */
export const getColorValue = (color: PlayerColor): string => {
  return COLOR_VALUES[color];
};

/**
 * Utility function to validate if a color is available
 * @param color - Color to validate
 * @returns true if color is in available colors list
 */
export const isValidColor = (color: string): color is PlayerColor => {
  return AVAILABLE_COLORS.includes(color as PlayerColor);
};
