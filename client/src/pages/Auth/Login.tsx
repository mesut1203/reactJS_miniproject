// import { updateAuthStatus } from "@/stores/slices/authSlice";
import { saveLocalRefreshToken, saveLocalToken } from "@/utils/auth";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MESSAGES } from "@/constants/message";
import { requestLogin } from "@/service/authService";
import { Link } from "react-router-dom";
import { RouteNames } from "@/constants/route";
import { toast } from "react-toastify";
const TIMEOUT = 1000;

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!email) {
            setError(MESSAGES.AUTH.USERNAME_INVALID);
            return;
        }

        if (!password) {
            setError(MESSAGES.AUTH.PASSWORD_INVALID);
            return;
        }

        setError("");

        try {
            setLoading(true);
            const data = await requestLogin({ email, password });

            saveLocalToken(data.accessToken);
            saveLocalRefreshToken(data.refreshToken);

            toast.success(MESSAGES.AUTH.AUTHENTICATED);

            setTimeout(() => {
                navigate("/");
            }, TIMEOUT);
        } catch (err) {
            console.log(err);
            setError(MESSAGES.AUTH.UNAUTHENTICATED);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = () => {
        console.log("loginGoogle");
    };

    return (
        <>
            {/* Tiêu đề và Mô tả */}
            <h2 className="text-4xl font-bold text-center text-gray-800 mb-1">
                Welcome back
            </h2>
            <p className="text-base text-gray-500 text-center mb-6">
                Shop Smarter, Shop Easier: Your One-Stop Online Marketplace
            </p>

            {/* Form */}
            <form
                className="space-y-6 bg-white shadow-md rounded-3xl p-12 w-full max-w-xl"
                onSubmit={handleSubmit}
            >
                <div>
                    <input
                        type="email"
                        placeholder="Email"
                        className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-base font-medium"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <div>
                    <input
                        type="password"
                        placeholder="Password"
                        className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-base font-medium"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                {error && (
                    <p className="text-red-500 text-sm font-medium text-center">
                        {error}
                    </p>
                )}

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl
               transition duration-200 text-base
               disabled:opacity-60 disabled:cursor-not-allowed"
                >
                    {isLoading ? "Logging in..." : "Login"}
                </button>

                {/* Các mục khác... */}
                <div className="flex items-center my-4">
                    <hr className="flex-grow border-gray-400" />
                </div>

                <button
                    type="button"
                    className="w-full flex items-center justify-center gap-2 border border-gray-300 py-3 rounded-xl hover:bg-gray-50 transition"
                    onClick={handleGoogleLogin}
                >
                    <img
                        src="https://www.svgrepo.com/show/475656/google-color.svg"
                        alt="Google"
                        className="w-5 h-5"
                    />
                    <span className="text-sm font-medium">
                        Continue with Google
                    </span>
                </button>

                <div className="flex justify-between text-gray-600 mt-4 text-sm md:text-base font-medium">
                    <Link to="#" className="hover:underline">
                        Forgot password?
                    </Link>
                    <p>
                        Need an Account?
                        <Link
                            to={RouteNames.AUTH_REGISTER}
                            className="text-blue-600 hover:underline"
                        >
                            Sign up
                        </Link>
                    </p>
                </div>
            </form>
        </>
    );
}
