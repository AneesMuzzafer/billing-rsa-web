import { Autocomplete, Box, Button, Chip, Container, TextField, Typography } from "@mui/material";
import Paper from "@mui/material/Paper";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Node } from "../api";
import { useAppDispatch, useAppSelector } from "../state/hook";
import { clearNode, INode } from "../state/nodeSlice";
import { IVendor } from "../state/vendorSlice";

const blankNode = { id: "", label: "", region: "", cps: [] as Array<number>, vendor: "", connectedLinks: [] as Array<string>, alias: [] as Array<string> };

const NodeEditor = () => {
    const params = useParams();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const id = params?.id;

    const state = useAppSelector(state => state.nodes);
    const vendors = useAppSelector(state => state.vendors.vendors);

    const [node, setNode] = React.useState<INode>(blankNode as INode);
    const [cp, setCp] = React.useState<number>(0);
    const [conLink, setConLink] = React.useState<string>("");
    const [alias, setAlias] = React.useState<string>("");

    React.useEffect(() => {
        dispatch(clearNode());

        id && dispatch(Node.getOneNode({ id }));

        return () => { dispatch(clearNode()); };
    }, []);

    React.useEffect(() => {
        state.node?.id && setNode(state.node);
    }, [state.node, vendors])

    const handleSave = () => {
        if (id) {
            dispatch(Node.updateNode(node)).then(() => navigate("/nodes"));
        } else {
            dispatch(Node.createNode(node)).then(() => navigate("/nodes"));
        }
    }

    return (
        <Container sx={{ minWidth: "90vw", marginTop: "50px" }}>
            <Paper>
                <Box sx={{ display: "flex", justifyContent: "center", padding: "20px" }}>
                    <Typography variant="h4">Node Editor</Typography>
                </Box>
                <Box sx={{ padding: "20px", gap: "20px", display: "flex", flexDirection: "column" }}>
                    <Box sx={{ width: "300px" }}>
                        <TextField
                            label="Node Label"
                            variant="outlined"
                            value={node.label}
                            fullWidth
                            onChange={(e) => setNode({ ...node, label: e.target.value })} />
                    </Box>
                    <Box sx={{ width: "300px" }}>
                        <TextField
                            label="Region"
                            variant="outlined"
                            fullWidth
                            value={node.region}
                            onChange={(e) => setNode({ ...node, region: e.target.value })} />
                    </Box>
                    {vendors.length > 0 && <Autocomplete
                        disablePortal
                        clearOnEscape
                        id="combo-box-demo"
                        options={vendors}
                        getOptionLabel={(option) => option.name || ""}
                        sx={{ width: "300px" }}
                        value={vendors.find(v => v.id === node.vendor)}
                        onChange={(_, newValue: IVendor | null) => {
                            newValue && setNode({ ...node, vendor: newValue.id });
                        }}
                        renderInput={(params) => <TextField {...params} size="small" label="Last Mile Vendor" />}
                    />}
                    <Box >
                        <Typography>CP Numbers Associated</Typography>
                        <Paper
                            sx={{
                                display: "flex",
                                justifyContent: "flex-start",
                                alignItems: "center",
                                p: 1,
                                my: 2,
                            }}
                            variant="elevation"
                            component="ul">
                            {
                                node.cps.length > 0 ? node.cps?.map((cp, i) => (
                                    <Chip key={i} label={cp} color="primary" variant="filled" sx={{ fontWeight: "bold", marginRight: 2 }} onDelete={() => setNode({ ...node, cps: node.cps.filter(b => cp !== b) })} />
                                )) :
                                    <Typography sx={{ marginRight: "30px", fontSize: "14px" }}>No CPs Added</Typography>
                            }
                            <TextField
                                label="CP Number"
                                variant="outlined"
                                size="small"
                                value={cp}
                                sx={{ width: "200px" }}
                                onChange={(e) => setCp(c => {
                                    if (e.target.value !== "")
                                        if (e.target.value.length > 5) {
                                            return c;
                                        } else {
                                            return parseInt(e.target.value);
                                        }
                                    else {
                                        return 0
                                    }
                                })} />
                            <Button variant="text" onClick={() => { setNode({ ...node, cps: [...node.cps, cp] }); setCp(0); }}>Add</Button>
                        </Paper>
                    </Box>
                    <Box >
                        <Typography>Connected Links</Typography>
                        <Paper
                            sx={{
                                display: "flex",
                                justifyContent: "flex-start",
                                alignItems: "center",
                                p: 1,
                                my: 2,
                            }}
                            variant="elevation"
                            component="ul">
                            {
                                node.connectedLinks?.length > 0 ? node.connectedLinks?.map((cl, i) => (
                                    <Chip key={i} label={cl} color="primary" variant="filled" sx={{ fontWeight: "bold", marginRight: 2 }} onDelete={() => setNode({ ...node, connectedLinks: node.connectedLinks.filter(b => cl !== b) })} />
                                )) :
                                    <Typography sx={{ marginRight: "30px", fontSize: "14px" }}>No Links Connected</Typography>
                            }
                            <TextField
                                label="Connected Link"
                                variant="outlined"
                                value={conLink}
                                sx={{ width: "200px" }}
                                onChange={(e) => setConLink(e.target.value)} />
                            <Button variant="text" onClick={() => { conLink && setNode({ ...node, connectedLinks: [...node.connectedLinks, conLink] }); setConLink(""); }}>Add</Button>
                        </Paper>
                    </Box>
                    <Box >
                        <Typography>Alias</Typography>
                        <Paper
                            sx={{
                                display: "flex",
                                justifyContent: "flex-start",
                                alignItems: "center",
                                p: 1,
                                my: 2,
                            }}
                            variant="elevation"
                            component="ul">
                            {
                                node.alias.length > 0 ? node.alias?.map((a, i) => (
                                    <Chip key={i} label={a} color="primary" variant="filled" sx={{ fontWeight: "bold", marginRight: 2 }} onDelete={() => setNode({ ...node, alias: node.alias.filter(b => a !== b) })} />
                                )) :
                                    <Typography sx={{ marginRight: "30px", fontSize: "14px" }}>No Alias set</Typography>
                            }
                            <TextField
                                label="Alias"
                                variant="outlined"
                                value={alias}
                                sx={{ width: "200px" }}
                                onChange={(e) => setAlias(e.target.value)} />
                            <Button variant="text" onClick={() => { alias && setNode({ ...node, alias: [...node.alias, alias] }); setAlias(""); }}>Add</Button>
                        </Paper>
                    </Box>
                </Box>
                <Box sx={{display: "flex", justifyContent: "flex-end", padding: "20px"}}>
                    <Button variant="contained" sx={{ width: 20 }} onClick={handleSave}>{id ? "Update" : "Create"}</Button>
                </Box>
            </Paper>
        </Container >
    );
}

export default NodeEditor;
