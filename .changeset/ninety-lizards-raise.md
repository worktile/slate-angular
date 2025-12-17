---
'slate-angular': patch
---

support remeasure height only when element is changed or added

extract updateListRenderAndRemeasureHeights to update dom and remeasure heights and apply it to force to fix height can not be updated on Chinese composition type

rename refreshVirtualViewAnimId to tryUpdateVirtualViewportAnimId, measureVisibleHeightsAnimId to tryMeasureInViewportChildrenHeightsAnimId, scheduleMeasureVisibleHeights to tryMeasureInViewportChildrenHeights

