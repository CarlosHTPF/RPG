import { validate } from "bycontract";
import { Sala, Engine, Objeto } from "./Basicas.js";
import { Vela, Gancho, Chave, Grampo } from "./FerramentasDemo.js";
import { Piano, Violino, Porta, Estante, PortaRetrato, Gaveta, Caixa, Bau } from "./ObjetosDemo.js";

//-----------------------------------------------
//------- Criação do hall de entrada ------------
export class HallEntrada extends Sala {
	constructor(engine, salao) {
		super("Hall_de_Entrada", engine);

		this.salaoPrincipal = salao;

		let gancho = new Gancho();
		this.ferramentas.set(gancho.nome, gancho);

		let porta = new Porta();
		this.objetos.set(porta.nome, porta);

		this.portas.set("Salao_Principal", salao);
	}

	usa(ferramenta, objeto) {
		if (!this.engine.mochila.tem(ferramenta)) {
			return false;
		}
		if (!this.objetos.has(objeto)) {
			return false;
		}

		let alvo = this.objetos.get(objeto);
		if (alvo instanceof Porta && ferramenta === "gancho") {
			alvo.acaoOk = true;
			console.log("Você puxou a porta com o gancho, agora pode entrar no Salão Principal!");
			return true;
		}
		return false;
	}
}

// ---------------------------------------------
//---------Criacao do Salão Principal------------
export class SalaoPrincipal extends Sala {
	constructor(engine) {
		validate(engine, Engine);
		super("Salao_Principal", engine);

		// Objetos da sala
		let piano = new Piano();
		this.objetos.set(piano.nome, piano);

		let portaRetrato = new PortaRetrato();
		this.objetos.set(portaRetrato.nome, portaRetrato);

		// Compartimento secreto fechado
		let compartimento = new CompartimentoSecreto(engine);
		this.objetos.set(compartimento.nome, compartimento);

		// Estado do puzzle para abrir o compartimento
		this.sequenciaCorreta = ["do", "fa", "si"];
		this.tentativaAtual = [];
		this.tentativasRestantes = 3;
		this.resolvido = false;
	}

	usa(ferramenta, objeto) {
		validate(arguments, ["String", "String"]);
		if (objeto !== "piano") return false;

		let entrada = ferramenta.trim().toLowerCase();

		// mapa de nomes completos para notas
		const mapaNotas = {
			"Amanhecer - Dó": "do",
			"Amanhecer": "do",
			"do": "do",
			"Meio-dia - Fá": "fa",
			"Meio-dia": "fa",
			"fa": "fa",
			"Noite - Si": "si",
			"Noite": "si",
			"si": "si"

		};

		// tenta identificar a nota pela partitura
		let nota = mapaNotas[ferramenta] || null;
		if (!nota) {
			console.log("Essa partitura não serve aqui.");
			return false;
		}

		// registra a nota
		this.tentativaAtual.push(nota);
		console.log(`Você tocou a nota: ${nota.toUpperCase()}`);

		// quando já tiver 3 notas tocadas, verifica se acertou
		if (this.tentativaAtual.length === 3) {
			if (this.tentativaAtual.join(",") === this.sequenciaCorreta.join(",")) {
				console.log("A melodia ecoa pela sala... o piano se move revelando um compartimento secreto!");
				let compartimento = this.objetos.get("Compartimento");
				compartimento.acaoOk = true;
				this.resolvido = true;
				return true;
			} else {
				this.tentativasRestantes--;
				console.log("A melodia soa estranha... parece errado.");
				if (this.tentativasRestantes > 0) {
					console.log(`Você ainda tem ${this.tentativasRestantes} tentativa(s).`);
				} else {
					console.log("Você errou 3 vezes... o piano fecha para sempre. Game Over.");
					this.engine.indicaFimDeJogo();
				}
				this.tentativaAtual = []; // reset tentativa
			}
		}

		return true;
	}
}

// ---------------------------------------------
//------- Criação da Biblioteca -----------------
export class Biblioteca extends Sala {
	constructor(engine) {
		validate(engine, Engine);
		super("Biblioteca", engine);
		let estante = new Estante();
		this.objetos.set(estante.nome, estante);
		let vela = new Vela(engine);
		this.ferramentas.set(vela.nome, vela);
	}

