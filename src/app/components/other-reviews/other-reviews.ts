import { Component, ChangeDetectorRef, inject } from '@angular/core';
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

  private books = inject(Books);
  private cdr = inject(ChangeDetectorRef);

  ngOnInit() {
    this.cargarResenas();
  }

  cargarResenas() {
    this.books.getResenasSeguidos().subscribe({
      next: (data) => {
        this.reviews = [...data];
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }
}
