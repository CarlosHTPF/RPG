import { Ferramenta } from "./Basicas.js";

// ---------------------------------------------
//-------- Criação do Grampo -------------------
export class Grampo extends Ferramenta {
	constructor() {
		super("grampo", "Uma ferramenta simples que pode abrir a caixa.");
	}
}

// ---------------------------------------------
//-------- Criação da Vela -------------------
export class Vela extends Ferramenta {
	constructor(engine, duracao = 5) {
		super("vela", engine);   // agora engine é passado corretamente
		this.acesa = false;
		this.duracao = duracao;
	}

	//acende a vela se não estiver acesa e se ainda tiver duração
	acender() {
		if (this.acesa) {
			return "A vela já está acesa.";
		}
		if (this.duracao <= 0) {
			return "A vela já queimou e não pode mais ser usada.";
		}
		this.acesa = true;
		return "Você acendeu a vela.";
	}

	//apaga a vela se estiver acesa
	apagar() {
		if (!this.acesa) {
			return "A vela já está apagada.";
		}
		this.acesa = false;
		return "Você apagou a vela.";
	}

	//decrementa a duração da vela se estiver acesa, e verifica se acabou
	//retorna mensagem de fim de jogo se a vela acabar na cozinha
	//retorna mensagem de vela apagada se acabar em outro lugar
	//retorna null se nada acontecer
	tick() {
		if (this.acesa && this.duracao > 0) {
			this.duracao--;
			if (this.duracao === 0) {
				this.acesa = false;
				if (this.engine.salaCorrente.nome === "Cozinha") {
					this.engine.indicaFimDeJogo(false);
					return "A vela queimou completamente enquanto você estava na cozinha... você ficou no escuro! Game Over!";
				} else {
					return "A vela queimou completamente, mas aqui não há perigo imediato.";
				}
			}
		}
		return null;
	}
}

// ---------------------------------------------
//-------- Criação da Partitura -----------------
export class Partitura extends Ferramenta {
	constructor(nome) {
		super(nome, "Uma partitura musical.");
	}
}

// ---------------------------------------------
//-------- Criação do Gancho -------------------
export class Gancho extends Ferramenta {
	constructor() {
		super("gancho");
	}
}

// ---------------------------------------------
//-------- Criação da Chave -------------------
export class Chave extends Ferramenta {
	constructor() {
		super("chave");
	}
}