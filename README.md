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
