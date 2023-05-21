import { ApiPropertyOptional } from "@nestjs/swagger";
import { Exclude, Expose } from "class-transformer";
import { IsNumber, IsString } from "class-validator";

@Exclude()
export class UpdateSubjectDto {
  @ApiPropertyOptional()
  @Expose()
  @IsString()
  name: string;

  @ApiPropertyOptional()
  @Expose()
  @IsNumber()
  numberOfCredits: number;

  @ApiPropertyOptional()
  @Expose()
  @IsString()
  description: string;
}
