import { Usuario } from "./usuario.model";
import { OrdenService } from "../services";

export class Orden {
    private id: number;
    private nombre: string;
    private id_usuario: number;
	private id_boleto: number;
	private fechaCompra: Date;

	constructor(arg) {
		this.id = arg.id;
		this.nombre = arg.nombre;
		this.id_usuario = arg.id_usuario;
		this.id_boleto = arg.id_boleto;
		this.fechaCompra = arg.fechaCompra;		
    }

	public get $id(): number {
		return this.id;
	}

	public get $nombre(): string {
		return this.nombre;
	}

	public get $id_usuario(): number {
		return this.id_usuario;
	}

	public get $id_boleto(): number {
		return this.id_boleto;
	}
	
	public get $fechaCompra(): Date {
		return this.fechaCompra;
    }
	
	public set $id(value: number) {
		this.id = value;
	}

	public set $nombre(value: string) {
		this.nombre = value;
	}

	public set $id_usuario(value: number) {
		this.id_usuario = value;
	}

	public set $id_boleto(value: number) {
		this.id_boleto = value;
	}

	public set $fechaCompra(value: Date) {
		this.fechaCompra = value;
	}
}