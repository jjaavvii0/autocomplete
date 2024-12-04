import { useState, useRef, useCallback } from "react";
import { useAutocomplete } from "../hooks/useAutocomplete";
import { SuggestionsBox } from "./SuggestionsBox";
import "./InputWithAutocomplete.css";

export const InputWithAutocomplete = () => {
    const [inputData, setInputData] = useState<string>("");
    const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
    const [showSuggestions, setShowSuggestions] = useState(true);
    const inputRef = useRef<HTMLTextAreaElement>(null);

    const { suggestions, setSuggestions } = useAutocomplete(
        inputData,
        showSuggestions
    );

    const handleChangeInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        e.preventDefault();
        setShowSuggestions(true);
        setInputData(e.target.value);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
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

    const handleSuggestionClick = useCallback(
        (suggestion: string) => {
            setInputData((prev) => {
                const words = prev.trim().split(" ");
                words.pop();
                return [...words, suggestion].join(" ") + " ";
            });
            setSuggestions([]);
            setHighlightedIndex(-1);
            setShowSuggestions(false);
            if (inputRef.current) {
                inputRef.current.focus();
            }
        },
        [setInputData, setSuggestions]
    );

    const handleSuggestionHover = useCallback((index: number) => {
        setHighlightedIndex(index);
    }, []);

    return (
        <section className="section-autocomplete">
            <textarea
                ref={inputRef}
                className="input-field"
                value={inputData}
                onChange={handleChangeInput}
                onKeyDown={handleKeyDown}
                name="autocomplete-input"
                placeholder="Type here..."
            />
            {suggestions.length > 0 && showSuggestions && (
                <SuggestionsBox
                    searchText={inputData}
                    suggestions={suggestions}
                    highlightedIndex={highlightedIndex}
                    onSuggestionClick={handleSuggestionClick}
                    onSuggestionHover={handleSuggestionHover}
                />
            )}
        </section>
    );
};
