import { Component, OnInit, Input, AfterViewInit } from '@angular/core'
import * as _ from 'lodash';
@Component({
    selector: 'manchas',
    templateUrl: './mancha.component.pug',
    styleUrls: ['./mancha.component.styl']
})

export class ManchaComponent implements OnInit, AfterViewInit{

    @Input() ancho: number;
    @Input() alto: number;
    @Input() color: string = '#1cccf4';
    top: number = 0;
    left: number = 0;
    width: number = 84;

    constructor() {    }
    

    calcularRango(){

        var valores = [[0,20], [80, 100]]
        console.log(valores)
        var decision = Math.floor(Math.random()  * (1 - 0)) + 0;
        console.log(decision)
        console.log(valores[decision])
        var widt = _.random(valores[decision][0], valores[decision][1]);
        var decision2 = Math.floor(Math.random()  * (1 - 0)) + 0;
        var height = _.random(valores[decision2][0], valores[decision2][1]);

        console.log(widt)
        console.log(height)

    }

    ngAfterViewInit(): void {
        this.top = this.ramdomizarEntreRangos(1, this.alto)
        this.left = this.ramdomizarEntreRangos(1, this.ancho)
        this.width = this.ramdomizarEntreRangos(84, (this.ancho - (this.ancho * 0.3)));
    }

    ramdomizarEntreRangos(minimo: number, maximo: number) {
        return Math.floor(Math.random() * (maximo - minimo + 1)) + minimo;
    }

    ngOnInit(): void {
        this.calcularRango()
    }


}
