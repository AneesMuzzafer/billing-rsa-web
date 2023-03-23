import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../state/hook";

export default function Unauthenticated() {
    const state = useAppSelector(state => state.user);

    if (state.token) {
        return <Navigate to="/" />
    }

    return (
        <Outlet />
    );
}
