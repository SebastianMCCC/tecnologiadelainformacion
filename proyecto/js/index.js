/* ==========================================
   NEXUS CORE SYSTEM
   ========================================== */
const AppState = {
    wallet: 1000.00,
    portfolio: 0,
    miningRate: 0,
    isMining: false
};

// UI Elements
const walletEl = document.getElementById('virtualWallet');
const netWorthEl = document.getElementById('netWorth');

/* --- NAVEGACIÓN --- */
function switchTab(tabId) {
    document.querySelectorAll('.view-section').forEach(el => el.classList.add('d-none'));
    document.getElementById(`view-${tabId}`).classList.remove('d-none');
    
    // Actualizar menú activo
    document.querySelectorAll('.nav-link').forEach(el => el.classList.remove('active'));
    event.currentTarget.classList.add('active'); // Nota: esto requiere pasar el evento, simplificado aqui
}

/* --- GRÁFICO OPTIMIZADO (FIX LAG) --- */
let marketChart;
let marketValue = 100;
let priceHistory = Array(50).fill(100); // Mantenemos solo 50 puntos

function initChart() {
    const ctx = document.getElementById('liveChart').getContext('2d');
    
    marketChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: Array(50).fill(''),
            datasets: [{
                label: 'NEXUS INDEX',
                data: priceHistory,
                borderColor: '#00f2ff',
                borderWidth: 2,
                pointRadius: 0, // Sin puntos para mejorar rendimiento
                fill: true,
                backgroundColor: 'rgba(0, 242, 255, 0.05)',
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: false, // CRÍTICO: Desactivar animación global para evitar LAG
            interaction: { intersect: false },
            plugins: { legend: { display: false } },
            scales: {
                x: { display: false },
                y: { 
                    display: true, 
                    grid: { color: '#222' },
                    ticks: { color: '#666' }
                }
            }
        }
    });

    // Loop de actualización (Cada 1s)
    setInterval(updateMarket, 1000);
}

function updateMarket() {
    // Random walk
    let change = (Math.random() - 0.5) * 4;
    marketValue += change;
    if (marketValue < 10) marketValue = 10;

    // Actualizar array de datos (FIFO: First In, First Out)
    priceHistory.shift(); 
    priceHistory.push(marketValue);

    // Actualizar gráfico sin animación pesada
    marketChart.update('none'); // 'none' mode es clave para el rendimiento
    
    // Actualizar color según tendencia
    const color = priceHistory[49] > priceHistory[48] ? '#00f2ff' : '#ff0055';
    marketChart.data.datasets[0].borderColor = color;
}

/* --- SISTEMA DE COMERCIO --- */
function trade(type) {
    const amount = marketValue; // Compra 1 unidad al precio actual
    if (type === 'buy') {
        if (AppState.wallet >= amount) {
            AppState.wallet -= amount;
            AppState.portfolio += amount;
            showNotification(`Compra exitosa a $${amount.toFixed(2)}`, 'success');
        } else {
            showNotification('Fondos insuficientes', 'danger');
        }
    } else {
        if (AppState.portfolio > 0) {
            AppState.wallet += amount; // Vende todo (simplificado)
            AppState.portfolio = 0;
            showNotification('Venta completada', 'warning');
        }
    }
    updateUI();
}

/* --- TERMINAL DE MINERÍA (SIMULADOR) --- */
let miningInterval;

function toggleMining() {
    const output = document.getElementById('terminalOutput');
    AppState.isMining = !AppState.isMining;

    if (AppState.isMining) {
        output.innerHTML += `<div class="text-warning">> Iniciando secuencia de minería...</div>`;
        miningInterval = setInterval(() => {
            const reward = Math.random() * 0.5;
            AppState.wallet += reward;
            updateUI();
            
            // Auto-scroll
            const line = document.createElement('div');
            line.className = 'text-muted small';
            line.innerHTML = `> Block found: ${Math.random().toString(36).substring(7)} | +$${reward.toFixed(2)}`;
            output.appendChild(line);
            output.scrollTop = output.scrollHeight;
            
            // Limpieza de terminal para que no se sature
            if(output.children.length > 50) output.removeChild(output.children[0]);
            
        }, 2000);
    } else {
        clearInterval(miningInterval);
        output.innerHTML += `<div class="text-danger">> Proceso detenido por usuario.</div>`;
    }
}

