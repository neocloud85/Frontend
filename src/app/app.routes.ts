import { Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/landing/landing').then(m => m.Landing)
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./components/login/login').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./components/register/register').then(m => m.Register)
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./components/dashboard/dashboard').then(m => m.DashboardComponent)
  },
  {
    path: 'book/:id',
    loadComponent: () =>
      import('./components/book-details/book-details').then(m => m.BookDetails)
  },

  {
    path: 'mis-resenas',
    loadComponent: () => import('./components/my-reviews/my-reviews').then(m => m.MyReviews)
  },

  { 
    path: 'recomendados', 
    loadComponent: () => import('./components/recomendaciones/recomendaciones').then(m => m.Recomendaciones) 
  },

  {
    path: 'resenas-usuarios',
    loadComponent: () =>
      import('./components/other-reviews/other-reviews')
        .then(m => m.ResenasSeguidosComponent)
  },

  {
    path: 'buscar-usuarios',
    loadComponent: () =>
      import('./components/buscar-usuarios/buscar-usuarios')
        .then(m => m.BuscarUsuariosComponent)
  },

  {
    path: 'solicitudes',
    loadComponent: () =>
      import('./components/solicitudes-pendientes/solicitudes-pendientes')
        .then(m => m.SolicitudesPendientesComponent)
  },

  // ============================
  // 🟩 ADMIN USUARIOS
  // ============================
  {
    path: 'admin/usuarios',
    loadComponent: () =>
      import('./components/admin/admin-usuarios/admin-usuarios')
        .then(m => m.AdminUsuariosComponent),
    canActivate: [authGuard]
  },

  {
    path: 'admin/usuarios/editar/:id',
    loadComponent: () =>
      import('./components/admin/editar-usuario/editar-usuario')
        .then(m => m.EditarUsuarioComponent),
    canActivate: [authGuard]
  },

  // ============================
  // 🟩 ADMIN RESEÑAS
  // ============================
  {
    path: 'admin/resenas',
    loadComponent: () =>
      import('./components/admin/admin-resenas/admin-resenas')
        .then(m => m.AdminResenasComponent),
    canActivate: [authGuard]
  },

  // ============================
  // 🟩 ADMIN MENSAJES (NUEVO)
  // ============================
  {
    path: 'admin/mensajes',
    loadComponent: () =>
      import('./components/admin/admin-mensajes/admin-mensajes')
        .then(m => m.AdminMensajesComponent),
    canActivate: [authGuard]
  },

  {
    path: 'admin/mensajes/:chatId',
    loadComponent: () =>
      import('./components/admin/admin-chat/admin-chat')
        .then(m => m.AdminChatComponent),
    canActivate: [authGuard]
  },

  // ============================
  // 🟦 MENSAJES USUARIO NORMAL
  // ============================
  {
    path: 'amistades',
    loadComponent: () =>
      import('./components/amistades/amistades')
        .then(m => m.AmistadesComponent),
    canActivate: [authGuard]
  },

  {
    path: 'dm',
    loadComponent: () => 
      import('./components/mensajes/dm-list/dm-list')
        .then(c => c.DmListComponent)
  },

  {
    path: 'dm/:id',
    loadComponent: () => 
      import('./components/mensajes/dm-chat/dm-chat')
        .then(c => c.DmChatComponent)
  }
];
