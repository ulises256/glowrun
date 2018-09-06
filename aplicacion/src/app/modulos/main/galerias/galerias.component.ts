import { Component, OnInit } from '@angular/core';
import { Carrera } from '../../../models';
import { CarreraService } from '../../../services';

@Component({
	selector: 'app-galerias',
	templateUrl: './galerias.component.pug',
	styleUrls: ['./galerias.component.styl']
})
export class GaleriasComponent implements OnInit {
	'scrollbar-hidden': boolean;
	carreras: Carrera[] = [];

	constructor() { }

	ngOnInit() {
		CarreraService.obtenerGalerias()
			.then(r => r && r.data ? this.carreras = r.data.map(n => new Carrera(n)) : null);
	}

}

