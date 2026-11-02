const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const image = (id, size = 1600) => `images/${String(id).padStart(3, '0')}-${size}.jpg`;
const projects = [
  {id:'niharika',title:'Niharika & Prudhvi',category:'weddings',label:'Wedding story',cover:30,photos:[39,37,38,40,41,42,43],alt:'Niharika in traditional bridal attire, photographed in warm window light'},
  {id:'kusum',title:'Kusum',category:'weddings',label:'Bridal portrait',cover:13,photos:[13],alt:'A bride in an emerald green lehenga against a warm, textured backdrop'},
  {id:'harika',title:'Harika & Tharun',category:'weddings',label:'Wedding story',cover:29,photos:[29],alt:'A couple leaning close together in a quiet moment'},
  {id:'varshini',title:'Varshini & Suhas',category:'weddings',label:'Wedding story',cover:18,photos:[18],alt:'An intimate black and white bridal portrait'},
  {id:'bhargav',title:'Bhargav & Sindhu',category:'weddings',label:'Together',cover:19,photos:[19],alt:'A couple walking hand in hand with a red umbrella'},
  {id:'rakesh',title:'Rakesh & Rajitha',category:'weddings',label:'Wedding story',cover:16,photos:[16],alt:'A bride in a dramatic portrait against a dark background'},
  {id:'sirihanmanth',title:'Siri Hanmanth',category:'fashion',label:'Fashion & portraits',cover:33,photos:[44,45,46,47,48,53,54,55,56,57,58,59],alt:'Fashion portrait of Siri Hanmanth in black with a purple backdrop'},
  {id:'vishnupriya',title:'Vishnupriya Bhimeneni',category:'fashion',label:'Fashion & portraits',cover:22,photos:[49,50,51,52],alt:'A fashion portrait in expressive violet and red lighting'},
  {id:'anasuya',title:'Anasuya',category:'fashion',label:'Fashion & portraits',cover:36,photos:[36],alt:'Anasuya in a fashion portrait against a warm yellow background'},
  {id:'sreemukhi',title:'Sreemukhi',category:'fashion',label:'Fashion & portraits',cover:32,photos:[32,31,27,28,20,34,35],alt:'Sreemukhi in a vintage-inspired portrait with a black veil'},
  {id:'anupama',title:'Anupama Parmeswaran',category:'fashion',label:'Fashion & portraits',cover:6,photos:[6],alt:'Anupama Parmeswaran in a yellow sari against a grey studio backdrop'},
  {id:'vyshnavi',title:'Vyshnavi & Sai Kumar',category:'weddings',label:'Wedding details',cover:23,photos:[23],alt:'Wedding rings photographed in warm light'},
  {id:'sadhya',title:'Sadhya Anwar',category:'fashion',label:'Fashion & portraits',cover:12,photos:[12],alt:'A traditional portrait featuring a pink sari and ornate jewellery'},
  {id:'bhanu',title:'Bhanu Shree',category:'fashion',label:'Fashion & portraits',cover:26,photos:[26],alt:'Bhanu Shree in a warm fashion portrait wearing yellow'},
  {id:'rishan',title:'Rishan’s first birthday',category:'celebrations',label:'Celebrations',cover:24,photos:[24],alt:'Black and white portrait of a young child'},
  {id:'vibha',title:'Vibha portraits',category:'celebrations',label:'Childhood portraits',cover:17,photos:[17],alt:'A child in a red outfit sitting outdoors'},
  {id:'jewellery',title:'A closer look',category:'products',label:'Jewellery & details',cover:25,photos:[25],alt:'Gold jewellery photographed against a dark background'},
  {id:'anuhya',title:'Anuhya',category:'fashion',label:'Fashion & portraits',cover:2,photos:[2],alt:'Anuhya in a pink silk sari in a studio portrait'}
];
// Sources retain each photograph’s project attribution in the downloaded image manifest.
let activeFilter = 'all';
let visibleCount = 9;
const grid = $('#portfolio-grid');
const categories = {all:'All stories',weddings:'Weddings',fashion:'Fashion & portraits',celebrations:'Celebrations',products:'Details & objects'};
function renderPortfolio() {
  const filtered = projects.filter(project => activeFilter === 'all' || project.category === activeFilter);
  const visible = filtered.slice(0, visibleCount);
  grid.replaceChildren(...visible.map((project, index) => {
    const card = document.createElement('button');
    card.className = 'portfolio-card';
    card.dataset.project = project.id;
    card.style.animationDelay = `${Math.min(index, 5) * 45}ms`;
    card.setAttribute('aria-label', `View ${project.title} photographs`);
    const wrap = document.createElement('div'); wrap.className = 'image-wrap';
    const photo = document.createElement('img'); photo.src = image(project.cover,640); photo.alt = project.alt; photo.loading = 'lazy'; photo.width = 640; photo.height = 800;
    wrap.append(photo);
    const meta = document.createElement('div'); meta.className='card-meta';
    const text = document.createElement('div'); const title=document.createElement('h3');title.textContent=project.title;const label=document.createElement('p');label.textContent=project.label;text.append(title,label);
    const arrow=document.createElement('span');arrow.textContent='↗';arrow.setAttribute('aria-hidden','true');meta.append(text,arrow);card.append(wrap,meta);return card;
  }));
  $('#portfolio-count').textContent = `${String(visible.length).padStart(2,'0')} / ${String(filtered.length).padStart(2,'0')} stories`;
  $('#load-more').hidden = visible.length >= filtered.length;
}
function setFilter(filter) {activeFilter=filter;visibleCount=9;$$('[data-filter]').forEach(button=>{const selected=button.dataset.filter===filter;button.classList.toggle('selected',selected);button.setAttribute('aria-pressed',String(selected));});renderPortfolio();}
$$('[data-filter]').forEach(button => button.addEventListener('click',()=>setFilter(button.dataset.filter)));
$$('[data-filter-link]').forEach(link=>link.addEventListener('click',()=>setFilter(link.dataset.filterLink)));
$('#load-more').addEventListener('click',()=>{const firstNewIndex=visibleCount;visibleCount+=9;renderPortfolio();$$('.portfolio-card')[firstNewIndex]?.focus({preventScroll:true});});
renderPortfolio();

