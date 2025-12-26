# 🪙 Crypto Tracker - Seguimiento de Criptomonedas

Una aplicación web moderna para el seguimiento en tiempo real de las principales criptomonedas, con soporte offline y diseño responsivo.

## 🌟 Características

- **Datos en Tiempo Real**: Obtiene precios actualizados de las principales criptomonedas usando la API de CoinGecko
- **Actualización Automática**: Refresco automático de datos cada minuto
- **Modo Offline**: Funciona sin conexión gracias a Service Workers que cachean los datos
- **Diseño Responsivo**: Interfaz adaptable a móviles, tablets y escritorio
- **Información Detallada**: Muestra precio actual, cambio en 24h, capitalización de mercado, volumen y rangos de precio

## 📋 Criptomonedas Incluidas

- Bitcoin (BTC)
- Ethereum (ETH)
- Cardano (ADA)
- Binance Coin (BNB)
- Solana (SOL)
- Ripple (XRP)

## 🚀 Instalación y Ejecución

### Opción 1: Ejecución Local Simple

1. **Clonar el repositorio**:
   ```bash
   git clone https://github.com/CarlosGuaman99/CriptoMonedas.git
   cd CriptoMonedas
   ```

2. **Servir la aplicación**:
   
   Con Python 3:
   ```bash
   python -m http.server 8000
   ```
   
   Con Python 2:
   ```bash
   python -m SimpleHTTPServer 8000
   ```
   
   Con Node.js (si tienes `http-server` instalado):
   ```bash
   npx http-server -p 8000
   ```

3. **Abrir en el navegador**:
   ```
   http://localhost:8000
   ```

### Opción 2: GitHub Pages

Esta aplicación puede desplegarse fácilmente en GitHub Pages:

1. **Ir a la configuración del repositorio**:
   - Navega a `Settings` > `Pages`

2. **Configurar la fuente**:
   - En "Source", selecciona la rama `main` (o la rama que desees)
   - Selecciona la carpeta `/ (root)`
   - Haz clic en "Save"

3. **Acceder a la aplicación**:
   - Una vez desplegado, tu aplicación estará disponible en:
   ```
   https://carlosguaman99.github.io/CriptoMonedas/
   ```

### Opción 3: Docker

#### Construir y ejecutar con Docker

1. **Construir la imagen**:
   ```bash
   docker build -t crypto-tracker .
   ```

2. **Ejecutar el contenedor**:
   ```bash
   docker run -d -p 8080:80 --name crypto-tracker-app crypto-tracker
   ```

3. **Acceder a la aplicación**:
   ```
   http://localhost:8080
   ```

4. **Detener el contenedor**:
   ```bash
   docker stop crypto-tracker-app
   ```

5. **Eliminar el contenedor**:
   ```bash
   docker rm crypto-tracker-app
   ```

#### Docker Compose

También puedes usar Docker Compose:

```bash
docker-compose up -d
```

Para detener:
```bash
docker-compose down
```

## 🔧 Tecnologías Utilizadas

- **HTML5**: Estructura semántica de la aplicación
- **CSS3**: Estilos modernos con variables CSS y diseño responsivo
- **JavaScript (ES6+)**: Lógica de la aplicación, consumo de API y manejo del estado
- **Service Workers**: Implementación de funcionalidad offline y caché
- **CoinGecko API**: API pública gratuita para obtener datos de criptomonedas
- **Docker**: Contenerización de la aplicación
- **Nginx**: Servidor web para el contenedor Docker

## 📁 Estructura del Proyecto

```
CriptoMonedas/
├── index.html           # Estructura principal de la aplicación
├── styles.css           # Estilos y diseño responsivo
├── app.js              # Lógica de la aplicación y consumo de API
├── service-worker.js   # Service Worker para modo offline
├── manifest.json       # Manifest para PWA
├── Dockerfile          # Configuración de Docker
├── docker-compose.yml  # Configuración de Docker Compose
├── .gitignore         # Archivos ignorados por Git
├── LICENSE            # Licencia del proyecto
└── README.md          # Este archivo
```

## 🌐 API de CoinGecko

Esta aplicación utiliza la [API pública de CoinGecko](https://www.coingecko.com/api/documentation) para obtener datos de criptomonedas en tiempo real.

**Endpoint utilizado**:
```
https://api.coingecko.com/api/v3/coins/markets
```

**Parámetros**:
- `vs_currency`: USD
- `ids`: Lista de criptomonedas a consultar
- `order`: Ordenado por capitalización de mercado
- `sparkline`: false
- `price_change_percentage`: 24h, 7d

**Nota**: La API gratuita de CoinGecko tiene límites de tasa. Para uso en producción, considera registrarte para obtener una API key.

## 🔒 Modo Offline

La aplicación incluye un Service Worker que:

- Cachea los archivos estáticos (HTML, CSS, JS)
- Guarda las últimas respuestas de la API
- Permite que la aplicación funcione sin conexión a Internet
- Utiliza estrategia "Network First" para datos de API
- Utiliza estrategia "Cache First" para assets estáticos

## 📱 Progressive Web App (PWA)

La aplicación está configurada como PWA, lo que permite:

- Instalación en dispositivos móviles y escritorio
- Funcionalidad offline completa
- Icono en la pantalla de inicio
- Experiencia similar a una aplicación nativa

## 🎨 Personalización

### Cambiar las criptomonedas mostradas

Edita el archivo `app.js` y modifica el array `CRYPTO_IDS`:

```javascript
const CONFIG = {
    CRYPTO_IDS: ['bitcoin', 'ethereum', 'cardano', 'binancecoin', 'solana', 'ripple'],
    // ... resto de la configuración
};
```

### Cambiar el intervalo de actualización

Modifica `REFRESH_INTERVAL` en `app.js` (valor en milisegundos):

```javascript
const CONFIG = {
    REFRESH_INTERVAL: 60000, // 1 minuto = 60000 ms
    // ... resto de la configuración
};
```

### Cambiar la moneda

Modifica `CURRENCY` en `app.js`:

```javascript
const CONFIG = {
    CURRENCY: 'usd', // Cambiar a 'eur', 'gbp', etc.
    // ... resto de la configuración
};
```

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Haz fork del repositorio
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 👤 Autor

Carlos Guaman

## 🙏 Agradecimientos

- [CoinGecko](https://www.coingecko.com/) por proporcionar la API gratuita de criptomonedas
- Comunidad de desarrolladores por las herramientas y recursos utilizados

## 📞 Soporte

Si tienes alguna pregunta o problema, por favor abre un issue en el repositorio de GitHub.

---

**Nota**: Esta es una aplicación educativa. Los datos de criptomonedas se proporcionan "tal cual" y no deben utilizarse como asesoramiento financiero.
