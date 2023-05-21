import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Exclude, Expose } from "class-transformer";
import { IsDateString, IsString } from "class-validator";

@Exclude()
export class CreateClassPeriodDto {
	@ApiProperty()
	@Expose()
	@IsString()
	subjectId: string | null;

	@ApiProperty()
	@Expose()
	@IsString()
	addressId: string;

	@ApiProperty()
	@Expose()
	@IsString()
	classroomId: string;

	@ApiProperty()
	@Expose()
	@IsString()
	classPeriodTimeRangeId: string;

	@ApiProperty()
	@Expose()
	@IsDateString()
	dateTime: string;

	@ApiPropertyOptional()
	@Expose()
	@IsString()
	description: string;
}
