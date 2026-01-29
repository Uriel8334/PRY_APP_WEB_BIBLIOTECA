const ProductosLibreria = {
    librosActuales: [],
    libroSeleccionado: null,

    elementos: {
        container: null,
        modal: null,
        loadingSpinner: null,
        buscarInput: null,
        filtroGenero: null,
    },

    init: function () {
        console.log('Inicializando ProductosLibreria...');

        // Obtener referencias a los elementos del DOM
        this.elementos.container = document.getElementById('libros-container');
        this.elementos.modal = document.getElementById('modal-libro');
        this.elementos.loadingSpinner = document.getElementById('loading-spinner');
        this.elementos.buscarInput = document.getElementById('buscar-libro');
        this.elementos.filtroGenero = document.getElementById('filtro-genero');

        console.log('Elementos del DOM encontrados:', {
            container: !!this.elementos.container,
            modal: !!this.elementos.modal,
            spinner: !!this.elementos.loadingSpinner
        });

        if (!this.elementos.container) {
            console.error('No se encontro el contenedor de libros');
            return;
        }

        this.cargarLibros();
        this.configurarEventListeners();
    },

    cargarLibros: function () {
        console.log('Cargando libros...');
        console.log('Biblioteca disponible:', !!window.Biblioteca);

        // Simular carga (en un caso real sería una llamada a API)
        setTimeout(() => {
            if (window.Biblioteca && window.Biblioteca.libros) {
                this.librosActuales = [...window.Biblioteca.libros];
                console.log('Libros cargados:', this.librosActuales.length);

                this.renderizarLibros(this.librosActuales);

                if (this.elementos.loadingSpinner) {
                    this.elementos.loadingSpinner.style.display = 'none';
                }
            } else {
                console.error('No se encontraron datos en Biblioteca');
                console.log('Objeto Biblioteca:', window.Biblioteca);
                this.mostrarError();
            }
        }, 500);
    },

    configurarEventListeners: function () {
        // Búsqueda por texto
        if (this.elementos.buscarInput) {
            this.elementos.buscarInput.addEventListener('input', () => {
                this.filtrarLibros();
            });
        }

        // Filtrado por género
        if (this.elementos.filtroGenero) {
            this.elementos.filtroGenero.addEventListener('change', () => {
                this.filtrarLibros();
            });
        }

        // Cerrar modal
        const btnCerrar = document.getElementById('cerrar-modal');
        if (btnCerrar) {
            btnCerrar.addEventListener('click', () => this.cerrarModal());
        }

        // Cerrar modal al hacer click fuera
        if (this.elementos.modal) {
            this.elementos.modal.addEventListener('click', (e) => {
                if (e.target === this.elementos.modal) {
                    this.cerrarModal();
                }
            });
        }

        // Botones de acción del modal
        document.addEventListener('click', (e) => {
            if (e.target.id === 'btn-prestar') {
                this.solicitarPrestamo();
            } else if (e.target.id === 'btn-devolver') {
                this.registrarDevolucion();
            }
        });
    },

    filtrarLibros: function () {
        const busqueda = this.elementos.buscarInput.value.toLowerCase();
        const generoFiltro = this.elementos.filtroGenero.value;

        const librosFiltrrados = this.librosActuales.filter(libro => {
            const coincideBusqueda =
                libro.titulo.toLowerCase().includes(busqueda) ||
                libro.autor.toLowerCase().includes(busqueda);

            const coincideGenero = !generoFiltro || libro.genero === generoFiltro;

            return coincideBusqueda && coincideGenero;
        });

        this.renderizarLibros(librosFiltrrados);
    },

    renderizarLibros: function (libros) {
        console.log('Renderizando libros:', libros.length);

        if (libros.length === 0) {
            this.elementos.container.innerHTML = `
                <div class="sin-resultados">
                    <p>No se encontraron libros</p>
                </div>
            `;
            return;
        }

        const html = libros.map(libro => this.crearTarjetaLibro(libro)).join('');
        console.log('HTML generado, longitud:', html.length);

        this.elementos.container.innerHTML = html;

        // Agregar event listeners a las tarjetas
        document.querySelectorAll('.tarjeta-libro').forEach(tarjeta => {
            tarjeta.addEventListener('click', (e) => {
                if (e.target.classList.contains('btn-accion')) return;
                const libroId = parseInt(tarjeta.dataset.id);
                this.abrirModal(libroId);
            });
        });

        console.log('Tarjetas renderizadas:', libros.length);
    },

    crearTarjetaLibro: function (libro) {
        const claseBadge = libro.disponible ? 'badge-disponible' : 'badge-prestado';
        const textoDisponibilidad = libro.disponible ? 'Disponible' : 'Prestado';

        return `
            <div class="tarjeta-libro" data-id="${libro.id}">
                <div class="tarjeta-portada">
                    <img src="${libro.portada}" alt="${libro.titulo}">
                    <div class="tarjeta-overlay">
                        <button class="btn btn-sm btn-accion btn-ver-detalles">Ver Detalles</button>
                    </div>
                </div>
                <div class="tarjeta-info">
                    <h3 class="tarjeta-titulo">${libro.titulo}</h3>
                    <p class="tarjeta-autor">${libro.autor}</p>
                    <p class="tarjeta-genero">${libro.genero}</p>
                    <span class="badge ${claseBadge}">${textoDisponibilidad}</span>
                </div>
            </div>
        `;
    },

    abrirModal: function (libroId) {
        const libro = window.Biblioteca.libros.find(l => l.id === libroId);
        if (!libro) return;

        this.libroSeleccionado = libro;

        // Llenar el modal con la información del libro
        document.getElementById('modal-imagen').src = libro.portada;
        document.getElementById('modal-titulo').textContent = libro.titulo;
        document.getElementById('modal-autor').textContent = `Autor: ${libro.autor}`;
        document.getElementById('modal-genero').textContent = `Género: ${libro.genero}`;

        // Configurar disponibilidad
        const badgeDisponibilidad = document.getElementById('modal-disponibilidad');
        const btnPrestar = document.getElementById('btn-prestar');
        const btnDevolver = document.getElementById('btn-devolver');

        if (libro.disponible) {
            badgeDisponibilidad.textContent = 'Disponible';
            badgeDisponibilidad.className = 'badge badge-disponible';
            btnPrestar.style.display = 'inline-block';
            btnDevolver.style.display = 'none';
        } else {
            badgeDisponibilidad.textContent = 'Prestado';
            badgeDisponibilidad.className = 'badge badge-prestado';
            btnPrestar.style.display = 'none';
            btnDevolver.style.display = 'inline-block';
        }

        // Mostrar el modal
        this.elementos.modal.classList.add('activo');
    },

    cerrarModal: function () {
        this.elementos.modal.classList.remove('activo');
        this.libroSeleccionado = null;
    },

    solicitarPrestamo: function () {
        if (!this.libroSeleccionado) return;

        const libro = window.Biblioteca.toggleDisponibilidad(this.libroSeleccionado.id);

        if (libro) {
            this.mostrarNotificacion('Préstamo solicitado exitosamente', 'success');

            // Actualizar el modal
            setTimeout(() => {
                this.abrirModal(libro.id);
                this.cargarLibros(); // Recargar la lista
            }, 500);
        }
    },

    registrarDevolucion: function () {
        if (!this.libroSeleccionado) return;

        const libro = window.Biblioteca.toggleDisponibilidad(this.libroSeleccionado.id);

        if (libro) {
            this.mostrarNotificacion('Devolución registrada exitosamente', 'success');

            // Actualizar el modal
            setTimeout(() => {
                this.abrirModal(libro.id);
                this.cargarLibros(); // Recargar la lista
            }, 500);
        }
    },

    mostrarNotificacion: function (mensaje, tipo) {
        // Si existe NotificationService, usarlo
        if (window.NotificationService) {
            window.NotificationService.mostrarNotificacion(mensaje, tipo);
        } else {
            // Fallback: mostrar alerta simple
            alert(mensaje);
        }
    },

    mostrarError: function () {
        this.elementos.container.innerHTML = `
            <div class="alert alert-danger" role="alert">
                Error al cargar los libros. Por favor, intenta más tarde.
            </div>
        `;
    }
};

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        ProductosLibreria.init();
    });
} else {
    ProductosLibreria.init();
}
