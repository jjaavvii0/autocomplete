import { useState, useEffect, useRef, useCallback } from "react";
import { SuggestedWords } from "../domain/SuggestedWords";
import { autocompleteRepository } from "../infrastructure/AutocompleteRepo";
import { useDebounce } from "@shared/index";
import "./InputWithAutocomplete.css";

export const InputWithAutocomplete = () => {
    const [inputData, setInputData] = useState<string>("");
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
    const inputRef = useRef<HTMLInputElement>(null);
    const suggestionsRef = useRef<HTMLUListElement>(null);
    const debouncedInput = useDebounce(inputData, 200);

    const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
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
        if (debouncedInput.trim()) {
            const lastWord = debouncedInput.trim().split(" ").pop() || "";
            fetchSuggestions(lastWord);
        } else {
            setSuggestions([]);
        }
    }, [debouncedInput, fetchSuggestions]);

    useEffect(() => {
        if (suggestionsRef.current && highlightedIndex >= 0) {
            const activeItem = suggestionsRef.current.children[
                highlightedIndex
            ] as HTMLElement;
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
            setInputData((prev) => {
                const words = prev.trim().split(" ");
                words.pop();
                return [...words, selectedSuggestion].join(" ") + " ";
            });
            setSuggestions([]);
            setHighlightedIndex(-1);
            if (inputRef.current) inputRef.current.focus();
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
                <ul
                    ref={suggestionsRef}
                    className="suggestions-list"
                >
                    {suggestions.map((suggestion, index) => (
                        <li
                            key={index}
                            className={`suggestion-item ${
                                index === highlightedIndex ? "highlighted" : ""
                            }`}
                            onMouseEnter={() => setHighlightedIndex(index)}
                            onClick={() => handleSuggestionClick(suggestion)}
                        >
                            {suggestion}
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
};
