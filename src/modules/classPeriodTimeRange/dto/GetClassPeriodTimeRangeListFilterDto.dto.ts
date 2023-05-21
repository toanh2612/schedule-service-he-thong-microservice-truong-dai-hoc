import { ApiPropertyOptional } from "@nestjs/swagger";
import { Exclude, Expose } from "class-transformer";
import { IsBoolean, IsNumber, IsString } from "class-validator";

@Exclude()
export class GetClassPeriodTimeRangeListFilterDto {
	@ApiPropertyOptional()
	@Expose()
	@IsString()
	id: string | null;

	@ApiPropertyOptional()
	@Expose()
	@IsNumber()
	numberIndex: number | null;

	@ApiPropertyOptional()
	@Expose()
	@IsString()
	startTime: string | null;

	@ApiPropertyOptional()
	@Expose()
	@IsString()
	endTime: string | null;

	@ApiPropertyOptional()
	@Expose()
	@IsString()
	description: string;

	@ApiPropertyOptional()
	@Expose()
	@IsBoolean()
	isDeleted: boolean;
}
