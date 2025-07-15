import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastrModule } from 'ngx-toastr';

import { ManagebookingComponent } from './managebooking.component';

describe('ManagebookingComponent', () => {
  let component: ManagebookingComponent;
  let fixture: ComponentFixture<ManagebookingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManagebookingComponent, HttpClientTestingModule, ToastrModule.forRoot()]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManagebookingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});