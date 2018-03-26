import { Injectable } from '@angular/core';
import { URL_SERVICIOS } from '../../config/config';

@Injectable()
export class SubirArchivoService {

  constructor() { }

  subirArchivo( archivo: File, tipo: string, id: string ) {
    
    return new Promise(( resolve, reject) => {
      let formData = new FormData();
      let xhr = new XMLHttpRequest();
      
      formData.append('imagen', archivo, archivo.name);
      xhr.onreadystatechange = function() {
        // Esperamos a que termine el proceso
        if (xhr.readyState === 4) {
          // Preguntamos si se subio el archivo
           if (xhr.status === 200)  {
             console.log('Imagen subida');
             resolve( JSON.parse(xhr.response) );
             // Si fallo la subida de la imagen
           } else {
             console.log('Falló la subida');
             reject(xhr.response);
           }
        }
      };

      // Declaramos la url a la que haremos la peticion
      let url = URL_SERVICIOS + '/upload/' + tipo + '/' + id;
      // Realizamos la peticion que lleva los parametros:
      // Method, URL, Async
      xhr.open('PUT', url, true);
      // Enviamos la respuesta
      xhr.send( formData );
    });
    
  }

}
