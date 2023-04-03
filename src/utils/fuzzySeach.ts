import { TicketObject } from "./utils";
import { INode } from "../state/nodeSlice";
import Fuse from 'fuse.js'
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { ParsedTicket } from "../state/parsedLinks";

dayjs.extend(customParseFormat);

export const doFuzzySearch = (ticketArray: TicketObject[], links: INode[]) => {
    let id = 0;
    const fuse = new Fuse(links, {
        keys: ['label', 'alias'],
        includeScore: true
    });


    let parsedResult: ParsedTicket[] = [];
    ticketArray.forEach(ticket => {
        if (ticket.Title) {
            const clearedTitle = ticket.Title.replace(/ *\([^)]*\) */g, "");
            const parsedLinks = clearedTitle.split(/[-;/\\/]+/);

            const openingDate = dayjs(ticket["Opening date"], "DD-MM-YYYY HH:mm").valueOf();
            const closingDate = dayjs(ticket["Resolution date"], "DD-MM-YYYY HH:mm").valueOf();

            parsedLinks.forEach((link: string, index) => {

                const match = fuse.search(link.trim());
                if (match.length > 0 && match[0].score && match[0].score < 0.3) {
                    parsedResult.push({
                        id: id++,
                        linkname: link,
                        ticketDesc: ticket.Title,
                        category: ticket.Category,
                        completeMatch: true,
                        partialMatch: true,
                        ticketId: ticket.ID,
                        firstMatchRefIndex: match[0].refIndex,
                        ticketStartedAt: openingDate,
                        ticketResolvedAt: closingDate,
                        trafficAffected: true,
                        trafficAffectingStatusInTicket: !ticket.Description.toUpperCase().includes("{NO}"),
                        matches: parsedLinks.filter(l => l !== link)
                    });

                } else if (match.length > 0 && match[0].score && match[0].score > 0.3) {
                    parsedResult.push({
                        id: id++,
                        linkname: link,
                        ticketDesc: ticket.Title,
                        category: ticket.Category,
                        completeMatch: false,
                        partialMatch: true,
                        ticketId: ticket.ID,
                        firstMatchRefIndex: match[0].refIndex,
                        ticketStartedAt: openingDate,
                        ticketResolvedAt: closingDate,
                        trafficAffected: true,
                        trafficAffectingStatusInTicket: !ticket.Description.toUpperCase().includes("{NO}"),
                        matches: parsedLinks.filter(l => l !== link)
                    });
                } else {
                    parsedResult.push({
                        id: id++,
                        linkname: link,
                        ticketDesc: ticket.Title,
                        category: ticket.Category,
                        completeMatch: false,
                        partialMatch: false,
                        ticketId: ticket.ID,
                        firstMatchRefIndex: -1,
                        ticketStartedAt: openingDate,
                        ticketResolvedAt: closingDate,
                        trafficAffected: true,
                        trafficAffectingStatusInTicket: !ticket.Description.toUpperCase().includes("{NO}"),
                        matches: parsedLinks.filter(l => l !== link)
                    });
                }
            });
        }
    });

    return parsedResult;
}
