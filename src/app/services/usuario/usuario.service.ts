import { Injectable } from '@angular/core';
import { Usuario } from '../../models/usuario.model';
import { URL_SERVICIOS } from '../../config/config';

import { SubirArchivoService } from '../subir-archivo/subir-archivo.service';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/Operator/map';
import { Router } from '@angular/router';

@Injectable()
export class UsuarioService {

  usuario: Usuario;
  token: string;

  constructor(
    public _http: HttpClient, 
    public _router: Router,
    public _subirArchivoService: SubirArchivoService
  ) {
    this.cargarStorage();
  }
  
  estaLogueado() {
    return (this.token.length > 5) ? true : false;
  }

  guardarStorage(id: string, token: string, usuario: Usuario) {
    localStorage.setItem('id', id);
    localStorage.setItem('token', token);
    localStorage.setItem('usuario', JSON.stringify(usuario));

    this.usuario = usuario;
    this.token = token;
  }

  cargarStorage() {
    if ( localStorage.getItem('token')) {
      this.token = localStorage.getItem('token');
      this.usuario = JSON.parse( localStorage.getItem('usuario'));
    } else {
      this.token = '';
      this.usuario = null;
    }

  }

  logout() {
    localStorage.removeItem('id');
    localStorage.removeItem('token');
    localStorage.removeItem('usuario'); 

    this.usuario = null;
    this.token = null;
    

    window.location.href = '#/login';
  }

  loginGoogle(token: string) {
    let url = URL_SERVICIOS + '/login/google';    

    return this._http.post(url, {token})
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

    let url = URL_SERVICIOS + '/login';
    
    return this._http.post(url, usuario)
               .map( (resp: any) => {             
                this.guardarStorage(resp.id, resp.token, resp.usuario);    
                 return true;
               });
  }

  crearUsuario(usuario: Usuario) {
    let url = URL_SERVICIOS + '/usuario';
    return  this._http.post(url, usuario)
                .map( (resp: any) => {
                  swal('Usuario Creado', usuario.email, 'success');
                  return resp.usuario;
                });
  }

  actualizarUsuario(usuario: Usuario) {
    let url = URL_SERVICIOS + '/usuario/' + usuario._id + '?token=' + this.token;

    return this._http.put(url, usuario)
               .map((resp: any) => {        
                
                  if ( usuario._id === this.usuario._id) {
                    let usuarioDB = resp.usuario;
                    this.guardarStorage(usuarioDB._id, this.token, usuarioDB);
                  }
                
                   swal('Usuario Actualizado', usuario.nombre, 'success');  
                   return true;               
               });
  }

  cambiarImagen(archivo: File, id: string) {
    this._subirArchivoService.subirArchivo(archivo, 'usuarios', id)
        .then( (resp: any) => {
          this.usuario.img = resp.usuario.img;
          swal('Imagen actualizada', this.usuario.nombre, 'success');
          this.guardarStorage(id, this.token, this.usuario);
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
