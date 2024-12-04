import { useState, useEffect, useCallback } from "react";
import { SuggestedWords } from "../domain/SuggestedWords";
import { autocompleteRepository } from "../infrastructure/AutocompleteRepo";
import { useDebounce } from "@shared/index";

export const useAutocomplete = (
    inputData: string,
    showSuggestions: boolean
) => {
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const debouncedInput = useDebounce(inputData, 300);

    const fetchSuggestions = useCallback(async (word: string) => {
        try {
            const result: SuggestedWords =
                await autocompleteRepository.getSuggestions(word);
            setSuggestions(result.suggestions);
        } catch (error) {
            console.error("Error fetching suggestions:", error);
            setSuggestions([]);
        }
    }, []);

    useEffect(() => {
        if (debouncedInput.trim() && showSuggestions) {
            const lastWord = debouncedInput.trim().split(" ").pop() || "";
            fetchSuggestions(lastWord);
        } else {
            setSuggestions([]);
        }
    }, [debouncedInput, fetchSuggestions, showSuggestions]);

    return { suggestions, setSuggestions };
};
