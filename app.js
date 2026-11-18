const products = [
  {id:'platin',name:'Platin PRO',capacity:60,current:520,polarity:'Обратная',shortPolarity:'Обратная',country:'Турция',size:'242 × 175 × 175 мм',price:8500,exchange:7500,image:'assets/platin.jpg',badge:'Низкий корпус',available:true},
  {id:'stalwart',name:'Stalwart EFB',capacity:65,current:650,polarity:'Прямая',shortPolarity:'Прямая',country:'Россия',size:'242 × 175 × 190 мм',price:9000,exchange:8000,image:'assets/stalwart.jpg',badge:'Технология EFB',available:true},
  {id:'zion',name:'ZION Premium',capacity:60,current:600,polarity:'Обратная',shortPolarity:'Обратная',country:'Казахстан',size:'242 × 175 × 190 мм',price:6500,exchange:5500,image:'assets/zion.jpg',badge:'Нет в наличии на сайте',available:false}
];
const money = n => new Intl.NumberFormat('ru-RU').format(n) + ' ₽';
const grid = document.querySelector('#product-grid');
const exchange = document.querySelector('#exchange');
let activeFilter = 'all';
let searchQuery = '';
const normalize = value => String(value).toLowerCase().replace(/ё/g, 'е').replace(/[^а-яa-z0-9]/g, '');
function renderProducts(){
  const visible = products.filter(product => {
    if (activeFilter !== 'all' && product.capacity !== Number(activeFilter)) return false;
    const haystack = normalize([product.name, product.capacity + ' А·ч', product.current + ' А', product.polarity, product.country].join(' '));
    return searchQuery.split(/\s+/).every(term => haystack.includes(normalize(term)));
  });
  grid.innerHTML = visible.map(p => `<article class="product-card"><div class="product-image"><img src="${p.image}" alt="Аккумулятор ${p.name} ${p.capacity} А·ч — фотография из каталога АКБ Мастер" width="500" height="400"><span class="product-label ${!p.available ? 'out' : ''}">${p.badge}</span></div><div class="product-body"><h3>${p.name}</h3><p class="product-origin">${p.country} · Европейский корпус</p><div class="product-specs"><div><strong>${p.capacity} А·ч</strong><span>Ёмкость</span></div><div><strong>${p.current} А</strong><span>Пусковой ток</span></div><div><strong>${p.shortPolarity}</strong><span>Полярность</span></div></div><div class="product-bottom"><div><div class="product-price">${money(exchange.checked ? p.exchange : p.price)}</div><div class="product-price-note">${exchange.checked ? 'при сдаче старого АКБ' : 'без сдачи старого АКБ'}</div></div><button class="button product-button" data-product="${p.id}" aria-label="Подробнее о ${p.name}">Подробнее</button></div></div></article>`).join('');
  if (!visible.length) grid.innerHTML = '<div class="empty-results"><h3>В этой подборке совпадений нет</h3><p>Попробуйте название марки или ёмкость, например «Platin» или «60».</p></div>';
  const feedback = document.querySelector('#search-feedback');
  feedback.hidden = !searchQuery;
  feedback.querySelector('span').textContent = 'Поиск по трём моделям: ' + searchQuery;
  const ending = visible.length === 0 ? 'вариантов' : visible.length === 1 ? 'вариант' : 'варианта';
  document.querySelector('#product-count').textContent = `${visible.length} ${ending}`;
}
document.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click', () => {
  activeFilter = button.dataset.filter;
  document.querySelectorAll('[data-filter]').forEach(b => {b.classList.toggle('active',b === button);b.setAttribute('aria-pressed',String(b === button));});
  renderProducts();
}));
exchange.addEventListener('change',renderProducts);
renderProducts();

const models = {Lada:['Granta','Vesta','Niva','Largus','Priora','Другая модель'],Kia:['Rio','Ceed','Sportage','Sorento','Другая модель'],Hyundai:['Solaris','Creta','Tucson','Santa Fe','Другая модель'],Toyota:['Camry','Corolla','RAV4','Land Cruiser','Другая модель'],Volkswagen:['Polo','Tiguan','Passat','Touareg','Другая модель'],Renault:['Logan','Duster','Sandero','Kaptur','Другая модель'],Haval:['Jolion','F7','Dargo','H6','Другая модель'],'Другая марка':['Уточню у мастера']};
const brandSelect = document.querySelector('#car-brand');
const modelSelect = document.querySelector('#car-model');
const yearSelect = document.querySelector('#car-year');
for(let y=2026;y>=1990;y--){yearSelect.add(new Option(String(y),String(y)));}
yearSelect.add(new Option('Раньше 1990','Раньше 1990'));
brandSelect.addEventListener('change',()=>{
  modelSelect.replaceChildren(new Option(brandSelect.value ? 'Выберите' : '—',''));
  modelSelect.disabled = !brandSelect.value;
  (models[brandSelect.value] || []).forEach(model=>modelSelect.add(new Option(model,model)));
});

