// MOTOR DE SIMULAÇÃO: escalação, formações, partida minuto a minuto, calendário.
function auto(c,f){const u=new Set(),o=[];FORM[f].forEach(s=>{let b=null,bs=-1;c.pl.forEach(p=>{if(u.has(p)||p.sus||p.inj||p.del)return;const k=CP[s].indexOf(p.pos);if(k<0)return;const v=p.ovr-k*3;if(v>bs){bs=v;b=p}});
 if(!b)c.pl.forEach(p=>{if(!u.has(p)&&!p.sus&&!p.inj&&!p.del&&p.pos!='GK'&&G(p.pos)==G(s)&&p.ovr>bs){bs=p.ovr;b=p}});if(b){u.add(b);o.push(b)}});return o}
const pw=c=>c.pl.filter(p=>!p.del).map(p=>p.ovr).sort((a,b)=>b-a).slice(0,14).reduce((s,x)=>s+x,0)/14,top3=(c,g)=>{const x=c.pl.filter(p=>!p.del&&G(p.pos)==g).map(p=>p.ovr).sort((a,b)=>b-a).slice(0,3);return x.reduce((s,v)=>s+v,0)/(x.length||1)};
function lineup(c,o){const d=o?pw(c)-pw(o):0,W=d>=3?{'4-3-3':70,'3-4-3':15,'4-4-2':15}:d<=-3?{'4-3-3':25,'4-4-2':30,'4-5-1':20,'5-4-1':25}:{'4-3-3':55,'4-4-2':25,'3-4-3':5,'4-5-1':10,'5-4-1':5};
 if(top3(c,'A')<top3(c,'M')-4){delete W['4-3-3'];delete W['3-4-3']}c.cf=wpick(Object.keys(W),k=>W[k]);return auto(c,c.cf)}
