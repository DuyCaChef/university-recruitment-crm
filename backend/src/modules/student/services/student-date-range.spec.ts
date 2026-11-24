import { BadRequestException } from '@nestjs/common';
import { StudentService } from './student.service';

describe('StudentService.validateDateRange', () => {
  let service: StudentService;

  beforeEach(() => {
    // We only need an instance to test the private validateDateRange method
    service = new (StudentService as any)(null, null, null);
  });

  const callValidate = (startDate?: Date | null, endDate?: Date | null) => {
    return (service as any).validateDateRange(startDate, endDate);
  };

  it('rejects startDate in the future', () => {
    const futureDate = new Date();
    futureDate.setFullYear(futureDate.getFullYear() + 1);

    expect(() => callValidate(futureDate, null)).toThrow(
      new BadRequestException('Ngày bắt đầu không được lớn hơn ngày hiện tại.'),
    );
  });

  it('rejects endDate in the future', () => {
    const pastStart = new Date('2020-01-01');
    const futureDate = new Date();
    futureDate.setFullYear(futureDate.getFullYear() + 1);

    expect(() => callValidate(pastStart, futureDate)).toThrow(
      new BadRequestException(
        'Ngày kết thúc không được lớn hơn ngày hiện tại. Nếu chưa kết thúc, vui lòng để trống.',
      ),
    );
  });

  it('rejects endDate earlier than startDate', () => {
    const startDate = new Date('2023-05-01');
    const endDate = new Date('2023-01-01');

    expect(() => callValidate(startDate, endDate)).toThrow(
      new BadRequestException('Ngày kết thúc không thể nhỏ hơn ngày bắt đầu.'),
    );
  });

  it('accepts valid date range in the past', () => {
    const startDate = new Date('2022-01-01');
    const endDate = new Date('2022-12-31');

    expect(() => callValidate(startDate, endDate)).not.toThrow();
  });

  it('accepts startDate of today in Vietnam timezone', () => {
    const todayVnStr = (service as any).getTodayVietnamDateString();
    const todayDate = new Date(todayVnStr);

    expect(() => callValidate(todayDate, null)).not.toThrow();
  });
});
