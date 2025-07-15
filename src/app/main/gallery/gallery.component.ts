import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-gallery',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './gallery.component.html'
})
export class GalleryComponent {
  images = [
    'https://images.unsplash.com/photo-1618773928121-c32242e63f39?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    'https://i.pinimg.com/736x/96/13/93/9613934d2babce5fbb44323964810aa8.jpg',
    'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    'https://images.unsplash.com/photo-1621293954908-907159247fc8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80',
    'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    'https://i.pinimg.com/736x/3a/b4/83/3ab483136d2f1257b72e615d49e3e37b.jpg'
  ];
  showLightbox = false;
  selectedImage = '';
  currentImageIndex = 0;

  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (this.showLightbox) {
      if (event.key === 'Escape') {
        this.closeLightbox();
      } else if (event.key === 'ArrowRight') {
        this.nextImage();
      } else if (event.key === 'ArrowLeft') {
        this.prevImage();
      }
    }
  }

  openLightbox(image: string) {
    this.selectedImage = image;
    this.currentImageIndex = this.images.indexOf(image);
    this.showLightbox = true;
    document.body.style.overflow = 'hidden';
  }

  closeLightbox(event?: Event) {
    if (event) {
      event.stopPropagation();
    }
    this.showLightbox = false;
    document.body.style.overflow = 'auto';
  }

  nextImage(event?: Event) {
    if (event) {
      event.stopPropagation();
    }
    this.currentImageIndex = (this.currentImageIndex + 1) % this.images.length;
    this.selectedImage = this.images[this.currentImageIndex];
  }

  prevImage(event?: Event) {
    if (event) {
      event.stopPropagation();
    }
    this.currentImageIndex = (this.currentImageIndex - 1 + this.images.length) % this.images.length;
    this.selectedImage = this.images[this.currentImageIndex];
  }
}