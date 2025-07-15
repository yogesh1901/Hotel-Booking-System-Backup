import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerPaymentHistoryComponent } from './customer-payment-history.component';

describe('CustomerPaymentHistoryComponent', () => {
  let component: CustomerPaymentHistoryComponent;
  let fixture: ComponentFixture<CustomerPaymentHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerPaymentHistoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerPaymentHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
