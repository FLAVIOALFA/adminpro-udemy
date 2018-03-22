import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../services/service.index';
import { Usuario } from '../../models/usuario.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styles: []
})
export class ProfileComponent implements OnInit {

  public usuario: Usuario;
  public imagenSubir: File;
  public imagenTemp: string;

  constructor ( public _usuarioService: UsuarioService ) {
    // this.usuario = JSON.parse(localStorage.getItem('usuario'));
   }
 
  ngOnInit() {
    this.usuario = JSON.parse(localStorage.getItem('usuario'));
  }

  guardar( usuario: Usuario) {
    this.usuario.nombre = usuario.nombre;
    if ( !this.usuario.google ) {
      this.usuario.email = usuario.email;
      this._usuarioService.actualizarUsuario(this.usuario)
          .subscribe();
    }    

    // console.log(usuario.email);

  }

  seleccionImagen( archivo: File ) {
    if ( !archivo ) {
      this.imagenSubir = null;
      return;
    }

    if ( archivo.type.indexOf('image') < 0) {
      swal('Solo imagenes', 'El archivo seleccionado no es una imagen', 'error');
      this.imagenSubir = null;
      return;
    }

    this.imagenSubir = archivo;    

    let reader = new FileReader();
    let urlImagenTemp = reader.readAsDataURL(archivo);

    reader.onloadend = () => this.imagenTemp = reader.result;



  }

  cambiarImagen() {    
    this._usuarioService.cambiarImagen(this.imagenSubir, this.usuario._id);
  }

}
