'use strict';

const switcher = document.querySelector('.btn');

if (switcher) {
    switcher.addEventListener('click', function () {
        document.body.classList.toggle('light-theme');
        document.body.classList.toggle('dark-theme');

        if (document.body.classList.contains('dark-theme')) {
            this.textContent = "Claro";
        } else {
            this.textContent = "Oscuro";
        }

        console.log('Clases actuales en body: ' + document.body.className);
    });
}

const filterBtns = document.querySelectorAll('.filter-btn');
if (filterBtns.length > 0) {
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            const filterValue = this.textContent;
            console.log('Filtrando por: ' + filterValue);

            const schoolCards = document.querySelectorAll('.school-card');
            schoolCards.forEach(card => {
                if (filterValue === 'Todas') {
                    card.style.display = 'flex';
                } else {
                    const tags = card.querySelectorAll('.tag');
                    let hasMatch = false;
                    tags.forEach(tag => {
                        if (tag.textContent === filterValue) {
                            hasMatch = true;
                        }
                    });
                    card.style.display = hasMatch ? 'flex' : 'none';
                }
            });
        });
    });
}

async function cargarEscuelas() {
    try {
        const res = await fetch('/api/escuelas');
        const { data } = await res.json();

        const contenedor = document.querySelector('.results-section');
        if (!contenedor) return;

        contenedor.innerHTML = '<h2>Resultados en CDMX</h2>';

        data.forEach(escuela => {
            const tags = escuela.tags.split(',').map(t =>
                `<span class="tag">${t.trim()}</span>`
            ).join('');

            const lat = escuela.latitud || 19.4326;
            const lng = escuela.longitud || -99.1332;

            contenedor.innerHTML += `
            <div class="school-card" 
                 onclick="mostrarEscuelaEnMapa(${lat}, ${lng}, '${escuela.nombre_escuela.replace(/'/g, "\\'")}')" 
                 style="cursor: pointer;">
                <div class="school-info">
                    <h3>${escuela.nombre_escuela}</h3>
                    <p class="school-location">📍 ${escuela.alcaldia}, ${escuela.estado}</p>
                    <div class="school-tags">${tags}</div>
                </div>
                <div class="school-distance">${escuela.turno}</div>
            </div>`;
        });

    } catch (error) {
        console.error('Error cargando escuelas:', error);
    }
}

async function cargarGuias() {
    try {
        const res = await fetch('/api/guias');
        const { data } = await res.json();

        const contenedor = document.querySelector('.guides-grid');
        if (!contenedor) return;

        contenedor.innerHTML = '';

        data.forEach(guia => {
            contenedor.innerHTML += `
            <div class="guide-card">
                <div class="guide-category ${guia.categoria.toLowerCase()}">${guia.categoria}</div>
                <h3>${guia.titulo}</h3>
                <div class="guide-meta-bottom">
                    <span>⏱️ ${guia.tiempo_lectura}</span>
                    <span>📄 PDF</span>
                </div>
            </div>`;
        });

    } catch (error) {
        console.error('Error cargando guías:', error);
    }
}

async function cargarEventos() {
    try {
        const res = await fetch('/api/eventos');
        const { data } = await res.json();

        const contenedor = document.querySelector('.events-list');
        if (!contenedor) return;

        contenedor.innerHTML = '';

        data.forEach(evento => {
            const fecha = new Date(evento.fecha);
            const dia = fecha.getDate() + 1;
            const mes = fecha.toLocaleString('es-MX', { month: 'short' }).toUpperCase();

            contenedor.innerHTML += `
            <div class="event-card">
                <div class="event-date">
                    <span class="event-day">${dia}</span>
                    <span class="event-month">${mes}</span>
                </div>
                <div class="event-info">
                    <h3>${evento.titulo}</h3>
                    <p>📍 ${evento.lugar} · ${evento.modalidad}</p>
                    <p>${evento.descripcion}</p>
                </div>
                <button class="event-btn">Interesado</button>
            </div>`;
        });

    } catch (error) {
        console.error('Error cargando eventos:', error);
    }
}

if (document.querySelector('.results-section')) cargarEscuelas();
if (document.querySelector('.guides-grid')) cargarGuias();
if (document.querySelector('.events-list')) cargarEventos();

let miMapa;
let marcadorActual;

let mapInstance = null;

function mostrarEscuelaEnMapa(lat, lng, nombre = "Escuela seleccionada") {
    if (mapInstance !== null) {
        mapInstance.remove();
    }

    mapInstance = L.map('mapa-escuela').setView([lat, lng], 15);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(mapInstance);

    L.marker([lat, lng])
        .addTo(mapInstance)
        .bindPopup(`<b>${nombre}</b>`)
        .openPopup();
}

function inicializarMapa() {
    const contenedorMapa = document.getElementById('mapa-escuela');
    if (!contenedorMapa) return;

    miMapa = L.map('mapa-escuela').setView([19.4326, -99.1332], 11);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(miMapa);

    if (document.querySelector('.results-section')) {
        cargarEscuelas();
        inicializarMapa();
    }
}

