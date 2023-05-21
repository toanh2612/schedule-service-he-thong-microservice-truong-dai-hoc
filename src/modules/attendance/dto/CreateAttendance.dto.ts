import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Exclude, Expose } from "class-transformer";
import { IsBoolean, IsNotEmpty, IsString } from "class-validator";

@Exclude()
export class CreateAttendanceDto {
	@ApiProperty()
	@Expose()
	@IsString()
	@IsNotEmpty()
	studentId: string;

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
