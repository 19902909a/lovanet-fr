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
  windy: Wind,
};

const mockWeatherData: WeatherData[] = [
  { temperature: 22, condition: "sunny", city: "Paris", humidity: 45, windSpeed: 12 },
  { temperature: 18, condition: "cloudy", city: "Londres", humidity: 65, windSpeed: 18 },
  { temperature: 25, condition: "sunny", city: "Los Angeles", humidity: 30, windSpeed: 8 },
  { temperature: 15, condition: "rainy", city: "Tokyo", humidity: 85, windSpeed: 22 },
  { temperature: -2, condition: "snowy", city: "Moscou", humidity: 70, windSpeed: 15 },
];

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

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass rounded-xl p-6 hover:border-primary/50 transition-all duration-300"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display text-lg font-semibold text-primary">Météo</h3>
        <span className="text-xs text-muted-foreground">
          {currentTime.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
        </span>
      </div>

      <div className="flex items-center gap-4">
        <motion.div
          animate={{ rotate: weather.condition === "sunny" ? [0, 10, -10, 0] : 0 }}
          transition={{ duration: 2, repeat: Infinity }}
          className="p-3 rounded-full bg-primary/20"
        >
          <WeatherIcon className="w-10 h-10 text-primary" />
        </motion.div>

        <div>
          <div className="font-display text-4xl font-bold text-glow-cyan">
            {weather.temperature}°C
          </div>
          <div className="text-sm text-muted-foreground">{weather.city}</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-border/50">
        <div>
          <div className="text-xs text-muted-foreground">Humidité</div>
          <div className="font-display text-sm font-semibold">{weather.humidity}%</div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground">Vent</div>
          <div className="font-display text-sm font-semibold">{weather.windSpeed} km/h</div>
        </div>
      </div>

      <div className="flex gap-2 mt-4">
        {mockWeatherData.slice(0, 4).map((day, index) => (
          <div
            key={index}
            className="flex-1 text-center p-2 rounded-lg bg-card/50 hover:bg-card transition-colors cursor-pointer"
            onClick={() => setWeather(day)}
          >
            <div className="text-xs text-muted-foreground mb-1">{day.city.slice(0, 3)}</div>
            {(() => {
              const Icon = weatherIcons[day.condition];
              return <Icon className="w-4 h-4 mx-auto text-primary" />;
            })()}
            <div className="text-xs font-semibold mt-1">{day.temperature}°</div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};
