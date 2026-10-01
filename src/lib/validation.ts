import { validationMessages as m } from "@/content/forms";

export const NOTE_MAX = 500;
export const FILE_MAX_BYTES = 10 * 1024 * 1024;
export const FILE_ACCEPT = ".pdf,.png,.jpg,.jpeg,application/pdf,image/png,image/jpeg";
const FILE_TYPES = ["application/pdf", "image/png", "image/jpeg"];
const FILE_EXTENSIONS = /\.(pdf|png|jpe?g)$/i;

export type FieldErrors<K extends string> = Partial<Record<K, string>>;

export function parseAmount(raw: string): number | null {
  const cleaned = raw.replace(/[,\s]/g, "");
  if (!/^\d+(\.\d{1,2})?$/.test(cleaned)) return null;
  return Number(cleaned);
}

export function formatAmount(raw: string): string {
  const value = parseAmount(raw);
  if (value === null) return raw;
  const hasDecimals = raw.includes(".");
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: hasDecimals ? 2 : 0,
    maximumFractionDigits: 2,
  }).format(value);
}

export function validateAmount(raw: string): string | undefined {
  const value = raw.trim();
  if (!value) return m.amount.required;
  const digits = value.replace(/[^\d]/g, "");
  if (digits.length > 14) return m.amount.tooLong;
  const parsed = parseAmount(value);
  if (parsed === null) return m.amount.format;
  if (parsed <= 0) return m.amount.positive;
  if (Math.floor(parsed).toString().length > 12) return m.amount.tooLong;
  return undefined;
}

export function validateRequiredText(raw: string, messages: { required: string; short: string }): string | undefined {
  const value = raw.trim();
  if (!value) return messages.required;
  if (value.length < 2) return messages.short;
  return undefined;
}

export function validateEmail(raw: string): string | undefined {
  const value = raw.trim();
  if (!value) return m.email.required;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) return m.email.format;
  return undefined;
}

export function validatePhone(raw: string): string | undefined {
  const value = raw.trim();
  if (!value) return undefined;
  const compact = value.replace(/[\s().-]/g, "");
  if (!/^\+?\d{7,15}$/.test(compact)) return m.phone.format;
  return undefined;
}

export function validateNote(raw: string): string | undefined {
  if (raw.length > NOTE_MAX) return m.note.tooLong(NOTE_MAX);
  return undefined;
}

export type FileInfo = { name: string; size: number; type: string };

export function validateFile(file: FileInfo | null): string | undefined {
  if (!file) return m.file.required;
  const typeOk = FILE_TYPES.includes(file.type) || FILE_EXTENSIONS.test(file.name);
  if (!typeOk) return m.file.type;
  if (file.size > FILE_MAX_BYTES) return m.file.size;
  return undefined;
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Put on submit buttons as onMouseDown. Without it, pressing the button blurs
 * the focused field, its inline error appears, the button shifts down and the
 * click lands on empty space. Submitting validates every field anyway.
 */
export function keepFocus(event: { preventDefault: () => void }) {
  event.preventDefault();
}
