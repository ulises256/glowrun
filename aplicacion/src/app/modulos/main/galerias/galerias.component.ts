import { Component, OnInit, AfterViewInit, ViewChild,ViewChildren, ElementRef} from '@angular/core';
import { Carrera } from '../../../models';
import { CarreraService } from '../../../services';
import * as $ from 'jquery';

@Component({
	selector: 'app-galerias',
	templateUrl: './galerias.component.pug',
	styleUrls: ['./galerias.component.styl']
})
export class GaleriasComponent implements OnInit, AfterViewInit{
	'scrollbar-hidden': boolean;
	carreras: Carrera[] = [];
	@ViewChildren('linea') linea: ElementRef;

	paleta = [
		"#ff3377",
		"#ef6100",
		"#00c900",
		"#1cccf4"
	]

	constructor() { }

	ngAfterViewInit() {
		// console.log(this.linea)
		// var linea = $(this.linea)
		// setInterval(() => {
		// 	linea.animate({backgroundColor: this.paleta[Math.floor(Math.random() * (3 - 0 + 1)) + 0]});
		// 	console.log('cambiando de color')
		// 	console.log(linea)
		// }, 1000);
	}

	ngOnInit() {
		CarreraService.obtenerGalerias()
			.then(r => r && r.data ? this.carreras = r.data.map(n => new Carrera(n)) : null);
	}

}
