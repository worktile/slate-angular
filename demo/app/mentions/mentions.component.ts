import { Component, OnInit, ViewChild, TemplateRef, Renderer2, ElementRef, ChangeDetectorRef } from '@angular/core';
import { Editor, Transforms, createEditor, Element, Range } from 'slate';
import { withHistory } from 'slate-history';
import { AngularEditor, withAngular } from 'slate-angular';
import { MentionElement } from 'custom-types';
import { NgClass, NgFor } from '@angular/common';
import { SlateElementComponent } from '../../../packages/src/components/element/element.component';
import { FormsModule } from '@angular/forms';
import { SlateEditableComponent } from '../../../packages/src/components/editable/editable.component';

@Component({
    selector: 'demo-mentions',
    templateUrl: 'mentions.component.html',
    standalone: true,
    imports: [SlateEditableComponent, FormsModule, SlateElementComponent, NgClass, NgFor]
})
export class DemoMentionsComponent implements OnInit {
    searchText = '';
    suggestions: string[] = [];
    target: Range;
    activeIndex = 0;
    trigger = '@';

    value = initialValue;

    editor = withMentions(withHistory(withAngular(createEditor())));

    @ViewChild('mention', { read: TemplateRef, static: true })
    mentionTemplate: TemplateRef<any>;

    @ViewChild('suggestionList', { static: true })
    suggestionList: ElementRef;

    constructor(private renderer2: Renderer2, private cdr: ChangeDetectorRef) {}

    ngOnInit() {}

    renderElement = (element: Element) => {
        if (element.type === 'mention') {
            return this.mentionTemplate;
        }
    };

    onKeydown = (event: KeyboardEvent) => {
        if (this.target) {
            switch (event.key) {
                case 'ArrowDown':
                    event.preventDefault();
                    if (this.activeIndex === this.suggestions.length - 1) {
                        this.activeIndex = 0;
                    } else {
                        this.activeIndex++;
                    }
                    this.cdr.detectChanges();
                    break;
                case 'ArrowUp':
                    event.preventDefault();
                    if (this.activeIndex === 0) {
                        this.activeIndex = this.suggestions.length - 1;
                    } else {
                        this.activeIndex--;
                    }
                    this.cdr.detectChanges();
                    break;
                case 'Tab':
                case 'Enter':
                    event.preventDefault();
                    this.removeSearchText();
                    insertMention(this.editor, this.suggestions[this.activeIndex]);
                    this.cdr.detectChanges();
                    break;
                case 'Escape':
                    event.preventDefault();
                    this.target = null;
                    this.updateSuggestionsLocation();
                    this.cdr.detectChanges();
                    break;
            }
        }
    };

    valueChange(value: Element[]) {
        const { selection, operations } = this.editor;
        if (operations[0].type === 'insert_text' && operations[0].text === this.trigger) {
            this.target = {
                anchor: Editor.before(this.editor, selection.anchor),
                focus: selection.focus
            };
            this.searchText = '';
            this.activeIndex = 0;
            this.updateSuggestionsLocation();
            return;
        }

        if (selection && Range.isCollapsed(selection) && this.target) {
            const beforeRange = Editor.range(this.editor, this.target.anchor, selection.focus);
            const beforeText = Editor.string(this.editor, beforeRange);
            const beforeMatch = beforeText && beforeText.match(/^@(\w*)$/);
            if (beforeMatch) {
                this.searchText = beforeText.slice(1);
                this.activeIndex = 0;
                this.updateSuggestionsLocation();
                return;
            }
        }

        if (this.target) {
            this.target = null;
            this.updateSuggestionsLocation();
        }
    }

    updateSuggestionsLocation() {
        this.suggestions = CHARACTERS.filter(suggestion => {
            return suggestion.toLowerCase().includes(this.searchText.toLowerCase());
        }).slice(0, 10);
        if (this.target && this.suggestions.length) {
            const nativeRange = AngularEditor.toDOMRange(this.editor, this.target);
            const rect = nativeRange.getBoundingClientRect();
            this.renderer2.setStyle(this.suggestionList.nativeElement, 'left', `${rect.left + window.pageXOffset}px`);
            this.renderer2.setStyle(this.suggestionList.nativeElement, 'top', `${rect.top + window.pageYOffset + 25}px`);
            return;
        }
        this.renderer2.removeStyle(this.suggestionList.nativeElement, 'left');
        this.renderer2.removeStyle(this.suggestionList.nativeElement, 'top');
    }

