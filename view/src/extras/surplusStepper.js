import React from "react";

import { makeStyles } from "@material-ui/core/styles";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import FarmForm from "../extras/farmForm";
import ProduceForm from "../extras/produceForm";
import SurplusForm from "../extras/surplusForm";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  button: {
    marginRight: theme.spacing(1),
    color: theme.palette.primary.contrastText,
    backgroundColor: theme.palette.primary.dark,
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
}));

/** Defines the steps in the Stepper (each is a form) */
function getSteps() {
  return [
    "Create a Farm",
    "Create a Produce Object",
    "Create a Surplus Object",
  ];
}

export default function SurplusStepper(props) {
  const classes = useStyles();
  // stepper states
  const [activeStep, setActiveStep] = React.useState(0);
  const [skipped, setSkipped] = React.useState(new Set());
  // form states (relevant to the final step - surplus form)
  const [currentFarm, setCurrentFarm] = React.useState({});
  const [currentProduce, setCurrentProduce] = React.useState({});

  const steps = getSteps();

  /** Gets the content to display at each step */
  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <FarmForm
            // props needed for the Stepper
            activeStep={activeStep}
            handleBack={handleBack}
            isStepOptional={isStepOptional}
            handleSkip={handleSkip}
            handleNext={handleNext}
            steps={steps}
            // props needed for the forms 
            setFarm={setCurrentFarm}
            alert={props.alert}
            buttonType={props.buttonType}
            farmId={props.farmId}
          />
        );
      case 1:
        return (
          <ProduceForm
          // props needed for the Stepper
            activeStep={activeStep}
            handleBack={handleBack}
            isStepOptional={isStepOptional}
            handleSkip={handleSkip}
            handleNext={handleNext}
            steps={steps}
            // props needed for the forms 
            setProduce={setCurrentProduce}
            alert={props.alert}
            buttonType={props.buttonType}
            produceId={props.produceId}
          />
        );
      case 2:
        return (
          <SurplusForm
            // props needed for the Stepper
            activeStep={activeStep}
            handleBack={handleBack}
            isStepOptional={isStepOptional}
            handleSkip={handleSkip}
            handleNext={handleNext}
            steps={steps}
            // props needed for the forms
            surplusId={props.surplusId}
            currentFarm={currentFarm}
            currentProduce={currentProduce}
            alert={props.alert}
            buttonType={props.buttonType}
          />
        );
      default:
        return "Unknown step";
    }
  };

  /** Sets which steps are optional (can be skipped) */
  const isStepOptional = (step) => {
    return step === 1 || step === 0;
  };

  /** Sets the last step (so formatting can change on last step) */
  const isLastStep = (step) => {
    return step === 2;
  };

  /** Determines whether a step has been skipped */
  const isStepSkipped = (step) => {
    return skipped.has(step);
  };

  /** Moves to the next step (page) in the Stepper */
  const handleNext = () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  /** Moves to the previous step (page) in the Stepper */
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  /** Skips the current step (page) in the Stpper */
  const handleSkip = () => {
    if (!isStepOptional(activeStep)) {
      // You probably want to guard against something like this,
      // it should never occur unless someone's actively trying to break something.
      throw new Error("You can't skip a step that isn't optional.");
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped((prevSkipped) => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStep);
      return newSkipped;
    });
  };

  /** Jumps to the last page (surplus form) */
  const jumpToSurplus = () => {
    setActiveStep(steps.length - 1);
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
          if (isStepOptional(index)) {
            labelProps.optional = (
              <Typography variant="caption">Optional</Typography>
            );
          }
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
            <div>
              {!isLastStep(activeStep) && (
                <Button
                  variant="contained"
                  onClick={jumpToSurplus}
                  className={classes.button}
                >
                  Jump to Surplus
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}