class GlobalValues {
  static values = {
    proyectoUID: null,
    work_proyectoUID: null,
    work_proyectoName: null,
    empresaUID: null,
    otroValor: null,
    empleadoName: null,
    empleadoID: null,
    permisos: null,
    refresh: false,
    // Agrega más valores globales según tus necesidades
  };
  static getRefresh() {
      return this.values.refresh;
     }

  static getEmpresaUID() {
    return this.values.empresaUID;
    }
  
  static setEmpleadoName(empleadoData) {
    this.values.empleadoName= empleadoData.Nombre;
  }

  static setPermisos(empleadoData) {
    this.values.permisos= empleadoData.Permisos;
  }

  static getPermisos() {
    return this.values.permisos;
  }

  static getEmpleadoName() {
    return this.values.empleadoName;
  }

  static setEmpleadoId(empleadoData) {
    this.values.empleadoID = empleadoData.Id;
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

   static setRefresh() {
     this.values.refresh = !this.values.refresh;
   }

  static getOtroValor() {
    return this.values.otroValor;
  }

  // Puedes agregar más métodos para otros valores globales aquí
}

export default GlobalValues;
