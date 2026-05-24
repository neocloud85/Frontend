import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Books } from '../../services/books';
import { DecimalPipe, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, DecimalPipe, FormsModule, CommonModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent {

  private router = inject(Router);
  private books = inject(Books);

  // Libros visibles (solo los de la página actual)
  catalogVisible = signal<any[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);

  // Paginación
  currentPage = signal(0);
  totalPages = signal(1);

  // Categorías fijas
  categoriasDisponibles: string[] = [
    'Fiction',
    'Fantasy',
    'Romance',
    'Mystery',
    'Science',
    'History',
    'Biography',
    'Computers'
  ];

  categoriaSeleccionada = signal<string | null>(null);

  // Top libros
  topLibros = signal<any[]>([]);
  loadingTop = signal(true);

  // Búsqueda
  searchTerm = signal('');
  suggestions = signal<any[]>([]);
  typingTimeout: any = null;
  searching = signal(false);

  ngOnInit() {
    this.cargarTopLibros();
    this.cargarCatalogoPagina();
  }

  // ============================
  // Cargar catálogo de la página actual
  // ============================
  cargarCatalogoPagina() {
    this.loading.set(true);

    this.books.getCatalog(
      this.currentPage(),
      this.categoriaSeleccionada() || undefined
    ).subscribe({
      next: (res: any) => {
        this.catalogVisible.set(res.items || []);

        // Si el backend devuelve totalItems, calculamos totalPages
        if (res.totalItems !== null && res.totalItems !== undefined) {
          this.totalPages.set(Math.ceil(res.totalItems / 20));
        }

        this.loading.set(false);
      },
      error: () => {
        this.error.set('Error cargando catálogo');
        this.loading.set(false);
      }
    });
  }

  // ============================
  // Cambiar categoría
  // ============================
  seleccionarCategoria(cat: string) {
    if (this.categoriaSeleccionada() === cat) {
      this.categoriaSeleccionada.set(null);
    } else {
      this.categoriaSeleccionada.set(cat);
    }

    this.currentPage.set(0);
    this.cargarCatalogoPagina();
  }

  // ============================
  // Paginación
  // ============================
  siguientePagina() {
    if (this.currentPage() + 1 >= this.totalPages()) return;
    this.currentPage.update(p => p + 1);
    this.cargarCatalogoPagina();
  }

  anteriorPagina() {
    if (this.currentPage() === 0) return;
    this.currentPage.update(p => p - 1);
    this.cargarCatalogoPagina();
  }

  irAlInicio() {
    this.currentPage.set(0);
    this.cargarCatalogoPagina();
  }

  irAlFinal() {
    this.currentPage.set(this.totalPages() - 1);
    this.cargarCatalogoPagina();
  }

  // ============================
  // Top libros
  // ============================
  cargarTopLibros() {
    this.loadingTop.set(true);

    this.books.getTopLibros().subscribe({
      next: data => {
        this.topLibros.set([...data]);
        this.loadingTop.set(false);
      },
      error: () => this.loadingTop.set(false)
    });
  }

  // ============================
  // Autocomplete
  // ============================
  onType(value: string) {
    this.searchTerm.set(value);
    clearTimeout(this.typingTimeout);

    if (!value.trim()) {
      this.suggestions.set([]);
      return;
    }

    this.typingTimeout = setTimeout(() => {
      this.books.autocomplete(value).subscribe({
        next: (res: any) => this.suggestions.set(res.items || []),
        error: () => this.suggestions.set([])
      });
    }, 300);
  }

  selectSuggestion(title: string) {
    this.searchTerm.set(title);
    this.suggestions.set([]);
    this.onSearch();
  }

  // ============================
  // Búsqueda
  // ============================
  onSearch() {
    const term = this.searchTerm().trim();

    if (!term) {
      this.searching.set(false);
      this.cargarCatalogoPagina();
      return;
    }

    this.loading.set(true);
    this.searching.set(true);

    this.books.searchBooks(term).subscribe({
      next: (res: any) => {
        this.catalogVisible.set(res.items || []);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Error buscando libros');
        this.loading.set(false);
      }
    });
  }

  // ============================
  // Navegación
  // ============================
  goToDetails(id: string) {
    this.router.navigate(['/book', id]);
  }

  goBack() {
    history.back();
  }

  goHome() {
    this.router.navigate(['']);
  }
}
