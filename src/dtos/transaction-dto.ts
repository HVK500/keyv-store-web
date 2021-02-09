import { IsNotEmptyObject, IsOptional, IsString } from 'class-validator';

export class TransactionDto {
  @IsOptional()
  @IsString()
  namespace?: string;

  @IsOptional()
  @IsString()
  key?: string;

  @IsOptional()
  @IsNotEmptyObject()
  value?: JSON;
}
