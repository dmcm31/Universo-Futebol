// CONFIGURAÇÕES GERAIS: ligas, cores das ligas, formações e estado do jogo.
const $=q=>document.querySelector(q),rnd=(a,b)=>a+Math.random()*(b-a),pick=a=>a[Math.floor(Math.random()*a.length)],cp=(x,a,b)=>Math.min(b,Math.max(a,x));
const G=p=>({GK:'G',LE:'D',LD:'D',ZGE:'D',ZGD:'D',VOL:'M',MC:'M',MEIA:'M',MD:'M',ME:'M'}[p]||'A');
const FORM={'4-3-3':['GK','LD','ZGD','ZGE','LE','VOL','MC','MEIA','PD','ATA','PE'],'3-4-3':['GK','ZGD','ZGE','ZGD','LD','VOL','MEIA','LE','PD','ATA','PE'],'4-4-2':['GK','LD','ZGD','ZGE','LE','MD','MC','MC','ME','ATA','SA'],'4-5-1':['GK','LD','ZGD','ZGE','LE','MD','VOL','MC','MEIA','ME','ATA'],'5-4-1':['GK','LD','ZGD','ZGE','ZGD','LE','MD','VOL','MC','ME','ATA']};
const CP={LD:['LD','LE'],LE:['LE','LD'],ZGD:['ZGD','ZGE'],ZGE:['ZGE','ZGD'],MD:['MD','ME'],ME:['ME','MD'],PD:['PD','PE'],PE:['PE','PD'],VOL:['VOL'],MC:['MC'],MEIA:['MEIA'],ATA:['ATA'],SA:['SA'],GK:['GK']}; // trocas automáticas permitidas (lado direito/esquerdo); o resto depende das posições secundárias
const CLUBN=new Set(DATA.map(c=>c.n)),tc=s=>CLUBN.has(s)?s:s.toLowerCase().replace(/(^|[\s'-])\S/g,m=>m.toUpperCase()),sn=p=>tc(p.name.split(' ').pop());
const LGC={ING:'#BF9000',ITA:'#1155CC'};
const LG={ING:'Golden League Vision (Inglaterra)',ITA:'Superlegea Calcio (Itália)'};
let S=null,nav={p:'home'},H=[],timer=null;
const cl=n=>S.clubs.find(c=>c.n==n),ci=n=>S.clubs.findIndex(c=>c.n==n);
// Chave única do salvamento automático. Se mudar o nome, mude só aqui.
const SAVEKEY='fut3536f',OLDKEY='fut3536d';
const load=()=>{try{const j=localStorage.getItem(SAVEKEY)||localStorage.getItem(OLDKEY);return j?JSON.parse(j):null}catch(e){return null}};
const save=()=>{try{localStorage.setItem(SAVEKEY,JSON.stringify(S))}catch(e){}};

// BANDEIRAS: nome do país (como está em data/jogadores.js) -> código do site flagcdn.com
const ISO={"ITÁLIA": "it", "INGLATERRA": "gb-eng", "FRANÇA": "fr", "ESPANHA": "es", "BÉLGICA": "be", "BRASIL": "br", "PAÍSES BAIXOS": "nl", "ESCÓCIA": "gb-sct", "IRLANDA": "ie", "MARROCOS": "ma", "ARGENTINA": "ar", "ALEMANHA": "de", "SUÍÇA": "ch", "NIGÉRIA": "ng", "PAÍS DE GALES": "gb-wls", "PORTUGAL": "pt", "CROÁCIA": "hr", "POLÔNIA": "pl", "GANA": "gh", "REP. CONGO": "cd", "SÉRVIA": "rs", "URUGUAI": "uy", "SENEGAL": "sn", "HUNGRIA": "hu", "COSTA DO MARFIM": "ci", "TURQUIA": "tr", "ÁFRICA DO SUL": "za", "ALBÂNIA": "al", "MONTENEGRO": "me", "BENIM": "bj", "DINAMARCA": "dk", "CHÉQUIA": "cz", "CAMARÕES": "cm", "ESLOVÁQUIA": "sk", "JAPÃO": "jp", "NORUEGA": "no", "UCRÂNIA": "ua", "MALI": "ml", "SUÉCIA": "se", "COLÔMBIA": "co", "FINLÂNDIA": "fi", "ÁUSTRIA": "at", "MACEDÔNIA": "mk", "ESLOVÉNIA": "si", "GUINÉ": "gn", "EQUADOR": "ec", "ESTADOS UNIDOS": "us", "TUNÍSIA": "tn", "AUSTRÁLIA": "au", "GRÉCIA": "gr", "GÂMBIA": "gm", "CHILE": "cl", "SURINAME": "sr", "RÚSSIA": "ru", "ANGOLA": "ao", "PARAGUAI": "py", "BÓSNIA HERZEGOVINA": "ba", "ARGÉLIA": "dz", "BURQUINA FASSO": "bf", "IRLANDA DO NORTE": "gb-nir", "GABÃO": "ga", "KOSOVO": "xk", "LIBÉRIA": "lr", "TANZÂNIA": "tz", "TOGO": "tg", "PERU": "pe", "QUÉNIA": "ke", "CORÉIA DO SUL": "kr", "BULGÁRIA": "bg", "ROMÉNIA": "ro", "LITUÂNIA": "lt", "CABO VERDE": "cv", "CONGO": "cg", "CANADÁ": "ca", "JAMAICA": "jm", "IRÃ": "ir", "UZBEQUISTÃO": "uz", "ISLÂNDIA": "is", "BOLÍVIA": "bo", "MÉXICO": "mx", "MOLDÁVIA": "md", "UGANDA": "ug", "ISRAEL": "il", "GEÓRGIA": "ge", "COSTA RICA": "cr", "EGITO": "eg", "ZÂMBIA": "zm", "VENEZUELA": "ve", "NICARÁGUA": "ni", "GUINÉ BISSAU": "gw", "ARÁBIA SAUDITA": "sa"};
const flag=p=>{const c=ISO[(p||'').toUpperCase()];return c?`<img class=fl src="https://flagcdn.com/w20/${c}.png" alt="" loading=lazy onerror="this.style.display='none'">`:''};
// CAMPO: quantos jogadores por linha (goleiro, defesa, meio, ataque) em cada formação
const LAYOUT={'4-3-3':[1,4,3,3],'3-4-3':[1,3,4,3],'4-4-2':[1,4,4,2],'4-5-1':[1,4,5,1],'5-4-1':[1,5,4,1]};

const COLS2=typeof COL2!=='undefined'?COL2:{};

// VALOR DE MERCADO (em milhões de euros). Fórmula: cresce rápido com o overall, depende da idade e da posição.
// Um jogador pode ter valor fixo definido no Editor (campo "Valor"); nesse caso a fórmula é ignorada.
function valorMercado(p){if(p.vm!=null)return p.vm;const a=p.age,v0=Math.exp(.16*(p.ovr-62)),fa=a<=21?1.5:a<=24?1.25:a<=28?1:a<=31?.7:a<=34?.4:.2,fp=p.pos=='GK'?.8:['ATA','PE','PD','SA'].includes(p.pos)?1.15:p.pos.indexOf('ZG')==0?.95:1;return Math.max(.05,v0*fa*fp)}
const fmtV=v=>v<1?'€'+Math.round(v*100)*10+' mil':'€'+String(v<10?v.toFixed(1):v<100?(Math.round(v*2)/2).toFixed(1):Math.round(v)).replace('.',',').replace(/,0$/,'')+'M';

// ===== CARACTERÍSTICAS (6 critérios) =====
// Cada posição tem 2 características VITAIS (35% do geral cada), 2 IMPORTANTES (15% cada) e 2 IRRELEVANTES (0%).
// Os números são posições na lista ATTR: 0 FIN, 1 PAS, 2 DRI, 3 DEF, 4 VEL, 5 FIS. Para goleiros, "Defesa" = reflexos e posicionamento.
const ATTR=[['FIN','Finalização'],['PAS','Passe'],['DRI','Drible'],['DEF','Defesa'],['VEL','Velocidade'],['FIS','Físico']];
const POSW={GK:{v:[3,5],m:[1,4]},ZGD:{v:[3,5],m:[4,1]},ZGE:{v:[3,5],m:[4,1]},LD:{v:[4,3],m:[1,5]},LE:{v:[4,3],m:[1,5]},VOL:{v:[3,1],m:[5,4]},MC:{v:[1,5],m:[3,2]},MEIA:{v:[1,2],m:[0,4]},MD:{v:[4,1],m:[2,3]},ME:{v:[4,1],m:[2,3]},PD:{v:[4,2],m:[0,1]},PE:{v:[4,2],m:[0,1]},ATA:{v:[0,5],m:[2,4]},SA:{v:[0,2],m:[1,4]}};
// Posições secundárias iniciais (você muda no perfil de cada jogador)
const SECD={PD:['MD'],PE:['ME'],MC:['VOL','MEIA'],MEIA:['MC'],VOL:['MC'],ATA:['SA'],SA:['ATA'],ZGD:[],ZGE:[],LD:[],LE:[],GK:[],MD:['PD'],ME:['PE']};
// FUNÇÕES: cada posição tem funções diferentes. A primeira de cada lista é a padrão (usa os pesos de POSW).
// Formato: [nome, vitais, importantes] com índices de ATTR (0 FIN, 1 PAS, 2 DRI, 3 DEF, 4 VEL, 5 FIS).
const ROLES={GK:[['Goleiro tradicional'],['Goleiro líbero',[3,1],[5,4]]],
ZGD:[['Zagueiro'],['Zagueiro que sai jogando',[3,1],[5,2]],['Zagueiro de cobertura',[3,4],[5,1]]],ZGE:[['Zagueiro'],['Zagueiro que sai jogando',[3,1],[5,2]],['Zagueiro de cobertura',[3,4],[5,1]]],
LD:[['Lateral'],['Lateral defensivo',[3,5],[4,1]],['Lateral apoiador',[4,1],[2,3]],['Ala ofensivo',[4,2],[1,0]]],LE:[['Lateral'],['Lateral defensivo',[3,5],[4,1]],['Lateral apoiador',[4,1],[2,3]],['Ala ofensivo',[4,2],[1,0]]],
VOL:[['Volante'],['Volante de contenção',[3,5],[1,4]],['Regista',[1,2],[3,5]]],MC:[['Meia central'],['Meia de ligação (box-to-box)',[5,4],[1,3]],['Organizador',[1,2],[3,5]]],
MEIA:[['Armador'],['Meia atacante',[0,2],[1,4]],['Meia de movimentação',[2,4],[1,0]]],MD:[['Meia lateral'],['Meia ofensivo',[2,4],[0,1]],['Meia de apoio',[1,3],[4,5]]],ME:[['Meia lateral'],['Meia ofensivo',[2,4],[0,1]],['Meia de apoio',[1,3],[4,5]]],
PD:[['Ponta'],['Ponta que invade',[0,4],[2,1]],['Ponta criador',[1,2],[4,0]]],PE:[['Ponta'],['Ponta que invade',[0,4],[2,1]],['Ponta criador',[1,2],[4,0]]],
ATA:[['Centroavante'],['Pivô',[5,1],[0,2]],['Atacante móvel',[4,0],[2,1]]],SA:[['Segundo atacante'],['Falso 9',[1,2],[0,4]],['Atacante de apoio',[1,0],[2,5]]]};
const roleW=(pos,ro)=>{const r=(ROLES[pos]||[])[ro||0];return r&&r[1]?{v:r[1],m:r[2]}:POSW[pos]};
function ovrAt(p,pos,ro){const w=roleW(pos,ro)||POSW[p.pos]||POSW.MC,a=p.at;if(!a)return p.ovr;return Math.round(.35*(a[w.v[0]]+a[w.v[1]])+.15*(a[w.m[0]]+a[w.m[1]]))}
function genAttrs(p){let s=0;for(const ch of p.name)s=(s*31+ch.charCodeAt(0))>>>0;const r=()=>{s=(s*1664525+1013904223)>>>0;return s/4294967296},w=POSW[p.pos]||POSW.MC,o=p.ovr,a=[0,0,0,0,0,0],cl=x=>Math.max(15,Math.min(99,Math.round(x)));
 [0,1,2,3,4,5].filter(i=>!w.v.includes(i)&&!w.m.includes(i)).forEach(i=>a[i]=cl(o-18+(r()-.5)*16));w.m.forEach(i=>a[i]=cl(o-4+(r()-.5)*12));
 const x=(o-.15*(a[w.m[0]]+a[w.m[1]]))/.7,d=(r()-.5)*8;a[w.v[0]]=cl(x+d);a[w.v[1]]=cl(x-d);return a}
function ensureAttrs(p){if(!p.at)p.at=genAttrs(p);if(!p.sec)p.sec=(SECD[p.pos]||[]).slice()}
