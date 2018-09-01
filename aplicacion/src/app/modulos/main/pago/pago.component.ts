import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { OpenPayModel, Costumer } from '../../../models/openpay.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';;
import { OrdenService, AuthService } from '../../../services';
import { Orden, Usuario } from '../../../models';
import { MatDialog } from '@angular/material';
import { LoadingComponent } from '../../../extras/loading/loading.component';

@Component({
	selector: 'app-pago',
	templateUrl: './pago.component.pug',
	styleUrls: ['./pago.component.styl']
})
export class PagoComponent implements OnInit {

	tarjetaForm: FormGroup;
	@ViewChild('form') fomrTarjeta: ElementRef;
	private openpay: OpenPayModel;
	iconsCards = []
	iconsDebit = []
	orden: Orden;
	usuario: Usuario;
	sub: any;

	status = null;
	constructor(
		private formBuilder: FormBuilder,
		private ordenService: OrdenService,
		private auth: AuthService,
		private dialog: MatDialog) {
		this.iconsCards.push('assets/images/Amex.svg')
		this.iconsCards.push('assets/images/Visa.svg')
		this.iconsCards.push('assets/images/Mastercard.svg')

		this.iconsDebit.push('assets/images/bbva-bancomer.svg')
		this.iconsDebit.push('assets/images/Banco_santander_logo.svg')
		this.iconsDebit.push('assets/images/HSBC.svg')
		this.iconsDebit.push('assets/images/Logo_Scotiabank.svg')
		this.iconsDebit.push('assets/images/inbursa.svg')
		this.iconsDebit.push('assets/images/Ixe_Banco.ai')
	}

	cobrar(form: FormGroup) {

		console.log(this.orden)
		if (form.valid) {
			let costumer: Costumer = {
				'holder_name': form.controls.nombre.value,
				'card_number': form.controls.tarjeta.value,
				'expiration_month': form.controls.mes.value,
				'expiration_year': form.controls.ano.value,
				'cvv2': form.controls.codigo.value
			}
			this.openpay.crearToken(costumer, this.orden, this.usuario);

			this.openpay.obtenerStatus().subscribe(status => {
				console.log(status);
				this.status = status
				this.cargar();
			})

		}
	}

	cargar() {
		this.status==0? this.dialog.open(LoadingComponent) : null;
		this.status==1? this.dialog.closeAll() : null;
		if(typeof(this.status) == "string") {
			this.dialog.closeAll()
			alert(this.status)
		}

	}

	tarteja_mensajes_errores = {
		'nombre': [
			{ type: 'required', message: 'Es campo es requerido' },
		],
		'tarjeta': [
			{ type: 'required', message: 'Es campo es requerido' },
			{ type: 'pattern', message: 'Solo debe contener numeros' },
		],
		'mes': [
			{ type: 'required', message: 'Es campo es requerido' },
			{ type: 'minlength', message: 'Son 2 digitos como minimo' },
			{ type: 'maxlength', message: 'Son 2 digitos como maximo' },
			{ type: 'pattern', message: 'Solo debe contener numeros' },
		],
		'ano': [
			{ type: 'required', message: 'Es campo es requerido' },
			{ type: 'minlength', message: 'Son 2 digitos como minimo' },
			{ type: 'maxlength', message: 'Son 2 digitos como maximo' },
			{ type: 'pattern', message: 'Solo debe contener numeros' },
		],
		'codigo': [
			{ type: 'required', message: 'Es campo es requerido' },
			{ type: 'minlength', message: 'Son 3 digitos como minimo' },
			{ type: 'maxlength', message: 'Son de 3 a 4 digitos como maximo' },
			{ type: 'pattern', message: 'Solo debe contener numeros' },
		]
	}

	ngOnInit() {

		this.openpay = new OpenPayModel(this.fomrTarjeta);

		this.ordenService.obtenerOrdenPendiente().subscribe(orden => {
			this.orden = orden;
		}).closed;
		console.log(this.orden)

		this.auth.obtenerUsuario().subscribe(usuario => {
			this.usuario = usuario;
		})

		this.tarjetaForm = this.formBuilder.group({
			nombre: ['Luis Malaga',
					Validators.compose([Validators.required])],
			tarjeta: [
					'4111111111111111',
					Validators.compose([Validators.required,
					Validators.pattern(/^-?(0|[1-9]\d*)?$/)])],
			mes: [
				'12',
				Validators.compose([
					Validators.required,
					Validators.minLength(2),
					Validators.maxLength(2),
					Validators.pattern(/^-?(0|[1-9]\d*)?$/)])],
			ano: [
				'20',
				Validators.compose([
					Validators.required,
					Validators.minLength(2),
					Validators.maxLength(2),
					Validators.pattern(/^-?(0|[1-9]\d*)?$/)])],
			codigo: [
				'110',
				Validators.compose([
					Validators.required,
					Validators.minLength(3),
					Validators.maxLength(4),
					Validators.pattern(/^-?(0|[1-9]\d*)?$/)])]
		});

	}

}
