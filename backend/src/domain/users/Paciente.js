export class Paciente {
    id;
    usuario;
    dni;
    nombre;
    obraSocial;
    plan;

    constructor({id,usuario,dni, nombre,obraSocial,plan, sinParametros}) {
        // this.validarDatosIngresados(id,usuario,dni, nombre,obraSocial,plan);
        this.id = id;
        this.usuario = usuario;
        this.dni = dni;
        this.nombre = nombre;
        this.obraSocial = obraSocial;
        this.plan = plan;
    }

}
