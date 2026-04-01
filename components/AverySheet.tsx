"use client";

import { AVERY_5160, inchesToPixels } from "@/lib/avery";
import { LabelData } from "@/lib/types";

interface AverySheetProps {
  labels: LabelData[];
  labelCount: number;
}

const PREVIEW_DPI = 96;

export default function AverySheet({ labels, labelCount }: AverySheetProps) {
  const sheetW = inchesToPixels(AVERY_5160.sheetWidth, PREVIEW_DPI);
  const sheetH = inchesToPixels(AVERY_5160.sheetHeight, PREVIEW_DPI);
  const labelW = inchesToPixels(AVERY_5160.labelWidth, PREVIEW_DPI);
  const labelH = inchesToPixels(AVERY_5160.labelHeight, PREVIEW_DPI);
  const padding = inchesToPixels(AVERY_5160.labelPadding, PREVIEW_DPI);

  return (
    <div className="overflow-auto border border-gray-300 rounded-lg bg-white shadow-sm">
      <svg
        viewBox={`0 0 ${sheetW} ${sheetH}`}
        className="w-full h-auto"
        style={{ maxHeight: "70vh" }}
      >
        {/* Sheet background */}
        <rect width={sheetW} height={sheetH} fill="white" />

        {/* Render labels */}
        {Array.from({ length: Math.min(labelCount, AVERY_5160.labelsPerSheet) }).map(
          (_, i) => {
            const labelData = labels[i % labels.length];
            const col = i % AVERY_5160.columns;
            const row = Math.floor(i / AVERY_5160.columns);
            const x =
              inchesToPixels(AVERY_5160.sideMargin, PREVIEW_DPI) +
              col * inchesToPixels(AVERY_5160.labelWidth + AVERY_5160.horizontalGap, PREVIEW_DPI);
            const y =
              inchesToPixels(AVERY_5160.topMargin, PREVIEW_DPI) +
              row * inchesToPixels(AVERY_5160.labelHeight + AVERY_5160.verticalGap, PREVIEW_DPI);

            const lineHeight = labelData.fontSize * 1.3 * (PREVIEW_DPI / 72);
            const visibleLines = labelData.lines.filter((l) => l.trim());
            const totalTextHeight = visibleLines.length * lineHeight;
            const startY = y + (labelH - totalTextHeight) / 2 + labelData.fontSize * (PREVIEW_DPI / 72);

            let textAnchor: "start" | "middle" | "end" = "start";
            let textX = x + padding;
            if (labelData.textAlign === "center") {
              textAnchor = "middle";
              textX = x + labelW / 2;
            } else if (labelData.textAlign === "right") {
              textAnchor = "end";
              textX = x + labelW - padding;
            }

            return (
              <g key={i}>
                {/* Label border */}
                <rect
                  x={x}
                  y={y}
                  width={labelW}
                  height={labelH}
                  fill="white"
                  stroke="#e5e7eb"
                  strokeWidth={0.5}
                  strokeDasharray="4 2"
                />
                {/* Label text */}
                {visibleLines.map((line, lineIndex) => {
                  const lineY = startY + lineIndex * lineHeight;
                  if (lineY > y + labelH - padding) return null;
                  return (
                    <text
                      key={lineIndex}
                      x={textX}
                      y={lineY}
                      fontSize={labelData.fontSize * (PREVIEW_DPI / 72)}
                      fontFamily={labelData.fontFamily}
                      fill={labelData.textColor}
                      textAnchor={textAnchor}
                    >
                      {line}
                    </text>
                  );
                })}
              </g>
            );
          }
        )}
      </svg>
    </div>
  );
}
