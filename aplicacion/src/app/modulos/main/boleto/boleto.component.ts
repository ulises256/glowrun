import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { CarreraService, AuthService, OrdenService } from '../../../services';
import { Carrera, Boleto, Usuario, Orden } from '../../../models';
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
export class BoletoComponent implements OnInit, OnDestroy {

	carrera: Carrera

	boletos: Boleto [];
	actual: Boleto = undefined;
	proximo: Boleto = undefined;
	time1$: Observable<Time>;
	precioCompra: number = 0;
	cantidadBoletos: number = 1;
	usuario: Usuario;
	sub: any;

	constructor(private auth: AuthService,private route: ActivatedRoute, private router:Router, public location: Location, private timerService: TimerService, private ordenService: OrdenService) { }

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

				this.sub = this.auth.obtenerUsuario().subscribe(user => {
					this.auth.modificarRedirect('/comprar/' + params['id'])
					user ? this.usuario = user : this.router.navigate(['/login'])
				}).closed;				
		}).closed;
	}

	ngOnDestroy(){
	}

	cambiarPrecio(cantidad) {
		console.log(cantidad.target.value)
		this.precioCompra = this.actual.$precioini * cantidad.target.value;
		this.cantidadBoletos = cantidad.target.value;
	}

	irComprar(){
		let orden = {
			 nombre: this.carrera.$nombre,
			 id_usuario: this.usuario.getId(),
			 id_boleto: this.actual.$id,
			 monto: this.precioCompra,
			 cantidad: this.cantidadBoletos,
			 descuento: 0,
		}

		OrdenService.crearOrden(orden)
			.then(res => res && res.data ?  this.ordenService.modificarOrdenPendiente(new Orden(res.data)) : console.log('ni pedo'))
			.then(algo => this.router.navigate(['/pago']))
	}

	private irse(){
		this.router.navigate(['/'])
	}
}
