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
  isPro,
  setProStatus,
  getProStatus,
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
  const [pro, setPro] = useState(false);
  const [verifyEmail, setVerifyEmail] = useState("");
  const [verifyMode, setVerifyMode] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [verifyError, setVerifyError] = useState("");

  useEffect(() => {
    setRemaining(getRemainingLabels());
    setPro(isPro());
    const proData = getProStatus();
    if (proData?.email) setVerifyEmail(proData.email);

    const urlParams = new URLSearchParams(window.location.search);
    const templateParam = urlParams.get("template");
    if (templateParam) {
      const template = TEMPLATES.find((t) => t.id === templateParam);
      if (template && !template.pro) {
        setLines(template.placeholderLines);
        setActiveTemplate(template.id);
      }
    }
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
    if (template.pro && !pro) {
      setShowUpgrade(true);
      return;
    }
    setLines(template.placeholderLines);
    setActiveTemplate(template.id);
  }, [pro]);

  const selectSheet = useCallback(
    (spec: AverySpec) => {
      if (spec.pro && !pro) {
        setShowUpgrade(true);
        return;
      }
      setActiveSpec(spec);
      setLabelCount(spec.labelsPerSheet);
    },
    [pro]
  );

  const handleVerifyAccess = useCallback(async () => {
    if (!verifyEmail.trim()) {
      setVerifyError("Please enter your email address");
      return;
    }
    setVerifyLoading(true);
    setVerifyError("");
    try {
      const res = await fetch(`/api/check-access?email=${encodeURIComponent(verifyEmail.trim())}`);
      const data = await res.json();
      if (data.has_access) {
        setProStatus(verifyEmail.trim());
        setPro(true);
        setShowUpgrade(false);
        setVerifyMode(false);
      } else {
        setVerifyError("No active subscription found for this email. Please complete your purchase first.");
      }
    } catch {
      setVerifyError("Unable to verify access. Please try again.");
    } finally {
      setVerifyLoading(false);
    }
  }, [verifyEmail]);

  const handleDownloadPDF = useCallback(() => {
    if (!canGenerateLabels()) {
      setShowUpgrade(true);
      return;
    }

    const actualCount = pro ? labelCount : Math.min(labelCount, remaining);
    const doc = generatePDF([labelData], actualCount, activeSpec);
    doc.save(`labels-${activeSpec.id}.pdf`);

    if (!pro) {
      incrementLabelsGenerated(actualCount);
      setRemaining(getRemainingLabels());
    }
  }, [labelData, labelCount, remaining, activeSpec, pro]);

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

      if (!pro) {
        const actualCount = Math.min(labelCount, remaining);
        incrementLabelsGenerated(actualCount);
        setRemaining(getRemainingLabels());
      }
    };
    img.src =
      "data:image/svg+xml;base64," +
      btoa(unescape(encodeURIComponent(svgData)));
  }, [labelCount, remaining, activeSpec, pro]);

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#faf8f6" }}>
      {/* Hero Header */}
      <header className="border-b" style={{ backgroundColor: "#f5ede5", borderColor: "#e8ddd3" }}>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="mb-6">
            <h1 className="text-4xl font-bold mb-2" style={{ color: "#3d3935", fontFamily: "'Poppins', sans-serif", fontWeight: 700 }}>
              Printable Label Maker
            </h1>
            <p className="text-lg" style={{ color: "#6b8e7f" }}>
              Design & print custom labels for Avery sheets. Perfect for home organizers, small businesses & crafters.
            </p>
          </div>

          {/* Mini Hero Preview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="rounded-lg p-3 text-center transition-transform hover:scale-105" style={{ backgroundColor: "white", border: "2px solid #d97562" }}>
              <span style={{ fontSize: "24px" }}>🏷️</span>
              <p className="text-xs font-medium mt-1" style={{ color: "#3d3935" }}>Address Labels</p>
            </div>
            <div className="rounded-lg p-3 text-center transition-transform hover:scale-105" style={{ backgroundColor: "white", border: "2px solid #6b8e7f" }}>
              <span style={{ fontSize: "24px" }}>📦</span>
              <p className="text-xs font-medium mt-1" style={{ color: "#3d3935" }}>Shipping Labels</p>
            </div>
            <div className="rounded-lg p-3 text-center transition-transform hover:scale-105" style={{ backgroundColor: "white", border: "2px solid #c4a747" }}>
              <span style={{ fontSize: "24px" }}>🏺</span>
              <p className="text-xs font-medium mt-1" style={{ color: "#3d3935" }}>Jar Labels</p>
            </div>
            <div className="rounded-lg p-3 text-center transition-transform hover:scale-105" style={{ backgroundColor: "white", border: "2px solid #8b7355" }}>
              <span style={{ fontSize: "24px" }}>✨</span>
              <p className="text-xs font-medium mt-1" style={{ color: "#3d3935" }}>Sticker Labels</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Editor Controls */}
          <div className="lg:col-span-1 space-y-4">
            {/* Avery Sheet Selector - Visual */}
            <div className="rounded-xl p-5" style={{ backgroundColor: "white", border: "2px solid #e8ddd3" }}>
              <h2 className="text-base font-semibold mb-4" style={{ color: "#3d3935", fontFamily: "'Poppins', sans-serif" }}>
                Sheet Size
              </h2>
              <div className="grid grid-cols-2 gap-2">
                {ALL_AVERY_SPECS.map((spec) => (
                  <button
                    key={spec.id}
                    onClick={() => selectSheet(spec)}
                    className="relative p-3 rounded-lg font-medium transition-all text-sm"
                    style={{
                      backgroundColor: activeSpec.id === spec.id ? "#f5ede5" : "transparent",
                      border: `2px solid ${activeSpec.id === spec.id ? "#d97562" : "#e8ddd3"}`,
                      color: activeSpec.id === spec.id ? "#d97562" : "#6b8e7f",
                      transform: activeSpec.id === spec.id ? "scale(1.05)" : "scale(1)",
                    }}
                  >
                    <span className="block">{spec.name}</span>
                    <span className="text-xs opacity-70">{spec.labelsPerSheet}pcs</span>
                    {spec.pro && (
                      <span className="absolute top-1 right-1 text-xs px-1.5 py-0.5 rounded" style={{ backgroundColor: "#c4a747", color: "white" }}>
                        PRO
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Templates */}
            <div className="rounded-xl p-5" style={{ backgroundColor: "white", border: "2px solid #e8ddd3" }}>
              <h2 className="text-base font-semibold mb-4" style={{ color: "#3d3935", fontFamily: "'Poppins', sans-serif" }}>
                Template
              </h2>
              <div className="flex flex-wrap gap-2">
                {TEMPLATES.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => applyTemplate(t)}
                    className="px-4 py-2 text-sm rounded-lg font-medium transition-all"
                    style={{
                      backgroundColor: activeTemplate === t.id ? "#d97562" : "transparent",
                      border: `2px solid ${activeTemplate === t.id ? "#d97562" : "#e8ddd3"}`,
                      color: activeTemplate === t.id ? "white" : "#6b8e7f",
                    }}
                  >
                    {t.name} {t.pro && "◆"}
                  </button>
                ))}
              </div>
            </div>

            {/* Text Lines */}
            <div className="rounded-xl p-5" style={{ backgroundColor: "white", border: "2px solid #e8ddd3" }}>
              <h2 className="text-base font-semibold mb-4" style={{ color: "#3d3935", fontFamily: "'Poppins', sans-serif" }}>
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
                      className="flex-1 px-3 py-2 text-sm rounded-lg transition-all"
                      style={{
                        backgroundColor: "#faf8f6",
                        border: "2px solid #e8ddd3",
                        color: "#3d3935",
                        outlineColor: "#d97562",
                      }}
                      onFocus={(e) => e.target.style.borderColor = "#d97562"}
                      onBlur={(e) => e.target.style.borderColor = "#e8ddd3"}
                    />
                    {lines.length > 1 && (
                      <button
                        onClick={() => removeLine(i)}
                        className="px-2 transition-colors"
                        style={{ color: "#d97562" }}
                        title="Remove line"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
                {lines.length < 6 && (
                  <button
                    onClick={addLine}
                    className="text-sm font-medium mt-2 transition-colors"
                    style={{ color: "#d97562" }}
                  >
                    + Add line
                  </button>
                )}
              </div>
            </div>

            {/* Style Controls */}
            <div className="rounded-xl p-5" style={{ backgroundColor: "white", border: "2px solid #e8ddd3" }}>
              <h2 className="text-base font-semibold mb-4" style={{ color: "#3d3935", fontFamily: "'Poppins', sans-serif" }}>
                Style
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: "#6b8e7f" }}>
                    Font
                  </label>
                  <select
                    value={fontFamily}
                    onChange={(e) => setFontFamily(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-lg"
                    style={{ backgroundColor: "#faf8f6", border: "2px solid #e8ddd3", color: "#3d3935" }}
                  >
                    {FONTS.map((f) => (
                      <option key={f.name} value={f.value}>
                        {f.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: "#6b8e7f" }}>
                    Size: {fontSize}pt
                  </label>
                  <input
                    type="range"
                    min={6}
                    max={16}
                    value={fontSize}
                    onChange={(e) => setFontSize(Number(e.target.value))}
                    className="w-full"
                    style={{ accentColor: "#d97562" }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: "#6b8e7f" }}>
                    Color
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={textColor}
                      onChange={(e) => setTextColor(e.target.value)}
                      className="w-10 h-10 rounded-lg cursor-pointer"
                      style={{ border: "2px solid #e8ddd3" }}
                    />
                    <span className="text-sm" style={{ color: "#3d3935" }}>{textColor}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: "#6b8e7f" }}>
                    Alignment
                  </label>
                  <div className="flex gap-2">
                    {(["left", "center", "right"] as const).map((align) => (
                      <button
                        key={align}
                        onClick={() => setTextAlign(align)}
                        className="flex-1 px-3 py-2 text-sm font-medium rounded-lg transition-all"
                        style={{
                          backgroundColor: textAlign === align ? "#d97562" : "transparent",
                          border: `2px solid ${textAlign === align ? "#d97562" : "#e8ddd3"}`,
                          color: textAlign === align ? "white" : "#6b8e7f",
                        }}
                      >
                        {align.charAt(0).toUpperCase() + align.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Label Count */}
            <div className="rounded-xl p-5" style={{ backgroundColor: "white", border: "2px solid #e8ddd3" }}>
              <h2 className="text-base font-semibold mb-4" style={{ color: "#3d3935", fontFamily: "'Poppins', sans-serif" }}>
                Quantity
              </h2>
              <label className="block text-sm font-medium mb-2" style={{ color: "#6b8e7f" }}>
                Labels per sheet: {labelCount}
              </label>
              <input
                type="range"
                min={1}
                max={activeSpec.labelsPerSheet}
                value={labelCount}
                onChange={(e) => setLabelCount(Number(e.target.value))}
                className="w-full"
                style={{ accentColor: "#d97562" }}
              />
            </div>

            {/* Download Actions */}
            <div className="rounded-xl p-5" style={{ backgroundColor: "white", border: "2px solid #e8ddd3" }}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-semibold" style={{ color: "#3d3935", fontFamily: "'Poppins', sans-serif" }}>
                  Download
                </h2>
                {pro ? (
                  <span className="text-xs px-3 py-1 rounded-full font-medium" style={{ backgroundColor: "#c4a747", color: "white" }}>
                    PRO
                  </span>
                ) : (
                  <span className="text-xs font-medium" style={{ color: "#6b8e7f" }}>
                    {remaining} free
                  </span>
                )}
              </div>

              {pro || remaining > 0 ? (
                <div className="space-y-2">
                  <button
                    onClick={handleDownloadPDF}
                    className="w-full px-4 py-3 text-white text-sm font-medium rounded-lg transition-all hover:shadow-lg"
                    style={{ backgroundColor: "#d97562" }}
                  >
                    📥 Download PDF
                  </button>
                  <button
                    onClick={handleDownloadPNG}
                    className="w-full px-4 py-3 text-sm font-medium rounded-lg transition-all border-2"
                    style={{ backgroundColor: "#f5ede5", border: "2px solid #d97562", color: "#d97562" }}
                  >
                    📸 Download PNG
                  </button>
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-sm font-medium mb-3" style={{ color: "#6b8e7f" }}>
                    Free limit reached
                  </p>
                  <button
                    onClick={() => setShowUpgrade(true)}
                    className="w-full px-4 py-3 text-white text-sm font-medium rounded-lg transition-all hover:shadow-lg"
                    style={{ backgroundColor: "#c4a747" }}
                  >
                    ✨ Upgrade to Pro
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right: Sheet Preview */}
          <div className="lg:col-span-2">
            <div className="rounded-xl p-5 sticky top-4" style={{ backgroundColor: "white", border: "2px solid #e8ddd3" }}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-semibold" style={{ color: "#3d3935", fontFamily: "'Poppins', sans-serif" }}>
                  Live Preview
                </h2>
                <span className="text-xs font-medium" style={{ color: "#6b8e7f" }}>
                  {activeSpec.columns}×{activeSpec.rows}
                </span>
              </div>
              <div className="avery-sheet-container rounded-lg overflow-hidden" style={{ border: "1px solid #e8ddd3" }}>
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

      {/* Upgrade Modal - Premium Design */}
      {showUpgrade && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="rounded-2xl shadow-2xl max-w-md w-full p-8 animate-in" style={{ backgroundColor: "#f5ede5" }}>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: "#d97562" }}>
                <span style={{ fontSize: "32px" }}>✨</span>
              </div>

              {!verifyMode ? (
                <>
                  <h3 className="text-2xl font-bold mb-3" style={{ color: "#3d3935", fontFamily: "'Poppins', sans-serif" }}>
                    Upgrade to Pro
                  </h3>
                  <p className="text-sm mb-6" style={{ color: "#6b8e7f" }}>
                    Unlock unlimited labels, all Avery sizes, templates, and premium features for your label creation.
                  </p>

                  <div className="space-y-2 mb-6">
                    <a
                      href={STRIPE_LINKS.monthly}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full px-4 py-3 text-white text-sm font-medium rounded-lg transition-all hover:shadow-lg"
                      style={{ backgroundColor: "#d97562" }}
                    >
                      $3.99/month
                    </a>
                    <a
                      href={STRIPE_LINKS.yearly}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full px-4 py-3 text-white text-sm font-medium rounded-lg transition-all hover:shadow-lg"
                      style={{ backgroundColor: "#c4a747" }}
                    >
                      $29.99/year — Save 37% ✓
                    </a>
                  </div>

                  <button
                    onClick={() => setVerifyMode(true)}
                    className="text-sm font-medium mb-3 block mx-auto"
                    style={{ color: "#d97562" }}
                  >
                    Already purchased? Verify access
                  </button>
                </>
              ) : (
                <>
                  <h3 className="text-2xl font-bold mb-3" style={{ color: "#3d3935", fontFamily: "'Poppins', sans-serif" }}>
                    Verify Access
                  </h3>
                  <p className="text-sm mb-4" style={{ color: "#6b8e7f" }}>
                    Enter your checkout email to unlock Pro features.
                  </p>

                  <div className="space-y-3 mb-6">
                    <input
                      type="email"
                      value={verifyEmail}
                      onChange={(e) => setVerifyEmail(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleVerifyAccess()}
                      placeholder="you@example.com"
                      className="w-full px-4 py-3 text-sm rounded-lg"
                      style={{ backgroundColor: "white", border: "2px solid #e8ddd3", color: "#3d3935" }}
                    />
                    {verifyError && (
                      <p className="text-sm font-medium" style={{ color: "#d97562" }}>{verifyError}</p>
                    )}
                    <button
                      onClick={handleVerifyAccess}
                      disabled={verifyLoading}
                      className="w-full px-4 py-3 text-white text-sm font-medium rounded-lg transition-all"
                      style={{ backgroundColor: "#d97562", opacity: verifyLoading ? 0.7 : 1 }}
                    >
                      {verifyLoading ? "Checking..." : "Verify Access"}
                    </button>
                  </div>

                  <button
                    onClick={() => {
                      setVerifyMode(false);
                      setVerifyError("");
                    }}
                    className="text-sm font-medium block mx-auto"
                    style={{ color: "#d97562" }}
                  >
                    Back to options
                  </button>
                </>
              )}

              <button
                onClick={() => {
                  setShowUpgrade(false);
                  setVerifyMode(false);
                  setVerifyError("");
                }}
                className="text-sm font-medium mt-4"
                style={{ color: "#6b8e7f" }}
              >
                Maybe later
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="mt-16 border-t py-8 px-4" style={{ backgroundColor: "#f5ede5", borderColor: "#e8ddd3" }}>
        <div className="max-w-7xl mx-auto text-center text-sm" style={{ color: "#6b8e7f" }}>
          <p className="font-medium mb-2">
            Printable Label Maker — Create beautiful custom labels for every occasion
          </p>
          <p>
            Free & unlimited Pro options for address, shipping, jar, and sticker labels
          </p>
        </div>
      </footer>
    </div>
  );
}
