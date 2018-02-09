import { Injectable } from '@angular/core';
import { Usuario } from '../../models/usuario.model';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from '../../config/config';

import 'rxjs/add/Operator/map';

@Injectable()
export class UsuarioService {

  usuario: Usuario;
  token: string;

  private url: string = URL_SERVICIOS;
  constructor(public _http: HttpClient) { }
  
  guardarStorage(id: string, token: string, usuario: Usuario) {
    localStorage.setItem('id', id);
    localStorage.setItem('token', token);
    localStorage.setItem('usuario', JSON.stringify(usuario));

    this.usuario = usuario;
    this.token = token;
  }

  loginGoogle(token: string) {
    this.url += '/login/google';

    return this._http.post(this.url, {token})
              .map((resp: any) => {
                this.guardarStorage(resp.id, resp.token, resp.usuario);
                return true;
              });

  }

  login(usuario: Usuario, recordar: boolean = false) {

    if (recordar) {
      localStorage.setItem('email', usuario.email);
    }else {
      localStorage.removeItem('email');
    }

    this.url += '/login';
    
    return this._http.post(this.url, usuario)
               .map( (resp: any) => {             
                this.guardarStorage(resp.id, resp.token, resp.usuario);    
                 return true;
               });
  }

  crearUsuario(usuario: Usuario) {
    this.url += '/usuario';
    return  this._http.post(this.url, usuario)
                .map( (resp: any) => {
                  swal('Usuario Creado', usuario.email, 'success');
                  return resp.usuario;
                });
  }


}
