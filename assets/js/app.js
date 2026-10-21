/* மங்கல அழைப்பு – Mangala Azhaippu | app.js */
const PHONE='+919876543210',PHONE_TXT='+91 98765 43210',$=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const LS={get:(k,d)=>{try{const v=JSON.parse(localStorage.getItem(k));return v??d}catch(e){return d}},set:(k,v)=>localStorage.setItem(k,JSON.stringify(v))};
const inr=n=>'₹'+Number(n).toLocaleString('en-IN');
const P=id=>PRODUCTS.find(p=>p.id==id);
const q=k=>new URLSearchParams(location.search).get(k);
function hash(s){let h1=0xdeadbeef,h2=0x41c6ce57;for(let i=0;i<s.length;i++){const c=s.charCodeAt(i);h1=Math.imul(h1^c,2654435761);h2=Math.imul(h2^c,1597334677)}h1=Math.imul(h1^(h1>>>16),2246822507)^Math.imul(h2^(h2>>>13),3266489909);h2=Math.imul(h2^(h2>>>16),2246822507)^Math.imul(h1^(h1>>>13),3266489909);return (4294967296*(2097151&h2)+(h1>>>0)).toString(36)}
/* ---------- Auth (demo-grade, browser localStorage only) ---------- */
const Auth={
 users:()=>LS.get('ma_users',[]),
 current(){const e=LS.get('ma_session',null);return e?this.users().find(u=>u.email===e)||null:null},
 signup(o){const us=this.users();if(us.some(u=>u.email===o.email))return'This email is already registered. Please sign in.';
  us.push({name:o.name,email:o.email,phone:o.phone,pw:hash('ma|'+o.pw),joined:new Date().toISOString(),address:''});LS.set('ma_users',us);this.login(o.email);return null},
 signin(email,pw){const u=this.users().find(u=>u.email===email);if(!u||u.pw!==hash('ma|'+pw))return'Wrong email or password.';this.login(email);return null},
 login(email){const g=LS.get('ma_data_guest',null);LS.set('ma_session',email);if(g&&g.cart&&g.cart.length){const d=Store.load();d.cart.push(...g.cart);Store.save(d);localStorage.removeItem('ma_data_guest')}},
 logout(){localStorage.removeItem('ma_session');location.href='index.html'}
};
/* ---------- Per-user data: cart, wishlist, orders, callbacks ---------- */
const Store={key:()=>'ma_data_'+(Auth.current()?.email||'guest'),
 load(){return LS.get(this.key(),{cart:[],wish:[],orders:[],calls:[]})},save(d){LS.set(this.key(),d);updateBadge()}};
