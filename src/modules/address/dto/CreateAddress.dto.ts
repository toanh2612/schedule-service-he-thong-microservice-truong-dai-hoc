import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Exclude, Expose } from "class-transformer";
import { IsNotEmpty, IsString } from "class-validator";

@Exclude()
export class CreateAddressDto {
	@ApiProperty()
	@Expose()
	@IsString()
	@IsNotEmpty()
	name: string;

	@ApiPropertyOptional()
	@Expose()
	@IsString()
	description: string;
}
