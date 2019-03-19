import { CurrentConditionDisplay } from './CurrentConditionDisplay';
import { EventEmitter } from 'events';

export class WeatherStation {
    private eventEmitter: EventEmitter = new EventEmitter();

    constructor() {
        const currentConditionDisplay = new CurrentConditionDisplay();

        this.eventEmitter.addListener('update', data => currentConditionDisplay.update(data));
    }

    public init() {
        this.eventEmitter.emit('update', { temperature: 20, humidity: 42, pressure: 10 });
    }
}

const station = new WeatherStation();
station.init();