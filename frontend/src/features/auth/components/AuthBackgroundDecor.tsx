// src/features/auth/components/AuthBackgroundDecor.tsx
import type { ReactElement } from "react";

interface NeuronClusterProps {
  className?: string;
  showLabels?: boolean;
}

/**
 * Cụm Nơ-ron 3 đỉnh (Sinh viên / Career Center / Doanh nghiệp):
 * - Tam giác không đều nối nét mảnh 1px
 * - 3 đường liên kết chạy dash hội tụ về chấm tròn lớn chính giữa
 * - Dùng thống nhất màu brand-600 của nút Đăng nhập Gmail AGU
 */
const AguNeuronCluster = ({
  className,
  showLabels = true,
}: NeuronClusterProps): ReactElement => {
  return (
    <svg
      viewBox="0 0 220 180"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      {/* Viền tam giác không đều nối 3 đỉnh (1px) */}
      <polygon
        points="112,30 38,128 178,108"
        className="stroke-brand-600"
        strokeWidth="1"
        strokeOpacity="0.28"
      />

      {/* 3 đường liên kết nối 3 đỉnh hội tụ về chấm tròn trung tâm (chạy dash nhẹ) */}
      <line
        x1="112"
        y1="30"
        x2="108"
        y2="90"
        className="stroke-brand-600 animate-agu-dash"
        strokeWidth="1.25"
        strokeOpacity="0.55"
      />
      <line
        x1="38"
        y1="128"
        x2="108"
        y2="90"
        className="stroke-brand-600 animate-agu-dash"
        strokeWidth="1.25"
        strokeOpacity="0.55"
      />
      <line
        x1="178"
        y1="108"
        x2="108"
        y2="90"
        className="stroke-brand-600 animate-agu-dash"
        strokeWidth="1.25"
        strokeOpacity="0.55"
      />

      {/* Chấm tròn lớn chính giữa (Hub kết nối trung tâm) */}
      <circle
        cx="108"
        cy="90"
        r="15"
        className="fill-brand-600"
        fillOpacity="0.12"
      />
      <circle
        cx="108"
        cy="90"
        r="9.5"
        className="fill-brand-600 stroke-surface"
        strokeWidth="2.5"
      />

      {/* Đỉnh A: Sinh viên */}
      <circle
        cx="112"
        cy="30"
        r="6"
        className="fill-brand-600 stroke-surface"
        strokeWidth="2"
      />
      {showLabels && (
        <text
          x="112"
          y="16"
          textAnchor="middle"
          fontSize="10"
          className="fill-ink-2 font-medium"
        >
          Sinh viên
        </text>
      )}

      {/* Đỉnh B: Career Center */}
      <circle
        cx="38"
        cy="128"
        r="6"
        className="fill-brand-600 stroke-surface"
        strokeWidth="2"
      />
      {showLabels && (
        <text
          x="38"
          y="147"
          textAnchor="middle"
          fontSize="10"
          className="fill-ink-2 font-medium"
        >
          Career Center
        </text>
      )}

      {/* Đỉnh C: Doanh nghiệp */}
      <circle
        cx="178"
        cy="108"
        r="6"
        className="fill-brand-600 stroke-surface"
        strokeWidth="2"
      />
      {showLabels && (
        <text
          x="178"
          y="128"
          textAnchor="middle"
          fontSize="10"
          className="fill-ink-2 font-medium"
        >
          Doanh nghiệp
        </text>
      )}
    </svg>
  );
};

interface GridDotItem {
  id: string;
  positionClass: string;
  colorClass: string;
  sizeClass: string;
  animated?: boolean;
}

/** 6 chấm trang trí cố định theo lưới, chỉ dùng 3 màu nhận diện */
const GRID_DECOR_DOTS: readonly GridDotItem[] = [
  {
    id: "dot-tl",
    positionClass: "left-[10%] top-[28%]",
    colorClass: "bg-brand-600 opacity-35",
    sizeClass: "h-2 w-2",
    animated: true,
  },
  {
    id: "dot-bl",
    positionClass: "left-[24%] bottom-[22%]",
    colorClass: "bg-sand opacity-50",
    sizeClass: "h-2.5 w-2.5",
  },
  {
    id: "dot-ml",
    positionClass: "left-[14%] top-[52%]",
    colorClass: "bg-clay-600 opacity-35",
    sizeClass: "h-1.5 w-1.5",
  },
  {
    id: "dot-tr",
    positionClass: "right-[14%] top-[24%]",
    colorClass: "bg-sand opacity-50",
    sizeClass: "h-2.5 w-2.5",
    animated: true,
  },
  {
    id: "dot-mr",
    positionClass: "right-[9%] top-[44%]",
    colorClass: "bg-brand-600 opacity-35",
    sizeClass: "h-2 w-2",
  },
  {
    id: "dot-br",
    positionClass: "right-[16%] bottom-[38%]",
    colorClass: "bg-clay-600 opacity-35",
    sizeClass: "h-1.5 w-1.5",
  },
];

