import React from "react";
import dayjs from "dayjs";
import { Container } from "@mui/material";
import { BillData, setBillItems } from "../state/billSlice";
import { useAppDispatch, useAppSelector } from "../state/hook";
import { IVendor } from "../state/vendorSlice";
import BillDataEditor from "./BillDataEditor";
import BillDataTable from "./BillDataTable";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { Box } from "@mui/system";
import { getBillObject } from "../utils/billCalcUtil";
import { History } from "../api";
import { useParams } from "react-router-dom";
import LoadingButton from "@mui/lab/LoadingButton";

const BillView = () => {
    const dispatch = useAppDispatch();
    const params = useParams();
    const action = params?.action;

    const vendors = useAppSelector(state => state.vendors.vendors);
    const parsedTickets = useAppSelector(state => state.parsedTickets);
    const network = useAppSelector(state => state.nodes.nodes);
    const services = useAppSelector(state => state.services.services);
    const billState = useAppSelector(state => state.billItems.billItems);
    const history = useAppSelector(state => state.history);
    const { startMonth, endMonth } = useAppSelector(state => state.settings);

    const months = Array.from(Array(parseInt(endMonth) - parseInt(startMonth) + 1).keys()).map(m => m + parseInt(startMonth));

    const [vendor, setVendor] = React.useState<IVendor>(vendors[0]);
    const [month, setMonth] = React.useState<number>(months[0]);
    const [isEdit, setIsEdit] = React.useState(false);
    const [editId, setEditId] = React.useState(services[0].cpNumber + "_" + startMonth);

    React.useEffect(() => {

        if (action === "create") {
            const billItemArray: BillData[] = [];
            months.forEach((m) => {
                services.forEach((s, i) => {
                    billItemArray.push({
                        id: s.cpNumber + "_" + m,
                        service: s,
                        month: m,
                        numberOfDays: dayjs().month(m).daysInMonth(),
                        downtimes: [],
                    })
                })
            })

            parsedTickets.forEach((ticket) => {
                const ticketNodeID = network[ticket.firstMatchRefIndex].id;
                const month = dayjs(ticket.ticketResolvedAt).month();

                billItemArray.forEach(item => {
                    if (item.service.node.id === ticketNodeID && item.month === month) {
                        if(ticket.trafficAffected) {
                            item.downtimes.push({
                                id: ticket.id,
                                startedAt: ticket.ticketStartedAt,
                                resolvedAt: ticket.ticketResolvedAt,
                                downtime: ticket.ticketResolvedAt - ticket.ticketStartedAt,
                            })
                        }
                    }
                })
            });
            dispatch(setBillItems(billItemArray))
        }
    }, []);

    const onExpand = (id: string) => {
        setEditId(id);
        setIsEdit(true);
    }

    const handleSave = () => {
        const bill = getBillObject(billState, vendors, months);
        dispatch(History.createBill(bill));
    }

    return (
        <>
            <Container>
                <Box sx={{ display: "flex", justifyContent: "center", marginTop: "10px" }} >
                    <LoadingButton loading={history.loading} onClick={handleSave} variant="contained">Save</LoadingButton>
                </Box>
            </Container>
            <Box sx={{ paddingX: "5%" }}>
                <Box>
                    <Tabs value={vendor} onChange={(_, v) => setVendor(v)}>
                        {
                            vendors.map((v, i) => (
                                <Tab key={i} label={v.name} value={v} />
                            ))
                        }
                    </Tabs>
                </Box>
                <Box sx={{}}>
                    <Tabs value={month} onChange={(_, v) => setMonth(parseInt(v))} centered>
                        {
                            months.map((m, i) => (
                                <Tab key={i} label={dayjs().month(m).format('MMMM')} value={m} />
                            ))
                        }
                    </Tabs>
                </Box>
            </Box>
            {
                !isEdit ?
                    <BillDataTable vendor={vendor} month={month} onExpand={onExpand} />
                    : <BillDataEditor id={editId} onUpdate={() => setIsEdit(false)} />
            }
        </>
    );
}

export default BillView;
