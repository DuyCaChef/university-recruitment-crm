/**
 * Định dạng số điện thoại Việt Nam hợp lệ:
 * - Di động (10 số): bắt đầu bằng 03, 05, 07, 08, 09 + 8 chữ số
 * - Cố định (11 số): bắt đầu bằng 02 + 9 chữ số (VD: 0296xxxxxxx, 028xxxxxxxx)
 */
export const VN_PHONE_REGEX = /^(?:(?:03|05|07|08|09)\d{8}|02\d{9})$/;

export const VN_PHONE_MESSAGE =
  'Số điện thoại không hợp lệ (chấp nhận số di động 10 số đầu 03/05/07/08/09 hoặc số cố định 11 số đầu 02)';
