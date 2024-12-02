import { SuggestedWord } from "./SuggestedWord";

export interface IAutocompleteRepo {
    getSuggestions(word: string): Promise<SuggestedWord>;
}
