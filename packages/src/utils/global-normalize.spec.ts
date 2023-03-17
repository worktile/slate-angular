import { Element } from 'slate';
import { check, normalize } from './global-normalize';

describe('global-normalize', () => {
    const invalidData3: any[] = [
        {
            type: 'paragraph',
            children: [{ text: '' }]
        },
        {
            type: 'numbered-list',
            children: [
                {
                    type: 'list-item',
                    children: [
                        {
                            type: 'paragraph',
                            children: [
                                {
                                    text: ''
                                }
                            ]
                        },
                        {
                            type: 'paragraph',
                            children: []
                        }
                    ]
                }
            ]
        }
    ];

    it('should return true', () => {
        const validData: Element[] = [
            {
                type: 'paragraph',
                children: [
                    { text: 'This is editable ' },
                    { text: 'rich', bold: true },
                    { text: ' text, ' },
                    { text: 'much', bold: true, italic: true },
                    { text: ' better than a ' },
                    { text: '<textarea>', ['code-line']: true },
                    { text: '!' }
                ]
            },
            {
                type: 'heading-one',
                children: [{ text: 'This is h1 ' }]
            },
            {
                type: 'heading-three',
                children: [{ text: 'This is h3 ' }]
            },
            {
                type: 'paragraph',
                children: [
                    {
                        text: `Since it's rich text, you can do things like turn a selection of text `
                    },
                    { text: 'bold', bold: true },
                    {
                        text: ', or add a semantically rendered block quote in the middle of the page, like this:'
                    }
                ]
            },
            {
                type: 'block-quote',
                children: [{ text: 'A wise quote.' }]
            },
            {
                type: 'paragraph',
                children: [{ text: 'Try it out for yourself!' }]
            },
            {
                type: 'paragraph',
                children: [{ text: '' }]
            }
        ];
        const result = check(validData);
        expect(result).toBeTrue();
    });

    it('should return false', () => {
        const invalidData1: any[] = [{ text: '' }];

        const result1 = check(invalidData1);
        expect(result1).toBeFalse();

        const invalidData2: any[] = [
            {
                type: 'paragraph',
                children: []
            }
        ];

        const result2 = check(invalidData2);
        expect(result2).toBeFalse();

        const result3 = check(invalidData3);
        expect(result3).toBeFalse();
    });

    it('should return valid data', () => {
        const result3 = normalize(invalidData3);
        expect(result3.length).toEqual(1);
        expect(result3[0]).toEqual(invalidData3[0]);
    });
});
