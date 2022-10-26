import React, { useContext, useEffect, useState } from "react";
import MapView from 'react-native-maps'
import styled from "styled-components/native";
import { LocationContext } from "../../../services/location/location.context";
import { RestaurantsContext } from "../../../services/restaurants/restaurants.context";
import { MapCallout } from "../components/map-callout.component";
import { Search } from "../components/search.component";

const RestaurantMap = ({ navigation }) => {
  const { location } = useContext(LocationContext);
  const { restaurants = [] } = useContext(RestaurantsContext);

  const [latDelta, setLatDelta] = useState(0);

  const { lat, lng, viewport } = location;

  useEffect(() => {
    const northeastLat = viewport.northeast.lat;
    const southwestLat = viewport.southwest.lat;

    setLatDelta(northeastLat - southwestLat);
  }, [location, viewport]);

  return (
  <>
    <Search/>
    <Map
        region={{
          latitude: lat,
          longitude: lng,
          latitudeDelta: latDelta,
          longitudeDelta: 0.01,
        }}
      >
        { restaurants.map((restaurant) => {
          return <MapView.Marker
            key={ restaurant.name }
            title={ restaurant.name }
            coordinate={{ 
              latitude: restaurant.geometry.location.lat,
              longitude: restaurant.geometry.location.lng,
            }}
          >
            <MapView.Callout
            onPress={ () => navigation.navigate('RestaurantDetail', { restaurant }) }>
              <MapCallout restaurant={restaurant} />
            </MapView.Callout>
          </MapView.Marker>;
        })}
      </Map>
  </>
  )
}

export const MapScreen = () => {
  const { location } = useContext(LocationContext);
  if (!location) {
    return (
      <Map
        region={{
          latitude: 0,
          longitude: 0,
        }}
      />
    );
  }
  return <RestaurantMap />;
};

const Map = styled(MapView)`
  height: 100%;
  width: 100%;
`
