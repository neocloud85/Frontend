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

  reviews    = signal<any[]>([]);
  loading    = signal(true);

  page       = signal(1);
  totalPages = signal(1);
  total      = signal(0);
  readonly limit = 8;

  ngOnInit() {
    this.cargar();
  }

  cargar() {
    this.loading.set(true);
    this.books.getMyReviews(this.page(), this.limit).subscribe({
      next: (res: any) => {
        this.reviews.set(res.resenas);
        this.total.set(res.total);
        this.totalPages.set(res.totalPages);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  goTo(p: number) {
    if (p < 1 || p > this.totalPages()) return;
    this.page.set(p);
    this.cargar();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  pages(): number[] {
    return Array.from({ length: this.totalPages() }, (_, i) => i + 1);
  }
}
