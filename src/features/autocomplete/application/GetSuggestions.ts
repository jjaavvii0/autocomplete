import { IAutocompleteRepo } from "../domain/IAutocompleteRepo";
import { SuggestedWords } from "../domain/SuggestedWords";

export const getSuggestionsUseCase = async (
    autocompleteRepository: IAutocompleteRepo,
    word: string
): Promise<SuggestedWords> => {
    return await autocompleteRepository.getSuggestions(word);
};
