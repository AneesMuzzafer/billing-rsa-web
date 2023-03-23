import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import { Box } from '@mui/system';

const steps = ["Upload Ticket CSV", 'Match tickets to Nodes', 'Select links with traffic affected', "Make any changes before export"];

const StepperComponent: React.FC<{ step: 0 | 1 | 2 | 3, completed?: boolean }> = ({ step = 0, completed = false }) => {

    const getCompleted = (fromStep: number) => {
        if (step === fromStep)
            return completed;
        if (step > fromStep)
            return true;
        if (step < fromStep)
            return false;
    }

    return (
        <Box sx={{ height: 20, paddingY: 5 }}>
            <Stepper activeStep={step}>
                <Step completed={getCompleted(0)}>
                    <StepLabel >{steps[0]}</StepLabel>
                </Step>
                <Step completed={getCompleted(1)}>
                    <StepLabel >{steps[1]}</StepLabel>
                </Step>
                <Step completed={getCompleted(2)}>
                    <StepLabel >{steps[2]}</StepLabel>
                </Step>
                <Step completed={getCompleted(3)}>
                    <StepLabel >{steps[3]}</StepLabel>
                </Step>
            </Stepper>
        </Box>
    );
}

export default StepperComponent;