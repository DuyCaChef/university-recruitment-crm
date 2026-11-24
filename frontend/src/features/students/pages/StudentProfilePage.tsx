// src/features/student-profile/pages/StudentProfilePage.tsx
import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactElement,
  type ReactNode,
} from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import {
  AlertTriangle,
  BadgeCheck,
  BriefcaseBusiness,
  CalendarDays,
  Camera,
  Check,
  Download,
  ExternalLink,
  Eye,
  EyeOff,
  FileText,
  LockKeyhole,
  Mail,
  Pencil,
  Plus,
  Save,
  ShieldCheck,
  Trash2,
  Upload,
  UserRound,
  X,
} from "lucide-react";
import { Alert, Badge, Button, Input, Textarea } from "@/components/ui";
import { cn } from "@/shared/lib/cn";
import {
  studentProfileApi,
  type StudentCv,
  type StudentExperience,
  type StudentProfile,
  type StudentProject,
  type StudentSkill,
} from "../api/studentProfileApi";

// ============================================================================
// 1. HẰNG SỐ, BỘ GỢI Ý ĐA LĨNH VỰC & ZOD SCHEMAS
// ============================================================================

type CapabilityTab = "skills" | "experiences" | "projects";
type ProjectDomainKey = "tech" | "economics" | "language" | "agri" | "general";

const VN_PHONE_REGEX = /^(?:(?:03|05|07|08|09)\d{8}|02\d{9})$/;
const MAX_CV_BYTES = 5 * 1024 * 1024; // 5 MB
const MAX_AVATAR_BYTES = 2 * 1024 * 1024; // 2 MB
const ALLOWED_AVATAR_TYPES = ["image/jpeg", "image/png", "image/webp"];

const PROFICIENCY_OPTIONS = [
  "Cơ bản",
  "Khá",
  "Thành thạo",
  "Chuyên sâu",
] as const;

interface DomainPresetConfig {
  key: ProjectDomainKey;
  label: string;
  projectNamePlaceholder: string;
  rolePlaceholder: string;
  roleChips: readonly string[];
  methodPlaceholder: string;
  methodChips: readonly string[];
  urlPlaceholder: string;
  skillPlaceholder: string;
  companyPlaceholder: string;
  positionPlaceholder: string;
}

const PROJECT_DOMAIN_PRESETS: Record<ProjectDomainKey, DomainPresetConfig> = {
  tech: {
    key: "tech",
    label: "Công nghệ",
    projectNamePlaceholder: "VD: Hệ thống Web CRM Tuyển dụng Sinh viên AGU",
    rolePlaceholder: "VD: Fullstack Developer",
    roleChips: ["Trưởng nhóm", "Fullstack Dev", "Frontend Dev", "Backend Dev"],
    methodPlaceholder: "Nhập công cụ/công nghệ rồi nhấn Enter (VD: ReactJS)...",
    methodChips: ["ReactJS", "NestJS", "PostgreSQL", "Docker"],
    urlPlaceholder: "https://github.com/username/project",
    skillPlaceholder: "VD: TypeScript, NestJS, ReactJS, SQL...",
    companyPlaceholder: "VD: Công ty TNHH Phần mềm TMA",
    positionPlaceholder: "VD: Thực tập sinh Backend Developer",
  },
  economics: {
    key: "economics",
    label: "Kinh tế",
    projectNamePlaceholder: "VD: Kế hoạch Marketing sản phẩm OCOP An Giang",
    rolePlaceholder: "VD: Trưởng nhóm nghiên cứu",
    roleChips: [
      "Trưởng nhóm",
      "Phân tích dữ liệu",
      "Nghiên cứu thị trường",
      "Thành viên",
    ],
    methodPlaceholder: "Nhập công cụ/phương pháp rồi nhấn Enter (VD: SPSS)...",
    methodChips: ["SPSS", "Excel", "Phân tích SWOT", "Khảo sát thực địa"],
    urlPlaceholder: "https://drive.google.com/file/...",
    skillPlaceholder: "VD: Phân tích tài chính, SPSS, Excel nâng cao...",
    companyPlaceholder: "VD: Ngân hàng BIDV Chi nhánh An Giang",
    positionPlaceholder: "VD: Thực tập sinh Quan hệ khách hàng",
  },
  language: {
    key: "language",
    label: "Ngoại ngữ",
    projectNamePlaceholder:
      "VD: Biên dịch tài liệu du lịch / Điều phối CLB Tiếng Anh",
    rolePlaceholder: "VD: Biên dịch viên",
    roleChips: [
      "Trưởng nhóm",
      "Biên dịch viên",
      "Trợ giảng",
      "Điều phối viên",
    ],
    methodPlaceholder:
      "Nhập kỹ năng/phương pháp rồi nhấn Enter (VD: Biên dịch)...",
    methodChips: [
      "Biên - Phiên dịch",
      "Giảng dạy",
      "Thuyết trình",
      "Soạn học liệu",
    ],
    urlPlaceholder: "https://drive.google.com/file/...",
    skillPlaceholder: "VD: Tiếng Anh giao tiếp, Biên dịch, IELTS 7.0...",
    companyPlaceholder: "VD: Trung tâm Anh ngữ Quốc tế AGU",
    positionPlaceholder: "VD: Trợ giảng Tiếng Anh",
  },
  agri: {
    key: "agri",
    label: "Nông - Thủy sản",
    projectNamePlaceholder:
      "VD: Đánh giá năng suất mô hình lúa hữu cơ ST25 tại Thoại Sơn",
    rolePlaceholder: "VD: Nghiên cứu viên chính",
    roleChips: [
      "Trưởng nhóm",
      "Nghiên cứu viên",
      "Kỹ thuật hiện trường",
      "Phân tích mẫu",
    ],
    methodPlaceholder:
      "Nhập quy trình/kỹ thuật rồi nhấn Enter (VD: VietGAP)...",
    methodChips: [
      "Quy trình VietGAP",
      "Mô hình Biofloc",
      "Phân tích mẫu",
      "Xử lý số liệu",
    ],
    urlPlaceholder: "https://drive.google.com/file/...",
    skillPlaceholder: "VD: Kỹ thuật nuôi trồng, Kiểm nghiệm chất lượng...",
    companyPlaceholder: "VD: Công ty Cổ phần Tập đoàn Lộc Trời",
    positionPlaceholder: "VD: Thực tập sinh Kỹ thuật nông nghiệp",
  },
  general: {
    key: "general",
    label: "Chung",
    projectNamePlaceholder:
      "VD: Đề tài Nghiên cứu khoa học cấp Trường / Dự án cộng đồng",
    rolePlaceholder: "VD: Chủ nhiệm đề tài",
    roleChips: [
      "Trưởng nhóm",
      "Nghiên cứu viên",
      "Điều phối viên",
      "Thành viên",
    ],
    methodPlaceholder: "Nhập phương pháp/công cụ rồi nhấn Enter...",
    methodChips: [
      "Nghiên cứu tài liệu",
      "Khảo sát",
      "Thuyết trình",
      "Làm việc nhóm",
    ],
    urlPlaceholder: "https://drive.google.com/file/...",
    skillPlaceholder: "VD: Tin học văn phòng, Thuyết trình, Quản lý dự án...",
    companyPlaceholder: "VD: Trung tâm Hướng nghiệp & Hỗ trợ SV AGU",
    positionPlaceholder: "VD: Cộng tác viên tổ chức sự kiện",
  },
};

const PROJECT_DOMAIN_LIST: readonly DomainPresetConfig[] = [
  PROJECT_DOMAIN_PRESETS.tech,
  PROJECT_DOMAIN_PRESETS.economics,
  PROJECT_DOMAIN_PRESETS.language,
  PROJECT_DOMAIN_PRESETS.agri,
  PROJECT_DOMAIN_PRESETS.general,
];

function inferProjectDomain(
  major?: string | null,
  faculty?: string | null,
): ProjectDomainKey {
  const combined = `${major ?? ""} ${faculty ?? ""}`.toLowerCase();
  if (
    /(công nghệ thông tin|kỹ thuật phần mềm|khoa học máy tính|tin học|mạng máy tính|cntt|kỹ thuật)/i.test(
      combined,
    )
  ) {
    return "tech";
  }
  if (
    /(kinh tế|quản trị|tài chính|kế toán|ngân hàng|marketing|thương mại|du lịch)/i.test(
      combined,
    )
  ) {
    return "economics";
  }
  if (
    /(ngôn ngữ|tiếng anh|ngoại ngữ|việt nam học|sư phạm anh)/i.test(combined)
  ) {
    return "language";
  }
  if (
    /(nông nghiệp|thủy sản|thú y|chăn nuôi|trồng trọt|công nghệ thực phẩm|môi trường|sinh học)/i.test(
      combined,
    )
  ) {
    return "agri";
  }
  return "general";
}

const personalProfileSchema = z.object({
  displayName: z
    .string()
    .trim()
    .max(150, "Tên hiển thị không được vượt quá 150 ký tự.")
    .refine(
      (val) => val === "" || val.length >= 2,
      "Tên hiển thị phải có ít nhất 2 ký tự (hoặc để trống để dùng tên gốc AGU).",
    ),
  phone: z
    .string()
    .trim()
    .max(30, "Số điện thoại không được vượt quá 30 ký tự.")
    .refine(
      (val) => val === "" || VN_PHONE_REGEX.test(val.replace(/[\s.-]/g, "")),
      "Số điện thoại không hợp lệ (di động 10 số đầu 03/05/07/08/09 hoặc cố định 11 số đầu 02).",
    ),
  dateOfBirth: z
    .string()
    .refine((val) => {
      if (val === "") return true;
      const parsed = new Date(val);
      return !Number.isNaN(parsed.getTime()) && parsed < new Date();
    }, "Ngày sinh không hợp lệ hoặc phải nhỏ hơn ngày hiện tại."),
  gender: z.enum(["", "Nam", "Nữ", "Khác"]),
  gpa: z
    .string()
    .trim()
    .refine((val) => {
      if (val === "") return true;
      if (!/^\d+(?:\.\d{1,2})?$/.test(val)) return false;
      const num = Number(val);
      return !Number.isNaN(num) && num >= 0 && num <= 4;
    }, "GPA phải từ 0.00 đến 4.00 (tối đa 2 chữ số thập phân)."),
  address: z
    .string()
    .trim()
    .max(255, "Địa chỉ hiện tại không được vượt quá 255 ký tự."),
  bio: z
    .string()
    .trim()
    .max(2000, "Giới thiệu bản thân không được vượt quá 2000 ký tự."),
});

