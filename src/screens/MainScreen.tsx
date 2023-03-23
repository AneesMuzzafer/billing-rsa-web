import React from "react";
import { getStartEndTime, processCsv } from "../utils/utils";
import { Box, Container, Switch, Typography } from "@mui/material";
import UploadFileButton from "../components/UploadFileButton";
import { useAppSelector, useAppDispatch } from "../state/hook";
import { doFuzzySearch } from "../utils/fuzzySeach";
import { useNavigate } from "react-router-dom";
import { updateParsedState } from "../state/parsedLinks";
import StepperComponent from "../components/StepperComponent";
import { toggleFastTrafficAffecting, updateStartEndTime } from "../state/settingSlice";

const MainScreen = () => {

    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const networkArray = useAppSelector(state => state.nodes.nodes);
    const settings = useAppSelector(state => state.settings);

    const handleTicketProcessing = async (ticketFile: File) => {
        let tickets = await processCsv(ticketFile);

        if (settings.enableFastTrafficAffecting) {
            tickets = tickets.filter(t => t["Remarks"].includes("$yes$"));
        }

        const parsedLinks = doFuzzySearch(tickets, networkArray);

        dispatch(updateStartEndTime(getStartEndTime(parsedLinks)))
        dispatch(updateParsedState(parsedLinks));
        navigate("/map");
    }

    return (
        <Container >
            <StepperComponent step={0} completed={false} />
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                <Box sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
                    <Typography variant="overline">Traffic Affected Links indicated in Tickets?</Typography>
                    <Switch
                        checked={settings.enableFastTrafficAffecting}
                        onChange={() => dispatch(toggleFastTrafficAffecting())} />
                </Box>
            </Box>
            <Box sx={{ height: "70vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
                <Box sx={{ width: "50%", height: "50%", border: "solid 1px grey" }}>
                    <UploadFileButton handleProcessing={handleTicketProcessing} />
                </Box>
            </Box>
        </Container>
    );
}

export default MainScreen;
