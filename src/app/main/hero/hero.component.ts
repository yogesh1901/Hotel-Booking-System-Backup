import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../auth/services/auth.service';

interface Slide {
  image: string;
  title: string;
  description: string;
  buttonText: string;
}

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.css']
})
export class HeroComponent implements OnInit, OnDestroy {
  slides: Slide[] = [
    {
      image: 'https://i.pinimg.com/736x/4c/a1/b4/4ca1b4c9da4c5bcfefb474e522e53a99.jpg',
      title: 'Seasonal Savings Await',
      description: 'Lock in our best packages and deals of the season. Limited time offers with up to 40% off.',
      buttonText: 'Book Now'
    },
    {
      image: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1170&q=80&fm=jpg',
      title: 'Luxury Redefined',
      description: 'Experience our newly renovated suites with premium amenities and breathtaking views.',
      buttonText: 'Explore Rooms'
    },
    {
      image: 'https://i.pinimg.com/736x/be/1d/f1/be1df141831b1a063ad83d89f49f5343.jpg',
      title: 'Weekend Getaway',
      description: 'Special weekend packages with spa credits and late checkout included.',
      buttonText: 'View Packages'
    },
    {
      image: 'https://i.pinimg.com/736x/73/eb/d6/73ebd604b014ccd93f2ffcfb65c5d9ea.jpg',
      title: 'Business Travel Made Easy',
      description: 'Our executive floors feature workspaces, meeting rooms, and premium connectivity.',
      buttonText: 'Business Offers'
    }
  ];

  currentSlide = 0;
  bookingForm: FormGroup;
  minDate: string;
  maxGuests = 5;
  public Math = Math;
  private sliderInterval: any;

  private getLocalDateString(date: Date): string {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    const today = new Date();
    this.minDate = this.getLocalDateString(today);
    this.bookingForm = this.fb.group({
      checkIn: ['', Validators.required],
      checkOut: ['', Validators.required],
      adults: [1, [Validators.required, Validators.min(1)]],
      children: [0, [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit(): void {
    this.startAutoSlide();
    // Only set minDate, do not auto-set check-in/check-out unless provided
    // Optionally, you can add logic here to read from query params if needed
  }

  ngOnDestroy(): void {
    this.clearAutoSlide();
  }

  private startAutoSlide(): void {
    this.sliderInterval = setInterval(() => {
      this.nextSlide();
    }, 4000);
  }

  private clearAutoSlide(): void {
    if (this.sliderInterval) {
      clearInterval(this.sliderInterval);
    }
  }

  private getTomorrowDate(): string {
    // Deprecated: use getTomorrowLocalDate instead
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return this.getLocalDateString(tomorrow);
  }

  onSubmit(): void {
    if (this.bookingForm.invalid) {
      this.bookingForm.markAllAsTouched();
      return;
    }
    const params = this.bookingForm.value;
    // Get current user from sessionStorage or localStorage
    let user: any = null;
    const sessionUserStr = sessionStorage.getItem('currentUser');
    if (sessionUserStr) {
      user = JSON.parse(sessionUserStr);
    } else {
      const rememberUserStr = localStorage.getItem('rememberUser');
      if (rememberUserStr) {
        const rememberUser = JSON.parse(rememberUserStr);
        if (Array.isArray(rememberUser)) {
          user = rememberUser[0];
        } else {
          user = rememberUser;
        }
      }
    }
    // Ensure check-in/check-out are not in the past before submit
    const today = new Date();
    const minDate = this.getLocalDateString(today);
    let checkIn = this.bookingForm.get('checkIn')?.value;
    let checkOut = this.bookingForm.get('checkOut')?.value;
    if (checkIn < minDate) {
      this.bookingForm.get('checkIn')?.setValue(minDate);
      checkIn = minDate;
    }
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    const minCheckOut = this.getLocalDateString(tomorrow);
    if (checkOut <= checkIn) {
      this.bookingForm.get('checkOut')?.setValue(minCheckOut);
      checkOut = minCheckOut;
    } else if (checkOut < minCheckOut) {
      this.bookingForm.get('checkOut')?.setValue(minCheckOut);
      checkOut = minCheckOut;
    }
    // Pass adults and children as query params
    this.router.navigate(['/room-booking'], {
      queryParams: {
        checkIn: this.bookingForm.get('checkIn')?.value,
        checkOut: this.bookingForm.get('checkOut')?.value,
        adults: this.bookingForm.get('adults')?.value,
        children: this.bookingForm.get('children')?.value,
        guestName: user?.name,
        guestEmail: user?.email,
        guestPhone: user?.phone
      }
    });
  }

  nextSlide(): void {
    this.currentSlide = (this.currentSlide + 1) % this.slides.length;
  }

  prevSlide(): void {
    this.currentSlide = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
  }

  goToSlide(index: number): void {
    this.currentSlide = index;
    this.clearAutoSlide();
    this.startAutoSlide();
  }
}
