import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

interface Feedback {
  id: string;
  name: string;
  roomNumber: string;
  rating: number;
  comments: string;
  status: 'Pending' | 'Responded';
  response?: string;
  isBlocked?: boolean;
}

@Component({
  selector: 'app-managefeedback',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './managefeedback.component.html',
  styleUrls: ['./managefeedback.component.css']
})
export class ManagefeedbackComponent {
  // Configuration
  itemsPerPage = 5;
  currentPage = 1;
  filteredFeedbacks: Feedback[] = [];
  showResponseModal = false;
  showConfirmationModal = false;
  showMessageModal = false;
  selectedFeedback: Feedback | null = null;
  responseText = '';
  confirmationMessage = '';
  actionCallback: () => void = () => {};
  toastMessage = '';
  showToast = false;

  // Sample feedback data with more entries
  feedbacks: Feedback[] = [
    { id: 'B1234', name: 'Yogeshwaran R', roomNumber: '101', rating: 4.5, comments: 'Excellent Service', status: 'Pending' },
    { id: 'B4321', name: 'Gogul', roomNumber: '102', rating: 4, comments: 'Good', status: 'Pending' },
    { id: 'B5678', name: 'Priya', roomNumber: '103', rating: 5, comments: 'This is the best service!', status: 'Responded', response: 'Thank you!' },
    { id: 'B8765', name: 'Rahul', roomNumber: '104', rating: 3, comments: 'Average experience', status: 'Pending' },
    { id: 'B9876', name: 'Anjali K', roomNumber: '105', rating: 4.5, comments: 'Very good service', status: 'Pending' },
    { id: 'B1122', name: 'Vikram S', roomNumber: '106', rating: 2, comments: 'Needs improvement', status: 'Pending' },
    { id: 'B3344', name: 'Neha P', roomNumber: '107', rating: 4, comments: 'Comfortable stay', status: 'Responded', response: 'Glad you enjoyed!' },
    { id: 'B5566', name: 'Sanjay M', roomNumber: '108', rating: 5, comments: 'Perfect vacation', status: 'Pending' },
    { id: 'B7788', name: 'Divya R', roomNumber: '109', rating: 3.5, comments: 'Good but noisy', status: 'Pending' },
    { id: 'B9900', name: 'Arun K', roomNumber: '110', rating: 4, comments: 'Will recommend', status: 'Responded', response: 'Thanks for recommending!' },
    { id: 'B2233', name: 'Meena S', roomNumber: '201', rating: 1, comments: 'Terrible experience', status: 'Pending' },
    { id: 'B4455', name: 'Karthik N', roomNumber: '202', rating: 4, comments: 'Friendly staff', status: 'Pending' },
    { id: 'B6677', name: 'Shalini P', roomNumber: '203', rating: 5, comments: 'Luxurious stay', status: 'Pending' },
    { id: 'B8899', name: 'Deepak R', roomNumber: '204', rating: 3, comments: 'Average facilities', status: 'Pending' },
    { id: 'B0011', name: 'Pooja M', roomNumber: '205', rating: 4.5, comments: 'Excellent food', status: 'Responded', response: 'Our chef will be pleased!' }
  ];

  constructor() {
    this.initTable();
  }

  // Initialize the table
  initTable() {
    this.filteredFeedbacks = [...this.feedbacks];
  }

  // Get feedbacks for current page
  getFeedbacksToShow() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    const feedbacksOnPage = this.filteredFeedbacks.slice(startIndex, endIndex);
    
    while (feedbacksOnPage.length < this.itemsPerPage) {
      feedbacksOnPage.push(null as any);
    }
    