const menuButton = document.querySelector('.menu-toggle');
const mobileNav = document.querySelector('#mobile-nav');
function closeMenu(){mobileNav.hidden=true;menuButton.setAttribute('aria-expanded','false');menuButton.setAttribute('aria-label','Открыть меню');}
menuButton.addEventListener('click',()=>{const open=menuButton.getAttribute('aria-expanded')==='true';mobileNav.hidden=open;menuButton.setAttribute('aria-expanded',String(!open));menuButton.setAttribute('aria-label',open?'Открыть меню':'Закрыть меню');});
mobileNav.addEventListener('click',e=>{if(e.target.closest('a'))closeMenu();});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!mobileNav.hidden){closeMenu();menuButton.focus();}});
window.matchMedia('(min-width:961px)').addEventListener('change',e=>{if(e.matches)closeMenu();});

const dialog = document.querySelector('#detail-dialog');
const dialogContent = document.querySelector('#dialog-content');
let lastTrigger;
const escapeHTML = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function showDialog(html){lastTrigger=document.activeElement;dialogContent.innerHTML=html;if(!dialog.open)dialog.showModal();document.body.style.overflow='hidden';}
function closeDialog(){dialog.close();}
document.querySelector('.dialog-close').addEventListener('click',closeDialog);
dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)closeDialog();}});
dialog.addEventListener('close',()=>{document.body.style.overflow='';lastTrigger?.focus();});
const callLink = '<a class="dialog-phone" href="tel:+79061008442">+7 (906) 100-84-42</a>';
function showHelp(){showDialog(`<p class="dialog-tag">Помощь с запуском · Уфа</p><h2 id="dialog-title">Машина не заводится?</h2><p>Позвоните мастеру. Назовите автомобиль и район, расскажите, что происходит при запуске. Уточним решение, стоимость и время приезда.</p>${callLink}<p>Доставка и установка заявлены круглосуточно. Возможность конкретного выезда подтвердит мастер.</p><a class="button button-primary" href="tel:+79061008442">Позвонить мастеру</a>`);}
function showConsult(car=''){
  showDialog(`<p class="dialog-tag">Демонстрация подбора</p><h2 id="dialog-title">Подберём под ваш автомобиль.</h2><p>Мастер уточнит двигатель, размеры и полярность. В концепции можно посмотреть, как будет выглядеть заявка.</p><form id="consult-form" class="dialog-form" novalidate><label for="request-car">Автомобиль<input id="request-car" name="car" autocomplete="off" maxlength="120" placeholder="Например, Kia Rio, 2018" value="${escapeHTML(car)}" required aria-describedby="car-error"></label><p id="car-error" class="form-error" hidden></p><label for="request-phone">Телефон для связи<input id="request-phone" name="phone" type="tel" inputmode="tel" autocomplete="tel" placeholder="+7 (999) 000-00-00" maxlength="25" required aria-describedby="phone-error"></label><p id="phone-error" class="form-error" hidden></p><p class="demo-hint">Демо: данные никуда не отправляются и не сохраняются. Для проверки можно использовать +7 (999) 000-00-00.</p><button type="submit" class="button button-primary">Посмотреть заявку</button></form>`);
  document.querySelector('#consult-form').addEventListener('submit',e=>{
    e.preventDefault();
    const carInput=document.querySelector('#request-car'),phoneInput=document.querySelector('#request-phone');
    const digits=phoneInput.value.replace(/\D/g,'');
    const carError=document.querySelector('#car-error'),phoneError=document.querySelector('#phone-error');
    const invalidCar=carInput.value.trim().length<2,invalidPhone=!/^[78]\d{10}$/.test(digits);
    carError.hidden=!invalidCar;carError.textContent=invalidCar?'Укажите марку или модель автомобиля.':'';carInput.setAttribute('aria-invalid',String(invalidCar));
    phoneError.hidden=!invalidPhone;phoneError.textContent=invalidPhone?'Введите 11 цифр, начиная с 7 или 8.':'';phoneInput.setAttribute('aria-invalid',String(invalidPhone));
    if(invalidCar||invalidPhone){(invalidCar?carInput:phoneInput).focus();return;}
    const car=escapeHTML(carInput.value.trim()),phone=escapeHTML(phoneInput.value);
    dialogContent.innerHTML=`<div class="success-mark"><svg class="icon"><use href="#check"/></svg></div><h2 id="dialog-title" tabindex="-1">Вот как выглядит заявка.</h2><p>Это только предпросмотр: заявка не отправлена. Так посетитель увидит свои данные после заполнения.</p><dl class="dialog-summary"><div><dt>Автомобиль</dt><dd>${car}</dd></div><div><dt>Телефон</dt><dd>${phone}</dd></div><div><dt>Запрос</dt><dd>Подбор аккумулятора</dd></div></dl><button class="button button-primary" data-done>Понятно</button>`;
    document.querySelector('[data-done]').addEventListener('click',closeDialog);
    document.querySelector('#dialog-title').focus();
  });
}
document.querySelector('#pick-form').addEventListener('submit',e=>{e.preventDefault();showConsult(`${brandSelect.value} ${modelSelect.value}, ${yearSelect.value}`);});
document.querySelectorAll('[data-help]').forEach(b=>b.addEventListener('click',showHelp));
document.querySelectorAll('[data-consult]').forEach(b=>b.addEventListener('click',()=>showConsult()));
document.querySelector('[data-exchange]').addEventListener('click',()=>showDialog(`<p class="dialog-tag">Обмен старой батареи</p><h2 id="dialog-title">Старый аккумулятор — часть оплаты.</h2><p>На действующем сайте заявлена скидка от 1 000 ₽ за АКБ от 60 А·ч. Точная сумма зависит от сдаваемой батареи.</p><p>Назовите мастеру ёмкость старого аккумулятора и модель нового. Он подтвердит цену с обменом, наличие и условия передачи.</p>${callLink}<a class="button button-primary" href="tel:+79061008442">Уточнить стоимость обмена</a>`));
document.querySelectorAll('[data-service]').forEach(b=>b.addEventListener('click',()=>{
  const diagnostics=b.dataset.service==='diagnostics';
  showDialog(`<p class="dialog-tag">Сервис АКБ Мастер</p><h2 id="dialog-title">${diagnostics?'Проверим, что с батареей.':'Поможем восстановить заряд.'}</h2><p>${diagnostics?'Проверим основные показатели аккумулятора. Если новая батарея быстро разряжается, обсудим диагностику электрики автомобиля.':'В магазине есть обслуживание аккумуляторов. Мастер оценит состояние батареи и подскажет, поможет ли зарядка.'}</p><p>Стоимость, длительность и доступное время уточните по телефону. Магазин: Комсомольская, 58.</p>${callLink}<a class="button button-primary" href="tel:+79061008442">Обсудить с мастером</a>`);
}));
grid.addEventListener('click',e=>{
  const button=e.target.closest('[data-product]');if(!button)return;
  const p=products.find(p=>p.id===button.dataset.product);
  showDialog(`<img class="dialog-product-image" src="${p.image}" alt="${p.name}"><p class="dialog-tag">${p.available?'Наличие уточняйте':'На исходном сайте товар закончился'}</p><h2 id="dialog-title">${p.name}</h2><dl class="dialog-summary"><div><dt>Ёмкость / пусковой ток</dt><dd>${p.capacity} А·ч / ${p.current} А</dd></div><div><dt>Полярность</dt><dd>${p.polarity}</dd></div><div><dt>Размеры</dt><dd>${p.size}</dd></div><div><dt>Гарантия по каталогу</dt><dd>1 год</dd></div><div><dt>С обменом</dt><dd>${money(p.exchange)}</dd></div><div><dt>Без обмена</dt><dd>${money(p.price)}</dd></div></dl><p>Данные с сайта на 18.11.2026. Перед покупкой уточните цену, наличие и совместимость с автомобилем.</p><a class="button button-primary" href="tel:+79061008442">${p.available?'Уточнить у мастера':'Узнать о наличии и аналогах'}</a>`);
});

