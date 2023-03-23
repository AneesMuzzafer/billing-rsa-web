import { Box, Button, Container, Paper, TextField, Typography, Autocomplete } from '@mui/material';
import Chip from '@mui/material/Chip';
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Service from '../api/service';
import { useAppDispatch, useAppSelector } from '../state/hook';
import { INode } from '../state/nodeSlice';
import { clearService, IService } from '../state/serviceSlice';
import { IVendor } from '../state/vendorSlice';

const blankService: IService = {
    id: "",
    vendor: {} as IVendor,
    node: {} as INode,

    name: "",
    cpNumber: 0,
    capacity: "",
    linkFrom: "",
    linkTo: "",
    doco: "",
    lastMile: "",
    annualInvoiceValue: 0,
    sharePercent: 0,
    discountOffered: 0,
    annualVendorValue: 0,
    unitRate: 0,
    totalPODays: 0,
    remarks: [],
};

const ServiceEditor = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const params = useParams();

    const [service, setService] = React.useState<IService>(blankService);

    const state = useAppSelector(state => state.services.service);
    const vendors = useAppSelector(state => state.vendors.vendors);
    const nodes = useAppSelector(state => state.nodes.nodes);

    const id = params?.id;

    React.useEffect(() => {
        dispatch(clearService());

        id && dispatch(Service.getOneService({ id }));

        return () => { dispatch(clearService()); }
    }, []);

    React.useEffect(() => {
        state.id && setService(state);
    }, [state]);

    const handleSave = () => {
        if (id) {
            dispatch(Service.updateService(service)).then(() => navigate("/service"));
        } else {
            dispatch(Service.createService(service)).then(() => navigate("/service"));
        }
    };

    return (
        <Container sx={{ minWidth: "90vw", marginTop: "50px" }}>
            <Paper>
                <Box sx={{ display: "flex", justifyContent: "center", padding: "20px" }}>
                    <Typography variant="h4">Service Editor</Typography>
                </Box>
                <Box sx={{ padding: "20px", gap: "20px", display: "flex", flexDirection: "column" }}>
                    <Box sx={{ display: "flex", justifyContent: "center", gap: "15px" }}>
                        <Box sx={{ width: "300px" }}>
                            <TextField
                                label="Name"
                                variant="outlined"
                                value={service.name}
                                size="small"
                                fullWidth
                                onChange={(e) => setService({ ...service, name: e.target.value })} />
                        </Box>
                        <Box sx={{ width: "300px" }}>
                            <TextField
                                label="CP Number"
                                variant="outlined"
                                fullWidth
                                size="small"
                                value={service.cpNumber}
                                onChange={(e) => setService({ ...service, cpNumber: e.target.value === "" ? 0 : parseInt(e.target.value) })} />
                        </Box>
                        {((id && service.vendor.id && vendors.length > 0) || (!id && vendors.length > 0)) &&
                            <Autocomplete
                                disablePortal
                                clearOnEscape
                                id="combo-box-demo"
                                options={vendors}
                                getOptionLabel={(option) => option.name || ""}
                                sx={{ width: "300px" }}
                                value={vendors.find(v => v.id === service.vendor.id)}
                                onChange={(_, val: IVendor | null) => {
                                    val && setService({ ...service, vendor: val });
                                }}
                                renderInput={(params) => <TextField {...params} size="small" label="Last Mile Vendor" />}
                            />
                        }
                        {((id && service.node.id && nodes.length > 0) || (!id && nodes.length > 0)) &&
                            <Autocomplete
                                disablePortal
                                clearOnEscape
                                id="combo-box-demo"
                                options={nodes}
                                getOptionLabel={(option) => option.label || ""}
                                sx={{ width: "300px" }}
                                value={nodes.find(n => n.id === service.node.id)}
                                onChange={(_, val: INode | null) => {
                                    val && setService({ ...service, node: val });
                                }}
                                renderInput={(params) => <TextField {...params} size="small" label="Node" />}
                            />
                        }
                    </Box>
                    <Box sx={{ display: "flex", justifyContent: "center", gap: "15px" }}>
                        <Box sx={{ width: "300px" }}>
                            <TextField
                                label="Capacity"
                                variant="outlined"
                                value={service.capacity}
                                size="small"
                                fullWidth
                                onChange={(e) => setService({ ...service, capacity: e.target.value })} />
                        </Box>
                        <Box sx={{ width: "300px" }}>
                            <TextField
                                label="Link From"
                                variant="outlined"
                                fullWidth
                                size="small"
                                value={service.linkFrom}
                                onChange={(e) => setService({ ...service, linkFrom: e.target.value })} />
                        </Box>
                        <Box sx={{ width: "300px" }}>
                            <TextField
                                label="Link To"
                                variant="outlined"
                                fullWidth
                                size="small"
                                value={service.linkTo}
                                onChange={(e) => setService({ ...service, linkTo: e.target.value })} />
                        </Box>
                    </Box>
                    <Box sx={{ display: "flex", justifyContent: "center", gap: "15px" }}>
                        <Box sx={{ width: "300px" }}>
                            <TextField
                                label="DOCO"
                                variant="outlined"
                                value={service.doco}
                                size="small"
                                fullWidth
                                onChange={(e) => setService({ ...service, doco: e.target.value })} />
                        </Box>
                        <Box sx={{ width: "300px" }}>
                            <TextField
                                label="Last Mile Media"
                                variant="outlined"
                                fullWidth
                                size="small"
                                value={service.lastMile}
                                onChange={(e) => setService({ ...service, lastMile: e.target.value })} />
                        </Box>
                        <Box sx={{ width: "300px" }}>
                            <TextField
                                label="Annual Invoice Value"
                                variant="outlined"
                                fullWidth
                                size="small"
                                value={service.annualInvoiceValue}
                                onChange={(e) => setService({ ...service, annualInvoiceValue: e.target.value === "" ? 0 : parseFloat(e.target.value) })} />
                        </Box>
                    </Box>
                    <Box sx={{ display: "flex", justifyContent: "center", gap: "15px" }}>
                        <Box sx={{ width: "300px" }}>
                            <TextField
                                label="Share Percent"
                                variant="outlined"
                                value={service.sharePercent}
                                size="small"
                                fullWidth
                                onChange={(e) => { setService({ ...service, sharePercent: e.target.value === "" ? 0 : parseFloat(e.target.value) }); }} />
                        </Box>
                        <Box sx={{ width: "300px" }}>
                            <TextField
                                label="Discount Offered"
                                variant="outlined"
                                fullWidth
                                size="small"
                                value={service.discountOffered}
                                onChange={(e) => setService({ ...service, discountOffered: e.target.value === "" ? 0 : parseInt(e.target.value) })} />
                        </Box>
                        <Box sx={{ width: "300px" }}>
                            <TextField
                                label="Annual Vendor Value"
                                variant="outlined"
                                fullWidth
                                size="small"
                                value={service.annualVendorValue}
                                onChange={(e) => setService({ ...service, annualVendorValue: e.target.value === "" ? 0 : parseInt(e.target.value) })} />
                        </Box>
                    </Box>
                    <Box sx={{ display: "flex", justifyContent: "center", gap: "15px" }}>
                        <Box sx={{ width: "300px" }}>
                            <TextField
                                label="Unit Rate"
                                variant="outlined"
                                value={service.unitRate}
                                size="small"
                                fullWidth
                                onChange={(e) => setService({ ...service, unitRate: e.target.value === "" ? 0 : parseInt(e.target.value) })} />
                        </Box>
                        <Box sx={{ width: "300px" }}>
                            <TextField
                                label="Total PO Days"
                                variant="outlined"
                                fullWidth
                                size="small"
                                value={service.totalPODays}
                                onChange={(e) => setService({ ...service, totalPODays: e.target.value === "" ? 0 : parseInt(e.target.value) })} />
                        </Box>
                    </Box>
                    {false &&
                        <><Typography variant="h6" mt="15px">Remarks</Typography>
                            <Box sx={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                                {
                                    service.remarks?.map((r, i) => (
                                        <Paper sx={{ display: 'flex', gap: "15px", padding: "5px 20px" }}>
                                            <Chip
                                                sx={{ marginX: 0.5 }}
                                                label={i + 1}
                                                color="primary"
                                                variant="outlined"
                                            />
                                            <Chip
                                                sx={{ marginX: 0.5 }}
                                                label={r.text}
                                                color="primary"
                                                variant="filled"
                                            />
                                            <Chip
                                                sx={{ marginX: 0.5 }}
                                                label={r.created_at}
                                                color="primary"
                                                variant="outlined"
                                            />
                                        </Paper>
                                    ))
                                }
                            </Box></>}
                </Box>
                <Box sx={{ display: "flex", justifyContent: "flex-end", padding: "20px" }}>
                    <Button variant="contained" sx={{ width: 20 }} onClick={handleSave}>{id ? "Update" : "Create"}</Button>
                </Box>
            </Paper>
        </Container >
    );
};

export default ServiceEditor;
