import { useState } from "react";
import { X, Wand2, Download, Image, Sparkles, Loader2, ZapIcon } from "lucide-react";

const ASPECT_RATIOS = [
  { label: "Square 1:1", width: 1024, height: 1024, icon: "■" },
  { label: "Portrait 3:4", width: 768, height: 1024, icon: "▬" },
  { label: "Landscape 4:3", width: 1024, height: 768, icon: "▬" },
  { label: "Wide 16:9", width: 1280, height: 720, icon: "▬" },
];

const STYLE_PRESETS = [
  { label: "Sacred Geometry", suffix: ", sacred geometry, golden ratio, mystical, detailed" },
  { label: "Cosmic / Space", suffix: ", cosmic, nebula, galaxy, space art, vibrant colors" },
  { label: "Spiritual Art", suffix: ", spiritual, ethereal, divine light, meditation, serene" },
  { label: "Ancient Symbols", suffix: ", ancient symbols, stone carvings, archaeological, mystical" },
  { label: "Fantasy", suffix: ", fantasy art, magical, glowing, detailed illustration" },
  { label: "Photorealistic", suffix: ", photorealistic, 8k, ultra detailed, cinematic lighting" },
  { label: "Oil Painting", suffix: ", oil painting, classical art, detailed brushwork, gallery quality" },
  { label: "Digital Art", suffix: ", digital art, concept art, trending on artstation, vibrant" },
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

export function LuminousGallery() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [selectedRatio, setSelectedRatio] = useState(ASPECT_RATIOS[0]);
  const [selectedStyle, setSelectedStyle] = useState(STYLE_PRESETS[0]);
  const [selectedImage, setSelectedImage] = useState<GeneratedImage | null>(null);
  const [error, setError] = useState<string | null>(null);

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
    <div
      className="fixed inset-0 flex flex-col"
      style={{
        background: "radial-gradient(ellipse at 20% 50%, rgba(76,29,149,0.12) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(219,39,119,0.08) 0%, transparent 50%), #070711",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-6 py-3.5 flex-shrink-0"
        style={{
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          background: "rgba(7,7,17,0.85)",
          backdropFilter: "blur(20px)",
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center relative"
            style={{ background: "linear-gradient(135deg, #6d28d9 0%, #be185d 100%)" }}
          >
            <Sparkles className="w-4.5 h-4.5 text-white" style={{ width: 18, height: 18 }} />
            <div
              className="absolute inset-0 rounded-xl"
              style={{ boxShadow: "0 0 16px rgba(109,40,217,0.6)", pointerEvents: "none" }}
            />
          </div>
          <div>
            <h1
              className="font-bold"
              style={{
                fontSize: 17,
                letterSpacing: "-0.03em",
                background: "linear-gradient(90deg, #e9d5ff, #fbcfe8)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              AI Image Studio
            </h1>
            <p style={{ fontSize: 11, color: "#4b5563" }}>Text to image generation · UUON Pstudio</p>
          </div>
        </div>
        <button style={{ color: "#4b5563", background: "none", border: "none", cursor: "pointer", padding: 4 }}>
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar — narrow, clean */}
        <div
          className="flex-shrink-0 flex flex-col overflow-y-auto"
          style={{ width: 260, borderRight: "1px solid rgba(255,255,255,0.05)" }}
        >
          <div className="p-4 space-y-4">

            {/* Prompt */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label style={{ fontSize: 11, fontWeight: 600, color: "#7c3aed", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                  Prompt
                </label>
                <span style={{ fontSize: 11, color: "#374151" }}>{prompt.length}/300</span>
              </div>
              <textarea
                value={prompt}
                onChange={e => setPrompt(e.target.value.slice(0, 300))}
                onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); generateImage(); } }}
                placeholder="Describe your image…"
                className="w-full resize-none text-sm"
                style={{
                  height: 96,
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 12,
                  padding: "10px 12px",
                  fontSize: 13,
                  color: "#e5e7eb",
                  outline: "none",
                  lineHeight: 1.5,
                }}
                onFocus={e => (e.currentTarget.style.borderColor = "rgba(124,58,237,0.5)")}
                onBlur={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)")}
              />
            </div>

            {/* Quick ideas */}
            <div>
              <p style={{ fontSize: 10, color: "#374151", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>
                Quick ideas
              </p>
              <div className="space-y-0.5">
                {PROMPT_IDEAS.map((idea, i) => (
                  <button
                    key={i}
                    onClick={() => setPrompt(idea)}
                    className="w-full text-left rounded-lg px-2.5 py-1.5 transition-all group"
                    style={{ fontSize: 11.5, color: "#4b5563", lineHeight: 1.4 }}
                    onMouseEnter={e => {
                      e.currentTarget.style.color = "#a78bfa";
                      e.currentTarget.style.background = "rgba(124,58,237,0.08)";
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.color = "#4b5563";
                      e.currentTarget.style.background = "transparent";
                    }}
                  >
                    {idea}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ height: 1, background: "rgba(255,255,255,0.05)" }} />

            {/* Style — horizontal scroll pills */}
            <div>
              <label style={{ fontSize: 11, fontWeight: 600, color: "#7c3aed", letterSpacing: "0.08em", textTransform: "uppercase" }} className="block mb-2">
                Style
              </label>
              <div className="flex flex-wrap gap-1.5">
                {STYLE_PRESETS.map(style => (
                  <button
                    key={style.label}
                    onClick={() => setSelectedStyle(style)}
                    className="rounded-full px-3 py-1 transition-all"
                    style={{
                      fontSize: 11.5,
                      fontWeight: 500,
                      border: selectedStyle.label === style.label
                        ? "1px solid rgba(167,139,250,0.7)"
                        : "1px solid rgba(255,255,255,0.08)",
                      background: selectedStyle.label === style.label
                        ? "rgba(109,40,217,0.25)"
                        : "rgba(255,255,255,0.03)",
                      color: selectedStyle.label === style.label ? "#c4b5fd" : "#6b7280",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {style.label}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ height: 1, background: "rgba(255,255,255,0.05)" }} />

            {/* Aspect ratio */}
            <div>
              <label style={{ fontSize: 11, fontWeight: 600, color: "#7c3aed", letterSpacing: "0.08em", textTransform: "uppercase" }} className="block mb-2">
                Aspect Ratio
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {ASPECT_RATIOS.map(ratio => (
                  <button
                    key={ratio.label}
                    onClick={() => setSelectedRatio(ratio)}
                    className="text-left rounded-xl px-3 py-2 transition-all"
                    style={{
                      border: selectedRatio.label === ratio.label
                        ? "1px solid rgba(167,139,250,0.6)"
                        : "1px solid rgba(255,255,255,0.06)",
                      background: selectedRatio.label === ratio.label
                        ? "rgba(109,40,217,0.2)"
                        : "rgba(255,255,255,0.02)",
                      fontSize: 12,
                      fontWeight: 500,
                      color: selectedRatio.label === ratio.label ? "#c4b5fd" : "#6b7280",
                    }}
                  >
                    {ratio.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Generate button */}
            <button
              onClick={generateImage}
              disabled={loading || !prompt.trim()}
              className="w-full flex items-center justify-center gap-2 rounded-2xl font-semibold transition-all relative overflow-hidden"
              style={{
                height: 48,
                fontSize: 14,
                letterSpacing: "-0.01em",
                background: loading || !prompt.trim()
                  ? "rgba(109,40,217,0.2)"
                  : "linear-gradient(135deg, #6d28d9, #be185d)",
                color: loading || !prompt.trim() ? "rgba(255,255,255,0.35)" : "#fff",
                border: loading || !prompt.trim()
                  ? "1px solid rgba(109,40,217,0.3)"
                  : "none",
                cursor: loading || !prompt.trim() ? "not-allowed" : "pointer",
                boxShadow: loading || !prompt.trim() ? "none" : "0 4px 24px rgba(109,40,217,0.35), 0 0 0 1px rgba(109,40,217,0.5)",
              }}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Generating…
                </>
              ) : (
                <>
                  <ZapIcon className="w-4 h-4" />
                  Generate Image
                </>
              )}
            </button>

            {error && (
              <div className="rounded-xl p-3" style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", fontSize: 12, color: "#fca5a5" }}>
                {error}
              </div>
            )}
          </div>
        </div>

        {/* Gallery area */}
        <div className="flex-1 flex flex-col overflow-hidden">

          {/* Main preview */}
          <div className="flex-1 flex items-center justify-center p-8 relative overflow-hidden">
            {/* subtle grid bg */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage: "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)",
                backgroundSize: "40px 40px",
              }}
            />

            {loading ? (
              <div className="text-center relative z-10">
                <div className="relative inline-flex items-center justify-center mb-6">
                  <div
                    className="w-24 h-24 rounded-3xl flex items-center justify-center"
                    style={{
                      background: "linear-gradient(135deg, rgba(109,40,217,0.3), rgba(190,24,93,0.3))",
                      border: "1px solid rgba(167,139,250,0.25)",
                    }}
                  >
                    <Sparkles className="w-10 h-10 text-purple-400" />
                  </div>
                  <div
                    className="absolute inset-0 rounded-3xl"
                    style={{
                      border: "1px solid rgba(167,139,250,0.4)",
                      animation: "ping 1.5s ease-out infinite",
                      opacity: 0,
                    }}
                  />
                </div>
                <p className="font-semibold mb-1.5" style={{ color: "#e9d5ff", fontSize: 16 }}>Creating your vision…</p>
                <p style={{ color: "#374151", fontSize: 12.5 }}>Usually takes 10–30 seconds</p>
                <div
                  className="mx-auto mt-4 rounded-full overflow-hidden"
                  style={{ width: 180, height: 2, background: "rgba(109,40,217,0.2)" }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: "40%",
                      background: "linear-gradient(90deg, #6d28d9, #be185d)",
                      borderRadius: "9999px",
                      animation: "slide 1.8s ease-in-out infinite",
                    }}
                  />
                </div>
              </div>
            ) : selectedImage ? (
              <div className="relative max-h-full max-w-full group z-10">
                <img
                  src={selectedImage.url}
                  alt={selectedImage.prompt}
                  className="max-h-full max-w-full object-contain rounded-2xl"
                  style={{
                    maxHeight: "calc(100vh - 260px)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    boxShadow: "0 0 80px rgba(109,40,217,0.2), 0 20px 60px rgba(0,0,0,0.5)",
                  }}
                />
                <div
                  className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <button
                    onClick={() => downloadImage(selectedImage.url)}
                    className="flex items-center gap-1.5 rounded-xl px-3 py-2 font-semibold"
                    style={{
                      background: "rgba(0,0,0,0.7)",
                      color: "#fff",
                      fontSize: 12,
                      border: "1px solid rgba(255,255,255,0.1)",
                      backdropFilter: "blur(12px)",
                    }}
                  >
                    <Download className="w-3.5 h-3.5" />
                    Save
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center relative z-10">
                <div
                  className="w-24 h-24 rounded-3xl mx-auto flex items-center justify-center mb-5"
                  style={{
                    background: "rgba(255,255,255,0.02)",
                    border: "1.5px dashed rgba(109,40,217,0.3)",
                  }}
                >
                  <Image className="w-10 h-10" style={{ color: "#4c1d95", opacity: 0.6 }} />
                </div>
                <p className="font-semibold mb-1.5" style={{ color: "#374151", fontSize: 15 }}>Ready to create</p>
                <p style={{ color: "#1f2937", fontSize: 13 }}>Type a prompt and click Generate</p>
              </div>
            )}
          </div>

          {/* History strip */}
          {images.length > 0 && (
            <div
              className="flex-shrink-0 p-3 pt-2.5"
              style={{ borderTop: "1px solid rgba(255,255,255,0.05)", background: "rgba(4,4,12,0.7)", backdropFilter: "blur(12px)" }}
            >
              <div className="flex items-center justify-between mb-2">
                <p style={{ fontSize: 10, color: "#374151", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                  Gallery · {images.length}
                </p>
                <button style={{ fontSize: 11, color: "#4c1d95" }}>See all</button>
              </div>
              <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
                {images.map(img => (
                  <button
                    key={img.timestamp}
                    onClick={() => setSelectedImage(img)}
                    className="flex-shrink-0 rounded-xl overflow-hidden transition-all"
                    style={{
                      width: 64,
                      height: 64,
                      border: selectedImage?.timestamp === img.timestamp
                        ? "2px solid rgba(167,139,250,0.8)"
                        : "2px solid rgba(255,255,255,0.06)",
                      outline: selectedImage?.timestamp === img.timestamp ? "2px solid rgba(109,40,217,0.2)" : "none",
                      outlineOffset: 2,
                    }}
                  >
                    <img src={img.url} alt={img.prompt} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes ping { 0% { transform: scale(1); opacity: 0.5; } 100% { transform: scale(1.4); opacity: 0; } }
        @keyframes slide { 0% { transform: translateX(-100%); } 50% { transform: translateX(300%); } 100% { transform: translateX(300%); } }
      `}</style>
    </div>
  );
}
