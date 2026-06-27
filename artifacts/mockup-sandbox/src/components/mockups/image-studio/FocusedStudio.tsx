import { useState } from "react";
import { X, Wand2, Download, Image, Sparkles, Loader2, ChevronRight } from "lucide-react";

const ASPECT_RATIOS = [
  { label: "Square", sub: "1:1", width: 1024, height: 1024 },
  { label: "Portrait", sub: "3:4", width: 768, height: 1024 },
  { label: "Landscape", sub: "4:3", width: 1024, height: 768 },
  { label: "Wide", sub: "16:9", width: 1280, height: 720 },
];

const STYLE_PRESETS = [
  { label: "Sacred Geometry", icon: "✦", suffix: ", sacred geometry, golden ratio, mystical, detailed" },
  { label: "Cosmic / Space", icon: "✦", suffix: ", cosmic, nebula, galaxy, space art, vibrant colors" },
  { label: "Spiritual Art", icon: "✦", suffix: ", spiritual, ethereal, divine light, meditation, serene" },
  { label: "Ancient Symbols", icon: "✦", suffix: ", ancient symbols, stone carvings, archaeological, mystical" },
  { label: "Fantasy", icon: "✦", suffix: ", fantasy art, magical, glowing, detailed illustration" },
  { label: "Photorealistic", icon: "✦", suffix: ", photorealistic, 8k, ultra detailed, cinematic lighting" },
  { label: "Oil Painting", icon: "✦", suffix: ", oil painting, classical art, detailed brushwork, gallery quality" },
  { label: "Digital Art", icon: "✦", suffix: ", digital art, concept art, trending on artstation, vibrant" },
];

const PROMPT_IDEAS = [
  "A sacred lotus floating on cosmic water with golden light rays",
  "Metatron's cube glowing with divine energy in space",
  "Ancient Egyptian temple at sunrise with sacred hieroglyphs",
  "The flower of life mandala emanating rainbow light",
  "Tree of Life with roots in the earth and branches in the stars",
  "A crystal merkaba star rotating in golden light",
];

interface GeneratedImage {
  url: string;
  prompt: string;
  timestamp: number;
}

