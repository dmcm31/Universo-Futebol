// MOTOR DE SIMULAÇÃO: escalação, formações, partida minuto a minuto, calendário.
const okp=p=>p&&!p.sus&&!p.inj&&!p.del;
const ELIG=(p,s)=>p.pos==s||(p.sec||[]).includes(s)?0:(()=>{const k=CP[s].indexOf(p.pos);return k>0?k*3:null})();
const sco=(p,s,r)=>{const e=ELIG(p,s);return e==null?null:rt(p,s,r)-e};
const ADJ={G:[],D:['M'],M:['D','A'],A:['M']};
function bestFor(c,s,u,pool,fb,r){let b=null,bs=-99;(pool||c.pl).forEach(p=>{if(u.has(p)||!okp(p))return;let v=sco(p,s,r);if(v==null){if(!fb)return;const g=G(p.pos),gs=G(s);if((gs=='G')!=(g=='G'))return;const pen=g==gs?8:ADJ[gs].includes(g)?12:null;if(pen==null)return;v=rt(p,s,r)-pen}if(v>bs){bs=v;b=p}});return b?{p:b,v:bs}:null}
function auto(c,f){const u=new Set(),o=[];FORM[f].forEach(s=>{const b=bestFor(c,s,u,null,true);if(b){u.add(b.p);b.p._s=s;b.p._r=0;o.push(b.p)}});return o}
const pw=c=>c.pl.filter(p=>!p.del).map(p=>p.ovr).sort((a,b)=>b-a).slice(0,14).reduce((s,x)=>s+x,0)/14,top3=(c,g)=>{const x=c.pl.filter(p=>!p.del&&G(p.pos)==g).map(p=>p.ovr).sort((a,b)=>b-a).slice(0,3);return x.reduce((s,v)=>s+v,0)/(x.length||1)};
const FM={B:3,N:0,R:-3,F:-2},eff=p=>rt(p,p._s,p._r),rt=(p,s,r)=>ovrAt(p,s||p.pos,r)+(FM[p.fase]||0);
const pickF=c=>{const W={'4-3-3':72,'4-4-2':23,'3-4-3':5};if(top3(c,'A')<top3(c,'M')-4){delete W['4-3-3'];delete W['3-4-3']}return wpick(Object.keys(W),k=>W[k])};
const ORD=(p,z)=>({GK:0,LD:z?20:10,ZGD:11,ZGE:12,LE:z?24:13,VOL:21,MC:22,MEIA:23,MD:20.2,ME:23.8,PD:30,ATA:31,SA:32,PE:33}[p]);
const nZ=pos=>pos.filter(p=>p[0]=='Z').length==3&&pos.filter(p=>G(p)=='M').length<=3;
function labelOf(pos){const z=nZ(pos);let d=0,m=0,a=0;pos.forEach(p=>{if(p=='GK')return;if(p[0]=='Z')d++;else if(p=='LD'||p=='LE')z?m++:d++;else if(G(p)=='M')m++;else a++});return d+'-'+m+'-'+a}
const mkMain=(c,f)=>({f,pos:FORM[f].slice(),xi:auto(c,f).map(p=>c.pl.indexOf(p)),rl:Array(11).fill(0),in:Array.from({length:11},()=>[]),ti:{...DTI}});
function fixMain(c){const m=c.main,u=new Set(m.xi.map(k=>c.pl[k]).filter(p=>p&&!p.del));m.xi=m.xi.map((k,i)=>{if(c.pl[k]&&!c.pl[k].del)return k;const b=bestFor(c,m.pos[i],u,null,true,(m.rl||[])[i]);if(!b)return -1;u.add(b.p);return c.pl.indexOf(b.p)})}
function fit(c,pos,base,rl,ins){rl=rl||[];ins=ins||[];const u=new Set(),inX=new Set(base.filter(Boolean)),o=[];
 pos.forEach((s,i)=>{const r=rl[i]||0;let m=okp(base[i])&&!u.has(base[i])?base[i]:null;const a=bestFor(c,s,u,c.pl.filter(p=>!inX.has(p)),false,r);
  if(m){const e=sco(m,s,r),mv=e==null?rt(m,s,r)-8:e;if(a&&a.v-mv>=2)m=a.p}else m=a?a.p:(bestFor(c,s,u,null,true,r)||{}).p;
  if(m){u.add(m);m._s=s;m._r=r;m._in=ins[i]||[];o.push(m)}});return o}