    return feedbacksOnPage;
  }

  // Update results info
  updateResultsInfo() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage + 1;
    const endIndex = Math.min(this.currentPage * this.itemsPerPage, this.filteredFeedbacks.length);
    return `Showing ${startIndex} to ${endIndex} of ${this.filteredFeedbacks.length} results`;
  }

  // Search functionality
  performSearch(searchTerm: string) {
    if (!searchTerm) {
      this.filteredFeedbacks = [...this.feedbacks];
    } else {
      const term = searchTerm.toLowerCase();
      this.filteredFeedbacks = this.feedbacks.filter(feedback => {
        return (
          feedback.id.toLowerCase().includes(term) || 
          feedback.name.toLowerCase().includes(term) || 
          feedback.roomNumber.toLowerCase().includes(term) || 
          feedback.comments.toLowerCase().includes(term) ||
          feedback.status.toLowerCase().includes(term)
        );
      });
    }
    this.currentPage = 1;
  }

  // Pagination
  changePage(page: number) {
    if (page >= 1 && page <= this.getTotalPages()) {
      this.currentPage = page;
    }
  }

  getTotalPages() {
    return Math.ceil(this.filteredFeedbacks.length / this.itemsPerPage);
  }

  getPaginationRange() {
    const totalPages = this.getTotalPages();
    const maxVisiblePages = 5;
    let startPage = Math.max(1, this.currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    return { startPage, endPage, totalPages };
  }

  // Modal operations
  openResponseModal(feedback: Feedback) {
    this.selectedFeedback = feedback;
    this.responseText = feedback.response || '';
    this.showResponseModal = true;
  }

  closeModal() {
    this.showResponseModal = false;
    this.showConfirmationModal = false;
  }

  // Show toast message
  showToastMessage(message: string, duration: number = 3000) {
    this.toastMessage = message;
    this.showToast = true;
    setTimeout(() => {
      this.showToast = false;
    }, duration);
  }

  // Show confirmation dialog
  showConfirmation(message: string, callback: () => void) {
    this.confirmationMessage = message;
    this.actionCallback = callback;
    this.showConfirmationModal = true;
  }

  // Form submission
  submitResponse() {
    this.showConfirmation('Are you sure you want to submit this response?', () => {
      if (this.responseText.trim() && this.selectedFeedback) {
        const index = this.feedbacks.findIndex(f => f.id === this.selectedFeedback?.id);
        if (index !== -1) {
          this.feedbacks[index] = {
            ...this.feedbacks[index],
            status: 'Responded',
            response: this.responseText
          };
        }
        
        const filteredIndex = this.filteredFeedbacks.findIndex(f => f.id === this.selectedFeedback?.id);
        if (filteredIndex !== -1) {
          this.filteredFeedbacks[filteredIndex] = {
            ...this.filteredFeedbacks[filteredIndex],
            status: 'Responded',
            response: this.responseText
          };
        }
        this.showToastMessage('Response submitted successfully!');
      }
      this.closeModal();
    });
  }

  // Feedback actions
  blockUser(feedback: Feedback) {
    this.showConfirmation(`Block ${feedback.name} from submitting future feedback?`, () => {
      feedback.isBlocked = true;
      this.showToastMessage(`${feedback.name} has been blocked from submitting feedback`);
    });
  }

  unblockUser(feedback: Feedback) {
    this.showConfirmation(`Unblock ${feedback.name} to allow submitting feedback?`, () => {
      feedback.isBlocked = false;
      this.showToastMessage(`${feedback.name} has been unblocked and can submit feedback again`);
    });
  }

  deleteFeedback(feedback: Feedback) {
    this.showConfirmation(`Delete feedback from ${feedback.name}? This cannot be undone.`, () => {
      this.feedbacks = this.feedbacks.filter(f => f.id !== feedback.id);
      this.filteredFeedbacks = this.filteredFeedbacks.filter(f => f.id !== feedback.id);
      
      if (this.filteredFeedbacks.length <= (this.currentPage - 1) * this.itemsPerPage && this.currentPage > 1) {
        this.currentPage--;
      }
      this.showToastMessage('Feedback deleted successfully');
    });
  }

  // Helper methods
  getPageNumbers(start: number, end: number): number[] {
    return Array.from({length: end - start + 1}, (_, i) => start + i);
  }

  renderStars(rating: number): string {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    let stars = '';
    for (let i = 0; i < fullStars; i++) stars += '★';
    if (hasHalfStar) stars += '½';
    for (let i = 0; i < emptyStars; i++) stars += '☆';
    
    return stars;
  }
}