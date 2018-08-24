import { OPENPAYKEYS } from "../../environments/environment";
import { ElementRef } from "@angular/core";
import { OrdenService } from "../services";

export class OpenPayModel {
    private MERCHANT_ID: string = OPENPAYKEYS.MERCHANT_ID;
    private PUBLIC_API_KEY: string = OPENPAYKEYS.PUBLIC_API_KEY;
	private produccion: boolean;
	private form: ElementRef;

	private tarjeta: Tarjeta = {id: null, aNombreDe: null, marca: null};

    constructor(form: ElementRef, produccion: boolean = true) {
		this.produccion = produccion
		this.form = form;
    }

    crearToken(obj?: Costumer) {
		OpenPay.setId(this.MERCHANT_ID);
        ​OpenPay.setApiKey(this.PUBLIC_API_KEY);
		OpenPay.setSandboxMode(this.produccion);
		OpenPay.token.create(obj, this.SuccessCallback, this.ErrorCallback);

			// function SuccessCallback(response) {
			// 	alert('Operación exitosa');
			// 	// var content = '', results = document.getElementById('resultDetail');
			// 	// content .= 'Id tarjeta: ' + response.data.id+ '<br />';
			// 	// content .= 'A nombre de: ' + response.data.holder_name + '<br />';
			// 	// content .= 'Marca de tarjeta usada: ' + response.data.brand + '<br />';
			// 	// results.innerHTML = content;
			// 	console.log(response)
			// }
	}

	validarCarNumber(cardNumber: string) {
		return OpenPay.card.validateCardNumber(cardNumber);
	}

	validarCVC(cvc: string, cardNumber?: string) {
		return cardNumber ? OpenPay.card.validateCVC(cvc) : OpenPay.card.validateCVC(cvc, cardNumber);
	}

	validarEspiriacion(mes: string, anio: string) {
		return OpenPay.card.validateExpiry(mes, mes);
	}

	tipoCard(cardNumber: string) {
		return OpenPay.card.cardType(cardNumber);
	}

	private SuccessCallback(response) {
		alert('Operación exitosa');
		var deviceSessionId = OpenPay.deviceData.setup("payment-form", "divice_id_token");
		console.log(deviceSessionId)
		console.log(response)

		let datosNecesarios = {
			idTarjeta: response.data.id,
			deviceSessionId : deviceSessionId,
			holder_name: response.data.card.holder_name,
			brand: response.data.card.brand
		}

		console.log(datosNecesarios)

		OrdenService.crearOrden(datosNecesarios)
			.then(r => r && r.data ? console.log(r.data) : null)
	}

	private ErrorCallback(response) {
		alert('Operación exitosa');
		console.log(response)
	}	
}

export interface Costumer {
	"card_number": string,
	"holder_name": string,
	"expiration_year": string,
	"expiration_month": string,
	"cvv2": string,
    "address"?:{
       "city": string,
       "line3": string,
       "postal_code": number,
       "line1": string,
       "line2": string,
       "state": string,
	   "country_code": string
	}
}

export interface Tarjeta {
	id: string,
	aNombreDe: string,
	marca: string
}