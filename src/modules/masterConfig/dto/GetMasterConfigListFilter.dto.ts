import { ApiPropertyOptional } from "@nestjs/swagger";
import { Exclude, Expose } from "class-transformer";
import { IsBoolean, IsString } from "class-validator";

@Exclude()
export class GetMasterConfigListFilterDto {
  @ApiPropertyOptional()
  @Expose()
  @IsString()
  id: string | undefined;

  @ApiPropertyOptional()
  @Expose()
  @IsString()
  key: string | undefined;

  @ApiPropertyOptional()
  @Expose()
  @IsString()
  value: string | undefined;

  @ApiPropertyOptional()
  @Expose()
  @IsString()
  description: string | undefined;

  @ApiPropertyOptional()
  @Expose()
  @IsBoolean()
  isDeleted: boolean | undefined;
}
