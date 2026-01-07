import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { RouteNames } from "@/constants/route";
import { getAuthProfile } from "@/stores/middlewares/authMiddlewares";
import type { AppDispatch } from "@/stores/store";
import { saveLocalRefreshToken, saveLocalToken } from "@/utils/auth";
import { requestGoogleSuccess } from "@/service/authService";

const GoogleCallback = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const accessToken = searchParams.get("accessToken");
    const refreshToken = searchParams.get("refreshToken");

    if (!accessToken || !refreshToken) {
      navigate(RouteNames.AUTH_LOGIN);
      return;
    }

    // Lưu tạm
    saveLocalToken(accessToken);
    saveLocalRefreshToken(refreshToken);

    // 👉 BƯỚC QUAN TRỌNG
    requestGoogleSuccess({ accessToken, refreshToken })
      .then((res) => {
        // redux user
        dispatch(getAuthProfile(res.user));

        // update token mới từ backend
        saveLocalToken(res.accessToken);
        saveLocalRefreshToken(res.refreshToken);

        navigate(RouteNames.HOME, { replace: true });
      })
      .catch(() => {
        navigate(RouteNames.AUTH_LOGIN);
      });
  }, []);

  return <p>Đang đăng nhập bằng Google...</p>;
};

export default GoogleCallback;
