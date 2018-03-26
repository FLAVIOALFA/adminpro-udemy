import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../models/usuario.model';
import { UsuarioService, ModalUploadService } from '../../services/service.index';

declare var swal: any;

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styles: []
})
export class UsuariosComponent implements OnInit {

  public usuarios: Usuario[] = [];
  public desde: number = 0;
  public totalRegistros: number = 0;
  public cargando: boolean = true;

  constructor( public _usuarioService: UsuarioService,
               public _modalUploadService: ModalUploadService
  
  ) { }

  ngOnInit() {
    this.cargarUsuarios();
    this._modalUploadService.notificacion
        .subscribe(
          resp => {
            this.cargarUsuarios();
          }
        );
  }

  mostrarModal(id: string) {
    this._modalUploadService.mostrarModal('usuarios', id);
  }

  cargarUsuarios() {
    this.cargando = true;
    this._usuarioService.cargarUsuarios(this.desde)
        .subscribe( (resp: any) => {
          this.totalRegistros = resp.total;
          this.usuarios = resp.usuarios;          
          this.cargando = false;
        });
  }

  cambiarDesde( valor: number ) {
    let desde = this.desde + valor;

    if ( desde < 0 ) {      
      return;
    }

    if ( desde >= this.totalRegistros ) { 
      return;
    }

    this.desde += valor;
    this.cargarUsuarios();

  }

  buscarUsuario( termino: string ) {
    if ( termino.length <= 0 ) {
      this.cargarUsuarios();
    }

    this.cargando = true;

    this._usuarioService.buscarUsuarios( termino )
        .subscribe( (usuarios: Usuario[]) => {
          this.usuarios = usuarios;
          this.cargando = false;
        });
  }

  guardarUsuario( usuario: Usuario) {
    this._usuarioService.actualizarUsuario(usuario)
          .subscribe();
  }

  borrarUsuario(usuario: Usuario) {    
    if ( usuario._id === this._usuarioService.usuario._id ) {
      swal('No puede borrar el usuario', 'No se puede borrar a sí mismo', 'error');
      return;
    }

    swal({
      title: '¿Está seguro ?',
      text: `El usuario ${usuario.nombre} está a punto de ser borrado`,
      icon: 'warning',
      buttons: true,
      dangerMode: true
    }).then(
      borrar => {        
        if ( borrar ) {
          this._usuarioService.borrarUsuario(usuario._id)
              .subscribe( borrado => {  
                this.totalRegistros = this.totalRegistros - 1;                                              
                if ( this.desde >= this.totalRegistros) {                
                  this.cambiarDesde(-5);
                }else {
                  this.cargarUsuarios();
                }
              });
        }

      }
    );

  }

}