const lineTotal=it=>{const p=P(it.id);return it.mode==='digital'?p.digital:p.price*it.qty};
function toast(msg,type='success'){const t=document.createElement('div');t.className='toast-box';t.innerHTML=`<div class="toast show align-items-center text-bg-${type==='success'?'success':'danger'} border-0"><div class="d-flex"><div class="toast-body">${msg}</div></div></div>`;document.body.append(t);setTimeout(()=>t.remove(),2600)}
function updateBadge(){const n=Store.load().cart.length;$$('.cart-count').forEach(e=>{e.textContent=n;e.style.display=n?'':'none'})}
function addToCart(o){const d=Store.load();d.cart.push({uid:Date.now()+Math.random(),...o});Store.save(d);toast('Added to cart 🛒')}
function toggleWish(id){const d=Store.load();const i=d.wish.indexOf(id);i<0?d.wish.push(id):d.wish.splice(i,1);Store.save(d);toast(i<0?'Saved to wishlist ♥':'Removed from wishlist');return i<0}
/* ---------- Layout ---------- */
const NAV=[['index.html','Home','home'],['templates.html','Templates','templates'],['packages.html','Packages','packages'],['about.html','About','about'],['contact.html','Contact / Call','contact']];
function layout(){
 const pg=document.body.dataset.page,u=Auth.current();
 $('#nav').innerHTML=`<nav class="navbar navbar-expand-lg fixed-top"><div class="container">
 <a class="navbar-brand d-flex align-items-center gap-2" href="index.html"><img src="assets/img/logo.png" width="46" alt="logo"><span><span class="brand-ta ta">மங்கல அழைப்பு</span><span class="brand-en">MANGALA AZHAIPPU</span></span></a>
 <button class="navbar-toggler bg-light" data-bs-toggle="collapse" data-bs-target="#nv"><span class="navbar-toggler-icon"></span></button>
 <div class="collapse navbar-collapse" id="nv"><ul class="navbar-nav mx-auto">${NAV.map(n=>`<li class="nav-item"><a class="nav-link ${pg===n[2]?'active':''}" href="${n[0]}">${n[1]}</a></li>`).join('')}</ul>
 <div class="d-flex align-items-center gap-2 flex-wrap">
 <a class="btn btn-sm btn-outline-light" href="tel:${PHONE}"><i class="bi bi-telephone-fill"></i> ${PHONE_TXT}</a>
 <a class="btn btn-sm btn-gold position-relative" href="cart.html"><i class="bi bi-bag-heart-fill"></i> Cart <span class="cart-count badge rounded-pill bg-danger"></span></a>
 ${u?`<div class="dropdown"><button class="btn btn-sm btn-light dropdown-toggle" data-bs-toggle="dropdown"><i class="bi bi-person-circle"></i> ${u.name.split(' ')[0]}</button><ul class="dropdown-menu dropdown-menu-end"><li><a class="dropdown-item" href="account.html">My Account</a></li><li><a class="dropdown-item" href="account.html#orders">My Orders</a></li><li><a class="dropdown-item" href="account.html#wish">Wishlist</a></li><li><hr class="dropdown-divider"></li><li><a class="dropdown-item" href="#" id="lo">Sign out</a></li></ul></div>`
 :`<a class="btn btn-sm btn-outline-light" href="signin.html">Sign in</a><a class="btn btn-sm btn-gold" href="signup.html">Sign up</a>`}
 </div></div></div></nav>`;
 $('#lo')?.addEventListener('click',e=>{e.preventDefault();Auth.logout()});
 $('#foot').innerHTML=`<footer><div class="container"><div class="row g-4">
 <div class="col-lg-4"><div class="d-flex align-items-center gap-2 mb-2"><img src="assets/img/logo.png" width="52"><div><div class="brand-ta ta" style="color:var(--gold2);font-size:1.4rem">மங்கல அழைப்பு</div><small>Mangala Azhaippu</small></div></div><p class="small">திருமண அழைப்பிதழ்கள் – அழகிய வடிவமைப்பு, அன்பான வரவேற்பு. Wedding invitation designs made with Tamil tradition and modern art.</p></div>
 <div class="col-6 col-lg-2"><h6>Explore</h6>${NAV.map(n=>`<div><a href="${n[0]}">${n[1]}</a></div>`).join('')}</div>
 <div class="col-6 col-lg-3"><h6>Collections</h6>${['Traditional','Royal','Floral','Christian','Muslim','Modern'].map(c=>`<div><a href="templates.html?cat=${c}">${c}</a></div>`).join('')}</div>
 <div class="col-lg-3"><h6>Call us</h6><div><a href="tel:${PHONE}"><i class="bi bi-telephone"></i> ${PHONE_TXT}</a></div><div><a href="https://wa.me/${PHONE.slice(1)}"><i class="bi bi-whatsapp"></i> WhatsApp</a></div><div><i class="bi bi-envelope"></i> hello@mangalaazhaippu.in</div><div class="small mt-2">Mon–Sat 9 AM – 8 PM<br>Chennai, Tamil Nadu</div></div></div>
 <hr style="border-color:#c9a24b55"><div class="text-center small">© ${new Date().getFullYear()} மங்கல அழைப்பு · Mangala Azhaippu. All rights reserved.</div></div></footer>
 <div class="float-btns"><a class="fb wa" href="https://wa.me/${PHONE.slice(1)}" target="_blank"><i class="bi bi-whatsapp"></i></a><a class="fb call" href="tel:${PHONE}" title="Call now"><i class="bi bi-telephone-fill"></i></a></div>
 <div class="modal fade" id="cm" tabindex="-1"><div class="modal-dialog modal-dialog-centered modal-lg"><div class="modal-content"><div class="modal-header"><h5 class="modal-title" id="cmT"></h5><button class="btn-close" data-bs-dismiss="modal"></button></div>
 <div class="modal-body"><div class="row g-3"><div class="col-md-4"><img id="cmI" class="img-fluid rounded shadow"></div><div class="col-md-8"><div class="row g-2">
 <div class="col-12"><label class="form-label small">Invitation type</label><div class="btn-group w-100"><input type="radio" class="btn-check" name="cmode" id="m1" value="print" checked><label class="btn btn-outline-gold" for="m1">🖨 Printed cards</label><input type="radio" class="btn-check" name="cmode" id="m2" value="digital"><label class="btn btn-outline-gold" for="m2">📱 Digital e-invite</label></div></div>
 <div class="col-6" id="qtyBox"><label class="form-label small">Quantity (min 50)</label><input type="number" id="cq" class="form-control" value="100" min="50" step="10"></div>
 <div class="col-6"><label class="form-label small">Wedding date</label><input type="date" id="cd" class="form-control"></div>
 <div class="col-6"><label class="form-label small">Groom name</label><input id="c1" class="form-control" placeholder="Groom"></div><div class="col-6"><label class="form-label small">Bride name</label><input id="c2" class="form-control" placeholder="Bride"></div>
 <div class="col-12"><label class="form-label small">Venue</label><input id="cv" class="form-control" placeholder="Mandapam, City"></div></div>
 <div class="d-flex justify-content-between align-items-center mt-3"><div>Total <b class="fs-4" id="cTot" style="color:var(--maroon)"></b></div><div class="d-flex gap-2"><button class="btn btn-outline-gold" id="cAdd"><i class="bi bi-cart-plus"></i> Add to cart</button><button class="btn btn-gold" id="cBuy"><i class="bi bi-lightning-charge-fill"></i> Buy now</button></div></div></div></div></div></div></div></div>`;
 updateBadge();setupCustomize();
}
const obs=new IntersectionObserver((es)=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');obs.unobserve(e.target)}}),{threshold:.1});
let CUR=null,CM=null;
function setupCustomize(){
 CM=new bootstrap.Modal('#cm');
 const calc=()=>{const mode=$('input[name=cmode]:checked').value;$('#qtyBox').style.display=mode==='print'?'':'none';$('#cTot').textContent=inr(lineTotal({id:CUR?.id||1,mode,qty:+$('#cq').value||50}))};
 $$('input[name=cmode],#cq').forEach(e=>e.addEventListener('input',calc));
 const item=()=>({id:CUR.id,mode:$('input[name=cmode]:checked').value,qty:Math.max(50,+$('#cq').value||50),n1:$('#c1').value,n2:$('#c2').value,date:$('#cd').value,venue:$('#cv').value});
 $('#cAdd').onclick=()=>{addToCart(item());CM.hide()};
 $('#cBuy').onclick=()=>{addToCart(item());location.href='cart.html#checkout'};
 window.openCustomize=id=>{CUR=P(id);$('#cmT').textContent='Customize – '+CUR.name;$('#cmI').src='assets/cards/'+CUR.img;$('#c1').value=CUR.n1||'';calc();CM.show()};
}
function cardHTML(p,col='col-6 col-md-4 col-lg-3'){const w=Store.load().wish.includes(p.id);
 return `<div class="${col} reveal"><div class="tcard tilt"><div class="timg"><a href="product.html?id=${p.id}"><img src="assets/cards/${p.img}" loading="lazy" alt="${p.name}"></a><span class="badge-cat">${p.cat}</span><button class="wish" data-w="${p.id}"><i class="bi bi-heart${w?'-fill':''}"></i></button></div>
 <div class="tbody"><h6>${p.name}</h6><div class="stars">${'★'.repeat(Math.round(p.rating))} <span class="text-muted">${p.rating} · ${p.sold} sold</span></div><div class="price my-1">${inr(p.price)}<small> /card</small> <small>· e-invite ${inr(p.digital)}</small></div>
 <div class="d-flex gap-1"><a href="product.html?id=${p.id}" class="btn btn-sm btn-outline-gold flex-fill">Analyse</a><button class="btn btn-sm btn-gold flex-fill" data-add="${p.id}"><i class="bi bi-cart-plus"></i> Buy</button></div></div></div></div>`}
function bindCards(root=document){
 $$('[data-add]',root).forEach(b=>b.onclick=()=>openCustomize(b.dataset.add));
 $$('[data-w]',root).forEach(b=>b.onclick=()=>{const on=toggleWish(+b.dataset.w);b.innerHTML=`<i class="bi bi-heart${on?'-fill':''}"></i>`});
 $$('.tilt',root).forEach(c=>{c.onmousemove=e=>{const r=c.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;c.style.transform=`perspective(800px) rotateY(${x*10}deg) rotateX(${-y*10}deg) translateY(-4px)`};c.onmouseleave=()=>c.style.transform=''});
 $$('.reveal',root).forEach(el=>obs.observe(el));
}
function counters(){$$('[data-count]').forEach(el=>{new IntersectionObserver(([e],o)=>{if(!e.isIntersecting)return;o.disconnect();const t=+el.dataset.count;let n=0;const s=setInterval(()=>{n+=Math.ceil(t/60);if(n>=t){n=t;clearInterval(s)}el.textContent=n.toLocaleString('en-IN')+(el.dataset.suf||'')},25)}).observe(el)})}
/* ---------- Pages ---------- */
const PAGES={
home(){
 $('#feat').innerHTML=PRODUCTS.slice(0,8).map(p=>cardHTML(p)).join('');bindCards($('#feat'));
 const ring=$('#ring');PRODUCTS.slice(0,8).forEach((p,i)=>{const im=new Image();im.src='assets/cards/'+p.img;im.style.transform=`rotateY(${i*45}deg) translateZ(270px)`;ring.append(im)});
 const p=PRODUCTS[4];$('#fl-img').src='assets/cards/'+p.img;$('#fl-pal').innerHTML=p.palette.map(c=>`<span class="swatch" style="background:${c}"></span>`).join('');
 $('#fl-style').textContent=p.style;$('#fl-ideal').textContent=p.ideal;$('#fl-btn').href='product.html?id='+p.id;
 const h=$('.hero');h.addEventListener('mousemove',e=>{const x=e.clientX/innerWidth-.5;$('#ring').style.marginLeft=x*40+'px'});counters()},
templates(){
 let cat=q('cat')||'All';const cats=['All',...new Set(PRODUCTS.map(p=>p.cat))];
 $('#cats').innerHTML=cats.map(c=>`<button class="btn btn-sm ${c===cat?'btn-maroon':'btn-outline-gold'}" data-c="${c}">${c}</button>`).join('');
 const draw=()=>{let l=PRODUCTS.filter(p=>(cat==='All'||p.cat===cat)&&(p.name+p.cat+p.style).toLowerCase().includes($('#s').value.toLowerCase()));
  const s=$('#sort').value;if(s==='lo')l.sort((a,b)=>a.price-b.price);if(s==='hi')l.sort((a,b)=>b.price-a.price);if(s==='top')l.sort((a,b)=>b.sold-a.sold);
  $('#grid').innerHTML=l.length?l.map(p=>cardHTML(p)).join(''):'<p class="text-center text-muted">No designs found.</p>';bindCards($('#grid'));$('#cnt').textContent=l.length+' designs';
  $$('#cats button').forEach(b=>b.className='btn btn-sm '+(b.dataset.c===cat?'btn-maroon':'btn-outline-gold'))};
 $$('#cats button').forEach(b=>b.onclick=()=>{cat=b.dataset.c;draw()});$('#s').oninput=draw;$('#sort').onchange=draw;draw()},
product(){
 const p=P(q('id'))||PRODUCTS[0];document.title=p.name+' – மங்கல அழைப்பு';
 const sc=[['Elegance',70+p.id*2%25],['Boldness',45+p.id*7%45],['Tradition',p.cat==='Modern'?35:p.cat==='Floral'?60:90],['Whitespace',p.cat==='Modern'?88:40+p.id*3%30]];
 $('#pd').innerHTML=`<div class="row g-5 align-items-start"><div class="col-md-5"><div class="zoom-box"><img id="pimg" src="assets/cards/${p.img}" alt="${p.name}"></div><p class="small text-muted text-center mt-2">Move your mouse over the card for a 3D preview</p></div>
 <div class="col-md-7"><span class="badge" style="background:var(--maroon)">${p.cat}</span><h1 class="mt-2" style="color:var(--maroon)">${p.name}</h1><div class="stars">${'★'.repeat(Math.round(p.rating))} <span class="text-muted">${p.rating} · ${p.sold} orders</span></div>
 <div class="my-3"><span class="fs-2 fw-bold" style="color:var(--maroon)">${inr(p.price)}</span> / printed card <span class="text-muted">(min 50)</span><br><span class="fw-semibold">${inr(p.digital)}</span> for a digital e-invite (PDF + video)</div>
 <div class="d-flex flex-wrap gap-2 mb-4"><button class="btn btn-gold btn-lg" data-add="${p.id}"><i class="bi bi-cart-plus"></i> Add to cart</button><button class="btn btn-maroon btn-lg" id="bn"><i class="bi bi-lightning-charge-fill"></i> Buy now</button><a class="btn btn-outline-gold btn-lg" href="tel:${PHONE}"><i class="bi bi-telephone-fill"></i> Call to order</a><button class="btn btn-outline-gold btn-lg" data-w="${p.id}"><i class="bi bi-heart"></i></button></div>
 <div class="tcard p-4"><h4 class="mb-3">🔍 Design analysis</h4><div class="row"><div class="col-sm-6 mb-3"><small class="text-muted">Colour palette</small><br>${p.palette.map(c=>`<span class="swatch" style="background:${c}" title="${c}"></span>`).join('')}</div><div class="col-sm-6 mb-3"><small class="text-muted">Motif</small><br><b class="text-capitalize">${p.motif}</b></div>
 <div class="col-sm-6 mb-3"><small class="text-muted">Style</small><br>${p.style}</div><div class="col-sm-6 mb-3"><small class="text-muted">Typography</small><br>${p.fonts}</div><div class="col-sm-6 mb-3"><small class="text-muted">Best for</small><br>${p.ideal}</div><div class="col-sm-6 mb-3"><small class="text-muted">Paper &amp; finish</small><br>${p.paper}</div></div>
 ${sc.map(s=>`<div class="small d-flex justify-content-between"><span>${s[0]}</span><span>${s[1]}%</span></div><div class="progress mb-2" style="height:7px"><div class="progress-bar" style="width:${s[1]}%;background:var(--gold)"></div></div>`).join('')}</div></div></div>`;
 const im=$('#pimg');im.onmousemove=e=>{const r=im.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;im.style.transform=`rotateY(${x*22}deg) rotateX(${-y*22}deg) scale(1.03)`};im.onmouseleave=()=>im.style.transform='';
 $('#bn').onclick=()=>openCustomize(p.id);
 $('#rel').innerHTML=PRODUCTS.filter(x=>x.cat===p.cat&&x.id!==p.id).concat(PRODUCTS.filter(x=>x.cat!==p.cat)).slice(0,4).map(x=>cardHTML(x)).join('');bindCards()},
cart(){
 const render=()=>{const d=Store.load(),u=Auth.current();
  if(!d.cart.length){$('#cartBody').innerHTML=`<div class="text-center py-5"><h3>Your cart is empty</h3><p class="text-muted">Explore beautiful wedding card designs.</p><a href="templates.html" class="btn btn-gold">Browse templates</a></div>`;return}
  const sub=d.cart.reduce((a,i)=>a+lineTotal(i),0),disc=LS.get('ma_coupon',0)?Math.round(sub*.1):0,gst=Math.round((sub-disc)*.05),ship=d.cart.some(i=>i.mode==='print')&&sub<2000?99:0,tot=sub-disc+gst+ship;
  $('#cartBody').innerHTML=`<div class="row g-4"><div class="col-lg-8">${d.cart.map(i=>{const p=P(i.id);return `<div class="tcard p-3 mb-3 d-flex gap-3 align-items-center"><img class="cart-img" src="assets/cards/${p.img}"><div class="flex-fill"><h6 class="mb-0">${p.name}</h6><small class="text-muted">${i.mode==='print'?'Printed · '+p.paper:'Digital e-invite'}${i.n1?` · ${i.n1} & ${i.n2||''}`:''}${i.date?' · '+i.date:''}</small>
  ${i.mode==='print'?`<div class="mt-1"><input type="number" min="50" step="10" value="${i.qty}" class="form-control form-control-sm d-inline-block" style="width:90px" data-q="${i.uid}"> cards</div>`:''}</div><b>${inr(lineTotal(i))}</b><button class="btn btn-sm text-danger" data-rm="${i.uid}"><i class="bi bi-trash"></i></button></div>`}).join('')}</div>
  <div class="col-lg-4"><div class="tcard p-4"><h5>Order summary</h5><div class="d-flex justify-content-between"><span>Subtotal</span><span>${inr(sub)}</span></div>${disc?`<div class="d-flex justify-content-between text-success"><span>Coupon TAMIL10</span><span>-${inr(disc)}</span></div>`:''}<div class="d-flex justify-content-between"><span>GST 5%</span><span>${inr(gst)}</span></div><div class="d-flex justify-content-between"><span>Delivery</span><span>${ship?inr(ship):'Free'}</span></div><hr><div class="d-flex justify-content-between fs-5 fw-bold"><span>Total</span><span style="color:var(--maroon)">${inr(tot)}</span></div>
  <div class="input-group my-3"><input id="cp" class="form-control" placeholder="Coupon (try TAMIL10)"><button class="btn btn-outline-gold" id="cpb">Apply</button></div>
  ${u?`<div id="checkout"><h6>Delivery details</h6><input id="ad" class="form-control mb-2" placeholder="Full address with pincode" value="${u.address||''}"><select id="pay" class="form-select mb-3"><option>UPI (demo)</option><option>Credit / Debit card (demo)</option><option>Cash on delivery</option></select><button class="btn btn-gold w-100 btn-lg" id="place"><i class="bi bi-bag-check-fill"></i> Place order · ${inr(tot)}</button></div>`
  :`<a class="btn btn-gold w-100" href="signin.html?next=cart.html">Sign in to checkout</a><div class="small text-center mt-2">New here? <a href="signup.html?next=cart.html">Create account</a></div>`}
  <a class="btn btn-outline-gold w-100 mt-2" href="tel:${PHONE}"><i class="bi bi-telephone"></i> Order by phone</a></div></div></div>`;
  $$('[data-rm]').forEach(b=>b.onclick=()=>{const d=Store.load();d.cart=d.cart.filter(i=>i.uid!=b.dataset.rm);Store.save(d);render()});
  $$('[data-q]').forEach(b=>b.onchange=()=>{const d=Store.load();d.cart.find(i=>i.uid==b.dataset.q).qty=Math.max(50,+b.value||50);Store.save(d);render()});
  $('#cpb').onclick=()=>{if($('#cp').value.trim().toUpperCase()==='TAMIL10'){LS.set('ma_coupon',1);toast('Coupon applied!');render()}else toast('Invalid coupon','danger')};
  const pl=$('#place');if(pl)pl.onclick=()=>{const a=$('#ad').value.trim();if(a.length<8)return toast('Please enter full address','danger');
   const d=Store.load(),us=Auth.users();us.find(x=>x.email===u.email).address=a;LS.set('ma_users',us);
   const o={oid:'MA'+Date.now().toString().slice(-8),date:new Date().toLocaleString('en-IN'),items:d.cart,total:tot,address:a,pay:$('#pay').value,status:'Design in progress'};
   d.orders.unshift(o);d.cart=[];Store.save(d);localStorage.removeItem('ma_coupon');
   $('#cartBody').innerHTML=`<div class="text-center py-5"><div style="font-size:4rem">🎉</div><h2 style="color:var(--maroon)">Order placed!</h2><p>Your order number is <b>${o.oid}</b>. Our designer will call you within 2 hours to confirm names and details.</p><a href="account.html#orders" class="btn btn-gold">View my orders</a> <a href="templates.html" class="btn btn-outline-gold">Continue shopping</a></div>`}};
 render()},
signin(){$('#f').onsubmit=e=>{e.preventDefault();const r=Auth.signin($('#em').value.trim().toLowerCase(),$('#pw').value);if(r){$('#err').textContent=r;$('#err').classList.remove('d-none')}else location.href=q('next')||'account.html'}},
signup(){$('#f').onsubmit=e=>{e.preventDefault();const pw=$('#pw').value;if(pw.length<6||pw!==$('#pw2').value){$('#err').textContent='Passwords must match and be at least 6 characters.';return $('#err').classList.remove('d-none')}
 const r=Auth.signup({name:$('#nm').value.trim(),email:$('#em').value.trim().toLowerCase(),phone:$('#ph').value.trim(),pw});if(r){$('#err').textContent=r;$('#err').classList.remove('d-none')}else location.href=q('next')||'account.html'}},
account(){
 const u=Auth.current();if(!u){location.href='signin.html?next=account.html';return}const d=Store.load();
 $('#acc').innerHTML=`<div class="row g-4"><div class="col-lg-3"><div class="tcard p-3 text-center"><img src="assets/img/avatar${1+u.name.length%4}.png" class="rounded-circle mb-2" width="90"><h5>${u.name}</h5><small class="text-muted">${u.email}</small><hr><div class="nav flex-column nav-pills" id="tabs">${[['prof','Profile'],['orders','My Orders ('+d.orders.length+')'],['wish','Wishlist ('+d.wish.length+')'],['calls','Callback requests ('+d.calls.length+')']].map((t,i)=>`<button class="nav-link text-start ${i?'':'active'}" data-bs-toggle="pill" data-bs-target="#t-${t[0]}">${t[1]}</button>`).join('')}</div><button class="btn btn-sm btn-outline-danger w-100 mt-3" id="lo2">Sign out</button></div></div>
 <div class="col-lg-9"><div class="tab-content">
 <div class="tab-pane fade show active" id="t-prof"><div class="tcard p-4"><h4>Profile</h4><div class="row g-3"><div class="col-md-6"><label class="form-label">Name</label><input id="pn" class="form-control" value="${u.name}"></div><div class="col-md-6"><label class="form-label">Phone</label><input id="pp" class="form-control" value="${u.phone||''}"></div><div class="col-12"><label class="form-label">Address</label><textarea id="pa" class="form-control" rows="2">${u.address||''}</textarea></div></div><button class="btn btn-gold mt-3" id="ps">Save</button><p class="small text-muted mt-3 mb-0">Member since ${new Date(u.joined).toLocaleDateString('en-IN')} · Your cart, orders and wishlist are saved separately for your account in this browser.</p></div></div>
 <div class="tab-pane fade" id="t-orders">${d.orders.length?d.orders.map(o=>`<div class="tcard p-3 mb-3"><div class="d-flex justify-content-between flex-wrap"><b>#${o.oid}</b><span class="badge bg-warning text-dark">${o.status}</span></div><small class="text-muted">${o.date} · ${o.pay}</small><div class="d-flex gap-2 my-2">${o.items.map(i=>`<img class="cart-img" src="assets/cards/${P(i.id).img}" title="${P(i.id).name}">`).join('')}</div><div>Total <b>${inr(o.total)}</b></div></div>`).join(''):'<div class="tcard p-4 text-center">No orders yet. <a href="templates.html">Browse templates</a></div>'}</div>
 <div class="tab-pane fade" id="t-wish"><div class="row g-3">${d.wish.length?d.wish.map(id=>cardHTML(P(id),'col-6 col-md-4')).join(''):'<div class="tcard p-4 text-center">Your wishlist is empty.</div>'}</div></div>
 <div class="tab-pane fade" id="t-calls">${d.calls.length?d.calls.map(c=>`<div class="tcard p-3 mb-2">📞 <b>${c.phone}</b> · ${c.time} · <small class="text-muted">${c.date}</small></div>`).join(''):'<div class="tcard p-4 text-center">No callback requests. <a href="contact.html">Request one</a></div>'}</div></div></div></div>`;
 bindCards($('#acc'));$('#lo2').onclick=()=>Auth.logout();
 $('#ps').onclick=()=>{const us=Auth.users(),x=us.find(a=>a.email===u.email);x.name=$('#pn').value;x.phone=$('#pp').value;x.address=$('#pa').value;LS.set('ma_users',us);toast('Profile saved');setTimeout(()=>location.reload(),600)};
 if(location.hash)$(`[data-bs-target="#t-${location.hash.slice(1)}"]`)?.click()},
contact(){
 const u=Auth.current();if(u)$('#cph').value=u.phone||'';
 $('#cb').onsubmit=e=>{e.preventDefault();const d=Store.load();d.calls.unshift({phone:$('#cph').value,time:$('#ctm').value,date:new Date().toLocaleString('en-IN')});Store.save(d);e.target.reset();toast('Thank you! We will call you back at your chosen time.')}},
about(){counters()},packages(){}
};
document.addEventListener('DOMContentLoaded',()=>{layout();$$('.reveal').forEach(el=>obs.observe(el));PAGES[document.body.dataset.page]?.()});
