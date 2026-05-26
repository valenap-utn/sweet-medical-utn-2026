
// Validar Password
export function validarPassword(password) {
    const exp_reg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;
    return exp_reg.test(password);
}
