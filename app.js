(function(){
  var root=document.documentElement;
  var theme=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';
  root.setAttribute('data-theme',theme);
  var tbtn=document.querySelector('[data-theme-toggle]');
  function syncLabel(){tbtn.setAttribute('aria-label','Switch to '+(theme==='dark'?'light':'dark')+' mode');}
  syncLabel();
  tbtn.addEventListener('click',function(){theme=theme==='dark'?'light':'dark';root.setAttribute('data-theme',theme);syncLabel();});

  // Header + mobile menu
  var header=document.querySelector('.site-header');
  var menuBtn=document.querySelector('.menu-toggle');
  var mnav=document.getElementById('mobile-nav');
  menuBtn.addEventListener('click',function(){
    var open=menuBtn.getAttribute('aria-expanded')==='true';
    menuBtn.setAttribute('aria-expanded',String(!open));
    menuBtn.setAttribute('aria-label',open?'Open menu':'Close menu');
    mnav.hidden=open;
  });
  mnav.addEventListener('click',function(e){if(e.target.closest('a')){mnav.hidden=true;menuBtn.setAttribute('aria-expanded','false');menuBtn.setAttribute('aria-label','Open menu');}});

  var mcta=document.querySelector('.mobile-cta');
  var contact=document.getElementById('contact');
  function onScroll(){
    header.classList.toggle('scrolled',window.scrollY>8);
    var r=contact.getBoundingClientRect();
    mcta.classList.toggle('hide',window.scrollY<300||(r.top<window.innerHeight&&r.bottom>0));
  }
  window.addEventListener('scroll',onScroll,{passive:true});onScroll();

  // Reveal
  var els=document.querySelectorAll('.section-head,.services li,.steps li,.areas-card,.pull,.facts,.careers-grid>*,.diff-grid>div:first-child');
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(entries){entries.forEach(function(en){if(en.isIntersecting){en.target.classList.add('in');io.unobserve(en.target);}});},{threshold:.12,rootMargin:'0px 0px -40px 0px'});
    els.forEach(function(el,i){el.classList.add('reveal');el.style.transitionDelay=(i%3)*70+'ms';io.observe(el);});
  }

  // Form
  var form=document.getElementById('quote-form');
  var success=document.getElementById('form-success');
  function setErr(id,show){
    var e=document.getElementById(id+'-err');var f=document.getElementById(id);
    e.classList.toggle('show-err',show);
    if(f.closest('.field'))f.closest('.field').classList.toggle('invalid',show);
    f.setAttribute('aria-invalid',show?'true':'false');
    if(show)f.setAttribute('aria-describedby',id+'-err');
  }
  form.addEventListener('submit',function(ev){
    ev.preventDefault();
    var name=form.name.value.trim(),phone=form.phone.value.trim(),email=form.email.value.trim();
    var bad=[];
    setErr('name',!name);if(!name)bad.push('name');
    var phoneOk=phone.replace(/[^0-9]/g,'').length>=10;
    setErr('phone',!phoneOk);if(!phoneOk)bad.push('phone');
    var emailOk=!email||/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    setErr('email',!emailOk);if(!emailOk)bad.push('email');
    var consent=document.getElementById('consent').checked;
    document.getElementById('consent-err').classList.toggle('show-err',!consent);if(!consent)bad.push('consent');
    if(bad.length){document.getElementById(bad[0]).focus();return;}

    var help=[].slice.call(form.querySelectorAll('input[name=help]:checked')).map(function(i){return i.value;});
    var body=[
      'Care enquiry from the website','',
      'Name: '+name,'Phone: '+phone,'Email: '+(email||'not given'),
      'Care is for: '+form.querySelector('input[name=for]:checked').value,
      'Help needed: '+(help.join(', ')||'not sure yet'),
      'How often: '+form.freq.value,
      'Town / postcode: '+(form.area.value.trim()||'not given'),'',
      'Notes:',form.msg.value.trim()||'-'
    ].join('\n');
    var href='mailto:info@valleycare.coop?subject='+encodeURIComponent('Care enquiry: '+name)+'&body='+encodeURIComponent(body);
    document.getElementById('success-name').textContent=name.split(' ')[0];
    document.getElementById('mailto-retry').href=href;
    form.hidden=true;success.hidden=false;success.focus();
    window.location.href=href;
  });
  ['name','phone','email'].forEach(function(id){document.getElementById(id).addEventListener('input',function(){setErr(id,false);});});
})();
