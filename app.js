// Configuración de la aplicación
const CONFIG = {
    API_URL: 'https://api.coingecko.com/api/v3',
    CRYPTO_IDS: ['bitcoin', 'ethereum', 'cardano', 'binancecoin', 'solana', 'ripple'],
    REFRESH_INTERVAL: 60000, // 1 minuto
    CURRENCY: 'usd'
};

// Estado de la aplicación
let appState = {
    cryptoData: [],
    lastUpdate: null,
    isOnline: navigator.onLine,
    autoRefresh: null
};

// Elementos del DOM
const elements = {
    cryptoGrid: document.getElementById('crypto-grid'),
    loading: document.getElementById('loading'),
    error: document.getElementById('error'),
    refreshBtn: document.getElementById('refresh-btn'),
    statusIndicator: document.getElementById('status-indicator'),
    statusText: document.getElementById('status-text'),
    lastUpdateTime: document.getElementById('last-update-time')
};

/**
 * Obtiene los datos de criptomonedas desde la API de CoinGecko
 */
async function fetchCryptoData() {
    try {
        const ids = CONFIG.CRYPTO_IDS.join(',');
        const url = `${CONFIG.API_URL}/coins/markets?vs_currency=${CONFIG.CURRENCY}&ids=${ids}&order=market_cap_desc&sparkline=false&price_change_percentage=24h,7d`;
        
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Guardar en caché para modo offline
        if ('caches' in window) {
            const cache = await caches.open('crypto-cache-v1');
            cache.put('crypto-data', new Response(JSON.stringify(data)));
        }
        
        return data;
    } catch (error) {
        console.error('Error al obtener datos de la API:', error);
        
        // Intentar cargar desde caché si estamos offline
        if ('caches' in window) {
            const cache = await caches.open('crypto-cache-v1');
            const cachedResponse = await cache.match('crypto-data');
            
            if (cachedResponse) {
                const data = await cachedResponse.json();
                return data;
            }
        }
        
        throw error;
    }
}

/**
 * Formatea un número como precio en USD
 */
function formatPrice(price) {
    return new Intl.NumberFormat('es-ES', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: price < 1 ? 6 : 2
    }).format(price);
}

/**
 * Formatea un número grande (market cap, volumen)
 */
function formatLargeNumber(num) {
    if (num >= 1e12) {
        return `$${(num / 1e12).toFixed(2)}T`;
    } else if (num >= 1e9) {
        return `$${(num / 1e9).toFixed(2)}B`;
    } else if (num >= 1e6) {
        return `$${(num / 1e6).toFixed(2)}M`;
    } else {
        return `$${num.toFixed(2)}`;
    }
}

/**
 * Formatea un cambio de porcentaje con color
 */
function formatPercentChange(percent) {
    const isPositive = percent >= 0;
    const className = isPositive ? 'change-positive' : 'change-negative';
    const symbol = isPositive ? '▲' : '▼';
    return `<span class="${className}">${symbol} ${Math.abs(percent).toFixed(2)}%</span>`;
}

/**
 * Crea una tarjeta de criptomoneda
 */
function createCryptoCard(crypto) {
    const card = document.createElement('div');
    card.className = 'crypto-card';
    
    card.innerHTML = `
        <div class="crypto-header">
            <img src="${crypto.image}" alt="${crypto.name}" class="crypto-icon">
            <div class="crypto-info">
                <h3>${crypto.name}</h3>
                <span class="crypto-symbol">${crypto.symbol}</span>
            </div>
        </div>
        <div class="crypto-price">${formatPrice(crypto.current_price)}</div>
        <div class="crypto-stats">
            <div class="stat">
                <span class="stat-label">Cambio 24h:</span>
                <span class="stat-value">${formatPercentChange(crypto.price_change_percentage_24h)}</span>
            </div>
            <div class="stat">
                <span class="stat-label">Cap. Mercado:</span>
                <span class="stat-value">${formatLargeNumber(crypto.market_cap)}</span>
            </div>
            <div class="stat">
                <span class="stat-label">Volumen 24h:</span>
                <span class="stat-value">${formatLargeNumber(crypto.total_volume)}</span>
            </div>
            <div class="stat">
                <span class="stat-label">Máximo 24h:</span>
                <span class="stat-value">${formatPrice(crypto.high_24h)}</span>
            </div>
            <div class="stat">
                <span class="stat-label">Mínimo 24h:</span>
                <span class="stat-value">${formatPrice(crypto.low_24h)}</span>
            </div>
        </div>
    `;
    
    return card;
}

