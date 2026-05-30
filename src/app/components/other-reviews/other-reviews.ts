import { Component, ChangeDetectorRef, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Books } from '../../services/books';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '../../pipes/translate-pipe';

@Component({
  selector: 'app-resenas-seguidos',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslatePipe],
  templateUrl: './other-reviews.component.html',
  styleUrl: './other-reviews.css',
})
export class ResenasSeguidosComponent {

  loading = true;
  reviews: any[] = [];

  page       = signal(1);
  totalPages = signal(1);
  total      = signal(0);
  readonly limit = 8;

  private books = inject(Books);
  private cdr   = inject(ChangeDetectorRef);

  ngOnInit() {
    this.cargarResenas();
  }

  cargarResenas() {
    this.loading = true;
    this.books.getResenasSeguidos(this.page(), this.limit).subscribe({
      next: (data: any) => {
        this.reviews = data.resenas;
        this.total.set(data.total);
        this.totalPages.set(data.totalPages);
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  goTo(p: number) {
    if (p < 1 || p > this.totalPages()) return;
    this.page.set(p);
    this.cargarResenas();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  pages(): number[] {
    return Array.from({ length: this.totalPages() }, (_, i) => i + 1);
  }
}
