import jsPDF from "jspdf";
import { AverySpec, inchesToPoints, getLabelPosition } from "./avery";
import { LabelData } from "./types";

// Map CSS font families to jsPDF font names
function getJsPDFFont(fontFamily: string): string {
  if (fontFamily.includes("Times")) return "times";
  if (fontFamily.includes("Courier")) return "courier";
  return "helvetica"; // Arial/Verdana/Georgia all map to helvetica in jsPDF
}

function getJsPDFAlign(align: string): "left" | "center" | "right" {
  if (align === "center" || align === "right") return align;
  return "left";
}

export function generatePDF(
  labels: LabelData[],
  count: number,
  spec: AverySpec
): jsPDF {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "pt",
    format: "letter",
  });

  const padding = inchesToPoints(spec.labelPadding);
  const labelW = inchesToPoints(spec.labelWidth);
  const labelH = inchesToPoints(spec.labelHeight);

  for (let i = 0; i < count && i < spec.labelsPerSheet; i++) {
    const labelData = labels[i % labels.length];
    const pos = getLabelPosition(i, spec);
    const x = inchesToPoints(pos.x);
    const y = inchesToPoints(pos.y);

    const font = getJsPDFFont(labelData.fontFamily);
    const align = getJsPDFAlign(labelData.textAlign);

    doc.setFont(font);
    doc.setFontSize(labelData.fontSize);
    doc.setTextColor(labelData.textColor);

    // Calculate text X based on alignment
    let textX = x + padding;
    if (align === "center") {
      textX = x + labelW / 2;
    } else if (align === "right") {
      textX = x + labelW - padding;
    }

    // Render each line
    const lineHeight = labelData.fontSize * 1.3;
    const visibleLines = labelData.lines.filter((l) => l.trim());
    const totalTextHeight = visibleLines.length * lineHeight;
    const startY = y + (labelH - totalTextHeight) / 2 + labelData.fontSize;

    visibleLines.forEach((line, lineIndex) => {
      const lineY = startY + lineIndex * lineHeight;
      if (lineY < y + labelH - padding) {
        doc.text(line, textX, lineY, { align });
      }
    });
  }

  return doc;
}