type PersonalProfileFormValues = z.infer<typeof personalProfileSchema>;

const skillFormSchema = z.object({
  skillName: z
    .string()
    .trim()
    .min(1, "Vui lòng nhập tên kỹ năng chuyên môn.")
    .max(100, "Tên kỹ năng không được vượt quá 100 ký tự."),
  proficiency: z
    .string()
    .trim()
    .max(30, "Mức độ thành thạo không được vượt quá 30 ký tự."),
});

type SkillFormValues = z.infer<typeof skillFormSchema>;

const experienceFormSchema = z
  .object({
    companyName: z
      .string()
      .trim()
      .min(1, "Vui lòng nhập tên công ty hoặc tổ chức.")
      .max(150, "Tên công ty không được vượt quá 150 ký tự."),
    position: z
      .string()
      .trim()
      .min(1, "Vui lòng nhập vị trí đảm nhiệm.")
      .max(150, "Vị trí đảm nhiệm không được vượt quá 150 ký tự."),
    startDate: z
      .string()
      .min(1, "Vui lòng chọn ngày bắt đầu.")
      .refine(
        (val) => val <= getTodayInputValue(),
        "Ngày bắt đầu không được ở trong tương lai.",
      ),
    isCurrent: z.boolean(),
    endDate: z
      .string()
      .refine(
        (val) => val === "" || val <= getTodayInputValue(),
        "Ngày kết thúc không được ở trong tương lai.",
      ),
    description: z
      .string()
      .trim()
      .max(2000, "Mô tả công việc không được vượt quá 2000 ký tự."),
  })
  .refine(
    (data) =>
      data.isCurrent || !data.endDate || data.endDate >= data.startDate,
    {
      message: "Ngày kết thúc không được nhỏ hơn ngày bắt đầu.",
      path: ["endDate"],
    },
  );

type ExperienceFormValues = z.infer<typeof experienceFormSchema>;

const projectFormSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, "Vui lòng nhập tên dự án hoặc đề tài.")
      .max(200, "Tên dự án không được vượt quá 200 ký tự."),
    role: z
      .string()
      .trim()
      .max(100, "Vai trò không được vượt quá 100 ký tự."),
    technologies: z
      .string()
      .trim()
      .max(500, "Nội dung công cụ & phương pháp không được vượt quá 500 ký tự."),
    projectUrl: z
      .string()
      .trim()
      .max(500, "Đường dẫn minh chứng không được vượt quá 500 ký tự.")
      .refine((val) => {
        if (val === "") return true;
        try {
          const parsed = new URL(val);
          return parsed.protocol === "http:" || parsed.protocol === "https:";
        } catch {
          return false;
        }
      }, "Đường dẫn phải là URL hợp lệ bắt đầu bằng http:// hoặc https://"),
    startDate: z
      .string()
      .refine(
        (val) => val === "" || val <= getTodayInputValue(),
        "Ngày bắt đầu không được ở trong tương lai.",
      ),
    endDate: z
      .string()
      .refine(
        (val) => val === "" || val <= getTodayInputValue(),
        "Ngày hoàn thành không được ở trong tương lai.",
      ),
    description: z
      .string()
      .trim()
      .max(2000, "Mô tả dự án không được vượt quá 2000 ký tự."),
  })
  .refine(
    (data) =>
      !data.startDate || !data.endDate || data.endDate >= data.startDate,
    {
      message: "Ngày hoàn thành không được nhỏ hơn ngày bắt đầu.",
      path: ["endDate"],
    },
  );

type ProjectFormValues = z.infer<typeof projectFormSchema>;

// ============================================================================
// 2. HÀM TIỆN ÍCH (HELPERS)
// ============================================================================

