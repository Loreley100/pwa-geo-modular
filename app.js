// app.js - Logica de UI, pre-permiso y consumo del helper

const btnAdjuntar = document.getElementById('btn-adjuntar');
const btnCompartir = document.getElementById('btn-compartir');
const prepermiso = document.getElementById('prepermiso');
const estado = document.getElementById('estado');
const resultados = document.getElementById('resultados');
const selectorManual = document.getElementById('selector-manual');
const selectZona = document.getElementById('zona');
const btnManual = document.getElementById('btn-manual');

function setControlesLectura(deshabilitados) {
  btnAdjuntar.disabled = deshabilitados;
  btnCompartir.disabled = deshabilitados;
}

function mostrarCargando(texto) {
  estado.textContent = texto;
  resultados.textContent = '';
  prepermiso.hidden = true;
  selectorManual.hidden = true;
  selectZona.value = '';
  setControlesLectura(true);
}

function mostrarMensajeError(texto) {
  estado.textContent = texto;
}

function habilitarSelectorManualZona() {
  selectorManual.hidden = false;
}

function renderizarResultadoUbicacion(ubicacion) {
  estado.textContent = '';
  resultados.textContent = '';

  const pLat = document.createElement('p');
  pLat.textContent = 'Latitud: ' + ubicacion.latitud;
  const pLon = document.createElement('p');
  pLon.textContent = 'Longitud: ' + ubicacion.longitud;
  const pPrec = document.createElement('p');
  pPrec.textContent = 'Precisión: ' + ubicacion.precisionMetros + ' metros';
  const pFecha = document.createElement('p');
  pFecha.textContent = 'Fecha/hora de la lectura: ' + new Date(ubicacion.timestamp).toLocaleString();
  const pClas = document.createElement('p');
  if (ubicacion.precisionMetros < 30) {
    pClas.textContent = 'Precisión GPS Alta';
  } else {
    pClas.textContent = 'Ubicación Aproximada (Wi-Fi / IP)';
  }
  const pAclar = document.createElement('p');
  pAclar.textContent = 'Clasificación orientativa según el margen de precisión; no identifica el sensor utilizado.';

  resultados.appendChild(pLat);
  resultados.appendChild(pLon);
  resultados.appendChild(pPrec);
  resultados.appendChild(pFecha);
  resultados.appendChild(pClas);
  resultados.appendChild(pAclar);
}

function solicitarUbicacion() {
  mostrarCargando('Obteniendo coordenadas...');
  obtenerUbicacionActual()
    .then((ubicacion) => {
      renderizarResultadoUbicacion(ubicacion);
    })
    .catch((error) => {
      mostrarMensajeError(error.message);
      habilitarSelectorManualZona();
    })
    .then(() => {
      setControlesLectura(false);
    });
}

btnAdjuntar.addEventListener('click', function () {
  setControlesLectura(true);
  estado.textContent = '';
  resultados.textContent = '';
  prepermiso.hidden = true;
  selectorManual.hidden = true;
  selectZona.value = '';

  consultarEstadoPermisoGeo()
    .then((estadoPermiso) => {
      if (estadoPermiso === 'granted') {
        solicitarUbicacion();
      } else if (estadoPermiso === 'prompt') {
        prepermiso.hidden = false;
        setControlesLectura(false);
      } else {
        habilitarSelectorManualZona();
        estado.textContent = 'Permiso bloqueado. Puedes reactivarlo desde los ajustes del sitio en el navegador.';
        setControlesLectura(false);
      }
    })
    .catch(() => {
      habilitarSelectorManualZona();
      estado.textContent = 'No se pudo consultar el permiso. Puedes seleccionar tu zona manualmente.';
      setControlesLectura(false);
    });
});

btnCompartir.addEventListener('click', function () {
  prepermiso.hidden = true;
  solicitarUbicacion();
});

btnManual.addEventListener('click', function () {
  prepermiso.hidden = true;
  habilitarSelectorManualZona();
});

selectZona.addEventListener('change', function () {
  const zona = selectZona.value;
  resultados.textContent = '';
  if (zona) {
    const p = document.createElement('p');
    p.textContent = 'Zona seleccionada manualmente: ' + zona;
    const p2 = document.createElement('p');
    p2.textContent = 'Sin coordenadas ni precisión (selección manual).';
    resultados.appendChild(p);
    resultados.appendChild(p2);
    estado.textContent = '';
  }
});

function verificarEntornoIOS() {
  const esIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  const estaInstalada = window.navigator.standalone === true ||
                        window.matchMedia('(display-mode: standalone)').matches;

  if (esIOS && !estaInstalada) {
    const guiaIOS = document.getElementById('instrucciones-ios');
    if (guiaIOS) guiaIOS.hidden = false;
  }
}

verificarEntornoIOS();

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js');
}