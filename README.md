#  Fase 1 (POO)

Este projeto é a **Fase 2** da disciplina de Programação Orientada a Objetos.  
O jogo consiste em explorar uma mansão misteriosa, resolver enigmas e recuperar um diário escondido no sótão.  

---

##  --- História / Enigma ---
O jogador entra em uma mansão antiga e descobre que o **diário secreto** está guardado no sótão.  
Para abrir a porta do sótão, é necessário resolver um enigma no **piano do salão principal**:  
- Encontrar **três partituras** escondidas em diferentes salas:  
  - **Biblioteca** → Estante revela a partitura *Amanhecer - Dó*.  
  - **Sala de Música** → Gaveta trancada guarda a partitura *Meio-dia - Fá*.  
  - **Cozinha** → Caixa velha contém a partitura *Noite - Si*.  
- De volta ao salão principal, tocar no piano as notas **Dó, Fá e Si**.  
- O compartimento secreto se abre e libera a chave do sótão.  
- No sótão, há um baú com o **diário**, que conclui a aventura.

---

## --- Salas disponíveis ---
- **Hall de Entrada**  
- **Salão Principal**  
- **Biblioteca**  
- **Sala de Música**  
- **Cozinha**  
- **Sótão**  
---

## --- Objetos e Ferramentas ---
- **Objetos**: Porta, Estante, Porta-retrato, Gaveta, Caixa, Piano, Violino, Baú.  
- **Ferramentas**: Grampo, Vela, Partitura, Gancho, Chave, Diário.  

---

## --- Comandos disponíveis ---
- `ir_para [local]` → muda de sala.  
- `examinar [objeto]` → mostra detalhes de um objeto.  
- `pegar [ferramenta]` → adiciona item ao inventário.  
- `usar [ferramenta] [objeto]` → utiliza ferramenta em um objeto.  
- `usar [nota] piano` → toca uma nota no piano.  
- `inventario` → lista os itens carregados.  
- `ajuda` → exibe dicas de comandos.  

---

## --- Como executar ---
1. Instale o [Node.js](https://nodejs.org/).  
2. Baixe/clonar este repositório.  
3. No terminal, navegue até a pasta do projeto.  
4. Execute:  
   ```bash
   node index.js