function getTodayInputValue(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function toDateInputValue(value: string | null | undefined): string {
  if (!value) return "";
  return value.includes("T") ? value.split("T")[0] : value;
}

function formatMonthYear(value: string | null): string {
  if (!value) return "Hiện tại";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat("vi-VN", {
      month: "2-digit",
      year: "numeric",
    }).format(date);
}

function formatSize(bytes: number): string {
  if (!bytes) return "0 KB";
  return bytes < 1024 * 1024
    ? `${Math.max(1, Math.round(bytes / 1024))} KB`
    : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function parseCommaTokens(raw: string | null | undefined): string[] {
  if (!raw) return [];
  return raw
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function extractApiErrorMessage(
  error: unknown,
  fallback = "Đã xảy ra lỗi khi xử lý yêu cầu. Vui lòng thử lại.",
): string {
  if (isAxiosError<{ message?: string | string[] }>(error)) {
    const rawMsg = error.response?.data?.message;
    if (Array.isArray(rawMsg) && rawMsg.length > 0) {
      return rawMsg.join(". ");
    }
    if (typeof rawMsg === "string" && rawMsg.trim().length > 0) {
      return rawMsg;
    }
    if (error.response?.status === 403) {
      return "Tài khoản không có quyền thực hiện thao tác này hoặc đang bị đình chỉ.";
    }
  }
  if (error instanceof Error && error.message) {
    return error.message;
  }
  return fallback;
}

// ============================================================================
// 3. COMPONENT TAG INPUT (NHẬP NHIỀU THẺ CO GIÃN ĐA DÒNG)
// ============================================================================

interface TagInputProps {
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

function TagInput({
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

  const handleKeyDown = (
    event: ReactKeyboardEvent<HTMLInputElement>,
  ): void => {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      commitDraft(draft);
    } else if (
      event.key === "Backspace" &&
      draft === "" &&
      tags.length > 0
    ) {
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

// ============================================================================
// 4. MODAL DIALOG DÙNG CHUNG (STICKY HEADER & FOOTER, CLEAN SCROLLBAR)
// ============================================================================

interface FormDialogProps {
  open: boolean;
  title: string;
  description?: string;
  size?: "md" | "lg";
  onClose: () => void;
  footer?: ReactNode;
  children: ReactNode;
}

function FormDialog({
  open,
  title,
  description,
  size = "md",
  onClose,
  footer,
  children,
}: FormDialogProps): ReactElement | null {
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4 backdrop-blur-[1px]"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="profile-dialog-title"
        onClick={(event) => event.stopPropagation()}
        className={cn(
          "flex max-h-[90vh] w-full flex-col overflow-hidden rounded-panel border border-line bg-surface shadow-lg",
          size === "lg" ? "max-w-2xl" : "max-w-lg",
        )}
      >
        {/* Header cố định */}
        <div className="flex shrink-0 items-start justify-between gap-3 border-b border-line px-5 py-4 md:px-6">
          <div>
            <h3 id="profile-dialog-title" className="text-h3 text-ink">
              {title}
            </h3>
            {description && (
              <p className="mt-1 text-xs leading-5 text-ink-2">{description}</p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng hộp thoại"
            className="rounded-button p-1.5 text-ink-3 hover:bg-subtle hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Nội dung biểu mẫu cuộn mượt, ẩn thanh cuộn thô */}
        <div
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          className="flex-1 overflow-y-auto px-5 py-4 md:px-6 no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
          {children}
        </div>

        {/* Footer cố định */}
        {footer && (
          <div className="shrink-0 border-t border-line bg-canvas/70 px-5 py-3.5 md:px-6">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// 5. COMPONENT CHÍNH: StudentProfilePage
// ============================================================================

export function StudentProfilePage(): ReactElement {
  const todayStr = getTodayInputValue();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  // Tab & Thông báo toàn trang
  const [activeTab, setActiveTab] = useState<CapabilityTab>("skills");
  const [notice, setNotice] = useState<string | null>(null);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);

  // Trạng thái Modal Thêm / Sửa Kỹ năng, Kinh nghiệm, Dự án
  const [skillModalState, setSkillModalState] = useState<{
    open: boolean;
    editing: StudentSkill | null;
  }>({ open: false, editing: null });

  const [expModalState, setExpModalState] = useState<{
    open: boolean;
    editing: StudentExperience | null;
  }>({ open: false, editing: null });

  const [projModalState, setProjModalState] = useState<{
    open: boolean;
    editing: StudentProject | null;
  }>({ open: false, editing: null });

  // Ngữ cảnh gợi ý lĩnh vực trong Modal Dự án
  const [projectDomain, setProjectDomain] =
    useState<ProjectDomainKey>("general");

  // Trạng thái Hộp thoại xác nhận Xóa
  const [confirmDelete, setConfirmDelete] = useState<{
    type: "skill" | "experience" | "project" | "cv" | "avatar";
    id: string;
    label: string;
    isDefaultCv?: boolean;
  } | null>(null);

  // Trạng thái Upload & Đổi tên CV
  const [cvTitle, setCvTitle] = useState<string>("");
  const [cvDefault, setCvDefault] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [cvUploadError, setCvUploadError] = useState<string | null>(null);
  const [renamingCvId, setRenamingCvId] = useState<string | null>(null);
  const [renamingTitle, setRenamingTitle] = useState<string>("");

  // ── Queries ────────────────────────────────────────────────────────────────
  const profileQuery = useQuery({
    queryKey: ["student-profile"],
    queryFn: studentProfileApi.getProfile,
  });
  const skillsQuery = useQuery({
    queryKey: ["student-skills"],
    queryFn: studentProfileApi.getSkills,
  });
  const experiencesQuery = useQuery({
    queryKey: ["student-experiences"],
    queryFn: studentProfileApi.getExperiences,
  });
  const projectsQuery = useQuery({
    queryKey: ["student-projects"],
    queryFn: studentProfileApi.getProjects,
  });
  const cvsQuery = useQuery({
    queryKey: ["student-cvs"],
    queryFn: studentProfileApi.getCvs,
  });

  const profile = profileQuery.data;
  const defaultDomainKey = inferProjectDomain(
    profile?.major,
    profile?.faculty,
  );
  const defaultDomainPreset = PROJECT_DOMAIN_PRESETS[defaultDomainKey];
  const activeProjectPreset = PROJECT_DOMAIN_PRESETS[projectDomain];

  // ── Form 1: Thông tin cá nhân (React Hook Form + Zod) ──────────────────────
  const personalForm = useForm<PersonalProfileFormValues>({
    resolver: zodResolver(personalProfileSchema),
    mode: "onBlur",
    values: {
      displayName: profile?.displayName ?? "",
      phone: profile?.phone ?? "",
      dateOfBirth: toDateInputValue(profile?.dateOfBirth),
      gender: profile?.gender ?? "",
      gpa:
        profile?.gpa !== null && profile?.gpa !== undefined
          ? String(profile.gpa)
          : "",
      address: profile?.address ?? "",
      bio: profile?.bio ?? "",
    },
  });

  const watchedBio =
    useWatch({ control: personalForm.control, name: "bio" }) ?? "";

  // ── Form 2: Kỹ năng (Thêm / Sửa) ───────────────────────────────────────────
  const skillForm = useForm<SkillFormValues>({
    resolver: zodResolver(skillFormSchema),
    mode: "onBlur",
    defaultValues: { skillName: "", proficiency: "" },
  });

  // ── Form 3: Kinh nghiệm làm việc (Thêm / Sửa) ──────────────────────────────
  const experienceForm = useForm<ExperienceFormValues>({
    resolver: zodResolver(experienceFormSchema),
    mode: "onBlur",
    defaultValues: {
      companyName: "",
      position: "",
      startDate: "",
      isCurrent: false,
      endDate: "",
      description: "",
    },
  });

  const isCurrentExp =
    useWatch({ control: experienceForm.control, name: "isCurrent" }) ?? false;

  // ── Form 4: Dự án / Đề tài cá nhân (Thêm / Sửa) ──────────────────────────
  const projectForm = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
    mode: "onBlur",
    defaultValues: {
      name: "",
      role: "",
      technologies: "",
      projectUrl: "",
      startDate: "",
      endDate: "",
      description: "",
    },
  });

  // ── Mutations ──────────────────────────────────────────────────────────────
  const uploadAvatarMutation = useMutation({
    mutationFn: studentProfileApi.uploadAvatar,
    onSuccess: async () => {
      if (avatarInputRef.current) {
        avatarInputRef.current.value = "";
      }
      setErrorNotice(null);
      setNotice("Đã cập nhật ảnh đại diện mới.");
      await queryClient.invalidateQueries({ queryKey: ["student-profile"] });
    },
    onError: (err) => {
      if (avatarInputRef.current) {
        avatarInputRef.current.value = "";
      }
      setNotice(null);
      setErrorNotice(
        extractApiErrorMessage(err, "Không thể tải lên ảnh đại diện."),
      );
    },
  });

  const deleteAvatarMutation = useMutation({
    mutationFn: studentProfileApi.deleteAvatar,
    onSuccess: async () => {
      setConfirmDelete(null);
      setErrorNotice(null);
      setNotice("Đã gỡ ảnh đại diện.");
      await queryClient.invalidateQueries({ queryKey: ["student-profile"] });
    },
    onError: (err) => {
      setConfirmDelete(null);
      setNotice(null);
      setErrorNotice(
        extractApiErrorMessage(err, "Không thể gỡ ảnh đại diện."),
      );
    },
  });

  const profileMutation = useMutation({
    mutationFn: studentProfileApi.updateProfile,
    onSuccess: async () => {
      setErrorNotice(null);
      setNotice("Đã lưu thay đổi thông tin cá nhân.");
      await queryClient.invalidateQueries({ queryKey: ["student-profile"] });
    },
    onError: (err) => {
      setNotice(null);
      setErrorNotice(
        extractApiErrorMessage(err, "Không thể cập nhật thông tin cá nhân."),
      );
    },
  });

  const visibilityMutation = useMutation({
    mutationFn: studentProfileApi.updateVisibility,
    onSuccess: async (_data, nextVisibility) => {
      setErrorNotice(null);
      setNotice(
        nextVisibility
          ? "Đã bật hiển thị công khai hồ sơ năng lực cho Nhà tuyển dụng."
          : "Đã chuyển hồ sơ năng lực sang chế độ riêng tư.",
      );
      await queryClient.invalidateQueries({ queryKey: ["student-profile"] });
    },
    onError: (err) => {
      setNotice(null);
      setErrorNotice(
        extractApiErrorMessage(
          err,
          "Không thể cập nhật trạng thái hiển thị hồ sơ.",
        ),
      );
    },
  });

  const saveSkillMutation = useMutation({
    mutationFn: async (values: SkillFormValues) => {
      const payload = {
        skillName: values.skillName.trim(),
        proficiency: values.proficiency.trim() || null,
      };
      if (skillModalState.editing) {
        return studentProfileApi.updateSkill(
          skillModalState.editing.id,
          payload,
        );
      }
      return studentProfileApi.createSkill(payload);
    },
    onSuccess: async () => {
      const isEdit = Boolean(skillModalState.editing);
      setSkillModalState({ open: false, editing: null });
      skillForm.reset();
      setErrorNotice(null);
      setNotice(
        isEdit ? "Đã cập nhật kỹ năng." : "Đã thêm kỹ năng chuyên môn mới.",
      );
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["student-skills"] }),
        queryClient.invalidateQueries({ queryKey: ["student-profile"] }),
      ]);
    },
    onError: (err) => {
      if (isAxiosError(err) && err.response?.status === 409) {
        skillForm.setError("skillName", {
          type: "server",
          message: "Kỹ năng này đã tồn tại trong hồ sơ của bạn.",
        });
        return;
      }
      setErrorNotice(
        extractApiErrorMessage(err, "Không thể lưu thông tin kỹ năng."),
      );
    },
  });

  const deleteSkillMutation = useMutation({
    mutationFn: studentProfileApi.deleteSkill,
    onSuccess: async () => {
      setConfirmDelete(null);
      setErrorNotice(null);
      setNotice("Đã xóa kỹ năng khỏi hồ sơ.");
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["student-skills"] }),
        queryClient.invalidateQueries({ queryKey: ["student-profile"] }),
      ]);
    },
    onError: (err) => {
      setConfirmDelete(null);
      setErrorNotice(extractApiErrorMessage(err, "Không thể xóa kỹ năng."));
    },
  });

  const saveExperienceMutation = useMutation({
    mutationFn: async (values: ExperienceFormValues) => {
      const payload = {
        companyName: values.companyName.trim(),
        position: values.position.trim(),
        startDate: values.startDate,
        endDate: values.isCurrent || !values.endDate ? null : values.endDate,
        description: values.description.trim() || null,
      };
      if (expModalState.editing) {
        return studentProfileApi.updateExperience(
          expModalState.editing.id,
          payload,
        );
      }
      return studentProfileApi.createExperience(payload);
    },
    onSuccess: async () => {
      const isEdit = Boolean(expModalState.editing);
      setExpModalState({ open: false, editing: null });
      experienceForm.reset();
      setErrorNotice(null);
      setNotice(
        isEdit
          ? "Đã cập nhật kinh nghiệm làm việc."
          : "Đã thêm kinh nghiệm làm việc mới.",
      );
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["student-experiences"] }),
        queryClient.invalidateQueries({ queryKey: ["student-profile"] }),
      ]);
    },
    onError: (err) => {
      setErrorNotice(
        extractApiErrorMessage(err, "Không thể lưu kinh nghiệm làm việc."),
      );
    },
  });

  const deleteExperienceMutation = useMutation({
    mutationFn: studentProfileApi.deleteExperience,
    onSuccess: async () => {
      setConfirmDelete(null);
      setErrorNotice(null);
      setNotice("Đã xóa kinh nghiệm làm việc.");
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["student-experiences"] }),
        queryClient.invalidateQueries({ queryKey: ["student-profile"] }),
      ]);
    },
    onError: (err) => {
      setConfirmDelete(null);
      setErrorNotice(
        extractApiErrorMessage(err, "Không thể xóa kinh nghiệm làm việc."),
      );
    },
  });

  const saveProjectMutation = useMutation({
    mutationFn: async (values: ProjectFormValues) => {
      const normalizedTech = parseCommaTokens(values.technologies).join(", ");
      const payload = {
        name: values.name.trim(),
        role: values.role.trim() || null,
        technologies: normalizedTech || null,
        projectUrl: values.projectUrl.trim() || null,
        startDate: values.startDate || null,
        endDate: values.endDate || null,
        description: values.description.trim() || null,
      };
      if (projModalState.editing) {
        return studentProfileApi.updateProject(
          projModalState.editing.id,
          payload,
        );
      }
      return studentProfileApi.createProject(payload);
    },
    onSuccess: async () => {
      const isEdit = Boolean(projModalState.editing);
      setProjModalState({ open: false, editing: null });
      projectForm.reset();
      setErrorNotice(null);
      setNotice(
        isEdit
          ? "Đã cập nhật dự án / đề tài."
          : "Đã thêm dự án / đề tài mới vào hồ sơ.",
      );
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["student-projects"] }),
        queryClient.invalidateQueries({ queryKey: ["student-profile"] }),
      ]);
    },
    onError: (err) => {
      setErrorNotice(
        extractApiErrorMessage(err, "Không thể lưu thông tin dự án / đề tài."),
      );
    },
  });

  const deleteProjectMutation = useMutation({
    mutationFn: studentProfileApi.deleteProject,
    onSuccess: async () => {
      setConfirmDelete(null);
      setErrorNotice(null);
      setNotice("Đã xóa dự án / đề tài khỏi hồ sơ.");
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["student-projects"] }),
        queryClient.invalidateQueries({ queryKey: ["student-profile"] }),
      ]);
    },
    onError: (err) => {
      setConfirmDelete(null);
      setErrorNotice(
        extractApiErrorMessage(err, "Không thể xóa dự án / đề tài."),
      );
    },
  });

  const cvUploadMutation = useMutation({
    mutationFn: async () => {
      if (!selectedFile) throw new Error("Vui lòng chọn tệp CV định dạng PDF.");
      if (!cvTitle.trim()) {
        throw new Error("Vui lòng nhập tên gợi nhớ cho bản CV.");
      }
      return studentProfileApi.uploadCv(cvTitle.trim(), cvDefault, selectedFile);
    },
    onSuccess: async () => {
      setSelectedFile(null);
      setCvTitle("");
      setCvDefault(false);
      setCvUploadError(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      setErrorNotice(null);
      setNotice("Đã tải lên bản CV mới vào kho lưu trữ.");
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["student-cvs"] }),
        queryClient.invalidateQueries({ queryKey: ["student-profile"] }),
      ]);
    },
    onError: (err) => {
      setCvUploadError(
        extractApiErrorMessage(err, "Tải lên CV thất bại. Vui lòng thử lại."),
      );
    },
  });

  const cvDefaultMutation = useMutation({
    mutationFn: studentProfileApi.setDefaultCv,
    onSuccess: async () => {
      setErrorNotice(null);
      setNotice("Đã cập nhật CV mặc định cho các lần ứng tuyển.");
      await queryClient.invalidateQueries({ queryKey: ["student-cvs"] });
    },
    onError: (err) => {
      setErrorNotice(
        extractApiErrorMessage(err, "Không thể đặt CV mặc định."),
      );
    },
  });

  const cvRenameMutation = useMutation({
    mutationFn: ({ id, title }: { id: string; title: string }) =>
      studentProfileApi.updateCvTitle(id, title),
    onSuccess: async () => {
      setRenamingCvId(null);
      setRenamingTitle("");
      setErrorNotice(null);
      setNotice("Đã đổi tên gợi nhớ cho bản CV.");
      await queryClient.invalidateQueries({ queryKey: ["student-cvs"] });
    },
    onError: (err) => {
      setErrorNotice(extractApiErrorMessage(err, "Không thể đổi tên CV."));
    },
  });

  const cvDeleteMutation = useMutation({
    mutationFn: studentProfileApi.deleteCv,
    onSuccess: async () => {
      setConfirmDelete(null);
      setErrorNotice(null);
      setNotice("Đã xóa bản CV khỏi kho cá nhân.");
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["student-cvs"] }),
        queryClient.invalidateQueries({ queryKey: ["student-profile"] }),
      ]);
    },
    onError: (err) => {
      setConfirmDelete(null);
      setErrorNotice(extractApiErrorMessage(err, "Không thể xóa bản CV."));
    },
  });

  // ── Loading & Fatal Error States ───────────────────────────────────────────
  if (profileQuery.isPending) {
    return (
      <div className="rounded-card border border-line bg-surface p-8 text-center text-small text-ink-2">
        Đang tải hồ sơ sinh viên...
      </div>
    );
  }

  if (profileQuery.isError || !profile?.id) {
    return (
      <Alert variant="danger">
        Không thể tải hồ sơ sinh viên. Vui lòng thử lại hoặc kiểm tra quyền truy
        cập.
      </Alert>
    );
  }

  const skills = Array.isArray(skillsQuery.data) ? skillsQuery.data : [];
  const experiences = Array.isArray(experiencesQuery.data)
    ? experiencesQuery.data
    : [];
  const projects = Array.isArray(projectsQuery.data) ? projectsQuery.data : [];
  const cvs = Array.isArray(cvsQuery.data) ? cvsQuery.data : [];
  const isSuspended = profile.status === "SUSPENDED";

  // ── Handlers ───────────────────────────────────────────────────────────────
  const onSubmitPersonalProfile = (
    values: PersonalProfileFormValues,
  ): void => {
    const cleanDisplayName = values.displayName.trim();
    const cleanPhone = values.phone.replace(/[\s.-]/g, "");
    const cleanAddress = values.address.trim();
    const cleanBio = values.bio.trim();

    profileMutation.mutate({
      displayName: cleanDisplayName
        ? cleanDisplayName
        : profile.displayName !== null
          ? null
          : undefined,
      phone: cleanPhone ? cleanPhone : profile.phone !== null ? null : undefined,
      dateOfBirth: values.dateOfBirth
        ? values.dateOfBirth
        : profile.dateOfBirth !== null
          ? null
          : undefined,
      gender: values.gender
        ? values.gender
        : profile.gender !== null
          ? null
          : undefined,
      gpa: values.gpa
        ? Number(values.gpa)
        : profile.gpa !== null
          ? null
          : undefined,
      address: cleanAddress
        ? cleanAddress
        : profile.address !== null
          ? null
          : undefined,
      bio: cleanBio ? cleanBio : profile.bio !== null ? null : undefined,
    });
  };

  const handleAvatarFileChange = (
    event: ChangeEvent<HTMLInputElement>,
  ): void => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_AVATAR_TYPES.includes(file.type)) {
      setErrorNotice("Chỉ chấp nhận ảnh đại diện định dạng JPG, PNG hoặc WebP.");
      event.target.value = "";
      return;
    }

    if (file.size > MAX_AVATAR_BYTES) {
      setErrorNotice("Dung lượng ảnh đại diện không được vượt quá 2 MB.");
      event.target.value = "";
      return;
    }

    setErrorNotice(null);
    uploadAvatarMutation.mutate(file);
  };

  const openCreateSkillModal = (): void => {
    skillForm.reset({ skillName: "", proficiency: "" });
    setSkillModalState({ open: true, editing: null });
  };

  const openEditSkillModal = (skill: StudentSkill): void => {
    skillForm.reset({
      skillName: skill.skillName,
      proficiency: skill.proficiency ?? "",
    });
    setSkillModalState({ open: true, editing: skill });
  };

  const openCreateExperienceModal = (): void => {
    experienceForm.reset({
      companyName: "",
      position: "",
      startDate: "",
      isCurrent: false,
      endDate: "",
      description: "",
    });
    setExpModalState({ open: true, editing: null });
  };

  const openEditExperienceModal = (exp: StudentExperience): void => {
    experienceForm.reset({
      companyName: exp.companyName,
      position: exp.position,
      startDate: toDateInputValue(exp.startDate),
      isCurrent: exp.endDate === null,
      endDate: toDateInputValue(exp.endDate),
      description: exp.description ?? "",
    });
    setExpModalState({ open: true, editing: exp });
  };

  const openCreateProjectModal = (): void => {
    setProjectDomain(defaultDomainKey);
    projectForm.reset({
      name: "",
      role: "",
      technologies: "",
      projectUrl: "",
      startDate: "",
      endDate: "",
      description: "",
    });
    setProjModalState({ open: true, editing: null });
  };

  const openEditProjectModal = (project: StudentProject): void => {
    setProjectDomain(defaultDomainKey);
    projectForm.reset({
      name: project.name,
      role: project.role ?? "",
      technologies: project.technologies ?? "",
      projectUrl: project.projectUrl ?? "",
      startDate: toDateInputValue(project.startDate),
      endDate: toDateInputValue(project.endDate),
      description: project.description ?? "",
    });
    setProjModalState({ open: true, editing: project });
  };

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

  const handleOpenCv = async (cv: StudentCv): Promise<void> => {
    try {
      const result = await studentProfileApi.getCvDownloadUrl(cv.id);
      if (!result.url) {
        setErrorNotice("Không lấy được đường dẫn tải tệp CV.");
        return;
      }
      window.open(result.url, "_blank", "noopener,noreferrer");
    } catch (err) {
      setErrorNotice(
        extractApiErrorMessage(err, "Không thể mở xem trước tệp CV."),
      );
    }
  };

  const startRenamingCv = (cv: StudentCv): void => {
    setRenamingCvId(cv.id);
    setRenamingTitle(cv.title);
  };

  const submitRenameCv = (cvId: string): void => {
    const trimmed = renamingTitle.trim();
    if (!trimmed) return;
    cvRenameMutation.mutate({ id: cvId, title: trimmed });
  };

  const handleExecuteDelete = (): void => {
    if (!confirmDelete) return;
    if (confirmDelete.type === "skill") {
      deleteSkillMutation.mutate(confirmDelete.id);
    } else if (confirmDelete.type === "experience") {
      deleteExperienceMutation.mutate(confirmDelete.id);
    } else if (confirmDelete.type === "project") {
      deleteProjectMutation.mutate(confirmDelete.id);
    } else if (confirmDelete.type === "cv") {
      cvDeleteMutation.mutate(confirmDelete.id);
    } else if (confirmDelete.type === "avatar") {
      deleteAvatarMutation.mutate();
    }
  };

  const statusMeta: Record<
    StudentProfile["status"],
    { label: string; variant: "success" | "neutral" | "danger" }
  > = {
    ACTIVE: { label: "Đang học", variant: "success" },
    GRADUATED: { label: "Đã tốt nghiệp", variant: "neutral" },
    SUSPENDED: { label: "Bị đình chỉ", variant: "danger" },
  };

  const currentStatusMeta = statusMeta[profile.status] ?? {
    label: "Đang hoạt động",
    variant: "neutral" as const,
  };

  const isDeletePending =
    deleteSkillMutation.isPending ||
    deleteExperienceMutation.isPending ||
    deleteProjectMutation.isPending ||
    cvDeleteMutation.isPending ||
    deleteAvatarMutation.isPending;

  return (
    <div className="space-y-6">
      {/* ── Header trang ─────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-caption uppercase tracking-[0.08em] text-brand-600">
            Hồ sơ năng lực
          </p>
          <h1 className="mt-1 text-h2 text-ink">Hồ sơ sinh viên</h1>
          <p className="mt-1 text-small text-ink-2">
            Quản lý thông tin cá nhân, năng lực chuyên môn và các bản CV ứng
            tuyển.
          </p>
        </div>
        <Badge
          variant={currentStatusMeta.variant}
          icon={<BadgeCheck className="h-3.5 w-3.5" />}
        >
          {currentStatusMeta.label}
        </Badge>
      </div>

      {/* ── Thông báo phản hồi thao tác ──────────────────────────────────── */}
      {notice && (
        <Alert
          variant="success"
          className="cursor-pointer"
          onClick={() => setNotice(null)}
        >
          {notice}
        </Alert>
      )}

      {errorNotice && (
        <Alert
          variant="danger"
          className="cursor-pointer"
          onClick={() => setErrorNotice(null)}
        >
          {errorNotice}
        </Alert>
      )}

      {isSuspended && (
        <Alert variant="danger">
          Tài khoản đang ở trạng thái đình chỉ học tập. Các chức năng cập nhật
          hồ sơ, quản lý CV và ứng tuyển đã bị khóa.
        </Alert>
      )}

      {/* ── Khối 1: Thông tin học thuật gốc (Read-only) & Visibility ─────── */}
      <section className="grid gap-4 desktop:grid-cols-[minmax(0,1.55fr)_minmax(280px,.45fr)]">
        {/* Thông tin học thuật từ student_masters */}
        <div className="rounded-panel border border-line bg-surface p-5 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            {/* Khối Ảnh đại diện có thể thay đổi */}
            <div className="flex flex-col items-start md:items-center gap-2 shrink-0">
              <input
                ref={avatarInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                disabled={isSuspended || uploadAvatarMutation.isPending}
                onChange={handleAvatarFileChange}
                className="sr-only"
              />
              <button
                type="button"
                disabled={isSuspended || uploadAvatarMutation.isPending}
                onClick={() => avatarInputRef.current?.click()}
                title="Nhấn để thay đổi ảnh đại diện (JPG, PNG, WebP tối đa 2MB)"
                aria-label="Thay đổi ảnh đại diện"
                className="group relative flex h-20 w-20 items-center justify-center overflow-hidden rounded-pill border-2 border-brand-200 bg-brand-100 text-h3 font-bold text-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus disabled:cursor-not-allowed disabled:opacity-60"
              >
                {profile.avatarUrl ? (
                  <img
                    src={profile.avatarUrl}
                    alt={profile.fullName || "Ảnh đại diện sinh viên"}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span>
                    {(profile.fullName || "SV").trim().charAt(0).toUpperCase()}
                  </span>
                )}
                <span className="absolute inset-0 flex items-center justify-center bg-ink/45 text-white opacity-0 transition-opacity group-hover:opacity-100">
                  <Camera className="h-5 w-5" aria-hidden="true" />
                </span>
              </button>

              <div className="flex items-center gap-2 text-[11px]">
                <button
                  type="button"
                  disabled={isSuspended || uploadAvatarMutation.isPending}
                  onClick={() => avatarInputRef.current?.click()}
                  className="font-semibold text-brand-600 hover:underline disabled:opacity-50"
                >
                  {uploadAvatarMutation.isPending ? "Đang tải..." : "Đổi ảnh"}
                </button>
                {profile.avatarUrl && (
                  <>
                    <span className="text-line-strong">·</span>
                    <button
                      type="button"
                      disabled={isSuspended || deleteAvatarMutation.isPending}
                      onClick={() =>
                        setConfirmDelete({
                          type: "avatar",
                          id: "avatar",
                          label: "ảnh đại diện hiện tại",
                        })
                      }
                      className="font-semibold text-danger-ink hover:underline disabled:opacity-50"
                    >
                      Gỡ ảnh
                    </button>
                  </>
                )}
              </div>
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-h3 text-ink">
                  {profile.fullName || "Sinh viên AGU"}
                </h2>
                <span
                  title="Thông tin Khoa, Ngành, Khóa và MSSV do Nhà trường quản lý"
                  className="inline-flex items-center gap-1 rounded-pill bg-subtle px-2 py-0.5 text-[11px] font-medium text-ink-3"
                >
                  <LockKeyhole className="h-3 w-3" aria-hidden="true" />
                  Dữ liệu gốc AGU
                </span>
              </div>

              {profile.originalFullName &&
                profile.displayName &&
                profile.displayName !== profile.originalFullName && (
                  <p className="mt-0.5 text-xs text-ink-3">
                    Tên theo hồ sơ gốc AGU: {profile.originalFullName}
                  </p>
                )}

              <p className="mt-1 font-mono text-small font-semibold text-brand-600">
                {profile.studentCode}
              </p>
              <p className="mt-1 flex items-center gap-2 text-small text-ink-2 truncate">
                <Mail className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span className="truncate">{profile.institutionalEmail}</span>
              </p>
            </div>
          </div>

          <div className="mt-5 grid gap-3 border-t border-line pt-5 md:grid-cols-3">
            <div>
              <p className="text-caption text-ink-3">Khoa</p>
              <p className="mt-1 text-small font-semibold text-ink">
                {profile.faculty || "Chưa cập nhật"}
              </p>
            </div>
            <div>
              <p className="text-caption text-ink-3">Ngành đào tạo</p>
              <p className="mt-1 text-small font-semibold text-ink">
                {profile.major || "Chưa cập nhật"}
              </p>
            </div>
            <div>
              <p className="text-caption text-ink-3">Khóa tuyển sinh</p>
              <p className="mt-1 text-small font-semibold text-ink">
                {profile.academicYear
                  ? `Khóa ${profile.academicYear}`
                  : "Chưa cập nhật"}
              </p>
            </div>
          </div>
        </div>

        {/* Cấu hình hiển thị công khai */}
        <div className="rounded-panel border border-line bg-surface p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-card bg-brand-50">
                {profile.careerProfileVisibility ? (
                  <Eye className="h-5 w-5 text-brand-600" />
                ) : (
                  <EyeOff className="h-5 w-5 text-ink-2" />
                )}
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={Boolean(profile.careerProfileVisibility)}
                onClick={() =>
                  visibilityMutation.mutate(!profile.careerProfileVisibility)
                }
                disabled={isSuspended || visibilityMutation.isPending}
                className={cn(
                  "relative h-7 w-12 rounded-pill border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus disabled:cursor-not-allowed disabled:opacity-50",
                  profile.careerProfileVisibility
                    ? "border-brand-600 bg-brand-600"
                    : "border-danger-border bg-danger-border",
                )}
              >
                <span
                  className={cn(
                    "absolute top-1 h-5 w-5 rounded-pill bg-surface shadow-sm transition-transform",
                    profile.careerProfileVisibility ? "left-6" : "left-1",
                  )}
                />
                <span className="sr-only">Hiển thị hồ sơ công khai</span>
              </button>
            </div>

            <div className="mt-4 flex items-center gap-2">
              <h3 className="text-small font-bold text-ink">Hồ sơ công khai</h3>
              <Badge
                variant={profile.careerProfileVisibility ? "success" : "danger"}
              >
                {profile.careerProfileVisibility ? "Đang bật" : "Riêng tư"}
              </Badge>
            </div>

            <p className="mt-1.5 text-xs leading-5 text-ink-2">
              {profile.careerProfileVisibility
                ? "Doanh nghiệp đã xác thực có thể tìm thấy thông tin nghề nghiệp (Ngành, Kỹ năng, Kinh nghiệm, Dự án) của bạn."
                : "Hồ sơ nghề nghiệp đang ẩn khỏi kết quả tìm kiếm của Nhà tuyển dụng."}
            </p>
          </div>

          <div className="mt-4 flex items-center gap-2 border-t border-line pt-3 text-caption text-ink-3">
            <ShieldCheck className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span>SĐT, địa chỉ, GPA và CV cá nhân luôn được ẩn</span>
          </div>
        </div>
      </section>

      {/* ── Khối 2: Thông tin cá nhân (Editable — Nhãn gọn sạch) ──────────── */}
      <section className="rounded-panel border border-line bg-surface p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-h3 text-ink">Thông tin cá nhân</h2>
            <p className="mt-1 text-small text-ink-2">
              Các thông tin bổ sung phục vụ liên hệ và hoàn thiện hồ sơ ứng
              tuyển.
            </p>
          </div>
          <UserRound className="h-5 w-5 text-brand-600" aria-hidden="true" />
        </div>

        <form
          className="mt-5 grid gap-4 md:grid-cols-2"
          noValidate
          onSubmit={personalForm.handleSubmit(onSubmitPersonalProfile)}
        >
          <div className="md:col-span-2">
            <Input
              id="student-display-name"
              label="Tên hiển thị trên hồ sơ"
              placeholder={profile.originalFullName || profile.fullName}
              maxLength={150}
              disabled={isSuspended || profileMutation.isPending}
              error={personalForm.formState.errors.displayName?.message}
              helperText={`Để trống để hiển thị theo họ tên gốc AGU (${profile.originalFullName || profile.fullName}).`}
              {...personalForm.register("displayName")}
            />
          </div>

          <Input
            id="student-phone"
            type="tel"
            label="Số điện thoại"
            placeholder="VD: 0912345678"
            disabled={isSuspended || profileMutation.isPending}
            error={personalForm.formState.errors.phone?.message}
            {...personalForm.register("phone")}
          />

          <Input
            id="student-dob"
            type="date"
            label="Ngày sinh"
            disabled={isSuspended || profileMutation.isPending}
            error={personalForm.formState.errors.dateOfBirth?.message}
            {...personalForm.register("dateOfBirth")}
          />

          <div className="flex flex-col gap-1.5">
            <label
              className="text-small font-medium text-ink"
              htmlFor="student-gender"
            >
              Giới tính
            </label>
            <select
              id="student-gender"
              disabled={isSuspended || profileMutation.isPending}
              className="h-11 w-full rounded-input border-2 border-line-strong bg-surface px-3.5 text-body text-ink transition-all duration-150 hover:border-brand-400 focus:border-brand-600 focus:outline-none focus:ring-4 focus:ring-brand-100 disabled:cursor-not-allowed disabled:bg-subtle disabled:text-ink-3"
              {...personalForm.register("gender")}
            >
              <option value="">Chưa cập nhật</option>
              <option value="Nam">Nam</option>
              <option value="Nữ">Nữ</option>
              <option value="Khác">Khác</option>
            </select>
          </div>

          <Input
            id="student-gpa"
            type="number"
            min="0"
            max="4"
            step="0.01"
            label="GPA tích lũy (Thang 4.00)"
            placeholder="VD: 3.50"
            disabled={isSuspended || profileMutation.isPending}
            error={personalForm.formState.errors.gpa?.message}
            {...personalForm.register("gpa")}
          />

          <div className="md:col-span-2">
            <Input
              id="student-address"
              label="Địa chỉ hiện tại"
              placeholder="VD: Phường Mỹ Xuyên, TP. Long Xuyên, An Giang"
              maxLength={255}
              disabled={isSuspended || profileMutation.isPending}
              error={personalForm.formState.errors.address?.message}
              {...personalForm.register("address")}
            />
          </div>

          <div className="md:col-span-2">
            <Textarea
              id="student-bio"
              label="Giới thiệu & Mục tiêu nghề nghiệp"
              placeholder="Mô tả ngắn gọn định hướng nghề nghiệp, thế mạnh chuyên môn của bạn..."
              maxLength={2000}
              rows={4}
              disabled={isSuspended || profileMutation.isPending}
              error={personalForm.formState.errors.bio?.message}
              helperText={`${watchedBio.length}/2000 ký tự`}
              {...personalForm.register("bio")}
            />
          </div>

          <div className="md:col-span-2 flex justify-end">
            <Button
              type="submit"
              size="sm"
              isLoading={profileMutation.isPending}
              disabled={isSuspended || profileMutation.isPending}
              className="text-white hover:text-white"
            >
              <Save className="h-4 w-4 text-white" />
              <span className="text-white">Lưu thay đổi</span>
            </Button>
          </div>
        </form>
      </section>

      {/* ── Khối 3: Kỹ năng, Kinh nghiệm làm việc & Dự án / Đề tài ───────── */}
      <section className="overflow-hidden rounded-panel border border-line bg-surface shadow-sm">
        <div
          className="flex flex-wrap gap-1 border-b border-line px-4 pt-3"
          role="tablist"
          aria-label="Hồ sơ năng lực"
        >
          {(
            [
              ["skills", "Kỹ năng", skills.length],
              ["experiences", "Kinh nghiệm", experiences.length],
              ["projects", "Dự án / Đề tài", projects.length],
            ] as const
          ).map(([id, label, count]) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={activeTab === id}
              onClick={() => setActiveTab(id)}
              className={cn(
                "flex min-h-11 items-center gap-2 border-b-2 px-3 text-small font-semibold transition-colors",
                activeTab === id
                  ? "border-brand-600 text-brand-700"
                  : "border-transparent text-ink-2 hover:text-brand-600",
              )}
            >
              {label}
              <span className="rounded-pill bg-subtle px-2 py-0.5 text-caption text-ink-2">
                {count}
              </span>
            </button>
          ))}
        </div>

        <div className="p-5">
          {/* Tab 1: Kỹ năng chuyên môn */}
          {activeTab === "skills" && (
            <>
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-h3 text-ink">Kỹ năng chuyên môn</h2>
                  <p className="mt-1 text-small text-ink-2">
                    Các kỹ năng chuyên môn, công cụ làm việc hoặc kỹ năng mềm
                    của bạn.
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={openCreateSkillModal}
                  disabled={isSuspended}
                >
                  <Plus className="h-4 w-4" />
                  Thêm kỹ năng
                </Button>
              </div>

              {skills.length === 0 ? (
                <div className="rounded-card border border-dashed border-line-strong py-8 text-center text-small text-ink-2">
                  Chưa có kỹ năng nào trong hồ sơ.
                </div>
              ) : (
                <div className="grid gap-3 md:grid-cols-2 desktop:grid-cols-3">
                  {skills.map((skill) => (
                    <div
                      key={skill.id}
                      className="flex items-center justify-between gap-3 rounded-card border border-line bg-canvas p-3"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-small font-bold text-ink">
                          {skill.skillName}
                        </p>
                        <p className="mt-1 text-caption text-ink-3">
                          {skill.proficiency || "Chưa chọn mức độ"}
                        </p>
                      </div>
                      <div className="flex shrink-0 items-center gap-1">
                        <button
                          type="button"
                          disabled={isSuspended}
                          aria-label={`Sửa kỹ năng ${skill.skillName}`}
                          onClick={() => openEditSkillModal(skill)}
                          className="rounded-button p-2 text-ink-3 hover:bg-brand-50 hover:text-brand-600 disabled:pointer-events-none disabled:opacity-40"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          disabled={isSuspended}
                          aria-label={`Xóa kỹ năng ${skill.skillName}`}
                          onClick={() =>
                            setConfirmDelete({
                              type: "skill",
                              id: skill.id,
                              label: skill.skillName,
                            })
                          }
                          className="rounded-button p-2 text-ink-3 hover:bg-danger-bg hover:text-danger-ink disabled:pointer-events-none disabled:opacity-40"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* Tab 2: Kinh nghiệm làm việc */}
          {activeTab === "experiences" && (
            <>
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-h3 text-ink">
                    Kinh nghiệm làm việc &amp; Thực tập
                  </h2>
                  <p className="mt-1 text-small text-ink-2">
                    Quá trình thực tập, kiến tập, làm việc bán thời gian hoặc
                    toàn thời gian.
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={openCreateExperienceModal}
                  disabled={isSuspended}
                >
                  <Plus className="h-4 w-4" />
                  Thêm kinh nghiệm
                </Button>
              </div>

              {experiences.length === 0 ? (
                <div className="rounded-card border border-dashed border-line-strong py-8 text-center text-small text-ink-2">
                  Chưa có kinh nghiệm làm việc nào.
                </div>
              ) : (
                <div className="space-y-3">
                  {experiences.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-start gap-3 rounded-card border border-line p-4"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-card bg-brand-50">
                        <BriefcaseBusiness className="h-5 w-5 text-brand-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-small font-bold text-ink">
                          {item.position}
                        </h3>
                        <p className="mt-0.5 text-small text-ink-2">
                          {item.companyName}
                        </p>
                        <p className="mt-2 flex items-center gap-1.5 text-caption text-ink-3">
                          <CalendarDays className="h-3.5 w-3.5" />
                          {formatMonthYear(item.startDate)} —{" "}
                          {formatMonthYear(item.endDate)}
                        </p>
                        {item.description && (
                          <p className="mt-2 whitespace-pre-line text-xs leading-5 text-ink-2">
                            {item.description}
                          </p>
                        )}
                      </div>
                      <div className="flex shrink-0 items-center gap-1">
                        <button
                          type="button"
                          disabled={isSuspended}
                          aria-label={`Sửa kinh nghiệm ${item.position}`}
                          onClick={() => openEditExperienceModal(item)}
                          className="rounded-button p-2 text-ink-3 hover:bg-brand-50 hover:text-brand-600 disabled:pointer-events-none disabled:opacity-40"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          disabled={isSuspended}
                          aria-label={`Xóa kinh nghiệm ${item.position}`}
                          onClick={() =>
                            setConfirmDelete({
                              type: "experience",
                              id: item.id,
                              label: `${item.position} tại ${item.companyName}`,
                            })
                          }
                          className="rounded-button p-2 text-ink-3 hover:bg-danger-bg hover:text-danger-ink disabled:pointer-events-none disabled:opacity-40"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* Tab 3: Dự án & Đề tài */}
          {activeTab === "projects" && (
            <>
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-h3 text-ink">
                    Dự án, Đề tài &amp; Nghiên cứu
                  </h2>
                  <p className="mt-1 text-small text-ink-2">
                    Đồ án môn học, khóa luận, đề tài nghiên cứu khoa học hoặc
                    sản phẩm thực tế.
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={openCreateProjectModal}
                  disabled={isSuspended}
                >
                  <Plus className="h-4 w-4" />
                  Thêm dự án / đề tài
                </Button>
              </div>

              {projects.length === 0 ? (
                <div className="rounded-card border border-dashed border-line-strong py-8 text-center text-small text-ink-2">
                  Chưa có dự án hoặc đề tài nào trong hồ sơ.
                </div>
              ) : (
                <div className="grid gap-3 md:grid-cols-2">
                  {projects.map((item) => {
                    const methodTokens = parseCommaTokens(item.technologies);
                    return (
                      <div
                        key={item.id}
                        className="flex flex-col justify-between rounded-card border border-line p-4"
                      >
                        <div>
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <h3 className="text-small font-bold text-ink">
                                {item.name}
                              </h3>
                              {item.role && (
                                <p className="mt-1 text-xs font-medium text-ink-2">
                                  Vai trò: {item.role}
                                </p>
                              )}
                            </div>
                            <div className="flex shrink-0 items-center gap-1">
                              <button
                                type="button"
                                disabled={isSuspended}
                                aria-label={`Sửa dự án ${item.name}`}
                                onClick={() => openEditProjectModal(item)}
                                className="rounded-button p-2 text-ink-3 hover:bg-brand-50 hover:text-brand-600 disabled:pointer-events-none disabled:opacity-40"
                              >
                                <Pencil className="h-4 w-4" />
                              </button>
                              <button
                                type="button"
                                disabled={isSuspended}
                                aria-label={`Xóa dự án ${item.name}`}
                                onClick={() =>
                                  setConfirmDelete({
                                    type: "project",
                                    id: item.id,
                                    label: item.name,
                                  })
                                }
                                className="rounded-button p-2 text-ink-3 hover:bg-danger-bg hover:text-danger-ink disabled:pointer-events-none disabled:opacity-40"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>

                          {(item.startDate || item.endDate) && (
                            <p className="mt-2 flex items-center gap-1.5 text-caption text-ink-3">
                              <CalendarDays className="h-3.5 w-3.5" />
                              {item.startDate
                                ? formatMonthYear(item.startDate)
                                : "..."}{" "}
                              —{" "}
                              {item.endDate
                                ? formatMonthYear(item.endDate)
                                : "Hiện tại"}
                            </p>
                          )}

                          {item.description && (
                            <p className="mt-2 whitespace-pre-line text-xs leading-5 text-ink-2">
                              {item.description}
                            </p>
                          )}
                        </div>

                        <div className="mt-3 space-y-2.5">
                          {methodTokens.length > 0 && (
                            <div className="flex flex-wrap gap-1.5">
                              {methodTokens.map((token) => (
                                <span
                                  key={token}
                                  className="rounded-pill bg-brand-50 px-2.5 py-0.5 text-[11px] font-medium text-brand-700"
                                >
                                  {token}
                                </span>
                              ))}
                            </div>
                          )}
                          {item.projectUrl && (
                            <a
                              href={item.projectUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-600 hover:text-brand-700 hover:underline"
                            >
                              <ExternalLink className="h-3.5 w-3.5" />
                              Xem minh chứng / sản phẩm
                            </a>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* ── Khối 4: Quản lý đa bản CV ─────────────────────────────────────── */}
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
                          onChange={(e) => setRenamingTitle(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              submitRenameCv(cv.id);
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
                            isLoading={cvRenameMutation.isPending}
                            disabled={
                              !renamingTitle.trim() ||
                              cvRenameMutation.isPending
                            }
                            onClick={() => submitRenameCv(cv.id)}
                          >
                            Lưu
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            disabled={cvRenameMutation.isPending}
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
                          disabled={isSuspended || cvDefaultMutation.isPending}
                          onClick={() => cvDefaultMutation.mutate(cv.id)}
                        >
                          <Check className="h-4 w-4" />
                          Đặt mặc định
                        </Button>
                      )}
                      <button
                        type="button"
                        title="Xem trước"
                        aria-label={`Xem trước ${cv.title}`}
                        onClick={() => void handleOpenCv(cv)}
                        className="rounded-button p-2.5 text-ink-2 hover:bg-brand-50 hover:text-brand-600"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        title="Đổi tên gợi nhớ"
                        disabled={isSuspended}
                        aria-label={`Đổi tên ${cv.title}`}
                        onClick={() => startRenamingCv(cv)}
                        className="rounded-button p-2.5 text-ink-2 hover:bg-brand-50 hover:text-brand-600 disabled:pointer-events-none disabled:opacity-40"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        title="Tải xuống"
                        aria-label={`Tải xuống ${cv.title}`}
                        onClick={() => void handleOpenCv(cv)}
                        className="rounded-button p-2.5 text-ink-2 hover:bg-brand-50 hover:text-brand-600"
                      >
                        <Download className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        title="Xóa CV"
                        disabled={isSuspended}
                        aria-label={`Xóa ${cv.title}`}
                        onClick={() =>
                          setConfirmDelete({
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
              disabled={isSuspended || cvUploadMutation.isPending}
              onChange={handleFileChange}
              className="sr-only"
            />
            <button
              type="button"
              disabled={isSuspended || cvUploadMutation.isPending}
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
              disabled={isSuspended || cvUploadMutation.isPending}
              onChange={(event) => setCvTitle(event.target.value)}
              maxLength={150}
              containerClassName="mt-3"
              placeholder="VD: CV Thực tập sinh / CV Ứng tuyển"
            />

            <label className="mt-3 flex items-center gap-2 text-xs text-ink-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={cvDefault}
                disabled={isSuspended || cvUploadMutation.isPending}
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
              onClick={() => cvUploadMutation.mutate()}
              isLoading={cvUploadMutation.isPending}
              disabled={
                !selectedFile ||
                !cvTitle.trim() ||
                isSuspended ||
                cvUploadMutation.isPending
              }
            >
              <Upload className="h-4 w-4 text-white" />
              <span className="text-white">Tải lên CV</span>
            </Button>
          </div>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* MODAL 1: THÊM / SỬA KỸ NĂNG CHUYÊN MÔN                                */}
      {/* ===================================================================== */}
      <FormDialog
        open={skillModalState.open}
        title={
          skillModalState.editing
            ? "Cập nhật kỹ năng"
            : "Thêm kỹ năng chuyên môn"
        }
        description="Mỗi kỹ năng chỉ xuất hiện một lần trong hồ sơ của bạn."
        onClose={() => setSkillModalState({ open: false, editing: null })}
        footer={
          <div className="flex items-center justify-between gap-3">
            <span className="text-[11px] text-ink-3">* Trường bắt buộc</span>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={saveSkillMutation.isPending}
                onClick={() =>
                  setSkillModalState({ open: false, editing: null })
                }
              >
                Hủy
              </Button>
              <Button
                type="submit"
                form="skill-modal-form"
                size="sm"
                isLoading={saveSkillMutation.isPending}
                disabled={saveSkillMutation.isPending}
                className="text-white hover:text-white"
              >
                <Save className="h-4 w-4 text-white" />
                <span className="text-white">
                  {skillModalState.editing ? "Cập nhật" : "Thêm kỹ năng"}
                </span>
              </Button>
            </div>
          </div>
        }
      >
        <form
          id="skill-modal-form"
          className="space-y-4"
          noValidate
          onSubmit={skillForm.handleSubmit((vals) =>
            saveSkillMutation.mutate(vals),
          )}
        >
          <Input
            id="skill-name"
            label="Tên kỹ năng *"
            placeholder={defaultDomainPreset.skillPlaceholder}
            maxLength={100}
            disabled={saveSkillMutation.isPending}
            error={skillForm.formState.errors.skillName?.message}
            {...skillForm.register("skillName")}
          />

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="skill-proficiency"
              className="text-small font-medium text-ink"
            >
              Mức độ thành thạo
            </label>
            <select
              id="skill-proficiency"
              disabled={saveSkillMutation.isPending}
              className="h-11 w-full rounded-input border-2 border-line-strong bg-surface px-3.5 text-body text-ink transition-all duration-150 hover:border-brand-400 focus:border-brand-600 focus:outline-none focus:ring-4 focus:ring-brand-100"
              {...skillForm.register("proficiency")}
            >
              <option value="">Không chỉ định</option>
              {PROFICIENCY_OPTIONS.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
          </div>
        </form>
      </FormDialog>

      {/* ===================================================================== */}
      {/* MODAL 2: THÊM / SỬA KINH NGHIỆM LÀM VIỆC                              */}
      {/* ===================================================================== */}
      <FormDialog
        open={expModalState.open}
        size="lg"
        title={
          expModalState.editing
            ? "Cập nhật kinh nghiệm làm việc"
            : "Thêm kinh nghiệm làm việc"
        }
        description="Ghi nhận quá trình thực tập, kiến tập hoặc làm việc thực tế tại cơ quan, doanh nghiệp."
        onClose={() => setExpModalState({ open: false, editing: null })}
        footer={
          <div className="flex items-center justify-between gap-3">
            <span className="text-[11px] text-ink-3">* Trường bắt buộc</span>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={saveExperienceMutation.isPending}
                onClick={() => setExpModalState({ open: false, editing: null })}
              >
                Hủy
              </Button>
              <Button
                type="submit"
                form="experience-modal-form"
                size="sm"
                isLoading={saveExperienceMutation.isPending}
                disabled={saveExperienceMutation.isPending}
                className="text-white hover:text-white"
              >
                <Save className="h-4 w-4 text-white" />
                <span className="text-white">
                  {expModalState.editing ? "Cập nhật" : "Lưu kinh nghiệm"}
                </span>
              </Button>
            </div>
          </div>
        }
      >
        <form
          id="experience-modal-form"
          className="space-y-4"
          noValidate
          onSubmit={experienceForm.handleSubmit((vals) =>
            saveExperienceMutation.mutate(vals),
          )}
        >
          <div className="grid gap-4 md:grid-cols-2">
            <Input
              id="exp-company"
              label="Công ty / Tổ chức *"
              placeholder={defaultDomainPreset.companyPlaceholder}
              maxLength={150}
              disabled={saveExperienceMutation.isPending}
              error={experienceForm.formState.errors.companyName?.message}
              {...experienceForm.register("companyName")}
            />

            <Input
              id="exp-position"
              label="Vị trí đảm nhiệm *"
              placeholder={defaultDomainPreset.positionPlaceholder}
              maxLength={150}
              disabled={saveExperienceMutation.isPending}
              error={experienceForm.formState.errors.position?.message}
              {...experienceForm.register("position")}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Input
              id="exp-start-date"
              type="date"
              label="Ngày bắt đầu *"
              max={todayStr}
              disabled={saveExperienceMutation.isPending}
              error={experienceForm.formState.errors.startDate?.message}
              {...experienceForm.register("startDate")}
            />

            <Input
              id="exp-end-date"
              type="date"
              label="Ngày kết thúc"
              max={todayStr}
              disabled={saveExperienceMutation.isPending || isCurrentExp}
              error={experienceForm.formState.errors.endDate?.message}
              {...experienceForm.register("endDate")}
            />
          </div>

          <label className="flex items-center gap-2 text-xs text-ink-2 cursor-pointer select-none">
            <input
              type="checkbox"
              disabled={saveExperienceMutation.isPending}
              className="h-4 w-4 accent-brand-600"
              {...experienceForm.register("isCurrent", {
                onChange: (event: ChangeEvent<HTMLInputElement>) => {
                  if (event.target.checked) {
                    experienceForm.setValue("endDate", "", {
                      shouldValidate: true,
                    });
                  }
                },
              })}
            />
            Hiện tại tôi đang làm việc tại đây
          </label>

          <Textarea
            id="exp-description"
            label="Mô tả công việc & Thành tích"
            placeholder="Nhiệm vụ chính, kỹ năng/công cụ áp dụng và kết quả đạt được..."
            rows={3}
            maxLength={2000}
            disabled={saveExperienceMutation.isPending}
            error={experienceForm.formState.errors.description?.message}
            {...experienceForm.register("description")}
          />
        </form>
      </FormDialog>

      {/* ===================================================================== */}
      {/* MODAL 3: THÊM / SỬA DỰ ÁN & ĐỀ TÀI (TAG INPUT + DOMAIN SWITCHER)     */}
      {/* ===================================================================== */}
      <FormDialog
        open={projModalState.open}
        size="lg"
        title={
          projModalState.editing
            ? "Cập nhật dự án / đề tài"
            : "Thêm dự án / đề tài"
        }
        description="Đề tài nghiên cứu, đồ án môn học hoặc sản phẩm thực tế của bạn."
        onClose={() => setProjModalState({ open: false, editing: null })}
        footer={
          <div className="flex items-center justify-between gap-3">
            <span className="text-[11px] text-ink-3">* Trường bắt buộc</span>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={saveProjectMutation.isPending}
                onClick={() => setProjModalState({ open: false, editing: null })}
              >
                Hủy
              </Button>
              <Button
                type="submit"
                form="project-modal-form"
                size="sm"
                isLoading={saveProjectMutation.isPending}
                disabled={saveProjectMutation.isPending}
                className="text-white hover:text-white"
              >
                <Save className="h-4 w-4 text-white" />
                <span className="text-white">
                  {projModalState.editing ? "Cập nhật" : "Lưu dự án"}
                </span>
              </Button>
            </div>
          </div>
        }
      >
        <form
          id="project-modal-form"
          className="space-y-4"
          noValidate
          onSubmit={projectForm.handleSubmit((vals) =>
            saveProjectMutation.mutate(vals),
          )}
        >
          {/* Thanh chuyển ngữ cảnh gợi ý 1 chạm */}
          <div className="flex flex-wrap items-center gap-1.5 rounded-card border border-line bg-canvas px-3 py-2">
            <span className="mr-1 text-[11px] font-medium text-ink-3">
              Gợi ý theo lĩnh vực:
            </span>
            {PROJECT_DOMAIN_LIST.map((preset) => {
              const isSelected = projectDomain === preset.key;
              return (
                <button
                  key={preset.key}
                  type="button"
                  onClick={() => setProjectDomain(preset.key)}
                  className={cn(
                    "rounded-pill px-2.5 py-0.5 text-[11px] font-semibold transition-colors",
                    isSelected
                      ? "bg-brand-600 text-white"
                      : "bg-surface text-ink-2 hover:bg-brand-50 hover:text-brand-700 border border-line",
                  )}
                >
                  {preset.label}
                </button>
              );
            })}
          </div>

          <Input
            id="proj-name"
            label="Tên dự án / Đề tài *"
            placeholder={activeProjectPreset.projectNamePlaceholder}
            maxLength={200}
            disabled={saveProjectMutation.isPending}
            error={projectForm.formState.errors.name?.message}
            {...projectForm.register("name")}
          />

          {/* Vai trò (1 giá trị + Chip chọn nhanh) */}
          <div>
            <Input
              id="proj-role"
              label="Vai trò"
              placeholder={activeProjectPreset.rolePlaceholder}
              maxLength={100}
              disabled={saveProjectMutation.isPending}
              error={projectForm.formState.errors.role?.message}
              {...projectForm.register("role")}
            />
            <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] text-ink-3">Gợi ý nhanh:</span>
              {activeProjectPreset.roleChips.map((chip) => (
                <button
                  key={chip}
                  type="button"
                  disabled={saveProjectMutation.isPending}
                  onClick={() =>
                    projectForm.setValue("role", chip, {
                      shouldValidate: true,
                      shouldDirty: true,
                    })
                  }
                  className="rounded-pill border border-line bg-subtle px-2.5 py-0.5 text-[11px] text-ink-2 transition-colors hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700 disabled:opacity-50"
                >
                  + {chip}
                </button>
              ))}
            </div>
          </div>

          {/* Công cụ & Phương pháp (Nhập nhiều thẻ TagInput co giãn đa dòng) */}
          <Controller
            name="technologies"
            control={projectForm.control}
            render={({ field, fieldState }) => (
              <TagInput
                id="proj-technologies"
                label="Công cụ & Phương pháp (Có thể thêm nhiều)"
                value={field.value}
                onChange={field.onChange}
                placeholder={activeProjectPreset.methodPlaceholder}
                disabled={saveProjectMutation.isPending}
                error={fieldState.error?.message}
                suggestions={activeProjectPreset.methodChips}
              />
            )}
          />

          <div className="grid gap-4 md:grid-cols-2">
            <Input
              id="proj-start-date"
              type="date"
              label="Ngày bắt đầu"
              max={todayStr}
              disabled={saveProjectMutation.isPending}
              error={projectForm.formState.errors.startDate?.message}
              {...projectForm.register("startDate")}
            />

            <Input
              id="proj-end-date"
              type="date"
              label="Ngày hoàn thành"
              max={todayStr}
              disabled={saveProjectMutation.isPending}
              error={projectForm.formState.errors.endDate?.message}
              {...projectForm.register("endDate")}
            />
          </div>

          <Input
            id="proj-url"
            type="url"
            label="Liên kết minh chứng"
            placeholder={activeProjectPreset.urlPlaceholder}
            helperText="Link Google Drive báo cáo, Slide, bài báo khoa học, video hoặc mã nguồn."
            maxLength={500}
            disabled={saveProjectMutation.isPending}
            error={projectForm.formState.errors.projectUrl?.message}
            {...projectForm.register("projectUrl")}
          />

          <Textarea
            id="proj-description"
            label="Mô tả & Kết quả đạt được"
            placeholder="Tóm tắt mục tiêu, phương pháp thực hiện, đóng góp cá nhân và kết quả chính..."
            rows={3}
            maxLength={2000}
            disabled={saveProjectMutation.isPending}
            error={projectForm.formState.errors.description?.message}
            {...projectForm.register("description")}
          />
        </form>
      </FormDialog>

      {/* ===================================================================== */}
      {/* MODAL 4: XÁC NHẬN XÓA DỮ LIỆU                                         */}
      {/* ===================================================================== */}
      <FormDialog
        open={Boolean(confirmDelete)}
        title="Xác nhận xóa thông tin"
        onClose={() => !isDeletePending && setConfirmDelete(null)}
        footer={
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isDeletePending}
              onClick={() => setConfirmDelete(null)}
            >
              Hủy
            </Button>
            <Button
              type="button"
              variant="danger"
              size="sm"
              isLoading={isDeletePending}
              disabled={isDeletePending}
              onClick={handleExecuteDelete}
            >
              <Trash2 className="h-4 w-4" />
              Xác nhận xóa
            </Button>
          </div>
        }
      >
        {confirmDelete && (
          <div className="flex items-start gap-3 rounded-card border border-danger-border bg-danger-bg/60 p-3.5 text-xs text-danger-ink">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
            <div className="space-y-1">
              <p className="font-semibold">
                Bạn có chắc chắn muốn xóa &ldquo;{confirmDelete.label}&rdquo;?
              </p>
              {confirmDelete.type === "cv" ? (
                <p className="text-ink-2">
                  {confirmDelete.isDefaultCv
                    ? "Đây là CV mặc định hiện tại. Sau khi xóa, hệ thống sẽ tự động đặt bản CV gần nhất còn lại làm mặc định. Các đơn đã ứng tuyển trước đó vẫn giữ nguyên bản sao lưu."
                    : "Tệp CV sẽ bị xóa khỏi kho cá nhân. Các đơn đã ứng tuyển trước đó vẫn giữ nguyên bản sao lưu."}
                </p>
              ) : (
                <p className="text-ink-2">
                  Hành động này không thể hoàn tác sau khi xác nhận.
                </p>
              )}
            </div>
          </div>
        )}
      </FormDialog>
    </div>
  );
}

export default StudentProfilePage;