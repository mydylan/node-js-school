import { IObserver } from './IObserver';

export interface IObservable {
    registerObserver(o: IObserver): void;
    removeObserver(o: IObserver): void;
    notifyObservers(eventName: String): void;
}