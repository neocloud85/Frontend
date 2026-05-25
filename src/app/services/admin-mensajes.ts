import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminMensajesService {

  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/admin/panel/mensajes`;

  // Obtener lista de chats
  getChats() {
    return this.http.get<any[]>(`${this.apiUrl}/chats`);
  }

  // Borrar chat completo
  borrarChat(id: string) {
    return this.http.delete(`${this.apiUrl}/chats/${id}`);
  }

  // Obtener mensajes de un chat
  getMensajes(chatId: string) {
    return this.http.get<any[]>(`${this.apiUrl}/${chatId}`);
  }

  // Borrar mensaje individual
  borrarMensaje(id: string) {
    return this.http.delete(`${this.apiUrl}/msg/${id}`);
  }
}
