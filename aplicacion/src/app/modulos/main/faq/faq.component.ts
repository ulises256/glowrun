import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { Estado } from '../../../models';
import { EstadoService } from '../../../services';

@Component({
	selector: 'app-faq',
	templateUrl: './faq.component.pug',
	styleUrls: ['./faq.component.styl']
})
export class FaqComponent implements OnInit {
	estados: Estado[] =[]
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

	ngOnInit() {
		$('path').mouseover(function() {
			console.log(this.id);
		 });
	}

}
