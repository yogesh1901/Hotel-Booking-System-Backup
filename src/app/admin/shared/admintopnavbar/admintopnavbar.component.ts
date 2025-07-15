import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-admintopnavbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admintopnavbar.component.html',
  styleUrls: ['./admintopnavbar.component.css']
})
export class AdmintopnavbarComponent {
  isDarkMode = false;

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    if (this.isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('darkMode', 'enabled');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('darkMode', 'disabled');
    }
  }

  ngOnInit() {
    const darkMode = localStorage.getItem('darkMode');
    if (darkMode === 'enabled') {
      this.isDarkMode = true;
      document.documentElement.classList.add('dark');
    }
  }
}