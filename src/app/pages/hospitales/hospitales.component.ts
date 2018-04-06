import { Component, OnInit } from '@angular/core';
import { HospitalService, ModalUploadService } from '../../services/service.index';
import { Hospital } from '../../models/hospital.model';
import { CommonModule } from '@angular/common';

declare var swal: any;

@Component({
  selector: 'app-hospitales',
  templateUrl: './hospitales.component.html',
  styles: []
})
export class HospitalesComponent implements OnInit {

  public cargando: boolean = false;
  public hospitales: Hospital[] = [];
  public totalRegistros: number = 0;

  constructor( private _hospitalService: HospitalService,
               private _modalUploadService: ModalUploadService
            ) { }

  ngOnInit() {
    this.cargarHospitales();
    this._modalUploadService.notificacion
        .subscribe(
          resp => {
            this.cargarHospitales();
          }
        );
  }

  crearHospital( ) {
    
    swal({
      text: 'Ingrese el nombre del nuevo hospital.',
      content: 'input',
      buttons: true,      
    }).then(nombre => {
      if (!nombre) {        
        swal.close();
      } else {              
        this._hospitalService.crearHospital(nombre)
          .subscribe(
            resp => {            
              this.cargarHospitales();
              swal('Correcto', 'Hospital creado correctamente', 'success');
              swal.close();
            }
          );
      }

    });
  }

  cargarHospitales() {
    this.cargando = true;
    this._hospitalService.cargarHospitales()
        .subscribe(
          (resp: any) => {
            this.cargando = false;
            this.totalRegistros = resp.total;
            this.hospitales = resp.hospitales;
          }
        );
  }

  borrarHospital(hospital: Hospital) {
    swal({
      title: '¿Está seguro ?',
      text: `El usuario ${hospital.nombre} está a punto de ser borrado`,
      icon: 'warning',
      buttons: true,
      dangerMode: true
    }).then(
      borrar => {        
        if ( borrar ) {
          this._hospitalService.borrarHospital(hospital._id)
              .subscribe( borrado => {  
                this.totalRegistros = this.totalRegistros - 1;
                this.cargarHospitales();
              });
        }

      }
    );
  }

  guardarHospital(hospital: Hospital) {
    this._hospitalService.actualizarHospital(hospital)
        .subscribe( () => {
          this.cargarHospitales();
        });
  }

  buscarHospital( termino: string ) {
    if ( termino.length <= 0 ) {      
      this.cargarHospitales();
      return;
    }

    this.cargando = true;

    this._hospitalService.buscarHospital( termino )
        .subscribe( (hospitales: Hospital[]) => {
          this.hospitales = hospitales;
          this.cargando = false;
        });
  }

  mostrarModal(id: string) {
    this._modalUploadService.mostrarModal('hospitales', id);
  }

}
