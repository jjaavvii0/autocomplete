import { useState, useEffect, useRef, useCallback } from "react";
import { SuggestedWords } from "../domain/SuggestedWords";
import { autocompleteRepository } from "../infrastructure/AutocompleteRepo";
import { useDebounce } from "@shared/index";
import "./InputWithAutocomplete.css";

export const InputWithAutocomplete = () => {
    const [inputData, setInputData] = useState<string>("");
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [selectedOption, setSelectedOption] = useState<string>("");
    const inputRef = useRef<HTMLInputElement>(null);
    const debouncedInput = useDebounce(inputData, 200);

    const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        setInputData(e.target.value);
    };
    const handleChangeSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        e.preventDefault();
        setSelectedOption(e.target.value);
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
        const changeWord = async () => {
            if (selectedOption.length > 0) {
                setInputData((prev) => {
                    const words = prev.trim().split(" ");
                    words.pop();

                    return [...words, selectedOption].join(" ") + " ";
                });
                if (inputRef.current) {
                    inputRef.current.focus();
                }
                setSuggestions([]);
            }
        };
        changeWord();
    }, [selectedOption]);

    return (
        <>
            <section className="section-autocomplete">
                <input
                    ref={inputRef}
                    value={inputData}
                    onChange={handleChangeInput}
                    name="autocomplete-input"
                    placeholder="Type here..."
                ></input>
                {suggestions.length > 0 && (
                    <select
                        size={Math.min(20, suggestions.length)}
                        onChange={handleChangeSelect}
                    >
                        {suggestions.map((suggestion, index) => (
                            <option
                                key={index}
                                value={suggestion}
                            >
                                {suggestion}
                            </option>
                        ))}
                    </select>
                )}
            </section>
        </>
    );
};
