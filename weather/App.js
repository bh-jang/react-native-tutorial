import * as Location from "expo-location";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from '@expo/vector-icons';

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const API_KEY = "a43f4f9697c198c1d65901488c6fe028";
const icons ={
  "Clouds": "cloudy",
  "Rain": "rainy",
  "Clear": "sun"
}

export default function App() {
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [days, setDays] = useState([]);
  const [ok, setOk] = useState(true);
  const getWeather = async () => {
    const permission = await Location.requestForegroundPermissionsAsync();
    if (permission.granted) {
      setOk(false);
    }

    const {
      coords: { latitude, longitude },
    } = await Location.getCurrentPositionAsync({ accuracy: 5 });

    const location = await Location.reverseGeocodeAsync(
      { latitude, longitude },
      { useGoogleMaps: false }
    );

    setCity(location[0].region);
    setAddress(`${location[0].district} ${location[0].street}`);

    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=alerts&appid=${API_KEY}&units=metric`
    );
    const data = await response.json();
    setDays(data.daily);
  };

  useEffect(() => {
    getWeather();
  }, []);

  return (
    <View style={style.container}>
      <View style={style.city}>
        {
          city.length === 0 ? <ActivityIndicator size="large" color="white" /> : <Text style={style.cityName}>{city}</Text>
        }
        {
          address.length === 0 ? <ActivityIndicator size="large" color="white" /> : <Text style={style.addressName}>{city}</Text>
        }
      </View>
      <ScrollView
        contentContainerStyle={style.weather}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
      >
        {days.length === 0 ? (
          <View style={style.dayWrapper}>
            <ActivityIndicator
              color="white"
              style={{ marginTop: 50 }}
              size="large"
            />
          </View>
        ) : (
          days.map(day => (
            <View style={style.dayWrapper} key={day.dt}>
              <Text style={style.day}>{new Date(day.dt * 1000 + 32400).toLocaleDateString()}</Text>
              <Text style={style.temp}>{`${day.temp.day.toFixed(0)}℃`}</Text>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Ionicons name={icons[day.weather[0].main]} size={36} color="black" />
                <Text style={style.description}>{day.weather[0].main}</Text>
              </View>              
            </View>
          ))
        )}
      </ScrollView>
      <StatusBar style="light" />
    </View>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "tomato",
    color: "#eee",
  },
  city: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  cityName: {
    fontSize: 52,
    fontWeight: "400",
  },
  addressName: {
    fontSize: 28,
  },
  weather: {},
  dayWrapper: {
    width: SCREEN_WIDTH,
    alignItems: "center",
  },
  day: {
    fontSize: 32,
    marginBottom: -60
  },
  temp: {
    marginTop: 50,
    fontSize: 120,
  },
  description: {
    fontSize: 60,
  },
});
