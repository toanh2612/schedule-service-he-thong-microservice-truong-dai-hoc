import { ApiPropertyOptional } from "@nestjs/swagger";
import { Exclude, Expose } from "class-transformer";
import { IsBoolean, IsString } from "class-validator";

@Exclude()
export class GetAddressListFilterDto {
	@ApiPropertyOptional()
	@Expose()
	@IsString()
	id: string | undefined;

	@ApiPropertyOptional()
	@Expose()
	@IsString()
	name: string | undefined;

	@ApiPropertyOptional()
	@Expose()
	@IsString()
	description: string | undefined;

	@ApiPropertyOptional()
	@Expose()
	@IsBoolean()
	isDeleted: boolean | undefined;
}
