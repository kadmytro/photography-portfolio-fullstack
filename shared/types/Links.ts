export interface Links {
    telegramLink?: string;
    instagramLink?: string;
    linkedInLink?: string;
    youtubeLink?: string;
};

export const isValidLinksObject = (links: any): links is Links => {
    return (
        (links.telegramLink === undefined || typeof links.telegramLink === 'string') &&
        (links.instagramLink === undefined || typeof links.instagramLink === 'string') &&
        (links.linkedInLink === undefined || typeof links.linkedInLink === 'string') &&
        (links.youTubeLink === undefined || typeof links.youTubeLink === 'string')
    );
};