/*function mostrarEscuelaEnMapa(latitud, longitud, nombreEscuela) {
    if (!miMapa) return;

        miMapa.setView([latitud, longitud], 15);

        if (marcadorActual) {
        miMapa.removeLayer(marcadorActual);
    }

        marcadorActual = L.marker([latitud, longitud])
        .addTo(miMapa)
        .bindPopup(`<b>${nombreEscuela}</b>`)
        .openPopup();
}*/

let todasLasEscuelas = [];

document.addEventListener('DOMContentLoaded', () => {
    const btnFiltros = document.getElementById('btn-filtros-avanzados');
    const panelFiltros = document.getElementById('panel-filtros');
    const txtBuscador = document.getElementById('txt-buscador');

    if (btnFiltros && panelFiltros) {
        btnFiltros.addEventListener('click', (e) => {
            e.stopPropagation(); if (panelFiltros.style.display === 'none' || panelFiltros.style.display === '') {
                panelFiltros.style.display = 'grid';
            } else {
                panelFiltros.style.display = 'none';
            }
        });

        document.addEventListener('click', (e) => {
            if (!panelFiltros.contains(e.target) && e.target !== btnFiltros) {
                panelFiltros.style.display = 'none';
            }
        });
    }

    if (txtBuscador) {
        txtBuscador.addEventListener('input', filtrarEscuelas);
    }
});

function filtrarEscuelas() {
    const busquedaGeneral = document.getElementById('txt-buscador').value.toLowerCase().trim();
    const filtroDelegacion = document.getElementById('filtro-delegacion').value.toLowerCase().trim();
    const filtroCiudad = document.getElementById('filtro-ciudad').value.toLowerCase().trim();
    const filtroTurno = document.getElementById('filtro-turno').value;

    const tarjetas = document.querySelectorAll('.results-section .school-card');

    tarjetas.forEach(tarjeta => {
        const nombreEscuela = tarjeta.querySelector('h3').textContent.toLowerCase();
        const infoUbicacion = tarjeta.querySelector('.school-location').textContent.toLowerCase();
        const turnoEscuela = tarjeta.querySelector('.school-distance').textContent;
        const coincideBusqueda = nombreEscuela.includes(busquedaGeneral) || infoUbicacion.includes(busquedaGeneral);

        const coincideDelegacion = filtroDelegacion === '' || infoUbicacion.includes(filtroDelegacion);
        const coincideCiudad = filtroCiudad === '' || infoUbicacion.includes(filtroCiudad);
        const coincideTurno = filtroTurno === '' || turnoEscuela.toLowerCase().includes(filtroTurno.toLowerCase());

        if (coincideBusqueda && coincideDelegacion && coincideCiudad && coincideTurno) {
            tarjeta.style.display = 'flex';
        } else {
            tarjeta.style.display = 'none';
        }
    });
}

async function filtrarEscuelasPorAPI() {
    const nombre = document.getElementById('txt-buscador').value;
    const alcaldia = document.getElementById('filtro-delegacion').value;
    const estado = document.getElementById('filtro-ciudad').value;
    const turno = document.getElementById('filtro-turno').value;

    const url = `/api/escuelas?nombre=${nombre}&alcaldia=${alcaldia}&estado=${estado}&turno=${turno}`;

    try {
        const res = await fetch(url);
        const { data } = await res.json();

        const contenedor = document.querySelector('.results-section');
        if (!contenedor) return;

        contenedor.innerHTML = '<h2>Resultados en CDMX</h2>';

        data.forEach(escuela => {
            const tags = escuela.tags.split(',').map(t => `<span class="tag">${t.trim()}</span>`).join('');
            const lat = escuela.latitud || 19.4326;
            const lng = escuela.longitud || -99.1332;

            contenedor.innerHTML += `
            <div class="school-card" onclick="mostrarEscuelaEnMapa(${lat}, ${lng}, '${escuela.nombre_escuela.replace(/'/g, "\\'")}')" style="cursor: pointer;">
                <div class="school-info">
                    <h3>${escuela.nombre_escuela}</h3>
                    <p class="school-location">📍 ${escuela.alcaldia}, ${escuela.estado}</p>
                    <div class="school-tags">${tags}</div>
                </div>
                <div class="school-distance">${escuela.turno}</div>
            </div>`;
        });
    } catch (error) {
        console.error('Error buscando escuelas por API:', error);
    }
}

function limpiarFiltros() {
    document.getElementById('txt-buscador').value = '';
    document.getElementById('filtro-delegacion').value = '';
    document.getElementById('filtro-ciudad').value = '';

    document.getElementById('filtro-turno').value = '';

    const panelFiltros = document.getElementById('panel-filtros');
    if (panelFiltros) {
        panelFiltros.style.display = 'none';
    }

    console.log('Filtros reiniciados. Buscando sin parámetros...');
    cargarEscuelas();
}