import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Exclude, Expose } from "class-transformer";
import { IsNotEmpty, IsString } from "class-validator";

@Exclude()
export class CreateMasterConfigDto {
  @ApiProperty()
  @Expose()
  @IsString()
  @IsNotEmpty()
  key: string;

  @ApiProperty()
  @Expose()
  @IsString()
  @IsNotEmpty()
  value: string;

  @ApiProperty()
  @Expose()
  @IsString()
  @IsNotEmpty()
  type: string;

  @ApiPropertyOptional()
  @Expose()
  @IsString()
  description: string;
}
