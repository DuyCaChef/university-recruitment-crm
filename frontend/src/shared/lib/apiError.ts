// Chức năng: Hàm này được sử dụng để trích xuất thông báo lỗi từ các lỗi API, đặc biệt là các lỗi phát sinh từ Axios.
//  Nó kiểm tra xem lỗi có phải là một lỗi Axios hay không, và nếu có, nó sẽ cố gắng lấy thông báo lỗi từ phản hồi của API.
// Nếu không tìm thấy thông báo cụ thể, nó sẽ trả về một thông báo lỗi mặc định hoặc thông báo lỗi từ đối tượng Error nếu có.
import { isAxiosError } from "axios";

export function extractApiErrorMessage(
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
