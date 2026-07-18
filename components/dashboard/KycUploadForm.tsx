"use client";
import { useActionState, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { submitKycDocAction, type KycUploadState } from "@/app/dashboard/kyc/actions";

const MAX_BYTES = 5 * 1024 * 1024; // must match app/dashboard/kyc/actions.ts
const ACCEPT = "image/jpeg,image/png,image/webp,application/pdf";

export function KycUploadForm({ docType }: { docType: string }) {
  const [state, formAction, pending] = useActionState<KycUploadState, FormData>(submitKycDocAction, undefined);
  const [fileName, setFileName] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (state?.success) {
      toast.success("Submitted for review", { description: "We'll review within 1 hour." });
      setFileName(null);
      if (inputRef.current) inputRef.current.value = "";
    }
    if (state?.error) toast.error(state.error);
  }, [state]);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) {
      setFileName(null);
      return;
    }
    if (file.size > MAX_BYTES) {
      toast.error(`File is too large (${(file.size / 1024 / 1024).toFixed(1)}MB). Max size is 5MB.`);
      e.target.value = "";
      setFileName(null);
      return;
    }
    setFileName(file.name);
  }

  return (
    <form action={formAction} className="flex items-center gap-2">
      <input type="hidden" name="docType" value={docType} />
      <input
        ref={inputRef}
        type="file"
        name="file"
        accept={ACCEPT}
        required
        onChange={handleFileChange}
        className="hidden"
        id={`file-${docType}`}
      />
      <label
        htmlFor={`file-${docType}`}
        className="max-w-[10rem] truncate text-xs text-muted-foreground"
        title={fileName ?? undefined}
      >
        {fileName ?? "No file chosen"}
      </label>
      <Button type="button" size="sm" variant="outline" onClick={() => inputRef.current?.click()} disabled={pending}>
        Choose file
      </Button>
      <Button type="submit" size="sm" disabled={pending || !fileName}>
        <Upload className="mr-2 h-4 w-4" />{pending ? "Uploading..." : "Upload"}
      </Button>
    </form>
  );
}