/**
 * Renderiza las tarjetas de criptomonedas
 */
function renderCryptoCards(data) {
    elements.cryptoGrid.innerHTML = '';
    
    data.forEach(crypto => {
        const card = createCryptoCard(crypto);
        elements.cryptoGrid.appendChild(card);
    });
}

/**
 * Actualiza el tiempo de última actualización
 */
function updateLastUpdateTime() {
    if (appState.lastUpdate) {
        const time = new Date(appState.lastUpdate).toLocaleTimeString('es-ES');
        elements.lastUpdateTime.textContent = time;
    }
}

/**
 * Muestra el estado de carga
 */
function showLoading() {
    elements.loading.style.display = 'block';
    elements.error.style.display = 'none';
    elements.cryptoGrid.style.display = 'none';
}

/**
 * Oculta el estado de carga
 */
function hideLoading() {
    elements.loading.style.display = 'none';
    elements.cryptoGrid.style.display = 'grid';
}

/**
 * Muestra un mensaje de error
 */
function showError() {
    elements.loading.style.display = 'none';
    elements.error.style.display = 'block';
    elements.cryptoGrid.style.display = 'none';
}

/**
 * Actualiza el estado de conexión
 */
function updateConnectionStatus() {
    appState.isOnline = navigator.onLine;
    
    if (appState.isOnline) {
        elements.statusIndicator.className = 'status-online';
        elements.statusText.textContent = 'En línea';
    } else {
        elements.statusIndicator.className = 'status-offline';
        elements.statusText.textContent = 'Sin conexión (modo offline)';
    }
}

/**
 * Carga y muestra los datos de criptomonedas
 */
async function loadCryptoData() {
    try {
        showLoading();
        
        const data = await fetchCryptoData();
        appState.cryptoData = data;
        appState.lastUpdate = Date.now();
        
        renderCryptoCards(data);
        updateLastUpdateTime();
        hideLoading();
        
    } catch (error) {
        console.error('Error al cargar datos:', error);
        showError();
    }
}

/**
 * Inicia la actualización automática
 */
function startAutoRefresh() {
    if (appState.autoRefresh) {
        clearInterval(appState.autoRefresh);
    }
    
    appState.autoRefresh = setInterval(() => {
        if (appState.isOnline) {
            loadCryptoData();
        }
    }, CONFIG.REFRESH_INTERVAL);
}

/**
 * Registra el Service Worker
 */
async function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        try {
            const registration = await navigator.serviceWorker.register('/service-worker.js');
            console.log('Service Worker registrado correctamente:', registration.scope);
        } catch (error) {
            console.error('Error al registrar el Service Worker:', error);
        }
    }
}

/**
 * Inicializa la aplicación
 */
function init() {
    // Registrar Service Worker
    registerServiceWorker();
    
    // Configurar event listeners
    elements.refreshBtn.addEventListener('click', loadCryptoData);
    
    window.addEventListener('online', () => {
        updateConnectionStatus();
        loadCryptoData();
    });
    
    window.addEventListener('offline', updateConnectionStatus);
    
    // Actualizar estado de conexión
    updateConnectionStatus();
    
    // Cargar datos iniciales
    loadCryptoData();
    
    // Iniciar actualización automática
    startAutoRefresh();
}

// Inicializar la aplicación cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