export const AuthBackgroundDecor = (): ReactElement => {
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden="true"
    >
      {/* 1. Ba dải chữ V nét mảnh góc trên trái (3 màu nhận diện AGU) */}
      <svg
        className="absolute left-0 top-0 h-[320px] w-[360px] opacity-55 md:h-[460px] md:w-[560px] md:opacity-100"
        viewBox="0 0 560 460"
        fill="none"
      >
        <defs>
          <radialGradient
            id="agu-v-fade-mask"
            cx="28%"
            cy="24%"
            r="72%"
            fx="24%"
            fy="20%"
          >
            <stop offset="0%" stopColor="white" stopOpacity="1" />
            <stop offset="68%" stopColor="white" stopOpacity="0.65" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </radialGradient>
          <mask id="agu-v-mask">
            <rect width="560" height="460" fill="url(#agu-v-fade-mask)" />
          </mask>
        </defs>

        <g mask="url(#agu-v-mask)" strokeLinecap="round" strokeLinejoin="round">
          <polyline
            points="-20,18 148,312 362,18"
            className="stroke-brand-600"
            strokeWidth="1.75"
            strokeOpacity="0.18"
          />
          <polyline
            points="16,-6 176,274 382,-10"
            className="stroke-sand"
            strokeWidth="1.75"
            strokeOpacity="0.22"
          />
          <polyline
            points="52,-30 204,236 402,-38"
            className="stroke-clay-600"
            strokeWidth="1.75"
            strokeOpacity="0.16"
          />
        </g>
      </svg>

      {/* 2. Biểu trưng kiến trúc góc dưới trái: Phát triển - Bền vững - Uy tín - Tiên phong */}
      <svg
        className="hidden md:block absolute bottom-0 left-0 h-[340px] w-[340px] desktop:h-[440px] desktop:w-[440px]"
        viewBox="0 0 500 500"
        fill="none"
      >
        {/* Đường chân đế kiến trúc (Uy tín & Nền tảng vững chắc) */}
        <line
          x1="0"
          y1="476"
          x2="410"
          y2="476"
          className="stroke-brand-600"
          strokeWidth="1.25"
          strokeOpacity="0.18"
        />
        <line
          x1="0"
          y1="484"
          x2="290"
          y2="484"
          className="stroke-brand-600"
          strokeWidth="1"
          strokeOpacity="0.25"
        />

        {/* Nhánh trái chữ V — mảng phụ xanh thương hiệu tạo chiều sâu lớp */}
        <path
          d="M 42 252 L 164 460 L 186 460 L 64 252 Z"
          className="fill-brand-600"
          fillOpacity="0.18"
        />

        {/* Nhánh trái chữ V — trụ neo màu brand-600 (Uy tín) */}
        <path
          d="M -10 218 L 138 476 L 172 476 L 24 218 Z"
          className="fill-brand-600"
          fillOpacity="0.92"
        />

        {/* 3 trụ chéo vươn lên theo bậc tăng trưởng (Sự phát triển) */}
        {/* Trụ cao nhất — vươn xa tạo đỉnh chữ V AGU */}
        <path
          d="M 138 476 L 312 174 L 348 174 L 174 476 Z"
          className="fill-brand-600"
          fillOpacity="0.95"
        />
        {/* Trụ giữa — nhịp tăng trưởng nối tiếp */}
        <path
          d="M 196 476 L 332 240 L 362 240 L 226 476 Z"
          className="fill-brand-600"
          fillOpacity="0.82"
        />
        {/* Trụ ngoài — nhịp nền mở rộng */}
        <path
          d="M 248 476 L 340 316 L 364 316 L 272 476 Z"
          className="fill-brand-600"
          fillOpacity="0.62"
        />

        {/* Đường mạch chữ V liên tục không đứt gãy màu Sand (Bền vững) */}
        <polyline
          points="56,222 174,428 346,130"
          className="stroke-sand"
          strokeWidth="2"
          strokeOpacity="0.85"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Điểm nhấn tọa độ tại tâm chữ V (Clay) & đỉnh vươn (Sand) */}
        <circle
          cx="155"
          cy="476"
          r="5"
          className="fill-clay-600 stroke-canvas"
          strokeWidth="2"
        />
        <circle
          cx="346"
          cy="130"
          r="4.5"
          className="fill-sand stroke-canvas"
          strokeWidth="2"
        />
        <circle
          cx="362"
          cy="240"
          r="3.5"
          className="fill-brand-600"
          fillOpacity="0.65"
        />
      </svg>

      {/* 3. Đường nét chéo góc trên phải (đồng bộ màu brand-600) */}
      <svg
        className="hidden md:block absolute -right-20 -top-20 h-[280px] w-[280px] desktop:h-[380px] desktop:w-[380px] text-brand-600"
        viewBox="0 0 400 400"
        fill="none"
      >
        <path d="M140 -20 L380 220 L380 275 L85 -20 Z" fill="currentColor" />
        <path d="M225 -20 L380 135 L380 178 L182 -20 Z" fill="currentColor" />
      </svg>

      {/* 4. Vòng tròn đồng tâm dùng token border-line */}
      <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 items-center justify-center">
        <div className="h-[620px] w-[620px] rounded-full border border-line" />
        <div className="absolute h-[820px] w-[820px] rounded-full border border-line opacity-75" />
      </div>

      {/* 5. Cụm Nơ-ron 1: Bên trái cao (Tablet trở lên) */}
      <div className="hidden md:block absolute top-[14%] right-[calc(50%+272px)] desktop:top-[15%] desktop:right-[calc(50%+312px)] animate-agu-neuron-a">
        <AguNeuronCluster
          className="h-32 w-40 desktop:h-44 desktop:w-52"
          showLabels
        />
      </div>

      {/* 6. Cụm Nơ-ron 2: Bên phải thấp (Desktop) */}
      <div className="hidden desktop:block absolute bottom-[12%] left-[calc(50%+312px)] animate-agu-neuron-b">
        <AguNeuronCluster className="h-44 w-52" showLabels />
      </div>

      {/* 7. 6 chấm trang trí cố định theo lưới (Desktop) */}
      <div className="hidden desktop:block">
        {GRID_DECOR_DOTS.map((dot) => (
          <span
            key={dot.id}
            className={`absolute rounded-full ${dot.positionClass} ${dot.colorClass} ${dot.sizeClass} ${dot.animated ? "animate-agu-dot-float" : ""}`}
          />
        ))}
      </div>
    </div>
  );
};
