"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { WizardShell } from "@/components/wizard/WizardShell";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Youtube, Music, Upload, Trash2, Play, ExternalLink, CheckCircle2 } from "lucide-react";

interface Props {
  profile: {
    id: string;
    youtubeUrl: string | null;
    streamingUrl: string | null;
    demoAudioUrl: string | null;
  };
  stepIndex: number;
  totalSteps: number;
  prevStep: string;
  nextStep: string;
}

function extractYoutubeId(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname === "youtu.be") return u.pathname.slice(1).split("?")[0];
    if (u.hostname.includes("youtube.com")) {
      const v = u.searchParams.get("v");
      if (v) return v;
      const embed = u.pathname.match(/\/embed\/([^/?]+)/);
      if (embed) return embed[1];
    }
  } catch {}
  return null;
}

function getStreamingPlatformLabel(url: string): string {
  try {
    const h = new URL(url).hostname.toLowerCase();
    if (h.includes("spotify")) return "Spotify";
    if (h.includes("soundcloud")) return "SoundCloud";
    if (h.includes("apple")) return "Apple Music";
    if (h.includes("tidal")) return "Tidal";
    if (h.includes("deezer")) return "Deezer";
    if (h.includes("bandcamp")) return "Bandcamp";
  } catch {}
  return "Plataforma";
}

