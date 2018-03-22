import { Pipe, PipeTransform } from '@angular/core';
import { URL_SERVICIOS } from '../config/config';

@Pipe({
  name: 'imagen'
})
export class ImagenPipe implements PipeTransform {

  transform(imagen: string, tipo: string = 'usuario'): any {
    let url = URL_SERVICIOS + '/img';

    // Si no hay nada, devolvemos una imagen por defecto
    if ( !imagen ) {
      return url + '/usuarios/xxx';
    }

    // Preguntamos si es una imagen de Google.
    if ( imagen.indexOf('https') >= 0 ) {
      return imagen;
    }

    switch ( tipo ) {
      case 'usuario':
        url = url + '/usuarios/' + imagen;
        break;
      case 'medico':
        url = url + '/medicos/' + imagen;
        break;
      case 'hospital':
        url = url + '/hospitales/' + imagen;
        break;        
      default: 
        console.log('Tipo de imagen no existe, usuarios, medicos, hospitales');
        url += '/usuarios/xxx';
    }

    return url;
  }

}
