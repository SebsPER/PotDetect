class GlobalValues {
  static values = {
    proyectoUID: null,
    empresaUID: null,
    otroValor: null,
    // Agrega más valores globales según tus necesidades
  };

  static setProyectoUID(proyectoUID) {
    this.values.proyectoUID = proyectoUID;
    print("valor uid project",this.values.proyectoUID);
  }

  static getProyectoUID() {
    return this.values.proyectoUID;
  }

  static setEmpresaUID(empresaUID) {
    this.values.empresaUID = empresaUID;
  }

  static getEmpresaUID() {
    return this.values.empresaUID;
  }

  static setOtroValor(otroValor) {
    this.values.otroValor = otroValor;
  }

  static getOtroValor() {
    return this.values.otroValor;
  }

  // Puedes agregar más métodos para otros valores globales aquí
}

export default GlobalValues;
