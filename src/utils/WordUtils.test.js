import {
  convertTodiminutive,
  isLikelyFeminine,
  estimateSyllables,
} from "./diminutiveConverter";

// Test cases for Spanish diminutive conversion
const testCases = [
  { word: "casa", diminutive: "casita" },
  { word: "perro", diminutive: "perrito" },
  { word: "gato", diminutive: "gatito" },
  { word: "caja", diminutive: "cajita" },
  { word: "puerta", diminutive: "puertita" },
  { word: "chaqueta", diminutive: "chaquetita" },
  { word: "lápiz", diminutive: "lapicito" },
  { word: "pez", diminutive: "pececito" },
  { word: "flor", diminutive: "florcita" },
  { word: "luz", diminutive: "lucecita" },
  { word: "pollo", diminutive: "pollito" },
  { word: "pájaro", diminutive: "pajarito" },
  { word: "camión", diminutive: "camioncito" },
  { word: "reloj", diminutive: "relojito" },
  { word: "fuente", diminutive: "fuentecita" },
  { word: "café", diminutive: "cafecito" },
  { word: "coche", diminutive: "cochecito" },
  { word: "zapato", diminutive: "zapatito" },
  { word: "papá", diminutive: "papito" },
  { word: "mamá", diminutive: "mamita" },
  { word: "hermano", diminutive: "hermanito" },
  { word: "abuelo", diminutive: "abuelito" },
  { word: "joven", diminutive: "jovencito" },
  { word: "chica", diminutive: "chiquita" },
  { word: "amigo", diminutive: "amiguito" },
  { word: "amor", diminutive: "amorcito" },
  { word: "momento", diminutive: "momentito" },
  { word: "segundo", diminutive: "segundito" },
  { word: "rato", diminutive: "ratito" },
  { word: "ahora", diminutive: "ahorita" },
  { word: "mañana", diminutive: "mañanita" },
  { word: "gordo", diminutive: "gordito" },
  { word: "guapo", diminutive: "guapito" },
  { word: "feo", diminutive: "feito" },
  { word: "pobre", diminutive: "pobrecito" },
  { word: "solo", diminutive: "solito" },
  { word: "poco", diminutive: "poquito" },
  { word: "cerca", diminutive: "cerquita" },
  { word: "nuevo", diminutive: "nuevecito" },
  { word: "libro", diminutive: "librito" },
  { word: "mesa", diminutive: "mesita" },
  { word: "abuela", diminutive: "abuelita" },
  { word: "corazón", diminutive: "corazoncito" },
  { word: "jardín", diminutive: "jardincito" },
  { word: "llave", diminutive: "llavecita" },
  { word: "sol", diminutive: "solcito" },
  { word: "mano", diminutive: "manita" },
  { word: "trabajo", diminutive: "trabajito" },
  { word: "niño", diminutive: "niñito" },
  { word: "problema", diminutive: "problemita" },
  { word: "grande", diminutive: "grandecito" },
  { word: "carro", diminutive: "carrito" },
  { word: "carlos", diminutive: "carlito" },
  { word: "andrea", diminutive: "andreita" },
  { word: "lugar", diminutive: "lugarcito" },
  { word: "conejo", diminutive: "conejito" },
  { word: "playa", diminutive: "playita" },
  { word: "escuela", diminutive: "escuelita" },
  { word: "hermana", diminutive: "hermanita" },
  { word: "ensalada", diminutive: "ensaladita" },
  { word: "teléfono", diminutive: "telefonito" },
  { word: "cama", diminutive: "camita" },
  { word: "papel", diminutive: "papelito" },
  { word: "mantel", diminutive: "mantelito" },
  { word: "barril", diminutive: "barrilito" },
  { word: "árbol", diminutive: "arbolito" },
  { word: "cartel", diminutive: "cartelito" },
  { word: "fácil", diminutive: "facilito" },
  { word: "caracol", diminutive: "caracolito" },
  { word: "pantalón", diminutive: "pantaloncito" },
  { word: "suave", diminutive: "suavecito" },
  { word: "calor", diminutive: "calorcito" },
  { word: "mujer", diminutive: "mujercita", gender: "f" },
  { word: "hombre", diminutive: "hombrito" },
  { word: "bebé", diminutive: "bebecito" },
  { word: "violín", diminutive: "violincito" },
  { word: "lombriz", diminutive: "lombrizita", gender: "f" },
  { word: "nariz", diminutive: "naricita", gender: "f" },
  { word: "arroz", diminutive: "arrocito" },
  { word: "pan", diminutive: "panecito" },
  { word: "pie", diminutive: "piececito" },
  { word: "sal", diminutive: "salecita", gender: "f" },
  { word: "té", diminutive: "tecito" },
  { word: "lluvia", diminutive: "lluviecita" },
  { word: "voz", diminutive: "vocecita", gender: "f" },
  { word: "cruz", diminutive: "crucecita", gender: "f" },
  { word: "serio", diminutive: "seriecito" },
  { word: "nuez", diminutive: "nuececita", gender: "f" },
  { word: "novio", diminutive: "noviecito" },
  { word: "novia", diminutive: "noviecita" },
  { word: "amiga", diminutive: "amiguita" },
  { word: "agua", diminutive: "agüita" },
  { word: "mango", diminutive: "manguito" },
  { word: "jugo", diminutive: "juguito" },
  { word: "barco", diminutive: "barquito" },
  { word: "mosca", diminutive: "mosquita" },
  { word: "hamaca", diminutive: "hamacita" },
  { word: "quiosco", diminutive: "quiosquito" },
  { word: "boca", diminutive: "boquita" },
  { word: "tarde", diminutive: "tardecita", gender: "f" },
];

describe("convertTodiminutive", () => {
  describe("all test cases", () => {
    testCases.forEach(({ word, diminutive, gender }) => {
      it(`should convert "${word}" to "${diminutive}"`, () => {
        // Use explicit gender if provided, otherwise detect
        const isFeminine = gender ? gender === "f" : isLikelyFeminine(word);
        const syllables = estimateSyllables(word);
        const result = convertTodiminutive(word, isFeminine, syllables);
        expect(result).toBe(diminutive);
      });
    });
  });

  describe("basic masculine words ending in -o", () => {
    it("converts perro to perrito", () => {
      expect(convertTodiminutive("perro", false, 2)).toBe("perrito");
    });

    it("converts gato to gatito", () => {
      expect(convertTodiminutive("gato", false, 2)).toBe("gatito");
    });
  });

  describe("basic feminine words ending in -a", () => {
    it("converts casa to casita", () => {
      expect(convertTodiminutive("casa", true, 2)).toBe("casita");
    });

    it("converts mesa to mesita", () => {
      expect(convertTodiminutive("mesa", true, 2)).toBe("mesita");
    });
  });

  describe("words with accent marks", () => {
    it("removes accents in output", () => {
      const result = convertTodiminutive("pájaro", false, 3);
      expect(result).toBe("pajarito");
      expect(result).not.toMatch(/[áéíóú]/);
    });
  });
});
