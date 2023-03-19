import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ValidarTokenGuard } from './guards/validar-token.guard';

const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./protected/protected.module').then((m) => m.ProtectedModule),
    canActivate: [ValidarTokenGuard],
    canLoad: [ValidarTokenGuard],
  },
  {
    path: '**',
    redirectTo: 'auth',
  },
];

@NgModule({
  imports: [
    /*
    - useHash: true, : Configuración para indicar que trabaje las rutas con "hash".
    - Esto agregará un "#" antes de las rutas. Con el fin de ayudar a navegar a las rutas de angular.
     sin modificar el url del servidor en donde se encuentre. Por ejemplo el archivo dist dentro de una aplicación en NodeJS
    - Ejemplo: http://localhost:4200/#/auth/login
    - Por defecto es "false"
    */
    RouterModule.forRoot(routes, {
      useHash: false,
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
