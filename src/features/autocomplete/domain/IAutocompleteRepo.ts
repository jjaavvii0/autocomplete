import { SuggestedWords } from "./SuggestedWords";

export interface IAutocompleteRepo {
    getSuggestions(word: string): Promise<SuggestedWords>;
}
