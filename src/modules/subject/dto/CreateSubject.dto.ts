import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Exclude, Expose } from "class-transformer";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

@Exclude()
export class CreateSubjectDto {
  @ApiProperty()
  @Expose()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @Expose()
  @IsNumber()
  @IsNotEmpty()
  numberOfCredits: number;

  @ApiPropertyOptional()
  @Expose()
  @IsString()
  description: string;
}
