import { ApiPropertyOptional } from "@nestjs/swagger";
import { Exclude, Expose } from "class-transformer";
import { IsBoolean, IsDateString, IsString } from "class-validator";

@Exclude()
export class GetClassPeriodListFilterDto {
	@ApiPropertyOptional()
	@Expose()
	@IsString()
	id: string | null;

	@ApiPropertyOptional()
	@Expose()
	@IsString()
	classPeriodTimeRangeId: string | null;

	@ApiPropertyOptional()
	@Expose()
	@IsString()
	addressId: string;

	@ApiPropertyOptional()
	@Expose()
	@IsDateString()
	dateTime: string;

	@ApiPropertyOptional()
	@Expose()
	@IsString()
	description: string;

	@ApiPropertyOptional()
	@Expose()
	@IsBoolean()
	isDeleted: boolean;
}
