import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoriasService {

  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}`;

  getCategoriasGlobales() {
    return this.http.get<{ status: string; categorias: string[] }>(
      `${this.apiUrl}/categorias/globales`
    );
  }
}
