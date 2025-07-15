// managecontent.component.ts
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { 
  faHome, faInfoCircle, faBed, faTag, faImages, faAddressBook, 
  faEye, faSave, faTimes, faTrash, faEdit, faPlus,
  faPhoneAlt, faEnvelope, faGlobe
} from '@fortawesome/free-solid-svg-icons';
import { faFacebookF, faInstagram } from '@fortawesome/free-brands-svg-icons';

interface Room {
  name: string;
  price: string;
  guests: string;
  description: string;
  images: string[];
  amenities: Record<string, boolean>;
}

interface Offer {
  title: string;
  discount: string;
  dateFrom: string;
  dateTo: string;
  description: string;
  image: File | null;
  imagePreview: string;
}

interface Feature {
  title: string;
}

interface SocialMedia {
  facebook: string;
  instagram: string;
}

@Component({
  selector: 'app-managecontent',
  standalone: true,
  imports: [FormsModule, CommonModule, FontAwesomeModule],
  templateUrl: './managecontent.component.html',
  styleUrls: ['./managecontent.component.css']
})
export class ManagecontentComponent {
  activeSection = 'homepage';
  toasts: {message: string}[] = [];

  // Font Awesome icons
  faHome = faHome;
  faInfoCircle = faInfoCircle;
  faBed = faBed;
  faTag = faTag;
  faImages = faImages;
  faAddressBook = faAddressBook;
  faEye = faEye;
  faSave = faSave;
  faTimes = faTimes;
  faTrash = faTrash;
  faEdit = faEdit;
  faPlus = faPlus;
  faPhoneAlt = faPhoneAlt;
  faEnvelope = faEnvelope;
  faGlobe = faGlobe;
  faFacebookF = faFacebookF;
  faInstagram = faInstagram;

  // Room amenities options
  roomAmenities = [
    { id: 'wifi', label: 'Free WiFi' },
    { id: 'ac', label: 'Air Conditioning' },
    { id: 'minibar', label: 'Mini Bar' },
    { id: 'tv', label: 'TV' },
    { id: 'breakfast', label: 'Breakfast' },
    { id: 'pool', label: 'Pool Access' }
  ];

  // Content models
  homepageContent = {
    heroHeading: 'Experience Luxury Redefined',
    heroSubheading: 'Your perfect getaway awaits',
    heroImage: null as File | null,
    heroImagePreview: ''
  };

  aboutContent = {
    title: 'Our Story',
    subtitle: 'A legacy of hospitality',
    image: null as File | null,
    imagePreview: '',
    text: 'Founded in 1995, our hotel has been providing exceptional hospitality services for over 25 years...',
    features: [
      { title: 'Award-Winning Service' }
    ] as Feature[]
  };

  roomsContent = {
    title: 'Our Rooms & Suites',
    intro: 'Experience the perfect blend of comfort and luxury in our thoughtfully designed rooms and suites...',
    rooms: [
      {
        name: 'Deluxe Room',
        price: '$199/night',
        guests: '2 Adults',
        description: 'Our Deluxe Rooms offer a comfortable retreat with modern amenities...',
        images: ['https://via.placeholder.com/300x200'],
        amenities: { wifi: true, ac: true, tv: true } as Record<string, boolean>
      }
    ] as Room[]
  };

  offersContent = {
    title: 'Special Offers',
    offers: [
      {
        title: 'Summer Getaway Package',
        discount: '20% Off',
        dateFrom: '2023-06-01',
        dateTo: '2023-08-31',
        description: 'Enjoy a summer escape with our special package...',
        image: null as File | null,
        imagePreview: 'https://via.placeholder.com/600x400'
      }
    ] as Offer[]
  };

  galleryContent = {
    title: 'Our Gallery',
    subtitle: 'Explore our hotel through images',
    images: [
      'https://via.placeholder.com/300x200',
      'https://via.placeholder.com/300x200'
    ]
  };

