import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class Books {
  private http = inject(HttpClient);

  private backendUrl = environment.apiUrl;

  constructor() {
    console.log('ENV:', environment);
  }

  // ============================
  // 🔧 FIX: Forzar HTTPS en imágenes
  // ============================
  private fixImage(url: string): string {
    if (!url) return url;
    return url.replace('http://', 'https://');
  }

  // ============================
  // 🔍 BUSCAR LIBROS (Google Books directo)
  // ============================
  searchBooks(query: string) {
    return this.http
      .get(
        `https://www.googleapis.com/books/v1/volumes?q=${query}&key=${environment.googleBooksKey}`
      )
      .pipe(
        map((res: any) => {
          res.items?.forEach((item: any) => {
            const img = item.volumeInfo?.imageLinks?.thumbnail;
            if (img) item.volumeInfo.imageLinks.thumbnail = this.fixImage(img);
          });
          return res;
        })
      );
  }

  // ============================
  // 📚 CARGAR LIBROS POR CATEGORÍA (BACKEND)
  // ============================
  getBooksByCategory(category: string, maxResults: number = 20) {
    return this.http
      .get(
        `${this.backendUrl}/books/by-category?cat=${encodeURIComponent(
          category
        )}&max=${maxResults}`
      )
      .pipe(
        map((res: any) => {
          res.items?.forEach((book: any) => {
            if (book.imagen) book.imagen = this.fixImage(book.imagen);
          });
          return res;
        })
      );
  }

  // ============================
  // 📚 CARGAR CATÁLOGO COMPLETO DESDE VARIAS CATEGORÍAS
  // ============================
  async getCatalogByCategories(categories: string[], maxResults: number = 20) {
    const requests = categories.map((cat) =>
      this.getBooksByCategory(cat, maxResults).toPromise()
    );

    const responses: any[] = await Promise.all(requests);

    const allBooks = responses.flatMap((res: any) => res.items || []);

    const unique = new Map();
    allBooks.forEach((book) => {
      if (book.imagen) book.imagen = this.fixImage(book.imagen);
      unique.set(book.id, book);
    });

    return Array.from(unique.values());
  }

  // ============================
  // 🔤 AUTOCOMPLETE (Google Books directo)
  // ============================
  autocomplete(title: string) {
    return this.http
      .get(
        `https://www.googleapis.com/books/v1/volumes?q=intitle:${title}&langRestrict=es&maxResults=10&key=${environment.googleBooksKey}`
      )
      .pipe(
        map((res: any) => {
          res.items?.forEach((item: any) => {
            const img = item.volumeInfo?.imageLinks?.thumbnail;
            if (img) item.volumeInfo.imageLinks.thumbnail = this.fixImage(img);
          });
          return res;
        })
      );
  }

  // ============================
  // 📘 DETALLES DE UN LIBRO (Google Books directo)
  // ============================
  getBook(id: string) {
    return this.http
      .get(
        `https://www.googleapis.com/books/v1/volumes/${id}?key=${environment.googleBooksKey}`
      )
      .pipe(
        map((res: any) => {
          const img = res.volumeInfo?.imageLinks?.thumbnail;
          if (img) res.volumeInfo.imageLinks.thumbnail = this.fixImage(img);
          return res;
        })
      );
  }

  getBookById(id: string) {
    return this.getBook(id);
  }

  // ============================
  // ⭐ RESEÑAS
  // ============================
  addReview(data: {
    libro_id: string;
    titulo: string;
    autor: string;
    descripcion: string;
    imagen: string;
    categorias: string[];
    puntuacion: number;
    texto?: string | null;
  }) {
    data.imagen = this.fixImage(data.imagen);
    return this.http.post(`${this.backendUrl}/resenas`, data);
  }

  getMyReviews() {
    return this.http.get<any[]>(`${this.backendUrl}/resenas/mias`);
  }

  hasReview(libro_id: string) {
    return this.http.get<{ hasReview: boolean }>(
      `${this.backendUrl}/resenas/mia/${libro_id}`
    );
  }

  getRecomendaciones() {
    return this.http.get<any[]>(`${this.backendUrl}/recomendaciones`);
  }

  getOtherReviews() {
    return this.http.get<any[]>(`${this.backendUrl}/resenas/otros`);
  }

  getResenasSeguidos() {
    return this.http.get<any[]>(`${this.backendUrl}/resenas/seguidos`);
  }

  getTopLibros() {
    return this.http.get<any[]>(`${this.backendUrl}/resenas/top`);
  }

  // ============================
  // 📚 CATÁLOGO DESDE BACKEND
  // ============================
  getCatalog(page: number, categoria?: string) {
    let url = `${this.backendUrl}/libros/catalog?page=${page}`;

    if (categoria) {
      url += `&cat=${encodeURIComponent(categoria)}`;
    }

    return this.http.get<{ items: any[]; etiquetas: string[] }>(url).pipe(
      map((res) => {
        res.items?.forEach((book) => {
          if (book.imagen) book.imagen = this.fixImage(book.imagen);
        });
        return res;
      })
    );
  }
}
