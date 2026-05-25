import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Books } from '../../services/books';
import { TranslatePipe } from '../../pipes/translate-pipe';

interface Libro {
  id: string;
  titulo: string;
  portada: string;
  nota_media: number;
}

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslatePipe],
  templateUrl: './landing.html',
  styleUrl: './landing.css',
})
export class Landing {

  private books = inject(Books);

  topLibros = signal<Libro[]>([]);
  loadingTop = signal(true);

  ngOnInit() {
    this.books.getTopLibros().subscribe({
      next: (res: any[]) => {
        this.topLibros.set(res);
        this.loadingTop.set(false);
      },
      error: () => this.loadingTop.set(false)
    });
  }
}
