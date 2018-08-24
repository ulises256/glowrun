import { Component,  OnInit, OnDestroy } from '@angular/core';
import { Usuario } from '../../../models/usuario.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'usuario',
  templateUrl: './usuario.component.pug',
  styleUrls: ['./usuario.component.styl']
})
export class UsuarioComponent implements OnInit, OnDestroy {
  usuarioForm: FormGroup;
  public editable = {disiabled: true, icon: 'edit', tooltip: 'Editar Datos'};
  usuario: Usuario;
  subscription: Subscription;

  constructor(private formBuilder: FormBuilder, private auth: AuthService) {
    this.subscription = this.auth.obtenerUsuario().subscribe(user => this.usuario = user);
  }

    editar(form: FormGroup) {
    this.editable.disiabled ?
                (Object.keys(form.controls).forEach(key => form.get(key).enable()), this.editable.icon = 'save', this.editable.tooltip = 'Guardar Datos')
                : 
                (Object.keys(form.controls).forEach(key => form.get(key).disable()), this.editable.icon = 'edit', this.editable.tooltip = 'Editar Datos', this.usuario.actualizarDatos())
    
    this.editable.disiabled = !this.editable.disiabled

  }

  ngOnInit() {
	this.usuarioForm = this.formBuilder.group({
		nombre: this.formBuilder.control({value:this.usuario.getNombre(), disabled: this.editable.disiabled},  Validators.required),
		apellido: this.formBuilder.control({value:this.usuario.getApellidos(), disabled: this.editable.disiabled},  Validators.required),
		correo: this.formBuilder.control({value:this.usuario.getCorreo(), disabled: this.editable.disiabled},  Validators.required),
		edad: this.formBuilder.control({value:this.usuario.getEdad(), disabled: this.editable.disiabled},  Validators.required),
		sexo: this.formBuilder.control({value:this.usuario.getSexo(), disabled: this.editable.disiabled},  Validators.required),
	});
  }

  ngOnDestroy() {
	this.subscription.unsubscribe();
  }
}
