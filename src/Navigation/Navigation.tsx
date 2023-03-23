import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import NodeList from "../screens/NodeList";
import MainScreen from "../screens/MainScreen";
import MapTickets from "../screens/MapTickets";
import TrafficAffecting from "../screens/TrafficAffecting";
import ServiceList from "../screens/ServiceList";
import NodeEditor from "../screens/NodeEditor";
import ServiceEditor from "../screens/ServiceEditor";
import BillView from "../screens/BillView";
import History from "../screens/History";
import SignIn from "../screens/SignIn";
import Authenticated from "./Authenticated";
import Unauthenticated from "./Unauthenticated";
import Root from "./Root";

export default function Navigation() {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<Authenticated />}>
                    <Route path="/" element={<Root />}>
                        <Route index element={<MainScreen />} />
                        <Route path="/map" element={<MapTickets />} />
                        <Route path="/traffic" element={<TrafficAffecting />} />

                        <Route path="/nodes" element={<NodeList />} />
                        <Route path="/nodes/:id/edit" element={<NodeEditor />} />
                        <Route path="/nodes/create" element={<NodeEditor />} />

                        <Route path="/service" element={<ServiceList />} />
                        <Route path="/service/create" element={<ServiceEditor />} />
                        <Route path="/service/:id/edit" element={<ServiceEditor />} />

                        <Route path="/history" element={<History />} />

                        <Route path="/bill/:action" element={<BillView />} />
                    </Route>
                </Route>
                <Route element={<Unauthenticated />}>
                    <Route path="/signIn" element={<SignIn />} />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}
