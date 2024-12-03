import { IAutocompleteRepo } from "../domain/IAutocompleteRepo";
import { SuggestedWords } from "../domain/SuggestedWords";
import wordsJson from "./wordsEnglish.json";

export const autocompleteRepository: IAutocompleteRepo = {
    async getSuggestions(word: string): Promise<SuggestedWords> {
        try {
            const wordList: string[] = wordsJson as string[];
            const suggestions = wordList.filter((w) =>
                w.toLowerCase().startsWith(word.toLowerCase())
            );
            return { word, suggestions };
        } catch (e) {
            console.error("Error in getSuggestions:", e);
            return { word, suggestions: [] };
        }
    },
};
