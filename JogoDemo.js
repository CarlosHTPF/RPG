import { Engine } from "./Basicas.js"
import { Cozinha, HallEntrada, SalaDeMusica, Biblioteca, SalaoPrincipal, Sotao } from "./SalasDemo.js";

export class JogoDemo extends Engine {
    constructor() {
        super();
    }

    criaCenario() {
        // Define as salas
        let salao = new SalaoPrincipal(this);
        let hall = new HallEntrada(this, salao);
        let biblioteca = new Biblioteca(this);
        let salaDeMusica = new SalaDeMusica(this);
        let cozinha = new Cozinha(this);
        let sotao = new Sotao(this);

        // Ligações do mapa
        salao.portas.set(hall.nome, hall);

        salao.portas.set(biblioteca.nome, biblioteca);
        biblioteca.portas.set(salao.nome, salao);

        salao.portas.set(salaDeMusica.nome, salaDeMusica);
        salaDeMusica.portas.set(salao.nome, salao);

        salao.portas.set(cozinha.nome, cozinha);
        cozinha.portas.set(salao.nome, salao);

        // Porta do sótão
        salao.portas.set(sotao.nome, sotao);
        sotao.portas.set(salao.nome, salao);

        // Define sala inicial
        this.salaCorrente = hall;
    }
}
