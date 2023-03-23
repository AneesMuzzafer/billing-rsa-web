import React from "react";
import { getStartEndTimeFromBill } from "../utils/utils";
import { Box, Button, Container, Paper, Typography } from "@mui/material";
import { useAppSelector, useAppDispatch } from "../state/hook";
import { useNavigate } from "react-router-dom";
import history from "../api/history";
import dayjs from "dayjs";
import { BillData, setBillItems } from "../state/billSlice";
import { updateStartEndTime } from "../state/settingSlice";
import axios from "axios";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';


const History = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const bills = useAppSelector(state => state.history.bills);

    React.useEffect(() => {
        dispatch(history.getBills());
    }, []);

    const handleLoad = (bill: BillData[]) => {
        dispatch(setBillItems(bill));
        dispatch(updateStartEndTime(getStartEndTimeFromBill(bill)))
        navigate("/bill/load");
    }

    const handleDownload = async ({ id, index, name }: { id: string, index: number, name: string }) => {
        const response = await axios.get(`/bill/export/${id}/${index}`, {
            responseType: "arraybuffer",
            timeout: 30000,
        });
        const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = `${name}_${dayjs().format('DD-MM-YY hh.mm A')}.xlsx`;
        link.click();
        link.remove();
    }

    return (
        <Container >
            <Typography variant="h4" my={3}>Bill History</Typography>
            <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: "20px" }}>
                {bills.map(b =>
                    <Paper key={b.id} variant="elevation" elevation={2} sx={{ gap: "20px", padding:"5px", display: "flex", flexDirection: "column", width: "100%", justifyContent: "center", alignItems: "flex-start", p: 1, backgroundColor: "white", }}>
                        <Box sx={{ gap: "20px", display: "flex", width: "99%", justifyContent: "center", alignItems: "flex-start", p: 1, backgroundColor: "white", }}>
                            {
                                b.billEntity.map((be, index) =>
                                    <Paper key={be.id} variant="outlined" sx={{ gap: "10px", display: "flex", alignItems: "center", flexDirection: "column", p: 1 }}>
                                        <Typography fontSize={17} fontWeight="500" variant="caption">{be.vendor.name.toUpperCase()}</Typography>
                                        <TableContainer>
                                            <Table sx={{ minWidth: "30vw" }}>
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell>Total</TableCell>
                                                        <TableCell align="right">{be.billGroupTotal}</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {
                                                        be.billGroup.map(g =>
                                                            <TableRow key={g.id}>
                                                                <TableCell>{dayjs().month(g.month).format('MMMM')}</TableCell>
                                                                <TableCell align="right">{g.billTotal}</TableCell>
                                                            </TableRow>
                                                        )
                                                    }
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                        <Button onClick={() => handleDownload({ id: b.id, index, name: be.vendor.name.toUpperCase() })} variant="contained">
                                            Download
                                        </Button>
                                    </Paper>
                                )
                            }
                        </Box>
                        <Box sx={{ display: "flex", minWidth: "300px", alignSelf: "stretch", justifyContent: "center", gap: "10px", p: 1 }}>
                            <Box sx={{ display: "flex", backgroundColor: "ghostwhite", padding: "8px", borderRadius: "5px", gap: "10px" }}>
                                <Typography fontSize={14} fontWeight={500}>Created On: &nbsp;</Typography>
                                <Typography fontSize={14} fontWeight={500}> {dayjs(b.created_at).format('DD/MMM/YYYY hh:mm A')}</Typography>
                            </Box>
                            <Button onClick={() => handleLoad(b.billJson)} variant="outlined">
                                Load
                            </Button>
                        </Box>
                    </Paper>
                )}
            </Box>
        </Container >
    );
}

export default History;
