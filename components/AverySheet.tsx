"use client";

import { AverySpec, inchesToPixels, getLabelPosition } from "@/lib/avery";
import { LabelData } from "@/lib/types";

interface AverySheetProps {
  labels: LabelData[];
  labelCount: number;
  spec: AverySpec;
}

const PREVIEW_DPI = 96;

export default function AverySheet({ labels, labelCount, spec }: AverySheetProps) {
  const sheetW = inchesToPixels(spec.sheetWidth, PREVIEW_DPI);
  const sheetH = inchesToPixels(spec.sheetHeight, PREVIEW_DPI);
  const labelW = inchesToPixels(spec.labelWidth, PREVIEW_DPI);
  const labelH = inchesToPixels(spec.labelHeight, PREVIEW_DPI);
  const padding = inchesToPixels(spec.labelPadding, PREVIEW_DPI);

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
        {Array.from({ length: Math.min(labelCount, spec.labelsPerSheet) }).map(
          (_, i) => {
            const labelData = labels[i % labels.length];
            const pos = getLabelPosition(i, spec);
            const x = inchesToPixels(pos.x, PREVIEW_DPI);
            const y = inchesToPixels(pos.y, PREVIEW_DPI);

            const lineHeight = labelData.fontSize * 1.3 * (PREVIEW_DPI / 72);
            const visibleLines = labelData.lines.filter((l) => l.trim());
            const totalTextHeight = visibleLines.length * lineHeight;
            const startY =
              y + (labelH - totalTextHeight) / 2 + labelData.fontSize * (PREVIEW_DPI / 72);

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