function lineup(c,ov){let m=ov||c.main;if(!m)m=c.main=mkMain(c,pickF(c));if(!m.pos)m.pos=FORM[m.f].slice();const z=nZ(m.pos),ix=m.pos.map((p,i)=>i).sort((a,b)=>ORD(m.pos[a],z)-ORD(m.pos[b],z)),pos=ix.map(i=>m.pos[i]),rl=ix.map(i=>(m.rl||[])[i]||0),ins=ix.map(i=>(m.in||[])[i]||[]);c._ti=m.ti||DTI;c.cf=labelOf(pos);
 if(ov){const o=[];ix.forEach(i=>{const p=c.pl[m.xi[i]];if(p){p._s=m.pos[i];p._r=(m.rl||[])[i]||0;p._in=(m.in||[])[i]||[];o.push(p)}});return o}return fit(c,pos,ix.map(i=>c.pl[m.xi[i]]),rl,ins)}
function proposal(c){let m=c.main;if(!m)m=c.main=mkMain(c,pickF(c));if(!m.pos)m.pos=FORM[m.f].slice();const z=nZ(m.pos),ix=m.pos.map((p,i)=>i).sort((a,b)=>ORD(m.pos[a],z)-ORD(m.pos[b],z)),pos=ix.map(i=>m.pos[i]),rl=ix.map(i=>(m.rl||[])[i]||0),ins=ix.map(i=>(m.in||[])[i]||[]),xi=fit(c,pos,ix.map(i=>c.pl[m.xi[i]]),rl,ins).map(p=>c.pl.indexOf(p));while(xi.length<pos.length)xi.push(-1);return{pos,xi,rl,in:ins,ti:{...DTI,...(m.ti||{})}}}
function phase(C,used,mm){C.forEach(c=>c.pl.forEach(p=>{if(p.del)return;
 if(!used.has(p)){p.nj=(p.nj||0)+1;if(p.nj>=3&&!p.inj)p.fase='F';return}
 p.nj=0;const q=mm.get(p)||{},f=p.fase||'N',r=Math.random(),con=p.tr=='c',hot=(q.g||q.a)?.15:0;let n;
 if(f=='F')n='N';else if(con)n=f=='B'?(r<.85?'B':'N'):(r<.4+hot?'B':'N');
 else if(f=='N')n=r<.22+hot?'B':r<.4+hot?'R':'N';else if(f=='B')n=r<.55?'B':'N';else n=r<.5?'R':'N';
 if(q.r&&!con)n='R';p.fase=n}))}
