import { processBillCsv } from "../utils/utils";
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import UploadFileButton from "../components/UploadFileButton";
import { useAppDispatch, useAppSelector } from "../state/hook";
import { Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Service from "../api/service";
import { DataGrid, GridColDef, GridRenderCellParams, GridValueGetterParams } from "@mui/x-data-grid";


const ServiceList = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const services = useAppSelector(state => state.services);
    const vendors = useAppSelector(state => state.vendors.vendors);
    const nodes = useAppSelector(state => state.nodes.nodes);

    const handleBillProcessing = async (billFile: File) => {
        const billData = await processBillCsv(billFile, vendors, nodes);
        dispatch(Service.importServices({ services: billData }));
    }

    const serviceColumns: GridColDef[] = [
        { field: "name", headerName: "Customer Name", width: 200 },
        { field: "cpNumber", headerName: "Cp Number", width: 100 },
        { field: "linkFrom", headerName: "Link From", width: 100 },
        { field: "linkTo", headerName: "Link To", width: 100 },
        { field: "annualInvoiceValue", headerName: "Annual Invoice Value", width: 150 },
        {
            field: "vendor", headerName: "Last Mile Vendor", width: 150,
            valueGetter: (params: GridValueGetterParams) => params.row.vendor.name
        },
        {
            field: "node", headerName: "Node", width: 200,
            valueGetter: (params: GridValueGetterParams) => params.row.node?.label
        },
        { field: "unitRate", headerName: "Unit Rate", width: 100 },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 140,
            disableColumnMenu: true,
            renderCell: (params: GridRenderCellParams) => (
                <Button
                    variant="outlined"
                    color="primary"
                    size="small"
                    onClick={() => window.confirm("Are you sure?") && dispatch(Service.deleteService({ id: params.row.id }))}
                    style={{ marginLeft: 16 }}>
                    Delete
                </Button>
            ),
        }
    ];

    return (
        <Container maxWidth={false} >
            <Box sx={{ width: "100%", display: "flex", flexDirection: "column" }}>
                <Box sx={{ width: "100%", height: "15vh", borderBottom: "solid 1px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <Box sx={{ width: "100%", display: "flex" }}>
                        <Typography variant="h4" color={"primary"}>Services</Typography>
                        <Button variant="contained" sx={{ marginLeft: "20px", width: 200 }} onClick={() => navigate("/service/create")}>Add Service +</Button>
                    </Box>
                    <UploadFileButton handleProcessing={handleBillProcessing} label={"Import"} />
                </Box>
                <div style={{ height: "70vh" }}>
                    <DataGrid
                        columns={serviceColumns}
                        rows={services.services}
                    />
                </div>
            </Box>
        </Container >
    );

}

export default ServiceList;