// Hero: timing pauses for hidden tabs, keyboard focus, and reduced motion preferences.
let slide=0,elapsed=0,lastTick=performance.now(),paused=reducedMotion.matches;
const heroPhotos=$$('.hero-image');
const captions=['A moment before forever','In your own little world','The beauty of becoming'];
function showSlide(next){slide=(next+heroPhotos.length)%heroPhotos.length;heroPhotos.forEach((photo,index)=>photo.classList.toggle('active',index===slide));$('#slide-number').textContent=String(slide+1).padStart(2,'0');$('#hero-photo-title').textContent=captions[slide];elapsed=0;$('#slide-progress').style.width='0%';}
function updatePause(){const button=$('#slide-pause');button.textContent=paused?'▷':'Ⅱ';button.setAttribute('aria-label',paused?'Play slideshow':'Pause slideshow');button.setAttribute('aria-pressed',String(paused));}
$('#slide-prev').addEventListener('click',()=>showSlide(slide-1));$('#slide-next').addEventListener('click',()=>showSlide(slide+1));$('#slide-pause').addEventListener('click',()=>{paused=!paused;updatePause();});updatePause();
function tick(now){const delta=Math.min(now-lastTick,100);lastTick=now;if(!paused&&!document.hidden&&!$('.slide-controls').contains(document.activeElement)&&!document.body.classList.contains('modal-open')){elapsed+=delta;$('#slide-progress').style.width=`${Math.min(100,elapsed/75)}%`;if(elapsed>=7500)showSlide(slide+1);}requestAnimationFrame(tick);}requestAnimationFrame(tick);

// Project viewer, including focus restoration, keyboard support and touch navigation.
const gallery=$('#gallery-dialog');let currentProject=null,photoIndex=0,returnFocus=null,touchStart=0;
function showPhoto(index){photoIndex=(index+currentProject.photos.length)%currentProject.photos.length;const id=currentProject.photos[photoIndex];$('#gallery-image').src=image(id);$('#gallery-image').alt=`${currentProject.title} — photograph ${photoIndex+1}`;$('#gallery-position').textContent=`${String(photoIndex+1).padStart(2,'0')} / ${String(currentProject.photos.length).padStart(2,'0')}`;$$('#gallery-thumbnails button').forEach((button,i)=>{button.classList.toggle('active',i===photoIndex);button.setAttribute('aria-pressed',String(i===photoIndex));});$('#gallery-prev').hidden=currentProject.photos.length<2;$('#gallery-next').hidden=currentProject.photos.length<2;}
function openGallery(id,trigger){currentProject=projects.find(project=>project.id===id);if(!currentProject)return;returnFocus=trigger;$('#gallery-title').textContent=currentProject.title;$('#gallery-category').textContent=currentProject.label;$('#gallery-thumbnails').replaceChildren(...currentProject.photos.map((id,index)=>{const button=document.createElement('button');button.setAttribute('aria-label',`View photograph ${index+1}`);const photo=document.createElement('img');photo.src=image(id,640);photo.alt='';photo.loading='lazy';button.append(photo);button.addEventListener('click',()=>showPhoto(index));return button;}));showPhoto(0);gallery.showModal();document.body.classList.add('modal-open');$('#gallery-close').focus();}
document.addEventListener('click',event=>{const card=event.target.closest('[data-project]');if(card)openGallery(card.dataset.project,card);});
$('#gallery-prev').addEventListener('click',()=>showPhoto(photoIndex-1));$('#gallery-next').addEventListener('click',()=>showPhoto(photoIndex+1));$('#gallery-close').addEventListener('click',()=>gallery.close());gallery.addEventListener('keydown',event=>{if(event.key==='ArrowRight'){event.preventDefault();showPhoto(photoIndex+1);}if(event.key==='ArrowLeft'){event.preventDefault();showPhoto(photoIndex-1);}});gallery.addEventListener('close',()=>{document.body.classList.remove('modal-open');returnFocus?.focus({preventScroll:true});});$('#gallery-image').addEventListener('touchstart',event=>{touchStart=event.changedTouches[0].screenX;},{passive:true});$('#gallery-image').addEventListener('touchend',event=>{const delta=event.changedTouches[0].screenX-touchStart;if(Math.abs(delta)>45)showPhoto(photoIndex+(delta<0?1:-1));},{passive:true});

