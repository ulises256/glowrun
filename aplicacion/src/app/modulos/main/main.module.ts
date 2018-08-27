import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule,  ReactiveFormsModule } from '@angular/forms';
import { AgmCoreModule } from '@agm/core';
import { AgmSnazzyInfoWindowModule } from '@agm/snazzy-info-window';
import { SlickModule } from 'ngx-slick';
import { LoadingModule, ANIMATION_TYPES } from 'ngx-loading';

import { MaterialModule } from '../../extras/material.module';
import { ExtrasModule } from '../../extras/extras.module';


import { MainComponent } from './main.component';
import { MainRoutingModule } from './main-routing.module';

import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { UsuarioComponent } from './usuario/usuario.component';
import { CarrerasComponent } from './carreras/carreras.component';
import { ContactoComponent } from './contacto/contacto.component';
import { FaqComponent } from './faq/faq.component';
import { GaleriasComponent } from './galerias/galerias.component';
import { CarreraComponent } from './carreras/carrera/carrera.component';
import { PagoComponent } from './pago/pago.component';
import { ExplicacionComponent } from './partials/explicacion/explicacion.component';
import { BoletoComponent } from './boleto/boleto.component';



@NgModule({
	imports: [
	CommonModule,
	BrowserAnimationsModule,
	MainRoutingModule,
	FormsModule,  ReactiveFormsModule,
	MaterialModule,
	SlickModule.forRoot(),
	AgmCoreModule,
	  AgmSnazzyInfoWindowModule,
	LoadingModule,
	ExtrasModule,
	],
	declarations: [
		MainComponent,
		HomeComponent,
		LoginComponent,
		UsuarioComponent,
		CarrerasComponent,
		CarreraComponent,
		ContactoComponent,
		FaqComponent,
		GaleriasComponent,
		PagoComponent,
		ExplicacionComponent,
		BoletoComponent
	],
	entryComponents: [
		LoginComponent
	]
})
export class MainModule { }
