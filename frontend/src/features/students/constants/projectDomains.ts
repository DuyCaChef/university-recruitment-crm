import type { ProjectDomainKey } from "../types";

export const MAX_CV_BYTES = 5 * 1024 * 1024; // 5 MB
export const MAX_AVATAR_BYTES = 2 * 1024 * 1024; // 2 MB
export const ALLOWED_AVATAR_TYPES: readonly string[] = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

export const PROFICIENCY_OPTIONS = [
  "Cơ bản",
  "Khá",
  "Thành thạo",
  "Chuyên sâu",
] as const;

export interface DomainPresetConfig {
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

export const PROJECT_DOMAIN_PRESETS: Record<
  ProjectDomainKey,
  DomainPresetConfig
> = {
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
    roleChips: ["Trưởng nhóm", "Biên dịch viên", "Trợ giảng", "Điều phối viên"],
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

export const PROJECT_DOMAIN_LIST: readonly DomainPresetConfig[] = [
  PROJECT_DOMAIN_PRESETS.tech,
  PROJECT_DOMAIN_PRESETS.economics,
  PROJECT_DOMAIN_PRESETS.language,
  PROJECT_DOMAIN_PRESETS.agri,
  PROJECT_DOMAIN_PRESETS.general,
];

export function inferProjectDomain(
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
