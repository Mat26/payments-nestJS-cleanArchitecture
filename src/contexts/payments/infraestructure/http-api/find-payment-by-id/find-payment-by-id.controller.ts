import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { PrimitivePayment } from '../../../domain/payment';
import { FindPaymentByIdUseCase } from '../../../application/find-payment-by-id-use-case/find-payment-by-id.use-case';
import { FindPaymentByIdHttpDto } from './find-payment-by-id.http-dto';
import { PaymentNotFoundException } from '../../../domain/payment.not.found.exception';

@Controller('payments')
export class FindPaymentByIdController {
  constructor(private findPaymentByIdUseCase: FindPaymentByIdUseCase) {}

  @Get(':id')
  async run(
    @Param() params: FindPaymentByIdHttpDto,
  ): Promise<{ payment: PrimitivePayment }> {
    try {
      return await this.findPaymentByIdUseCase.execute({
        id: params.id,
      });
    } catch (error) {
      if (error instanceof PaymentNotFoundException)
        throw new NotFoundException(error.message);
      throw error;
    }
  }
}
