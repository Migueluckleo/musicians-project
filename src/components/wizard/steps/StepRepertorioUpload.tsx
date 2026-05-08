"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { FileSpreadsheet, Upload } from "lucide-react";

interface ParsedSong {
  row: number;
  title: string;
  artist: string | null;
}

interface ParsedError {
  row: number;
  reason: string;
}

export function StepRepertorioUpload({
  providerId,
  onImported,
}: {
  providerId: string;
  onImported: () => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [validRows, setValidRows] = useState<ParsedSong[]>([]);
  const [invalidRows, setInvalidRows] = useState<ParsedError[]>([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const upload = async (confirm = false) => {
    if (!file) return;
    setLoading(true);
    setMessage("");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("confirm", String(confirm));

    const res = await fetch(`/api/providers/${providerId}/repertoire/upload`, {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setMessage(data.error || "No pudimos leer el archivo.");
      return;
    }

    setValidRows(data.validRows || []);
    setInvalidRows(data.invalidRows || []);

    if (confirm) {
      setMessage(`Se importaron ${data.imported} canciones.`);
      setFile(null);
      setValidRows([]);
      setInvalidRows([]);
      onImported();
    }
  };

  return (
    <div className="rounded-2xl border border-airbnb-border bg-white p-4">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-airbnb-red-light text-airbnb-red">
          <FileSpreadsheet className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-airbnb-dark">Carga masiva</h3>
          <p className="mt-1 text-xs leading-5 text-airbnb-gray">
            Sube un CSV o Excel con columnas <strong>title</strong> y{" "}
            <strong>artist</strong>. También aceptamos “titulo” y “artista”.
          </p>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <input
          type="file"
          accept=".csv,.xlsx,.xls"
          onChange={(event) => setFile(event.target.files?.[0] || null)}
          className="block w-full rounded-xl border border-airbnb-border bg-airbnb-bg-light px-3 py-3 text-sm"
        />
        <Button
          type="button"
          variant="outline"
          onClick={() => upload(false)}
          disabled={!file}
          loading={loading}
          className="gap-2"
        >
          <Upload className="h-4 w-4" />
          Revisar
        </Button>
      </div>

      {message && (
        <div className="mt-3 rounded-xl bg-airbnb-bg-light p-3 text-sm text-airbnb-gray">
          {message}
        </div>
      )}

      {(validRows.length > 0 || invalidRows.length > 0) && (
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <div className="rounded-xl border border-green-200 bg-green-50 p-3">
            <p className="text-sm font-semibold text-green-900">
              {validRows.length} filas listas
            </p>
            <div className="mt-2 max-h-36 overflow-auto text-xs text-green-800">
              {validRows.slice(0, 20).map((row) => (
                <p key={`${row.row}-${row.title}`}>
                  Fila {row.row}: {row.title}
                  {row.artist ? ` — ${row.artist}` : ""}
                </p>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-red-200 bg-red-50 p-3">
            <p className="text-sm font-semibold text-red-900">
              {invalidRows.length} filas con atención
            </p>
            <div className="mt-2 max-h-36 overflow-auto text-xs text-red-800">
              {invalidRows.length === 0
                ? "Sin errores."
                : invalidRows.map((row) => (
                    <p key={`${row.row}-${row.reason}`}>
                      Fila {row.row}: {row.reason}
                    </p>
                  ))}
            </div>
          </div>
        </div>
      )}

      {validRows.length > 0 && (
        <Button
          type="button"
          onClick={() => upload(true)}
          loading={loading}
          className="mt-4"
          fullWidth
        >
          Confirmar e importar canciones válidas
        </Button>
      )}
    </div>
  );
}
