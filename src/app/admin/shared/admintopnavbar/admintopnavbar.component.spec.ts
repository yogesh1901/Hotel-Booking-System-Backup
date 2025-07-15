import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmintopnavbarComponent } from './admintopnavbar.component';

describe('AdmintopnavbarComponent', () => {
  let component: AdmintopnavbarComponent;
  let fixture: ComponentFixture<AdmintopnavbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdmintopnavbarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdmintopnavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
