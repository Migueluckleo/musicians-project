"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { WizardShell } from "@/components/wizard/WizardShell";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { StepRepertorioUpload } from "@/components/wizard/steps/StepRepertorioUpload";
import { Plus, Trash2, Music2 } from "lucide-react";

interface Song { id: string; title: string; artist: string | null }

interface Props {
  profile: { id: string; repertoireSongs: Song[] };
  stepIndex: number;
  totalSteps: number;
  prevStep: string;
  nextStep: string;
}

export function StepRepertorio({ profile, stepIndex, totalSteps, prevStep, nextStep }: Props) {
  const router = useRouter();
  const [songs, setSongs] = useState<Song[]>(profile.repertoireSongs);
  const [newSong, setNewSong] = useState({ title: "", artist: "" });
  const [adding, setAdding] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAdd = async () => {
    if (!newSong.title.trim()) return;
    setAdding(true);

    const res = await fetch(`/api/providers/${profile.id}/repertoire`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: newSong.title.trim(), artist: newSong.artist.trim() || null }),
    });

    if (res.ok) {
      const data = await res.json();
      setSongs((prev) => [...prev, data.song]);
      setNewSong({ title: "", artist: "" });
    } else {
      setError("Error al agregar la canción.");
    }
    setAdding(false);
  };

  const handleDelete = async (songId: string) => {
    const res = await fetch(`/api/providers/${profile.id}/repertoire/${songId}`, {
      method: "DELETE",
    });
    if (res.ok) setSongs((prev) => prev.filter((s) => s.id !== songId));
  };

  const handleNext = () => {
    setLoading(true);
    router.push(nextStep);
  };

  const refreshSongs = async () => {
    const res = await fetch(`/api/providers/${profile.id}/repertoire`);
    if (res.ok) {
      const data = await res.json();
      setSongs(data.songs || []);
      router.refresh();
    }
  };

  return (
    <WizardShell
      stepIndex={stepIndex}
      totalSteps={totalSteps}
      title="Tu repertorio"
      subtitle="Agrega canciones que tocas. Esto ayuda a los contratantes a evaluar si eres la opción ideal."
      prevStep={prevStep}
      onNext={handleNext}
      loading={loading}
      nextLabel="Siguiente"
    >
      <div className="space-y-5">
        <StepRepertorioUpload providerId={profile.id} onImported={refreshSongs} />

        {/* Add song form */}
        <div className="bg-airbnb-bg-light rounded-2xl p-4 space-y-3">
          <h3 className="text-sm font-semibold text-airbnb-dark">Agregar canción</h3>
          <div className="grid grid-cols-2 gap-3">
            <Input
              placeholder="Nombre de la canción"
              value={newSong.title}
              onChange={(e) => setNewSong({ ...newSong, title: e.target.value })}
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            />
            <Input
              placeholder="Artista (opcional)"
              value={newSong.artist}
              onChange={(e) => setNewSong({ ...newSong, artist: e.target.value })}
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            />
          </div>
          <Button
            onClick={handleAdd}
            loading={adding}
            disabled={!newSong.title.trim()}
            size="sm"
            className="w-auto flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Agregar
          </Button>
          {error && <p className="text-xs text-red-500">{error}</p>}
        </div>

        {/* Songs list */}
        {songs.length > 0 ? (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-airbnb-dark">
                Canciones agregadas
              </h3>
              <span className="text-xs font-medium text-airbnb-red bg-airbnb-red-light px-2.5 py-1 rounded-full">
                {songs.length} {songs.length === 1 ? "canción" : "canciones"}
              </span>
            </div>
            <div className="divide-y divide-airbnb-border border border-airbnb-border rounded-xl overflow-hidden">
              {songs.map((song) => (
                <div
                  key={song.id}
                  className="flex items-center justify-between px-4 py-3 bg-white hover:bg-airbnb-bg-hover transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Music2 className="w-4 h-4 text-airbnb-gray flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-airbnb-dark truncate">
                        {song.title}
                      </p>
                      {song.artist && (
                        <p className="text-xs text-airbnb-gray truncate">{song.artist}</p>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(song.id)}
                    className="p-1.5 rounded-lg hover:bg-red-50 text-airbnb-gray hover:text-red-500 transition-colors flex-shrink-0"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-10 text-center border-2 border-dashed border-airbnb-border rounded-2xl">
            <Music2 className="w-8 h-8 text-airbnb-border mb-3" />
            <p className="text-sm font-medium text-airbnb-gray">
              Aún no has agregado canciones
            </p>
            <p className="text-xs text-airbnb-gray-light mt-1">
              Puedes saltarte este paso y agregarlo después
            </p>
          </div>
        )}

        <p className="text-xs text-airbnb-gray">
          El repertorio es opcional pero aumenta la confianza de los contratantes.
        </p>
      </div>
    </WizardShell>
  );
}
