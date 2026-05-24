import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario } from '../interfaces/usuario.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private apiUrl = `${environment.apiUrl}/admin/panel`;

  constructor(private http: HttpClient) {}

  getUsuarios(page: number = 1): Observable<any> {
    return this.http.get(`${this.apiUrl}/usuarios?page=${page}`);
  }

  buscarUsuarios(q: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/usuarios/buscar?q=${q}`);
  }

  borrarUsuario(id: string) {
    return this.http.delete(`${this.apiUrl}/usuarios/${id}`);
  }

  hacerAdmin(id: string) {
    return this.http.put(`${this.apiUrl}/usuarios/${id}/admin`, {});
  }

  getUsuarioById(id: string) {
    return this.http.get<Usuario>(`${environment.apiUrl}/usuarios/${id}`);
  }

  actualizarUsuario(id: string, data: Partial<Usuario>) {
    return this.http.put(`${this.apiUrl}/usuarios/${id}`, data);
  }

  getResenasAdmin() {
    return this.http.get<any[]>(`${this.apiUrl}/resenas`);
  }

  borrarResena(id: string) {
    return this.http.delete(`${this.apiUrl}/resenas/${id}`);
  }
}
