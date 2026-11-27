import { type FormEvent, type ReactElement } from "react";
import { Loader2, RotateCcw, Search, X } from "lucide-react";
import { Button, Input } from "@/components/ui";
import { cn } from "@/shared/lib/cn";

const QUICK_MAJOR_SUGGESTIONS = [
  "Công nghệ thông tin",
  "Kế toán",
  "Quản trị kinh doanh",
  "Ngôn ngữ Anh",
] as const;

const QUICK_SKILL_SUGGESTIONS = ["ReactJS", "Excel", "Tiếng Anh"] as const;

export interface CareerProfileFilterBarProps {
  majorValue: string;
  skillValue: string;
  activeMajor?: string;
  activeSkill?: string;
  isFetching: boolean;
  onMajorChange: (value: string) => void;
  onSkillChange: (value: string) => void;
  onQuickSelectMajor: (major: string) => void;
  onQuickSelectSkill: (skill: string) => void;
  onSubmit: () => void;
  onRemoveMajor: () => void;
  onRemoveSkill: () => void;
  onResetAll: () => void;
}

export function CareerProfileFilterBar({
  majorValue,
  skillValue,
  activeMajor,
  activeSkill,
  isFetching,
  onMajorChange,
  onSkillChange,
  onQuickSelectMajor,
  onQuickSelectSkill,
  onSubmit,
  onRemoveMajor,
  onRemoveSkill,
  onResetAll,
}: CareerProfileFilterBarProps): ReactElement {
  const hasActiveFilters = Boolean(activeMajor || activeSkill);

  const handleFormSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    onSubmit();
  };

  return (
    <section
      aria-label="Tìm kiếm và lọc hồ sơ ứng viên"
      className="rounded-panel border border-line bg-surface p-4 shadow-sm md:p-5"
    >
      <form
        onSubmit={handleFormSubmit}
        className="grid gap-3 md:grid-cols-2 desktop:grid-cols-[1fr_1fr_auto] desktop:items-end"
      >
        <Input
          label="Ngành đào tạo"
          placeholder="VD: Công nghệ thông tin, Kế toán..."
          value={majorValue}
          onChange={(e) => onMajorChange(e.target.value)}
          rightElement={
            majorValue.length > 0 ? (
              <button
                type="button"
                onClick={onRemoveMajor}
                aria-label="Xóa từ khóa ngành đào tạo"
                className="flex h-7 w-7 items-center justify-center rounded-pill text-ink-3 transition-colors hover:bg-subtle hover:text-ink"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            ) : undefined
          }
        />

        <Input
          label="Kỹ năng chuyên môn"
          placeholder="VD: ReactJS, SQL, Tiếng Anh..."
          value={skillValue}
          onChange={(e) => onSkillChange(e.target.value)}
          rightElement={
            skillValue.length > 0 ? (
              <button
                type="button"
                onClick={onRemoveSkill}
                aria-label="Xóa từ khóa kỹ năng"
                className="flex h-7 w-7 items-center justify-center rounded-pill text-ink-3 transition-colors hover:bg-subtle hover:text-ink"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            ) : undefined
          }
        />

        <Button
          type="submit"
          variant="primary"
          size="md"
          className="w-full text-white hover:text-white md:col-span-2 desktop:col-span-1 desktop:w-auto desktop:min-w-[136px]"
        >
          {isFetching ? (
            <Loader2
              className="h-4 w-4 animate-spin text-white"
              aria-hidden="true"
            />
          ) : (
            <Search className="h-4 w-4 text-white" aria-hidden="true" />
          )}
          <span className="text-white">Tìm kiếm</span>
        </Button>
      </form>

      {/* Quick Filter Suggestion Chips */}
      <div className="mt-3 flex flex-wrap items-center gap-2 pt-1">
        <span className="text-xs font-semibold text-ink-3">Gợi ý nhanh:</span>

        {QUICK_MAJOR_SUGGESTIONS.map((major) => {
          const isSelected =
            activeMajor?.toLowerCase() === major.toLowerCase();
          return (
            <button
              key={major}
              type="button"
              onClick={() =>
                isSelected ? onRemoveMajor() : onQuickSelectMajor(major)
              }
              className={cn(
                "rounded-pill border px-2.5 py-1 text-xs font-medium transition-colors",
                isSelected
                  ? "border-brand-600 bg-brand-600 text-white"
                  : "border-line bg-subtle text-ink-2 hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700",
              )}
            >
              {major}
            </button>
          );
        })}

        <span className="hidden text-line-strong md:inline" aria-hidden="true">
          |
        </span>

        {QUICK_SKILL_SUGGESTIONS.map((skill) => {
          const isSelected =
            activeSkill?.toLowerCase() === skill.toLowerCase();
          return (
            <button
              key={skill}
              type="button"
              onClick={() =>
                isSelected ? onRemoveSkill() : onQuickSelectSkill(skill)
              }
              className={cn(
                "rounded-pill border px-2.5 py-1 text-xs font-medium transition-colors",
                isSelected
                  ? "border-info-border bg-info-bg font-semibold text-info-ink"
                  : "border-line bg-surface text-ink-2 hover:border-info-border hover:bg-info-bg hover:text-info-ink",
              )}
            >
              {skill}
            </button>
          );
        })}
      </div>

      {hasActiveFilters && (
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-line pt-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-ink-3">
              Đang lọc theo:
            </span>

            {activeMajor && (
              <button
                type="button"
                onClick={onRemoveMajor}
                aria-label={`Xóa bộ lọc ngành ${activeMajor}`}
                className="inline-flex items-center gap-1.5 rounded-pill border border-brand-200 bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700 transition-colors hover:bg-brand-100"
              >
                <span>Ngành: {activeMajor}</span>
                <X className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            )}

            {activeSkill && (
              <button
                type="button"
                onClick={onRemoveSkill}
                aria-label={`Xóa bộ lọc kỹ năng ${activeSkill}`}
                className="inline-flex items-center gap-1.5 rounded-pill border border-info-border bg-info-bg px-3 py-1 text-xs font-semibold text-info-ink transition-colors hover:opacity-85"
              >
                <span>Kỹ năng: {activeSkill}</span>
                <X className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            )}
          </div>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onResetAll}
            className="h-8 px-2.5 text-xs"
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Đặt lại bộ lọc</span>
          </Button>
        </div>
      )}
    </section>
  );
}
