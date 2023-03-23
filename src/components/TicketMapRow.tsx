import React from "react";
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import { INode } from "../state/nodeSlice";
import { Autocomplete, TextField } from "@mui/material";
import { ParsedTicket } from "../state/parsedLinks";
import { useAppSelector } from "../state/hook";
interface ILinkRow {
    thisTicket: ParsedTicket;
    onSelect: (ticket: ParsedTicket, newRefIndex: number) => void;
    unmatched?: boolean;
}

const TicketMapRow: React.FC<ILinkRow> = ({ thisTicket, onSelect, unmatched = false }) => {

    const networkArray: INode[] = useAppSelector(state => state.nodes.nodes);
    const [selected, setSelected] = React.useState<INode>(!unmatched ? networkArray[thisTicket.firstMatchRefIndex] : networkArray[1]);

    return (
        <Paper
            sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                p: 1,
                my: 2,
            }}
            variant="elevation"
            component="ul"
        >
            <Chip label={thisTicket.id} color="primary" variant="outlined" sx={{ fontWeight: "bold", marginRight: 2 }} />
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    flexWrap: 'wrap',
                    listStyle: 'none',
                }}>
                <Chip label={thisTicket.ticketDesc} color="primary" variant="outlined" sx={{ fontWeight: "bold", marginRight: 2 }} />
                <Chip label={thisTicket.linkname} color="primary" variant="filled" sx={{ fontWeight: "bold", marginRight: 2 }} />
                <Box sx={{ display: "flex", padding: 0 }}>
                    <Autocomplete
                        disablePortal
                        clearOnEscape
                        id="combo-box-demo"
                        options={networkArray}
                        sx={{ width: 300 }}
                        value={selected}
                        onChange={(_, newValue: INode | null) => {
                            newValue && setSelected(newValue);
                            newValue && onSelect(thisTicket, networkArray.indexOf(newValue));
                        }}
                        renderInput={(params) => <TextField {...params} size="small" label="Link" />}
                    />
                </Box>
            </Box>
        </Paper>
    );
}

export default TicketMapRow;