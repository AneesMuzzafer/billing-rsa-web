import { INode } from "../state/nodeSlice";
import { BillData } from "../state/billSlice";
import { IRemark, IService } from "../state/serviceSlice";
import { IVendor } from "../state/vendorSlice";
import { ParsedTicket } from "../state/parsedLinks";
import dayjs from "dayjs";

export interface TicketObject {
    [key: string]: string;
}

export interface NetworkObject {
    [key: string]: string;
}

export const processCsv = async (csvFile: object): Promise<TicketObject[]> => {
    const promise = new Promise<TicketObject[]>((res, rej) => {
        let ticketArray: TicketObject[] = [];
        const reader = new FileReader();

        reader.readAsText(csvFile as Blob);
        reader.onload = (e) => {
            const data = e.target?.result?.toString();

            if (data) {
                const headers = data.slice(0, data.indexOf("\n")).replace(/['"]+/g, '').slice(0, -1).split(",");

                let count = 0;
                for (let i = 0; i < headers.length; i++) {

                    if (headers[i] !== "Description") {
                        continue;
                    } else {
                        if (count === 0) {
                            count++;
                            headers[i] = "Description"
                        } else {
                            headers[i] = "Remarks"
                        }
                    }
                }

                const rows = data?.slice(data.indexOf("\n") + 1, -1).split("\n");

                ticketArray = rows.map(row => {

                    const ticket: TicketObject = {};
                    const ticketFields = row.replace(/['"]+/g, '').split(",");
                    headers.forEach((header, index) => {
                        ticket[header] = ticketFields[index];
                    });
                    return ticket;
                });
            }

            res(ticketArray);
        }
    });
    return promise;
}

export const processNetworkCsv = async (csvFile: object): Promise<INode[]> => {
    const promise = new Promise<INode[]>((res, rej) => {
        let linkDataArray: INode[] = [];
        const reader = new FileReader();

        reader.readAsText(csvFile as Blob);
        reader.onload = (e) => {
            const data = e.target?.result?.toString();

            if (data) {
                const rows = data?.slice(data.indexOf("\n") + 1, -1).split("\n");

                linkDataArray = rows.map(row => {
                    const linkFields = row.replace(/['"]+/g, '').split(",");
                    return {
                        id: linkFields[0],
                        label: linkFields[1],
                        region: linkFields[2],
                        cps: linkFields[3]?.split(";").map(item => parseInt(item, 10)),
                        vendor: linkFields[4],
                        connectedLinks: linkFields[5] === "" ? [] : linkFields[5]?.split(";"),
                        alias: linkFields[6] === "\r" ? [] : linkFields[6]?.split(";"),
                    }
                });
            }

            res(linkDataArray);
        }
    });
    return promise;
}


export const processBillCsv = async (csvFile: object, vendors: IVendor[], nodes: INode[]): Promise<IService[]> => {

    const promise = new Promise<IService[]>((res, rej) => {
        let billDataArray: IService[] = [];
        const reader = new FileReader();

        reader.readAsText(csvFile as Blob);
        reader.onload = (e) => {
            const data = e.target?.result?.toString();

            if (data) {
                const rows = data?.slice(data.indexOf("\r\n") + 1, -1).split("\r\n");

                billDataArray = rows.map(row => {
                    const linkFields = row.replace(/['"]+/g, '').split(",");

                    return {
                        id: linkFields[0],
                        name: linkFields[1],
                        cpNumber: parseInt(linkFields[2]),
                        capacity: linkFields[3],
                        linkFrom: linkFields[4],
                        linkTo: linkFields[5],
                        doco: linkFields[6],
                        lastMile: linkFields[7],
                        annualInvoiceValue: parseFloat(linkFields[8]),
                        sharePercent: parseFloat(linkFields[9]),
                        discountOffered: parseFloat(linkFields[10]),
                        annualVendorValue: parseFloat(linkFields[11]),
                        unitRate: parseFloat(linkFields[12]),
                        totalPODays: parseInt(linkFields[13]),
                        vendor: vendors.find(v => {
                            return (v.id == (linkFields[14]));
                        }) ?? vendors[1],
                        node: nodes.find(n => n.id == (linkFields[15])) ?? nodes[1],
                        remarks: {} as IRemark[]
                    }
                });
            }

            res(billDataArray);
        }
    });
    return promise;
}

export const getStartEndTime = (parsedTickets: ParsedTicket[]) => {

    let lowest = parsedTickets[0].ticketStartedAt;
    let highest = parsedTickets[0].ticketResolvedAt;

    for (let i = 0; i < parsedTickets.length; i++) {
        if (parsedTickets[i].ticketStartedAt < lowest) {
            lowest = parsedTickets[i].ticketStartedAt;
        }
        if (parsedTickets[i].ticketResolvedAt > highest) {
            highest = parsedTickets[i].ticketStartedAt;
        }
    }

    return {
        start: (dayjs(lowest).month()).toString(),
        end: (dayjs(highest).month()).toString(),
    };
}

export const getStartEndTimeFromBill = (bill: BillData[]) => {
    const start = (bill[0].month).toString();
    const end = (bill[bill.length - 1].month.toString());

    return {
        start,
        end
    };
}
