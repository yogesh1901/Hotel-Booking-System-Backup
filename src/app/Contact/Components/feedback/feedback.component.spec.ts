import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { FeedbackComponent } from './feedback.component';

describe('FeedbackComponent', () => {
  let component: FeedbackComponent;
  let fixture: ComponentFixture<FeedbackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeedbackComponent, ReactiveFormsModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FeedbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty values', () => {
    expect(component.feedbackForm.value).toEqual({
      name: '',
      email: '',
      rating: 0,
      feedback: ''
    });
  });

  it('should validate name field as required', () => {
    const nameControl = component.feedbackForm.get('name');
    nameControl?.setValue('');
    expect(nameControl?.valid).toBeFalsy();
    expect(nameControl?.errors?.['required']).toBeTruthy();
  });

  it('should validate email field format', () => {
    const emailControl = component.feedbackForm.get('email');
    emailControl?.setValue('invalid-email');
    expect(emailControl?.valid).toBeFalsy();
    expect(emailControl?.errors?.['email']).toBeTruthy();
  });

  it('should set rating when setRating is called', () => {
    component.setRating(3);
    expect(component.selectedRating).toBe(3);
    expect(component.feedbackForm.get('rating')?.value).toBe(3);
  });

  it('should show success message on valid form submission', () => {
    component.feedbackForm.setValue({
      name: 'Test User',
      email: 'test@example.com',
      rating: 4,
      feedback: 'This is a test feedback message'
    });
    component.onSubmit();
    expect(component.isSubmitted).toBeTrue();
  });
});