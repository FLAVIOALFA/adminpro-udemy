import { Injectable } from '@angular/core';
import { Usuario } from '../../models/usuario.model';
import { URL_SERVICIOS } from '../../config/config';

import { SubirArchivoService } from '../subir-archivo/subir-archivo.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class UsuarioService {

  usuario: Usuario;
  token: string;
  menu: any[] = [];

  constructor(
    public _http: HttpClient, 
    public _router: Router,
    public _subirArchivoService: SubirArchivoService
  ) {
    this.cargarStorage();
  }

  renuevaToken() {
    let url = URL_SERVICIOS + '/login/renuevatoken';
    url += '?token=' + this.token ;

    return this._http.get(url)
                .map( (resp: any) => {
                  this.token = resp.token;
                  localStorage.setItem('token', this.token);
                  console.log('Token renovado');
                })
                .catch( (err: any) => {
                  swal('Session caducada', 'Debes volver a loguearte', 'err');
                  this._router.navigate(['/login']);
                  return Observable.throw(err);
                });

  }
  
  estaLogueado() {
    return (this.token.length > 5) ? true : false;
  }

  guardarStorage(id: string, token: string, usuario: Usuario, menu: any) {
    localStorage.setItem('id', id);
    localStorage.setItem('token', token);
    localStorage.setItem('usuario', JSON.stringify(usuario));
    localStorage.setItem('menu', JSON.stringify(menu));

    this.usuario = usuario;
    this.token = token;
    this.menu = menu;
  }

  cargarStorage() {
    if ( localStorage.getItem('token')) {
      this.token = localStorage.getItem('token');
      this.usuario = JSON.parse( localStorage.getItem('usuario'));
      this.menu = JSON.parse( localStorage.getItem('menu') );
    } else {
      this.token = '';
      this.usuario = null;
      this.menu = [];
    }

  }

  logout() {
    localStorage.removeItem('id');
    localStorage.removeItem('token');
    localStorage.removeItem('usuario'); 
    localStorage.removeItem('menu'); 

    this.usuario = null;
    this.token = null;
    this.menu = [];

    this._router.navigate(['/login']);
  }

  loginGoogle(token: string) {
    let url = URL_SERVICIOS + '/login/google';    

    return this._http.post(url, {token})
              .map((resp: any) => {
                this.guardarStorage(resp.id, resp.token, resp.usuario, resp.menu);
                return true;
              });

  }

  login(usuario: Usuario, recordar: boolean = false) {

    if (recordar) {
      localStorage.setItem('email', usuario.email);
    }else {
      localStorage.removeItem('email');
    }

    let url = URL_SERVICIOS + '/login';

    return this._http.post(url, usuario)
               .map( (resp: any) => {
                this.guardarStorage(resp.id, resp.token, resp.usuario, resp.menu);                
                 return true;
               })
               .catch( (err: any) => {
                 swal('Error al loguearse', err.error.message, 'error');
                 return Observable.throw(err);
               });
  }

  crearUsuario(usuario: Usuario) {
    let url = URL_SERVICIOS + '/usuario';
    return  this._http.post(url, usuario)
                .map( (resp: any) => {
                  swal('Usuario Creado', usuario.email, 'success');
                  return resp.usuario;
                })
                .catch( (err: any) => {                  
                  swal(err.error.message, err.error.errors.errors.email.message, 'error');
                  return Observable.throw(err);
                });
  }

  actualizarUsuario(usuario: Usuario) {
    let url = URL_SERVICIOS + '/usuario/' + usuario._id + '?token=' + this.token;

    return this._http.put(url, usuario)
               .map((resp: any) => {        
                
                  if ( usuario._id === this.usuario._id) {
                    let usuarioDB = resp.usuario;
                    this.guardarStorage(usuarioDB._id, this.token, usuarioDB, this.menu);
                  }
                
                   swal('Usuario Actualizado', usuario.nombre, 'success');  
                   return true;               
               })
               .catch( (err: any) => {                
                swal(err.error.message, err.error.errors.message, 'error');
                return Observable.throw(err);
              });
  }

  cambiarImagen(archivo: File, id: string) {
    this._subirArchivoService.subirArchivo(archivo, 'usuarios', id)
        .then( (resp: any) => {
          this.usuario.img = resp.usuario.img;
          swal('Imagen actualizada', this.usuario.nombre, 'success');
          this.guardarStorage(id, this.token, this.usuario, this.menu);
        })
        .catch( resp => {          
          console.log(resp);
        });
  }

  cargarUsuarios(desde: number = 0) {
    let url = URL_SERVICIOS + '/usuario?desde=' + desde;
    return this._http.get(url);
  }

  buscarUsuarios( termino: string ) {
    let url = URL_SERVICIOS + '/busqueda/coleccion/usuarios/' + termino;

    return this._http.get(url).map((resp: any) => resp.usuarios);

  }

  borrarUsuario( id: string ) {
    let url = URL_SERVICIOS + '/usuario/' + id;
    url += '?token=' + this.token;

    return this._http.delete(url)
              .map( resp => {
                swal('Usuario borrado', 'El usuario ha sido eliminado correctamente', 'success');
                return true;
              });

  }


}
