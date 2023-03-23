import React from "react";
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import { INode } from "../state/nodeSlice";
import { Button } from "@mui/material";
import { IVendor } from "../state/vendorSlice";
export interface Link {
    id: number;
    label: string;
}
interface ILinkRow {
    index: number;
    thisLink: INode;
    conLinks: string[] | undefined;
    vendor: IVendor;
    onClick: () => void;
    onDelete: () => void;
}

const LinkRow: React.FC<ILinkRow> = ({ index, thisLink, vendor, conLinks, onClick, onDelete }) => {
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
            <Box
                onClick={onClick}
                sx={{
                    display: 'flex',
                    flex: 1,
                    justifyContent: 'space-between',
                    alignItems: "center",
                    flexWrap: 'wrap',
                    listStyle: 'none',
                }}>
                <Box sx={{ display: "flex", flex: 3 }}>
                    <Chip label={index + 1} color="primary" variant="outlined" sx={{ fontWeight: "bold", marginRight: 2 }} />
                    <Chip label={thisLink.label} color="primary" variant="filled" sx={{ fontWeight: "bold", marginRight: 2 }} />
                </Box>
                <Box sx={{ display: "flex", flex: 7, justifyContent: "flex-start" }}>
                    <Chip label={vendor?.name ?? "Getting Vendor..."} color="primary" variant="outlined" sx={{ fontWeight: "bold", marginRight: 2, width: 100 }} />
                    {thisLink.cps && thisLink.cps.map((no, index) => (
                        no !== -1 && <li key={index} style={{ margin: 0, padding: 0 }}>
                            <Chip
                                sx={{ marginX: 0.5 }}
                                label={no}
                                color="primary"
                                variant="outlined"
                            />
                        </li>
                    ))}
                </Box>
            </Box>
            <Button variant="text" onClick={onDelete}>Delete</Button>
        </Paper>
    );
}

export default LinkRow;
