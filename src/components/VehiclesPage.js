import React, { useEffect, useState } from "react";
import DirectionsCarOutlined from "@mui/icons-material/DirectionsCarOutlined";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Unstable_Grid2";
import axios from 'axios';
import { Button } from "@mui/material";

const VehiclesPage = () => {
  const [vehicles, setVehicles] = useState([]);
  const [isLazyLoadingPossible, setIsLazyLoadigPossible] = useState(true)
  const DISPLAY_PER_PAGE = 4
  let [currPage, setCurrPage] = useState(0)

  useEffect(() => {
    requestVehicles();
  }, []);

  const requestVehicles = () => {
    axios.get("http://localhost:8000/vehicles", { params: { limit: DISPLAY_PER_PAGE, offset: DISPLAY_PER_PAGE * currPage } })
        .then((response) => {
            const totalVehicles = [...vehicles, ...response.data.vehicles]
            setVehicles(totalVehicles)
            setCurrPage(currPage+1)
            if(totalVehicles.length === response.data.total){
              setIsLazyLoadigPossible(false)
            }
        }).catch((error) => {
            console.log(error)
        })
  }

  // From https://mui.com/material-ui/react-grid2/, section "Inheriting spacing"
  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: "center",
    color: theme.palette.text.secondary,
  }));

  return (
    <div>
      <h2>
        <DirectionsCarOutlined /> All Vehicles
      </h2>
      <Box>
        {vehicles.length ? (
          <Grid container xs={12} spacing={4}>
              {vehicles.map((row, index) => (
            <Grid xs={3}>
                <Item>
                  <Box key={index}>
                    <p>Vehicle #: {row.id}</p>
                    <p>
                      <b>{row.year} {row.colour} {row.make} {row.model}</b>
                    </p>
                    <p>{row.location_description}</p>
                  </Box>
                </Item>
            </Grid>
              ))}
          </Grid>
        ) : null}
      </Box>
      {
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
