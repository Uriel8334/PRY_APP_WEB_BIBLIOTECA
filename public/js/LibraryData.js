/**
 * MODELO DE DATOS (Responsabilidad de Kerly)
 * Este archivo contiene la clase Libro y la gestión del Array principal.
 */

// 1. Definimos el plano de lo que es un "Libro"
class Libro {
    constructor(titulo, autor, genero, portada) {
        this.id = Date.now(); // Genera un ID único basado en el tiempo
        this.titulo = titulo;
        this.autor = autor;
        this.genero = genero;
        this.portada = portada || 'https://via.placeholder.com/150'; // Portada por defecto
        this.disponible = true; // Por defecto todos inician disponibles
        this.fechaPrestamo = null;
    }
}

// 2. Gestionamos la colección de libros (La Biblioteca)
const Biblioteca = {
    // Array principal donde vivirán todos los libros
    libros: [],

    // Inicializar con algunos datos de prueba (Para que la web no se vea vacía)
    inicializar: function() {
        this.agregarLibro(new Libro("Cien años de soledad", "Gabriel García Márquez", "Novela", "https://images.penguinrandomhouse.com/cover/9780307474728"));
        this.agregarLibro(new Libro("El Principito", "Antoine de Saint-Exupéry", "Infantil", "https://images.penguinrandomhouse.com/cover/9780156012195"));
        this.agregarLibro(new Libro("1984", "George Orwell", "Ciencia Ficción", "https://images.penguinrandomhouse.com/cover/9780451524935"));
        this.agregarLibro(new Libro("JavaScript: The Good Parts", "Douglas Crockford", "Tecnología", ""));
        console.log("📚 Biblioteca inicializada con éxito.");
    },

    // CRUD: CREATE (Añadir libro)
    // Usamos .push() para añadir al final del array
    agregarLibro: function(nuevoLibro) {
        this.libros.push(nuevoLibro);
        return nuevoLibro;
    },

    // CRUD: DELETE (Eliminar libro)
    // Usamos .findIndex() para localizar y .splice() para borrar
    eliminarLibro: function(id) {
        const index = this.libros.findIndex(libro => libro.id === id);
        if (index !== -1) {
            this.libros.splice(index, 1); // Elimina 1 elemento en la posición index
            return true; // Éxito
        }
        return false; // No encontrado
    },

    // LÓGICA DE NEGOCIO: Prestar/Devolver
    toggleDisponibilidad: function(id) {
        const libro = this.libros.find(l => l.id === id);
        if (libro) {
            libro.disponible = !libro.disponible;
            libro.fechaPrestamo = libro.disponible ? null : new Date();
            return libro;
        }
        return null;
    }
};

// Ejecutamos la carga inicial
Biblioteca.inicializar();

// Hacemos la Biblioteca accesible globalmente para que Uriel y Vicky la usen
window.Biblioteca = Biblioteca;