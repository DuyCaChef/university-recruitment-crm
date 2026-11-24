import { useRef, useState, type ChangeEvent, type ReactElement } from "react";
import {
  Check,
  Download,
  Eye,
  FileText,
  Pencil,
  Trash2,
  Upload,
} from "lucide-react";
import { Badge, Button, Input } from "@/components/ui";
import { extractApiErrorMessage } from "@/shared/lib/apiError";
import { formatSize } from "@/shared/lib/format";
import { studentProfileApi } from "../api/studentProfileApi";
import { MAX_CV_BYTES } from "../constants/projectDomains";
import type { ConfirmDeleteTarget, StudentCv } from "../types";

export interface CvsSectionProps {
  cvs: StudentCv[];
  isSuspended: boolean;
  isUploading: boolean;
  isSettingDefault: boolean;
  isRenaming: boolean;
  onUploadCv: (
    params: { title: string; isDefault: boolean; file: File },
    callbacks: {
      onSuccess: () => void;
      onError: (err: unknown) => void;
    },
  ) => void;
  onSetDefaultCv: (
    cvId: string,
    callbacks: {
      onSuccess: () => void;
      onError: (err: unknown) => void;
    },
  ) => void;
  onRenameCv: (
    params: { id: string; title: string },
    callbacks: {
      onSuccess: () => void;
      onError: (err: unknown) => void;
    },
  ) => void;
  onRequestDelete: (target: ConfirmDeleteTarget) => void;
  onNotice: (message: string) => void;
  onError: (message: string) => void;
}

