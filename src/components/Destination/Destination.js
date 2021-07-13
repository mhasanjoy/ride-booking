import React, { useState } from "react";
import "./Destination.css";
import map from "../../images/map.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRoad, faUsers } from "@fortawesome/free-solid-svg-icons";
import { useParams } from "react-router";
import bikeImage from "../../images/bike.png";
import carImage from "../../images/car.png";
import busImage from "../../images/bus.png";
import trainImage from "../../images/train.png";

import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
const containerStyle = {
  width: "765px",
  height: "715px",
};
const position = {
  lat: 23.810331,
  lng: 90.412521,
};
const onLoad = (marker) => {
  console.log("marker: ", marker);
};

const Destination = () => {
  const { transportationMedium } = useParams();
  const rides = [
    { id: 1, title: "BIKE", image: bikeImage, availability: 1, fare: 50 },
    { id: 2, title: "CAR", image: carImage, availability: 4, fare: 150 },
    { id: 3, title: "BUS", image: busImage, availability: 20, fare: 20 },
    { id: 4, title: "TRAIN", image: trainImage, availability: 135, fare: 15 },
  ];
  const transport = rides.find((ride) => transportationMedium === ride.title);
  const { image, title, availability, fare } = transport;

  const [transportation, setTransportation] = useState(false);
  const [location, setLocation] = useState({
    currentLocation: "",
    destination: "",
  });
  const [emptyLocation, setEmptyLocation] = useState(true);

  const handleOnBlur = (event) => {
    const updateLocation = { ...location };
    if (event.target.name === "currentLocation") {
      const currentLocation = event.target.value;
      updateLocation.currentLocation = currentLocation;
    } else if (event.target.name === "destination") {
      const destination = event.target.value;
      updateLocation.destination = destination;
    }
    setLocation(updateLocation);
  };

  const handleSearch = (event) => {
    if (location.currentLocation && location.destination) {
      setTransportation(true);
    } else {
      setEmptyLocation(false);
    }
    event.preventDefault();
  };

  return (
    <div className="container mt-5 pb-5">
      <div className="row gx-5 pb-5">
        <div className="col-md-4 search-form">
          {!transportation && (
            <form onSubmit={handleSearch} className="search-form-content">
              <label htmlFor="currentLocation" className="mt-3 mb-2">
                Pick From
              </label>
              <input
                type="text"
                name="currentLocation"
                onBlur={handleOnBlur}
                className="location mb-2"
              />
              <label htmlFor="destination" className="mb-2">
                Destination
              </label>
              <input
                type="text"
                name="destination"
                onBlur={handleOnBlur}
                className="location mb-2"
              />
              <input
                type="submit"
                value="Search"
                className="search-btn mt-2 mb-3"
              />
              {!emptyLocation && (
                <p style={{ color: "red" }}>Location must not be empty.</p>
              )}
            </form>
          )}
          {transportation && (
            <div>
              <div
                className="mt-4 d-flex"
                style={{
                  backgroundColor: "darkorange",
                  color: "white",
                  borderRadius: "5px",
                }}
              >
                <div className="d-flex align-items-center">
                  <FontAwesomeIcon className="map-icon" icon={faRoad} />
                </div>
                <div className="pt-3 px-3">
                  <h4>{location.currentLocation} to</h4>
                  <h4>{location.destination}</h4>
                </div>
              </div>
              <div className="row gx-2 transport">
                <div className="col-3">
                  <img style={{ width: "80%" }} src={image} alt="" />
                </div>
                <div className="col-3">
                  <p>{title}</p>
                </div>
                <div className="col-3">
                  <FontAwesomeIcon icon={faUsers} />
                  <span>{availability}</span>
                </div>
                <div className="col-3">
                  <p>${fare}</p>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="col-md-8">
          {/* <img src={map} alt="" style={{ width: "100%" }} /> */}
          {!transportation && (
            <LoadScript googleMapsApiKey="">
              <GoogleMap
                mapContainerStyle={containerStyle}
                center={position}
                zoom={10}
              >
                <Marker onLoad={onLoad} position={position} />
              </GoogleMap>
            </LoadScript>
          )}
          {/* {transportation && } */}
        </div>
      </div>
    </div>
  );
};

export default Destination;
