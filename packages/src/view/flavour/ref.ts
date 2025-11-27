import { SlateBlockCard } from '../../components/block-card/block-card';
import { BaseFlavour } from './base';

export class FlavourRef {
    instance: BaseFlavour;

    destroy(): void {
        this.instance.onDestroy();
    }
}

export class BlockCardRef {
    instance: SlateBlockCard;

    destroy(): void {
        this.instance.onDestroy();
    }
}
