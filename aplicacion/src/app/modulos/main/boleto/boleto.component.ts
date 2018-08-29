import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { CarreraService } from '../../../services';
import { Carrera, Boleto } from '../../../models';
import { Observable } from 'rxjs';
import { Time, TimerService } from '../../../services/timer.service';
import * as moment from 'moment'
import { providers } from 'ng2-dnd';

@Component({
	selector: 'app-boleto',
	templateUrl: './boleto.component.pug',
	styleUrls: ['./boleto.component.styl'],
	providers: [TimerService]
})
export class BoletoComponent implements OnInit {

	carrera: Carrera

	boletos: Boleto [];

	actual: Boleto = undefined;
	proximo: Boleto = undefined;
	time1$: Observable<Time>;
	precioCompra: number = 0;
	cantidadBoletos: number = 1;

	constructor(private route: ActivatedRoute, private router:Router, public location: Location, private timerService: TimerService) { }

	ngOnInit() {
		this.route.params.subscribe(params => {
			console.log(params)
			CarreraService.obtenerCarrera(+params['id'])
				.then(r => r && r.data ? this.carrera = new Carrera(r.data, 'bandera') : null)
				.then(c => c.getBoletos().then(boletitos => this.boletos = boletitos))
				.then(b => {
					this.actual = this.boletos.find(n => n.getActivo() == true);
					this.precioCompra =  this.actual.$preciofin;
					this.proximo = this.boletos.find(n => n.$fechaini> this.actual.$fechafin);
				})
				.then(a => this.time1$ = this.timerService.timer(new Date(moment(this.actual.$fechafin).format('MMMM DD, YYYY HH:mm:ss'))))
				.then(c => this.location.replaceState('comprar/' + this.carrera.$nombre))
				// .catch(erro => this.irse());
		})
	}

	cambiarPrecio(cantidad) {
		console.log(cantidad)
		this.precioCompra = this.actual.$precioini * cantidad.target.value;
		this.cantidadBoletos = cantidad;
	}

	irComprar(){
		let datos = {
			cantidad: this.cantidadBoletos,
			total: this.precioCompra			
		}
		this.router.navigate(['comprar', datos, 'pago'])
	}

	private irse(){
		this.router.navigate(['/'])
	}
}
