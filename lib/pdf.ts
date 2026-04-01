import jsPDF from "jspdf";
import { AVERY_5160, inchesToPoints, getLabelPosition } from "./avery";
import { LabelData } from "./types";

// Map CSS font families to jsPDF font names
function getJsPDFFont(fontFamily: string): string {
  if (fontFamily.includes("Times")) return "times";
  if (fontFamily.includes("Courier")) return "courier";
  return "helvetica"; // Arial maps to helvetica in jsPDF
}

function getJsPDFAlign(align: string): "left" | "center" | "right" {
  if (align === "center" || align === "right") return align;
  return "left";
}

export function generatePDF(labels: LabelData[], count: number): jsPDF {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "pt",
    format: "letter",
  });

  const padding = inchesToPoints(AVERY_5160.labelPadding);
  const labelW = inchesToPoints(AVERY_5160.labelWidth);
  const labelH = inchesToPoints(AVERY_5160.labelHeight);

  for (let i = 0; i < count && i < AVERY_5160.labelsPerSheet; i++) {
    const labelData = labels[i % labels.length];
    const pos = getLabelPosition(i);
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
    const totalTextHeight = labelData.lines.filter((l) => l.trim()).length * lineHeight;
    const startY = y + (labelH - totalTextHeight) / 2 + labelData.fontSize;

    labelData.lines
      .filter((line) => line.trim())
      .forEach((line, lineIndex) => {
        const lineY = startY + lineIndex * lineHeight;
        if (lineY < y + labelH - padding) {
          doc.text(line, textX, lineY, { align });
        }
      });
  }

  return doc;
}
