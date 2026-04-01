"use client";

import { useState, useCallback, useEffect } from "react";
import {
  LabelData,
  TEMPLATES,
  FONTS,
  FREE_TIER_LIMIT,
  STRIPE_LINKS,
  Template,
} from "@/lib/types";
import { generatePDF } from "@/lib/pdf";
import {
  getSession,
  incrementLabelsGenerated,
  getRemainingLabels,
  canGenerateLabels,
} from "@/lib/session";
import { ALL_AVERY_SPECS, AVERY_5160, AverySpec } from "@/lib/avery";
import AverySheet from "./AverySheet";

export default function LabelEditor() {
  const [lines, setLines] = useState<string[]>(TEMPLATES[0].placeholderLines);
  const [fontFamily, setFontFamily] = useState(FONTS[0].value);
  const [fontSize, setFontSize] = useState(10);
  const [textColor, setTextColor] = useState("#000000");
  const [textAlign, setTextAlign] = useState<"left" | "center" | "right">("left");
  const [activeSpec, setActiveSpec] = useState<AverySpec>(AVERY_5160);
  const [labelCount, setLabelCount] = useState(AVERY_5160.labelsPerSheet);
  const [remaining, setRemaining] = useState(FREE_TIER_LIMIT);
  const [activeTemplate, setActiveTemplate] = useState<string>("address");
  const [showUpgrade, setShowUpgrade] = useState(false);

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
    setLines((prev) =>
      prev.length > 1 ? prev.filter((_, i) => i !== index) : prev
    );
  }, []);

  const applyTemplate = useCallback((template: Template) => {
    if (template.pro) {
      setShowUpgrade(true);
      return;
    }
    setLines(template.placeholderLines);
    setActiveTemplate(template.id);
  }, []);

  const selectSheet = useCallback(
    (spec: AverySpec) => {
      if (spec.pro) {
        setShowUpgrade(true);
        return;
      }
      setActiveSpec(spec);
      setLabelCount(spec.labelsPerSheet);
    },
    []
  );

  const handleDownloadPDF = useCallback(() => {
    if (!canGenerateLabels()) {
      setShowUpgrade(true);
      return;
    }

    const actualCount = Math.min(labelCount, remaining);
    const doc = generatePDF([labelData], actualCount, activeSpec);
    doc.save(`labels-${activeSpec.id}.pdf`);

    incrementLabelsGenerated(actualCount);
    setRemaining(getRemainingLabels());
  }, [labelData, labelCount, remaining, activeSpec]);

  const handleDownloadPNG = useCallback(() => {
    if (!canGenerateLabels()) {
      setShowUpgrade(true);
      return;
    }

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
      link.download = `labels-${activeSpec.id}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();

      const actualCount = Math.min(labelCount, remaining);
      incrementLabelsGenerated(actualCount);
      setRemaining(getRemainingLabels());
    };
    img.src =
      "data:image/svg+xml;base64," +
      btoa(unescape(encodeURIComponent(svgData)));
  }, [labelCount, remaining, activeSpec]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900">
            Printable Label Maker
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Create and print custom labels for Avery sheets — address, shipping,
            jar, and sticker labels
          </p>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Editor Controls */}
          <div className="lg:col-span-1 space-y-4">
            {/* Avery Sheet Selector */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h2 className="text-sm font-semibold text-gray-700 mb-3">
                Sheet Size
              </h2>
              <div className="space-y-2">
                {ALL_AVERY_SPECS.map((spec) => (
                  <button
                    key={spec.id}
                    onClick={() => selectSheet(spec)}
                    className={`w-full text-left px-3 py-2 text-sm rounded-md border transition-colors ${
                      activeSpec.id === spec.id
                        ? "bg-blue-50 border-blue-300 text-blue-700"
                        : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <span className="font-medium">{spec.name}</span>
                    <span className="text-xs text-gray-400 ml-2">
                      {spec.description}
                    </span>
                    {spec.pro && (
                      <span className="ml-2 px-1.5 py-0.5 text-xs bg-amber-100 text-amber-700 rounded font-medium">
                        PRO
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Templates */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h2 className="text-sm font-semibold text-gray-700 mb-3">
                Template
              </h2>
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
                    {t.pro && (
                      <span className="ml-1 text-xs text-amber-600">PRO</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Text Lines */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h2 className="text-sm font-semibold text-gray-700 mb-3">
                Label Text
              </h2>
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
              <h2 className="text-sm font-semibold text-gray-700 mb-3">
                Style
              </h2>
              <div className="space-y-3">
                {/* Font */}
                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    Font
                  </label>
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
                  <label className="block text-xs text-gray-500 mb-1">
                    Color
                  </label>
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
                  <label className="block text-xs text-gray-500 mb-1">
                    Alignment
                  </label>
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
              <h2 className="text-sm font-semibold text-gray-700 mb-3">
                Quantity
              </h2>
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Labels per sheet: {labelCount}
                </label>
                <input
                  type="range"
                  min={1}
                  max={activeSpec.labelsPerSheet}
                  value={labelCount}
                  onChange={(e) => setLabelCount(Number(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>

            {/* Download Actions */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-gray-700">
                  Download
                </h2>
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
                  <p className="text-sm text-gray-600 mb-3">
                    Free limit reached ({FREE_TIER_LIMIT} labels)
                  </p>
                  <button
                    onClick={() => setShowUpgrade(true)}
                    className="w-full px-4 py-2.5 bg-amber-500 text-white text-sm font-medium rounded-md hover:bg-amber-600 transition-colors"
                  >
                    Upgrade to Pro — Unlimited Labels
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right: Sheet Preview */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-semibold text-gray-700">
                  Sheet Preview — {activeSpec.name}
                </h2>
                <span className="text-xs text-gray-400">
                  {activeSpec.columns}&times;{activeSpec.rows} &bull;{" "}
                  {activeSpec.labelWidth}&quot;&times;{activeSpec.labelHeight}
                  &quot; labels &bull; US Letter
                </span>
              </div>
              <div className="avery-sheet-container">
                <AverySheet
                  labels={[labelData]}
                  labelCount={labelCount}
                  spec={activeSpec}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Upgrade Modal */}
      {showUpgrade && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-6 h-6 text-amber-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 3l14 9-14 9V3z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Upgrade to Pro
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                Unlock unlimited labels, all Avery sheet sizes (5163, 5164,
                22805), jar/pantry templates, sticker templates, and more.
              </p>

              <div className="space-y-3 mb-6">
                <a
                  href={STRIPE_LINKS.monthly}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full px-4 py-3 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  $4.99/month
                </a>
                <a
                  href={STRIPE_LINKS.yearly}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full px-4 py-3 bg-amber-500 text-white text-sm font-medium rounded-lg hover:bg-amber-600 transition-colors"
                >
                  $34.99/year{" "}
                  <span className="text-amber-200 text-xs">Save 42%</span>
                </a>
              </div>

              <button
                onClick={() => setShowUpgrade(false)}
                className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                Maybe later
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 px-4 py-6 mt-12">
        <div className="max-w-7xl mx-auto text-center text-sm text-gray-500">
          <p>
            Printable Label Maker &mdash; Create custom Avery labels for free.
            Address labels, shipping labels, jar labels, and sticker labels.
          </p>
          <p className="mt-1">
            Supports Avery 5160, 5163, 5164, and 22805 sheets. Download as
            print-ready PDF.
          </p>
        </div>
      </footer>
    </div>
  );
}
