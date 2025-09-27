import { validate } from "bycontract";
import promptsync from 'prompt-sync';
const prompt = promptsync({ sigint: true });

// ---------------------------------------------
//-------- Criação da Ferramenta ----------------
export class Ferramenta {
	#nome;
	#engine;

	constructor(nome, engine = null) {
		validate(nome, "String");
		this.#nome = nome;
		this.#engine = engine;
	}

	get nome() {
		return this.#nome;
	}

	get engine() {
		return this.#engine;
	}

	// Usar a ferramenta
	usar() {
		return true;
	}
}

// ---------------------------------------------
//-------- Criação da Mochila -------------------
export class Mochila {
	#ferramentas;
	#capacidade;
	engine;

	constructor(engine, capacidade = 2) {
		this.engine = engine;
		this.#ferramentas = [];
		this.#capacidade = capacidade;
	}

	// Guardar uma ferramenta na mochila
	guarda(ferramenta) {
		validate(ferramenta, Ferramenta);
		if (this.#ferramentas.length >= this.#capacidade) {
			console.log("Sua mochila está cheia! Remova algo antes de guardar.");
			return false;
		}
		this.#ferramentas.push(ferramenta);
		return true;
	}

	// Pegar uma ferramenta da mochila
	pegar(nomeFerramenta) {
		validate(nomeFerramenta, "String");
		let ferramenta = this.#ferramentas.find(f => f.nome === nomeFerramenta);
		return ferramenta || null;
	}

	// Verifica se a mochila tem a ferramenta
	tem(nomeFerramenta) {
		validate(nomeFerramenta, "String");
		return this.#ferramentas.some(f => f.nome === nomeFerramenta);
	}

	// Remover uma ferramenta da mochila e deixar na sala corrente
	remover(nomeFerramenta) {
		validate(nomeFerramenta, "String");
		let idx = this.#ferramentas.findIndex(f => f.nome === nomeFerramenta);
		if (idx !== -1) {
			let removido = this.#ferramentas.splice(idx, 1)[0];
			this.engine.salaCorrente.ferramentas.set(removido.nome, removido);
			console.log(`Você removeu '${removido.nome}' da mochila e deixou no ${this.engine.salaCorrente.nome}.`);
			return true;
		} else {
			console.log(`O item '${nomeFerramenta}' não está na mochila.`);
			return false;
		}
	}

	// Listar itens na mochila
	inventario() {
		if (this.#ferramentas.length === 0) {
			return "Mochila vazia.";
		}
		return "Ferramentas disponíveis: " + this.#ferramentas.map(obj => obj.nome).join(", ");
	}

	get itens() {
		return this.#ferramentas;
	}

	get capacidade() {
		return this.#capacidade;
	}
}



// ---------------------------------------------
//-------- Criação do Objeto --------------------
export class Objeto {
	#nome;
	#descricaoAntesAcao;
	#descricaoDepoisAcao;
	#acaoOk;

	constructor(nome, descricaoAntesAcao, descricaoDepoisAcao) {
		validate(arguments, ["String", "String", "String"]);
		this.#nome = nome;
		this.#descricaoAntesAcao = descricaoAntesAcao;
		this.#descricaoDepoisAcao = descricaoDepoisAcao;
		this.#acaoOk = false;
	}

	// Getters e Setters
	get nome() {
		return this.#nome;
	}

	get acaoOk() {
		return this.#acaoOk;
	}

	set acaoOk(acaoOk) {
		validate(acaoOk, "Boolean");
		this.#acaoOk = acaoOk;
	}

	get descricao() {
		if (!this.acaoOk) {
			return this.#descricaoAntesAcao;
		} else {
			return this.#descricaoDepoisAcao;
		}
	}

	// Examinar o objeto
	examinar() {
		return this.#descricaoDepoisAcao;
	}
	// Usar uma ferramenta no objeto
	usa(ferramenta, objeto) {
	}
}

// ---------------------------------------------
//-------- Criação da Sala -------------------
export class Sala {
	#nome;
	#objetos;
	#ferramentas;
	#portas;
	#engine;

	constructor(nome, engine) {
		validate(arguments, ["String", Engine]);
		this.#nome = nome;
		this.#objetos = new Map();
		this.#ferramentas = new Map();
		this.#portas = new Map();
		this.#engine = engine;
	}

	get nome() {
		return this.#nome;
	}

	get objetos() {
		return this.#objetos;
	}

	get ferramentas() {
		return this.#ferramentas;
	}

