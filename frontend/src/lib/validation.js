// Regex idéntica a la usada en el backend (utils/auxFunctions.js)
// Requiere: mínimo 8 caracteres, una mayúscula, una minúscula, un número y un símbolo.
export const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;

export const PASSWORD_HELP =
  "Debe tener al menos 8 caracteres, con mayúsculas, minúsculas, números y un símbolo.";

export function validarPassword(password) {
  return PASSWORD_REGEX.test(password || "");
}

export function validarNombreUsuario(nombreUsuario) {
  return (nombreUsuario || "").trim().length >= 3;
}
