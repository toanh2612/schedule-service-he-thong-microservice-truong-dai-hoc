import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Exclude, Expose } from "class-transformer";
import { IsBoolean, IsNotEmpty, IsString } from "class-validator";

@Exclude()
export class UpdateAttendanceDto {
	@ApiPropertyOptional()
	@Expose()
	@IsString()
	description: string;

	@ApiProperty()
	@Expose()
	@IsBoolean()
	@IsNotEmpty()
	isJoined: boolean;
}
