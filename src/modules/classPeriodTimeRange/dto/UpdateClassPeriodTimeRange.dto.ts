import { ApiPropertyOptional } from "@nestjs/swagger";
import { Exclude, Expose } from "class-transformer";
import { IsDateString, IsNumber, IsString } from "class-validator";

@Exclude()
export class UpdateClassPeriodTimeRange {
	@ApiPropertyOptional()
	@Expose()
	@IsNumber()
	numberIndex: string;

	@ApiPropertyOptional()
	@Expose()
	@IsDateString()
	startTime: string;

	@ApiPropertyOptional()
	@Expose()
	@IsDateString()
	endTime: string;

	@ApiPropertyOptional()
	@Expose()
	@IsString()
	description: string;
}
