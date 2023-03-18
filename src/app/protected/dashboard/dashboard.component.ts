import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styles: [
    `
      * {
        margin: 15px;
      }
    `,
  ],
})
export class DashboardComponent {
  // GETTER
  get usuario() {
    return this.authService.usuario;
  }
  // CONSTRUCTOR
  constructor(private router: Router, private authService: AuthService) {}

  // MÉTODOS
  logout(): void {
    // Opción 1
    //this.router.navigate(['/auth']);

    // Opción 2
    this.router.navigateByUrl('/auth');
    this.authService.logout();
  }
}