// Keep the mobile shortcuts within reach once the main actions scroll out of view.
const mobileActions = document.querySelector('.mobile-action');
const heroActions = document.querySelector('.hero-actions');
mobileActions.hidden = true;
const actionObserver = new IntersectionObserver(([entry]) => {
  mobileActions.hidden = entry.isIntersecting || entry.boundingClientRect.bottom > 0;
}, { rootMargin: '-78px 0px 0px 0px' });
actionObserver.observe(heroActions);

const searchField = document.querySelector('#search-text');
function searchProducts(value) {
  searchQuery = value.trim();
  searchField.value = searchQuery;
  document.querySelector('#mobile-search-text').value = searchQuery;
  document.querySelector('[data-filter="all"]').click();
}
document.querySelector('#store-search').addEventListener('submit', event => {
  event.preventDefault();
  searchProducts(searchField.value);
  const catalogHeading = document.querySelector('#catalog-title');
  catalogHeading.tabIndex = -1;
  catalogHeading.focus({preventScroll:true});
  document.querySelector('#catalog').scrollIntoView();
});
document.querySelector('#reset-search').addEventListener('click', () => {
  searchField.value = '';
  searchProducts('');
  document.querySelector('[data-filter="all"]').focus();
});
const shopPhotographs = {
  entrance: ['assets/entrance.jpg', 'Вход в магазин АКБ Мастер на Комсомольской, 58'],
  shop: ['assets/shop.jpg', 'Автомобиль доставки АКБ Мастер у магазина']
};
const photoButtons = document.querySelectorAll('[data-photo]');
photoButtons.forEach(button => button.addEventListener('click', () => {
  const [src, description] = shopPhotographs[button.dataset.photo];
  const photo = document.querySelector('#contact-view');
  photo.src = src;
  photo.alt = description;
  photoButtons.forEach(other => other.setAttribute('aria-pressed', String(other === button)));
}));

document.querySelector('#mobile-search').addEventListener('submit', event => {
  event.preventDefault();
  searchProducts(document.querySelector('#mobile-search-text').value);
});
