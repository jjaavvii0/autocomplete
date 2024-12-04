import React, { useEffect, useRef } from "react";
import "./SuggestionsBox.css";
interface SuggestionsBoxProps {
    suggestions: string[];
    highlightedIndex: number;
    onSuggestionClick: (suggestion: string) => void;
    onSuggestionHover: (index: number) => void;
}

export const SuggestionsBox: React.FC<SuggestionsBoxProps> = ({
    suggestions,
    highlightedIndex,
    onSuggestionClick,
    onSuggestionHover,
}) => {
    const itemsRef = useRef<(HTMLLIElement | null)[]>([]);

    useEffect(() => {
        if (highlightedIndex >= 0 && itemsRef.current[highlightedIndex]) {
            itemsRef.current[highlightedIndex]?.scrollIntoView({
                block: "nearest",
            });
        }
    }, [highlightedIndex]);

    return (
        <ul className="suggestions-list">
            {suggestions.map((suggestion, index) => (
                <li
                    key={index}
                    ref={(element) => (itemsRef.current[index] = element)}
                    className={`suggestion-item ${
                        index === highlightedIndex ? "highlighted" : ""
                    }`}
                    onMouseEnter={() => onSuggestionHover(index)}
                    onClick={() => onSuggestionClick(suggestion)}
                >
                    {suggestion}
                </li>
            ))}
        </ul>
    );
};
