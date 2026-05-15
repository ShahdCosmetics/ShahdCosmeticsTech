import { Decimal } from '@prisma/client/runtime/library';

export type PaymentResult = {
  success: boolean;
  reference: string;
};

export interface IPaymentService {
  processPayment(
    amount: Decimal,
    currency: string,
    metadata: object,
  ): Promise<PaymentResult>;
}

// Injection token — OrdersService uses this, never the concrete class
export const PAYMENT_SERVICE = 'PAYMENT_SERVICE';