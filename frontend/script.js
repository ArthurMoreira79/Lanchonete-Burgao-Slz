/* =====================================================================
   DADOS DO CARDÁPIO
   Estes objetos simulam o que, no futuro, virá do seu banco de dados.
   Quando integrar o backend, basta substituir o conteúdo de menuData e
   bebidasData por uma chamada fetch() à sua API, mantendo o mesmo formato.
   ===================================================================== */
const menuData = {
  hamburgueres: {
    items: [
      { id:'h1', nome:'Hambúrguer Clássico', desc:'Pão, hambúrguer bovino, alface, tomate, cebola e maionese.', preco:18.90 },
      { id:'h2', nome:'Cheeseburger', desc:'Pão, hambúrguer bovino, queijo cheddar, alface, tomate e maionese.', preco:21.90 },
      { id:'h3', nome:'Bacon Burger', desc:'Pão, hambúrguer bovino, cheddar, bacon crocante e maionese.', preco:24.90 },
      { id:'h4', nome:'Duplo Burger', desc:'Pão, dois hambúrgueres bovinos, queijo cheddar e molho especial.', preco:28.90 },
      { id:'h5', nome:'Hambúrguer Especial', desc:'Pão, hambúrguer bovino, queijo, presunto, ovo, alface, tomate e molho da casa.', preco:26.90 }
    ]
  },
  dogs: {
    items: [
      { id:'d1', nome:'Tradicional', desc:'Pão, salsicha, molho de tomate, milho e batata palha.', preco:12.90 },
      { id:'d2', nome:'Completo', desc:'Pão, duas salsichas, milho, ervilha, batata palha e maionese.', preco:15.90 },
      { id:'d3', nome:'Bacon Dog', desc:'Pão, salsicha, bacon crocante, cheddar e batata palha.', preco:17.90 },
      { id:'d4', nome:'Calabresa Dog', desc:'Pão, salsicha, calabresa fatiada, cebola e molho especial.', preco:16.90 },
      { id:'d5', nome:'Especial da Casa', desc:'Pão, duas salsichas, presunto, queijo, ovo, milho, ervilha e batata palha.', preco:19.90 }
    ]
  },
  macarronadas: {
    items: [
      { id:'m1', nome:'Macarronada ao Molho de Tomate', desc:'Massa ao molho de tomate caseiro e queijo ralado.', preco:22.90 },
      { id:'m2', nome:'Macarronada à Bolonhesa', desc:'Massa com molho de carne moída e queijo ralado.', preco:26.90 },
      { id:'m3', nome:'Macarronada ao Molho Branco', desc:'Massa com molho branco cremoso, presunto e queijo.', preco:27.90 }
    ]
  },
  lasanhas: {
    items: [
      { id:'l1', nome:'Lasanha Simples', desc:'Porção individual.', preco:24.90 },
      { id:'l2', nome:'Lasanha Média', desc:'Serve até 2 pessoas.', preco:39.90 },
      { id:'l3', nome:'Lasanha Grande', desc:'Serve até 4 pessoas.', preco:59.90 }
    ]
  }
};

// * Preços acima são valores de exemplo — ajuste para os preços reais do seu cardápio.
const bebidasData = {
  refrigerante: { titulo:'Refrigerante', icone:'🥤', tamanhos:{ '500 ml':6.00, '1 litro':9.00, '1,5 litro':12.00, '2 litros':15.00 } },
  suco:         { titulo:'Suco',         icone:'🧃', tamanhos:{ '500 ml':7.00, '1 litro':11.00, '1,5 litro':14.00, '2 litros':17.00 } },
  agua:         { titulo:'Água',         icone:'💧', tamanhos:{ '500 ml':3.00, '1 litro':5.00, '1,5 litro':7.00, '2 litros':9.00 } }
};

function formatarPreco(valor){
  return 'R$ ' + valor.toFixed(2).replace('.', ',');
}

/* =====================================================================
   RENDERIZAÇÃO DO CARDÁPIO (tickets de pedido)
   ===================================================================== */
