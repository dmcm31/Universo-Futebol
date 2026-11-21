// CONFIGURAÇÕES GERAIS: ligas, cores das ligas, formações e estado do jogo.
const $=q=>document.querySelector(q),rnd=(a,b)=>a+Math.random()*(b-a),pick=a=>a[Math.floor(Math.random()*a.length)],cp=(x,a,b)=>Math.min(b,Math.max(a,x));
const G=p=>({GK:'G',LE:'D',LD:'D',ZGE:'D',ZGD:'D',VOL:'M',MC:'M',MEIA:'M'}[p]||'A');
const FORM={'4-3-3':['GK','LD','ZGD','ZGE','LE','VOL','MC','MEIA','PD','ATA','PE'],'3-4-3':['GK','ZGD','ZGE','ZGD','LD','VOL','MEIA','LE','PD','ATA','PE'],'4-4-2':['GK','LD','ZGD','ZGE','LE','VOL','MC','MEIA','MC','ATA','SA'],'4-5-1':['GK','LD','ZGD','ZGE','LE','VOL','VOL','MC','MEIA','MEIA','ATA'],'5-4-1':['GK','LD','ZGD','ZGE','ZGD','LE','VOL','MC','MEIA','MC','ATA']};
const CP={LD:['LD','LE'],LE:['LE','LD'],ZGD:['ZGD','ZGE'],ZGE:['ZGE','ZGD'],VOL:['VOL','MC'],MC:['MC','MEIA','VOL'],MEIA:['MEIA','MC'],PD:['PD','PE','ATA'],PE:['PE','PD','ATA'],ATA:['ATA','SA'],SA:['SA','ATA'],GK:['GK']};
const CLUBN=new Set(DATA.map(c=>c.n)),tc=s=>CLUBN.has(s)?s:s.toLowerCase().replace(/(^|[\s'-])\S/g,m=>m.toUpperCase()),sn=p=>tc(p.name.split(' ').pop());
const LGC={ING:'#BF9000',ITA:'#1155CC'};
const LG={ING:'Golden League Vision (Inglaterra)',ITA:'Superlegea Calcio (Itália)'};
let S=null,nav={p:'home'},H=[],timer=null;
const cl=n=>S.clubs.find(c=>c.n==n),ci=n=>S.clubs.findIndex(c=>c.n==n);
const load=()=>{try{const j=localStorage.getItem('fut3536f');return j?JSON.parse(j):null}catch(e){return null}};
const save=()=>{try{localStorage.setItem('fut3536d',JSON.stringify(S))}catch(e){}};

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
