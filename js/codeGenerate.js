function makeCodes(hash) {
	
	var numbers = hash.replace(/[^\d]+/g,'');
	var key = hash.replace(/[\d]+/g,'').toUpperCase();
	var newNumeros = new Array();

	var numerosGerados = getCode(hash, key, numbers);

	if (numerosGerados == null) {
		return null;
	}
	
	for(var a = 0; a < numerosGerados.length; a++) {
		newNumeros.push(getCode(numerosGerados[a], key, numbers));
	}

	for (var b = 0; b<newNumeros.length; b++) {
		var separarArrays = newNumeros[b];
		for (var c = 0; c < separarArrays.length; c++) {
			numerosGerados.push(separarArrays[c]);
		}
	}

	return numerosGerados;
}

function getCode(pass, key, numbers) {

	if (pass == '' || pass.length == 0) {
		return null;
	}
	
	var listNumbers = new Array();

	var alf = new Array("I","J","P","E","K","L","C","A","T","F","Y","S","B","Z","W","D","R","U","H","O","V","G","Q","X","M","N");
	
	var keyNumber = 0;
	for (var p = 0; p < key.length; p++) {
		keyNumber += alf.indexOf(key.substring(p, p+1));
	}
	
	if (numbers.length <= 0 ) {
		numbers = (alf.indexOf(pass.substring(0,1).toUpperCase())+1).toString().concat(alf.indexOf(pass.substring(pass.length-1,pass.length).toUpperCase())+1).toString();
	}

	while (numbers.length < 8) {
		numbers = (numbers * keyNumber).toString();
	}
	
	var listNumbers = new Array();
	
	for (var u = 0; u < 35; u++) {
		addNumbers(numbers, listNumbers, u, keyNumber);
	}

	return listNumbers;
}

function addNumbers(numbers, listNumbers, valueMulti, keyNumber) {
	for (var r = 0; r < numbers.length; r++) {
		
		var codeGen = parseInt(numbers.substring(r,r+1)) + valueMulti;
		
		if (codeGen == 0) {
			codeGen = 1;
		}
		
		while (codeGen.toString().length < 8) {
			codeGen = codeGen * keyNumber;
		}
		
		var code = codeGen.toString().substring(0,8);
		
		if (listNumbers.indexOf(code) == -1) {
			listNumbers.push(code.substring(0,8));
		}
	}
}