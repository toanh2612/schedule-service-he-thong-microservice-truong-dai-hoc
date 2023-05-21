import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Exclude, Expose } from "class-transformer";
import { IsBoolean, IsNotEmpty, IsString } from "class-validator";

@Exclude()
export class CreateClassroomDto {
	@ApiProperty()
	@Expose()
	@IsString()
	@IsNotEmpty()
	subjectId: string;

	@ApiProperty()
	@Expose()
	@IsString()
	@IsNotEmpty()
	name: string | null;

	@ApiPropertyOptional()
	@Expose()
	@IsString()
	description: string;

	@ApiPropertyOptional()
	@Expose()
	@IsBoolean()
	isDeleted: boolean;
}
