import { Test, TestingModule } from '@nestjs/testing';
import { CreatePaymentUseCase } from './create-payment-use-case';
import { PaymentRepository } from '../../domain/payment.repository';
import { CreatePaymentDto } from './create-payment.dto';
import { Payment } from '../../domain/payment';

describe('CreatePaymentUseCase', () => {
  let createPaymentUseCase: CreatePaymentUseCase;
  let paymentRepository: jest.Mocked<PaymentRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreatePaymentUseCase,
        {
          provide: PaymentRepository,
          useValue: {
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    createPaymentUseCase =
      module.get<CreatePaymentUseCase>(CreatePaymentUseCase);
    paymentRepository = module.get<PaymentRepository>(
      PaymentRepository,
    ) as jest.Mocked<PaymentRepository>;
  });

  it('should create a payment successfully', async () => {
    const dto: CreatePaymentDto = {
      amount: 100,
      customerId: '492e82cc-39db-4053-8ff7-3ac3a035be3e',
    };
    const mockPayment = Payment.create(dto);
    jest.spyOn(Payment, 'create').mockReturnValue(mockPayment);
    paymentRepository.create.mockResolvedValueOnce(undefined);

    const result = await createPaymentUseCase.execute(dto);

    expect(Payment.create).toHaveBeenCalledWith(dto);
    expect(paymentRepository.create).toHaveBeenCalledWith(mockPayment);
    expect(result).toEqual({ payment: mockPayment.toValue() });
  });
});
