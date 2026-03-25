// import { updateAuthStatus } from "@/stores/slices/authSlice";

import { useState } from "react";
import { MESSAGES } from "@/constants/message";
import { Link, useNavigate } from "react-router-dom";
import { RouteNames } from "@/constants/route";
import { requestRegister } from "@/service/authService";
import { toast } from "react-toastify";
import type { AxiosError } from "axios";
import { handleGoogleLogin } from "@/utils/auth";

export default function Register() {
  type Errors = {
    fullName?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    phone?: string;
  };

  type ServerError = {
    [key: string]: string;
  };
  type ApiErrorResponse = {
    message?: string;
    errors?: Record<string, string>;
  };

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [serverError, setServerError] = useState<ServerError>({});
  const [isDisabled, setIsDisabled] = useState(false);
  const navigate = useNavigate();

  const [errors, setErrors] = useState<Errors>({});

  const validateFullName = (value: string) => {
    if (!value) return MESSAGES.AUTH.NAME_INVALID;
    if (value.length < 2) return MESSAGES.AUTH.NAME_TOO_SHORT;
    return undefined;
  };

  const validateEmail = (value: string) => {
    if (!value) return MESSAGES.AUTH.USERNAME_INVALID;
    if (!/^[\w.]+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/i.test(value)) {
      return MESSAGES.AUTH.EMAIL_INVALID_FORMAT;
    }
    return undefined;
  };

  const validatePassword = (value: string) => {
    if (!value) return MESSAGES.AUTH.PASSWORD_INVALID;
    if (value.length < 6) return MESSAGES.AUTH.PASSWORD_TOO_SHORT;
    return undefined;
  };

  const validateConfirmPassword = (password: string, confirm: string) => {
    if (!confirm) return MESSAGES.AUTH.CONFIRM_PASSWORD_INVALID;
    if (password !== confirm) return MESSAGES.AUTH.CONFIRM_PASSWORD_MISMATCH;
    return undefined;
  };

  const validatePhone = (value: string) => {
    if (!value) return MESSAGES.AUTH.PHONE_INVALID;
    if (!/^\d{9,11}$/.test(value)) return MESSAGES.AUTH.PHONE_INVALID_FORMAT;
    return undefined;
  };

  const validateAll = () => {
    setIsSubmitted(true);

    const newErrors: Errors = {
      fullName: validateFullName(fullName),
      email: validateEmail(email),
      password: validatePassword(password),
      confirmPassword: validateConfirmPassword(password, confirmPassword),
      phone: validatePhone(phone),
    };

    setErrors(newErrors);

    return Object.values(newErrors).every((err) => !err);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateAll()) return;

    const payload = {
      fullName,
      email,
      password,
      confirmPassword,
      phone,
    };

    try {
      const response = await requestRegister(payload);
      toast.success(MESSAGES.AUTH.REGISTER_SUCCESS);
      console.log("REGISTER SUCCESS 👉", response);

      setTimeout(() => {
        navigate(RouteNames.AUTH_LOGIN);
      }, 1000);
    } catch (error) {
      setIsDisabled(true);
      const axiosError = error as AxiosError<ApiErrorResponse>;
      const data = axiosError.response?.data;

      setServerError({}); // reset lỗi cũ

      // Backend trả lỗi validation theo field
      if (data?.errors) {
        setServerError(data.errors);
        return;
      }

      // Backend trả lỗi tổng 400 (email đã tồn tại)
      if (axiosError.response?.status === 400 && data?.message) {
        setServerError({
          email: data.message,
        });
        return;
      }

      toast.error(MESSAGES.AUTH.REGISTER_FAILED);
    } finally {
      setIsDisabled(false);
    }
  };

  return (
    <>
      {/* Tiêu đề và Mô tả */}
      <h2 className="text-4xl font-bold text-center text-gray-800 mb-1">
        Sign in
      </h2>
      <p className="text-base text-gray-500 text-center mb-6">
        Shop Smarter, Shop Easier: Your One-Stop Online Marketplace
      </p>

      {/* Form */}
      <form
        className="space-y-4 bg-white shadow-md rounded-3xl p-8 w-full ]
    "
        onSubmit={handleSubmit}
      >
        <div className="relative mb-6">
          <input
            className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-base font-medium"
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => {
              const v = e.target.value;
              setFullName(v);

              if (!isSubmitted) return;

              setErrors((prev) => ({
                ...prev,
                fullName: validateFullName(v),
              }));
            }}
          />
          {isSubmitted && errors.fullName && (
            <span className="absolute left-4 -bottom-5 text-sm text-red-500">
              {errors.fullName}
            </span>
          )}
        </div>

        <div className="relative mb-6">
          <input
            type="email"
            placeholder="Email"
            className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-base font-medium"
            value={email}
            onChange={(e) => {
              const v = e.target.value;
              setEmail(v);
              setServerError((prev) => ({
                ...prev,
                email: "",
              }));

              if (!isSubmitted) return;

              setErrors((prev) => ({
                ...prev,
                email: validateEmail(v),
              }));
            }}
          />
          {(errors.email || (isSubmitted && serverError.email)) && (
            <span className="absolute left-4 -bottom-5 text-sm text-red-500">
              {errors.email || serverError.email}
            </span>
          )}
        </div>

        <div className="relative mb-6">
          <input
            type="password"
            placeholder="Password"
            className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-base font-medium"
            value={password}
            onChange={(e) => {
              const v = e.target.value;
              setPassword(v);

              if (!isSubmitted) return;

              setErrors((prev) => ({
                ...prev,
                password: validatePassword(v),
                confirmPassword: validateConfirmPassword(v, confirmPassword),
              }));
            }}
          />
          {isSubmitted && errors.password && (
            <span className="absolute left-4 -bottom-5 text-sm text-red-500">
              {errors.password}
            </span>
          )}
        </div>
        <div className="relative mb-6">
          <input
            type="password"
            placeholder="Confirm Password"
            className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-base font-medium"
            value={confirmPassword}
            onChange={(e) => {
              const v = e.target.value;
              setConfirmPassword(v);

              if (!isSubmitted) return;

              setErrors((prev) => ({
                ...prev,
                confirmPassword: validateConfirmPassword(password, v),
              }));
            }}
          />
          {isSubmitted && errors.confirmPassword && (
            <span className="absolute left-4 -bottom-5 text-sm text-red-500">
              {errors.confirmPassword}
            </span>
          )}
        </div>

        <div className="relative mb-6">
          <input
            type="text"
            placeholder="Phone Number"
            className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-base font-medium"
            value={phone}
            onChange={(e) => {
              const v = e.target.value;
              setPhone(v);

              setServerError((prev) => ({
                ...prev,
                phone: "",
              }));

              if (!isSubmitted) return;

              setErrors((prev) => ({
                ...prev,
                phone: validatePhone(v),
              }));
            }}
          />
          {(errors.phone || (isSubmitted && serverError.phone)) && (
            <span className="absolute left-4 -bottom-5 text-sm text-red-500">
              {errors.phone || serverError.phone}
            </span>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition duration-200 text-base
               disabled:opacity-60 disabled:cursor-not-allowed"
          disabled={isDisabled}
        >
          Sign up
        </button>

        {/* Các mục khác... */}
        <div className="flex items-center my-4">
          <hr className="flex-grow border-gray-400" />
        </div>

        <button
          onClick={handleGoogleLogin}
          type="button"
          className="w-full flex items-center justify-center gap-2 border border-gray-300 py-3 rounded-xl hover:bg-gray-50 transition"
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google"
            className="w-5 h-5"
          />
          <span className="text-sm font-medium">Continue with Google</span>
        </button>

        <div className="flex justify-end text-gray-600 mt-4 text-sm md:text-base font-medium">
          <p>
            Already have a account?
            <Link
              to={RouteNames.AUTH_LOGIN}
              className="text-blue-600 hover:underline"
            >
              Login
            </Link>
          </p>
        </div>
      </form>
    </>
  );
}