    mousedown(event: MouseEvent, item) {
        event.preventDefault();
        this.removeSearchText();
        insertMention(this.editor, item);
    }

    removeSearchText() {
        const range = {
            anchor: {
                path: this.editor.selection.anchor.path,
                offset: this.editor.selection.anchor.offset - this.searchText.length - 1
            },
            focus: this.editor.selection.focus
        };
        Transforms.select(this.editor, range);
        Transforms.delete(this.editor);
    }
}

const withMentions = editor => {
    const { isVoid, isInline } = editor;
    editor.isInline = element => {
        return element.type === 'mention' ? true : isInline(element);
    };
    editor.isVoid = element => {
        return element.type === 'mention' ? true : isVoid(element);
    };
    return editor;
};

const insertMention = (editor: Editor, character: string) => {
    const mention: MentionElement = {
        type: 'mention',
        character,
        children: [{ text: '' }]
    };
    Transforms.insertNodes(editor, mention);
    Transforms.move(editor);
};

const initialValue = [
    {
        type: 'paragraph',
        children: [
            {
                text: `This example shows how you might implement a simple @-mentions feature that lets
 users autocomplete mentioning a user by their username. Which, in this case means Star
 Wars characters. The mentions are rendered as void inline elements inside the document.`
            }
        ]
    },
    {
        type: 'paragraph',
        children: [
            {
                text: 'Please press @ '
            },
            {
                type: 'mention',
                children: [{ text: '' }],
                character: 'admin'
            },
            {
                text: ''
            }
        ]
    },
    {
        type: 'paragraph',
        children: [
            {
                text: 'Try it out for yourself!'
            }
        ]
    }
];

