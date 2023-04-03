import React from "react";
import { processNetworkCsv } from "../utils/utils";
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import LinkRow from "../components/LinkRow";
import UploadFileButton from "../components/UploadFileButton";
import { useAppDispatch, useAppSelector } from "../state/hook";
import { Button } from "@mui/material";
import { CSVLink } from "react-csv";
import { createNetworkString } from "../utils/downTimeCSV";
import { useNavigate } from "react-router-dom";
import { Node } from "../api";

const NodeList = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const networkArray = useAppSelector(state => state.nodes.nodes);
    const vendors = useAppSelector(state => state.vendors.vendors);

    const handleLinkProcessing = async (linkFile: File) => {
        const linkData = await processNetworkCsv(linkFile);
        dispatch(Node.importNodes({ nodes: linkData }));
    }

    return (
        <Container maxWidth={false} >
            <Box sx={{ width: "100%", display: "flex", flexDirection: "column" }}>
                <Box sx={{ width: "100%", height: "15vh", borderBottom: "solid 1px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <Button variant="contained" sx={{ width: 150 }} onClick={() => navigate("/nodes/create")}>Add Node +</Button>
                    <UploadFileButton handleProcessing={handleLinkProcessing} />
                    <CSVLink filename={`network-${new Date()}.csv`} style={{ textDecorationLine: "none", marginRight: 20 }} data={createNetworkString(networkArray)}>
                        <Button variant="outlined" >Download Network</Button>
                    </CSVLink>
                </Box>
                <Box sx={{ width: "100%" }}>
                    {
                        networkArray && vendors && networkArray.map((link, index) => {
                            return (
                                <div key={link.id} >
                                    <LinkRow index={index} conLinks={link.connectedLinks} vendor={vendors[vendors.findIndex(v => v.id === link.vendor)] ?? vendors[0]} thisLink={link} onClick={() => navigate(`/nodes/${link.id}/edit`)} onDelete={() => dispatch(Node.deleteNode({ id: link.id }))} />
                                </div>)
                        })
                    }
                </Box>
            </Box>
        </Container>
    );
}

export default NodeList;
