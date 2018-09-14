import { Component, OnInit, Input, AfterViewInit } from '@angular/core'

@Component({
    selector: 'manchas',
    templateUrl: './mancha.component.pug',
    styleUrls: ['./mancha.component.styl']
})

export class ManchaComponent implements OnInit, AfterViewInit{

    @Input() ancho: number;
    @Input() alto: number;
    @Input() color: string = '#1cccf4';

    constructor() {}

    ngAfterViewInit(): void {
        
    }
    ngOnInit(): void {

    }


}