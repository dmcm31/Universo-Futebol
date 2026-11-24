# Universo do Futebol 2035-36

Simulador de campeonatos baseado na sua planilha: ligas inglesa (Golden League Vision) e italiana (Superlegea Calcio), 18 clubes cada, simulação jogo a jogo com narração minuto a minuto, lesões, cartões, suspensões, formações e estatísticas por clube, jogador e liga.

## Rodar no seu computador
Dê dois cliques em `index.html`. Não precisa instalar nada. O jogo salva sozinho no navegador (localStorage).

## Publicar no GitHub (passo a passo, sem terminal)
1. Crie uma conta em github.com e clique em **New repository**. Nome sugerido: `futebol-universo`. Marque **Public** (pelo que sei, no plano gratuito o GitHub Pages exige repositório público).
2. Na página do repositório vazio, clique em **uploading an existing file** e arraste **o conteúdo** da pasta (index.html, css, js, data, tools, README.md). Clique em **Commit changes**.
3. Vá em **Settings → Pages**. Em *Build and deployment*, escolha **Deploy from a branch**, branch **main**, pasta **/(root)**, e **Save**.
4. Em 1 a 2 minutos o jogo fica em `https://SEU-USUARIO.github.io/futebol-universo/`.

Com terminal (opcional):
```
git init && git add . && git commit -m "primeira versão"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/futebol-universo.git
git push -u origin main
```
Depois de cada edição, suba de novo (pelo site ou com `git add . && git commit -m "..." && git push`). O GitHub Pages atualiza sozinho.

## Campo tático, funções e saves
- **Campo tático:** no Editor (Formação principal) e na tela de aprovação antes de cada jogo, a escalação é montada num campo. Clique em um jogador para trocar o jogador, a posição da vaga e a **função** dele (por exemplo, Ponta que invade, Regista, Pivô, Falso 9). A função muda quais características pesam na nota do jogador naquela vaga (`ROLES` em `js/config.js`).
- **Características:** as 6 podem ser editadas no perfil do jogador ou direto na tabela do Editor → Jogadores.
- **Saves:** botão **💾 SAVES**. Salva em vários slots com nome, carrega, sobrescreve, apaga, baixa como arquivo e importa arquivo. O jogo continua salvando sozinho a cada partida.

## Características, posições secundárias e aprovação das escalações
- **6 características** por jogador (Finalização, Passe, Drible, Defesa, Velocidade, Físico). Em cada posição, 2 são **vitais** (35% do geral cada), 2 **importantes** (15% cada) e 2 **irrelevantes** (0%). A tabela de importância está em `js/config.js` (`POSW`). O geral de um jogador muda conforme a posição em que ele joga.
- **Posições secundárias:** clique no nome do jogador (Elenco ou Editor → Jogadores → Perfil) para editar características e marcar posições secundárias. Existem as posições MD e ME (meia direita e esquerda). O jogo só escala alguém fora das posições dele se não houver ninguém disponível, e avisa "fora de posição".
- **Aprovar escalações:** com a opção ligada (cartão no Início), ao simular um jogo abre a tela com as escalações dos dois times, para você trocar jogadores e formação e aprovar.

## Transferências
Na aba **Elenco** de qualquer clube, clique em **🔁 Transferências** e escolha: Venda, Compra, Empréstimo, Rescisão / fim de contrato, Agente livre, Promoção da base ou Aposentadoria (os termos vêm da sua aba TRANFERS.). Cada operação tem a janela (Verão ou Inverno) e vai para o histórico em **TRANSFERÊNCIAS** (histórico, agentes livres, empréstimos ativos e saldo por clube). Jogadores que saem ficam ocultos no clube de origem e continuam aparecendo nas escalações de partidas antigas.

## Valor de mercado
A coluna de valor de mercado da planilha está quebrada (`#REF!`), então o jogo calcula o valor: cresce rápido com o overall, depende da idade (jovens valem mais) e da posição. A fórmula está em `js/config.js` (`valorMercado`). No Editor → Jogadores você pode fixar o valor de um jogador (coluna "Valor").

