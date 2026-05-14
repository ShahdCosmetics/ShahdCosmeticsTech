import { Module } from '@nestjs/common';
import { MockPaymentService } from './mock-payment.service';
import { PAYMENT_SERVICE } from './payment.interface';

@Module({
  providers: [
    {
      // Swap this provider to switch from mock to real Stripe — zero other changes needed
      provide: PAYMENT_SERVICE,
      useClass: MockPaymentService,
    },
  ],
  exports: [PAYMENT_SERVICE],
})
export class PaymentModule {}