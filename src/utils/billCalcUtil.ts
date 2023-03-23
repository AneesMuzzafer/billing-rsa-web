import dayjs from "dayjs";
import { billTable } from "../screens/BillDataTable";
import { BillData, DownTime } from "../state/billSlice";
import { IBill, IBillGroup, IMonthBill } from "../state/historySlice";
import { IVendor } from "../state/vendorSlice";
import { formatInHours, getSlab } from "./downTimeCSV";

export const roundToTwo = (num: number) => Math.round((num + Number.EPSILON) * 100) / 100;
export const roundToFour = (num: number) => Math.round((num + Number.EPSILON) * 10000) / 10000;

export const calculateDownTime = (downTimeArray: DownTime[]) => {
    let downTime: number;
    if (downTimeArray.length > 0) {
        if (downTimeArray.length === 1 && downTimeArray[0].downtime < 3600000) {
            return 0;
        }
        if (downTimeArray.length === 2 && (downTimeArray[0].downtime + downTimeArray[1].downtime) < 7200000) {
            return 0;
        }
        downTime = downTimeArray.reduce((p, c) => p + c.downtime, 0);
        if (downTime) {
            return downTime;
        } else {
            return 0;
        }
    } else {
        return 0;
    }

}

export const calculateUptimePercent = (totalDowntime: number, days: number) => roundToFour(((days * 24 * 60) - (totalDowntime / 60000)) / (days * 24 * 60));

export const getPenaltySlab = (uptimePercent: number, linkType: string) => {

    if (linkType === "UG") {
        if (uptimePercent >= 0.995) {
            return 0;
        } else if (uptimePercent < 0.995 && uptimePercent >= 0.99) {
            return 1;
        } else if (uptimePercent < 0.99 && uptimePercent >= 0.98) {
            return 2;
        } else if (uptimePercent < 0.98 && uptimePercent >= 0.97) {
            return 3;
        } else if (uptimePercent < 0.97 && uptimePercent >= 0.96) {
            return 4;
        } else if (uptimePercent < 0.96 && uptimePercent >= 0.95) {
            return 5;
        } else if (uptimePercent < 0.95 && uptimePercent >= 0.90) {
            return 6;
        } else if (uptimePercent < 0.90) {
            return 7;
        } else {
            return -1;
        }
    } else if (linkType === "OH") {
        if (uptimePercent >= 0.995) {
            return 0;
        } else if (uptimePercent < 0.995 && uptimePercent >= 0.99) {
            return 1;
        } else if (uptimePercent < 0.99 && uptimePercent >= 0.98) {
            return 2;
        } else if (uptimePercent < 0.98 && uptimePercent >= 0.97) {
            return 3;
        } else if (uptimePercent < 0.97 && uptimePercent >= 0.96) {
            return 4;
        } else if (uptimePercent < 0.96 && uptimePercent >= 0.95) {
            return 5;
        } else if (uptimePercent < 0.95 && uptimePercent >= 0.90) {
            return 6;
        } else if (uptimePercent < 0.90) {
            return 7;
        } else {
            return -1;
        }
    } else {
        return -1;

    }
}

export const calculateDowntimePenalty = (penaltySlab: number, downtime: number) => {
    switch (penaltySlab) {
        case 0:
            return roundToTwo((downtime / 3600000) * 1);
        case 1:
            return roundToTwo((downtime / 3600000) * 1.25);
        case 2:
            return roundToTwo((downtime / 3600000) * 1.5);
        case 3:
            return roundToTwo((downtime / 3600000) * 1.75);
        case 4:
            return roundToTwo((downtime / 3600000) * 2);
        case 5:
            return roundToTwo((downtime / 3600000) * 2.25);
        case 6:
            return roundToTwo((downtime / 3600000) * 2.5);
        case 7:
            return roundToTwo((downtime / 3600000) * 3);
        default:
            return 0;
    }
}

export const calculateAmount = (penalty: number, unitRate: number, days: number) => roundToTwo((unitRate / 24) * ((days * 24) - penalty));

export const createBillArray = (billData: BillData[]) => {
    const arr: billTable[] = billData.map((b, i) => {
        const downtime = calculateDownTime(b.downtimes);
        const uptimePercent = calculateUptimePercent(downtime, b.numberOfDays);
        const penaltySlab = getPenaltySlab(uptimePercent, b.service.lastMile);
        const penaltyHours = calculateDowntimePenalty(penaltySlab, downtime);
        const penaltyAmount = roundToTwo((b.service.unitRate / 24) * (penaltyHours));
        const amount = calculateAmount(penaltyHours, b.service.unitRate, b.numberOfDays);

        return {
            id: b.id,
            index: (i + 1).toString(),
            name: b.service.name,
            cpNumber: b.service.cpNumber,
            lastMile: b.service.lastMile,
            capacity: b.service.capacity,
            linkFrom: b.service.linkFrom,
            linkTo: b.service.linkTo,
            doco: b.service.doco,
            annualInvoiceValue: b.service.annualInvoiceValue,
            sharePercent: b.service.sharePercent,
            discountOffered: b.service.discountOffered,
            annualVendorValue: b.service.annualVendorValue,
            unitRate: b.service.unitRate,
            numberOfDays: b.numberOfDays,
            downtime: formatInHours(downtime),
            uptimePercent,
            penaltySlab: getSlab(penaltySlab),
            penaltyHours,
            penaltyAmount,
            amount,
        }
    });
    return arr;
}

export const getBillObject = (billData: BillData[], vendors: IVendor[], months: number[]) => {

    const entity: IBill = {
        id: months.toString() + "_" + dayjs().unix(),
        billEntity: [] as IBillGroup[],
        billJson: billData,
        created_at: "",
    }

    vendors.forEach((v, v_i) => {
        const group = {
            id: v.name + "_" + months.toString() + "_" + dayjs().unix(),
            vendor: v,
            billGroup: [] as IMonthBill[],
            billGroupTotal: 0
        }

        months.forEach((m, m_i) => {
            const data = billData.filter(item => (item.month === m && item.service.vendor.id === v.id));
            const table = createBillArray(data);

            group.billGroup.push({
                id: v.name + "_" + m + "_" + dayjs().unix(),
                month: m,
                billTable: table,
                billTotal: roundToTwo(table.reduce((p, c) => p + c.amount, 0)),
            });

        })

        group.billGroupTotal = roundToTwo(group.billGroup.reduce((p, c) => p + c.billTotal, 0));
        entity.billEntity.push(group);
    })

    return entity;
}