const avg=(l,g)=>{const x=l.filter(p=>G(p.pos)==g);return x.length?x.reduce((s,p)=>s+p.ovr,0)/x.length:50};
function wpick(a,f){const w=a.map(f),t=w.reduce((x,y)=>x+y,0);if(!t)return a[0];let r=Math.random()*t;for(let i=0;i<a.length;i++){r-=w[i];if(r<=0)return a[i]}return a[a.length-1]}
function mkfix(ns){const n=ns.length,a=ns.slice(),R=[];for(let r=0;r<n-1;r++){const m=[];for(let i=0;i<n/2;i++){let h=a[i],b=a[n-1-i];if(r%2)[h,b]=[b,h];m.push([h,b])}R.push(m);a.splice(1,0,a.pop())}return R.concat(R.map(m=>m.map(([h,b])=>[b,h])))}
function sim(H,A){
 const ts=[{s:0,o:0},{s:0,o:0}],used=new Set(),hurt=[],C=[H,A],L=[lineup(H,A),lineup(A,H)],ban=[],yel=new Map(),sc=[0,0],ev=[],tot=90+Math.floor(rnd(2,6));
 L.flat().forEach(p=>used.add(p));const X0=L.map(l=>l.slice()),mm=new Map(),M=p=>{if(!mm.has(p))mm.set(p,{g:0,a:0,y:0,r:0,i:0,in:0,out:0});return mm.get(p)};const st=L.map((l,i)=>{const b=(C[i].tec[1]-80)*.15+C[i].mor;return{g:avg(l,'G'),d:avg(l,'D')+b,m:avg(l,'M')+b,a:avg(l,'A')+b}});
 const add=(m,t,k,s)=>ev.push({m,t,k,s});add(0,`Escalações: ${H.n} (${H.cf}) x ${A.n} (${A.cf})`,'i');
 const card=(t,i,p,red)=>{if(!red)p.y++;M(p).y+=red?0:1;const k=(yel.get(p)||0)+1;yel.set(p,k);
  if(red||k>=2){p.r++;M(p).r=1;M(p).out=t;ban.push([p,red?pick([1,1,1,1,1,1,1,2,2,3]):1]);L[i]=L[i].filter(x=>x!=p);add(t,`🟥 Cartão vermelho${red?' direto':' (2º amarelo)'} para ${sn(p)} (${C[i].n})! Time com um a menos.`,'c',i)}
  else{add(t,`🟨 Cartão amarelo para ${sn(p)} (${C[i].n}).`,'c',i);if(p.y%3==0){ban.push([p,1]);add(t,`${sn(p)} recebeu o 3º amarelo e desfalca o time na próxima rodada.`,'c',i)}}};
 for(let t=1;t<=tot;t++){
  const p0=(st[0].m*1.04)**4,p1=st[1].m**4,s=Math.random()<p0/(p0+p1)?0:1,o=1-s;
  if(Math.random()<.185){
   const sh=wpick(L[s],p=>G(p.pos)=='G'?0:({A:3,M:1.2,D:.25}[G(p.pos)])*Math.max(p.ovr-55,1)**2),n=sn(sh);
   ts[s].s++;if(Math.random()<.55){ts[s].o++;
    const gp=cp(.3+(sh.ovr*.5+st[s].a*.5-(st[o].g*.55+st[o].d*.45))*.013,.08,.6),gk=L[o].find(p=>G(p.pos)=='G')||L[o][0];
    if(Math.random()<gp){sc[s]++;sh.g++;M(sh).g++;let as=null;
     if(Math.random()<.7){as=wpick(L[s].filter(p=>p!=sh),p=>G(p.pos)=='G'?0:({A:1.5,M:2.5,D:.8}[G(p.pos)])*Math.max(p.ovr-55,1));if(as){as.a++;M(as).a++}}
     add(t,`⚽ GOOOL! ${n} (${C[s].n}) ${pick(['bate cruzado e estufa a rede!','cabeceia sem chance para o goleiro!','recebe na área e finaliza com categoria!','solta uma bomba de fora da área!','completa para o fundo das redes!'])}${as?' Assistência de '+sn(as)+'.':''} ${sc[0]} x ${sc[1]}`,'g',s)}
    else add(t,pick([`${n} chuta firme, mas ${sn(gk)} faz grande defesa!`,`${sn(gk)} espalma o chute de ${n}!`,`${n} finaliza e a bola explode no travessão!`,`${n} cabeceia no canto, ${sn(gk)} se estica e defende!`]),'',s)}
   else add(t,pick([`${n} arrisca de longe e a bola passa perto do gol.`,`${n} cabeceia para fora.`,`${n} finaliza, mas a zaga bloqueia.`,`${n} chuta por cima do travessão.`]),'',s)}
  if(Math.random()<.04){const i=Math.random()<.5?0:1;card(t,i,wpick(L[i],p=>({G:.1,D:1.3,M:1.2,A:.8}[G(p.pos)]*(yel.get(p)?.2:1))),0)}
  if(Math.random()<.0005){const i=Math.random()<.5?0:1;card(t,i,wpick(L[i],p=>({G:.2,D:1.3,M:1,A:.7}[G(p.pos)])),1)}
  const sw=(i,t,p,w)=>{const b=C[i].pl.filter(x=>!used.has(x)&&!x.sus&&!x.inj&&!x.del&&G(x.pos)==G(p.pos)).sort((a,b)=>b.ovr-a.ovr)[0];if(!b)return false;used.add(b);M(b).in=t;M(p).out=t;L[i]=L[i].map(x=>x==p?b:x);add(t,`🔁 ${C[i].n}: sai ${sn(p)}, entra ${sn(b)}${w?' (lesão)':''}.`,'',i);return true};
  if(t==62||t==72||t==80)[0,1].forEach(i=>{const p=pick(L[i].filter(x=>G(x.pos)!='G'));if(p&&Math.random()<.8)sw(i,t,p,0)});
  if(Math.random()<.0008){const i=Math.random()<.5?0:1,p=pick(L[i].filter(x=>G(x.pos)!='G'));if(p){hurt.push(p);M(p).i=1;M(p).out=t;add(t,`🚑 ${sn(p)} (${C[i].n}) sente e precisa sair, lesionado.`,'c',i);if(!sw(i,t,p,1))L[i]=L[i].filter(x=>x!=p)}}
  if(t==45)add(45,`Intervalo: ${C[0].n} ${sc[0]} x ${sc[1]} ${C[1].n}`,'i');
 }
 add(tot,`Fim de jogo: ${C[0].n} ${sc[0]} x ${sc[1]} ${C[1].n}`,'i');
 C.forEach(c=>c.pl.forEach(p=>{if(p.sus>0)p.sus--;if(p.inj>0)p.inj--}));ban.forEach(([p,n])=>p.sus=n);hurt.forEach(p=>p.inj=2+Math.floor(rnd(0,6)));used.forEach(p=>p.j++);
 [0,1].forEach(i=>{const g=X0[i].find(p=>G(p.pos)=='G');if(g&&sc[1-i]==0)g.cs=(g.cs||0)+1});
 const lu=[0,1].map(i=>[...X0[i],...C[i].pl.filter(p=>mm.has(p)&&!X0[i].includes(p))].map(p=>{const q=M(p);return[C[i].pl.indexOf(p),q.g,q.a,q.y,q.r,q.i,q.in,q.out]}));
 return{hg:sc[0],ag:sc[1],ev,tot,ts,lu,fm:[H.cf,A.cf]}}

