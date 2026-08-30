"use client";

import { useRef, useState } from "react";
import Papa from "papaparse";
import { toast } from "sonner";
import { Loader2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useImportGuests } from "@/hooks/use-guests";

interface CsvRow {
  name?: string;
  fullName?: string;
  full_name?: string;
  email?: string;
  phone?: string;
}

function extractName(row: CsvRow) {
  return row.fullName || row.name || row.full_name || "";
}

export function ImportGuestsButton({ eventId }: { eventId: string }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const importGuests = useImportGuests(eventId);

  function handleFile(file: File) {
    setLoading(true);
    Papa.parse<CsvRow>(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        try {
          const guests = results.data
            .map((row) => ({
              fullName: extractName(row).trim(),
              email: row.email?.trim() || undefined,
              phone: row.phone?.trim() || undefined,
            }))
            .filter((g) => g.fullName.length > 0);

          if (guests.length === 0) {
            toast.error("No valid rows found. Expect a 'name' and optional 'email'/'phone' column.");
            return;
          }

          const { count } = await importGuests.mutateAsync(guests);
          toast.success(`Imported ${count} guest${count === 1 ? "" : "s"}`);
        } catch (error) {
          toast.error(error instanceof Error ? error.message : "Import failed");
        } finally {
          setLoading(false);
          if (inputRef.current) inputRef.current.value = "";
        }
      },
      error: () => {
        toast.error("Could not parse that file");
        setLoading(false);
      },
    });
  }

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept=".csv,text/csv"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
      />
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={loading}
        onClick={() => inputRef.current?.click()}
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
        Import CSV
      </Button>
    </div>
  );
}
