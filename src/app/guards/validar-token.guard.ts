import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanLoad,
  Route,
  Router,
} from '@angular/router';
import { Observable, tap } from 'rxjs';
import { AuthService } from '../auth/services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class ValidarTokenGuard implements CanActivate, CanLoad {
  // CONSTRUCTOR
  constructor(private authService: AuthService, private router: Router) {}

  // MÉTODOS
  // Borraremos el argumento state y solo dejaremos como tipo de retorna a "Observable<boolean> | boolean"
  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> | boolean {
    console.log('canActivate');
    // Usamos el método de "validarToken()", antes de entrar a la ruta, para que que por medio del token almacenado en el "localStorage" consulte al backend por su autenticidad
    // Método "validarToken()" es principalmente para mantener los datos del usuario al recargar la página
    return this.authService.validarToken().pipe(
      tap((valid) => {
        // Redireccionamos al login si el response del "validarToken" es "false"
        if (!valid) {
          this.router.navigateByUrl('/auth');
        }
      })
    );
  }

  canLoad(route: Route): Observable<boolean> | boolean {
    console.log('canLoad');
    return this.authService.validarToken().pipe(
      tap((valid) => {
        // Redireccionamos al login si el response del "validarToken" es "false"
        if (!valid) {
          this.router.navigateByUrl('/auth');
        }
      })
    );
  }
}
