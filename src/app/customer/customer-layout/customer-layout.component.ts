import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CustomerSidebarComponent } from '../shared/customer-sidebar/customer-sidebar.component';
import { CommonModule } from '@angular/common';
import { CustomerNavbarComponent } from '../shared/customer-navbar/customer-navbar.component';


@Component({
  selector: 'app-customer-layout',
  imports: [RouterModule,CustomerSidebarComponent,CommonModule,CustomerNavbarComponent],
  templateUrl: './customer-layout.component.html',
  styleUrl: './customer-layout.component.css'
})
export class CustomerLayoutComponent {

}