	get portas() {
		return this.#portas;
	}

	get engine() {
		return this.#engine;
	}

	//Obter objetos disponíveis na sala
	objetosDisponiveis() {
		let arrObjs = [...this.#objetos.values()];
		return arrObjs.map(obj => obj.nome + ":" + obj.descricao);
	}

	//Obter ferramentas disponíveis na sala
	ferramentasDisponiveis() {
		let arrFer = [...this.#ferramentas.values()];
		return arrFer.map(f => f.nome);
	}

	//Obter portas disponíveis na sala
	portasDisponiveis() {
		let arrPortas = [...this.#portas.values()];
		return arrPortas.map(sala => sala.nome);
	}

	// Pegar uma ferramenta da sala e colocar na mochila
	pegar(nomeFerramenta) {
		validate(nomeFerramenta, "String");
		let ferramenta = this.#ferramentas.get(nomeFerramenta);

		if (ferramenta != null) {
			if (this.#engine.mochila.guarda(ferramenta)) {
				this.#ferramentas.delete(nomeFerramenta);//remover ferramenta da sala

				//verifica se e o diario, se for o diario encerra o jogo
				if (nomeFerramenta.toLowerCase() === "diario") {
					console.log("Você pegou o Diário! A verdade foi revelada...");
					console.log("Parabéns, você venceu o jogo!");
					this.#engine.indicaFimDeJogo(true);
				}

				return true;
			} else {
				console.log(`Você não conseguiu pegar '${nomeFerramenta}', sua mochila está cheia.`);
				return false;
			}
		} else {
			return false;
		}
	}

	//Ir para uma porta
	irPorta(porta) {
		validate(porta, "String");
		let destino = this.#portas.get(porta);
		if (destino == null) {
			return null;
		}
		if (this.objetos.has("Porta")) {
			let portaObj = this.objetos.get("Porta");
			if (!portaObj.acaoOk && porta === "Salao_Principal") {
				console.log("A porta está trancada, você precisa usar algo para abri-la.");
				return "trancada";
			}
		}
		if (porta === "Sotao" && !this.engine.mochila.tem("chave")) {
			console.log("A porta do sótão está trancada. Parece que você precisa de uma chave.");
			return "trancada";
		}
		return destino;
	}

	// Obter descrição da sala
	textoDescricao() {
		let descricao = "Você está no " + this.nome + "\n";
		if (this.objetos.size == 0) {
			descricao += "Não há objetos na sala\n";
		} else {
			descricao += "Objetos: " + this.objetosDisponiveis() + "\n";
		}
		if (this.ferramentas.size == 0) {
			descricao += "Não há ferramentas na sala\n";
		} else {
			descricao += "Ferramentas: " + this.ferramentasDisponiveis() + "\n";
		}
		descricao += "Portas: " + this.portasDisponiveis() + "\n";
		return descricao;
	}

	// Usar uma ferramenta em um objeto da sala
	usa(ferramenta, objeto) {
		return false;
	}

	// Examinar um objeto da sala
	examinar(nomeObjeto) {
		if (this.#objetos.has(nomeObjeto)) {
			let obj = this.#objetos.get(nomeObjeto);
			if (typeof obj.examinar === "function") {
				return obj.examinar();
			} else {
				return obj.descricao ?? `Você vê ${obj.nome}, mas nada de especial.`;
			}
		} else {
			return `Objeto '${nomeObjeto}' não encontrado nesta sala.`;
		}
	}
}

//---------------------------------------------------------------
// ------------------ classe controle ---------------------------
export class Engine {
	#mochila;
	#salaCorrente;
	#fim;
	#vitoria;

	constructor() {
		this.#mochila = new Mochila(this);
		this.#salaCorrente = null;
		this.#fim = false;
		this.#vitoria = false;
		this.criaCenario();
	}

	// Getters e Setters
	get mochila() {
		return this.#mochila;
	}

	get salaCorrente() {
		return this.#salaCorrente;
	}

	set salaCorrente(sala) {
		validate(sala, Sala);
		this.#salaCorrente = sala;
	}

	// Indica o fim do jogo (venceu ou perdeu)
	indicaFimDeJogo(vitoria = false) {
		this.#fim = true;
		this.#vitoria = vitoria;
	}

	// criar cenario
	criaCenario() { }

	// loop principal do jogo
	joga() {
		let novaSala = null;
		let acao = "";
		let tokens = null;

		while (!this.#fim) {
			try {
				console.log("-------------------------");
				console.log(this.salaCorrente.textoDescricao());

				acao = prompt("O que voce deseja fazer? ");
				if (!acao) {
					console.log("Nenhum comando digitado.");
					continue;
				}

				tokens = acao.trim().split(" ");
				switch (tokens[0]) {
					case "fim":
						this.#fim = true;
						break;
					case "pegar":
						if (tokens.length < 2) {
							console.log("Uso correto: pegar <item>");
							break;
						}
						if (this.salaCorrente.pegar(tokens[1])) {
							console.log("Ok! " + tokens[1] + " item guardado na mochila!");
						} else {
							console.log("Objeto " + tokens[1] + " não encontrado.");
						}
						break;
					case "remover":
						if (tokens.length < 2) {
							console.log("Uso correto: remover <item>");
							break;
						}
						this.#mochila.remover(tokens[1]);
						break;
					case "examinar":
						if (tokens.length < 2) {
							console.log("Uso correto: examinar <objeto>");
							break;
						}
						console.log(this.salaCorrente.examinar(tokens[1]));
						break;
					case "inventario":
						console.log(this.#mochila.inventario());
						break;
					case "usar":
						if (tokens.length < 3) {
							console.log("Uso correto: usar <ferramenta> <objeto>");
							break;
						}
						let ferramenta = tokens[1];
						let objeto = tokens[2];
						if (this.salaCorrente.usa(ferramenta, objeto)) {
							if (this.#fim) {
								console.log(this.#vitoria ? "Parabéns, você venceu!" : "Game Over.");
							} else {
								console.log("Feito !!");
							}
						} else {
							if (!this.salaCorrente.objetos.has(objeto)) {
								console.log("O objeto '" + objeto + "' não existe nesta sala. Tente 'ajuda'.");
							} else {
								console.log("Não é possível usar '" + ferramenta + "' sobre '" + objeto + "' aqui.");
							}
						}
						break;
					case "acender": {
						if (tokens.length < 2) {
							console.log("Uso correto: acender <item>");
							break;
						}
						let alvo = tokens[1];
						let item = this.#mochila.pegar(alvo);
						if (item && item.constructor.name === "Vela") {
							console.log(item.acender());
						} else {
							console.log("Você não tem esse item ou ele não pode ser aceso.");
						}
						break;
					}
					case "apagar": {
						if (tokens.length < 2) {
							console.log("Uso correto: apagar <item>");
							break;
						}
						let alvo = tokens[1];
						let item = this.#mochila.pegar(alvo);
						if (item && item.constructor.name === "Vela") {
							console.log(item.apagar());
						} else {
							console.log("Você não tem esse item ou ele não pode ser apagado.");
						}
						break;
					}
					case "ir_para":
						if (tokens.length < 2) {
							console.log("Uso correto: ir_para <sala>");
							break;
						}
						novaSala = this.salaCorrente.irPorta(tokens[1]);
						if (novaSala === null) {
							console.log("Sala desconhecida ...");
						} else if (novaSala === "trancada") {
							console.log("A sala está trancada!");
						} else {
							if (typeof novaSala.entrar === "function") {
								if (novaSala.entrar()) {
									this.#salaCorrente = novaSala;
								}
							} else {
								this.#salaCorrente = novaSala;
							}
						}
						break;
					case "ajuda":
						console.log("Comandos disponíveis:");
						console.log(" - ajuda .................. mostra esta ajuda");
						console.log(" - fim .................... encerra o jogo");
						console.log(" - pegar <item> ........... pega um item da sala");
						console.log(" - remover <item> ......... remove um item da mochila");
						console.log(" - inventario ............. mostra os itens guardados");
						console.log(" - examinar <objeto> ...... examina um objeto da sala");
						console.log(" - usar <item> <objeto> ... usa um item sobre um objeto");
						console.log(" - usar <nota> piano ...... toca uma nota no piano");
						console.log(" - acender vela ........... acende a vela");
						console.log(" - apagar vela ............ apaga a vela");
						console.log(" - ir_para <sala> ......... vai para outra sala");
						break;
					default:
						console.log("Comando desconhecido: " + tokens[0] + ". Digite 'ajuda'.");
						break;
				}

				// tick da vela
				for (let item of this.#mochila.itens) {
					if (item.constructor.name === "Vela") {
						let msg = item.tick();
						if (msg) console.log(msg);
					}
				}
			} catch (err) {
				console.error("Erro durante a execução", err);
			}
		}
		console.log("Jogo encerrado!");
	}
}