  contactContent = {
    title: 'Contact Us',
    subtitle: "We'd love to hear from you",
    address: '123 Luxury Avenue\nHotel District\nCity, Country 12345',
    phone: '+1 (555) 123-4567',
    email: 'info@luxuryhotel.com',
    website: 'www.luxuryhotel.com',
    social: {
      facebook: '',
      instagram: ''
    } as SocialMedia
  };

  constructor() {}

  showSection(section: string) {
    this.activeSection = section;
    // Update active nav link
    const navLinks = document.querySelectorAll('.content-nav-link');
    navLinks.forEach(link => {
      link.classList.remove('active');
    });
    const activeLink = document.querySelector(`[onclick*="${section}"]`);
    if (activeLink) {
      activeLink.classList.add('active');
    }
  }

  saveContent(section: string) {
    const content = (this as any)[`${section}Content`];
    console.log(`Saving ${section} content:`, content);
    this.showToast(`${section} content saved successfully!`);
  }

  // Image handling methods
  handleHeroImageUpload(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.homepageContent.heroImage = input.files[0];
      this.homepageContent.heroImagePreview = URL.createObjectURL(input.files[0]);
    }
  }

  removeHeroImage() {
    this.homepageContent.heroImage = null;
    this.homepageContent.heroImagePreview = '';
  }

  handleAboutImageUpload(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.aboutContent.image = input.files[0];
      this.aboutContent.imagePreview = URL.createObjectURL(input.files[0]);
    }
  }

  removeAboutImage() {
    this.aboutContent.image = null;
    this.aboutContent.imagePreview = '';
  }

  // Feature methods
  addFeature() {
    this.aboutContent.features.push({ title: '' });
  }

  removeFeature(index: number) {
    this.aboutContent.features.splice(index, 1);
  }

  // Room methods
  addRoom() {
    this.roomsContent.rooms.push({
      name: '',
      price: '',
      guests: '',
      description: '',
      images: [],
      amenities: { wifi: false, ac: false, tv: false }
    });
  }

  removeRoom(index: number) {
    this.roomsContent.rooms.splice(index, 1);
  }

  handleRoomImageUpload(event: Event, roomIndex: number, imageIndex: number) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const imageUrl = URL.createObjectURL(input.files[0]);
      if (imageIndex < this.roomsContent.rooms[roomIndex].images.length) {
        this.roomsContent.rooms[roomIndex].images[imageIndex] = imageUrl;
      } else {
        this.roomsContent.rooms[roomIndex].images.push(imageUrl);
      }
    }
  }

  removeRoomImage(roomIndex: number, imageIndex: number) {
    this.roomsContent.rooms[roomIndex].images.splice(imageIndex, 1);
  }

  // Offer methods
  addOffer() {
    this.offersContent.offers.push({
      title: '',
      discount: '',
      dateFrom: '',
      dateTo: '',
      description: '',
      image: null,
      imagePreview: ''
    });
  }

  removeOffer(index: number) {
    this.offersContent.offers.splice(index, 1);
  }

  handleOfferImageUpload(event: Event, offerIndex: number) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.offersContent.offers[offerIndex].image = input.files[0];
      this.offersContent.offers[offerIndex].imagePreview = URL.createObjectURL(input.files[0]);
    }
  }

  removeOfferImage(offerIndex: number) {
    this.offersContent.offers[offerIndex].image = null;
    this.offersContent.offers[offerIndex].imagePreview = '';
  }

  // Gallery methods
  handleGalleryUpload(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      for (let i = 0; i < input.files.length; i++) {
        const imageUrl = URL.createObjectURL(input.files[i]);
        this.galleryContent.images.push(imageUrl);
      }
    }
  }

  removeGalleryImage(index: number) {
    this.galleryContent.images.splice(index, 1);
  }

  editGalleryImage(index: number) {
    console.log('Editing gallery image at index:', index);
  }

  // Toast notification
  showToast(message: string) {
    const toast = { message };
    this.toasts.push(toast);
    setTimeout(() => {
      this.toasts = this.toasts.filter(t => t !== toast);
    }, 3000);
  }
}