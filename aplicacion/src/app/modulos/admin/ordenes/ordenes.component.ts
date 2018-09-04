import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, MatDialog } from '@angular/material';
import { Usuario } from '../../../models';
import { UsuarioService, OrdenService} from '../../../services';
import { DetallesUsuarioComponent } from '../fragments/detalles-usuario/detalles-usuario.component';
interface UsuarioInfoBasica {
	id: number,
	nombre: string,
	apellidos: string,
	correo: string
}


@Component({
	selector: 'app-ordenes',
	templateUrl: './ordenes.component.pug',
	styleUrls: ['./ordenes.component.styl']
})



export class OrdenesComponent implements OnInit {

	displayedColumns = [];
	dataSource: MatTableDataSource<UsuarioInfoBasica>;
	Usuarios: UsuarioInfoBasica[] = [];

	@ViewChild(MatPaginator) paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;


	columnNames = [
		{
			id: "id",
			value: "id"
		},
		{
			id: "nombre",
			value: "Nombre"
		},
		{
			id: "apellidos",
			value: "Apellidos"
		},
		{
			id: "correo",
			value: "Correo"
		},		
	];

	constructor(private dialog: MatDialog) {

		OrdenService.obtenerCargos({offset: 25, limit: 25}).then(r => console.log(r.data))
		this.displayedColumns = ['id', 'nombre', 'apellidos', 'correo']
		this.dataSource = new MatTableDataSource(this.Usuarios);
		UsuarioService.obtenerUsuarios()
			.then(r => r && r.data ? this.dataSource = new MatTableDataSource(r.data.map(u => {
				console.log(u)
				let usuario = new Usuario(u);
				let usuariobasico: UsuarioInfoBasica = {
					id: usuario.getId(),
					nombre: usuario.getNombre(),
					apellidos: usuario.getApellidos(),
					correo: usuario.getCorreo(),
				}
				return usuariobasico;
			})) : null)
	}

	ver(id) {
		const dialogRef = this.dialog.open(DetallesUsuarioComponent, {
			width: '90%',
			height: '90%',
			data: id
		});

		dialogRef.afterClosed().subscribe(result => {
		});
	}

	applyFilter(filterValue: string) {
		this.dataSource.filter = filterValue.trim().toLowerCase();
	
		if (this.dataSource.paginator) {
		  this.dataSource.paginator.firstPage();
		}
	  }	

	ngOnInit() {
		this.dataSource.paginator = this.paginator;
		this.dataSource.sort = this.sort;		
	}

}
