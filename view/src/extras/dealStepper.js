import React, { useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import FarmForm from "../extras/farmForm";
import ProduceForm from "../extras/produceForm";
import SurplusForm from "../extras/surplusForm";
import Alert from "../extras/alert";
import Surplus from "../components/surplus";
import FoodBanks from "../components/foodbanks";
import DealForm from "../extras/dealForm";


const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  button: {
    marginRight: theme.spacing(1),
    // color: theme.palette.primary.contrastText,
    // backgroundColor: theme.palette.primary.dark,
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
}));

function getSteps() {
  return [
    "Select a Surplus Object",
    "Match with a Food Bank",
    "Fill out Deal Logistics",
  ];
}

// function getStepContent(step) {
//   switch (step) {
//     case 0:
//       return <FarmForm />
//     case 1:
//       return 'Create a Produce Object';
//     case 2:
//       return 'Create a Surplus Object';
//     default:
//       return 'Unknown step';
//   }
// }

export default function HorizontalLinearStepper(props) {
  const classes = useStyles();
  const [activeStep, setActiveStep] = React.useState(0);
  const [skipped, setSkipped] = React.useState(new Set());
  const [currentFarm, setCurrentFarm] = React.useState("");
  const [currentProduce, setCurrentProduce] = React.useState("");

  const steps = getSteps();

  const farmRef = useRef();

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return <Surplus main={false} alert={props.alert} />;
      case 1:
        return (
          <FoodBanks main={false} alert={props.alert}/>
        );
      case 2:
        return (
          <DealForm
            alert={props.alert}
          />
        );
      default:
        return "Unknown step";
    }
  };

  const isStepOptional = (step) => {
    return false;
  };

  const isLastStep = (step) => {
    return step === 2;
  };

  const isStepSkipped = (step) => {
    return skipped.has(step);
  };

  const handleSubmit = (step) => {
    if (step === 0) {
      // farmRef.current.handleSubmit();
      //   console.log("not at all in the main frame");
      // setFarmSubmit(true);
      // for(let i = 0; i < 100000; i++) {}
      // console.log(farmSubmit);
      //farmRef.current.toSubmit();
    }
  };

  const handleNext = () => {
    //handleSubmit(activeStep);
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    // confirm that selected (update later)
    if (false) {
      props.alert("warning", "Please select a Surplus Object to continue.");
      return;
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

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

  const jumpToSurplus = () => {
    setActiveStep(steps.length - 1);
  };

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

          {activeStep === steps.length - 1 ? "Finish" : "Next"}
        </Button>
      </div>
      <div>
        {activeStep === steps.length ? (
          <div>
            <Typography className={classes.instructions}>
              All steps completed - you&apos;re finished
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
            {/* <div>
              {!isLastStep(activeStep) && (
                <Button
                  variant="contained"
                  onClick={jumpToSurplus}
                  className={classes.button}
                >
                  Jump to Surplus
                </Button>
              )}
            </div> */}
            {/* <div>
              <Button
                disabled={activeStep === 0}
                onClick={handleBack}
                className={classes.button}
              >
                Back
              </Button>
              {isStepOptional(activeStep) && (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSkip}
                  className={classes.button}
                >
                  Skip
                </Button>
              )}

              <Button
                variant="contained"
                color="primary"
                onClick={handleNext}
                className={classes.button}
              >
                {activeStep === steps.length - 1 ? "Finish" : "Next"}
              </Button>
            </div> */}
          </div>
        )}
      </div>
    </div>
  );
}
