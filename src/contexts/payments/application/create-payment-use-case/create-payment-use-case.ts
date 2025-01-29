import { CreatePaymentDto } from './create-payment.dto';
import { Payment, PrimitivePayment } from '../../domain/payment';
import { PaymentRepository } from '../../domain/payment.repository';
import { Injectable } from '../../shared/dependency-injection/injectable';

@Injectable()
export class CreatePaymentUseCase {
  constructor(private readonly paymentRepository: PaymentRepository) {}

  async execute(dto: CreatePaymentDto): Promise<{ payment: PrimitivePayment }> {
    const payment = Payment.create(dto);
    await this.paymentRepository.create(payment);
    return { payment: payment.toValue() };
  }
}
