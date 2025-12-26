import { useSelector } from "react-redux";
import type { RootState } from "@/stores/store";
import { Button } from "@/components/ui/button";
import { useLogout } from "@/hooks/use-logout";

export default function Home() {
    const { isAuth, user, isLoading } = useSelector(
        (state: RootState) => state.auth
    );
    const { logout } = useLogout();

    if (isLoading) {
        return <p>Loading...</p>;
    }

    return (
        <div>
            <p>{isAuth ? "Đã đăng nhập" : "Chưa đăng nhập"}</p>
            <p>Chào bạn: {user?.fullName}</p>
            {isAuth && <Button onClick={() => logout()}>Logout</Button>}
        </div>
    );
}
