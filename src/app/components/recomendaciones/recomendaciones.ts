import { Component, inject, signal } from '@angular/core';
import { Books } from '../../services/books';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '../../pipes/translate-pipe';

@Component({
  selector: 'app-recomendaciones',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslatePipe],
  templateUrl: './recomendaciones.html',
  styleUrl: './recomendaciones.css',
})
export class Recomendaciones {

  private books = inject(Books);

  recomendaciones = signal<any[]>([]);
  categorias      = signal<string[]>([]);
  motivo          = signal<string>('');
  loading         = signal(true);
  error           = signal<string | null>(null);

  ngOnInit() {
    this.books.getRecomendaciones().subscribe({
      next: (res: any) => {
        this.recomendaciones.set(res.recomendados  ?? res);
        this.categorias.set(res.categorias         ?? []);
        this.motivo.set(res.motivo                 ?? '');
        this.loading.set(false);
      },
      error: () => {
        this.error.set('No se pudieron cargar las recomendaciones');
        this.loading.set(false);
      }
    });
  }
}