export function CvsSection({
  cvs,
  isSuspended,
  isUploading,
  isSettingDefault,
  isRenaming,
  onUploadCv,
  onSetDefaultCv,
  onRenameCv,
  onRequestDelete,
  onNotice,
  onError,
}: CvsSectionProps): ReactElement {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [cvTitle, setCvTitle] = useState<string>("");
  const [cvDefault, setCvDefault] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [cvUploadError, setCvUploadError] = useState<string | null>(null);
  const [renamingCvId, setRenamingCvId] = useState<string | null>(null);
  const [renamingTitle, setRenamingTitle] = useState<string>("");

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setCvUploadError(null);
    const file = event.target.files?.[0] ?? null;
    if (!file) {
      setSelectedFile(null);
      return;
    }

    const isPdf =
      file.type === "application/pdf" ||
      file.name.toLowerCase().endsWith(".pdf");
    if (!isPdf) {
      setSelectedFile(null);
      setCvUploadError("Chỉ chấp nhận tệp CV định dạng PDF (.pdf).");
      event.target.value = "";
      return;
    }

    if (file.size > MAX_CV_BYTES) {
      setSelectedFile(null);
      setCvUploadError("Dung lượng tệp CV không được vượt quá 5 MB.");
      event.target.value = "";
      return;
    }

    setSelectedFile(file);
    if (!cvTitle.trim()) {
      const baseName = file.name.replace(/\.pdf$/i, "").slice(0, 150);
      setCvTitle(baseName);
    }
  };

  const handleUploadSubmit = (): void => {
    if (isSuspended) return;
    if (!selectedFile) {
      setCvUploadError("Vui lòng chọn tệp CV định dạng PDF.");
      return;
    }
    if (!cvTitle.trim()) {
      setCvUploadError("Vui lòng nhập tên gợi nhớ cho bản CV.");
      return;
    }

    onUploadCv(
      {
        title: cvTitle.trim(),
        isDefault: cvDefault,
        file: selectedFile,
      },
      {
        onSuccess: () => {
          setSelectedFile(null);
          setCvTitle("");
          setCvDefault(false);
          setCvUploadError(null);
          if (fileInputRef.current) fileInputRef.current.value = "";
          onNotice("Đã tải lên bản CV mới vào kho lưu trữ.");
        },
        onError: (err) => {
          setCvUploadError(
            extractApiErrorMessage(
              err,
              "Tải lên CV thất bại. Vui lòng thử lại.",
            ),
          );
        },
      },
    );
  };

  const handleSetDefault = (cvId: string): void => {
    if (isSuspended) return;
    onSetDefaultCv(cvId, {
      onSuccess: () => {
        onNotice("Đã cập nhật CV mặc định cho các lần ứng tuyển.");
      },
      onError: (err) => {
        onError(extractApiErrorMessage(err, "Không thể đặt CV mặc định."));
      },
    });
  };

  const handleOpenCv = async (cv: StudentCv): Promise<void> => {
    if (isSuspended) return;
    try {
      const result = await studentProfileApi.getCvDownloadUrl(cv.id);
      if (!result.url) {
        onError("Không lấy được đường dẫn tải tệp CV.");
        return;
      }
      window.open(result.url, "_blank", "noopener,noreferrer");
    } catch (err) {
      onError(extractApiErrorMessage(err, "Không thể mở xem trước tệp CV."));
    }
  };

  const startRenaming = (cv: StudentCv): void => {
    if (isSuspended) return;
    setRenamingCvId(cv.id);
    setRenamingTitle(cv.title);
  };

  const submitRename = (cvId: string): void => {
    if (isSuspended) return;
    const trimmed = renamingTitle.trim();
    if (!trimmed) return;

    onRenameCv(
      { id: cvId, title: trimmed },
      {
        onSuccess: () => {
          setRenamingCvId(null);
          setRenamingTitle("");
          onNotice("Đã đổi tên gợi nhớ cho bản CV.");
        },
        onError: (err) => {
          onError(extractApiErrorMessage(err, "Không thể đổi tên CV."));
        },
      },
    );
  };

  return (
    <section className="rounded-panel border border-line bg-surface p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-h3 text-ink">Kho lưu trữ CV</h2>
          <p className="mt-1 text-small text-ink-2">
            Quản lý nhiều phiên bản CV định dạng PDF cho từng vị trí ứng tuyển.
          </p>
        </div>
        <FileText className="h-5 w-5 text-brand-600" aria-hidden="true" />
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-[minmax(0,1fr)_300px]">
        {/* Danh sách CV hiện có */}
        <div className="space-y-3">
          {cvs.length === 0 ? (
            <div className="rounded-card border border-dashed border-line-strong py-10 text-center">
              <FileText className="mx-auto h-8 w-8 text-ink-3" />
              <p className="mt-3 text-small font-semibold text-ink">
                Chưa có CV trong kho cá nhân
              </p>
              <p className="mt-1 text-xs text-ink-2">
                Tải lên bản PDF đầu tiên để sẵn sàng nộp đơn ứng tuyển.
              </p>
            </div>
          ) : (
            cvs.map((cv) => (
              <div
                key={cv.id}
                className="flex flex-col gap-3 rounded-card border border-line p-4 md:flex-row md:items-center"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-card bg-danger-bg text-danger-ink">
                  <FileText className="h-5 w-5" />
                </div>

                <div className="min-w-0 flex-1">
                  {renamingCvId === cv.id ? (
                    <div className="flex flex-col gap-2 md:flex-row md:items-center">
                      <input
                        type="text"
                        value={renamingTitle}
                        maxLength={150}
                        disabled={isSuspended || isRenaming}
                        onChange={(e) => setRenamingTitle(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            submitRename(cv.id);
                          } else if (e.key === "Escape") {
                            setRenamingCvId(null);
                          }
                        }}
                        aria-label="Tên gợi nhớ mới cho CV"
                        className="h-9 flex-1 rounded-input border-2 border-brand-600 bg-surface px-3 text-small text-ink focus:outline-none"
                      />
                      <div className="flex items-center gap-1.5">
                        <Button
                          type="button"
                          size="sm"
                          isLoading={isRenaming}
                          disabled={
                            isSuspended || !renamingTitle.trim() || isRenaming
                          }
                          onClick={() => submitRename(cv.id)}
                        >
                          Lưu
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          disabled={isRenaming}
                          onClick={() => setRenamingCvId(null)}
                        >
                          Hủy
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="truncate text-small font-bold text-ink">
                          {cv.title}
                        </p>
                        {cv.isDefault && (
                          <Badge variant="brand">Mặc định</Badge>
                        )}
                      </div>
                      <p className="mt-1 text-caption text-ink-3">
                        {cv.file?.originalName ?? "CV.pdf"} ·{" "}
                        {formatSize(cv.file?.sizeBytes ?? 0)}
                      </p>
                    </>
                  )}
                </div>

                {renamingCvId !== cv.id && (
                  <div className="flex flex-wrap items-center gap-1">
                    {!cv.isDefault && (
                      <Button
                        size="sm"
                        variant="ghost"
                        disabled={isSuspended || isSettingDefault}
                        onClick={() => handleSetDefault(cv.id)}
                      >
                        <Check className="h-4 w-4" />
                        Đặt mặc định
                      </Button>
                    )}
                    <button
                      type="button"
                      title="Xem trước"
                      aria-label={`Xem trước ${cv.title}`}
                      disabled={isSuspended}
                      onClick={() => void handleOpenCv(cv)}
                      className="rounded-button p-2.5 text-ink-2 hover:bg-brand-50 hover:text-brand-600 disabled:pointer-events-none disabled:opacity-40"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      title="Đổi tên gợi nhớ"
                      disabled={isSuspended}
                      aria-label={`Đổi tên ${cv.title}`}
                      onClick={() => startRenaming(cv)}
                      className="rounded-button p-2.5 text-ink-2 hover:bg-brand-50 hover:text-brand-600 disabled:pointer-events-none disabled:opacity-40"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      title="Tải xuống"
                      aria-label={`Tải xuống ${cv.title}`}
                      disabled={isSuspended}
                      onClick={() => void handleOpenCv(cv)}
                      className="rounded-button p-2.5 text-ink-2 hover:bg-brand-50 hover:text-brand-600 disabled:pointer-events-none disabled:opacity-40"
                    >
                      <Download className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      title="Xóa CV"
                      disabled={isSuspended}
                      aria-label={`Xóa ${cv.title}`}
                      onClick={() =>
                        onRequestDelete({
                          type: "cv",
                          id: cv.id,
                          label: cv.title,
                          isDefaultCv: cv.isDefault,
                        })
                      }
                      className="rounded-button p-2.5 text-ink-2 hover:bg-danger-bg hover:text-danger-ink disabled:pointer-events-none disabled:opacity-40"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Form tải lên CV mới */}
        <div className="rounded-card border border-line bg-canvas p-4">
          <h3 className="text-small font-bold text-ink">Tải CV mới</h3>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,application/pdf"
            disabled={isSuspended || isUploading}
            onChange={handleFileChange}
            className="sr-only"
          />
          <button
            type="button"
            disabled={isSuspended || isUploading}
            onClick={() => fileInputRef.current?.click()}
            className="mt-3 flex w-full flex-col items-center rounded-card border border-dashed border-line-strong bg-surface px-3 py-5 text-center transition-colors hover:border-brand-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Upload className="h-5 w-5 text-brand-600" />
            <span className="mt-2 line-clamp-1 text-xs font-semibold text-ink">
              {selectedFile ? selectedFile.name : "Chọn tệp PDF"}
            </span>
            <span className="mt-1 text-caption text-ink-3">
              Định dạng .pdf · Tối đa 5 MB
            </span>
          </button>

          {cvUploadError && (
            <p role="alert" className="mt-2 text-xs text-danger-ink">
              {cvUploadError}
            </p>
          )}

          <Input
            id="cv-upload-title"
            label="Tên gợi nhớ *"
            value={cvTitle}
            disabled={isSuspended || isUploading}
            onChange={(event) => setCvTitle(event.target.value)}
            maxLength={150}
            containerClassName="mt-3"
            placeholder="VD: CV Thực tập sinh / CV Ứng tuyển"
          />

          <label className="mt-3 flex items-center gap-2 text-xs text-ink-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={cvDefault}
              disabled={isSuspended || isUploading}
              onChange={(event) => setCvDefault(event.target.checked)}
              className="h-4 w-4 accent-brand-600"
            />
            Đặt làm CV mặc định
          </label>

          <Button
            type="button"
            size="sm"
            fullWidth
            className="mt-4 text-white hover:text-white"
            onClick={handleUploadSubmit}
            isLoading={isUploading}
            disabled={
              !selectedFile || !cvTitle.trim() || isSuspended || isUploading
            }
          >
            <Upload className="h-4 w-4 text-white" />
            <span className="text-white">Tải lên CV</span>
          </Button>
        </div>
      </div>
    </section>
  );
}
