
import { Injectable } from '@angular/core'
import { APILOCAL } from '../../environments/environment'
import * as axios from 'axios'

@Injectable()

export class OrdenService {
    private static apiUrl: string = APILOCAL.url;

    public static obtenerOrden(idOrden) {
        return axios.default.get(this.apiUrl + '/data/orden/' + idOrden);
    }

    public static obtenerOrdenes() {
        return axios.default.get(this.apiUrl + '/data/orden/');
    }

    public static crearOrden(orden) {
        return axios.default.post(this.apiUrl + '/data/orden/', orden);
    }

    public static actualizarOrden(orden) {
        return axios.default.put(this.apiUrl + '/data/orden/' + orden.id, orden);
    }

    public static eliminarOrden(idOrden) {
        return axios.default.delete(this.apiUrl + '/data/orden/' + idOrden);
    }

    public static obtenerUsuario(idOrden) {
        return axios.default.get(this.apiUrl + '/data/orden/usuario/' + idOrden);
    }    
}
    