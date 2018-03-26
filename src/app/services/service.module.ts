import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';  

 import { SettingService, 
          SharedService, 
          SidebarService,
          UsuarioService,
          LoginGuardGuard,
          SubirArchivoService,
          ModalUploadService
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
    ModalUploadService
  ],
  declarations: []
})
export class ServiceModule { }
