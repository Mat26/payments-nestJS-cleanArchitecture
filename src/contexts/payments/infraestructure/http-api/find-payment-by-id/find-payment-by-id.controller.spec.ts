import { Test, TestingModule } from '@nestjs/testing';
import { FindPaymentByIdController } from './find-payment-by-id.controller';
import { NotFoundException } from '@nestjs/common';
import { PrimitivePayment } from '../../../domain/payment';
import { FindPaymentByIdUseCase } from '../../../application/find-payment-by-id-use-case/find-payment-by-id.use-case';
import { PaymentNotFoundException } from '../../../domain/payment.not.found.exception';

describe('FindPaymentByIdController', () => {
  let controller: FindPaymentByIdController;
  let findPaymentByIdUseCase: jest.Mocked<FindPaymentByIdUseCase>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FindPaymentByIdController],
      providers: [
        {
          provide: FindPaymentByIdUseCase,
          useValue: {
            execute: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<FindPaymentByIdController>(
      FindPaymentByIdController,
    );
    findPaymentByIdUseCase = module.get<FindPaymentByIdUseCase>(
      FindPaymentByIdUseCase,
    ) as jest.Mocked<FindPaymentByIdUseCase>;
  });

  it('should return a payment when found', async () => {
    const id = '492e82cc-39db-4053-8ff7-3ac3a035be3e';
    const mockPayment: PrimitivePayment = {
      id,
      amount: 100,
      customerId: 'customer-123',
    };

    findPaymentByIdUseCase.execute.mockResolvedValueOnce({
      payment: mockPayment,
    });

    const result = await controller.run({ id });

    expect(findPaymentByIdUseCase.execute).toHaveBeenCalledWith({ id });
    expect(result).toEqual({ payment: mockPayment });
  });

  it('should throw NotFoundException when payment is not found', async () => {
    const id = 'non-existent-id';
    findPaymentByIdUseCase.execute.mockRejectedValueOnce(
      new PaymentNotFoundException(id),
    );

    await expect(controller.run({ id })).rejects.toThrow(NotFoundException);
    expect(findPaymentByIdUseCase.execute).toHaveBeenCalledWith({ id });
  });
});
