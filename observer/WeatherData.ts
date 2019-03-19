import { IObservable } from './Interfaces/IObservable';
import { IObserver } from './Interfaces/IObserver';

export class WeatherData implements IObservable {
    private observers: Set<IObserver> = new Set();

    public registerObserver(observer: IObserver): void {
        this.observers.add(observer);
    }

    public removeObserver(observer: IObserver): void {
        this.observers.delete(observer);
    }

    public notifyObservers(data) {
        this.observers.forEach(observer => observer.update(data));
    }

    public setMeasurements(temperature: number, humidity: number, pressure: number) {
        this.notifyObservers({ temperature: temperature, humidity: humidity, pressure: pressure });
    }

}