const avg=(l,g)=>{const x=l.filter(p=>G(p._s||p.pos)==g);return x.length?x.reduce((s,p)=>s+eff(p),0)/x.length:50};
function wpick(a,f){const w=a.map(f),t=w.reduce((x,y)=>x+y,0);if(!t)return a[0];let r=Math.random()*t;for(let i=0;i<a.length;i++){r-=w[i];if(r<=0)return a[i]}return a[a.length-1]}
function mkfix(ns){const n=ns.length,a=ns.slice(),R=[];for(let r=0;r<n-1;r++){const m=[];for(let i=0;i<n/2;i++){let h=a[i],b=a[n-1-i];if(r%2)[h,b]=[b,h];m.push([h,b])}R.push(m);a.splice(1,0,a.pop())}return R.concat(R.map(m=>m.map(([h,b])=>[b,h])))}
function sim(H,A,ov){
 const ts=[{s:0,o:0},{s:0,o:0}],used=new Set(),hurt=[],C=[H,A],L=[lineup(H,ov&&ov.h),lineup(A,ov&&ov.a)],ban=[],yel=new Map(),sc=[0,0],ev=[],tot=90+Math.floor(rnd(2,6));
 L.flat().forEach(p=>used.add(p));const X0=L.map(l=>l.slice()),mm=new Map(),nsub=[0,0],plan=[0,1].map(()=>{const s=new Set();while(s.size<3)s.add(52+Math.floor(Math.random()*34));return[...s]}),fz=new Map(C.flatMap(c=>c.pl.map(p=>[p,p.fase||'N']))),M=p=>{if(!mm.has(p))mm.set(p,{g:0,a:0,y:0,r:0,i:0,in:0,out:0});return mm.get(p)};const st=L.map((l,i)=>{const b=(C[i].tec[1]-80)*.15+C[i].mor;const t=C[i]._ti||DTI,men=t.men-2,pm=l.filter(p=>p._in&&p._in.includes('marc')).length,pr=l.filter(p=>p._in&&p._in.includes('recu')).length;
  return{g:avg(l,'G'),d:avg(l,'D')+b-men*1.4+(t.lin==0?1.2:t.lin==2?-1:0)-(t.pre-1)*.7-(t.rit-1)*.5+Math.min(pm,3)*.3+Math.min(pr,3)*.25,m:avg(l,'M')+b+(t.pre-1)*1.3+(t.pas==0?.9:t.pas==2?-.9:0)+(t.lin-1)*.6,a:avg(l,'A')+b+men*1.6+(t.rit-1)*.9+(t.lar-1)*.5+(t.pas==2?.4:0)}});
 const add=(m,t,k,s)=>ev.push({m,t,k,s});add(0,`Escalações: ${H.n} (${H.cf}) x ${A.n} (${A.cf})`,'i');
 const card=(t,i,p,red)=>{if(!red)p.y++;M(p).y+=red?0:1;const k=(yel.get(p)||0)+1;yel.set(p,k);
  if(red||k>=2){p.r++;M(p).r=1;M(p).out=t;ban.push([p,red?pick([1,1,1,1,1,1,1,2,2,3]):1]);L[i]=L[i].filter(x=>x!=p);add(t,`🟥 Cartão vermelho${red?' direto':' (2º amarelo)'} para ${sn(p)} (${C[i].n})! Time com um a menos.`,'c',i)}
  else{add(t,`🟨 Cartão amarelo para ${sn(p)} (${C[i].n}).`,'c',i);if(p.y%3==0){ban.push([p,1]);add(t,`${sn(p)} recebeu o 3º amarelo e desfalca o time na próxima rodada.`,'c',i)}}};
 for(let t=1;t<=tot;t++){
  const p0=(st[0].m*1.04)**4,p1=st[1].m**4,s=Math.random()<p0/(p0+p1)?0:1,o=1-s;
  if(Math.random()<.185){
   const sh=wpick(L[s],p=>G(p.pos)=='G'?0:({A:3,M:1.2,D:.25}[G(p._s||p.pos)])*Math.max(eff(p)-55,1)**2*((p.at?p.at[0]:eff(p))/70)**2*PW(p,{chute:1.5,avan:1.5,dri:1.15,recu:.5})),n=sn(sh);
   ts[s].s++;if(Math.random()<.55){ts[s].o++;
    const gp=cp(.3+((sh.at?sh.at[0]*.4+eff(sh)*.6:eff(sh))*.5+st[s].a*.5-(st[o].g*.55+st[o].d*.45))*.013,.08,.6),gk=L[o].find(p=>G(p.pos)=='G')||L[o][0];
    if(Math.random()<gp){sc[s]++;sh.g++;M(sh).g++;let as=null;
     if(Math.random()<.7){as=wpick(L[s].filter(p=>p!=sh),p=>G(p.pos)=='G'?0:({A:1.5,M:2.5,D:.8}[G(p._s||p.pos)])*Math.max(eff(p)-55,1)*((p.at?p.at[1]:eff(p))/70)*PW(p,{pas:1.5,dri:1.3,avan:1.2}));if(as){as.a++;M(as).a++}}
     add(t,`⚽ GOOOL! ${n} (${C[s].n}) ${pick(['bate cruzado e estufa a rede!','cabeceia sem chance para o goleiro!','recebe na área e finaliza com categoria!','solta uma bomba de fora da área!','completa para o fundo das redes!'])}${as?' Assistência de '+sn(as)+'.':''} ${sc[0]} x ${sc[1]}`,'g',s)}
    else add(t,pick([`${n} chuta firme, mas ${sn(gk)} faz grande defesa!`,`${sn(gk)} espalma o chute de ${n}!`,`${n} finaliza e a bola explode no travessão!`,`${n} cabeceia no canto, ${sn(gk)} se estica e defende!`]),'',s)}
   else add(t,pick([`${n} arrisca de longe e a bola passa perto do gol.`,`${n} cabeceia para fora.`,`${n} finaliza, mas a zaga bloqueia.`,`${n} chuta por cima do travessão.`]),'',s)}
  if(Math.random()<.04){const i=Math.random()<.5?0:1;card(t,i,wpick(L[i],p=>({G:.1,D:1.3,M:1.2,A:.8}[G(p.pos)]*(yel.get(p)?.2:1)*PW(p,{marc:1.8}))),0)}
  if(Math.random()<.0005){const i=Math.random()<.5?0:1;card(t,i,wpick(L[i],p=>({G:.2,D:1.3,M:1,A:.7}[G(p.pos)])),1)}
  const sw=(i,t,p,w)=>{if(nsub[i]>=3)return false;const b=C[i].pl.filter(x=>!used.has(x)&&!x.sus&&!x.inj&&!x.del&&G(x.pos)==G(p._s||p.pos)).sort((a,b)=>rt(b,p._s,p._r)-rt(a,p._s,p._r))[0];if(!b)return false;used.add(b);nsub[i]++;b._s=p._s;b._r=p._r;b._in=p._in;M(b).in=t;M(p).out=t;L[i]=L[i].map(x=>x==p?b:x);add(t,`🔁 ${C[i].n}: sai ${sn(p)}, entra ${sn(b)}${w?' (lesão)':''}.`,'',i);return true};
  if(plan[0].includes(t)||plan[1].includes(t))[0,1].forEach(i=>{if(!plan[i].includes(t))return;const c=L[i].filter(x=>G(x.pos)!='G').sort(()=>Math.random()-.5);for(const p of c)if(sw(i,t,p,0))break});
  if(Math.random()<.0008){const i=Math.random()<.5?0:1,p=pick(L[i].filter(x=>G(x.pos)!='G'));if(p){hurt.push(p);M(p).i=1;M(p).out=t;add(t,`🚑 ${sn(p)} (${C[i].n}) sente e precisa sair, lesionado.`,'c',i);if(!sw(i,t,p,1))L[i]=L[i].filter(x=>x!=p)}}
  if(t==65)[0,1].forEach(i=>{const x=C[i]._ti||DTI;if(x.pre==2||x.rit==2){const k=(x.pre==2&&x.rit==2)?1.6:1;st[i].m-=1.6*k;st[i].a-=1.2*k;st[i].d-=.6*k}});if(t==45)add(45,`Intervalo: ${C[0].n} ${sc[0]} x ${sc[1]} ${C[1].n}`,'i');
 }
 add(tot,`Fim de jogo: ${C[0].n} ${sc[0]} x ${sc[1]} ${C[1].n}`,'i');
 C.forEach(c=>c.pl.forEach(p=>{if(p.sus>0)p.sus--;if(p.inj>0)p.inj--}));ban.forEach(([p,n])=>p.sus=n);hurt.forEach(p=>p.inj=2+Math.floor(rnd(0,6)));used.forEach(p=>p.j++);phase(C,used,mm);
 [0,1].forEach(i=>{const g=X0[i].find(p=>G(p.pos)=='G');if(g&&sc[1-i]==0)g.cs=(g.cs||0)+1});
 const lu=[0,1].map(i=>[...X0[i],...C[i].pl.filter(p=>mm.has(p)&&!X0[i].includes(p))].map(p=>{const q=M(p);return[C[i].pl.indexOf(p),q.g,q.a,q.y,q.r,q.i,q.in,q.out,fz.get(p)]}));
 return{hg:sc[0],ag:sc[1],ev,tot,ts,lu,fm:[H.cf,A.cf]}}


function PW(p,m){return(p._in||[]).reduce((s,k)=>s*(m[k]||1),1)}
