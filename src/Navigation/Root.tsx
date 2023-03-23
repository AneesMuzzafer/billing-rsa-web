import React from "react";
import { Outlet } from "react-router-dom";
import { Node, Vendor } from "../api";
import Service from "../api/service";
import TopBar from "../components/TopBar";
import { useAppDispatch } from "../state/hook";

export default function Root() {
    const dispatch = useAppDispatch();

      React.useEffect(() => {
        dispatch(Node.getAllNodes());
        dispatch(Service.getAllServices());
        dispatch(Vendor.getAllVendors());

    }, [dispatch]);

    return (
        <div>
            <TopBar />
            <Outlet />
        </div>
    );
}
