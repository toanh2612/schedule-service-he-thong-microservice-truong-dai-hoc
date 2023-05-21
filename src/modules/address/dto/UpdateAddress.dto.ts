import { ApiPropertyOptional } from "@nestjs/swagger";
import { Exclude, Expose } from "class-transformer";
import { IsNotEmpty, IsString } from "class-validator";

@Exclude()
export class UpdateAddressDto {
	@ApiPropertyOptional()
	@Expose()
	@IsString()
	@IsNotEmpty()
	name: string;

	@ApiPropertyOptional()
	@Expose()
	@IsString()
	description: string;
}
