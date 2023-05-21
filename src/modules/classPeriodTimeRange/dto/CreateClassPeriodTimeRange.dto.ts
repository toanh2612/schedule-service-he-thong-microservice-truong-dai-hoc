import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Exclude, Expose } from "class-transformer";
import { IsDateString, IsNotEmpty, IsNumber, IsString } from "class-validator";

@Exclude()
export class CreateClassPeriodTimeRange {
	@ApiProperty()
	@Expose()
	@IsNumber()
	@IsNotEmpty()
	numberIndex: string;

	@ApiProperty()
	@Expose()
	@IsDateString()
	startTime: string;

	@ApiProperty()
	@Expose()
	@IsDateString()
	endTime: string;

	@ApiPropertyOptional()
	@Expose()
	@IsString()
	description: string;
}
