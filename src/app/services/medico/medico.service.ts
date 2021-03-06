import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from '../../config/config';
import { UsuarioService } from '../usuario/usuario.service';
import { Medico } from '../../models/medico.model';

@Injectable()
export class MedicoService {

  totalMedicos: number = 0;
  
  constructor( public _http: HttpClient,
               public _usuarioService: UsuarioService
            ) { }
            

  guardarMedico(medico: Medico) {
    let url = URL_SERVICIOS + '/medico';

    if (medico._id) {
      // Actualizando
      url += '/' + medico._id;
      url += '?token=' + this._usuarioService.token;
  
      return this._http.put(url, medico)
          .map( (resp: any) => {
            swal('Médico Actualizado', medico.nombre , 'success');
            return resp.medico;
          });

    } else {
      // Creando
      url += '?token=' + this._usuarioService.token;
  
      return this._http.post(url, medico)
          .map( (resp: any) => {
            swal('Médico Creado', medico.nombre , 'success');
            return resp.medico;
          });
    }

  }

  cargarMedicos() {
    let url = URL_SERVICIOS + '/medico';
    return this._http.get(url)
               .map( (resp: any) => {
                 this.totalMedicos = resp.total;
                 return resp.medicos;
               });
  }

  cargarMedico( id: string ) {
    let url = URL_SERVICIOS + '/medico/' + id;
    return this._http.get(url)
               .map( (resp: any) => resp.medico );
  }

  buscarMedicos( termino: string ) {
    let url = URL_SERVICIOS + '/busqueda/coleccion/medicos/' + termino;
    return this._http.get( url )
               .map( (resp: any) => resp.usuarios );
  }

  borrarMedico(id: string) {
    let url = URL_SERVICIOS + '/medico/' + id;
    url += '?token=' + this._usuarioService.token;

    return this._http.delete( url )
               .map( (resp: any) => {
                 swal('Médico Borrado', 'Medico ' + resp.medico.nombre + ' borrado correctamente', 'success');
                  return resp;
               });
  }

}
