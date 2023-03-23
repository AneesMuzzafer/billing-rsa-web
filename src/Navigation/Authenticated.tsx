import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../state/hook";

export default function Authenticated() {
    const state = useAppSelector(state => state.user);

    if (!state.token) {
        return <Navigate to="/signIn" />
    }

    return (
            <Outlet />
    );
}