## Fases dos jogadores, formação principal e substituições
- **Fase:** ↑ vermelha = boa fase · ↓ azul = má fase · ← verde = fora de ritmo (3 jogos ou mais sem jogar) · → verde = regular. Cada jogador é *oscilante* (alterna entre as fases) ou *consistente* (nunca entra em má fase). A fase muda a cada jogo, e gols e assistências ajudam a entrar em boa fase.
- **Formação principal:** cada clube tem uma formação e 11 titulares definidos (Editor → Formação principal). Antes de cada jogo, se um titular está em má fase ou fora de ritmo, ele pode ser trocado por um reserva melhor da mesma posição.
- **Substituições:** todo time faz as 3 substituições em todo jogo (lesões contam como uma delas).
- **Cor secundária:** cada clube tem duas cores (Editor → Clubes).

## Editor dentro do jogo (sem mexer em código)
No topo do jogo, clique em **✏️ Editor**:
- **Clubes:** nome, cor, estádio e técnico.
- **Jogadores:** editar posição, número, nome, país, idade e geral; incluir novo jogador; dispensar.
- **Aparência:** fonte do texto, fonte dos títulos, cor de destaque e cor do cabeçalho.
- **Exportar:** baixa `jogadores.js` e `clubes.js` prontos para colocar na pasta `data/` do repositório e tornar as edições permanentes.

As edições ficam salvas no navegador. Sem exportar e subir os arquivos, elas não aparecem em outros aparelhos.

## Onde mexer em cada coisa (editando os arquivos)
| Quero mudar | Arquivo |
|---|---|
| Fontes (texto e títulos), cores gerais, claro/escuro, layout | `css/style.css` (variáveis `--fonte`, `--fonte-titulo`, `--ac`... no começo) |
| Cor de cada clube (escudo, banner, barras) e estádio de cada clube | `data/clubes.js` (`COL` e `EST`) |
| Bandeiras (país → código) e posição dos jogadores no campo | `js/config.js` (`ISO` e `LAYOUT`) |
| Cor de cada liga e nomes das ligas | `js/config.js` (`LGC` e `LG`) |
| Incluir, editar ou tirar jogadores, técnicos e clubes | `data/jogadores.js` |
| Formações e posições | `js/config.js` (`FORM`, `CP`) e `js/engine.js` (`lineup`) |
| Regras da partida (cartões, lesões, gols, substituições) | `js/engine.js` (função `sim`) |
| Telas e navegação | `js/app.js` |

Formato de um jogador em `data/jogadores.js`: `["ATA",9,"NOME COMPLETO","PAÍS",28,87]` = posição, número, nome, país, idade, geral.
Para criar um clube novo, copie um bloco inteiro de clube, troque o nome e o `lg`, e adicione a cor em `data/clubes.js`. Mantenha 18 clubes por liga (o calendário precisa de número par).

## Atualizar a partir da planilha
```
pip install openpyxl
python tools/extrair_planilha.py Temporada_2035-36.xlsx          # só elencos
python tools/extrair_planilha.py Temporada_2035-36.xlsx --cores  # também sobrescreve as cores
```
A planilha não vai para o GitHub (está no `.gitignore`). Depois de mudar os dados, clique em **Reiniciar** no jogo, porque o jogo salvo guarda os elencos antigos.

## Identidade visual (escudos, símbolos, camisas)
Hoje cada clube tem só uma cor e um escudo gerado com as iniciais. Para escudos e camisas de verdade, o caminho é: guardar as imagens SVG em `img/escudos/` e `img/camisas/`, listar o arquivo de cada clube em `data/clubes.js` e trocar a função `badge` em `js/app.js` para mostrar a imagem. É uma mudança pequena de código.

## Limitações atuais
Só as duas primeiras divisões; sem Master League, copas, transferências ou virada de temporada.
