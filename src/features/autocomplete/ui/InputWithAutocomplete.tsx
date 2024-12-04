import { useState, useEffect } from "react";
import { SuggestedWords } from "../domain/SuggestedWords";
import { autocompleteRepository } from "../infrastructure/AutocompleteRepo";
import { useDebounce } from "@shared/index";

export const InputWithAutocomplete = () => {
    const [inputData, setInputData] = useState<string>("");
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [selectedOption, setSelectedOption] = useState<string>("");

    const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        setInputData(e.target.value);
    };
    const handleChangeSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedOption(e.target.value);
    };
    const debouncedInput = useDebounce(inputData, 200);

    useEffect(() => {
        const fetchSuggestions = async () => {
            const splittedWords = debouncedInput.split(" ");
            try {
                const result: SuggestedWords =
                    await autocompleteRepository.getSuggestions(
                        splittedWords.pop() || debouncedInput
                    );
                setSuggestions(result.suggestions);
            } catch (error) {
                console.error("Error fetching suggestions:", error);
                setSuggestions([]);
            }
        };

        if (debouncedInput.trim()) {
            fetchSuggestions();
        } else {
            setSuggestions([]);
        }
    }, [debouncedInput]);

    useEffect(() => {
        const changeWord = async () => {
            setInputData((prev) => {
                const words = prev.trim().split(" ");
                words.pop();

                return [...words, selectedOption].join(" ") + " ";
            });
        };
        changeWord();
    }, [selectedOption]);
    return (
        <>
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    gap: "10px",
                }}
            >
                <div>Check our suggestion tool:</div>
                <input
                    value={inputData}
                    onChange={handleChangeInput}
                    name="autocomplete-input"
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
            </div>
        </>
    );
};
