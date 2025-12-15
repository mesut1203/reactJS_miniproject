import { useSelector } from "react-redux";
import type { RootState } from "@/stores/store";

export default function Home() {
    const { isAuth, user, isLoading } = useSelector(
        (state: RootState) => state.auth
    );

    if (isLoading) {
        return <p>Loading...</p>;
    }

    return (
        <div>
            <p>{isAuth ? "Đã đăng nhập" : "Chưa đăng nhập"}</p>
            <p>Chào bạn: {user?.fullName}</p>
        </div>
    );
}
