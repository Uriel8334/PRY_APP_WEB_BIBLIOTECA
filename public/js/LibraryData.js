/**
 * MODELO DE DATOS
 * Actualizado con LocalStorage para persistencia de datos e imágenes.
 */

class Libro {
    constructor(titulo, autor, genero, portada) {
        this.id = Date.now(); 
        this.titulo = titulo;
        this.autor = autor;
        this.genero = genero;
        // Si no hay portada, usamos una genérica
        this.portada = portada || 'https://via.placeholder.com/150?text=Sin+Portada';// URL de imagen
        this.disponible = true;
        this.fechaPrestamo = null;
    }
}

const Biblioteca = {
    // Array principal
    libros: [],

    // CLAVE PARA LOCALSTORAGE
    storageKey: 'biblioteca_virginia_data',

    // 1. INICIALIZAR: Intenta cargar del localStorage, si no hay nada, crea datos base
    inicializar: function() {
        const datosGuardados = localStorage.getItem(this.storageKey);

        if (datosGuardados) {
            // Si existen datos, los convertimos de Texto a Objetos reales
            this.libros = JSON.parse(datosGuardados);
            console.log("💾 Datos cargados desde LocalStorage");
        } else {
            // Si es la primera vez que entran, cargamos datos de prueba
            this.cargarDatosPrueba();
            this.guardarDatos(); // Guardamos estos datos iniciales
            console.log("🆕 Carga inicial con datos por defecto");
        }
    },

    // Función auxiliar para guardar en el navegador
    guardarDatos: function() {
        // Convertimos el Array de objetos a un STRING JSON
        const stringDeLibros = JSON.stringify(this.libros);
        localStorage.setItem(this.storageKey, stringDeLibros);
    },

    cargarDatosPrueba: function() {
        this.agregarLibro(new Libro("Cien años de soledad", "Gabriel G. Marquez", "Novela", "https://images.penguinrandomhouse.com/cover/9780307474728"), false);
        this.agregarLibro(new Libro("El Principito", "Antoine de Saint-Exupéry", "Infantil", "https://m.media-amazon.com/images/I/71aFt4+OTOL.jpg"), false);
        this.agregarLibro(new Libro("Clean Code", "Robert C. Martin", "Tecnología", "https://m.media-amazon.com/images/I/41xShlnTZTL.jpg"), false);
    },

    // CRUD
    
    // El parámetro 'guardar' es opcional, sirve para no guardar repetidamente en la carga inicial
    agregarLibro: function(nuevoLibro, guardar = true) {
        this.libros.push(nuevoLibro);
        if (guardar) this.guardarDatos();
        return nuevoLibro;
    },

    eliminarLibro: function(id) {
        // Filtramos para quedarnos con todos MENOS el que queremos borrar
        const longitudAnterior = this.libros.length;
        this.libros = this.libros.filter(libro => libro.id !== id);
        
        if (this.libros.length < longitudAnterior) {
            this.guardarDatos(); // Actualizamos la memoria
            return true;
        }
        return false;
    },

    toggleDisponibilidad: function(id) {
        const libro = this.libros.find(l => l.id === id);
        if (libro) {
            libro.disponible = !libro.disponible;
            libro.fechaPrestamo = libro.disponible ? null : new Date();
            this.guardarDatos(); // Guardar el cambio de estado
            return libro;
        }
        return null;
    }
};

// Arrancamos la lógica
Biblioteca.inicializar();
window.Biblioteca = Biblioteca;