import { useState, useEffect, useRef, useCallback } from "react";
import { SuggestedWords } from "../domain/SuggestedWords";
import { autocompleteRepository } from "../infrastructure/AutocompleteRepo";
import { useDebounce } from "@shared/index";
import { SuggestionsBox } from "./SuggestionsBox";
import "./InputWithAutocomplete.css";

export const InputWithAutocomplete = () => {
    const [inputData, setInputData] = useState<string>("");
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
    const [showSuggestions, setShowSuggestions] = useState(true);
    const inputRef = useRef<HTMLInputElement>(null);
    const debouncedInput = useDebounce(inputData, 200);

    const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        setShowSuggestions(true);
        setInputData(e.target.value);
    };

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

    useEffect(() => {
        if (highlightedIndex >= 0) {
            const activeItem = document.querySelector(
                `.suggestion-item.highlighted`
            ) as HTMLElement;
            if (activeItem) {
                activeItem.scrollIntoView({ block: "nearest" });
            }
        }
    }, [highlightedIndex]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "ArrowDown") {
            setHighlightedIndex((prev) =>
                Math.min(prev + 1, suggestions.length - 1)
            );
            e.preventDefault();
        } else if (e.key === "ArrowUp") {
            setHighlightedIndex((prev) => Math.max(prev - 1, 0));
            e.preventDefault();
        } else if (e.key === "Enter" && highlightedIndex >= 0) {
            const selectedSuggestion = suggestions[highlightedIndex];
            handleSuggestionClick(selectedSuggestion);
            e.preventDefault();
        } else if (e.key === "Escape") {
            setSuggestions([]);
            setHighlightedIndex(-1);
        }
    };

    const handleSuggestionClick = (suggestion: string) => {
        setInputData((prev) => {
            const words = prev.trim().split(" ");
            words.pop();
            return [...words, suggestion].join(" ") + " ";
        });
        setSuggestions([]);
        setHighlightedIndex(-1);
        if (inputRef.current) {
            inputRef.current.focus();
        }
        setShowSuggestions(false);
    };

    const handleSuggestionHover = (index: number) => {
        setHighlightedIndex(index);
    };

    return (
        <section className="section-autocomplete">
            <input
                ref={inputRef}
                value={inputData}
                onChange={handleChangeInput}
                onKeyDown={handleKeyDown}
                name="autocomplete-input"
                placeholder="Type here..."
            />
            {suggestions.length > 0 && (
                <SuggestionsBox
                    suggestions={suggestions}
                    highlightedIndex={highlightedIndex}
                    onSuggestionClick={handleSuggestionClick}
                    onSuggestionHover={handleSuggestionHover}
                />
            )}
        </section>
    );
};