/* --- UTILIDADES --- */
function updateUI() {
    walletEl.innerText = `$${AppState.wallet.toFixed(2)}`;
    netWorthEl.innerText = `$${(AppState.wallet + AppState.portfolio).toFixed(2)}`;
}

function showNotification(msg, type) {
    const container = document.getElementById('notificationArea');
    const toast = document.createElement('div');
    toast.className = `toast align-items-center text-white bg-${type} border-0 show`;
    toast.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">${msg}</div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" onclick="this.parentElement.parentElement.remove()"></button>
        </div>`;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
    initChart();
    updateUI();
});

const ideas = [
    { titulo: "E-commerce local", desc: "Vende productos de tu ciudad usando TikTok, Instagram y WhatsApp." },
    { titulo: "Servicios digitales", desc: "Edición de video, manejo de redes o diseño para pequeños negocios." },
    { titulo: "Inversiones básicas", desc: "Aprende sobre CETES, fondos indexados y ahorros automáticos." },
    { titulo: "Trabajar en EE.UU.", desc: "Opciones legales como visas de trabajo o programas para jóvenes." },
    { titulo: "Crear contenido", desc: "YouTube, TikTok o streams: empieza con tu celular y constancia." },
    { titulo: "Fitness y salud", desc: "Entrenador personal, planes de comida o rutinas online." },
    { titulo: "Reparaciones", desc: "Arreglar celulares, laptops o consolas es de alta demanda." }
];

// Mostrar ideas en tarjetas
const container = document.getElementById("ideas-container");
ideas.forEach(i => {
    container.innerHTML += `
        <div class="col-md-4 mb-4">
            <div class="card card-custom p-3">
                <h4>${i.titulo}</h4>
                <p>${i.desc}</p>
            </div>
        </div>`;
});

// Scroll
function scrollToIdeas() {
    document.getElementById("ideas").scrollIntoView({ behavior: "smooth" });
}

// Idea aleatoria
function ideaAleatoria() {
    const random = ideas[Math.floor(Math.random() * ideas.length)];
    document.getElementById("randomIdea").innerHTML = `💡 <strong>${random.titulo}</strong>: ${random.desc}`;
}

// "IA" básica que analiza ideas
function analizarIdea() {
    const idea = document.getElementById("ideaInput").value.trim();
    const res = document.getElementById("resultadoIA");

    if (idea === "") {
        res.innerHTML = `<div class='alert alert-danger'>Escribe una idea primero.</div>`;
        return;
    }

    const analisis = `
        <h4>🔍 Análisis de tu idea:</h4>
        <p><strong>Potencial:</strong> Esta idea tiene futuro si te enfocas en un nicho pequeño y validas con pocas personas.</p>
        <p><strong>Primeros pasos:</strong> Crea una versión pequeña de tu idea. Por ejemplo: ${idea} pero empezando con algo simple.</p>
        <p><strong>Recomendación:</strong> Investiga competidores, define tu público y crea contenido o prototipos.</p>
    `;

    res.innerHTML = analisis;
    function updateUI() {
    walletEl.innerText = `$${AppState.wallet.toFixed(2)}`;
    netWorthEl.innerText = `$${(AppState.wallet + AppState.portfolio).toFixed(2)}`;
    xpBar.style.width = `${AppState.xp}%`;
    levelEl.innerText = AppState.level; 
    
    // AGREGA ESTA LÍNEA NUEVA:
    if(document.getElementById('userLevelHeader')) {
        document.getElementById('userLevelHeader').innerText = AppState.level;
    }
}
}