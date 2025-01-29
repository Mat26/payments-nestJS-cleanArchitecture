import { Body, Controller, Post } from '@nestjs/common';
import { CreatePaymentHttpDto } from './create-payment.http-dto';
import { PrimitivePayment } from '../../../domain/payment';
import { CreatePaymentUseCase } from '../../../application/create-payment-use-case/create-payment-use-case';

@Controller('payments')
export class CreatePaymentController {
  constructor(private createPaymentUseCase: CreatePaymentUseCase) {}

  @Post()
  async run(
    @Body() createPaymentHttpDto: CreatePaymentHttpDto,
  ): Promise<{ payment: PrimitivePayment }> {
    return await this.createPaymentUseCase.execute({
      amount: createPaymentHttpDto.amount,
      customerId: createPaymentHttpDto.customerId,
    });
  }
}
