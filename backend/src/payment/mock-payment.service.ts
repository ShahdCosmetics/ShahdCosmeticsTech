import { Injectable } from '@nestjs/common';
import { Decimal } from '@prisma/client/runtime/library';
import { IPaymentService, PaymentResult } from './payment.interface';

@Injectable()
export class MockPaymentService implements IPaymentService {
  async processPayment(
    amount: Decimal,
    currency: string,
    metadata: object,
  ): Promise<PaymentResult> {
    // Mock always succeeds — no external calls, no credentials
    return {
      success: true,
      reference: 'MOCK-' + Math.random().toString(36).substring(2, 10).toUpperCase(),
    };
  }
}