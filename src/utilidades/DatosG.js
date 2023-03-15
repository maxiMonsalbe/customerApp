class DatosG {
    constructor(data) {
      this.data = data;
      this.info = "Este es un texto info";
    }
    get Data() {
      return this.data;
    }
  }
  
  let test = new DatosG({ prueba: "Esto es una prueba" });
  
  export {test}
