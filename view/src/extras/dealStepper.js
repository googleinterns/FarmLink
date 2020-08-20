import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Surplus from "../components/surplus";
import FoodBanks from "../components/foodbanks";
import DealForm from "../extras/dealForm";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  button: {
    marginRight: theme.spacing(1),
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
}));

/** Defines the steps in the Stepper (each is a form) */
function getSteps() {
  return [
    "Select a Surplus Object",
    "Match with a Food Bank",
    "Fill out Deal Logistics",
  ];
}

export default function HorizontalLinearStepper(props) {
  const classes = useStyles();
  // Stepper states
  const [activeStep, setActiveStep] = React.useState(0);

  const steps = getSteps();

  /** Gets the content to display at each step */
  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return <Surplus inSurplus={true} alert={props.alert} />;
      case 1:
        return <FoodBanks inSurplus={true} alert={props.alert} />;
      case 2:
        return <DealForm alert={props.alert} />;
      default:
        return "Unknown step";
    }
  };

  /** Sets the last step (so formatting can change on last step) */
  const isLastStep = (step) => {
    return step === steps.length - 1;
  };

  /** Moves to the next step (page) in the Stepper */
  const handleNext = () => {
    // ADD AN IF STATEMENT TO ENSURE THAT SURPLUS CARD IS SELECTED BEFORE
    // MOVING ON

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  /** Moves to the previous step (page) in the Stepper */
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  /** Takes the user back to the first step */
  const handleReset = () => {
    setActiveStep(0);
  };

  return (
    <div className={classes.root}>
      <Stepper activeStep={activeStep}>
        {steps.map((label, index) => {
          const stepProps = {};
          const labelProps = {};
          if (isStepSkipped(index)) {
            stepProps.completed = false;
          }
          return (
            <Step key={label} {...stepProps}>
              <StepLabel {...labelProps}>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
      <div>
        <Button
          disabled={activeStep === 0}
          onClick={handleBack}
          className={classes.button}
        >
          Back
        </Button>
        <Button
          variant="contained"
          color="primary"
          align="right"
          onClick={handleNext}
          className={classes.button}
        >
          {isLastStep(activeStep) ? "Finish" : "Next"}
        </Button>
      </div>
      <div>
        {activeStep === steps.length ? (
          <div>
            <Typography className={classes.instructions}>
              All steps completed - you're finished
            </Typography>
            <Button onClick={handleReset} className={classes.button}>
              Reset
            </Button>
          </div>
        ) : (
          <div>
            <Typography className={classes.instructions}>
              {getStepContent(activeStep)}
            </Typography>
          </div>
        )}
      </div>
    </div>
  );
}