export function FocusedStudio() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [selectedRatio, setSelectedRatio] = useState(ASPECT_RATIOS[0]);
  const [selectedStyle, setSelectedStyle] = useState(STYLE_PRESETS[0]);
  const [selectedImage, setSelectedImage] = useState<GeneratedImage | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [ideasOpen, setIdeasOpen] = useState(false);

  const generateImage = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setError(null);

    const fullPrompt = prompt.trim() + selectedStyle.suffix;
    const seed = Math.floor(Math.random() * 999999);
    const encodedPrompt = encodeURIComponent(fullPrompt);
    const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=${selectedRatio.width}&height=${selectedRatio.height}&seed=${seed}&nologo=true`;

    try {
      const img = new window.Image();
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error("Generation failed. Please try again."));
        img.src = imageUrl;
        setTimeout(() => reject(new Error("Timed out. Try a simpler prompt.")), 60000);
      });
      const newImage: GeneratedImage = { url: imageUrl, prompt: fullPrompt, timestamp: Date.now() };
      setImages(prev => [newImage, ...prev]);
      setSelectedImage(newImage);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Generation failed");
    } finally {
      setLoading(false);
    }
  };

  const downloadImage = async (imageUrl: string) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `uuon_pstudio_${Date.now()}.png`;
      link.click();
      URL.revokeObjectURL(url);
    } catch {
      window.open(imageUrl, "_blank");
    }
  };

  return (
    <div className="fixed inset-0 flex flex-col" style={{ background: "#080810", fontFamily: "'Inter', sans-serif" }}>
      {/* Header */}
      <div
        className="flex items-center justify-between px-6 py-3 flex-shrink-0"
        style={{ borderBottom: "1px solid rgba(139,92,246,0.2)", background: "rgba(8,8,18,0.95)" }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #7c3aed, #db2777)" }}
          >
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-white" style={{ fontSize: 16, letterSpacing: "-0.02em" }}>
              AI Image Studio
            </h1>
            <p style={{ fontSize: 11, color: "#6b7280" }}>Text to image · UUON Pstudio</p>
          </div>
        </div>
        <button
          className="rounded-lg p-1.5 transition-colors"
          style={{ color: "#6b7280" }}
          onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
          onMouseLeave={e => (e.currentTarget.style.color = "#6b7280")}
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div
          className="flex-shrink-0 flex flex-col overflow-y-auto"
          style={{ width: 288, borderRight: "1px solid rgba(139,92,246,0.15)", background: "rgba(12,12,24,0.6)" }}
        >
          <div className="p-4 space-y-5">

            {/* Prompt */}
            <div>
              <label style={{ fontSize: 10, fontWeight: 700, color: "#a78bfa", letterSpacing: "0.1em", textTransform: "uppercase" }} className="block mb-2">
                Prompt
              </label>
              <div className="relative">
                <textarea
                  value={prompt}
                  onChange={e => setPrompt(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); generateImage(); } }}
                  placeholder="Describe your image..."
                  className="w-full resize-none rounded-xl p-3 text-sm text-white transition-all"
                  style={{
                    height: 100,
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(139,92,246,0.25)",
                    outline: "none",
                    fontSize: 13,
                    lineHeight: 1.5,
                    color: "#e5e7eb",
                  }}
                  onFocus={e => { e.currentTarget.style.borderColor = "rgba(139,92,246,0.6)"; e.currentTarget.style.background = "rgba(255,255,255,0.06)"; }}
                  onBlur={e => { e.currentTarget.style.borderColor = "rgba(139,92,246,0.25)"; e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}
                />
              </div>
              <p style={{ fontSize: 11, color: "#4b5563", marginTop: 4 }}>Press Enter to generate</p>
            </div>

            {/* Divider */}
            <div style={{ height: 1, background: "rgba(139,92,246,0.1)" }} />

            {/* Style */}
            <div>
              <label style={{ fontSize: 10, fontWeight: 700, color: "#a78bfa", letterSpacing: "0.1em", textTransform: "uppercase" }} className="block mb-2.5">
                Style
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {STYLE_PRESETS.map(style => (
                  <button
                    key={style.label}
                    onClick={() => setSelectedStyle(style)}
                    className="text-left rounded-lg px-2.5 py-2 transition-all"
                    style={{
                      fontSize: 12,
                      fontWeight: 500,
                      border: selectedStyle.label === style.label
                        ? "1px solid rgba(167,139,250,0.7)"
                        : "1px solid rgba(255,255,255,0.07)",
                      background: selectedStyle.label === style.label
                        ? "rgba(124,58,237,0.2)"
                        : "rgba(255,255,255,0.03)",
                      color: selectedStyle.label === style.label ? "#c4b5fd" : "#9ca3af",
                    }}
                  >
                    {style.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Divider */}
            <div style={{ height: 1, background: "rgba(139,92,246,0.1)" }} />

            {/* Aspect Ratio */}
            <div>
              <label style={{ fontSize: 10, fontWeight: 700, color: "#a78bfa", letterSpacing: "0.1em", textTransform: "uppercase" }} className="block mb-2.5">
                Aspect Ratio
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {ASPECT_RATIOS.map(ratio => (
                  <button
                    key={ratio.label}
                    onClick={() => setSelectedRatio(ratio)}
                    className="flex flex-col items-center rounded-lg py-2 transition-all"
                    style={{
                      border: selectedRatio.label === ratio.label
                        ? "1px solid rgba(167,139,250,0.7)"
                        : "1px solid rgba(255,255,255,0.07)",
                      background: selectedRatio.label === ratio.label
                        ? "rgba(124,58,237,0.2)"
                        : "rgba(255,255,255,0.03)",
                    }}
                  >
                    <div
                      className="mb-1 rounded-sm"
                      style={{
                        width: ratio.width > ratio.height ? 18 : ratio.width === ratio.height ? 14 : 11,
                        height: ratio.width < ratio.height ? 18 : ratio.width === ratio.height ? 14 : 11,
                        background: selectedRatio.label === ratio.label ? "rgba(167,139,250,0.6)" : "rgba(255,255,255,0.2)",
                      }}
                    />
                    <span style={{ fontSize: 10, color: selectedRatio.label === ratio.label ? "#c4b5fd" : "#6b7280", fontWeight: 500 }}>
                      {ratio.sub}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Generate */}
            <button
              onClick={generateImage}
              disabled={loading || !prompt.trim()}
              className="w-full flex items-center justify-center gap-2 rounded-xl font-semibold transition-all"
              style={{
                height: 44,
                fontSize: 14,
                background: loading || !prompt.trim()
                  ? "rgba(124,58,237,0.3)"
                  : "linear-gradient(135deg, #7c3aed, #db2777)",
                color: loading || !prompt.trim() ? "rgba(255,255,255,0.4)" : "#fff",
                border: "none",
                cursor: loading || !prompt.trim() ? "not-allowed" : "pointer",
                boxShadow: loading || !prompt.trim() ? "none" : "0 0 20px rgba(124,58,237,0.4)",
              }}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Generating…
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4" />
                  Generate Image
                </>
              )}
            </button>

            {error && (
              <div className="rounded-xl p-3 text-xs" style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", color: "#fca5a5" }}>
                {error}
              </div>
            )}

            {/* Divider */}
            <div style={{ height: 1, background: "rgba(139,92,246,0.1)" }} />

            {/* Ideas — collapsible */}
            <div>
              <button
                onClick={() => setIdeasOpen(v => !v)}
                className="w-full flex items-center justify-between"
                style={{ color: "#6b7280" }}
              >
                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>Ideas</span>
                <ChevronRight
                  className="w-3.5 h-3.5 transition-transform"
                  style={{ transform: ideasOpen ? "rotate(90deg)" : "none" }}
                />
              </button>
              {ideasOpen && (
                <div className="mt-2 space-y-0.5">
                  {PROMPT_IDEAS.map((idea, i) => (
                    <button
                      key={i}
                      onClick={() => setPrompt(idea)}
                      className="w-full text-left rounded-lg px-2.5 py-2 transition-all"
                      style={{ fontSize: 12, color: "#6b7280", lineHeight: 1.4 }}
                      onMouseEnter={e => {
                        e.currentTarget.style.color = "#c4b5fd";
                        e.currentTarget.style.background = "rgba(124,58,237,0.1)";
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.color = "#6b7280";
                        e.currentTarget.style.background = "transparent";
                      }}
                    >
                      {idea}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main canvas */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 flex items-center justify-center p-8" style={{ background: "rgba(6,6,14,0.4)" }}>
            {loading ? (
              <div className="text-center space-y-5">
                <div
                  className="w-20 h-20 rounded-2xl mx-auto flex items-center justify-center"
                  style={{
                    background: "linear-gradient(135deg, rgba(124,58,237,0.3), rgba(219,39,119,0.3))",
                    border: "1px solid rgba(139,92,246,0.3)",
                    animation: "pulse 2s infinite",
                  }}
                >
                  <Sparkles className="w-9 h-9 text-purple-400" />
                </div>
                <div>
                  <p className="font-semibold" style={{ color: "#c4b5fd", fontSize: 15 }}>Generating your image…</p>
                  <p style={{ color: "#4b5563", fontSize: 12, marginTop: 4 }}>Usually takes 10–30 seconds</p>
                </div>
                <div
                  className="rounded-full overflow-hidden mx-auto"
                  style={{ width: 200, height: 2, background: "rgba(139,92,246,0.2)" }}
                >
                  <div
                    style={{
                      height: "100%",
                      background: "linear-gradient(90deg, #7c3aed, #db2777)",
                      animation: "shimmer 2s infinite",
                      width: "60%",
                    }}
                  />
                </div>
              </div>
            ) : selectedImage ? (
              <div className="relative max-h-full max-w-full group">
                <img
                  src={selectedImage.url}
                  alt={selectedImage.prompt}
                  className="max-h-full max-w-full object-contain rounded-2xl"
                  style={{
                    maxHeight: "calc(100vh - 280px)",
                    border: "1px solid rgba(139,92,246,0.2)",
                    boxShadow: "0 0 60px rgba(124,58,237,0.15)",
                  }}
                />
                <div
                  className="absolute bottom-0 left-0 right-0 rounded-b-2xl p-4 flex items-end justify-between opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ background: "linear-gradient(to top, rgba(0,0,0,0.9), transparent)" }}
                >
                  <p className="text-xs flex-1 mr-3" style={{ color: "#d1d5db", lineHeight: 1.5 }}>
                    {selectedImage.prompt.slice(0, 120)}…
                  </p>
                  <button
                    onClick={() => downloadImage(selectedImage.url)}
                    className="flex items-center gap-1.5 rounded-xl px-3 py-2 flex-shrink-0 font-semibold transition-all"
                    style={{ background: "rgba(124,58,237,0.9)", color: "#fff", fontSize: 12, border: "none" }}
                  >
                    <Download className="w-3.5 h-3.5" />
                    Save
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center space-y-4" style={{ opacity: 0.35 }}>
                <div
                  className="w-20 h-20 rounded-2xl mx-auto flex items-center justify-center"
                  style={{ border: "2px dashed rgba(139,92,246,0.4)" }}
                >
                  <Image className="w-9 h-9" style={{ color: "#a78bfa" }} />
                </div>
                <div>
                  <p className="font-medium" style={{ color: "#9ca3af", fontSize: 14 }}>Your image will appear here</p>
                  <p style={{ color: "#4b5563", fontSize: 12, marginTop: 3 }}>Type a prompt and click Generate</p>
                </div>
              </div>
            )}
          </div>

          {/* History */}
          {images.length > 0 && (
            <div
              className="flex-shrink-0 p-3"
              style={{ borderTop: "1px solid rgba(139,92,246,0.15)", background: "rgba(8,8,18,0.8)" }}
            >
              <p style={{ fontSize: 11, color: "#4b5563", marginBottom: 8, fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase" }}>
                History · {images.length}
              </p>
              <div className="flex gap-2 overflow-x-auto pb-1">
                {images.map(img => (
                  <div
                    key={img.timestamp}
                    onClick={() => setSelectedImage(img)}
                    className="flex-shrink-0 cursor-pointer rounded-xl overflow-hidden transition-all"
                    style={{
                      border: selectedImage?.timestamp === img.timestamp
                        ? "2px solid rgba(167,139,250,0.8)"
                        : "2px solid rgba(255,255,255,0.08)",
                      boxShadow: selectedImage?.timestamp === img.timestamp ? "0 0 12px rgba(124,58,237,0.3)" : "none",
                    }}
                  >
                    <img src={img.url} alt={img.prompt} className="w-16 h-16 object-cover" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.6; } }
        @keyframes shimmer { 0% { transform: translateX(-100%); } 100% { transform: translateX(200%); } }
      `}</style>
    </div>
  );
}