	usa(ferramenta, objeto) {
		validate(arguments, ["String", "String"]);
		return false;
	}
}

// ---------------------------------------------
//------- Criação da Cozinha -------------------
export class Cozinha extends Sala {
	constructor(engine) {
		validate(engine, Engine);
		super("Cozinha", engine);
		let caixa = new Caixa();
		this.objetos.set(caixa.nome, caixa);
	}

	//Verifica se a ferramenta está na mochila do jogador.
	//Confere se o objeto alvo existe na sala.
	//Se a ferramenta for uma vela, executa a lógica de uso da vela (acender, gastar duração, etc).
	usa(ferramenta, objeto) {
		validate(arguments, ["String", "String"]);
		if (!this.engine.mochila.tem(ferramenta)) {
			return false;
		}
		if (!this.objetos.has(objeto)) {
			return false;
		}
		let vela = this.ferramentas.get(ferramenta);
		if (vela instanceof Vela) {
			return vela.usar(this.engine.mochila.pegar(ferramenta));
		}
		return false;
	}

	entrar() {
		let vela = this.engine.mochila.itens.find(i => i instanceof Vela);

		if (!vela || !vela.acesa) {
			console.log("Está muito escuro... você tropeça e não consegue continuar.");
			this.engine.indicaFimDeJogo(false);
			return false;
		}
		return true;
	}
}

// ---------------------------------------------
//------- Criação da Sala de Música -------------
export class SalaDeMusica extends Sala {
	constructor(engine) {
		validate(engine, Engine);
		super("Sala_de_Musica", engine);

		// Objetos da sala
		let violino = new Violino();
		this.objetos.set(violino.nome, violino);
		let gaveta = new Gaveta();
		this.objetos.set(gaveta.nome, gaveta);
		let grampo = new Grampo();
		this.ferramentas.set(grampo.nome, grampo);
	}

	usa(ferramenta, objeto) {
		validate(arguments, ["String", "String"]);
		if (!this.engine.mochila.tem(ferramenta)) {
			return false;
		}
		if (!this.objetos.has(objeto)) {
			return false;
		}

		// tenta usar a ferramenta no objeto (grampo na gaveta)
		let alvo = this.objetos.get(objeto);
		if (alvo instanceof Gaveta && ferramenta === "grampo") {
			alvo.acaoOk = true;
			alvo.encontrou = true;
			console.log("Você abriu a gaveta com o grampo! Dentro há a partitura Meio-dia - Fá.");
			return true;
		}

		return false;
	}
}

// ---------------------------------------------
//------- Criação do Sótão ---------------------
export class Sotao extends Sala {
	constructor(engine) {
		validate(engine, Engine);
		super("Sotao", engine);

		let bau = new Bau(engine);
		this.objetos.set(bau.nome, bau);
	}

	usa(ferramenta, objeto) {
		return false;
	}
}

//---------------------------------------------------------------------
//------- Criação do Compartimento Secreto -------
export class CompartimentoSecreto extends Objeto {
	constructor(engine) {
		super(
			"Compartimento",
			"Um compartimento fechado que parece esconder algo.",
			"O compartimento foi aberto, dentro dele há uma chave."
		);
		this.engine = engine;
		this.acaoOk = false; // fechado até puzzle resolvido
	}

	usa(ferramenta, objeto) {
		// Verifica se a ação foi desbloqueada
		if (!this.acaoOk) {
			console.log("O compartimento ainda está fechado.");
			return false;
		}

		// Se a ação foi desbloqueada, abre o compartimento
		if (!this.engine.salaCorrente.ferramentas.has("chave")) {
			this.engine.salaCorrente.ferramentas.set("chave", new Chave());
			console.log("O compartimento foi aberto. Dentro dele há uma chave.");
		}

		return true;
	}

	// Examinar o compartimento, se estiver aberto, revela a chave
	examinar() {
		if (!this.acaoOk) {
			return "Um compartimento fechado que parece esconder algo.";
		} else {
			if (!this.engine.salaCorrente.ferramentas.has("chave")) {
				this.engine.salaCorrente.ferramentas.set("chave", new Chave());
				console.log("Dentro do compartimento há uma chave!");
			}
			return "O compartimento foi aberto, dentro dele há uma chave.";
		}
	}
}