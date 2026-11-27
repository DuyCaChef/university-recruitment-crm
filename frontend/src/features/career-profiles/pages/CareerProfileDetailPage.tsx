import { type ReactElement } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { isAxiosError } from "axios";
import { ArrowLeft, RefreshCw, UserX } from "lucide-react";
import { Alert, Button } from "@/components/ui";
import { extractApiErrorMessage } from "@/shared/lib/apiError";
import { CareerProfileDetailHeader } from "../components/CareerProfileDetailHeader";
import {
  CareerProfileBioSection,
  CareerProfileExperiencesSection,
  CareerProfileProjectsSection,
  CareerProfileSkillsSection,
} from "../components/CareerProfileDetailSections";
import { useCareerProfileDetailQuery } from "../hooks/useCareerProfileDetailQuery";

function CareerProfileDetailSkeleton(): ReactElement {
  return (
    <div
      aria-busy="true"
      aria-label="Đang tải hồ sơ ứng viên chi tiết"
      className="animate-pulse space-y-5"
    >
      <div className="rounded-panel border border-line bg-surface p-5 md:p-6">
        <div className="flex flex-col gap-5 desktop:flex-row desktop:items-center desktop:justify-between">
          <div className="flex items-center gap-4">
            <div className="h-20 w-20 shrink-0 rounded-pill bg-subtle md:h-24 md:w-24" />
            <div className="space-y-2.5">
              <div className="h-6 w-56 rounded-xs bg-subtle" />
              <div className="h-4 w-44 rounded-xs bg-subtle" />
              <div className="h-4 w-36 rounded-xs bg-subtle" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2.5">
            <div className="h-16 w-24 rounded-input bg-subtle" />
            <div className="h-16 w-24 rounded-input bg-subtle" />
            <div className="h-16 w-24 rounded-input bg-subtle" />
          </div>
        </div>
        <div className="mt-5 h-10 w-full rounded-input bg-subtle" />
      </div>

      <div className="h-32 rounded-card border border-line bg-surface p-5">
        <div className="h-5 w-48 rounded-xs bg-subtle" />
        <div className="mt-4 h-4 w-full rounded-xs bg-subtle" />
        <div className="mt-2 h-4 w-3/4 rounded-xs bg-subtle" />
      </div>

      <div className="h-36 rounded-card border border-line bg-surface p-5">
        <div className="h-5 w-44 rounded-xs bg-subtle" />
        <div className="mt-4 flex flex-wrap gap-2">
          <div className="h-8 w-24 rounded-pill bg-subtle" />
          <div className="h-8 w-28 rounded-pill bg-subtle" />
          <div className="h-8 w-20 rounded-pill bg-subtle" />
        </div>
      </div>

      <div className="h-48 rounded-card border border-line bg-surface p-5" />
    </div>
  );
}

export function CareerProfileDetailPage(): ReactElement {
  const { studentId } = useParams<{ studentId: string }>();
  const location = useLocation();
  const navigate = useNavigate();

  const listPath = location.pathname.startsWith("/career-center")
    ? "/career-center/students"
    : "/employer/candidates";

  const handleBackToList = (): void => {
    const historyIdx = (window.history.state as { idx?: number } | null)?.idx;
    if (typeof historyIdx === "number" && historyIdx > 0) {
      navigate(-1);
      return;
    }
    navigate(listPath);
  };

  const { data: profile, error, isPending, isError, refetch } =
    useCareerProfileDetailQuery(studentId);

  const isNotFoundOrInvalid =
    !studentId ||
    (isError &&
      isAxiosError(error) &&
      (error.response?.status === 404 || error.response?.status === 400));

  return (
    <div className="space-y-5">
      {/* Top Navigation Bar */}
      <div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleBackToList}
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          <span>Quay lại danh sách</span>
        </Button>
      </div>

      {/* Loading State */}
      {isPending && studentId && <CareerProfileDetailSkeleton />}

      {/* 404 / 400 Not Found State */}
      {!isPending && isNotFoundOrInvalid && (
        <div className="rounded-card border border-line bg-surface p-8 text-center shadow-sm md:p-12">
          <div className="mx-auto flex max-w-lg flex-col items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-pill bg-warning-bg text-warning-ink">
              <UserX className="h-7 w-7" aria-hidden="true" />
            </div>

            <h1 className="text-h3 text-ink">
              Không tìm thấy hồ sơ nghề nghiệp công khai
            </h1>

            <p className="text-small text-ink-2">
              Không tìm thấy hồ sơ nghề nghiệp công khai (hồ sơ có thể không tồn
              tại hoặc sinh viên đã chuyển sang chế độ riêng tư).
            </p>

            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={handleBackToList}
              className="mt-2 text-white hover:text-white"
            >
              <ArrowLeft className="h-4 w-4 text-white" aria-hidden="true" />
              <span className="text-white">Quay lại danh sách</span>
            </Button>
          </div>
        </div>
      )}

      {/* 403 Forbidden / Network / Other Error State */}
      {!isPending && isError && !isNotFoundOrInvalid && (
        <Alert variant="danger" title="Không thể tải hồ sơ ứng viên">
          <div className="space-y-3">
            <p>
              {extractApiErrorMessage(
                error,
                "Đã xảy ra lỗi khi tải chi tiết hồ sơ nghề nghiệp công khai.",
              )}
            </p>
            <div className="flex flex-wrap gap-2">
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
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleBackToList}
              >
                Quay lại danh sách
              </Button>
            </div>
          </div>
        </Alert>
      )}

      {/* Profile Content (5 public sections) */}
      {!isPending && !isError && profile && (
        <div className="space-y-5">
          <CareerProfileDetailHeader profile={profile} />
          <CareerProfileBioSection bio={profile.bio} />
          <CareerProfileSkillsSection skills={profile.skills} />
          <CareerProfileExperiencesSection experiences={profile.experiences} />
          <CareerProfileProjectsSection projects={profile.projects} />
        </div>
      )}
    </div>
  );
}

export default CareerProfileDetailPage;
