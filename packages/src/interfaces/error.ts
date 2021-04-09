import { SlaErrorCode } from '../constants'


export interface SlaErrorData {
    code?: SlaErrorCode | number;
    codeName?: string;
    nativeError?: Error;
    event?: Event;
    handler?: (event: Event) => void;
}
