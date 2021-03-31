import { SlaErrorDataType, SlaErrorCode } from '../constants'
import { Point } from 'slate'
import { DOMElement, DOMRange, DOMStaticRange, DOMSelection } from '../utils/dom'


export interface SlaErrorData {
    code?: SlaErrorCode | number;
    codeName?: string;
    nativeError?: Error
}
