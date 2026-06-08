export class AuthController {
    constructor(authService) {
        this.authService = authService;
    }

    login = async (req, res, next) => {
        try {
            const {accessToken, refreshToken, usuario} = await this.authService.login(req.body);

            this.setAuthCookies(res, {accessToken, refreshToken});

            res.status(200).json({
                mensaje: "Login exitoso!",
                usuario
            });
        } catch (err) {
            next(err);
        }
    };

    refresh = async (req, res, next) => {
        try {
            const {accessToken} = this.authService.refresh(req.cookies?.refreshToken);
            res.cookie("accesToken", accessToken, this.accessCookieOptions());
            res.status(200).json({
                mensaje: "Access Token renovado."
            });
        } catch (err) {
            next(err);
        }
    };

    logout = async (req, res, next) => {
        try {
            res.clearCookie("accesToken");
            res.clearCookie("refreshToken");

            res.status(200).json({mensaje: "Logout exitoso!"});
        } catch (err) {
            next(err);
        }
    };

    me = async (req, res, next) => {
        try {
            res.status(200).json(req.user);
        } catch (err) {
            next(err);
        }
    };

    setAuthCookies(res, {accessToken, refreshToken}) {
        res.cookie("accesToken", accessToken, this.accessCookireOptions());
        res.cookie("refreshToken", refreshToken, {
            ...this.baseCookieOptions(),
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
    };

    accessCookieOptions = () => {
        return {
            ...this.baseCookieOptions(),
            maxAge: 15 * 60 * 1000,
        }
    };

    baseCookieOptions() {
        return {
            httpOnly: true,
            sameSite: 'lax',
            secure: process.env.NODE_ENV === 'production',
        };
    };

}
