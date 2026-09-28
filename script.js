// ===== Easy-to-edit content settings =====
const CONFIG = {
  targetDate: '2026-10-05T00:00:00+03:00',
  relationshipStart: '2025-11-26T00:00:00+03:00',
  phrases: ['Я тебя люблю','I love you',"Je t'aime",'Ti amo','Te amo','Ich liebe dich','Eu te amo','Ik hou van jou','Jeg elsker deg','Jag älskar dig','Jeg elsker dig','Kocham Cię','Miluji tě','Ľúbim ťa','Volim te','Seni seviyorum','Σε αγαπώ','愛してる','사랑해','我爱你','Я цябе кахаю','Я кахаю цябе','أحبك','Mahal kita','Tôi yêu bạn','รักคุณ','Ты моё счастье','Ты прекрасна','Моя любимая','Ты делаешь мой мир лучше','Ты – моё самое красивое событие','Mon bonheur','Mi cielo','Ты мой любимый человек'],
  phrasePositions: [[7,8],[27,11],[70,6],[84,13],[12,25],[78,26],[4,51],[86,46],[19,68],[77,69],[7,84],[88,84],[36,5],[55,89],[43,20],[59,30],[17,43],[83,62]]
};
const $ = (id) => document.getElementById(id);
const letterLayout=document.createElement('link');letterLayout.rel='stylesheet';letterLayout.href='letter-final-layout.css';document.head.append(letterLayout);
const phrasesLayer = $('phrases'); const heartStream = $('heartStream');
let audioContext = null, ambientTimer = null, soundOn = false, testMode = false, testEndAt = null, celebrationPlayed = false;
let chimeContext = null;
const COMPLIMENTS=['ти проста самое лучшее что случилось со мной 🎟','тваи глазки такие красивые что в них вечна можна смотреть','ну какая ты красоташка я нимагууу','мая красоташка самая самая на свете','ти самая лучшая женщина на свете','мая единственная и неповторимая девачкааа','ти такая умняшечка, я прост горжусь тобой','ти сильная, ти со всем справишься, я знаю','твое хихихихи самый лучший звук на свете','ти понимаешь мои приколы, за это я тебя и обожаю','у тебя няшнасть 9999лвл','с тобой даже в пасмурный день светло, мая солнечная красоташка','ти красивая даже когда думаешь что нет, проверено','с тобой так уютна, никуда бы не хотел деваться','ти такая заботливая, я это все время чувствую','ти добрая, и я это очинь ценю','дни с тобой самые самые лучшие','зачем мне какие-то девушки, когда у меня есть самая лучшая мая викуля','когда ти улыбаешься, мне сразу хорошо','ти в розовом такая няшна, одобряю','тебе так идут эти няшные кудряшкии','ти можешь быть какой угодно, я все равно тебя люблю','твой голос лучше любой музыки, особенно когда ты поешь','ти такая красивая, что аж страшно, вдруг это сон','ти мая кошечка любимая','я скучаю по тебе даже когда ти ушла на пять минут','ти самая красивенькая, самая умничка, самая любимая и ваще самая самая','ти мая любимка, и никто рядом не стоял','я так рад что ти у меня есть, спасибки что ти такая','мая девачка самая красивая, и я это всем скажу','я тебя оч оч сильна сильна люблю'];
function relationshipDays(){ return Math.max(0, Math.floor((Date.now() - new Date(CONFIG.relationshipStart)) / 86400000)); }
function setupTogether(){
  const line=document.createElement('p'); line.className='together-line'; line.innerHTML='Уже <strong>'+relationshipDays()+'</strong> дней вместе <i>♡</i>';
  document.querySelector('.letter-sign')?.before(line);
  const mainLine=document.createElement('p'); mainLine.className='main-days'; mainLine.innerHTML='Уже <strong>'+relationshipDays()+'</strong> дней вместе <i>♡</i>';
  $('universe').append(mainLine);
}
function showCompliment(){
  document.querySelector('.compliment-note')?.remove();document.querySelector('.compliment-backdrop')?.remove();
  const backdrop=document.createElement('i');backdrop.className='compliment-backdrop';document.body.append(backdrop);
  const note=document.createElement('p');note.className='compliment-note';note.textContent=COMPLIMENTS[Math.floor(Math.random()*COMPLIMENTS.length)];document.body.append(note);setTimeout(()=>{note.classList.add('leaving');backdrop.classList.add('leaving')},2800);setTimeout(()=>{note.remove();backdrop.remove()},3500);
}
function setupComplimentJar(){
  const jar=document.createElement('button');jar.className='compliment-jar';jar.type='button';jar.innerHTML='<span class="jar-spark">✦</span><span class="jar-copy"><small>Открой баночку</small>Комплиментов</span>';jar.addEventListener('click',showCompliment);document.querySelector('.date-line')?.after(jar);
}
function setupSecret(){
  const title=document.querySelector('.hero h1');let taps=0,tapTimer;
  title.addEventListener('click',()=>{taps++;clearTimeout(tapTimer);tapTimer=setTimeout(()=>taps=0,1800);if(taps===5){taps=0;const secret=document.createElement('p');secret.className='secret-note';secret.innerHTML='<span>🎟</span><strong>Билетик на одно любое желание</strong><em>Покажи мне этот экран — и я всё сделаю, ну почти всё ♡</em>';document.body.append(secret);setTimeout(()=>secret.remove(),5200)}});
}
function setupPhoneMotion(){
  const petals=$('petals');window.addEventListener('deviceorientation',event=>{if(event.gamma==null)return;petals.style.setProperty('--petal-tilt',Math.max(-2.5,Math.min(2.5,event.gamma/13))+'deg')},{passive:true});
}
function playTone(frequency=440, duration=.55, volume=.018){
  if(!soundOn || !audioContext)return;
  const oscillator=audioContext.createOscillator(), gain=audioContext.createGain(); oscillator.type='triangle'; oscillator.frequency.setValueAtTime(frequency,audioContext.currentTime); gain.gain.setValueAtTime(0,audioContext.currentTime); gain.gain.linearRampToValueAtTime(volume,audioContext.currentTime+.015); gain.gain.exponentialRampToValueAtTime(.001,audioContext.currentTime+duration); oscillator.connect(gain).connect(audioContext.destination); oscillator.start(); oscillator.stop(audioContext.currentTime+duration+.03);
}
function playMusicBox(){ const notes=[523.25,659.25,783.99,659.25]; notes.forEach((note,index)=>setTimeout(()=>playTone(note,.7,.013),index*330)); }
function playTextChime(){
  if(!ambientTrack || ambientTrack.paused)return;
  if(!chimeContext)chimeContext=new (window.AudioContext||window.webkitAudioContext)();
  [1174.66,1567.98].forEach((frequency,index)=>{const oscillator=chimeContext.createOscillator(),gain=chimeContext.createGain();oscillator.type='sine';oscillator.frequency.value=frequency;gain.gain.setValueAtTime(0,chimeContext.currentTime);gain.gain.linearRampToValueAtTime(.012,chimeContext.currentTime+.02+index*.025);gain.gain.exponentialRampToValueAtTime(.001,chimeContext.currentTime+.45);oscillator.connect(gain).connect(chimeContext.destination);oscillator.start(chimeContext.currentTime+index*.04);oscillator.stop(chimeContext.currentTime+.5)});
}
function toggleSound(){
  if(!audioContext) audioContext=new (window.AudioContext||window.webkitAudioContext)();
  soundOn=!soundOn;
  if(soundOn){ playMusicBox(); ambientTimer=setInterval(playMusicBox,14000); }
  else { clearInterval(ambientTimer);ambientTimer=null; }
  const button=$('soundToggle');button.classList.toggle('active',soundOn);button.setAttribute('aria-pressed',soundOn);button.lastChild.textContent=soundOn?' звук включён':' включить звук';
}
function pad(n){return String(n).padStart(2,'0')}
function updateCountdown(){
  let d = testMode ? Math.max(0, testEndAt - Date.now()) : new Date(CONFIG.targetDate) - new Date();
  if(d <= 0){ d=0; if(testMode || !document.querySelector('.sound-gate'))startCelebration(); } else { $('countdownShell').classList.remove('show-reveal'); }
  const s=Math.floor(d/1000); const values=[Math.floor(s/86400),Math.floor(s/3600)%24,Math.floor(s/60)%60,s%60];
  ['days','hours','minutes','seconds'].forEach((id,i)=>$(id).textContent=pad(values[i]));
}
function startCelebration(){
  const shell=$('countdownShell'); shell.classList.add('show-reveal');
  if(celebrationPlayed)return;
  celebrationPlayed=true;shell.classList.add('celebrating');celebrationParticles();
  setTimeout(()=>shell.classList.remove('celebrating'),1600);
}
function celebrationParticles(){
  const flash=document.createElement('i');flash.className='celebration-flash';document.body.append(flash);setTimeout(()=>flash.remove(),2200);
  for(let i=0;i<3;i++){const ring=document.createElement('i');ring.className='celebration-ring';ring.style.setProperty('--delay',(i*.18)+'s');ring.style.setProperty('--scale',String(18+i*13));document.body.append(ring);setTimeout(()=>ring.remove(),2200)}
  for(let i=0;i<82;i++){const h=document.createElement('i'),angle=(Math.PI*2*i/56)+(Math.random()-.5)*.18,travel=150+Math.random()*310;let kind='';if(i>59)kind=' petal-celebration';else if(i%5===0)kind=' sparkle-celebration';else if(i%3===0)kind=' heart-celebration';h.className='celebration-particle'+kind;h.style.left='50%';h.style.top='50%';h.style.setProperty('--tx',(Math.cos(angle)*travel)+'px');h.style.setProperty('--ty',(Math.sin(angle)*travel*.62-55)+'px');h.style.setProperty('--delay',(Math.random()*.82+(i>59?.35:0))+'s');h.style.setProperty('--size',(4+Math.random()*11)+'px');h.style.setProperty('--turn',(-330+Math.random()*660)+'deg');document.body.append(h);setTimeout(()=>h.remove(),3500)}
}
function randomPhrase(exclude){let p;do{p=CONFIG.phrases[Math.floor(Math.random()*CONFIG.phrases.length)]}while(p===exclude);return p}
function phrasePosition(index){
  // Keep messages out of the main title / timer area, but otherwise let them roam.
  let x, y, attempts = 0;
  const occupied = [...phrasesLayer.querySelectorAll('.phrase:not(.burst)')].map(el => ({ x: parseFloat(el.style.left), y: parseFloat(el.style.top) }));
  do {
    x = 4 + Math.random() * 88; y = 5 + Math.random() * 86; attempts++;
  } while ((x > 26 && x < 74 && y > 22 && y < 74 || occupied.some(p => Math.abs(p.x - x) < 17 && Math.abs(p.y - y) < 10)) && attempts < 80);
  return [x, y];
}
function phraseElement(text,index){
  const el=document.createElement('button'); el.className='phrase entering';el.type='button';el.textContent=text;
  const [x,y]=phrasePosition(index);
  const depth = index % 3;
  const direction = index % 2 ? 1 : -1;
  el.style.left=x+'%';el.style.top=y+'%';el.style.setProperty('--size',(depth === 0 ? 16 : 21)+Math.random()*(depth === 2 ? 15 : 11)+'px');el.style.setProperty('--duration',(15+Math.random()*16)+'s');el.style.setProperty('--delay',(-Math.random()*18)+'s');el.style.setProperty('--x',(direction*(70+Math.random()*105))+'px');el.style.setProperty('--y',(-45+Math.random()*90)+'px');el.style.setProperty('--rotate',(-10+Math.random()*20)+'deg');el.style.setProperty('--opacity',depth === 0 ? '.38' : depth === 1 ? '.62' : '.84');el.style.setProperty('--blur',depth === 0 ? '.45px' : '0px');
  setTimeout(()=>el.classList.remove('entering'),1350);
  el.addEventListener('selectstart',event=>event.preventDefault());
  el.addEventListener('dragstart',event=>event.preventDefault());
  el.addEventListener('pointerup',event=>{if(event.isPrimary){event.preventDefault();burstPhrase(el,index,false)}});
  el.addEventListener('click',()=>burstPhrase(el,index,false));
  const lifetime = 13000 + Math.random() * 15000;
  setTimeout(()=>{ if(el.isConnected && !el.classList.contains('burst') && !document.querySelector('.modal.open')) burstPhrase(el,index,true); }, lifetime);
  return el;
}
function burstPhrase(el,index,quiet=false){
  if(el.classList.contains('burst'))return; const rect=el.getBoundingClientRect();el.classList.add('burst');
  if(!quiet) playTextChime();
  const chars=[...el.textContent].filter(c=>c.trim());
  (quiet ? chars.filter((_,i)=>i%2===0) : chars).forEach((char,i)=>{const f=document.createElement('span');f.className='fragment'+(quiet?' quiet':'');f.textContent=char;f.style.left=(rect.left+rect.width/2)+'px';f.style.top=(rect.top+rect.height/2)+'px';f.style.setProperty('--tx',(-55+Math.random()*110)+'px');f.style.setProperty('--ty',(-55+Math.random()*110)+'px');f.style.setProperty('--rot',(-180+Math.random()*360)+'deg');document.body.append(f);setTimeout(()=>f.remove(),950)});
  for(let i=0;i<(quiet?3:7);i++){const h=document.createElement('i');h.className='burst-heart'+(quiet?' quiet':'');h.style.left=(rect.left+rect.width/2)+'px';h.style.top=(rect.top+rect.height/2)+'px';h.style.setProperty('--tx',(-75+Math.random()*150)+'px');h.style.setProperty('--ty',(-72+Math.random()*110)+'px');h.style.setProperty('--rot',(Math.random()*360)+'deg');document.body.append(h);setTimeout(()=>h.remove(),1100)}
  setTimeout(()=>{el.replaceWith(phraseElement(randomPhrase(el.textContent),index));},760);
}
function seedPhrases(){CONFIG.phrasePositions.forEach((_,i)=>phrasesLayer.append(phraseElement(CONFIG.phrases[i],i)))}
function createHeart(){const h=document.createElement('i');h.className='heart'+(Math.random()>.65?' outline':'');h.style.setProperty('--s',(7+Math.random()*12)+'px');h.style.setProperty('--color',['#ff7198','#ffa6a5','#f5b478','#e94b80'][Math.floor(Math.random()*4)]);h.style.setProperty('--tx',(-190+Math.random()*380)+'px');h.style.setProperty('--ty',(-120-Math.random()*190)+'px');h.style.setProperty('--d',(5+Math.random()*4)+'s');heartStream.append(h);setTimeout(()=>h.remove(),9500)}
function seedPetals(){const layer=$('petals');for(let i=0;i<17;i++){const p=document.createElement('i');p.className='petal';p.style.left=(Math.random()*100)+'%';p.style.setProperty('--w',(6+Math.random()*12)+'px');p.style.setProperty('--fall',(14+Math.random()*16)+'s');p.style.setProperty('--wait',(-Math.random()*23)+'s');p.style.setProperty('--drift',(-90+Math.random()*180)+'px');p.style.setProperty('--petal-opacity',(0.28+Math.random()*.42).toFixed(2));p.style.setProperty('--petal-blur',i%4===0?'.45px':'0');layer.append(p)}}
function seedLetterPetals(){
  document.querySelector('.letter-petal-layer')?.remove();const layer=document.createElement('div');layer.className='letter-petal-layer';
  for(let i=0;i<38;i++){const petal=document.createElement('i');petal.className='letter-petal';const edge=i<26;petal.style.left=(edge?(i%2?3+Math.random()*18:79+Math.random()*18):28+Math.random()*44)+'%';petal.style.setProperty('--lp-size',(5+Math.random()*11)+'px');petal.style.setProperty('--lp-drift',(-42+Math.random()*84)+'px');petal.style.setProperty('--lp-delay',(Math.random()*7)+'s');petal.style.setProperty('--lp-duration',(6+Math.random()*7)+'s');layer.append(petal)}document.querySelector('.letter')?.append(layer);
}
function openModal(){const modal=$('modal');modal.classList.add('open');modal.setAttribute('aria-hidden','false');seedLetterPetals()}
function closeModal(){const modal=$('modal');modal.classList.remove('open');modal.setAttribute('aria-hidden','true');document.querySelector('.letter-petal-layer')?.remove()}
$('revealButton').addEventListener('click',openModal);document.querySelectorAll('[data-close]').forEach(x=>x.addEventListener('click',closeModal));document.addEventListener('keydown',e=>{if(e.key==='Escape')closeModal()});
// User-supplied ambient track. It begins and repeats from the requested sixth second.
const ambientTrack=new Audio('ambient-loop.m4a');ambientTrack.preload='metadata';ambientTrack.volume=.12;
function updateAmbientButton(){ambientButton.classList.toggle('active',!ambientTrack.paused);ambientButton.setAttribute('aria-pressed',String(!ambientTrack.paused));ambientButton.lastChild.textContent=ambientTrack.paused?' включить эмбиент':' выключить эмбиент';}
function playAmbient(){
  const start=()=>{ambientTrack.currentTime=6;ambientTrack.play().then(updateAmbientButton).catch(()=>{});};
  if(ambientTrack.paused){ambientTrack.readyState>=1?start():ambientTrack.addEventListener('loadedmetadata',start,{once:true});}
  else {ambientTrack.pause();updateAmbientButton();}
}
ambientTrack.addEventListener('ended',()=>{ambientTrack.currentTime=6;ambientTrack.play().catch(()=>{});});
const ambientButton=document.createElement('button');ambientButton.id='ambientToggle';ambientButton.className='sound-toggle';ambientButton.type='button';ambientButton.setAttribute('aria-pressed','false');ambientButton.innerHTML='<span class="sound-mark"></span><span> включить эмбиент</span>';ambientButton.addEventListener('click',playAmbient);$('universe').append(ambientButton);
const soundGate=document.createElement('div');soundGate.className='sound-gate';soundGate.innerHTML='<div class="sound-gate-card"><span class="gate-heart"></span><p>Эта открытка звучит тише, чем шёпот</p><button type="button" data-gate-sound>Открыть со звуком</button><button type="button" data-gate-silent>Открыть без звука</button></div>';const enterCard=()=>{soundGate.remove();if(new Date()>=new Date(CONFIG.targetDate))startCelebration()};soundGate.querySelector('[data-gate-sound]').addEventListener('click',()=>{playAmbient();enterCard()});soundGate.querySelector('[data-gate-silent]').addEventListener('click',enterCard);$('universe').append(soundGate);
let parallaxFrame; window.addEventListener('pointermove',event=>{if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;cancelAnimationFrame(parallaxFrame);parallaxFrame=requestAnimationFrame(()=>{const x=(event.clientX/innerWidth-.5)*5,y=(event.clientY/innerHeight-.5)*5;$('universe').style.setProperty('--px',x+'px');$('universe').style.setProperty('--py',y+'px')})},{passive:true});
// User-selected swap: upper-right photo and the second lower-left photo.
const frameTopRight=document.querySelector('.memory.m5'),frameLowerLeft=document.querySelector('.memory.m4');if(frameTopRight&&frameLowerLeft){const src=frameTopRight.src;frameTopRight.src=frameLowerLeft.src;frameLowerLeft.src=src;}
setupTogether();setupComplimentJar();setupSecret();setupPhoneMotion();seedPhrases();seedPetals();updateCountdown();setInterval(updateCountdown,1000);setInterval(createHeart,1600);setTimeout(createHeart,400);
