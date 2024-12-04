import React from "react";
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
    return (
        <ul className="suggestions-list">
            {suggestions.map((suggestion, index) => (
                <li
                    key={index}
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
