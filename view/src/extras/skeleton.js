import React from "react";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import CardContent from "@material-ui/core/CardContent";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import Container from "@material-ui/core/Container";
import Skeleton from "@material-ui/lab/Skeleton";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  search: {
    height: "48px",
    width: "100%"
  },
  skeletonPadding: {
    height: "48px"
  }
}));

/**
 * Creates a skeleton card that looks like the cards populated with information
 * from the database. These skeletons can replace the circular loading dial. Check
 * out material design cards for more information. 
 */
export default function CardSkeleton(props) {
  // Styling for the card skeleton
  const classes = useStyles();
  const paddingHeight = "48px";
  const textWidth = "250px"

  return (
    <Container maxWidth="lg">
      <Grid container spacing={2} alignItem="center">
        <Grid item xs={12}>
          <div className={classes.skeletonPadding}></div>
        </Grid>
        <Grid item xs={12}>
          <Skeleton animation="wave" className={classes.search} />
        </Grid>
        <Grid item xs={12} height={paddingHeight}></Grid>
        <Grid item xs={12}>
          <Card className={props.classes.root} variant="outlined">
            <CardContent>
              <Typography variant="h2" component="h2">
                <Skeleton />
              </Typography>
              <Box
                display="flex"
                flexDirection="row"
                flexWrap="wrap"
                p={0}
                m={0}
              >
                <Box p={3}>
                  <Typography variant="body2" component="p">
                    <Skeleton width={textWidth} />
                    <br />
                    <Skeleton width={textWidth} />
                    <br />
                    <Skeleton width={textWidth} />
                  </Typography>
                </Box>
                <Box p={3}>
                  <Typography variant="body2" component="p">
                    <Skeleton width={textWidth} />
                    <br />
                    <Skeleton width={textWidth} />
                    <br />
                    <Skeleton width={textWidth} />
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}
