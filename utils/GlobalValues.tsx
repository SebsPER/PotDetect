class GlobalValues {
  static values = {
    proyectoUID: null,
    work_proyectoUID: null,
    work_proyectoName: null,
    empresaUID: null,
    otroValor: null,
    // Agrega más valores globales según tus necesidades
  };

  static getEmpresaUID() {
      return this.values.empresaUID;
    }

  static setProyectoUID(proyectoUID) {
    this.values.work_proyectoUID = proyectoUID;
    console.log("valor uid project",this.values.work_proyectoUID);
  }

  static getProyectoUID() {
    return this.values.work_proyectoUID;
  }

  static setWorkProyecto(work_proyecto) {
    this.values.work_proyectoUID = work_proyecto.id;
    this.values.work_proyectoName = work_proyecto.name;
    console.log("valor uid project",this.values.work_proyectoUID);
    console.log("valor name project",this.values.work_proyectoName);
  }

  static getWorkProyecto(type) {
    if (type == true){
      return this.values.work_proyectoUID;
    }
    else {
      return this.values.work_proyectoName;
    }
  }

  static setEmpresaUID(empresaUID_) {
      this.values.empresaUID = empresaUID_;
      console.log(this.values.empresaUID)
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
