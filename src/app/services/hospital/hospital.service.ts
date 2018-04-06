import { Injectable } from '@angular/core';
import { URL_SERVICIOS } from '../../config/config';
import { Hospital } from '../../models/hospital.model';

import { HttpClient } from '@angular/common/http';
import 'rxjs/add/Operator/map';
import { Router } from '@angular/router';

import { UsuarioService } from '../usuario/usuario.service';

@Injectable()
export class HospitalService {

  token: string;

  constructor( public _http: HttpClient, public _usuarioService: UsuarioService ) {
      this.token = this._usuarioService.token;
   }

  cargarHospitales() {

    let url = URL_SERVICIOS + '/hospital';
    return this._http.get(url);

  }

  obtenerHospital( id: string ) {
    let url = URL_SERVICIOS + '/hospital/' + id;
    return this._http.get(url)
              .map( (resp: any) => resp.hospital );
  }

  borrarHospital( id: string ) {
    let url = URL_SERVICIOS + '/hospital/' + id + '?token=' + this.token;
    return this._http.delete(url);
  }

  crearHospital( nombre: string ) {
    let url = URL_SERVICIOS + '/hospital?token=' + this.token;    
    return this._http.post(url, {nombre: nombre})
              .map( (resp: any) => resp.hospital );
  }

  buscarHospital( termino: string ) {
    let url = URL_SERVICIOS + '/busqueda/coleccion/hospitales/' + termino;
    return this._http.get(url)
              .map((resp: any) => resp.hospitales);
  }

  actualizarHospital( hospital: Hospital ) {
    let url = URL_SERVICIOS + '/hospital/' + hospital._id + '?token=' + this.token;
    return this._http.put(url, hospital)
              .map((resp: any) => resp.hospital);
  }


}
