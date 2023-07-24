import React, { useEffect, useState } from "react";

import { Button } from "@mui/material";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import DirectionsCarOutlined from "@mui/icons-material/DirectionsCarOutlined";
import Grid from "@mui/material/Unstable_Grid2";
import Paper from "@mui/material/Paper";

import axios from 'axios';

const VehiclesPage = () => {
  const [vehicles, setVehicles] = useState([]);
  const [isLazyLoadingPossible, setIsLazyLoadigPossible] = useState(true)
  // keep it in env so that we can update it anytime we want.
  const DISPLAY_PER_PAGE = 4
  let [currPage, setCurrPage] = useState(0)

  const SERVER_URL = process.env.REACT_APP_SERVER_URL;

  useEffect(() => {
    requestVehicles();
  }, []);

  const requestVehicles = () => {
    // Checking user info with email and secret_key before requesting GET for vehicles
    let session = localStorage.getItem("session");
    let pasredSession = JSON.parse(session)
    const headers = {
      "email": pasredSession.email,
      "secret_key": pasredSession.secret_key
    };

    axios.get(`${SERVER_URL}/vehicles`, {
      // Preventing app from crashing if there is too much data in 'Database - Vehicles Table.csv' by limiting it to display 4(DISPLAY_PER_PAGE) at a time
      params: { limit: DISPLAY_PER_PAGE, offset: DISPLAY_PER_PAGE * currPage },
      headers: headers
    })
      .then((response) => {
        // To check whether to enable "LOAD MORE" button if there is still remaining data to show in 'Database - Vehicles Table.csv'
        const totalVehicles = [...vehicles, ...response.data.vehicles];
        setVehicles(totalVehicles);
        setCurrPage(currPage + 1);
        // If all data in 'Database - Vehicles Table.csv' is shown, disable "LOAD MORE" button
        if (totalVehicles.length === response.data.total) {
          setIsLazyLoadigPossible(false);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };


  // Retrieved from https://mui.com/material-ui/react-grid2/, section "Inheriting spacing"
  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: "center",
  }));

  return (
    <div>
      <h2>
        <DirectionsCarOutlined /> All Vehicles
      </h2>
      <hr />
      <Box>
        {vehicles.length ? (
          // Displaying 4 responsive grid per row
          <Grid container xs={12} spacing={4} margin={1}>
            {vehicles.map((row, index) => (
              <Grid xs={3}>
                <Item>
                  <Box key={index}>
                    <p className="p_top">Vehicle #: {row.id}</p>
                    <p className="p_mid">
                      <b>
                        {row.year} {row.colour} {row.make} {row.model}
                      </b>
                    </p>
                    <p className="p_bottom">{row.location_description}</p>
                  </Box>
                </Item>
              </Grid>
            ))}
          </Grid>
        ) : null}
      </Box>
      {
        // Again, "LOAD MORE" button will be disabled once all data has been loaded 
        isLazyLoadingPossible && (
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            onClick={requestVehicles}

          >
            Load More
          </Button>
        )
      }
    </div>

  );
};

export default VehiclesPage;
