import React from "react";
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import Switch from '@mui/material/Switch';
import { Checkbox } from "@mui/material";
import { ParsedTicket } from "../state/parsedLinks";
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';

const LIGHTBLUE = "#d1e4f6";
const EVENLIGHTERBLUE = "#e8f1fb";
const WHITE = "#fff";

interface ITARProps {
    thisTicket: ParsedTicket;
    isAffecting: boolean;
    selected: ParsedTicket;
    disabled: boolean;
    handleChange: (thisTicket: ParsedTicket) => void;
    onPress: (thisTicket: ParsedTicket) => void;
}

dayjs.extend(isBetween);

const TrafficAffectingRow: React.FC<ITARProps> = ({ thisTicket, isAffecting, selected, disabled, handleChange, onPress }) => {

    const sd = dayjs(thisTicket.ticketStartedAt).format("DD/MM/YYYY hh:mm A");
    const cd = dayjs(thisTicket.ticketResolvedAt).format("DD/MM/YYYY hh:mm A");
    const dif = dayjs(thisTicket.ticketResolvedAt).diff(dayjs(thisTicket.ticketStartedAt), "hour", true).toFixed(3);

    const isSelected = thisTicket === selected;

    const [bgColor, setBgColor] = React.useState<string>(WHITE);

    React.useEffect(() => {
        if (isSelected) {
            setBgColor(LIGHTBLUE);
        } else {
            if (dayjs(thisTicket.ticketStartedAt).isBetween(dayjs(selected.ticketStartedAt), dayjs(selected.ticketResolvedAt), null, '[]') && (dayjs(thisTicket.ticketResolvedAt).isBetween(dayjs(selected.ticketStartedAt), dayjs(selected.ticketResolvedAt), null, '[]'))) {
                setBgColor(EVENLIGHTERBLUE);
            } else {
                setBgColor(WHITE);
            }
        }
    }, [isSelected, selected.id, selected.ticketResolvedAt, selected.ticketStartedAt, thisTicket.ticketResolvedAt, thisTicket.ticketStartedAt]);

    return (
        <Paper
            sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                p: 1,
                my: 2,
                backgroundColor: bgColor,
            }}
            variant="elevation"
            component="ul">
            <Chip label={thisTicket.id + 1} color={disabled ? "default" : "primary"} variant="outlined" sx={{ fontWeight: "bold", marginRight: 2, width: 50 }} />
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    flexWrap: 'wrap',
                    listStyle: 'none',
                }}>
                <Chip label={thisTicket.ticketDesc} color={disabled ? "default" : "primary"} variant="outlined" sx={{ fontWeight: "bold", marginRight: 2 }} />
                <Chip label={thisTicket.category} color={disabled ? "default" : "primary"} variant="outlined" sx={{ fontWeight: "bold", marginRight: 2 }} />
                <Chip label={sd + " - " + cd} color={disabled ? "default" : "primary"} variant="outlined" sx={{ fontWeight: "bold", marginRight: 2 }} />
                <Chip label={dif + " hours"} color={disabled ? "default" : "primary"} variant="outlined" sx={{ fontWeight: "bold", marginRight: 2 }} />
                <Chip label={thisTicket.linkname} color={disabled ? "default" : "primary"} variant="filled" sx={{ fontWeight: "bold", marginRight: 2, width: 200 }} />
                <Checkbox disabled={disabled} onChange={() => onPress(thisTicket)} checked={isSelected} />
                <Switch
                    disabled={disabled}
                    checked={isAffecting}
                    onChange={() => handleChange(thisTicket)} />
            </Box>
        </Paper>
    )
}

export default TrafficAffectingRow;