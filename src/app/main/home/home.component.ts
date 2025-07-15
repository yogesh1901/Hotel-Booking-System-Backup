import { FooterComponent } from '../../shared/components/footer/footer.component';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { Component } from '@angular/core';
import { HeroComponent } from '../hero/hero.component';
import { AboutComponent } from '../about/about.component';
import { FeaturesComponent } from '../features/features.component';
import { OffersComponent } from '../offers/offers.component';
import { TestimonialsComponent } from '../testimonials/testimonials.component';
import { GalleryComponent } from '../gallery/gallery.component';
import { RoomsComponent } from '../rooms/rooms.component';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    NavbarComponent,
    HeroComponent,
    AboutComponent,
    FeaturesComponent,
    OffersComponent,
    TestimonialsComponent,
    GalleryComponent,
    RoomsComponent,
    FooterComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {}
