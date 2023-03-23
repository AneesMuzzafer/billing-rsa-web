import React from "react";
import { Button, Chip, Container, Paper, Typography } from "@mui/material";
import TicketMapRow from "../components/TicketMapRow";
import { useAppDispatch, useAppSelector } from "../state/hook";
import { ParsedTicket, updateCompleteFlag, updateOneTicket } from "../state/parsedLinks";
import { Box } from "@mui/system";
import { useNavigate } from "react-router-dom";
import StepperComponent from "../components/StepperComponent";
import useTheme from "@mui/material/styles/useTheme";
import { addAliases } from "../state/nodeSlice";

const MapTickets = () => {

    const parsedLinks = useAppSelector(state => state.parsedTickets);
    const [stage, setStage] = React.useState("matched");

    const completeMatchedLinks = parsedLinks.filter(l => l.partialMatch && l.completeMatch);
    const partialMatchedLinks = parsedLinks.filter(l => l.partialMatch && !l.completeMatch);
    const unmatchedLinks = parsedLinks.filter(l => !l.partialMatch && !l.completeMatch);

    const [linkArray, setLinkArray] = React.useState<ParsedTicket[]>(completeMatchedLinks);

    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const theme = useTheme();

    const handleSelect = (ticket: ParsedTicket, newRefIndex: number) => {
        dispatch(updateOneTicket({ ticket, networkIndex: newRefIndex }));
        setLinkArray(p => {
            let index = p.indexOf(ticket);
            p[index] = { ...p[index], completeMatch: true }
            return p
        });
    }

    // const networkArray = useAppSelector(state => state.links);

    // React.useEffect(() => {
    //     partialMatchedLinks.forEach(parsedLink => {
    //         parsedLink.matches.forEach(otherLink => {
    //             if (completeMatchedLinks.find(cl => cl.linkname === otherLink)) {
    //                 let foundLink = completeMatchedLinks.find(cl => cl.linkname === otherLink);
    //                 if (foundLink) {
    //                     let arr = networkArray[foundLink?.firstMatchRefIndex].connectedLinks;
    //                     if (arr) {
    //                         const res = doFuseAgain(arr, parsedLink.linkname);

    //                     }
    //                 }
    //             }
    //         })
    //     })
    // }, []);

    React.useEffect(() => {
        if (stage === "partial" && partialMatchedLinks.length === 0) {
            setLinkArray(unmatchedLinks);
            setStage("unmatched");
        }
        if (stage === "unmatched" && unmatchedLinks.length === 0) {
            navigate("/traffic");
        }
    }, [stage, navigate, partialMatchedLinks, unmatchedLinks]);

    const handleUpdate = () => {
        let flag: boolean;
        switch (stage) {
            case "matched":
                flag = true;
                linkArray.forEach(l => {
                    if (!l.completeMatch) {
                        flag = false;
                    }
                });
                if (!flag) break;
                dispatch(updateCompleteFlag(completeMatchedLinks));
                setLinkArray(partialMatchedLinks);
                setStage("partial");
                break;
            case "partial":

                flag = true;
                linkArray.forEach(l => {
                    if (!l.completeMatch) {
                        flag = false;
                    }
                });
                // if (!flag) {
                //     alert("Match All links first");
                //     break;
                // };
                dispatch(updateCompleteFlag(partialMatchedLinks));
                dispatch(addAliases(partialMatchedLinks));
                setLinkArray(unmatchedLinks);
                setStage("unmatched");
                break;
            case "unmatched":
                flag = true;
                linkArray.forEach(l => {
                    if (!l.completeMatch) {
                        flag = false;
                    }
                });
                if (!flag) {
                    alert("Match All links first");
                    break;
                };
                dispatch(updateCompleteFlag(unmatchedLinks));
                dispatch(addAliases(unmatchedLinks));
                navigate("/traffic");
                break;
        }
    }

    const renderTable = () => {
        switch (stage) {
            case "matched":
                return (
                    <Box sx={{ maxHeight: "70vh", overflowY: "scroll" }}>
                        <Paper sx={{ backgroundColor: theme.palette.primary.main, padding: 2, color: "white" }}>
                            <Typography >Matched Links</Typography>
                        </Paper>
                        {completeMatchedLinks.map((link, index) =>
                            <TicketMapRow key={index} thisTicket={link} onSelect={handleSelect} />
                        )}
                    </Box >
                )
            case "partial":
                return (
                    <Box sx={{ maxHeight: "75vh", overflowY: "scroll" }}>
                        <Paper sx={{ backgroundColor: theme.palette.primary.main, padding: 2, color: "white" }}>
                            <Typography>Partially Matched Links</Typography>
                        </Paper>
                        {partialMatchedLinks.map((link, index) =>
                            <TicketMapRow key={index} thisTicket={link} onSelect={handleSelect} />
                        )}
                    </Box >
                )
            case "unmatched":
                return (
                    <Box sx={{ maxHeight: "75vh", overflowY: "scroll" }}>
                        <Paper sx={{ backgroundColor: theme.palette.primary.main, padding: 2, color: "white" }}>
                            <Typography>Unmatched Links</Typography>
                        </Paper>
                        {unmatchedLinks.map((link, index) =>
                            <TicketMapRow key={index} thisTicket={link} onSelect={handleSelect} unmatched />
                        )}
                    </Box >
                )
        }
    }

    return (
        <Container sx={{ display: "flex", flexDirection: "column" }}>
            <StepperComponent step={1} />
            <Paper sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: 1, marginBottom: 3 }}>
                <Typography variant="button">Total Links = <Chip label={parsedLinks.length} /></Typography>
                <Typography variant="button">Total Links Matched = <Chip label={completeMatchedLinks.length} /></Typography>
                <Typography variant="button">Total Links Partially Matched = <Chip label={partialMatchedLinks.length} /></Typography>
                <Typography variant="button">Total Links UnMatched = <Chip label={unmatchedLinks.length} /></Typography>
                <Button variant="contained" sx={{ width: 20 }} onClick={handleUpdate}>Update</Button>
            </Paper>
            {renderTable()}
        </Container >
    );
}

export default MapTickets;
