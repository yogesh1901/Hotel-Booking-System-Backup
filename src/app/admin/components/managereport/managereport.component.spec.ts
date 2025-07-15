import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagereportComponent } from './managereport.component';

describe('ManagereportComponent', () => {
  let component: ManagereportComponent;
  let fixture: ComponentFixture<ManagereportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManagereportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManagereportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
