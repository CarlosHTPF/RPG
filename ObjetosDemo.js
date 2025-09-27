import { validate } from "bycontract";
import { Objeto, Ferramenta } from "./Basicas.js";
import { Grampo, Partitura } from "./FerramentasDemo.js";

//-------------------------------------------
//-------- Criação do Violino -------------------
export class Violino extends Objeto {
	constructor() {
		super("Violino", "Um violino antigo com cordas arrebentadas.",
			"O violino não pode ser tocado no estado em que está.");
	}

	usar(ferramenta) {
		validate(ferramenta, Ferramenta);
		return false;
	}

}

// ---------------------------------------------
//-------- Criação da Porta -------------------
export class Porta extends Objeto {
	constructor() {
		super("Porta", "A porta está trancada.", "A porta está aberta.");
	}

	usar(ferramenta) {
		validate(ferramenta, Ferramenta);
		return false;
	}
}

// ---------------------------------------------
//-------- Criação da Estante -------------------
export class Estante extends Objeto {
	constructor() {
		super(
			"estante",
			"Uma estante repleta de livros.",
			"Ao examinar cuidadosamente os livros, você encontra algo escondido."
		);
		this.partitura = new Partitura("Amanhecer - Dó");
		this.encontrou = false;
	}

	// Examinar a estante
	examinar() {
		if (!this.encontrou) {
			this.encontrou = true;
			return super.examinar() + " Você descobre a partitura: " + this.partitura.nome;
		} else {
			return "Uma estante com livros. Você já encontrou a partitura aqui.";
		}
	}

	pegar() {
		if (this.encontrou) {
			return this.partitura;
		}
		return null;
	}
}

// ---------------------------------------------
//-------- Criação do Porta Retrato ------------
export class PortaRetrato extends Objeto {
	constructor() {
		super("porta_retrato", "Um porta-retrato", "");
	}

	// Usar uma ferramenta no porta-retrato
	usar(ferramenta) {
		validate(ferramenta, Ferramenta);
		return false;
	}
	// Examinar o porta-retrato
	examinar() {
		return "A vida é um ciclo: amanhecer, meio-dia e noite.";
	}
}

// ---------------------------------------------
//-------- Criação da Gaveta -------------------
export class Gaveta extends Objeto {
	constructor() {
		super("Gaveta", "Uma gaveta trancada", "Ela parece frágil, mas só abre com algo fino como um grampo ou arame.");
		this.trancada = true;
		this.partitura = new Partitura("Meio-dia - Fá");
		this.encontrou = false;
	}

	// Usar uma ferramenta na gaveta, como um grampo, se nao for um grampo, retorna false
	usar(ferramenta) {
		validate(ferramenta, Ferramenta);
		console.log(ferramenta.nome);
		if (ferramenta instanceof Grampo) {
			this.acaoOk = true;
			console.log("Meio-dia - Fá");
			return true;
		}
		return false;
	}

	// Examinar a gaveta
	pegar() {
		if (this.encontrou) {
			return this.partitura;
		}
		return null;
	}
}

// ---------------------------------------------
//-------- Criação da Caixa -------------------
export class Caixa extends Objeto {
	constructor() {
		super("Caixa", "Uma caixa velha e empoeirada.", "Parece que há algo guardado dentro dela.");
		this.fechada = true;
		this.partitura = new Partitura("Noite - Si");
		this.encontrou = false;
	}

	//Usar uma ferramenta na caixa
	usar(ferramenta) {
		validate(ferramenta, Ferramenta);

		if (ferramenta instanceof Ferramenta) {
			this.fechada = false;
			this.encontrou = true;
			this.acaoOk = true;
			console.log("Você abriu a caixa com a ferramenta! Dentro há a partitura Noite - Si.");
			return true;
		}

		console.log("Essa ferramenta não serve para abrir a caixa.");
		return false;
	}

	// Examinar a caixa
	examinar() {
		return "Você abriu a caixa com a ferramenta! Dentro há a partitura Noite - Si.";
	}

	pegar() {
		if (this.encontrou) {
			return this.partitura;
		}
		return null;
	}
}

// ---------------------------------------------
//-------- Criação do Piano -------------------
export class Piano extends Objeto {
	constructor() {
		super("piano", "Um piano antigo", "O piano tem teclas gastas, sendo três delas marcadas de forma estranha: Dó, Fá e Si.");
	}

	usar(ferramenta) {
		validate(ferramenta, Ferramenta);
		if (ferramenta.nome === "partitura") {
			this.acaoOk = true;
			console.log("Você tocou a partitura no piano. Uma melodia ecoa pelo salão...");
			return true;
		}
		return false;
	}
}

// ---------------------------------------------
//-------- Criação do Baú ---------------------
export class Bau extends Objeto {
	constructor(engine) {
		super("Bau", "Um baú antigo e empoeirado.", "O baú está aberto, dentro dele há um diário.");
		this.engine = engine;
		this.aberto = false;
		this.diario = new Ferramenta("diario");
		this.encontrou = false;
	}

	// examinar o baú e descobrir o diario dentro dele
	examinar() {
		if (!this.aberto) {
			this.aberto = true;
			this.encontrou = true;
			// coloca o diário como ferramenta na sala
			this.engine.salaCorrente.ferramentas.set("diario", this.diario);
			return "Você abriu o baú. Dentro há um diário!";
		} else {
			return "O baú está aberto, dentro dele há um diário.";
		}
	}

	// Pegar o diário do baú
	pegar() {
		if (this.encontrou) {
			this.engine.mochila.guarda(this.diario);
			return this.diario;
		}
		return null;
	}
}