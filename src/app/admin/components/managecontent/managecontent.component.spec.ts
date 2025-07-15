import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagecontentComponent } from './managecontent.component';

describe('ManagecontentComponent', () => {
  let component: ManagecontentComponent;
  let fixture: ComponentFixture<ManagecontentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManagecontentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManagecontentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
