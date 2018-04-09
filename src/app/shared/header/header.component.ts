import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../services/service.index';
import { Usuario } from '../../models/usuario.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit {

  public usuario: Usuario;
  constructor( public _usuarioService: UsuarioService,
                public router: Router
  ) { }

  ngOnInit() {
    this.usuario = this._usuarioService.usuario;
  }

  logout() {
    this._usuarioService.logout();
  }

  buscar( termino: string ) {
    this.router.navigate(['/busqueda/', termino]);
  }

}
