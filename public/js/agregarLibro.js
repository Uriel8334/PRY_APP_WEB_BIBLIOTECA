// MODULO PARA AGREGAR LIBROS DINAMICAMENTE
// Usando las funciones utilitarias de utils.js

(function () {
    'use strict';
    // Referencias a elementos del DOM usando getById
    const elementos = {
        form: null,
        inputTitulo: null,
        inputAutor: null,
        inputGenero: null,
        inputPortada: null,
        previewContainer: null,
        previewImage: null,
        listaLibros: null,
        btnGuardar: null
    };

    /**
     * Función de inicialización del módulo
     * Puede ser llamada manualmente o automáticamente en DOMContentLoaded
     */
    function init() {
        inicializarElementos();
        configurarEventos();
        actualizarListaLibros();
    }

    // Inicialización al cargar el DOM (para acceso directo a la página)
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        // DOM ya está listo (carga dinámica)
        init();
    }

    /**
     * Inicializa todas las referencias a elementos del DOM
     */
    function inicializarElementos() {
        // Usando las funciones utilitarias de utils.js
        elementos.form = getById('form-agregar-libro');
        elementos.inputTitulo = getById('input-titulo');
        elementos.inputAutor = getById('input-autor');
        elementos.inputGenero = getById('input-genero');
        elementos.inputPortada = getById('input-portada');
        elementos.previewContainer = getById('preview-container');
        elementos.previewImage = getById('preview-image');
        elementos.listaLibros = getById('lista-libros-agregados');
        elementos.btnGuardar = getById('btn-guardar');

        // Verificar que Biblioteca esté disponible
        if (!window.Biblioteca) {
            console.error('Biblioteca no está disponible');
            mostrarAlerta('Error: Sistema de biblioteca no disponible', 'danger');
        }
    }

    /**
     * Configura todos los eventos de la página
     */
    function configurarEventos() {
        // Evento de submit del formulario
        if (elementos.form) {
            onEvent(elementos.form, 'submit', manejarSubmitFormulario);
        }

        // Vista previa de la imagen al escribir URL
        if (elementos.inputPortada) {
            onEvent(elementos.inputPortada, 'input', manejarCambioPortada);
        }
    }

    /**
     * Maneja el evento de cambio en el input de la portada
     */
    function manejarCambioPortada() {
        const url = getValue(elementos.inputPortada).trim();

        if (url) {
            // Mostrar preview
            elementos.previewImage.src = url;
            removeClass(elementos.previewContainer, 'd-none');

            // Manejar error de carga de imagen
            elementos.previewImage.onerror = function () {
                addClass(elementos.previewContainer, 'd-none');
                mostrarAlerta('La URL de la imagen no es válida', 'warning');
            };
        } else {
            addClass(elementos.previewContainer, 'd-none');
        }
    }

    /**
     * Maneja el submit del formulario
     */
    function manejarSubmitFormulario(e) {
        e.preventDefault();

        // Validar formulario
        if (!elementos.form.checkValidity()) {
            e.stopPropagation();
            addClass(elementos.form, 'was-validated');
            return;
        }

        // Obtener valores del formulario usando getValue
        const titulo = getValue(elementos.inputTitulo).trim();
        const autor = getValue(elementos.inputAutor).trim();
        const genero = getValue(elementos.inputGenero);
        const portada = getValue(elementos.inputPortada).trim();

        // Validaciones básicas
        if (!titulo || !autor || !genero || !portada) {
            mostrarAlerta('Por favor completa todos los campos obligatorios', 'warning');
            return;
        }

        // Crear nuevo libro usando la clase Libro
        try {
            const nuevoLibro = new window.Libro(titulo, autor, genero, portada);

            // Agregar a la biblioteca
            window.Biblioteca.agregarLibro(nuevoLibro);

            // Mostrar mensaje de éxito y luego actualizar
            mostrarAlerta(`¡Libro "${titulo}" agregado exitosamente!`, 'success').then(() => {
                // Limpiar formulario
                limpiarFormulario();

                // Actualizar lista de libros
                actualizarListaLibros();

                // Agregar notificación persistente
                NotificationService.mostrarNotificacionAgregar(nuevoLibro);
            });

        } catch (error) {
            console.error('Error al agregar libro:', error);
            mostrarAlerta('Error al agregar el libro. Intenta de nuevo.', 'danger');
        }
    }

    /**
     * Limpia el formulario después de agregar un libro
     */
    function limpiarFormulario() {
        elementos.form.reset();
        removeClass(elementos.form, 'was-validated');
        addClass(elementos.previewContainer, 'd-none');

        // Poner foco en el primer campo
        if (elementos.inputTitulo) {
            elementos.inputTitulo.focus();
        }
    }

    /**
     * Actualiza la lista de libros agregados
     */
    function actualizarListaLibros() {
        if (!elementos.listaLibros || !window.Biblioteca) return;

        // Limpiar contenedor
        clearChildren(elementos.listaLibros);

        const libros = window.Biblioteca.libros;

        if (libros.length === 0) {
            setHTML(elementos.listaLibros, `
                <div class="alert alert-info">
                    <i class="bi bi-info-circle me-2"></i>
                    No hay libros en la biblioteca. ¡Agrega el primero!
                </div>
            `);
            return;
        }

        // Crear elementos para cada libro
        libros.forEach((libro, index) => {
            const libroElement = crearElementoLibro(libro, index + 1);
            elementos.listaLibros.appendChild(libroElement);
        });

        // Mostrar contador
        const contador = createElement('div', {
            class: 'alert alert-secondary mt-3'
        }, `
            <strong>Total de libros:</strong> ${libros.length}
        `);
        elementos.listaLibros.appendChild(contador);
    }

    /**
     * Crea un elemento HTML para un libro
     */
    function crearElementoLibro(libro, numero) {
        const disponible = libro.disponible ? 'Disponible' : 'Prestado';
        const badgeClass = libro.disponible ? 'bg-success' : 'bg-warning';

        const elemento = createElement('div', {
            class: 'list-group-item d-flex justify-content-between align-items-start'
        }, `
            <div class="ms-2 me-auto">
                <div class="fw-bold">${numero}. ${libro.titulo}</div>
                <small class="text-muted">
                    <strong>Autor:</strong> ${libro.autor} | 
                    <strong>Género:</strong> ${libro.genero}
                </small>
            </div>
            <div class="d-flex flex-column align-items-end gap-2">
                <span class="badge ${badgeClass} rounded-pill">${disponible}</span>
                <button class="btn btn-sm btn-outline-danger" data-libro-id="${libro.id}">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                        <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
                    </svg>
                    Eliminar
                </button>
            </div>
        `);

        // Agregar evento al botón eliminar
        const btnEliminar = elemento.querySelector('button[data-libro-id]');
        onEvent(btnEliminar, 'click', () => eliminarLibro(libro.id, libro.titulo));

        return elemento;
    }

    /**
     * Elimina un libro de la biblioteca
     */
    function eliminarLibro(id, titulo) {
        confirmarAccion(`¿Estás seguro de eliminar "${titulo}"?`).then((confirmado) => {
            if (confirmado) {
                const libro = window.Biblioteca.libros.find(l => l.id === id);
                const eliminado = window.Biblioteca.eliminarLibro(id);

                if (eliminado && libro) {
                    mostrarAlerta(`Libro "${titulo}" eliminado correctamente`, 'success');
                    actualizarListaLibros();

                    // Agregar notificación persistente
                    NotificationService.mostrarNotificacionEliminacion(libro);
                } else {
                    mostrarAlerta('Error al eliminar el libro', 'danger');
                }
            }
        });
    }

    // Exponer funciones públicas si es necesario
    window.AgregarLibro = {
        init: init,
        actualizarListaLibros: actualizarListaLibros
    };

})();
