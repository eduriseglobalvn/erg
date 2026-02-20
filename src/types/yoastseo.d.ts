declare module 'yoastseo' {
    export class Paper {
        constructor(text: string, options: {
            keyword?: string;
            title?: string;
            description?: string;
            url?: string;
            locale?: string;
        });
    }

    export class Researcher {
        constructor(paper: Paper);
        getKeywordDensity(): number;
        getFleschReadingEaseScore(): number;
    }

    export class ContentAssessor {
        constructor(researcher: Researcher);
        assess(paper: Paper): void;
        getValidResults(): Array<{
            rating: number;
            text: string;
            identifier: string;
        }>;
    }
}
