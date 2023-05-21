import { ApiPropertyOptional } from "@nestjs/swagger";
import { Exclude, Expose } from "class-transformer";
import { IsBoolean, IsString } from "class-validator";

@Exclude()
export class GetAttendanceListFilterDto {
	@ApiPropertyOptional()
	@Expose()
	@IsString()
	id: string | undefined;

	@ApiPropertyOptional()
	@Expose()
	@IsString()
	studentId: string | undefined;

	@ApiPropertyOptional()
	@Expose()
	@IsString()
	classPeriodId: string | undefined;

	@ApiPropertyOptional()
	@Expose()
	@IsBoolean()
	isJoined: boolean;

	@ApiPropertyOptional()
	@Expose()
	@IsString()
	description: string;

	@ApiPropertyOptional()
	@Expose()
	@IsBoolean()
	isDeleted: boolean;
}
