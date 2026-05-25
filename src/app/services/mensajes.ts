import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MensajesService {

  private apiUrl = `${environment.apiUrl}/mensajes`;

  constructor(private http: HttpClient) {}

  obtenerChats(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/chats`);
  }

  obtenerConversacion(id: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/conversacion/${id}`);
  }

  enviarMensaje(data: { destinatario_id: string; contenido: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/enviar`, data);
  }
}
