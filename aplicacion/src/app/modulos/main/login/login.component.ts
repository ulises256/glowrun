import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { BoletoService, OrdenService } from '../../../services';
import { TimerService, Time } from '../../../services/timer.service';
import { Orden, Boleto } from '../../../models';
import { Observable } from 'rxjs/Observable';
import * as moment from 'moment'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.pug',
  styleUrls: ['./login.component.styl'],
  providers:[TimerService]
})
export class LoginComponent implements OnInit {

    loginForm: FormGroup;
	registerForm: FormGroup;
	inicioIncorecto = false;
	registroIncorecto = false;
	orden: Orden;
	boleto: Boleto;
	time1$: Observable<Time>;
	constructor(private formBuilder: FormBuilder, private auth: AuthService ,private router: Router, private route: ActivatedRoute, private timerService: TimerService,private ordenService: OrdenService,) { }


	login(form: FormGroup) {
		if(form.controls.usuario.valid && form.controls.contra.valid){
			let usuario = {correo: form.controls.usuario.value, password: form.controls.contra.value}
			this.auth.iniciarSesion(usuario)
			.then(response => response? this.inicioIncorecto = false: this.inicioIncorecto = true)
			.then(response => response? null: this.auth.obtenerRedirect().subscribe(path => this.router.navigate([path])))
		}
	}

	registro(form: FormGroup){
		if (form.controls.correo.valid &&
			form.controls.contrasena.valid &&
			form.controls.repeatContra.valid &&
			(form.controls.contrasena.value == form.controls.repeatContra.value)) { 
			
			let usuario = {correo: form.controls.correo.value, password: form.controls.contrasena.value}
			this.auth.registrar(usuario)
			.then(response => response? this.registroIncorecto = false: this.registroIncorecto = true)
			.then(response => response? null: this.auth.obtenerRedirect().subscribe(path => this.router.navigate([path])))
		} 
	}

	ngOnInit() {
		this.loginForm = this.formBuilder.group({
            usuario: ['', Validators.required],
            contra: ['', Validators.required]
		});

		this.registerForm = this.formBuilder.group({
			correo: ['', Validators.required],
			contrasena: ['', Validators.required],
			repeatContra: ['', Validators.required]
		})

		this.route.params.subscribe(params => {
			console.log(params)
			params.token? this.auth.loginFacebook(params.token).then(res => {
				console.log(res)
				res != false ?
				this.router.navigate(['/user']) : this.router.navigate(['/'])
			}) : null;
		  });
		  
		this.auth.obtenerUsuario().subscribe(user => user && user.getId() ? this.router.navigate(['/']) : null);

		this.ordenService.obtenerOrdenPendiente().subscribe(orden => {
			this.orden = orden;
			BoletoService.obtenerBoleto(this.orden.$id_boleto)
				.then(r => r && r.data? this.boleto = new Boleto(r.data): null)
				.then(boleto => this.time1$ = this.timerService.timer(new Date(moment(boleto.$fechafin).format('MMMM DD, YYYY HH:mm:ss'))))

		}).closed;		

    }
}
