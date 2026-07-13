export const CHART_AXIS_TICK_STYLE = {
  fontSize: 11,
  fill: "var(--muted-foreground)",
} as const;

export const CHART_MARGIN = { left: -12, right: 8, top: 4 } as const;

export const CHART_GRID_PROPS = {
  strokeDasharray: "3 3",
  stroke: "var(--border)",
  vertical: false,
} as const;

export const CHART_X_AXIS_PROPS = {
  tick: CHART_AXIS_TICK_STYLE,
  tickLine: false,
  axisLine: false,
} as const;

export const CHART_Y_AXIS_PROPS = {
  tick: CHART_AXIS_TICK_STYLE,
  tickLine: false,
  axisLine: false,
  width: 48,
} as const;
