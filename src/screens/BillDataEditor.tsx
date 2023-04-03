import { Chip, Container, Paper, TextField, Typography, Box, Button } from "@mui/material";
import React from "react";
import { useAppDispatch, useAppSelector } from "../state/hook";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider, DesktopDateTimePicker } from '@mui/x-date-pickers'
// import DateAdapter from '@mui/lab/AdapterDayjs';
// import LocalizationProvider from '@mui/lab/LocalizationProvider';
// import DesktopDateTimePicker from '@mui/lab/DesktopDateTimePicker';
// import { DesktopDateTimePicker } from '@mui/x-date-pickers';
import { DownTime, updateOne } from "../state/billSlice";
import { roundToTwo } from "../utils/billCalcUtil";
import dayjs from 'dayjs';

interface IBillEditProps {
    id: string;
    onUpdate: () => void;
};

const BillDataEditor: React.FC<IBillEditProps> = ({ id, onUpdate }) => {
    const dispatch = useAppDispatch();
    const bill = useAppSelector(state => state.billItems.billItems).find(b => b.id === id);

    const [days, setDays] = React.useState(bill?.numberOfDays || 0);
    const [dt, setDt] = React.useState<DownTime[]>([...(bill?.downtimes ?? [])]);

    const total = roundToTwo((dt.reduce((p, c) => p + c.downtime, 0)) / 3600000);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        let value = parseInt(e.target.value);
        if (value >= 0) {
            setDays(value);
        } else {
            setDays(0);
        }
    }

    const handleTimeChange = (newValue: Date | null, at: string, index: number) => {
        if (at === "s" && newValue) {
            setDt(p => {
                let prev = JSON.parse(JSON.stringify(p));
                prev[index].startedAt = newValue.valueOf();
                prev[index].downtime = prev[index].resolvedAt - prev[index].startedAt;
                return prev;
            });
        } else if (at === "r" && newValue) {
            setDt(p => {
                let prev = JSON.parse(JSON.stringify(p));
                prev[index].resolvedAt = newValue.valueOf();
                prev[index].downtime = prev[index].resolvedAt - prev[index].startedAt;
                return prev;
            });
        }
    }

    const handleAdd = () => setDt(p => [...p, { id: -1, startedAt: new Date().valueOf(), resolvedAt: new Date().valueOf(), downtime: 0 }]);

    const handleDelete = (index: number) => setDt(p => p.filter((_, i) => i !== index));

    const handleSave = () => {
        dispatch(updateOne({ id, days, dt }));
        onUpdate();
    }

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Container sx={{ paddingTop: 5 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography variant="h5" sx={{ color: "darkturquoise", textDecorationLine: "underline", marginBottom: 2 }}>{bill?.service.name}</Typography>
                    <Button variant="contained" onClick={handleSave}>Update</Button>
                </Box>
                <Paper sx={{ display: "flex", justifyContent: "flex-start", flexDirection: 'column', alignItems: "flex-start", padding: 2, margin: 2 }}>
                    <Typography variant="button">CP No: {bill?.service.cpNumber}</Typography>
                    <Typography variant="button">Link Detail: {bill?.service.linkFrom} - {bill?.service.linkTo}</Typography>
                    <Typography variant="button">Unit Rate: {bill?.service.unitRate}</Typography>
                    <Typography variant="button">Link Type: {bill?.service.lastMile}</Typography>
                    <Typography variant="button">Total: {total} Hours</Typography>
                </Paper>
                <Box>
                    <TextField label="No. of Days" variant="outlined" sx={{ marginY: 5 }} value={days} onChange={(e: any) => handleChange(e)} />
                </Box>
                <Typography variant="overline">Downtimes</Typography>
                {
                    dt.map((downtime, index) => (
                        <div key={index}>
                            <Paper
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    p: 1,
                                    my: 2,
                                }}
                                variant="elevation"
                                component="ul">
                                <Box sx={{ width: "70%", display: "flex", alignItems: "center" }}>
                                    <Chip label={index + 1} color="primary" variant="outlined" sx={{ fontWeight: "bold", marginRight: 2 }} />
                                    <Box sx={{ marginX: 2 }}>
                                        <DesktopDateTimePicker
                                            label="Started At"
                                            value={dayjs(downtime.startedAt)}
                                            onChange={(newValue: any) => handleTimeChange(newValue, "s", index)}
                                            slotProps={{ textField: { variant: 'outlined' } }}
                                            // renderInput={(params: any) => <TextField {...params} />}
                                        />
                                    </Box>
                                    <Box sx={{ marginX: 2 }}>
                                        <DesktopDateTimePicker
                                            label="Resolved At"
                                            value={dayjs(downtime.resolvedAt)}
                                            slotProps={{ textField: { variant: 'outlined' } }}
                                            onChange={(newValue: any) => handleTimeChange(newValue, "r", index)}
                                            // renderInput={(params: any) => <TextField {...params} />}
                                        />
                                    </Box>
                                    <Chip label={roundToTwo((downtime.downtime / 3600000)) + " hours"} color="primary" variant="outlined" sx={{ fontWeight: "bold", marginRight: 2 }} />
                                </Box>
                                <Box>
                                    <Button onClick={() => handleDelete(index)} variant="outlined">Delete</Button>
                                </Box>
                            </Paper>
                        </div>
                    ))
                }
                <Button onClick={handleAdd}> + Add downtime</Button>
            </Container>
        </LocalizationProvider >
    );
}

export default BillDataEditor;
