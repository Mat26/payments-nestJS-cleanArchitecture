import { Test, TestingModule } from '@nestjs/testing';
import { CreatePaymentController } from './create-payment.controller';
import { CreatePaymentHttpDto } from './create-payment.http-dto';
import { PrimitivePayment } from '../../../domain/payment';
import { CreatePaymentUseCase } from '../../../application/create-payment-use-case/create-payment-use-case';

describe('CreatePaymentController', () => {
  let createPaymentController: CreatePaymentController;
  let createPaymentUseCase: jest.Mocked<CreatePaymentUseCase>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CreatePaymentController],
      providers: [
        {
          provide: CreatePaymentUseCase,
          useValue: {
            execute: jest.fn(),
          },
        },
      ],
    }).compile();

    createPaymentController = module.get<CreatePaymentController>(
      CreatePaymentController,
    );
    createPaymentUseCase = module.get<CreatePaymentUseCase>(
      CreatePaymentUseCase,
    ) as jest.Mocked<CreatePaymentUseCase>;
  });

  it('should create a payment successfully', async () => {
    const createPaymentHttpDto: CreatePaymentHttpDto = {
      amount: 100,
      customerId: '492e82cc-39db-4053-8ff7-3ac3a035be3e',
    };

    const mockPayment: PrimitivePayment = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      amount: createPaymentHttpDto.amount,
      customerId: createPaymentHttpDto.customerId,
    };

    createPaymentUseCase.execute.mockResolvedValueOnce({
      payment: mockPayment,
    });

    const result = await createPaymentController.run(createPaymentHttpDto);

    expect(createPaymentUseCase.execute).toHaveBeenCalledWith({
      amount: createPaymentHttpDto.amount,
      customerId: createPaymentHttpDto.customerId,
    });
    expect(result).toEqual({ payment: mockPayment });
  });

  it('should handle errors thrown by the use case', async () => {
    const createPaymentHttpDto: CreatePaymentHttpDto = {
      amount: 100,
      customerId: '492e82cc-39db-4053-8ff7-3ac3a035be3e',
    };

    createPaymentUseCase.execute.mockRejectedValueOnce(
      new Error('Database error'),
    );

    await expect(
      createPaymentController.run(createPaymentHttpDto),
    ).rejects.toThrow('Database error');
    expect(createPaymentUseCase.execute).toHaveBeenCalledWith({
      amount: createPaymentHttpDto.amount,
      customerId: createPaymentHttpDto.customerId,
    });
  });
});
