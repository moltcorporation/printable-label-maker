// Avery label sheet specifications
// All dimensions in inches

export interface AverySpec {
  id: string;
  name: string;
  description: string;
  sheetWidth: number;
  sheetHeight: number;
  labelWidth: number;
  labelHeight: number;
  columns: number;
  rows: number;
  labelsPerSheet: number;
  topMargin: number;
  sideMargin: number;
  horizontalGap: number;
  verticalGap: number;
  labelPadding: number;
  pro: boolean;
}

// Avery 5160 — 30 labels, 3x10, address labels (1" x 2-5/8")
export const AVERY_5160: AverySpec = {
  id: "5160",
  name: "Avery 5160",
  description: "30/sheet address labels (1\" × 2⅝\")",
  sheetWidth: 8.5,
  sheetHeight: 11,
  labelWidth: 2.625,
  labelHeight: 1,
  columns: 3,
  rows: 10,
  labelsPerSheet: 30,
  topMargin: 0.5,
  sideMargin: 0.1875,
  horizontalGap: 0.125,
  verticalGap: 0,
  labelPadding: 0.0625,
  pro: false,
};

// Avery 5163 — 10 labels, 2x5, shipping labels (2" x 4")
export const AVERY_5163: AverySpec = {
  id: "5163",
  name: "Avery 5163",
  description: "10/sheet shipping labels (2\" × 4\")",
  sheetWidth: 8.5,
  sheetHeight: 11,
  labelWidth: 4,
  labelHeight: 2,
  columns: 2,
  rows: 5,
  labelsPerSheet: 10,
  topMargin: 0.5,
  sideMargin: 0.15625,
  horizontalGap: 0.1875,
  verticalGap: 0,
  labelPadding: 0.1,
  pro: true,
};

// Avery 5164 — 6 labels, 2x3, cargo/large shipping (3.33" x 4")
export const AVERY_5164: AverySpec = {
  id: "5164",
  name: "Avery 5164",
  description: "6/sheet cargo labels (3⅓\" × 4\")",
  sheetWidth: 8.5,
  sheetHeight: 11,
  labelWidth: 4,
  labelHeight: 3.333,
  columns: 2,
  rows: 3,
  labelsPerSheet: 6,
  topMargin: 0.5,
  sideMargin: 0.15625,
  horizontalGap: 0.1875,
  verticalGap: 0,
  labelPadding: 0.125,
  pro: true,
};

// Avery 22805 — 9 labels, 3x3, jar/oval labels (2.5" x 1.75" on 3x3 grid)
export const AVERY_22805: AverySpec = {
  id: "22805",
  name: "Avery 22805",
  description: "9/sheet jar labels (2½\" × 1¾\")",
  sheetWidth: 8.5,
  sheetHeight: 11,
  labelWidth: 2.5,
  labelHeight: 1.75,
  columns: 3,
  rows: 3,
  labelsPerSheet: 9,
  topMargin: 1.375,
  sideMargin: 0.3125,
  horizontalGap: 0.1875,
  verticalGap: 0.5,
  labelPadding: 0.1,
  pro: true,
};

export const ALL_AVERY_SPECS: AverySpec[] = [
  AVERY_5160,
  AVERY_5163,
  AVERY_5164,
  AVERY_22805,
];

// Convert inches to points (PDF units)
export function inchesToPoints(inches: number): number {
  return inches * 72;
}

// Convert inches to pixels for SVG preview at a given DPI
export function inchesToPixels(inches: number, dpi: number = 96): number {
  return inches * dpi;
}

// Get label position on the sheet (in inches) for any Avery spec
export function getLabelPosition(index: number, spec: AverySpec) {
  const col = index % spec.columns;
  const row = Math.floor(index / spec.columns);

  const x = spec.sideMargin + col * (spec.labelWidth + spec.horizontalGap);
  const y = spec.topMargin + row * (spec.labelHeight + spec.verticalGap);

  return { x, y, col, row };
}
