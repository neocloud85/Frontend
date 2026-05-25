import { Component, inject, signal } from '@angular/core';
import { Books } from '../../services/books';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '../../pipes/translate-pipe';

@Component({
  selector: 'app-my-reviews',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  templateUrl: './my-reviews.html',
  styleUrl: './my-reviews.css',
})
export class MyReviews {

  private books = inject(Books);

  reviews = signal<any[]>([]);
  loading = signal(true);

  ngOnInit() {
    this.books.getMyReviews().subscribe({
      next: (res: any[]) => {
        this.reviews.set(res);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }
}
