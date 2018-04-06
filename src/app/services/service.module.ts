import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { SettingService, 
          SharedService, 
          SidebarService,
          LoginGuardGuard,
          SubirArchivoService,
          ModalUploadService,
          UsuarioService,
          HospitalService,
          MedicoService
        } from './service.index';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule
  ],
  providers: [
    SettingService, 
    SharedService, 
    SidebarService,
    UsuarioService,
    SubirArchivoService,
    LoginGuardGuard,
    ModalUploadService,
    HospitalService,
    MedicoService
  ],
  declarations: []
})
export class ServiceModule { }
