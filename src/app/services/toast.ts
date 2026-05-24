import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  private Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 2500,
    timerProgressBar: true,
    background: '#1e1e1e',
    color: '#fff'
  });

  success(msg: string) {
    this.Toast.fire({
      icon: 'success',
      title: msg
    });
  }

  error(msg: string) {
    this.Toast.fire({
      icon: 'error',
      title: msg
    });
  }

  info(msg: string) {
    this.Toast.fire({
      icon: 'info',
      title: msg
    });
  }

  warning(msg: string) {
    this.Toast.fire({
      icon: 'warning',
      title: msg
    });
  }

  confirm(texto: string) {
    return Swal.fire({
      title: texto,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí',
      cancelButtonText: 'No',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33'
    });
  }
}
