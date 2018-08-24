import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Carrera } from '../../../../models';

@Component({
	selector: 'app-anadirCarrera',
	templateUrl: './anadirCarrera.component.pug',
	styleUrls: ['./anadirCarrera.component.styl']
})
export class AnadirCarreraComponent implements OnInit {
	public form: FormGroup;
	fechaactual = new Date();
	constructor(
		public dialogRef: MatDialogRef<AnadirCarreraComponent>,
		private formBuilder: FormBuilder,
		@Inject(MAT_DIALOG_DATA) public data: Carrera) { }

	cancelar() {
		this.dialogRef.close()
	}

	submit(form: FormGroup) {
		if(form.controls.nombre.valid && 
			form.controls.descripcion.valid &&
			form.controls.fecha.valid
		){
			this.data.$fechaini = form.controls.fecha.value;
			this.data.$nombre = form.controls.nombre.value;
			this.data.$description = form.controls.descripcion.value;
			this.dialogRef.close(this.data);
		}
	}

	ngOnInit() {
		this.form = this.formBuilder.group({
			nombre: [this.data.$nombre, Validators.required],
			descripcion: [this.data.$description, Validators.required],
			fecha: [this.data.$fechaini, Validators.required],
		});
    }

}
