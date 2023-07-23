import React, { useEffect, useState } from "react";
import DirectionsCarOutlined from "@mui/icons-material/DirectionsCarOutlined";
import VehiclesData from "../csv/vehicles.csv";
import Papa from "papaparse";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Unstable_Grid2";
import axios from 'axios';

const VehiclesPage = () => {
  const [vehicles, setVehicles] = useState([]);

//   useEffect(() => {
//     const fetchVehicles = async () => {
//       const response = await fetch(VehiclesData);
//       const reader = response.body.getReader();
//       const data = await reader.read();
//       const decoder = new TextDecoder("utf-8");
//       const csvData = decoder.decode(data.value);
//       const parsedData = Papa.parse(csvData, {
//         header: true,
//         skipEmptyLines: true,
//       }).data;
//       setVehicles(parsedData);
//     };

//     fetchVehicles();
//   }, []);

  useEffect(() => {
    axios.get("http://localhost:8000/vehicles")
        .then((response) => {
            setVehicles(response.data)
            // console.log(response.data)
        }).catch((error) => {
            console.log(error)
        })
  })

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
    </div>
  );
};

export default VehiclesPage;
