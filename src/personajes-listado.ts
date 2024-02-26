import { obtenerPersonajes } from "./personajes-listado.api";
import { Personaje } from "./personajes-listado.model";

const crearCard = (): HTMLDivElement => {
  const card = document.createElement("div");
  card.classList.add("card");
  return card;
};

const crearParrafo = (
  nombreParrafo: string,
  texto: string
): HTMLParagraphElement => {
  const parrafo = document.createElement("p");

  parrafo.innerHTML = `<span class = 'negrita'>${nombreParrafo}: </span>${texto}`;
  return parrafo;
};

const crearImagenPersonaje = (url: string, alt: string): HTMLImageElement => {
  const imagen = document.createElement("img");
  (imagen.id = "imagen"), (imagen.src = `http://localhost:3000/${url}`);
  imagen.alt = alt;

  return imagen;
};

const crearContenedorPersonaje = (personaje: Personaje): HTMLDivElement => {
  const habilidadesAString = personaje.habilidades.reduce(
    (valorAnterior, valorActual) =>
      personaje.habilidades.length === 1
        ? valorAnterior
        : `${valorAnterior}, ${valorActual}`
  );

  const card = crearCard();

  const imagen = crearImagenPersonaje(personaje.imagen, personaje.nombre);
  const nombre = crearParrafo("Nombre", personaje.nombre);
  const especialidad = crearParrafo("Especialidad", personaje.especialidad);
  const habilidades = crearParrafo("Habilidades", habilidadesAString);

  card.appendChild(imagen);
  card.appendChild(nombre);
  card.appendChild(especialidad);
  card.appendChild(habilidades);

  return card;
};

const pintarPersonajes = async (personajes: Personaje[]): Promise<void> => {
  try {
    const contenedorPersonajes = document.querySelector(
      "#contenedor-personajes"
    );

    if (
      contenedorPersonajes &&
      contenedorPersonajes instanceof HTMLDivElement
    ) {
      personajes.forEach((personaje) => {
        const card = crearContenedorPersonaje(personaje);
        contenedorPersonajes.appendChild(card);
      });
    } else {
      throw new Error("No se encontró el contenedor de personajes");
    }
  } catch (error) {
    alert(error);
  }
};

const filtrarPersonajes = (personajes: Personaje[]) => {
  const stringFiltro = document.querySelector("#input-filtrar-nombre");
  const mensajeHTML = document.querySelector("#mensaje");
  if (
    stringFiltro &&
    stringFiltro instanceof HTMLInputElement &&
    mensajeHTML &&
    mensajeHTML instanceof HTMLDivElement
  ) {
    if (stringFiltro.value === "") {
      return personajes;
    }
    const personajesFiltrados = personajes.filter((personaje) =>
      personaje.nombre.toLowerCase().includes(stringFiltro.value.toLowerCase())
    );
    if (personajesFiltrados.length === 0) {
      mensajeHTML.textContent =
        "No se encontró ningún resultado con eses criterio de búsqueda";
    } else {
      mensajeHTML.textContent = "";
    }
    return personajesFiltrados;
  } else {
    throw new Error("Error al filtrar personajes");
  }
};

const handleSubmit = async (e: Event) => {
  e.preventDefault();
  const contenedor = document.querySelector("#contenedor-personajes");

  const personajes = await obtenerPersonajes();
  if (contenedor && contenedor instanceof HTMLDivElement) {
    contenedor.innerHTML = "";
    const personajesFiltrados = filtrarPersonajes(personajes);
    pintarPersonajes(personajesFiltrados);
  } else {
    throw new Error("No se encontró div contenedor");
  }
};

document.addEventListener("DOMContentLoaded", async () => {
  const personajes = await obtenerPersonajes();
  pintarPersonajes(personajes);

  const formulario = document.querySelector("#formulario");

  if (formulario && formulario instanceof HTMLFormElement) {
    formulario.addEventListener("submit", handleSubmit);
  }
});
