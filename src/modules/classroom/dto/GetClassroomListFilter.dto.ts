import { ApiPropertyOptional } from "@nestjs/swagger";
import { Exclude, Expose } from "class-transformer";
import { IsBoolean, IsString } from "class-validator";

@Exclude()
export class GetClassroomListFilterDto {
	@ApiPropertyOptional()
	@Expose()
	@IsString()
	id: string | null;

	@ApiPropertyOptional()
	@Expose()
	@IsString()
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