const CHARACTERS = [
    'Aayla Secura',
    'Adi Gallia',
    'Admiral Dodd Rancit',
    'Admiral Firmus Piett',
    'Admiral Gial Ackbar',
    'Admiral Ozzel',
    'Admiral Raddus',
    'Admiral Terrinald Screed',
    'Admiral Trench',
    'Admiral U.O. Statura',
    'Agen Kolar',
    'Agent Kallus',
    'Aiolin and Morit Astarte',
    'Aks Moe',
    'Almec',
    'Alton Kastle',
    'Amee',
    'AP-5',
    'Armitage Hux',
    'Artoo',
    'Arvel Crynyd',
    'Asajj Ventress',
    'Aurra Sing',
    'AZI-3',
    'Bala-Tik',
    'Barada',
    'Bargwill Tomder',
    'Baron Papanoida',
    'Barriss Offee',
    'Baze Malbus',
    'Bazine Netal',
    'BB-8',
    'BB-9E',
    'Ben Quadinaros',
    'Berch Teller',
    'Beru Lars',
    'Bib Fortuna',
    'Biggs Darklighter',
    'Black Krrsantan',
    'Bo-Katan Kryze',
    'Boba Fett',
    'Bobbajo',
    'Bodhi Rook',
    'Borvo the Hutt',
    'Boss Nass',
    'Bossk',
    'Breha Antilles-Organa',
    'Bren Derlin',
    'Brendol Hux',
    'BT-1',
    'C-3PO',
    'C1-10P',
    'Cad Bane',
    'Caluan Ematt',
    'Captain Gregor',
    'Captain Phasma',
    'Captain Quarsh Panaka',
    'Captain Rex',
    'Carlist Rieekan',
    'Casca Panzoro',
    'Cassian Andor',
    'Cassio Tagge',
    'Cham Syndulla',
    'Che Amanwe Papanoida',
    'Chewbacca',
    'Chi Eekway Papanoida',
    'Chief Chirpa',
    'Chirrut Îmwe',
    'Ciena Ree',
    'Cin Drallig',
    'Clegg Holdfast',
    'Cliegg Lars',
    'Coleman Kcaj',
    'Coleman Trebor',
    'Colonel Kaplan',
    'Commander Bly',
    'Commander Cody (CC-2224)',
    'Commander Fil (CC-3714)',
    'Commander Fox',
    'Commander Gree',
    'Commander Jet',
    'Commander Wolffe',
    'Conan Antonio Motti',
    'Conder Kyl',
    'Constable Zuvio',
    'Cordé',
    'Cpatain Typho',
    'Crix Madine',
    'Cut Lawquane',
    'Dak Ralter',
    'Dapp',
    'Darth Bane',
    'Darth Maul',
    'Darth Tyranus',
    'Daultay Dofine',
    'Del Meeko',
    'Delian Mors',
    'Dengar',
    'Depa Billaba',
    'Derek Klivian',
    'Dexter Jettster',
    'Dineé Ellberger',
    'DJ',
    'Doctor Aphra',
    'Doctor Evazan',
    'Dogma',
    'Dormé',
    'Dr. Cylo',
    'Droidbait',
    'Droopy McCool',
    'Dryden Vos',
    'Dud Bolt',
    'Ebe E. Endocott',
    'Echuu Shen-Jon',
    'Eeth Koth',
    'Eighth Brother',
    'Eirtaé',
    'Eli Vanto',
    'Ellé',
    'Ello Asty',
    'Embo',
    'Eneb Ray',
    'Enfys Nest',
    'EV-9D9',
    'Evaan Verlaine',
    'Even Piell',
    'Ezra Bridger',
    'Faro Argyus',
    'Feral',
    'Fifth Brother',
    'Finis Valorum',
    'Finn',
    'Fives',
    'FN-1824',
    'FN-2003',
    'Fodesinbeed Annodue',
    'Fulcrum',
    'FX-7',
    'GA-97',
    'Galen Erso',
    'Gallius Rax',
    'Garazeb "Zeb" Orrelios',
    'Gardulla the Hutt',
    'Garrick Versio',
    'Garven Dreis',
    'Gavyn Sykes',
    'Gideon Hask',
    'Gizor Dellso',
    'Gonk droid',
    'Grand Inquisitor',
    'Greeata Jendowanian',
    'Greedo',
    'Greer Sonnel',
    'Grievous',
    'Grummgar',
    'Gungi',
    'Hammerhead',
    'Han Solo',
    'Harter Kalonia',
    'Has Obbit',
    'Hera Syndulla',
    'Hevy',
    'Hondo Ohnaka',
    'Huyang',
    'Iden Versio',
    'IG-88',
    'Ima-Gun Di',
    'Inquisitors',
    'Inspector Thanoth',
    'Jabba',
    'Jacen Syndulla',
    'Jan Dodonna',
    'Jango Fett',
    'Janus Greejatus',
    'Jar Jar Binks',
    'Jas Emari',
    'Jaxxon',
    'Jek Tono Porkins',
    'Jeremoch Colton',
    'Jira',
    'Jobal Naberrie',
    'Jocasta Nu',
    'Joclad Danva',
    'Joh Yowza',
    'Jom Barell',
    'Joph Seastriker',
    'Jova Tarkin',
    'Jubnuk',
    'Jyn Erso',
    'K-2SO',
    'Kanan Jarrus',
    'Karbin',
    'Karina the Great',
    'Kes Dameron',
    'Ketsu Onyo',
    'Ki-Adi-Mundi',
    'King Katuunko',
    'Kit Fisto',
    'Kitster Banai',
    'Klaatu',
    'Klik-Klak',
    'Korr Sella',
    'Kylo Ren',
    'L3-37',
    'Lama Su',
    'Lando Calrissian',
    'Lanever Villecham',
    'Leia Organa',
    'Letta Turmond',
    'Lieutenant Kaydel Ko Connix',
    'Lieutenant Thire',
    'Lobot',
    'Logray',
    'Lok Durd',
    'Longo Two-Guns',
    'Lor San Tekka',
    'Lorth Needa',
    'Lott Dod',
    'Luke Skywalker',
    'Lumat',
    'Luminara Unduli',
    'Lux Bonteri',
    'Lyn Me',
    'Lyra Erso',
    'Mace Windu',
    'Malakili',
    'Mama the Hutt',
    'Mars Guo',
    'Mas Amedda',
    'Mawhonic',
    'Max Rebo',
    'Maximilian Veers',
    'Maz Kanata',
    'ME-8D9',
    'Meena Tills',
    'Mercurial Swift',
    'Mina Bonteri',
    'Miraj Scintel',
    'Mister Bones',
    'Mod Terrik',
    'Moden Canady',
    'Mon Mothma',
    'Moradmin Bast',
    'Moralo Eval',
    'Morley',
    'Mother Talzin',
    'Nahdar Vebb',
    'Nahdonnis Praji',
    'Nien Nunb',
    'Niima the Hutt',
    'Nines',
    'Norra Wexley',
    'Nute Gunray',
    'Nuvo Vindi',
    'Obi-Wan Kenobi',
    'Odd Ball',
    'Ody Mandrell',
    'Omi',
    'Onaconda Farr',
    'Oola',
    'OOM-9',
    'Oppo Rancisis',
    'Orn Free Taa',
    'Oro Dassyne',
    'Orrimarko',
    'Osi Sobeck',
    'Owen Lars',
    'Pablo-Jill',
    'Padmé Amidala',
    'Pagetti Rook',
    'Paige Tico',
    'Paploo',
    'Petty Officer Thanisson',
    'Pharl McQuarrie',
    'Plo Koon',
    'Po Nudo',
    'Poe Dameron',
    'Poggle the Lesser',
    'Pong Krell',
    'Pooja Naberrie',
    'PZ-4CO',
    'Quarrie',
    'Quay Tolsite',
    'Queen Apailana',
    'Queen Jamillia',
    'Queen Neeyutnee',
    'Qui-Gon Jinn',
    'Quiggold',
    'Quinlan Vos',
    'R2-D2',
    'R2-KT',
    'R3-S6',
    'R4-P17',
    'R5-D4',
    'RA-7',
    'Rabé',
    'Rako Hardeen',
    'Ransolm Casterfo',
    'Rappertunie',
    'Ratts Tyerell',
    'Raymus Antilles',
    'Ree-Yees',
    'Reeve Panzoro',
    'Rey',
    'Ric Olié',
    'Riff Tamson',
    'Riley',
    'Rinnriyin Di',
    'Rio Durant',
    'Rogue Squadron',
    'Romba',
    'Roos Tarpals',
    'Rose Tico',
    'Rotta the Hutt',
    'Rukh',
    'Rune Haako',
    'Rush Clovis',
    'Ruwee Naberrie',
    'Ryoo Naberrie',
    'Sabé',
    'Sabine Wren',
    'Saché',
    'Saelt-Marae',
    'Saesee Tiin',
    'Salacious B. Crumb',
    'San Hill',
    'Sana Starros',
    'Sarco Plank',
    'Sarkli',
    'Satine Kryze',
    'Savage Opress',
    'Sebulba',
    'Senator Organa',
    'Sergeant Kreel',
    'Seventh Sister',
    'Shaak Ti',
    'Shara Bey',
    'Shmi Skywalker',
    'Shu Mai',
    'Sidon Ithano',
    'Sifo-Dyas',
    'Sim Aloo',
    'Siniir Rath Velus',
    'Sio Bibble',
    'Sixth Brother',
    'Slowen Lo',
    'Sly Moore',
    'Snaggletooth',
    'Snap Wexley',
    'Snoke',
    'Sola Naberrie',
    'Sora Bulq',
    'Strono Tuggs',
    'Sy Snootles',
    'Tallissan Lintra',
    'Tarfful',
    'Tasu Leech',
    'Taun We',
    'TC-14',
    'Tee Watt Kaa',
    'Teebo',
    'Teedo',
    'Teemto Pagalies',
    'Temiri Blagg',
    'Tessek',
    'Tey How',
    'Thane Kyrell',
    'The Bendu',
    'The Smuggler',
    'Thrawn',
    'Tiaan Jerjerrod',
    'Tion Medon',
    'Tobias Beckett',
    'Tulon Voidgazer',
    'Tup',
    'U9-C4',
    'Unkar Plutt',
    'Val Beckett',
    'Vanden Willard',
    'Vice Admiral Amilyn Holdo',
    'Vober Dand',
    'WAC-47',
    'Wag Too',
    'Wald',
    'Walrus Man',
    'Warok',
    'Wat Tambor',
    'Watto',
    'Wedge Antilles',
    'Wes Janson',
    'Wicket W. Warrick',
    'Wilhuff Tarkin',
    'Wollivan',
    'Wuher',
    'Wullf Yularen',
    'Xamuel Lennox',
    'Yaddle',
    'Yarael Poof',
    'Yoda',
    'Zam Wesell',
    'Zev Senesca',
    'Ziro the Hutt',
    'Zuckuss'
];
