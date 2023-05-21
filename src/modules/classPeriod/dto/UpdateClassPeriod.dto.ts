import { ApiPropertyOptional } from "@nestjs/swagger";
import { Exclude, Expose } from "class-transformer";
import { IsDateString, IsString } from "class-validator";

@Exclude()
export class UpdateClassPeriodDto {
	@ApiPropertyOptional()
	@Expose()
	@IsString()
	subjectId: string | null;

	@ApiPropertyOptional()
	@Expose()
	@IsString()
	addressId: string;

	@ApiPropertyOptional()
	@Expose()
	@IsString()
	classroomId: string;

	@ApiPropertyOptional()
	@Expose()
	@IsString()
	classPeriodTimeRangeId: string;

	@ApiPropertyOptional()
	@Expose()
	@IsDateString()
	dateTime: string;

	@ApiPropertyOptional()
	@Expose()
	@IsString()
	description: string;
}
