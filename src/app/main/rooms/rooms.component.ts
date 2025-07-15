import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

interface Room {
  type: string;
  price: string;
  description: string;
  rating: number;
  image: string;
}

@Component({
  selector: 'app-rooms',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './rooms.component.html'
})
export class RoomsComponent {
  firstRowRooms: Room[] = [
    {
      type: 'Single Room',
      price: '5000',
      description: 'A compact room with a single bed, ideal for solo travelers. Amenities include free Wi-Fi, private bathroom, morning continental breakfast.',
      rating: 4.5,
      image: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80'
    },
    {
      type: 'Deluxe Room',
      price: '7000',
      description: 'An upgraded room with premium furnishings, higher floor, a king-size bed, and additional amenities like a minibar, coffee maker, and enhanced breakfast options.',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80'
    },
    {
      type: 'Superior Room',
      price: '7500',
      description: 'A step above the standard room with luxury decor, extra plush bedding, deluxe furnishings, and enhanced amenities for a large TV, premium toiletries, and a mini-fridge.',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80'
    }
  ];

  secondRowRooms: Room[] = [
    {
      type: 'Executive Room',
      price: '12000',
      description: 'Designed for business travelers, offering a work desk, ergonomic chair, high-speed Wi-Fi, large TV, minibar, coffee maker, ironing facilities, ensuring a productive and comfortable stay.',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1606744888344-493238951221?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80'
    },
    {
      type: 'Junior Suite',
      price: '15000',
      description: 'A spacious room with a separate seating area, luxurious bedding, premium toiletries, upgraded amenities, and extra space to create a comfortable and stylish stay from standard rooms.',
      rating: 5,
      image: 'https://i.pinimg.com/736x/68/46/d2/6846d2c4c5e22a57fcbed70470c26d9c.jpg'
    },
    {
      type: 'Presidential Suite',
      price: '20000',
      description: 'A luxurious suite with separate living and sleeping areas, high-end furnishings, a minibar, huge TV, and more private perks, making it ideal for premium stays.',
      rating: 5,
      image: 'https://i.pinimg.com/736x/a7/ad/85/a7ad8528460c11e33457f98b2a6e8ecc.jpg'
    }
  ];
}