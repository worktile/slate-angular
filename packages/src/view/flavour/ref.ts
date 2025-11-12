import { BaseFlavour } from './base';

export class FlavourRef {
    instance: BaseFlavour;

    destroy(): void {
        this.instance.onDestroy();
    }
}
