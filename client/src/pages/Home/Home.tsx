import { useSelector } from "react-redux";
import type { RootState } from "@/stores/store";

export default function Home() {
    const isAuth = useSelector((state: RootState) => state.auth.isAuth);
    console.log(isAuth);

    return <div>Home: {isAuth ? "Đã đăng nhập" : "Chưa đăng nhập"}</div>;
}
