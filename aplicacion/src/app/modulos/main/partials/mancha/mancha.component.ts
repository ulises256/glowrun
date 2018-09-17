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
    @Input() set color(value: string){
        console.log(value);
        this.colorsito = value

    };

    colorsito: any;
    top: any= '0%';
    left: any = '0%';
    width: number = 84;

    constructor() {    }
    

    calcularRango(){

        var valores = [[-15,20], [70, 80]]
        var decision = _.random(0, 1);
        var widt = _.random(valores[decision][0], valores[decision][1]);
        var decision2 =  _.random(0, 1);
        var height = _.random(valores[decision2][0], valores[decision2][1]);

        this.top = height + '%';
        this.left = widt + '%';
        this.width = this.ramdomizarEntreRangos(84, (this.ancho - (this.ancho * 0.3)));
    }

    ngAfterViewInit(): void {
        // this.top = this.ramdomizarEntreRangos(1, this.alto)
        // this.left = this.ramdomizarEntreRangos(1, this.ancho)
        
    }

    ramdomizarEntreRangos(minimo: number, maximo: number) {
        return Math.floor(Math.random() * (maximo - minimo + 1)) + minimo;
    }

    ngOnInit(): void {
        this.calcularRango()
    }


}
