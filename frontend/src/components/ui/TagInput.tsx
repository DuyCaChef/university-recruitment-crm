import {
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactElement,
} from "react";
import { X } from "lucide-react";
import { cn } from "@/shared/lib/cn";
import { parseCommaTokens } from "@/shared/lib/format";

export interface TagInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (nextValue: string) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  helperText?: string;
  maxTotalLength?: number;
  suggestions?: readonly string[];
}

export function TagInput({
  id,
  label,
  value,
  onChange,
  placeholder = "Nhập nội dung rồi nhấn Enter...",
  disabled = false,
  error,
  helperText,
  maxTotalLength = 500,
  suggestions = [],
}: TagInputProps): ReactElement {
  const [draft, setDraft] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);

  const tags = parseCommaTokens(value);

  const commitDraft = (rawText: string): void => {
    const incoming = parseCommaTokens(rawText);
    if (incoming.length === 0) {
      setDraft("");
      return;
    }

    const merged = [...tags];
    for (const token of incoming) {
      const exists = merged.some(
        (existing) => existing.toLowerCase() === token.toLowerCase(),
      );
      if (!exists) {
        merged.push(token);
      }
    }

    const serialized = merged.join(", ");
    if (serialized.length <= maxTotalLength) {
      onChange(serialized);
    }
    setDraft("");
  };

  const removeTag = (target: string): void => {
    const next = tags.filter((item) => item !== target);
    onChange(next.join(", "));
  };

  const toggleSuggestion = (chip: string): void => {
    const exists = tags.some(
      (item) => item.toLowerCase() === chip.toLowerCase(),
    );
    if (exists) {
      const next = tags.filter(
        (item) => item.toLowerCase() !== chip.toLowerCase(),
      );
      onChange(next.join(", "));
    } else {
      commitDraft(chip);
    }
    inputRef.current?.focus();
  };

  const handleKeyDown = (event: ReactKeyboardEvent<HTMLInputElement>): void => {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      commitDraft(draft);
    } else if (event.key === "Backspace" && draft === "" && tags.length > 0) {
      event.preventDefault();
      removeTag(tags[tags.length - 1]);
    }
  };

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between gap-2">
        <label htmlFor={id} className="text-small font-medium text-ink">
          {label}
        </label>
        {tags.length > 0 && (
          <span className="text-[11px] font-medium text-ink-3">
            Đã thêm {tags.length} mục
          </span>
        )}
      </div>

      {/* Khung chứa thẻ co giãn nhiều dòng */}
      <div
        onClick={() => !disabled && inputRef.current?.focus()}
        className={cn(
          "flex min-h-11 w-full flex-wrap items-center gap-1.5 rounded-input border-2 bg-surface px-3 py-2 transition-all duration-150",
          disabled
            ? "cursor-not-allowed border-line bg-subtle text-ink-3"
            : error
              ? "cursor-text border-danger-border focus-within:ring-4 focus-within:ring-danger-bg"
              : "cursor-text border-line-strong hover:border-brand-400 focus-within:border-brand-600 focus-within:ring-4 focus-within:ring-brand-100",
        )}
      >
        {tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 rounded-pill border border-brand-200 bg-brand-50 px-2.5 py-0.5 text-xs font-semibold text-brand-700"
          >
            <span>{tag}</span>
            {!disabled && (
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  removeTag(tag);
                }}
                aria-label={`Xóa ${tag}`}
                className="rounded-pill p-0.5 text-brand-600 transition-colors hover:bg-brand-200/70 hover:text-brand-900 focus-visible:outline-none"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </span>
        ))}

        <input
          ref={inputRef}
          id={id}
          type="text"
          value={draft}
          disabled={disabled}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => {
            if (draft.trim()) {
              commitDraft(draft);
            }
          }}
          placeholder={
            tags.length === 0
              ? placeholder
              : "Thêm mục khác... (nhấn Enter hoặc dấu phẩy)"
          }
          className="min-w-[180px] flex-1 bg-transparent text-small text-ink placeholder:text-ink-3 focus:outline-none disabled:cursor-not-allowed"
        />
      </div>

      {/* Chip gợi ý nhanh theo lĩnh vực */}
      {suggestions.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
          <span className="text-[11px] text-ink-3">Gợi ý nhanh:</span>
          {suggestions.map((chip) => {
            const isSelected = tags.some(
              (item) => item.toLowerCase() === chip.toLowerCase(),
            );
            return (
              <button
                key={chip}
                type="button"
                disabled={disabled}
                onClick={() => toggleSuggestion(chip)}
                className={cn(
                  "rounded-pill border px-2.5 py-0.5 text-[11px] font-medium transition-colors disabled:opacity-50",
                  isSelected
                    ? "border-brand-300 bg-brand-50 text-brand-700"
                    : "border-line bg-subtle text-ink-2 hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700",
                )}
              >
                {isSelected ? `✓ ${chip}` : `+ ${chip}`}
              </button>
            );
          })}
        </div>
      )}

      {error ? (
        <p role="alert" className="text-xs text-danger-ink">
          {error}
        </p>
      ) : (
        helperText && <p className="text-xs text-ink-3">{helperText}</p>
      )}
    </div>
  );
}
