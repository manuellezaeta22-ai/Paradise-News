const LATITUD = -33.38;
const LONGITUD = -56.52;


// ==============================
// INTERPRETAR ESTADO DEL CLIMA
// ==============================

function interpretarClima(codigo) {

    const estados = {
        0: { icono: "☀️", texto: "Despejado" },
        1: { icono: "🌤️", texto: "Mayormente despejado" },
        2: { icono: "⛅", texto: "Parcialmente nublado" },
        3: { icono: "☁️", texto: "Nublado" },

        45: { icono: "🌫️", texto: "Niebla" },
        48: { icono: "🌫️", texto: "Niebla con escarcha" },

        51: { icono: "🌦️", texto: "Llovizna ligera" },
        53: { icono: "🌦️", texto: "Llovizna moderada" },
        55: { icono: "🌧️", texto: "Llovizna intensa" },

        56: { icono: "🌧️", texto: "Llovizna helada ligera" },
        57: { icono: "🌧️", texto: "Llovizna helada intensa" },

        61: { icono: "🌧️", texto: "Lluvia ligera" },
        63: { icono: "🌧️", texto: "Lluvia moderada" },
        65: { icono: "🌧️", texto: "Lluvia intensa" },

        66: { icono: "🌧️", texto: "Lluvia helada ligera" },
        67: { icono: "🌧️", texto: "Lluvia helada intensa" },

        71: { icono: "🌨️", texto: "Nevada ligera" },
        73: { icono: "🌨️", texto: "Nevada moderada" },
        75: { icono: "❄️", texto: "Nevada intensa" },
        77: { icono: "❄️", texto: "Granizo de nieve" },

        80: { icono: "🌦️", texto: "Chaparrones ligeros" },
        81: { icono: "🌧️", texto: "Chaparrones moderados" },
        82: { icono: "🌧️", texto: "Chaparrones intensos" },

        85: { icono: "🌨️", texto: "Chaparrones de nieve ligeros" },
        86: { icono: "🌨️", texto: "Chaparrones de nieve intensos" },

        95: { icono: "⛈️", texto: "Tormenta" },
        96: { icono: "⛈️", texto: "Tormenta con granizo ligero" },
        99: { icono: "⛈️", texto: "Tormenta con granizo intenso" }
    };

    return estados[codigo] || {
        icono: "🌡️",
        texto: "Condición desconocida"
    };
}


// ==============================
// OBTENER CLIMA
// ==============================

async function obtenerClima() {

    const url = `https://api.open-meteo.com/v1/forecast?latitude=${LATITUD}&longitude=${LONGITUD}&current=temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=America%2FMontevideo`;

    try {

        const respuesta = await fetch(url);

        if (!respuesta.ok) {
            throw new Error("No se pudo obtener el clima");
        }

        const datos = await respuesta.json();

        // ==============================
        // CLIMA ACTUAL
        // ==============================

        const actual = datos.current;

        const climaActual =
            interpretarClima(actual.weather_code);

        const temperatura =
            Math.round(actual.temperature_2m);

        const humedad =
            Math.round(actual.relative_humidity_2m);

        const viento =
            Math.round(actual.wind_speed_10m);

        const sensacion =
            Math.round(actual.apparent_temperature);


        // Temperatura principal
        const temperaturaElemento =
            document.querySelector(".temperatura");

        if (temperaturaElemento) {
            temperaturaElemento.textContent =
                `${temperatura}°`;
        }


        // Estado del clima
        const estadoElemento =
            document.querySelector(".estado");

        if (estadoElemento) {
            estadoElemento.textContent =
                climaActual.texto;
        }


        // Icono principal
        const iconoElemento =
            document.querySelector(".icono");

        if (iconoElemento) {
            iconoElemento.textContent =
                climaActual.icono;
        }


        // Humedad
        const humedadElemento =
            document.querySelector(".humedad");

        if (humedadElemento) {
            humedadElemento.textContent =
                `${humedad}%`;
        }


        // Viento
        const vientoElemento =
            document.querySelector(".viento");

        if (vientoElemento) {
            vientoElemento.textContent =
                `${viento} km/h`;
        }


        // Sensación térmica
        const sensacionElemento =
            document.querySelector(".sensacion");

        if (sensacionElemento) {
            sensacionElemento.textContent =
                `${sensacion}°`;
        }


        // ==============================
        // PRONÓSTICO
        // ==============================

        const contenedor =
            document.querySelector(".dias");

        if (!contenedor) {
            console.error(
                "No existe el contenedor .dias"
            );
            return;
        }

        contenedor.innerHTML = "";


        for (
            let i = 0;
            i < datos.daily.time.length;
            i++
        ) {

            const fecha = new Date(
                datos.daily.time[i] +
                "T12:00:00"
            );

            const dia =
                fecha.toLocaleDateString(
                    "es-UY",
                    {
                        weekday: "short",
                        day: "numeric",
                        month: "short"
                    }
                );

            const maxima =
                Math.round(
                    datos.daily.temperature_2m_max[i]
                );

            const minima =
                Math.round(
                    datos.daily.temperature_2m_min[i]
                );

            const lluvia =
                datos.daily.precipitation_probability_max[i];

            const codigo =
                datos.daily.weather_code[i];

            const clima =
                interpretarClima(codigo);


            const tarjeta =
                document.createElement("article");

            tarjeta.classList.add("dia");


            tarjeta.innerHTML = `
                <h3>${dia}</h3>

                <span class="icono-clima">
                    ${clima.icono}
                </span>

                <p class="estado-clima">
                    ${clima.texto}
                </p>

                <strong>
                    ${maxima}°
                </strong>

                <p>
                    Mínima: ${minima}°
                </p>

                <small>
                    🌧️ ${lluvia}% de lluvia
                </small>
            `;


            contenedor.appendChild(tarjeta);
        }

    } catch (error) {

        console.error(
            "Error obteniendo el clima:",
            error
        );
    }
}


// ==============================
// INICIAR
// ==============================

obtenerClima();


// Actualizar cada 10 minutos
setInterval(
    obtenerClima,
    10 * 60 * 1000
);