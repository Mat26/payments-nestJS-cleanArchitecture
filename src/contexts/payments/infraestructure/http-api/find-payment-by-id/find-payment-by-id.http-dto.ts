import { IsString, IsUUID } from 'class-validator';

export class FindPaymentByIdHttpDto {
  @IsUUID()
  @IsString()
  id!: string;
}
