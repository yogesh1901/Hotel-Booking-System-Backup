import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AdminNavbarComponent } from '../shared/admin-navbar/admin-navbar.component';
import { AdmintopnavbarComponent } from '../shared/admintopnavbar/admintopnavbar.component';

@Component({
  selector: 'app-admin-layout',
  imports: [RouterOutlet,AdminNavbarComponent,AdmintopnavbarComponent],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.css'
})
export class AdminLayoutComponent {

}
