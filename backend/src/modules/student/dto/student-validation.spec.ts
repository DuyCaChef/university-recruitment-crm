import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { CreateSkillDto } from './skill.dto';
import { UploadStudentCvDto } from './student-cv.dto';

describe('student DTO validation', () => {
  it('rejects whitespace-only skill names', async () => {
    const dto = plainToInstance(CreateSkillDto, { skillName: '   ' });

    await expect(validate(dto)).resolves.toEqual(
      expect.arrayContaining([
        expect.objectContaining({ property: 'skillName' }),
      ]),
    );
  });

  it('rejects non-boolean isDefault strings instead of coercing them to false', async () => {
    const dto = plainToInstance(UploadStudentCvDto, {
      title: 'CV',
      isDefault: 'yes',
    });

    await expect(validate(dto)).resolves.toEqual(
      expect.arrayContaining([
        expect.objectContaining({ property: 'isDefault' }),
      ]),
    );
  });

  it('accepts only the explicit boolean strings for isDefault', async () => {
    const trueDto = plainToInstance(UploadStudentCvDto, {
      title: 'CV',
      isDefault: 'true',
    });
    const falseDto = plainToInstance(UploadStudentCvDto, {
      title: 'CV',
      isDefault: 'false',
    });

    await expect(validate(trueDto)).resolves.toHaveLength(0);
    await expect(validate(falseDto)).resolves.toHaveLength(0);
  });
});
