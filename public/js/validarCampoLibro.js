/**
 * validarCampoLibro.js
 * Módulo de validación visual y lógica.
 * Se integra con agregarLibro.js mediante la API nativa de validación (setCustomValidity).
 */

(function () {
    'use strict';

    document.addEventListener('DOMContentLoaded', function () {
        const inputs = {
            titulo: document.getElementById('input-titulo'),
            autor: document.getElementById('input-autor'),
            genero: document.getElementById('input-genero'),
            portada: document.getElementById('input-portada')
        };
        
        // Referencia a la imagen que 'agregarLibro.js' manipula
        const previewImage = document.getElementById('preview-image');

        // --- Funciones de Estado Visual y Lógico ---

        /**
         * Marca un input como inválido visualmente y lógicamente.
         * Esto hace que form.checkValidity() devuelva false en agregarLibro.js
         */
        const marcarInvalido = (input, mensaje) => {
            // Visual (Bootstrap)
            input.classList.add('is-invalid');
            input.classList.remove('is-valid');
            
            // Feedback de texto
            const feedback = input.nextElementSibling;
            if (feedback && feedback.classList.contains('invalid-feedback')) {
                feedback.textContent = mensaje;
            }

            // Lógico (API del navegador)
            input.setCustomValidity(mensaje); 
        };

        /**
         * Marca un input como válido.
         */
        const marcarValido = (input) => {
            input.classList.remove('is-invalid');
            input.classList.add('is-valid');
            input.setCustomValidity(''); // Elimina el error lógico
        };

        // --- Validadores Específicos ---

        const validarTitulo = () => {
            const el = inputs.titulo;
            const valor = el.value.trim();

            if (valor.length === 0) {
                marcarInvalido(el, 'El título es obligatorio.');
                return false;
            }
            if (valor.length < 2) {
                marcarInvalido(el, 'El título debe tener al menos 2 caracteres.');
                return false;
            }
            if (valor.length > 150) {
                marcarInvalido(el, 'El título excede los 150 caracteres.');
                return false;
            }

            marcarValido(el);
            return true;
        };

        const validarAutor = () => {
            const el = inputs.autor;
            const valor = el.value.trim();
            // Solo letras, puntos, espacios y guiones. No números.
            const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s\.\-]+$/;

            if (valor.length === 0) {
                marcarInvalido(el, 'El autor es obligatorio.');
                return false;
            }
            if (valor.length < 3) {
                marcarInvalido(el, 'El nombre debe tener al menos 3 caracteres.');
                return false;
            }
            if (!regex.test(valor)) {
                marcarInvalido(el, 'El nombre no puede contener números ni símbolos especiales.');
                return false;
            }

            marcarValido(el);
            return true;
        };

        const validarGenero = () => {
            const el = inputs.genero;
            if (el.value === '' || el.value === 'Selecciona un género') {
                marcarInvalido(el, 'Debes seleccionar un género.');
                return false;
            }
            marcarValido(el);
            return true;
        };

        const validarUrlPortada = () => {
            const el = inputs.portada;
            const valor = el.value.trim();
            const urlPattern = /^(https?:\/\/[^\s]+)/;

            if (valor.length === 0) {
                marcarInvalido(el, 'La URL es obligatoria.');
                return false;
            }
            if (!urlPattern.test(valor)) {
                marcarInvalido(el, 'Ingresa una URL válida (http:// o https://).');
                return false;
            }
            
            // Si la URL tiene formato correcto, quitamos error temporalmente
            // La validación final la dará la carga de la imagen (ver listeners abajo)
            // No marcamos "Valido" (verde) todavía hasta que cargue la imagen
            el.setCustomValidity(''); 
            el.classList.remove('is-invalid');
            return true;
        };

        // --- Listeners de Eventos ---

        // 1. Validación inmediata al escribir (Input)
        inputs.titulo.addEventListener('input', validarTitulo);
        inputs.autor.addEventListener('input', validarAutor);
        inputs.genero.addEventListener('change', validarGenero);
        
        // 2. Validación de URL
        inputs.portada.addEventListener('input', validarUrlPortada);

        // 3. Validación avanzada de imagen (integración con la preview)
        // Aprovechamos que agregarLibro.js asigna el src al preview-image.
        // Nosotros escuchamos si esa imagen cargó bien o mal.
        if (previewImage) {
            previewImage.addEventListener('load', function() {
                // Si la imagen cargó, confirmamos validez visual en el input
                if (inputs.portada.value !== '') {
                    marcarValido(inputs.portada);
                }
            });

            previewImage.addEventListener('error', function() {
                // Si la imagen falló al cargar, invalidamos el input aunque el formato URL sea correcto
                if (inputs.portada.value !== '') {
                    marcarInvalido(inputs.portada, 'La imagen no existe o no es accesible.');
                }
            });
        }

        // 4. Limpieza al resetear
        // Cuando agregarLibro.js hace form.reset(), limpiamos los estilos
        const form = document.getElementById('form-agregar-libro');
        if (form) {
            form.addEventListener('reset', function() {
                setTimeout(() => {
                    Object.values(inputs).forEach(input => {
                        input.classList.remove('is-valid', 'is-invalid');
                        input.setCustomValidity('');
                    });
                }, 10);
            });
        }
    });
})();