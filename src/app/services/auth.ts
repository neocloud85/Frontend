import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = `${environment.apiUrl}/`;


  constructor(private http: HttpClient) { }

  // ============================
  // 🔐 LOGIN / REGISTER
  // ============================
  login(credentials: { correo: string; contrasena: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}auth/login`, credentials);
  }

  register(data: { nombre: string; correo: string; contrasena: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}usuarios/register`, data);
  }

  getCurrentUser(): Observable<any> {
    return this.http.get(`${this.apiUrl}auth/me`);
  }

  // ============================
  // 🔑 TOKEN
  // ============================
  saveToken(token: string) {
    localStorage.setItem('token', token);
  }

  getToken() {
    return localStorage.getItem('token');
  }

  logout() {
    localStorage.removeItem('token');
  }

  // ============================
  // 👤 OBTENER USUARIO DESDE EL TOKEN
  // ============================
  getUserFromToken() {
    const token = this.getToken();
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload; // { id, correo, tipo }
    } catch {
      return null;
    }
  }
  // ============================
// 🔓 ¿ESTÁ LOGUEADO?
// ============================
isLoggedIn(): boolean {
  return !!localStorage.getItem('token');
}

  // ============================
  // 🛡️ ¿ES ADMIN?
  // ============================
  isAdmin(): boolean {
    const user = this.getUserFromToken();
    return user?.tipo === 'admin';
  }
}
