import React from "react";
import { useAppSelector } from "../state/hook";
import { DataGrid, GridColDef, GridRenderCellParams, GridValueFormatterParams, GridValueGetterParams } from '@mui/x-data-grid';
import { Button, Chip, Paper, Typography } from "@mui/material";
import { createBillSummaryString, createDowmtimeString, getSlab } from "../utils/downTimeCSV";
import { CSVLink } from "react-csv";
import { Box } from "@mui/system";
import download from "downloadjs";
import { IVendor } from "../state/vendorSlice";
import { createBillArray, roundToTwo } from "../utils/billCalcUtil";
import dayjs from "dayjs";

export interface billTable {
    id: string;
    index: string;
    name: string;
    cpNumber: number;
    lastMile: string;
    capacity: string;
    linkFrom: string;
    linkTo: string;
    doco: string;
    annualInvoiceValue: number;
    sharePercent: number;
    discountOffered: number;
    annualVendorValue: number;
    unitRate: number;
    numberOfDays: number;
    downtime: number;
    uptimePercent: number;
    penaltySlab: string;
    penaltyHours: number;
    penaltyAmount: number;
    amount: number;
};

interface IBillDateTable {
    vendor: IVendor;
    month: number;
    onExpand: (id: string) => void;
}

const BillDataTable: React.FC<IBillDateTable> = ({ vendor, month, onExpand }) => {

    const state = useAppSelector(state => state.billItems.billItems);
    const billData = state.filter(item => (item.month === month && item.service.vendor.id === vendor.id));

    const [bill, setBill] = React.useState<billTable[]>(createBillArray(billData));

    React.useEffect(() => {
        setBill(createBillArray(billData));
    }, [state, vendor, month]);

    const totalValue = roundToTwo(bill.reduce((p, c) => p + c.amount, 0));

    const columns: GridColDef[] = [
        {
            field: 'id',
            headerName: 'ID',
            width: 60,
            valueGetter: (params) => params.row.index
        },
        {
            field: 'name',
            headerName: 'Customer Name',
            width: 180,
            editable: true,
        },
        {
            field: 'cpNumber',
            headerName: 'CP No.',
            width: 80,
            editable: true,
        },
        {
            field: 'lastMile',
            headerName: 'Link Type',
            type: 'number',
            width: 80,
            editable: true,
        },
        {
            field: 'annualInvoiceValue',
            headerName: 'Annual Value',
            type: 'number',
            width: 120,
            editable: true,
        },
        {
            field: 'sharePercent',
            headerName: 'Share',
            type: 'number',
            width: 110,
            editable: true,
            valueFormatter: (params: GridValueFormatterParams) => {
                const valueFormatted = Number(
                    (params.value as number) * 100,
                ).toLocaleString();
                return `${valueFormatted} %`;
            },
        },
        {
            field: 'unitRate',
            headerName: 'Unit Rate',
            type: 'number',
            width: 110,
            editable: true,
        },
        {
            field: 'numberOfDays',
            headerName: 'Days',
            type: 'number',
            width: 80,
            editable: true,
        },
        {
            field: 'downtime',
            headerName: 'Downtime',
            type: 'number',
            width: 140,
            editable: true,
            valueGetter: (params: GridValueGetterParams) => params.row.downtime
        },
        {
            field: 'uptimePercent',
            headerName: 'Uptime Percent',
            type: 'number',
            width: 140,
            editable: true,
            valueFormatter: (params: GridValueFormatterParams) => {
                const valueFormatted = Number(
                    (params.value as number) * 100,
                ).toLocaleString();
                return `${valueFormatted} %`;
            },
        },
        {
            field: 'penaltySlab',
            headerName: 'Penalty Slab',
            type: 'number',
            width: 110,
            editable: true,
            valueGetter: (params: GridValueGetterParams) => params.row.penaltySlab
        },
        {
            field: 'penaltyHours',
            headerName: 'Penalty Hrs',
            type: 'number',
            width: 110,
            editable: true,
        },
        {
            field: 'penaltyAmount',
            headerName: 'Penalty Amount',
            type: 'number',
            width: 140,
            editable: true,
        },
        {
            field: 'amount',
            headerName: 'Amount',
            type: 'number',
            width: 140,
            editable: true,
        },
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
                    onClick={() => onExpand(params.row.id)}
                    style={{ marginLeft: 16 }}>
                    expand
                </Button>
            ),
        },
    ];

    return (
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <Paper sx={{ display: "flex", width: "90%", justifyContent: "space-between", alignItems: "center", padding: 1, marginBottom: 2 }}>
                <Box sx={{ display: "flex", width: "600px", justifyContent: "flex-start", alignItems: "center" }} >
                    <Box display="flex">
                        <Typography variant="button">Total Amount:  <Chip label={`₹ ${roundToTwo(totalValue).toLocaleString("en-IN")}`} color="primary" variant="outlined" sx={{ fontWeight: "bold", marginX: 2, marginBottom: 1 }} /></Typography>
                    </Box>
                    <Box display="flex">
                        <Typography variant="button">Total Penalty:  <Chip label={`₹ ${roundToTwo(bill.reduce((a, b) => a + b.penaltyAmount, 0)).toLocaleString("en-IN")}`} color="primary" variant="outlined" sx={{ fontWeight: "bold", marginX: 2, marginBottom: 1 }} /></Typography>
                    </Box>
                </Box>
                <Typography variant="h6">{vendor.name} - {dayjs().month(month).format('MMMM')}</Typography>
                <Box sx={{ display: "flex", width: "600px", justifyContent: "flex-end" }}>
                    <CSVLink filename={`downtime-${new Date()}.csv`} style={{ textDecorationLine: "none", marginRight: 20 }} data={createDowmtimeString(bill, billData)}>
                        <Button size="small" variant="outlined" >Downtime</Button>
                    </CSVLink>
                    <CSVLink filename={`bill-summary-${new Date()}.csv`} style={{ textDecorationLine: "none", marginRight: 20 }} data={createBillSummaryString(bill, totalValue)}>
                        <Button size="small" variant="outlined" >Bill Summary</Button>
                    </CSVLink>
                    <Button size="small" onClick={() => download(JSON.stringify(billData), "bill.json", "text/JSON")} variant="outlined">JSON</Button>
                </Box>
                {/* <Box sx={{ display: "flex", justifyContent: "center" }}>
                        <TextField label="No. of Days" variant="outlined" value={totalDays} sx={{ mx: 2 }} onChange={(e: any) => handleChange(e)} />
                        <Button onClick={() => dispatch(updateBillDays(totalDays))} variant="text">Update</Button>
                    </Box> */}
            </Paper>
            <div style={{ marginTop: 5, width: '99%', display: "flex", justifyContent: "center" }} >
                <div style={{ height: "70vh", flex: 1, display: "flex", justifyContent: "center" }}>
                    <DataGrid
                        rows={bill}
                        columns={columns}
                        density="compact"
                    />
                </div>
            </div>
        </Box>
    );
};

export default BillDataTable;
