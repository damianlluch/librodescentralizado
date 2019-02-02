var abi = [
	{
		"constant": false,
		"inputs": [
			{
				"name": "mensaje",
				"type": "string"
			}
		],
		"name": "escribirMensaje",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "contadorMensajes",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "creador",
		"outputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"name": "mensajes",
		"outputs": [
			{
				"name": "emisor",
				"type": "address"
			},
			{
				"name": "mensaje",
				"type": "string"
			},
			{
				"name": "fechaPublicacion",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	}
]
var addressContrato = "0xd3c1f4735c853c1a1ccb2eb6b6311be72af46bd7"; // acá tu la dirección (address) del contrato.
var contrato = web3.eth.contract(abi);
var funciones = contrato.at(addressContrato);
var contadorMensajes = 0;

function escribirMensaje(){
 
	var mensaje = $("input[name=mensaje").val(); // obtengo el valor del input
	if(mensaje.length > 0){
 
		funciones.escribirMensaje(mensaje, function(error, respuesta){ // intento escribir el mensaje. Se o Metamask pidiendo firmar la transacción...
 
			if(error)	throw error; // error, no se firmó la transacción
			alert("Mensaje enviado!!"); //...
 
		})
 
	}
 
}

function leerMensajes(){ // función para leer los mensajes del contrato
 
	jQuery("div#contenido").html(''); // limpiamos el div#contenido con los mensajes antes de volver a cargarlos
	funciones.contadorMensajes(function(error, respuesta){ // llamo la variable pública contadorMensajes del contrato...
 
		if(error)	throw error;
		contadorMensajes = respuesta.c[0]; // guardo el número de mensajes publicados
 
	})
	for(var i = 0; i < contadorMensajes; i++){ // recorro de 0 hasta contadorMensajes
		funciones.mensajes(i, function(error, respuesta){ // cargo los mensajes desde 0 a contadorMensajes
 
			if(error)	throw error;
			/* respuesta es un array con la estructura Mensaje de Solidity:
			índice 0: emisor;
			índice 1: mensaje;
			índice 2: fechaPublicacion;
			*/
			var emisor = respuesta[0];
			var mensaje = respuesta[1].replace("<", ""); // evitamos XSS
			mensaje = mensaje.replace(">", ""); // evitamos XSS
			var fechaPublicacion = respuesta[2];
 
			jQuery("<b>Emisor</b>: "+emisor+"<br /><b>Mensaje</b>: "+mensaje+"<br /><b>Fecha</b>: "+ts2date(fechaPublicacion)+"<hr/>").appendTo("#contenido") // cargo la estructura del mensaje en el div #contenido...
 
 
		})
	}
}

function ts2date(ts){ // función que convierte timestamp a fecha.
 
	var a = new Date(ts * 1000);
	var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
	var year = a.getFullYear();
	var month = months[a.getMonth()];
	var date = a.getDate();
	var hour = a.getHours();
	var min = a.getMinutes();
	var sec = a.getSeconds();
	var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
	return time;
 
}

window.setInterval("leerMensajes()", 2000); // busca nuevos mensajes cada 2 segundos...
