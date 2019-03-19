import { CurrentConditionDisplay } from './CurrentConditionDisplay';
import { WeatherData } from './WeatherData';

export class WeatherStation {
    private weatherData: WeatherData = new WeatherData();

    constructor() {
        const currentConditionDisplay = new CurrentConditionDisplay();

        this.weatherData.registerObserver(currentConditionDisplay);
    }

    public init() {
        this.weatherData.setMeasurements(20, 42, 10);
    }
}

const station = new WeatherStation();
station.init();