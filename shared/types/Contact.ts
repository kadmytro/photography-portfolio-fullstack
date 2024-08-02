export interface Contact {
    type: "email" | "phone" | "location";
    label: string;
    value: string;
    displayValue: string;
}


export const isValidContact = (contact: any): contact is Contact => {
    const validTypes = ["email", "phone", "location"];

    return (
        validTypes.includes(contact.type) &&
        typeof contact.label === 'string' &&
        typeof contact.value === 'string' &&
        typeof contact.displayValue === 'string'
    );
};