// Mobile navigation.
const menuToggle=$('.menu-toggle'),mobileMenu=$('#mobile-menu');
function closeMenu(){menuToggle.setAttribute('aria-expanded','false');mobileMenu.hidden=true;menuToggle.setAttribute('aria-label','Open navigation');}
menuToggle.addEventListener('click',()=>{const opening=mobileMenu.hidden;mobileMenu.hidden=!opening;menuToggle.setAttribute('aria-expanded',String(opening));menuToggle.setAttribute('aria-label',opening?'Close navigation':'Open navigation');});$$('a,button',mobileMenu).forEach(link=>link.addEventListener('click',closeMenu));document.addEventListener('keydown',event=>{if(event.key==='Escape')closeMenu();});

// Enquiry composer. The user chooses the external channel; there is no pretend submission.
const enquiry=$('#enquiry-dialog'),form=$('#enquiry-form');let enquiryTrigger;
$$('[data-enquire]').forEach(button=>button.addEventListener('click',()=>{enquiryTrigger=button;enquiry.showModal();document.body.classList.add('modal-open');}));$('#enquiry-close').addEventListener('click',()=>enquiry.close());enquiry.addEventListener('click',event=>{if(event.target===enquiry){const rect=enquiry.getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)enquiry.close();}});enquiry.addEventListener('close',()=>{document.body.classList.remove('modal-open');enquiryTrigger?.focus({preventScroll:true});});
form.addEventListener('submit',event=>{event.preventDefault();if(!form.reportValidity())return;const data=new FormData(form);const value=name=>String(data.get(name)||'').trim();const text=`Hello Manoj,\n\nI’d love to enquire about ${value('occasion').toLowerCase()}.\n\nName: ${value('name')}\nEmail: ${value('email')}\nPreferred date: ${value('date')||'To be discussed'}\nLocation: ${value('location')||'To be discussed'}\n\n${value('message')||'I’d love to discuss the details with you.'}\n\nSent from The Vivaha Stories portfolio.`;$('#enquiry-summary').textContent=text;$('#send-email').href=`mailto:info@thevivahastories.com?subject=${encodeURIComponent(`${value('occasion')} enquiry — ${value('name')}`)}&body=${encodeURIComponent(text)}`;$('#send-whatsapp').href=`https://wa.me/918977617100?text=${encodeURIComponent(text)}`;form.hidden=true;$('#enquiry-result').hidden=false;$('#send-email').focus();});$('#edit-enquiry').addEventListener('click',()=>{form.hidden=false;$('#enquiry-result').hidden=true;$('input[name=name]').focus();});

// Subtle progressive enhancement: all content is visible if motion or observation is unavailable.
if(!reducedMotion.matches&&'IntersectionObserver'in window){document.body.classList.add('motion-ready');const observer=new IntersectionObserver(entries=>{for(const entry of entries)if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target);}},{threshold:.1});$$('.reveal').forEach(element=>observer.observe(element));}
const cursor=$('.cursor-hint');if(matchMedia('(pointer:fine)').matches&&!reducedMotion.matches){document.addEventListener('pointermove',event=>{cursor.style.left=`${event.clientX}px`;cursor.style.top=`${event.clientY}px`;cursor.classList.toggle('visible',!!event.target.closest('.story-card .image-wrap,.portfolio-card .image-wrap'));});document.addEventListener('pointerleave',()=>cursor.classList.remove('visible'));}$('#year').textContent=String(new Date().getFullYear());