export function StepDemos({ profile, stepIndex, totalSteps, prevStep, nextStep }: Props) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);

  const [youtubeUrl, setYoutubeUrl] = useState(profile.youtubeUrl ?? "");
  const [streamingUrl, setStreamingUrl] = useState(profile.streamingUrl ?? "");
  const [demoAudioUrl, setDemoAudioUrl] = useState(profile.demoAudioUrl ?? "");

  const [saving, setSaving] = useState(false);
  const [uploadingAudio, setUploadingAudio] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const youtubeId = youtubeUrl ? extractYoutubeId(youtubeUrl) : null;
  const streamingLabel = streamingUrl ? getStreamingPlatformLabel(streamingUrl) : null;

  const handleAudioUpload = async (file: File) => {
    if (!file) return;
    const allowed = ["audio/mpeg", "audio/mp3", "audio/wav", "audio/ogg", "audio/webm"];
    if (!allowed.includes(file.type) && !file.name.match(/\.(mp3|wav|ogg|webm|m4a)$/i)) {
      setErrors((e) => ({ ...e, audio: "Solo se aceptan archivos MP3, WAV, OGG o WebM." }));
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      setErrors((e) => ({ ...e, audio: "El archivo no puede superar los 20 MB." }));
      return;
    }
    setErrors((e) => { const n = { ...e }; delete n.audio; return n; });
    setUploadingAudio(true);

    const formData = new FormData();
    formData.append("audio", file);

    const res = await fetch(`/api/providers/${profile.id}/demo-audio`, {
      method: "POST",
      body: formData,
    });

    setUploadingAudio(false);
    if (res.ok) {
      const data = await res.json();
      setDemoAudioUrl(data.demoAudioUrl);
    } else {
      setErrors((e) => ({ ...e, audio: "Error al subir el audio. Intenta de nuevo." }));
    }
  };

  const handleRemoveAudio = async () => {
    const res = await fetch(`/api/providers/${profile.id}/demo-audio`, { method: "DELETE" });
    if (res.ok) setDemoAudioUrl("");
  };

  const handleNext = async () => {
    const e: Record<string, string> = {};
    if (youtubeUrl && !extractYoutubeId(youtubeUrl)) {
      e.youtube = "El enlace de YouTube no es válido. Usa el formato https://youtube.com/watch?v=... o https://youtu.be/...";
    }
    if (streamingUrl) {
      try { new URL(streamingUrl); } catch {
        e.streaming = "El enlace de la plataforma no es válido. Asegúrate de que empiece con https://";
      }
    }
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    setErrors({});
    setSaving(true);

    const res = await fetch(`/api/providers/${profile.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        youtubeUrl: youtubeUrl.trim() || null,
        streamingUrl: streamingUrl.trim() || null,
      }),
    });

    setSaving(false);
    if (res.ok) router.push(nextStep);
    else setErrors({ general: "Error al guardar. Intenta de nuevo." });
  };

  return (
    <WizardShell
      stepIndex={stepIndex}
      totalSteps={totalSteps}
      title="Demos y muestras"
      subtitle="Ayuda a los contratantes a escucharte antes de decidir. Todos los campos son opcionales."
      prevStep={prevStep}
      onNext={handleNext}
      loading={saving}
      nextLabel="Siguiente"
    >
      <div className="space-y-6">
        {errors.general && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
            {errors.general}
          </div>
        )}

        {/* YouTube */}
        <div className="p-5 border border-airbnb-border rounded-2xl space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center flex-shrink-0">
              <Youtube className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-airbnb-dark">Video de YouTube</h3>
              <p className="text-xs text-airbnb-gray mt-0.5">
                Pega el enlace de un video tuyo. Aparecerá incrustado en tu perfil público.
              </p>
            </div>
          </div>

          <Input
            placeholder="https://youtube.com/watch?v=... o https://youtu.be/..."
            value={youtubeUrl}
            onChange={(e) => { setYoutubeUrl(e.target.value); setErrors((err) => { const n = { ...err }; delete n.youtube; return n; }); }}
          />
          {errors.youtube && <p className="text-xs text-red-500">{errors.youtube}</p>}

          {youtubeId && (
            <div className="relative w-full rounded-xl overflow-hidden bg-black" style={{ aspectRatio: "16/9" }}>
              <iframe
                src={`https://www.youtube.com/embed/${youtubeId}`}
                title="Vista previa del video"
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          )}
        </div>

        {/* Streaming link */}
        <div className="p-5 border border-airbnb-border rounded-2xl space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center flex-shrink-0">
              <Music className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-airbnb-dark">Enlace a plataforma</h3>
              <p className="text-xs text-airbnb-gray mt-0.5">
                Spotify, SoundCloud, Apple Music, Bandcamp u otra plataforma donde tengas música.
              </p>
            </div>
          </div>

          <Input
            placeholder="https://open.spotify.com/artist/... o https://soundcloud.com/..."
            value={streamingUrl}
            onChange={(e) => { setStreamingUrl(e.target.value); setErrors((err) => { const n = { ...err }; delete n.streaming; return n; }); }}
          />
          {errors.streaming && <p className="text-xs text-red-500">{errors.streaming}</p>}

          {streamingUrl && !errors.streaming && streamingLabel && (
            <div className="flex items-center gap-2 text-xs text-green-700 bg-green-50 px-3 py-2 rounded-lg">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Se mostrará como botón "{streamingLabel}" en tu perfil</span>
            </div>
          )}
        </div>

        {/* Audio upload */}
        <div className="p-5 border border-airbnb-border rounded-2xl space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-violet-50 rounded-xl flex items-center justify-center flex-shrink-0">
              <Play className="w-5 h-5 text-violet-600" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-airbnb-dark">Audio demo</h3>
              <p className="text-xs text-airbnb-gray mt-0.5">
                Sube un archivo de audio (MP3, WAV — máx. 20 MB). Los visitantes podrán escucharlo directamente en tu perfil.
              </p>
            </div>
          </div>

          {demoAudioUrl ? (
            <div className="space-y-2">
              <audio controls src={demoAudioUrl} className="w-full rounded-lg" />
              <button
                type="button"
                onClick={handleRemoveAudio}
                className="flex items-center gap-1.5 text-xs text-red-500 hover:text-red-700 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Eliminar audio
              </button>
            </div>
          ) : (
            <div>
              <input
                ref={fileRef}
                type="file"
                accept="audio/mpeg,audio/mp3,audio/wav,audio/ogg,audio/webm,.mp3,.wav,.ogg,.webm,.m4a"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleAudioUpload(file);
                  e.target.value = "";
                }}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                loading={uploadingAudio}
                onClick={() => fileRef.current?.click()}
                className="flex items-center gap-2 w-auto"
              >
                <Upload className="w-4 h-4" />
                Subir audio demo
              </Button>
            </div>
          )}
          {errors.audio && <p className="text-xs text-red-500">{errors.audio}</p>}
        </div>

        <p className="text-xs text-airbnb-gray">
          Todos los campos de esta sección son opcionales. Puedes editar o eliminar tus demos en cualquier momento desde tu perfil.
        </p>
      </div>
    </WizardShell>
  );
}
