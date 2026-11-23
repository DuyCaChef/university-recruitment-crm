// src/features/auth/pages/CompanyRegisterPage.tsx
import { useState, type ChangeEvent, type ReactElement } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { isAxiosError } from "axios";
import {
  Eye,
  EyeOff,
  ShieldAlert,
  Building2,
  Mail,
  Hash,
  Phone,
  Globe,
  MapPin,
  User,
  Briefcase,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  HelpCircle,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { ERROR_MESSAGES } from "@/shared/constants/errors";
import {
  companyRegisterSchema,
  evaluateRegistrationPassword,
  type CompanyRegisterFormValues,
} from "../schemas/companyRegister.schema";
import { useCompanyRegisterMutation } from "../hooks/useCompanyRegisterMutation";
import { RegistrationStepper } from "../components/RegistrationStepper";
import { CompanyRegisterSuccessState } from "../components/CompanyRegisterSuccessState";
import type {
  ApiErrorPayload,
  CompanyRegisterResponseData,
} from "../types";

export const CompanyRegisterPage = (): ReactElement => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [maxAccessibleStep, setMaxAccessibleStep] = useState<1 | 2 | 3>(1);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [useSameEmail, setUseSameEmail] = useState<boolean>(false);
  const [registrationSuccessData, setRegistrationSuccessData] =
    useState<CompanyRegisterResponseData | null>(null);

  const {
    register,
    handleSubmit,
    trigger,
    control,
    setError,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CompanyRegisterFormValues>({
    resolver: zodResolver(companyRegisterSchema),
    mode: "onBlur",
    defaultValues: {
      accountEmail: "",
      password: "",
      confirmPassword: "",
      companyName: "",
      companyEmail: "",
      taxCode: "",
      companyPhone: "",
      website: "",
      address: "",
      description: "",
      representativeName: "",
      representativePhone: "",
      representativePosition: "",
    },
  });

  const accountEmailValue = useWatch({ control, name: "accountEmail" }) || "";
  const passwordValue = useWatch({ control, name: "password" }) || "";
  const confirmPasswordValue =
    useWatch({ control, name: "confirmPassword" }) || "";
  const passwordStrength = evaluateRegistrationPassword(
    passwordValue,
    confirmPasswordValue,
  );

  const registerMutation = useCompanyRegisterMutation({
    onSuccess: (data) => {
      setRegistrationSuccessData(data);
    },
  });

  // Đồng bộ email công ty với email đăng nhập khi bật checkbox
  const handleToggleSameEmail = (event: ChangeEvent<HTMLInputElement>): void => {
    const checked = event.target.checked;
    setUseSameEmail(checked);
    if (checked) {
      setValue("companyEmail", accountEmailValue.trim(), {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  };

  // Tách register cho companyEmail để tự bỏ tick checkbox nếu người dùng sửa tay khác email Bước 1
  const companyEmailField = register("companyEmail");
  const handleCompanyEmailChange = (
    event: ChangeEvent<HTMLInputElement>,
  ): void => {
    void companyEmailField.onChange(event);
    if (
      useSameEmail &&
      event.target.value.trim().toLowerCase() !==
      accountEmailValue.trim().toLowerCase()
    ) {
      setUseSameEmail(false);
    }
  };

  // Chuyển sang Bước 2 có thẩm định các trường Bước 1
  const handleProceedToStep2 = async (): Promise<void> => {
    const isStep1Valid = await trigger([
      "accountEmail",
      "password",
      "confirmPassword",
    ]);
    if (isStep1Valid) {
      if (useSameEmail) {
        setValue("companyEmail", accountEmailValue.trim(), {
          shouldValidate: true,
        });
      }
      setCurrentStep(2);
      setMaxAccessibleStep((prev) => (prev < 2 ? 2 : prev));
    }
  };

  // Chuyển sang Bước 3 có thẩm định các trường Bước 2
  const handleProceedToStep3 = async (): Promise<void> => {
    const isStep2Valid = await trigger([
      "companyName",
      "companyEmail",
      "taxCode",
      "companyPhone",
      "website",
      "address",
      "description",
    ]);
    if (isStep2Valid) {
      setCurrentStep(3);
      setMaxAccessibleStep((prev) => (prev < 3 ? 3 : prev));
    }
  };

  // Trích xuất mã lỗi nghiệp vụ từ phản hồi API backend
  const getServerErrorMessage = (): {
    code?: string;
    message: string;
    targetField?: "accountEmail" | "taxCode";
  } | null => {
    if (!registerMutation.isError) return null;

    const error = registerMutation.error;
    if (isAxiosError<ApiErrorPayload>(error)) {
      const status = error.response?.status;
      const errorCode = error.response?.data?.errorCode;
      const rawMessage = Array.isArray(error.response?.data?.message)
        ? error.response?.data?.message.join(", ")
        : error.response?.data?.message || "";

      // E01: Trùng email đăng nhập (409 Conflict)
      if (
        errorCode === "E01" ||
        errorCode === "EMAIL_ALREADY_EXISTS" ||
        (status === 409 && rawMessage.toLowerCase().includes("email"))
      ) {
        return {
          code: "E01",
          message: ERROR_MESSAGES.E01,
          targetField: "accountEmail",
        };
      }

      // E02: Trùng mã số thuế tax_code (409 Conflict)
      if (
        errorCode === "E02" ||
        errorCode === "TAX_CODE_ALREADY_EXISTS" ||
        (status === 409 &&
          (rawMessage.toLowerCase().includes("tax") ||
            rawMessage.toLowerCase().includes("thuế")))
      ) {
        return {
          code: "E02",
          message: ERROR_MESSAGES.E02,
          targetField: "taxCode",
        };
      }

      // E03: Dữ liệu thiếu hoặc sai định dạng (400 Bad Request)
      if (
        errorCode === "E03" ||
        errorCode === "INVALID_REGISTRATION_DATA" ||
        status === 400
      ) {
        return {
          code: "E03",
          message:
            rawMessage || ERROR_MESSAGES.E03 || ERROR_MESSAGES.DEFAULT,
        };
      }

      // E04: Lỗi hệ thống / Rollback giao dịch (500)
      if (
        errorCode === "E04" ||
        errorCode === "TRANSACTION_FAILED" ||
        status === 500
      ) {
        return {
          code: "E04",
          message: ERROR_MESSAGES.E04,
        };
      }
    }

    return { message: ERROR_MESSAGES.DEFAULT };
  };

  const serverError = getServerErrorMessage();

  // Submit toàn bộ biểu mẫu (Giao dịch nguyên tử Atomic Transaction)
  const onSubmit = (values: CompanyRegisterFormValues): void => {
    registerMutation.mutate(
      {
        email: values.accountEmail,
        password: values.password,
        confirmPassword: values.confirmPassword,
        name: values.companyName,
        companyEmail: values.companyEmail,
        taxCode: values.taxCode || undefined,
        companyPhone: values.companyPhone || undefined,
        website: values.website || undefined,
        address: values.address || undefined,
        description: values.description || undefined,
        fullName: values.representativeName,
        representativePhone: values.representativePhone || undefined,
        position: values.representativePosition || undefined,
      },
      {
        onError: (err) => {
          if (isAxiosError<ApiErrorPayload>(err)) {
            const status = err.response?.status;
            const msg = Array.isArray(err.response?.data?.message)
              ? err.response?.data?.message.join(", ")
              : err.response?.data?.message || "";

            // Tự động nhảy về Bước 1 nếu trùng email
            if (
              err.response?.data?.errorCode === "E01" ||
              (status === 409 && msg.toLowerCase().includes("email"))
            ) {
              setCurrentStep(1);
              setError("accountEmail", {
                type: "server",
                message: ERROR_MESSAGES.E01,
              });
            }
            // Tự động nhảy về Bước 2 nếu trùng mã số thuế
            else if (
              err.response?.data?.errorCode === "E02" ||
              (status === 409 &&
                (msg.toLowerCase().includes("tax") ||
                  msg.toLowerCase().includes("thuế")))
            ) {
              setCurrentStep(2);
              setError("taxCode", {
                type: "server",
                message: ERROR_MESSAGES.E02,
              });
            }
          }
        },
      },
    );
  };

  // Nếu đã đăng ký thành công, hiển thị màn hình kết quả chờ xác thực
  if (registrationSuccessData) {
    return (
      <CompanyRegisterSuccessState
        data={registrationSuccessData}
        onGoToLogin={() => navigate("/login")}
      />
    );
  }

  const isFormPending = registerMutation.isPending || isSubmitting;

  return (
    <div className="flex flex-col gap-6">
      {/* Tiêu đề & Giới thiệu trang */}
      <div className="flex flex-col items-center text-center gap-1.5">
        <h1 className="text-xl font-bold text-ink">
          Đăng ký tài khoản Doanh nghiệp
        </h1>
        <p className="text-small text-ink-2 max-w-lg">
          Hoàn tất 3 bước ngắn gọn để mở tài khoản tuyển dụng và kết nối sinh
          viên Trường Đại học An Giang. Các trường có dấu{" "}
          <span className="font-semibold text-danger-ink">(*)</span> là thông
          tin bắt buộc.
        </p>
      </div>

      {/* Thanh tiến trình 3 bước (Stepper) */}
      <div className="px-0 md:px-2">
        <RegistrationStepper
          currentStep={currentStep}
          maxAccessibleStep={maxAccessibleStep}
          onStepClick={(step) => setCurrentStep(step)}
        />
      </div>

      {/* Cảnh báo lỗi máy chủ ở đầu form nếu có */}
      {serverError && (
        <div
          role="alert"
          aria-live="polite"
          className="rounded-card border border-danger-border bg-danger-bg p-3.5 text-small text-danger-ink flex items-start gap-2.5"
        >
          <ShieldAlert
            className="h-5 w-5 shrink-0 text-danger-ink mt-0.5"
            aria-hidden="true"
          />
          <div className="flex flex-col gap-0.5">
            <span className="font-bold">Đăng ký chưa thành công</span>
            <span className="text-xs">{serverError.message}</span>
          </div>
        </div>
      )}

      {/* Form thu thập dữ liệu theo 3 nhóm nghiệp vụ */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="flex flex-col gap-5"
      >
        {/* ================================================================= */}
        {/* BƯỚC 1: THIẾT LẬP TÀI KHOẢN ĐĂNG NHẬP                             */}
        {/* ================================================================= */}
        {currentStep === 1 && (
          <div className="flex flex-col gap-4 animate-fadeIn">
            <div className="border-b border-line pb-2.5">
              <h2 className="text-body font-bold text-ink flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-pill bg-brand-600 text-[11px] text-white">
                  1
                </span>
                Thiết lập tài khoản đăng nhập
              </h2>
              <p className="text-xs text-ink-3 mt-1 leading-relaxed">
                Tạo thông tin đăng nhập dành cho người phụ trách tuyển dụng. Tài
                khoản này giúp bạn quản lý hồ sơ công ty, theo dõi tiến độ xét
                duyệt và đăng tin tuyển dụng sau này.
              </p>
            </div>

            <Input
              id="register-account-email"
              type="email"
              label="Email đăng nhập *"
              placeholder="VD: tuyendung@congty.vn"
              helperText="Dùng để đăng nhập và nhận thông báo hệ thống. Có thể dùng email công việc của bạn hoặc email chung của công ty."
              autoComplete="username"
              disabled={isFormPending}
              error={errors.accountEmail?.message}
              rightElement={
                <Mail className="h-5 w-5 mr-2 text-ink-3" aria-hidden="true" />
              }
              {...register("accountEmail")}
            />

            <Input
              id="register-password"
              type={showPassword ? "text" : "password"}
              label="Mật khẩu *"
              placeholder="Tối thiểu 8 ký tự, gồm chữ hoa, chữ thường, số, ký tự đặc biệt"
              autoComplete="new-password"
              disabled={isFormPending}
              error={errors.password?.message}
              rightElement={
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                  className="inline-flex h-8 w-9 items-center justify-center rounded-xs text-ink-2 hover:bg-subtle hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" aria-hidden="true" />
                  ) : (
                    <Eye className="h-5 w-5" aria-hidden="true" />
                  )}
                </button>
              }
              {...register("password")}
            />

            {/* Checklist tiêu chí độ mạnh mật khẩu (Live criteria) */}
            {passwordValue.length > 0 && (
              <div className="rounded-input border border-line bg-subtle/50 p-3 flex flex-col gap-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-ink-2">
                    Độ mạnh mật khẩu:
                  </span>
                  <span
                    className={`font-semibold ${passwordStrength.strengthColor}`}
                  >
                    {passwordStrength.strengthLabel}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-1.5 text-[11px] text-ink-2">
                  <div className="flex items-center gap-1.5">
                    {passwordStrength.hasMinLength ? (
                      <CheckCircle2 className="h-3.5 w-3.5 text-success-ink shrink-0" />
                    ) : (
                      <div className="h-3.5 w-3.5 rounded-pill border border-line-strong shrink-0" />
                    )}
                    <span>Tối thiểu 8 ký tự</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {passwordStrength.hasUpperAndLower ? (
                      <CheckCircle2 className="h-3.5 w-3.5 text-success-ink shrink-0" />
                    ) : (
                      <div className="h-3.5 w-3.5 rounded-pill border border-line-strong shrink-0" />
                    )}
                    <span>Chữ hoa &amp; thường (Aa)</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {passwordStrength.hasNumber ? (
                      <CheckCircle2 className="h-3.5 w-3.5 text-success-ink shrink-0" />
                    ) : (
                      <div className="h-3.5 w-3.5 rounded-pill border border-line-strong shrink-0" />
                    )}
                    <span>Ít nhất 1 chữ số (0-9)</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {passwordStrength.hasSpecialChar ? (
                      <CheckCircle2 className="h-3.5 w-3.5 text-success-ink shrink-0" />
                    ) : (
                      <div className="h-3.5 w-3.5 rounded-pill border border-line-strong shrink-0" />
                    )}
                    <span>Ký tự đặc biệt (!@#$)</span>
                  </div>
                </div>
              </div>
            )}

            <Input
              id="register-confirm-password"
              type={showConfirmPassword ? "text" : "password"}
              label="Xác nhận mật khẩu *"
              placeholder="Nhập lại chính xác mật khẩu ở trên"
              autoComplete="new-password"
              disabled={isFormPending}
              error={errors.confirmPassword?.message}
              rightElement={
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  aria-label={
                    showConfirmPassword
                      ? "Ẩn xác nhận mật khẩu"
                      : "Hiện xác nhận mật khẩu"
                  }
                  className="inline-flex h-8 w-9 items-center justify-center rounded-xs text-ink-2 hover:bg-subtle hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5" aria-hidden="true" />
                  ) : (
                    <Eye className="h-5 w-5" aria-hidden="true" />
                  )}
                </button>
              }
              {...register("confirmPassword")}
            />

            <div className="pt-2 flex justify-end">
              <Button
                type="button"
                variant="primary"
                size="md"
                onClick={() => void handleProceedToStep2()}
                className="gap-2 font-semibold"
              >
                <span>Tiếp tục</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Button>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* BƯỚC 2: THÔNG TIN PHÁP NHÂN DOANH NGHIỆP                          */}
        {/* ================================================================= */}
        {currentStep === 2 && (
          <div className="flex flex-col gap-4 animate-fadeIn">
            <div className="border-b border-line pb-2.5">
              <h2 className="text-body font-bold text-ink flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-pill bg-brand-600 text-[11px] text-white">
                  2
                </span>
                Thông tin pháp nhân doanh nghiệp
              </h2>
              <p className="text-xs text-ink-3 mt-1 leading-relaxed">
                Khai báo thông tin cơ bản của công ty để Trung tâm Hướng nghiệp
                &amp; Hỗ trợ Sinh viên AGU xác minh tính chính danh và hiển thị
                hồ sơ doanh nghiệp uy tín đến sinh viên.
              </p>
            </div>

            {/* Nhóm 2.1: Thông tin định danh bắt buộc */}
            <Input
              id="register-company-name"
              label="Tên pháp nhân doanh nghiệp *"
              placeholder="VD: Công ty Cổ phần Công nghệ ABC An Giang"
              helperText="Nhập đúng tên đầy đủ theo Giấy chứng nhận đăng ký doanh nghiệp để Nhà trường đối chiếu."
              disabled={isFormPending}
              error={errors.companyName?.message}
              rightElement={
                <Building2 className="h-4 w-4 text-ink-3" aria-hidden="true" />
              }
              {...register("companyName")}
            />

            <div className="flex flex-col gap-2">
              <Input
                id="register-company-email"
                type="email"
                label="Email chính thức của doanh nghiệp *"
                placeholder="VD: contact@abc-tech.com"
                helperText="Hiển thị trên hồ sơ đối tác để Nhà trường gửi công văn hoặc liên hệ hợp tác."
                disabled={isFormPending}
                error={errors.companyEmail?.message}
                rightElement={
                  <Mail className="h-4 w-4 text-ink-3" aria-hidden="true" />
                }
                {...companyEmailField}
                onChange={handleCompanyEmailChange}
              />

              <label className="inline-flex items-center gap-2 text-xs text-ink-2 cursor-pointer select-none w-fit">
                <input
                  type="checkbox"
                  checked={useSameEmail}
                  onChange={handleToggleSameEmail}
                  disabled={isFormPending || !accountEmailValue.trim()}
                  className="h-4 w-4 rounded border-line-strong text-brand-600 focus:ring-2 focus:ring-focus disabled:cursor-not-allowed disabled:opacity-50"
                />
                <span>
                  Dùng giống email đăng nhập ở Bước 1
                  {accountEmailValue.trim()
                    ? ` (${accountEmailValue.trim()})`
                    : ""}
                </span>
              </label>
            </div>

            {/* Đường phân tách sang nhóm thông tin bổ sung (Tùy chọn) */}
            <div className="flex items-center gap-3 pt-1">
              <div className="h-px flex-1 bg-line" aria-hidden="true" />
              <span className="text-[11px] font-semibold uppercase tracking-wide text-ink-3">
                Thông tin bổ sung (Có thể cập nhật sau)
              </span>
              <div className="h-px flex-1 bg-line" aria-hidden="true" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                id="register-tax-code"
                className="font-mono"
                label="Mã số thuế"
                placeholder="VD: 1600123456 hoặc 1600123456-001"
                helperText="Gồm 10 hoặc 13 chữ số. Giúp hồ sơ được xét duyệt nhanh hơn."
                disabled={isFormPending}
                error={errors.taxCode?.message}
                rightElement={
                  <Hash className="h-4 w-4 text-ink-3" aria-hidden="true" />
                }
                {...register("taxCode")}
              />

              <Input
                id="register-company-phone"
                type="tel"
                label="Số điện thoại tổng đài"
                placeholder="VD: 0296 3841 123"
                helperText="Số điện thoại bàn hoặc hotline chính thức của doanh nghiệp."
                disabled={isFormPending}
                error={errors.companyPhone?.message}
                rightElement={
                  <Phone className="h-4 w-4 text-ink-3" aria-hidden="true" />
                }
                {...register("companyPhone")}
              />
            </div>

            <Input
              id="register-company-website"
              type="url"
              label="Website doanh nghiệp"
              placeholder="VD: https://congty.com"
              helperText="Trang web chính thức hoặc trang giới thiệu doanh nghiệp."
              disabled={isFormPending}
              error={errors.website?.message}
              rightElement={
                <Globe className="h-4 w-4 text-ink-3" aria-hidden="true" />
              }
              {...register("website")}
            />

            <Input
              id="register-company-address"
              label="Địa chỉ trụ sở / Chi nhánh"
              placeholder="VD: 18 Ung Văn Khiêm, P. Đông Xuyên, TP. Long Xuyên, An Giang"
              helperText="Địa chỉ nơi làm việc chính hoặc chi nhánh tuyển dụng sinh viên."
              disabled={isFormPending}
              error={errors.address?.message}
              rightElement={
                <MapPin className="h-4 w-4 text-ink-3" aria-hidden="true" />
              }
              {...register("address")}
            />

            <Textarea
              id="register-company-description"
              label="Giới thiệu sơ lược về doanh nghiệp"
              placeholder="Mô tả ngắn gọn về lĩnh vực hoạt động, quy mô nhân sự, nhu cầu tuyển dụng sinh viên AGU..."
              rows={3}
              disabled={isFormPending}
              error={errors.description?.message}
              helperText="Tối đa 1000 ký tự. Có thể chỉnh sửa chi tiết và tải logo sau trong mục Hồ sơ doanh nghiệp."
              {...register("description")}
            />

            <div className="pt-2 flex items-center justify-between">
              <Button
                type="button"
                variant="outline"
                size="md"
                onClick={() => setCurrentStep(1)}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                <span>Quay lại</span>
              </Button>

              <Button
                type="button"
                variant="primary"
                size="md"
                onClick={() => void handleProceedToStep3()}
                className="gap-2 font-semibold"
              >
                <span>Tiếp tục</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Button>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* BƯỚC 3: NGƯỜI ĐẠI DIỆN LIÊN HỆ & HOÀN TẤT                         */}
        {/* ================================================================= */}
        {currentStep === 3 && (
          <div className="flex flex-col gap-4 animate-fadeIn">
            <div className="border-b border-line pb-2.5">
              <h2 className="text-body font-bold text-ink flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-pill bg-brand-600 text-[11px] text-white">
                  3
                </span>
                Người đại diện liên hệ &amp; Hoàn tất
              </h2>
              <p className="text-xs text-ink-3 mt-1 leading-relaxed">
                Cung cấp thông tin người trực tiếp phụ trách tuyển dụng để Nhà
                trường liên hệ nhanh khi cần xác minh hồ sơ hoặc phối hợp các
                hoạt động tuyển dụng, ngày hội việc làm.
              </p>
            </div>

            <Input
              id="register-rep-name"
              label="Họ và tên người đại diện *"
              placeholder="VD: Nguyễn Văn An"
              helperText="Người trực tiếp phụ trách tuyển dụng và làm việc với Nhà trường."
              disabled={isFormPending}
              error={errors.representativeName?.message}
              rightElement={
                <User className="h-4 w-4 text-ink-3" aria-hidden="true" />
              }
              {...register("representativeName")}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                id="register-rep-position"
                label="Chức vụ / Bộ phận"
                placeholder="VD: Chuyên viên Nhân sự (HR)"
                helperText="Vai trò hoặc phòng ban của bạn tại doanh nghiệp."
                disabled={isFormPending}
                error={errors.representativePosition?.message}
                rightElement={
                  <Briefcase
                    className="h-4 w-4 text-ink-3"
                    aria-hidden="true"
                  />
                }
                {...register("representativePosition")}
              />

              <Input
                id="register-rep-phone"
                type="tel"
                label="Số điện thoại di động"
                placeholder="VD: 0912 345 678"
                helperText="Số điện thoại trực tiếp để cán bộ trường gọi xác minh nhanh khi cần."
                disabled={isFormPending}
                error={errors.representativePhone?.message}
                rightElement={
                  <Phone className="h-4 w-4 text-ink-3" aria-hidden="true" />
                }
                {...register("representativePhone")}
              />
            </div>

            {/* Thẻ cam kết & tóm tắt quy trình xét duyệt */}
            <div className="rounded-card border border-brand-200 bg-brand-50/70 p-4 space-y-2 text-xs text-ink-2">
              <div className="flex text-base items-center gap-2 text-brand-700 font-bold">
                <HelpCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>Quy định xác thực hồ sơ &amp; Cam kết tuyển dụng</span>
              </div>
              <p className="leading-relaxed">
                Sau khi đăng ký thành công, hồ sơ doanh nghiệp sẽ chuyển sang
                trạng thái{" "}
                <strong className="text-brand-700 font-semibold">
                  Chờ xác thực
                </strong>{" "}
                và tài khoản của bạn được ghi nhận là{" "}
                <strong className="text-ink font-semibold">
                  người đại diện liên hệ chính thức
                </strong>
                . Chức năng đăng tin tuyển dụng sẽ được mở khóa ngay sau khi
                Trung tâm Hướng nghiệp &amp; Hỗ trợ Sinh viên Trường Đại học An
                Giang kiểm tra và phê duyệt hồ sơ.
              </p>
            </div>

            <div className="pt-2 flex items-center justify-between gap-3">
              <Button
                type="button"
                variant="outline"
                size="md"
                disabled={isFormPending}
                onClick={() => setCurrentStep(2)}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                <span>Quay lại</span>
              </Button>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={isFormPending}
                disabled={isFormPending}
                className="gap-2 font-semibold shadow-md px-6 flex-1 md:flex-initial"
              >
                <span>Đăng ký</span>
                <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
              </Button>
            </div>
          </div>
        )}
      </form>

      {/* Điều hướng chân trang quay lại /login */}
      <div className="border-t border-line pt-4 flex flex-col items-center gap-2 text-center">
        <p className="text-small text-ink-2">
          Doanh nghiệp đã có tài khoản trên hệ thống?{" "}
          <Link
            to="/login"
            className="font-semibold text-brand-600 hover:text-brand-500 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus rounded-xs px-1"
          >
            Đăng nhập ngay
          </Link>
        </p>

        <p className="text-xs text-ink-3">
          Sinh viên AGU đăng nhập bằng email trường qua{" "}
          <Link
            to="/login"
            className="text-brand-600 hover:underline font-medium"
          >
            nút Google SSO tại trang Đăng nhập
          </Link>
          .
        </p>
      </div>
    </div>
  );
};

export default CompanyRegisterPage;