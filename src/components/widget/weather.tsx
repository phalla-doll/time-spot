"use client"

import { useEffect, useState } from "react";

export default function Weather() {
    const [weatherTempC, setWeatherTempC] = useState<number | null>(null);
    const [weatherDesc, setWeatherDesc] = useState<string>("");
    const [weatherLoading, setWeatherLoading] = useState<boolean>(true);
    const [weatherError, setWeatherError] = useState<string>("");

    function describeWeatherCode(code: number | undefined): string {
        if (code === undefined || code === null) return "";
        const mapping: Record<number, string> = {
            0: "Clear sky",
            1: "Mainly clear",
            2: "Partly cloudy",
            3: "Overcast",
            45: "Fog",
            48: "Depositing rime fog",
            51: "Light drizzle",
            53: "Moderate drizzle",
            55: "Dense drizzle",
            56: "Light freezing drizzle",
            57: "Dense freezing drizzle",
            61: "Slight rain",
            63: "Moderate rain",
            65: "Heavy rain",
            66: "Light freezing rain",
            67: "Heavy freezing rain",
            71: "Slight snow fall",
            73: "Moderate snow fall",
            75: "Heavy snow fall",
            77: "Snow grains",
            80: "Slight rain showers",
            81: "Moderate rain showers",
            82: "Violent rain showers",
            85: "Slight snow showers",
            86: "Heavy snow showers",
            95: "Thunderstorm",
            96: "Thunderstorm with slight hail",
            99: "Thunderstorm with heavy hail",
        };
        return mapping[code] ?? "";
    }

    useEffect(() => {
        let didCancel = false;

        async function fetchWeather(lat: number, lon: number) {
            try {
                setWeatherLoading(true);
                setWeatherError("");
                const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;
                const res = await fetch(url);
                if (!res.ok) throw new Error(`Weather request failed: ${res.status}`);
                const data = await res.json();
                if (didCancel) return;
                const temp = data?.current_weather?.temperature as number | undefined;
                const code = data?.current_weather?.weathercode as number | undefined;
                setWeatherTempC(typeof temp === "number" ? temp : null);
                setWeatherDesc(describeWeatherCode(code));
            } catch (err) {
                if (!didCancel) setWeatherError("Unable to load weather");
            } finally {
                if (!didCancel) setWeatherLoading(false);
            }
        }

        function getPosition(): Promise<GeolocationPosition> {
            return new Promise((resolve, reject) => {
                if (typeof window === "undefined" || !navigator.geolocation) {
                    reject(new Error("Geolocation unavailable"));
                    return;
                }
                navigator.geolocation.getCurrentPosition(resolve, reject, {
                    enableHighAccuracy: false,
                    timeout: 5000,
                    maximumAge: 300000,
                });
            });
        }

        (async () => {
            try {
                const pos = await getPosition();
                const { latitude, longitude } = pos.coords;
                await fetchWeather(latitude, longitude);
            } catch {
                await fetchWeather(40.7128, -74.0060);
            }
        })();

        return () => {
            didCancel = true;
        };
    }, []);

    return (
        <div className="flex items-center gap-2">
            {weatherLoading && (
                <span className="text-muted-foreground">Loading weather…</span>
            )}
            {!weatherLoading && weatherError && (
                <span className="text-muted-foreground">{weatherError}</span>
            )}
            {!weatherLoading && !weatherError && (
                <>
                    {weatherTempC !== null && (
                        <span className="text-muted-foreground">{Math.round(weatherTempC)}°C</span>
                    )}
                    {weatherDesc && (
                        <span className="text-muted-foreground">{weatherDesc}</span>
                    )}
                </>
            )}
        </div>
    );
}


