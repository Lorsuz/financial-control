class ControlFinance {
	constructor ( button, inputDescription, inputValue, inputType, financeList ) {
		this.button = button;
		this.inputDescription = inputDescription;
		this.inputValue = inputValue;
		this.inputType = inputType;
		this.financeList = financeList;

		this.totalIncome = 0;
		this.totalExpenses = 0;
		this.balance = 0;
	}

	init () {
		if ( this.financeList.innerHTML == '' ) {
			this.financeList.innerHTML = `<tr class="my-auto"><td colspan="5" class="text-center">There's not data here</td></tr>`;
		}
		var dataToStore = {
			finance: []
		};
		this.setDataInLocalStorage( 'data', dataToStore );

		this.button.addEventListener( 'click', ( event ) => {
			event.preventDefault();
			if (this.inputDescription.value && this.inputValue.value) {
				this.createObject();
			}

		} );
	}
	capitalizeWords(inputString) {
    let words = inputString.split(' ');
    for (let i = 0; i < words.length; i++) {
        words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1);
    }
    return words.join(' ');
}

	createObject () {
		var description = this.capitalizeWords(this.inputDescription.value.trim())
		var value = parseInt( this.inputValue.value ).toFixed( 2 );
		var type = document.querySelector( this.inputType ).value;

		var storedData = this.getDataFromLocalStorage( 'data' );

		var data = {
			id: storedData.finance.length + 1 || 1,
			description: description,
			value: value,
			type: type == "expense" ? "-" : "+"
		};

		this.resetInputs();

		storedData.finance.push( data );

		this.setDataInLocalStorage( 'data', storedData );
		this.updateFinance();
		this.addToFinanceList( storedData );
	}

	resetInputs () {
		this.inputDescription.value = '';
		this.inputValue.value = 0;
	}

	getDataFromLocalStorage ( key ) {
		return JSON.parse( localStorage.getItem( key ) );
	}

	setDataInLocalStorage ( key, dataToStore ) {
		var convertData = JSON.stringify( dataToStore );
		localStorage.setItem( key, convertData );
	}

	updateFinance () {
		var item = this.getDataFromLocalStorage( 'data' ).finance.pop();
		if ( item.type == '+' ) {
			this.totalIncome += parseInt( item.value );
			console.log( this.totalIncome );
		} else {
			this.totalExpenses += parseInt( item.value );
		}
		this.balance = this.totalIncome - this.totalExpenses;

		document.querySelector( '#income' ).innerHTML = `R$ ${ this.totalIncome.toFixed( 2 ) }`;
		document.querySelector( '#expense' ).innerHTML = `R$ ${ this.totalExpenses.toFixed( 2 ) }`;
		document.querySelector( '#balance' ).innerHTML = `R$ ${ this.balance.toFixed( 2 ) }`;

	}

	addToFinanceList () {
		var storedData = this.getDataFromLocalStorage( 'data' );
		var finance = storedData.finance;

		var color = finance[ finance.length - 1 ].type == '+' ? 'success' : 'danger';

		if ( this.financeList.innerHTML == '' ) {
			this.financeList.innerHTML = `<tr class="my-auto"><td colspan="5" class="text-center">Nenhum dado encontrado</td></tr>`;
		} else {

			if ( this.financeList.innerHTML === `<tr class="my-auto"><td colspan="5" class="text-center">There's not data here</td></tr>` ) {
				this.financeList.innerHTML = '';
			}

			this.financeList.innerHTML += `
				<tr class="my-auto">
					<td class="text-center my-auto text-capitalize">${ finance[ finance.length - 1 ].id }</td>
					<td class="text-center text-${ color }">${ finance[ finance.length - 1 ].description }</td>
					<td class="text-center  text-${ color }">R$ ${ finance[ finance.length - 1 ].value }</td>
					<td class="text-center text-${ color }">${ finance[ finance.length - 1 ].type }</td>
				</tr>
				`;
		}

	}

}

new ControlFinance(
	document.getElementById( 'button' ),
	document.getElementById( 'description' ),
	document.getElementById( 'value' ),
	'input[name="type"]:checked',
	document.querySelector( 'tbody' )

).init();