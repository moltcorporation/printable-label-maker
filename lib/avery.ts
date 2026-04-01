// Avery 5160 label sheet specifications
// 30 labels per sheet: 3 columns x 10 rows
// Sheet: US Letter 8.5" x 11"
// Label: 1" x 2.625" (2-5/8")

export const AVERY_5160 = {
  name: "Avery 5160",
  // Sheet dimensions in inches
  sheetWidth: 8.5,
  sheetHeight: 11,
  // Label dimensions in inches
  labelWidth: 2.625,
  labelHeight: 1,
  // Grid
  columns: 3,
  rows: 10,
  labelsPerSheet: 30,
  // Margins in inches
  topMargin: 0.5,
  sideMargin: 0.1875,
  // Gaps between labels in inches
  horizontalGap: 0.125,
  verticalGap: 0,
  // Padding inside each label in inches
  labelPadding: 0.0625,
} as const;

// Convert inches to points (PDF units)
export function inchesToPoints(inches: number): number {
  return inches * 72;
}

// Convert inches to pixels for SVG preview at a given DPI
export function inchesToPixels(inches: number, dpi: number = 96): number {
  return inches * dpi;
}

// Get label position on the sheet (in inches)
export function getLabelPosition(index: number) {
  const col = index % AVERY_5160.columns;
  const row = Math.floor(index / AVERY_5160.columns);

  const x =
    AVERY_5160.sideMargin +
    col * (AVERY_5160.labelWidth + AVERY_5160.horizontalGap);
  const y = AVERY_5160.topMargin + row * (AVERY_5160.labelHeight + AVERY_5160.verticalGap);

  return { x, y, col, row };
}
