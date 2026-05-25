import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AmistadService {

  private http = inject(HttpClient);
  private api = environment.apiUrl;

  // Contador global con SIGNAL
  solicitudesCount = signal(0);

  // Buscar usuarios por nombre
  buscarUsuarios(q: string) {
    return this.http.get<any[]>(`${this.api}/amistad/buscar?q=${q}`);
  }

  // Enviar solicitud
  enviarSolicitud(receptor: string) {
    console.log("📤 Enviando receptor:", receptor);
    return this.http.post(`${this.api}/amistad/enviar`, { receptor });
  }

  // Obtener solicitudes pendientes (y actualizar contador)
  getSolicitudesPendientes() {
    return this.http
      .get<any[]>(`${this.api}/amistad/pendientes`)
      .pipe(
        tap(data => this.solicitudesCount.set(data.length))
      );
  }

  // Aceptar solicitud
  aceptarSolicitud(id: number) {
    return this.http.post(`${this.api}/amistad/aceptar`, { id });
  }

  // Rechazar solicitud
  rechazarSolicitud(id: number) {
    return this.http.post(`${this.api}/amistad/rechazar`, { id });
  }

  getSiguiendo(id: string) {
    return this.http.get<any[]>(`${this.api}/amistad/siguiendo/${id}`);
  }

  getSeguidores(id: string) {
    return this.http.get<any[]>(`${this.api}/amistad/seguidores/${id}`);
  }

  unfollow(id: string) {
    return this.http.delete(`${this.api}/amistad/unfollow/${id}`);
  }

  followBack(id: string) {
    return this.http.post(`${this.api}/amistad/follow/${id}`, {});
  }
  getAllUsers() {
  return this.http.get<any[]>(`${this.api}/amistad/usuarios`);
}

}
