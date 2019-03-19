import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { sortedSteps } from '../utils/transform';

export enum FlowStepsEnum {
    upperCase = 'upperCase',
    lowerCase = 'lowerCase',
    removeSpaces = 'removeSpaces',
    gzip = 'gzip',
    ungzip = 'ungzip',
    encrypt = 'encrypt',
    decrypt = 'decrypt',
}

@Entity()
export class Service {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('enum', {
        enum: sortedSteps,
        array: true,
    })
    flowSteps: FlowStepsEnum[];
}
