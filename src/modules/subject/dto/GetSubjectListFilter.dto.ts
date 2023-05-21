import { ApiPropertyOptional } from "@nestjs/swagger";
import { Exclude, Expose } from "class-transformer";
import { IsBoolean, IsNumber, IsString } from "class-validator";

@Exclude()
export class GetSubjectListFilterDto {
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
  @IsNumber()
  numberOfCredits: number | null;

  @ApiPropertyOptional()
  @Expose()
  @IsString()
  description: string;

  @ApiPropertyOptional()
  @Expose()
  @IsBoolean()
  isDeleted: boolean;
}
