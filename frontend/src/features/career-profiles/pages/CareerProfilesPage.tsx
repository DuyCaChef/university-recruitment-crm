import { useEffect, useRef, useState, type ReactElement } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import {
  GraduationCap,
  Handshake,
  RefreshCw,
  SearchX,
  Users,
  UsersRound,
} from "lucide-react";
import { Alert, Button } from "@/components/ui";
import { cn } from "@/shared/lib/cn";
import { extractApiErrorMessage } from "@/shared/lib/apiError";
import { normalizeCareerProfileSearchParams } from "../api/careerProfilesApi";
import {
  CareerProfileCard,
  CareerProfileCardSkeleton,
} from "../components/CareerProfileCard";
import { CareerProfileFilterBar } from "../components/CareerProfileFilterBar";
import { useCareerProfilesQuery } from "../hooks/useCareerProfilesQuery";

const FILTER_DEBOUNCE_MS = 380;

export function CareerProfilesPage(): ReactElement {
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  const urlMajor = searchParams.get("major")?.trim() ?? "";
  const urlSkill = searchParams.get("skill")?.trim() ?? "";
  const urlSyncKey = `${urlMajor}\0${urlSkill}`;

  const [majorInput, setMajorInput] = useState(urlMajor);
  const [skillInput, setSkillInput] = useState(urlSkill);
  const [prevUrlSyncKey, setPrevUrlSyncKey] = useState(urlSyncKey);

  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Đồng bộ lại ô nhập khi URL thay đổi từ bên ngoài (ví dụ bấm Back/Forward trình duyệt)
  if (urlSyncKey !== prevUrlSyncKey) {
    setPrevUrlSyncKey(urlSyncKey);
    setMajorInput(urlMajor);
    setSkillInput(urlSkill);
  }

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  const clearPendingDebounce = (): void => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }
  };

  const commitFiltersToUrl = (nextMajor: string, nextSkill: string): void => {
    const normalized = normalizeCareerProfileSearchParams({
      major: nextMajor,
      skill: nextSkill,
    });

    const nextParams = new URLSearchParams();
    if (normalized.major) {
      nextParams.set("major", normalized.major);
    }
    if (normalized.skill) {
      nextParams.set("skill", normalized.skill);
    }

    if (nextParams.toString() === searchParams.toString()) {
      return;
    }

    setSearchParams(nextParams, { replace: true });
  };

  const scheduleFilterCommit = (nextMajor: string, nextSkill: string): void => {
    clearPendingDebounce();
    debounceTimerRef.current = setTimeout(() => {
      commitFiltersToUrl(nextMajor, nextSkill);
    }, FILTER_DEBOUNCE_MS);
  };

  const handleMajorChange = (value: string): void => {
    setMajorInput(value);
    scheduleFilterCommit(value, skillInput);
  };

  const handleSkillChange = (value: string): void => {
    setSkillInput(value);
    scheduleFilterCommit(majorInput, value);
  };

  const handleQuickSelectMajor = (major: string): void => {
    clearPendingDebounce();
    setMajorInput(major);
    commitFiltersToUrl(major, skillInput);
  };

  const handleQuickSelectSkill = (skill: string): void => {
    clearPendingDebounce();
    setSkillInput(skill);
    commitFiltersToUrl(majorInput, skill);
  };

  const handleImmediateSubmit = (): void => {
    clearPendingDebounce();
    commitFiltersToUrl(majorInput, skillInput);
  };

  const handleRemoveMajor = (): void => {
    clearPendingDebounce();
    setMajorInput("");
    commitFiltersToUrl("", skillInput);
  };

  const handleRemoveSkill = (): void => {
    clearPendingDebounce();
    setSkillInput("");
    commitFiltersToUrl(majorInput, "");
  };

  const handleResetAll = (): void => {
    clearPendingDebounce();
    setMajorInput("");
    setSkillInput("");
    commitFiltersToUrl("", "");
  };

  const normalizedQueryParams = normalizeCareerProfileSearchParams({
    major: urlMajor,
    skill: urlSkill,
  });
  const hasActiveFilters = Boolean(
    normalizedQueryParams.major || normalizedQueryParams.skill,
  );

  const { data, error, isPending, isFetching, isError, refetch } =
    useCareerProfilesQuery(normalizedQueryParams);

  const items = data?.items ?? [];
  const total = data?.total ?? 0;

  const isCareerCenter = location.pathname.startsWith("/career-center");
  const pageHeading = isCareerCenter
    ? "Hồ sơ nghề nghiệp sinh viên"
    : "Tìm kiếm hồ sơ ứng viên";
  const pageSubtitle = isCareerCenter
    ? "Tra cứu hồ sơ năng lực công khai của sinh viên toàn trường phục vụ tư vấn và kết nối việc làm."
    : "Khám phá hồ sơ nghề nghiệp công khai của sinh viên AGU theo ngành đào tạo và kỹ năng chuyên môn.";

  return (
    <div className="space-y-6">
      <section className="agu-signature-hero relative isolate overflow-hidden rounded-panel px-5 py-6 shadow-lg md:px-8 md:py-8">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-16 -top-28 h-72 w-72 rounded-full border-[36px] border-white/[0.06]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-28 right-40 h-56 w-56 rounded-full bg-sand/15 blur-3xl"
        />
        <div className="relative z-10 flex flex-col gap-6 desktop:flex-row desktop:items-center desktop:justify-between">
          <div className="max-w-2xl">
            <p className="mb-3 inline-flex items-center gap-2 rounded-pill border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold tracking-wide text-white">
              <Handshake className="h-3.5 w-3.5" aria-hidden="true" />
              KẾT NỐI NHÂN TÀI AGU
            </p>
            <h1 className="text-h2 font-bold text-white md:text-h1">
              {pageHeading}
            </h1>
            <p className="mt-2 max-w-xl text-small leading-relaxed text-white/85 md:text-body">
              {pageSubtitle}
            </p>
          </div>

          <div className="flex w-fit min-w-48 items-center gap-3 rounded-panel border border-white/20 bg-white/10 px-4 py-3.5 shadow-sm backdrop-blur-sm">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-input bg-sand-100 text-sand-ink">
              <UsersRound className="h-5 w-5" aria-hidden="true" />
            </div>
            <div aria-live="polite">
              <p className="text-xs font-medium text-white/75">
                Hồ sơ công khai
              </p>
              <p className="mt-0.5 text-lg font-bold leading-tight text-white">
                {isPending
                  ? "Đang tải..."
                  : isError
                    ? "Chưa thể tải"
                    : `${total} ứng viên`}
              </p>
              {isFetching && !isPending && (
                <p className="mt-0.5 text-xs text-white">Đang cập nhật...</p>
              )}
            </div>
          </div>
        </div>
        <div
          aria-hidden="true"
          className="absolute bottom-5 right-5 hidden text-white/10 md:block"
        >
          <GraduationCap className="h-24 w-24" strokeWidth={1.2} />
        </div>
      </section>

      {/* Search & Filter Bar */}
      <CareerProfileFilterBar
        majorValue={majorInput}
        skillValue={skillInput}
        activeMajor={normalizedQueryParams.major}
        activeSkill={normalizedQueryParams.skill}
        isFetching={isFetching}
        onMajorChange={handleMajorChange}
        onSkillChange={handleSkillChange}
        onQuickSelectMajor={handleQuickSelectMajor}
        onQuickSelectSkill={handleQuickSelectSkill}
        onSubmit={handleImmediateSubmit}
        onRemoveMajor={handleRemoveMajor}
        onRemoveSkill={handleRemoveSkill}
        onResetAll={handleResetAll}
      />

      {/* Initial Loading State */}
      {isPending && (
        <div
          aria-busy="true"
          aria-label="Đang tải danh sách hồ sơ ứng viên"
          className="grid gap-4 md:grid-cols-2 desktop:grid-cols-3"
        >
          {Array.from({ length: 6 }).map((_, index) => (
            <CareerProfileCardSkeleton key={index} />
          ))}
        </div>
      )}

      {/* Error State */}
      {!isPending && isError && (
        <Alert variant="danger" title="Không thể tải danh sách hồ sơ ứng viên">
          <div className="space-y-3">
            <p>
              {extractApiErrorMessage(
                error,
                "Đã xảy ra lỗi khi tìm kiếm hồ sơ nghề nghiệp công khai.",
              )}
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => void refetch()}
              className="bg-surface"
            >
              <RefreshCw className="h-4 w-4" aria-hidden="true" />
              <span>Thử lại</span>
            </Button>
          </div>
        </Alert>
      )}

      {/* Empty States */}
      {!isPending && !isError && items.length === 0 && (
        <div className="rounded-card border border-line bg-surface p-8 text-center shadow-sm md:p-12">
          <div className="mx-auto flex max-w-md flex-col items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-pill bg-brand-50 text-brand-600">
              {hasActiveFilters ? (
                <SearchX className="h-7 w-7" aria-hidden="true" />
              ) : (
                <Users className="h-7 w-7" aria-hidden="true" />
              )}
            </div>

            <h2 className="text-h3 text-ink">
              {hasActiveFilters
                ? "Không tìm thấy ứng viên phù hợp"
                : "Chưa có hồ sơ công khai nào"}
            </h2>

            <p className="text-small text-ink-2">
              {hasActiveFilters
                ? "Không có hồ sơ công khai nào khớp với từ khóa ngành đào tạo hoặc kỹ năng bạn đang lọc. Hãy thử điều chỉnh lại điều kiện tìm kiếm."
                : "Hiện tại chưa có sinh viên nào bật chế độ công khai hồ sơ nghề nghiệp trên hệ thống."}
            </p>

            {hasActiveFilters && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleResetAll}
                className="mt-2"
              >
                Xóa bộ lọc
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Candidate Grid */}
      {!isPending && !isError && items.length > 0 && (
        <section aria-label="Danh sách hồ sơ ứng viên">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="text-h3 font-bold text-ink">Hồ sơ ứng viên</h2>
              <p className="mt-0.5 text-xs text-ink-2">
                Khám phá năng lực và kinh nghiệm của sinh viên
              </p>
            </div>
            <span className="rounded-pill border border-brand-200 bg-brand-50 px-3 py-1.5 text-xs font-semibold text-brand-700">
              {total} hồ sơ được tìm thấy
            </span>
          </div>
          <div
            className={cn(
              "grid gap-4 transition-opacity duration-150 md:grid-cols-2 desktop:grid-cols-3",
              isFetching && "opacity-75",
            )}
          >
            {items.map((profile) => (
              <CareerProfileCard key={profile.studentId} profile={profile} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default CareerProfilesPage;
