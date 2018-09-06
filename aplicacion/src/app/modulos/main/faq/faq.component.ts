import { Component, OnInit, ViewChildren, AfterViewInit } from '@angular/core';
import * as $ from 'jquery';
import { Estado, Carrera } from '../../../models';
import { EstadoService } from '../../../services';

@Component({
	selector: 'app-faq',
	templateUrl: './faq.component.pug',
	styleUrls: ['./faq.component.styl']
})
export class FaqComponent implements OnInit, AfterViewInit {
	estados: Estado[] =[]
	estado: Estado;
	carrerasEnElEstado: Carrera[] = [];
	@ViewChildren('someName') someDivs;
	paleta = [
		"#ff3377",
		"#f27019",
		"#90ff07",
		"#1cccf4"
	]
	constructor() { 
		EstadoService.obtenerEstados()
			.then(r => r && r.data ? this.estados = r.data.map(estado => new Estado(estado)): null)
			.then(estados => {
				estados.forEach(estado => {
					estado.$tiene_carrera == 'Si' ? $("#" + estado.$id).css({ fill:this.paleta[Math.floor(Math.random() * (3 - 0 + 1)) + 0]}) : null;
				})
			});
	}

	ngAfterViewInit() {

	}

	mostrarCarreras(id){

		this.estado =  this.estados.find(estado => estado.$id == id)

		if(this.estado.$tiene_carrera=="Si")
			EstadoService.obtenerCarrerasEnEsteEstado(id)
				.then(r => r && r.data ? this.carrerasEnElEstado = r.data.map(n=> new Carrera(n)): null)
	}

	ngOnInit() {

		$("path").hover(function() {
			$(this).css('cursor','pointer');
		}, function() {
			$(this).css('cursor','auto');
		});
		
		
		 $('path').on("click", event => {
			 console.log(event)
			 this.mostrarCarreras(+event.target.id);
		 })

	}

}
