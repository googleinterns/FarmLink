import React from "react";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import CircularProgress from "@material-ui/core/CircularProgress";
import axios from "axios";
import { authMiddleWare } from "../util/auth";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import CardContent from "@material-ui/core/CardContent";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import Container from "@material-ui/core/Container";
import Skeleton from "@material-ui/lab/Skeleton";

export default function CardSkeleton(props) {
  console.log(props.padding);
  return (
    <Container maxWidth="lg">
      <Grid container spacing={2} alignItem="center">
        {!props.noPadding && (
          <Grid item xs={12}>
            <div style={{ height: "50px" }}></div>
          </Grid>
        )}
        <Grid item xs={12}>
          <Skeleton animation="wave" height="50px" width="100%" />
        </Grid>
        <Grid item xs={12} height="50px"></Grid>
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
                    <Skeleton width="250px" />
                    <br />
                    <Skeleton width="250px" />
                    <br />
                    <Skeleton width="250px" />
                  </Typography>
                </Box>
                <Box p={3}>
                  <Typography variant="body2" component="p">
                    <Skeleton width="250px" />
                    <br />
                    <Skeleton width="250px" />
                    <br />
                    <Skeleton width="250px" />
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
