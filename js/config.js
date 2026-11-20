// CONFIGURAÇÕES GERAIS: ligas, cores das ligas, formações e estado do jogo.
const $=q=>document.querySelector(q),rnd=(a,b)=>a+Math.random()*(b-a),pick=a=>a[Math.floor(Math.random()*a.length)],cp=(x,a,b)=>Math.min(b,Math.max(a,x));
const G=p=>({GK:'G',LE:'D',LD:'D',ZGE:'D',ZGD:'D',VOL:'M',MC:'M',MEIA:'M'}[p]||'A');
const FORM={'4-3-3':['GK','LD','ZGD','ZGE','LE','VOL','MC','MEIA','PD','ATA','PE'],'3-4-3':['GK','ZGD','ZGE','ZGD','LD','VOL','MEIA','LE','PD','ATA','PE'],'4-4-2':['GK','LD','ZGD','ZGE','LE','VOL','MC','MEIA','MC','ATA','SA'],'4-5-1':['GK','LD','ZGD','ZGE','LE','VOL','VOL','MC','MEIA','MEIA','ATA'],'5-4-1':['GK','LD','ZGD','ZGE','ZGD','LE','VOL','MC','MEIA','MC','ATA']};
const CP={LD:['LD','LE'],LE:['LE','LD'],ZGD:['ZGD','ZGE'],ZGE:['ZGE','ZGD'],VOL:['VOL','MC'],MC:['MC','MEIA','VOL'],MEIA:['MEIA','MC'],PD:['PD','PE','ATA'],PE:['PE','PD','ATA'],ATA:['ATA','SA'],SA:['SA','ATA'],GK:['GK']};
const tc=s=>s.toLowerCase().replace(/(^|[\s'-])\S/g,m=>m.toUpperCase()),sn=p=>tc(p.name.split(' ').pop());
const LGC={ING:'#BF9000',ITA:'#1155CC'};
const LG={ING:'Golden League Vision (Inglaterra)',ITA:'Superlegea Calcio (Itália)'};
let S=null,nav={p:'home'},H=[],timer=null;
const cl=n=>S.clubs.find(c=>c.n==n),ci=n=>S.clubs.findIndex(c=>c.n==n);
const load=()=>{try{const j=localStorage.getItem('fut3536d');return j?JSON.parse(j):null}catch(e){return null}};
const save=()=>{try{localStorage.setItem('fut3536d',JSON.stringify(S))}catch(e){}};