function renderizarCardapio(){
  document.querySelectorAll('.grade-itens').forEach(grade => {
    const chave = grade.dataset.categoria;
    const itens = menuData[chave].items;
    grade.innerHTML = itens.map(item => `
      <article class="ticket" data-id="${item.id}">
        <div class="ticket-info">
          <h3>${item.nome}</h3>
          <p>${item.desc}</p>
        </div>
        <div class="ticket-acao">
          <span class="preco">${formatarPreco(item.preco)}</span>
          <button class="botao-add" data-id="${item.id}" data-nome="${item.nome}" data-preco="${item.preco}" aria-label="Adicionar ${item.nome} à comanda">+</button>
        </div>
      </article>
    `).join('');
  });
}

function renderizarBebidas(){
  const tamanhoSelecionado = {};
  const container = document.querySelector('[data-bebidas]');
  container.innerHTML = Object.entries(bebidasData).map(([chave, bebida]) => {
    const tamanhos = Object.keys(bebida.tamanhos);
    tamanhoSelecionado[chave] = tamanhos[0];
    return `
      <div class="cartao-bebida" data-bebida="${chave}">
        <h3>${bebida.icone} ${bebida.titulo}</h3>
        <div class="tamanhos">
          ${tamanhos.map((tam, i) => `
            <button class="tamanho-btn ${i === 0 ? 'selecionado' : ''}" data-bebida="${chave}" data-tamanho="${tam}">${tam}</button>
          `).join('')}
        </div>
        <div class="linha-bebida">
          <span class="preco" data-preco-exibido="${chave}">${formatarPreco(bebida.tamanhos[tamanhos[0]])}</span>
          <button class="botao-add" data-bebida-add="${chave}" aria-label="Adicionar ${bebida.titulo} à comanda">+</button>
        </div>
      </div>
    `;
  }).join('');

  container.querySelectorAll('.tamanho-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const chave = btn.dataset.bebida;
      const tamanho = btn.dataset.tamanho;
      tamanhoSelecionado[chave] = tamanho;
      container.querySelectorAll(`.tamanho-btn[data-bebida="${chave}"]`).forEach(b => b.classList.toggle('selecionado', b === btn));
      const preco = bebidasData[chave].tamanhos[tamanho];
      container.querySelector(`[data-preco-exibido="${chave}"]`).textContent = formatarPreco(preco);
    });
  });

  container.querySelectorAll('[data-bebida-add]').forEach(btn => {
    btn.addEventListener('click', () => {
      const chave = btn.dataset.bebidaAdd;
      const tamanho = tamanhoSelecionado[chave];
      const preco = bebidasData[chave].tamanhos[tamanho];
      const nome = `${bebidasData[chave].titulo} (${tamanho})`;
      adicionarAComanda(`${chave}-${tamanho}`, nome, preco);
      confirmarVisual(btn);
    });
  });
}

/* =====================================================================
   COMANDA (estado do pedido em memória — sem armazenamento local)
   ===================================================================== */
let comanda = [];

function adicionarAComanda(id, nome, preco){
  const existente = comanda.find(i => i.id === id);
  if (existente){ existente.qtd += 1; }
  else { comanda.push({ id, nome, preco, qtd: 1 }); }
  renderizarComanda();
  mostrarToast(`${nome} adicionado à comanda!`);
  animarContagem();
}

function alterarQtd(id, delta){
  const item = comanda.find(i => i.id === id);
  if (!item) return;
  item.qtd += delta;
  if (item.qtd <= 0){ comanda = comanda.filter(i => i.id !== id); }
  renderizarComanda();
}

function removerItem(id){
  comanda = comanda.filter(i => i.id !== id);
  renderizarComanda();
}

function renderizarComanda(){
  const lista = document.getElementById('listaComanda');
  const contagem = document.getElementById('contagemComanda');
  const total = document.getElementById('totalComanda');

  const totalItens = comanda.reduce((soma, i) => soma + i.qtd, 0);
  contagem.textContent = totalItens;

  if (comanda.length === 0){
    lista.innerHTML = '<p class="comanda-vazia">Sua comanda está vazia.<br>Adicione algo gostoso do cardápio! 😋</p>';
  } else {
    lista.innerHTML = comanda.map(item => `
      <div class="item-comanda">
        <div style="flex:1;">
          <div class="nome">${item.nome}</div>
          <div class="preco-unit">${formatarPreco(item.preco)} / un.</div>
          <div class="controle-qtd">
            <button data-acao="menos" data-id="${item.id}" aria-label="Diminuir quantidade">−</button>
            <span>${item.qtd}</span>
            <button data-acao="mais" data-id="${item.id}" aria-label="Aumentar quantidade">+</button>
          </div>
        </div>
        <button class="remover-item" data-acao="remover" data-id="${item.id}" aria-label="Remover ${item.nome}">remover</button>
      </div>
    `).join('');
  }

  const valorTotal = comanda.reduce((soma, i) => soma + i.preco * i.qtd, 0);
  total.textContent = formatarPreco(valorTotal);

  lista.querySelectorAll('[data-acao="mais"]').forEach(b => b.addEventListener('click', () => alterarQtd(b.dataset.id, 1)));
  lista.querySelectorAll('[data-acao="menos"]').forEach(b => b.addEventListener('click', () => alterarQtd(b.dataset.id, -1)));
  lista.querySelectorAll('[data-acao="remover"]').forEach(b => b.addEventListener('click', () => removerItem(b.dataset.id)));
}

