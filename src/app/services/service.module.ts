import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ModalUploadService } from '../components/modal-upload/modal-upload.service';
import { VerificaTokenGuard } from './guards/verifica-token.guard';

import { SettingService, 
          SharedService, 
          SidebarService,
          LoginGuardGuard,
          SubirArchivoService,
          UsuarioService,
          HospitalService,
          MedicoService,
          AdminGuard
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
    AdminGuard,
    LoginGuardGuard,
    ModalUploadService,
    HospitalService,
    MedicoService,
    VerificaTokenGuard
  ],
  declarations: []
})
export class ServiceModule { }
