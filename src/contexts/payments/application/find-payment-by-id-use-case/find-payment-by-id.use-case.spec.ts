import { Test, TestingModule } from '@nestjs/testing';
import { FindPaymentByIdUseCase } from './find-payment-by-id.use-case';
import { PaymentRepository } from '../../domain/payment.repository';
import { FindPaymentByIdDto } from './find-payment-by-id.dto';
import { Payment } from '../../domain/payment';
import { PaymentNotFoundException } from '../../domain/payment.not.found.exception';

describe('FindPaymentByIdUseCase', () => {
  let findPaymentByIdUseCase: FindPaymentByIdUseCase;
  let paymentRepository: jest.Mocked<PaymentRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindPaymentByIdUseCase,
        {
          provide: PaymentRepository,
          useValue: {
            getById: jest.fn(),
          },
        },
      ],
    }).compile();

    findPaymentByIdUseCase = module.get<FindPaymentByIdUseCase>(
      FindPaymentByIdUseCase,
    );
    paymentRepository = module.get<PaymentRepository>(
      PaymentRepository,
    ) as jest.Mocked<PaymentRepository>;
  });

  it('should return payment successfully if found', async () => {
    const findPaymentByIdDto: FindPaymentByIdDto = {
      id: '492e82cc-39db-4053-8ff7-3ac3a035be3e',
    };
    const mockPayment = new Payment({
      id: findPaymentByIdDto.id,
      amount: 100,
      customerId: 'Customer1',
    });
    jest.spyOn(mockPayment, 'toValue').mockReturnValue({
      id: findPaymentByIdDto.id,
      amount: 100,
      customerId: 'Customer1',
    });
    paymentRepository.getById.mockResolvedValueOnce(mockPayment);

    const result = await findPaymentByIdUseCase.execute(findPaymentByIdDto);

    expect(paymentRepository.getById).toHaveBeenCalledWith(
      findPaymentByIdDto.id,
    );
    expect(result).toEqual({
      payment: mockPayment.toValue(),
    });
  });

  it('should throw PaymentNotFoundException if payment not found', async () => {
    const findPaymentByIdDto: FindPaymentByIdDto = {
      id: 'non-existing-id',
    };
    paymentRepository.getById.mockResolvedValueOnce(null);

    await expect(
      findPaymentByIdUseCase.execute(findPaymentByIdDto),
    ).rejects.toThrow(PaymentNotFoundException);

    expect(paymentRepository.getById).toHaveBeenCalledWith(
      findPaymentByIdDto.id,
    );
  });
});
