import React, { useEffect, useRef } from "react";
import "./SuggestionsBox.css";

interface SuggestionsBoxProps {
    suggestions: string[];
    highlightedIndex: number;
    onSuggestionClick: (suggestion: string) => void;
    onSuggestionHover: (index: number) => void;
    searchText: string;
}

export const SuggestionsBox: React.FC<SuggestionsBoxProps> = ({
    suggestions,
    highlightedIndex,
    onSuggestionClick,
    onSuggestionHover,
    searchText,
}) => {
    const itemsRef = useRef<(HTMLLIElement | null)[]>([]);

    useEffect(() => {
        if (highlightedIndex >= 0 && itemsRef.current[highlightedIndex]) {
            itemsRef.current[highlightedIndex]?.scrollIntoView({
                block: "nearest",
            });
        }
    }, [highlightedIndex]);

    const getHighlightedText = (text: string, highlight: string) => {
        if (!highlight.trim()) {
            return text;
        }
        const highlightWords = highlight.trim().split(" ").filter(Boolean);
        const regex = new RegExp(`\\b(${highlightWords.join("|")})`, "i");
        const parts = text.split(regex);
        return (
            <>
                {parts.map((part, index) =>
                    highlightWords.some(
                        (word) => part.toLowerCase() === word.toLowerCase()
                    ) ? (
                        <span
                            key={index}
                            className="highlighted-text"
                        >
                            {part}
                        </span>
                    ) : (
                        part
                    )
                )}
            </>
        );
    };

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
                    {getHighlightedText(suggestion, searchText)}
                </li>
            ))}
        </ul>
    );
};
