export function createEmptyDocument() {
    return [
        {
            type: 'paragraph',
            children: [{ text: '' }]
        }
    ];
}
export function createDefaultDocument() {
    return [
        {
            type: 'paragraph',
            children: [{ text: 'This is editable text!' }]
        }
    ];
}

export function createMultipleParagraph() {
    return [
        {
            type: 'paragraph',
            children: [{ text: '0' }]
        },
        {
            type: 'paragraph',
            children: [{ text: '1' }]
        },
        {
            type: 'paragraph',
            children: [{ text: '2' }]
        },
        {
            type: 'paragraph',
            children: [{ text: '3' }]
        },
        {
            type: 'paragraph',
            children: [{ text: '4' }]
        },
        {
            type: 'paragraph',
            children: [{ text: '5' }]
        }
    ];
}
