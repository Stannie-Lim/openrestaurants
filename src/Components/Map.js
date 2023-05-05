import React, { useEffect, useState } from "react";
import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  Circle,
  LoadScript,
  DirectionsService,
  DirectionsRenderer,
} from "@react-google-maps/api";
import axios from "axios";
import { Card, Grid, Typography, Rating } from "@mui/material";

import { secrets } from "../../secrets";
const { GOOGLE_API_KEY, YELP_API_KEY } = secrets;

const containerStyle = {
  width: "600px",
  height: "600px",
};

const BusinessCard = ({ hover }) => {
  const formula = 0.00062137;
  const miles = hover.distance * formula;
  return (
    <Card variant="outlined">
      <Typography>{hover.name}</Typography>
      <Rating value={hover.rating} />
      <Typography>{hover.display_phone}</Typography>
      <Typography>{miles.toFixed(2)} miles away from you</Typography>
    </Card>
  );
};

function MyComponent() {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: GOOGLE_API_KEY,
  });

  const [map, setMap] = React.useState(null);
  const [center, setCenter] = useState(null);
  const [centerLoaded, setCenterLoaded] = useState(false);
  const [markers, setMarkers] = useState([]);
  const [hover, setHover] = useState(null);
  const [directions, setDirections] = useState(null);

  const [businesses, setBusinesses] = useState([]);

  useEffect(() => {
    const mylocation = {
      lat: 40.730701,
      lng: -73.991531,
    };

    const getBusinesses = async () => {
      try {
        const { data } = await axios.get(
          `/api/businesses/${mylocation.lat}/${mylocation.lng}`
        );
        setCenter(mylocation);
        setMarkers([
          ...markers,
          { ...mylocation, label: "Current location" },
          ...data.map((business) => ({
            id: business.id,
            lat: business.coordinates.latitude,
            lng: business.coordinates.longitude,
            label: business.name,
          })),
        ]);
        setBusinesses(data);
      } catch (error) {
        console.log(error);
      }
    };

    getBusinesses();

    navigator.geolocation.getCurrentPosition(function (position) {
      setCenter({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });
    });

    setCenterLoaded(true);
  }, []);

  const onLoad = React.useCallback(function callback(map) {
    setMap(map);
  }, []);

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null);
  }, []);

  return isLoaded && centerLoaded ? (
    <Grid container>
      <Grid item xs={6}>
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={18}
          onLoad={onLoad}
          onUnmount={onUnmount}
        >
          {markers.map((marker) => (
            <Marker
              onMouseDown={() =>
                setHover(
                  businesses.find((business) => business.id === marker.id)
                )
              }
              position={{ lat: marker.lat, lng: marker.lng }}
              label={marker.label}
            />
          ))}
          {console.log(hover, center)}
          {hover && (
            <DirectionsService
              options={{
                destination: {
                  lat: hover.coordinates.latitude,
                  lng: hover.coordinates.longitude,
                },
                origin: center,
                travelMode: "WALKING",
              }}
              callback={(directions) => setDirections(directions)}
            />
          )}
          {directions && (
            <DirectionsRenderer
              options={{
                directions,
              }}
            />
          )}
        </GoogleMap>
      </Grid>
      <Grid item xs={6}>
        {hover && <BusinessCard hover={hover} />}
      </Grid>
    </Grid>
  ) : (
    <></>
  );
}

export default MyComponent;
