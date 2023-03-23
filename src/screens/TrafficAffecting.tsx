import { Button, Container } from "@mui/material";
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import React from "react";
import TrafficAffectingRow from "../components/TrafficAffectingRow";
import { useAppDispatch, useAppSelector } from "../state/hook";
import { ParsedTicket, updateParsedState } from "../state/parsedLinks";
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import { useNavigate } from "react-router-dom";
import useTheme from "@mui/material/styles/useTheme";
import StepperComponent from "../components/StepperComponent";

dayjs.extend(isBetween);

const TicketAffecting = () => {

    const networkArray = useAppSelector(state => state.nodes.nodes);
    // const billData = useAppSelector(state => state.billItems);

    const parsedTickets = useAppSelector(state => state.parsedTickets);

    const [tickets, setTickets] = React.useState<ParsedTicket[]>(parsedTickets);
    const [selected, setSelected] = React.useState<ParsedTicket>(parsedTickets[0]);

    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const theme = useTheme();

    const handleChange = (tk: ParsedTicket) => {
        setTickets(p => {
            let s = [...p];
            let index = s.indexOf(tk);
            s[index] = { ...s[index], trafficAffected: !s[index].trafficAffected }
            return s
        });
    }

    const handleCreate = () => {

        dispatch(updateParsedState(tickets));

        // tickets.forEach((ticket) => {
        //     if (networkArray[ticket.firstMatchRefIndex].vendor !== "sanguine" || !ticket.trafficAffected) return;

        //     networkArray[ticket.firstMatchRefIndex].cps.forEach(cp => {
        //         const item = billData.find(bi => bi.cpNumber === cp);
        //         if (item) {
        //             const itemIndex = billData.indexOf(item);
        //             dispatch(addDowntime({
        //                 itemIndex,
        //                 downtimeItem: {
        //                     id: ticket.id,
        //                     startedAt: ticket.ticketStartedAt,
        //                     resolvedAt: ticket.ticketResolvedAt,
        //                     downtime: ticket.ticketResolvedAt - ticket.ticketStartedAt,
        //                 }
        //             }));
        //         }
        //     });
        // });

        navigate("/bill/create");
    }

    return (
        <Container sx={{ minWidth: "95%" }}>
            <Container>
                <StepperComponent step={2} />
            </Container>
            <Box sx={{}}>
                <Paper
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        p: 1,
                        my: 2,
                        backgroundColor: theme.palette.primary.main,
                    }}
                    variant="elevation"
                    component="ul">
                    <Chip label="S No." color="default" variant="outlined" sx={{ color: "#fff", fontWeight: "bold", marginRight: 2 }} />
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                            flexWrap: 'wrap',
                            listStyle: 'none',
                        }}>
                        <Chip label="Ticket Description" color="default" variant="outlined" sx={{ color: "#fff", fontWeight: "bold", marginRight: 2, width: 250 }} />
                        <Chip label="Category" color="default" variant="outlined" sx={{ color: "#fff", fontWeight: "bold", marginRight: 2, width: 250 }} />
                        <Chip label="Downtime" color="default" variant="outlined" sx={{ color: "#fff", fontWeight: "bold", marginRight: 2, width: 250 }} />
                        <Chip label="Downtime Hours" color="default" variant="outlined" sx={{ color: "#fff", fontWeight: "bold", marginRight: 2 }} />
                        <Chip label="Link Name" color="default" variant="outlined" sx={{ color: "#fff", fontWeight: "bold", marginRight: 2, width: 200 }} />
                        <Chip label="S" color="default" variant="outlined" sx={{ color: "#fff", fontWeight: "bold", marginRight: 2, width: 40 }} />
                        <Chip label="T" color="default" variant="outlined" sx={{ color: "#fff", fontWeight: "bold", marginRight: 1, width: 40 }} />
                    </Box>
                </Paper>
                {
                    tickets.map((ticket, index) => {
                        const abled = networkArray[ticket.firstMatchRefIndex].vendor === "sanguine";
                        return (
                            <TrafficAffectingRow key={ticket.id} thisTicket={ticket} disabled={!abled} isAffecting={ticket.trafficAffected} selected={selected} handleChange={(t) => handleChange(t)} onPress={(t) =>  setSelected(t)} />
                        );
                    })
                }
            </Box>
            <Box sx={{ display: "flex", flex: 1, justifyContent: "flex-end", marginY: 10 }}>
                <Button variant="contained" onClick={handleCreate}>Create Bill</Button>
            </Box>
        </Container>
    );
}

export default TicketAffecting;