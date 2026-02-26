import { motion } from "framer-motion";
import { Cloud, Sun, CloudRain, Snowflake, Wind } from "lucide-react";
import { useEffect, useState } from "react";

interface WeatherData {
  temperature: number;
  condition: "sunny" | "cloudy" | "rainy" | "snowy" | "windy";
  city: string;
  humidity: number;
  windSpeed: number;
}

const weatherIcons = {
  sunny: Sun,
  cloudy: Cloud,
  rainy: CloudRain,
  snowy: Snowflake,
  windy: Wind
};

const mockWeatherData: WeatherData[] = [
{ temperature: 22, condition: "sunny", city: "Paris", humidity: 45, windSpeed: 12 },
{ temperature: 18, condition: "cloudy", city: "Londres", humidity: 65, windSpeed: 18 },
{ temperature: 25, condition: "sunny", city: "Los Angeles", humidity: 30, windSpeed: 8 },
{ temperature: 15, condition: "rainy", city: "Tokyo", humidity: 85, windSpeed: 22 },
{ temperature: -2, condition: "snowy", city: "Moscou", humidity: 70, windSpeed: 15 }];


export const WeatherWidget = () => {
  const [weather, setWeather] = useState<WeatherData>(mockWeatherData[0]);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    // Simulate weather changes
    const weatherInterval = setInterval(() => {
      const randomWeather = mockWeatherData[Math.floor(Math.random() * mockWeatherData.length)];
      setWeather(randomWeather);
    }, 30000);

    // Update time
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => {
      clearInterval(weatherInterval);
      clearInterval(timeInterval);
    };
  }, []);

  const WeatherIcon = weatherIcons[weather.condition];

  return;


























































};