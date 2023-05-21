import { ApiPropertyOptional } from "@nestjs/swagger";
import { Exclude, Expose } from "class-transformer";
import { IsNotEmpty, IsString } from "class-validator";

@Exclude()
export class UpdateMasterConfigDto {
  @ApiPropertyOptional()
  @Expose()
  @IsString()
  @IsNotEmpty()
  key: string;

  @ApiPropertyOptional()
  @Expose()
  @IsString()
  @IsNotEmpty()
  value: string;

  @ApiPropertyOptional()
  @Expose()
  @IsString()
  @IsNotEmpty()
  type: string;

  @ApiPropertyOptional()
  @Expose()
  @IsString()
  description: string;
}
