"use client";

import { useState, useCallback, useEffect } from "react";
import { LabelData, TEMPLATES, FONTS, FREE_TIER_LIMIT, Template } from "@/lib/types";
import { generatePDF } from "@/lib/pdf";
import { getSession, incrementLabelsGenerated, getRemainingLabels, canGenerateLabels } from "@/lib/session";
import { AVERY_5160 } from "@/lib/avery";
import AverySheet from "./AverySheet";

export default function LabelEditor() {
  const [lines, setLines] = useState<string[]>(TEMPLATES[0].placeholderLines);
  const [fontFamily, setFontFamily] = useState(FONTS[0].value);
  const [fontSize, setFontSize] = useState(10);
  const [textColor, setTextColor] = useState("#000000");
  const [textAlign, setTextAlign] = useState<"left" | "center" | "right">("left");
  const [labelCount, setLabelCount] = useState(30);
  const [remaining, setRemaining] = useState(FREE_TIER_LIMIT);
  const [activeTemplate, setActiveTemplate] = useState<string>("address");

  useEffect(() => {
    setRemaining(getRemainingLabels());
  }, []);

  const labelData: LabelData = {
    lines,
    fontFamily,
    fontSize,
    textColor,
    textAlign,
  };

  const updateLine = useCallback((index: number, value: string) => {
    setLines((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  }, []);

  const addLine = useCallback(() => {
    setLines((prev) => (prev.length < 6 ? [...prev, ""] : prev));
  }, []);

  const removeLine = useCallback((index: number) => {
    setLines((prev) => (prev.length > 1 ? prev.filter((_, i) => i !== index) : prev));
  }, []);

  const applyTemplate = useCallback((template: Template) => {
    setLines(template.placeholderLines);
    setActiveTemplate(template.id);
  }, []);

  const handleDownloadPDF = useCallback(() => {
    if (!canGenerateLabels()) return;

    const actualCount = Math.min(labelCount, remaining);
    const doc = generatePDF([labelData], actualCount);
    doc.save("labels-avery-5160.pdf");

    incrementLabelsGenerated(actualCount);
    setRemaining(getRemainingLabels());
  }, [labelData, labelCount, remaining]);

  const handleDownloadPNG = useCallback(() => {
    if (!canGenerateLabels()) return;

    const svgEl = document.querySelector(".avery-sheet-container svg");
    if (!svgEl) return;

    const svgData = new XMLSerializer().serializeToString(svgEl);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      canvas.width = img.width * 2;
      canvas.height = img.height * 2;
      ctx.scale(2, 2);
      ctx.drawImage(img, 0, 0);
      const link = document.createElement("a");
      link.download = "labels-avery-5160.png";
      link.href = canvas.toDataURL("image/png");
      link.click();

      const actualCount = Math.min(labelCount, remaining);
      incrementLabelsGenerated(actualCount);
      setRemaining(getRemainingLabels());
    };
    img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
  }, [labelCount, remaining]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900">Printable Label Maker</h1>
          <p className="text-sm text-gray-500 mt-1">
            Create and print Avery 5160 address labels — free, no account needed
          </p>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Editor Controls */}
          <div className="lg:col-span-1 space-y-4">
            {/* Templates */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h2 className="text-sm font-semibold text-gray-700 mb-3">Template</h2>
              <div className="flex flex-wrap gap-2">
                {TEMPLATES.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => applyTemplate(t)}
                    className={`px-3 py-1.5 text-sm rounded-md border transition-colors ${
                      activeTemplate === t.id
                        ? "bg-blue-50 border-blue-300 text-blue-700"
                        : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {t.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Text Lines */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h2 className="text-sm font-semibold text-gray-700 mb-3">Label Text</h2>
              <div className="space-y-2">
                {lines.map((line, i) => (
                  <div key={i} className="flex gap-2">
                    <input
                      type="text"
                      value={line}
                      onChange={(e) => updateLine(i, e.target.value)}
                      placeholder={`Line ${i + 1}`}
                      className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {lines.length > 1 && (
                      <button
                        onClick={() => removeLine(i)}
                        className="px-2 text-gray-400 hover:text-red-500 transition-colors"
                        title="Remove line"
                      >
                        &times;
                      </button>
                    )}
                  </div>
                ))}
                {lines.length < 6 && (
                  <button
                    onClick={addLine}
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    + Add line
                  </button>
                )}
              </div>
            </div>

            {/* Style Controls */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h2 className="text-sm font-semibold text-gray-700 mb-3">Style</h2>
              <div className="space-y-3">
                {/* Font */}
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Font</label>
                  <select
                    value={fontFamily}
                    onChange={(e) => setFontFamily(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {FONTS.map((f) => (
                      <option key={f.name} value={f.value}>
                        {f.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Font Size */}
                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    Size: {fontSize}pt
                  </label>
                  <input
                    type="range"
                    min={6}
                    max={16}
                    value={fontSize}
                    onChange={(e) => setFontSize(Number(e.target.value))}
                    className="w-full"
                  />
                </div>

                {/* Color */}
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Color</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={textColor}
                      onChange={(e) => setTextColor(e.target.value)}
                      className="w-8 h-8 border border-gray-200 rounded cursor-pointer"
                    />
                    <span className="text-sm text-gray-600">{textColor}</span>
                  </div>
                </div>

                {/* Alignment */}
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Alignment</label>
                  <div className="flex gap-1">
                    {(["left", "center", "right"] as const).map((align) => (
                      <button
                        key={align}
                        onClick={() => setTextAlign(align)}
                        className={`flex-1 px-3 py-1.5 text-sm rounded-md border transition-colors ${
                          textAlign === align
                            ? "bg-blue-50 border-blue-300 text-blue-700"
                            : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        {align.charAt(0).toUpperCase() + align.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Label Count */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h2 className="text-sm font-semibold text-gray-700 mb-3">Quantity</h2>
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Labels per sheet: {labelCount}
                </label>
                <input
                  type="range"
                  min={1}
                  max={AVERY_5160.labelsPerSheet}
                  value={labelCount}
                  onChange={(e) => setLabelCount(Number(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>

            {/* Download Actions */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-gray-700">Download</h2>
                <span className="text-xs text-gray-500">
                  {remaining} free labels remaining
                </span>
              </div>

              {remaining > 0 ? (
                <div className="space-y-2">
                  <button
                    onClick={handleDownloadPDF}
                    className="w-full px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Download PDF
                  </button>
                  <button
                    onClick={handleDownloadPNG}
                    className="w-full px-4 py-2.5 bg-white text-gray-700 text-sm font-medium rounded-md border border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    Download PNG
                  </button>
                </div>
              ) : (
                <div className="text-center py-3">
                  <p className="text-sm text-gray-600 mb-2">
                    Free limit reached ({FREE_TIER_LIMIT} labels)
                  </p>
                  <p className="text-xs text-gray-400">
                    Pro version coming soon — unlimited labels, CSV import, more Avery sizes
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right: Sheet Preview */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-semibold text-gray-700">
                  Sheet Preview — Avery 5160
                </h2>
                <span className="text-xs text-gray-400">
                  {AVERY_5160.columns}&times;{AVERY_5160.rows} • {AVERY_5160.labelWidth}&quot;&times;{AVERY_5160.labelHeight}&quot; labels • US Letter
                </span>
              </div>
              <div className="avery-sheet-container">
                <AverySheet labels={[labelData]} labelCount={labelCount} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