function animarContagem(){
  const contagem = document.getElementById('contagemComanda');
  contagem.classList.remove('bounce');
  // força reflow para reiniciar a animação
  void contagem.offsetWidth;
  contagem.classList.add('bounce');
}

function confirmarVisual(botao){
  botao.classList.add('confirmado');
  botao.textContent = '✓';
  setTimeout(() => { botao.classList.remove('confirmado'); botao.textContent = '+'; }, 700);
}

/* =====================================================================
   PAINEL DESLIZANTE + TOAST
   ===================================================================== */
const painel = document.getElementById('painelComanda');
const overlay = document.getElementById('overlay');

function abrirComanda(){
  painel.classList.add('aberto');
  overlay.classList.add('aberto');
}
function fecharComanda(){
  painel.classList.remove('aberto');
  overlay.classList.remove('aberto');
}
document.getElementById('botaoComanda').addEventListener('click', abrirComanda);
document.getElementById('fecharComanda').addEventListener('click', fecharComanda);
overlay.addEventListener('click', fecharComanda);

let toastTimeout;
function mostrarToast(mensagem){
  const toast = document.getElementById('toast');
  toast.textContent = mensagem;
  toast.classList.add('visivel');
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => toast.classList.remove('visivel'), 2200);
}

document.getElementById('finalizarPedido').addEventListener('click', () => {
  if (comanda.length === 0){
    mostrarToast('Sua comanda ainda está vazia!');
    return;
  }
  // TODO: quando o backend estiver pronto, envie `comanda` para a sua API
  // (ex.: fetch('/api/pedidos', { method:'POST', body: JSON.stringify(comanda) }))
  mostrarToast('🚧 Em breve! O envio do pedido será conectado ao banco de dados.');
});

/* =====================================================================
   ADICIONAR ITENS DO CARDÁPIO PRINCIPAL À COMANDA
   ===================================================================== */
document.addEventListener('click', e => {
  const botao = e.target.closest('.botao-add[data-id]');
  if (!botao) return;
  adicionarAComanda(botao.dataset.id, botao.dataset.nome, parseFloat(botao.dataset.preco));
  confirmarVisual(botao);
});

/* =====================================================================
   NAV ATIVO AO ROLAR A PÁGINA + ANIMAÇÃO DE ENTRADA DOS TICKETS
   ===================================================================== */
function configurarObservadores(){
  const linksNav = document.querySelectorAll('.category-nav a');
  const secoes = document.querySelectorAll('.categoria');

  const observadorNav = new IntersectionObserver(entradas => {
    entradas.forEach(entrada => {
      if (entrada.isIntersecting){
        linksNav.forEach(link => link.classList.toggle('ativo', link.getAttribute('href') === '#' + entrada.target.id));
      }
    });
  }, { rootMargin: '-30% 0px -60% 0px' });
  secoes.forEach(secao => observadorNav.observe(secao));

  const preferReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const observadorCartoes = new IntersectionObserver(entradas => {
    entradas.forEach(entrada => {
      if (entrada.isIntersecting){
        entrada.target.classList.add('visivel');
        observadorCartoes.unobserve(entrada.target);
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.ticket, .cartao-bebida').forEach(el => {
    if (preferReducedMotion){ el.classList.add('visivel'); }
    else { observadorCartoes.observe(el); }
  });
}

/* =====================================================================
   INICIALIZAÇÃO
   ===================================================================== */
renderizarCardapio();
renderizarBebidas();
renderizarComanda();
configurarObservadores();
document.getElementById('anoAtual').textContent = new Date().getFullYear();
