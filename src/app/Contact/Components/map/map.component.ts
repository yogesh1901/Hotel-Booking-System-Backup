import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './map.component.html',
  styles: [`
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital@1&family=Cormorant+Garamond:ital,wght@1,600&family=Lora&display=swap');
    
    .font-playfair {
      font-family: 'Playfair Display', serif;
    }
    .font-cormorant {
      font-family: 'Cormorant Garamond', serif;
      font-weight: 600;
      font-style: italic;
    }
    .font-lora {
      font-family: 'Lora', serif;
    }
  `]
})
export class MapComponent {
}