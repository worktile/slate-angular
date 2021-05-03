export function createEmptyDocument() {
    return [
        {
            type: 'paragraph',
            children: [
                { text: '' }
            ]
        }
    ]
}
export function createDefaultDocument() {
    return [
        {
            type: 'paragraph',
            children: [{ text: 'This is editable text!' }]
        }
    ];
}