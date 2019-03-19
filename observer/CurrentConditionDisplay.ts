import { IDisplay } from './Interfaces/IDisplay';
import { IObserver } from './Interfaces/IObserver';

export class CurrentConditionDisplay implements IDisplay, IObserver {
    temperature: number;
    humidity: number;
    pressure: number;

    public update(data) {
        this.temperature = data.temperature;
        this.humidity = data.humidity;
        this.pressure = data.pressure;
        this.display();
    }

    public display() {
        console.log(`Condition right now: ${this.temperature}C degrees, ${this.humidity}% humidity and ${this.pressure}bar pressure`);
    }
}