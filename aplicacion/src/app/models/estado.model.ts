import { Municipio } from "./municipios.model";
import { EstadoService } from "../services";

export class Estado {
    private id: number;
    private estado: string;
    private municipios: Municipio[];


	constructor(arg, bandera?) {
		this.id = arg.id;
		this.estado = arg.estado;
		// !(bandera) ?
		// (
		// 	EstadoService.obtenerMunicipios(this.id)
		// 	.then(res => res && res.data ? this.municipios = res.data.map(n => new Municipio(n)): null)
		// ): null;
	}

	public get $id(): number {
		return this.id;
	}

	public get $estado(): string {
		return this.estado;
	}

	public getMunicipios() {
			return EstadoService.obtenerMunicipios(this.id)
			.then(res => res && res.data ? this.municipios = res.data.map(n => new Municipio(n)): [])
			.then(m => m)
	}

	public set $id(value: number) {
		this.id = value;
	}

	public set $estado(value: string) {
		this.estado = value;
	}

	public setMunicipios(value: Municipio) {
		console.log(value)
	}
}