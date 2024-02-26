import { Personaje } from "./personajes-listado.model";

export const obtenerPersonajes = async (): Promise<Personaje[]> => {
  try {
    const response = await fetch("http://localhost:3000/personajes");
    const data = await response.json();
    return data; 
  } catch (error) {
    throw new Error("Error al obtener los personajes");
  }
};
