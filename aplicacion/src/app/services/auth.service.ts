import { Injectable } from '@angular/core'
import { APILOCAL } from '../../environments/environment'
import * as axios from 'axios'
import { BehaviorSubject } from 'rxjs';
import { Usuario } from '../models/usuario.model';
import { Router } from '@angular/router';

@Injectable()

export class AuthService {
    private apiUrl: string = APILOCAL.url;
    private usuarioSubject = new BehaviorSubject<Usuario>(null);
    private isLoginSubject = new BehaviorSubject<boolean>(this.hasToken());
    private isLoginObserver = this.isLoginSubject.asObservable();

    private redirecionarA = new BehaviorSubject<string>('/');

    constructor(private router: Router) {
        console.log('Auth contructor')
        localStorage.getItem("token") != null ? this.validarToken(localStorage.getItem("token"), true) : null;
        console.log(this.usuarioSubject.getValue());
        console.log(this.isLoginSubject.getValue());
    }

    iniciarSesion(usuario) {
        return axios.default.post(this.apiUrl + '/data/login', usuario)
            .then(response => this.validarToken(response.data.token, response.data.success))
    }

    registrar(usuario) {
        return axios.default.post(this.apiUrl + '/data/registro', usuario)
            .then(response => this.validarToken(response.data.token, response.data.success))
    }

    loginFacebook(token) {
        return this.validarToken(token);
    }

    salir() {
        this.destuirUsuario();
        this.obtenerRedirect().subscribe(path => this.router.navigate([path]))
    }

    usuarioLogeado() {
        this.isLoginSubject.next(this.hasToken())
        return this.isLoginObserver;
    }

    esAdmin() {
        return this.usuarioSubject.asObservable()
            .first()
            .map(user => {
                console.log(user)
                if (user && user.getTipo() === "admin") {
                    return true
                }
                return false;
            })
    }

    obtenerUsuario() {
        return this.usuarioSubject;
    }    

    obtenerRedirect() {
        return this.redirecionarA.asObservable();
    }

    modificarRedirect(redirect: string) {
        this.redirecionarA.next(redirect);
    }

    private hasToken(): boolean {
        return localStorage.getItem('token') != null ? true : false;
    }

    private validarToken(token, succes?) {
        return axios.default.get(this.apiUrl + '/data/token/' + token)
            .then(response => {
                if (response.data.user) {
                    this.crearUsuario(response.data.user, token)
                    return true;
                }
                return false
            })
    }

    private crearUsuario(usuarioResponse, tokenValido) {
        localStorage.setItem("token", tokenValido);
        this.usuarioSubject.next(
            new Usuario(usuarioResponse,
                usuarioResponse.avatar ? usuarioResponse.avatar.fb_avatar : null)
        );
    }

    private destuirUsuario() {
        this.usuarioSubject.next(null)
        localStorage.removeItem("token")
    }


}
