import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, of, tap, Observable } from 'rxjs';

import { environment } from 'src/environments/environment';
import { AuthResponse, Usuario } from '../interfaces/interfaces';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // PROPIEDADES
  private baseUrl: string = environment.baseUrl;
  private _usuario!: Usuario;

  get usuario() {
    return { ...this._usuario };
  }
  // CONSTRUCTOR
  constructor(private http: HttpClient) {}

  registro(name: string, email: string, password: string) {
    // Declaramos la url y el cuerpo del request
    const url: string = `${this.baseUrl}/auth/new`;
    const body = { name, email, password };

    return this.http.post<AuthResponse>(url, body).pipe(
      tap(({ ok, token }) => {
        // Verifico que la propiedad "ok" del response sea "true"
        if (ok) {
          localStorage.setItem('token', token!);
        }
      }),
      // Atrapamos la respuesta deolviendo el "true"
      map((response) => response.ok),
      // Atrapamos el posible error(status, 500, 400 y similares) y devolvemos el contenido del mensaje como Observable
      catchError((err) => of(err.error.msg))
    );
  }

  // MÉTODOS
  login(email: string, password: string) {
    // Declaramos la url y el cuerpo del request
    const url: string = `${this.baseUrl}/auth`;
    const body = { email, password };
    // Con el "pipe()" haremos una cadena de operadores, con el fin de asegurar y obtener la información del usuario,
    // antes de que llegue a la pantalla de login, que es donde redirecciona al Dashboard.
    return this.http.post<AuthResponse>(url, body).pipe(
      tap((response) => {
        console.log('tap', response);
        // Verifico que la propiedad "ok" del response sea "true"
        if (response.ok) {
          localStorage.setItem('token', response.token!);
        }
      }),
      // Atrapamos la respuesta deolviendo el "true"
      map((response) => {
        console.log('map', response);
        return response.ok;
      }),
      // Atrapamos el posible error(status, 500, 400 y similares) y devolvemos el contenido del mensaje como Observable
      catchError((err) => {
        console.log('catchError', err);
        return of(err.error.msg);
      })
    );
  }

  // Devolveremos un "Observable<boolean>" ya que será usado en el "guard" y este es el tipo que necesitan devolver
  validarToken(): Observable<boolean> {
    const url: string = `${this.baseUrl}/auth/renew`;
    // Establecemos el "header" (que debe ser de tipo HttpHeaders) para enviarlo en la petición
    const headers = new HttpHeaders().set(
      'x-token',
      localStorage.getItem('token') || ''
    );

    return this.http.get<AuthResponse>(url, { headers: headers }).pipe(
      map((response) => {
        // Establecemos la información del usuario
        localStorage.setItem('token', response.token!);
        // Asigno las propiedades response a la propieadd local "_usuario"
        this._usuario = {
          name: response.name!,
          uid: response.uid!,
          email: response.email!,
        };
        return response.ok;
      }),
      // atarpamos el error en caso devuelva un 401 por ejemplo
      catchError((err) => of(false))
    );
  }

  logout() {
    localStorage.removeItem('token');
  }
}
