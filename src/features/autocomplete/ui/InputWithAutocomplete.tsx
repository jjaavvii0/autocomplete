import { useState, useEffect } from "react";
import { SuggestedWords } from "../domain/SuggestedWords";
import { autocompleteRepository } from "../infrastructure/AutocompleteRepo";

export const InputWithAutocomplete = () => {
    const [inputData, setInputData] = useState<string>("");
    const [suggestions, setSuggestions] = useState<string[]>([]);

    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        setInputData(e.target.value);
    };
    useEffect(() => {
        const fetchSuggestions = async () => {
            if (inputData.trim() === "") {
                setSuggestions([]);
                return;
            }
            try {
                const result: SuggestedWords =
                    await autocompleteRepository.getSuggestions(inputData);
                setSuggestions(result.suggestions);
            } catch (error) {
                console.error("Error fetching suggestions:", error);
                setSuggestions([]);
            }
        };

        fetchSuggestions();
    }, [inputData]);

    return (
        <>
            <label>
                Check our suggestion tool:{" "}
                <input
                    value={inputData}
                    onChange={handleOnChange}
                    name="autocomplete-input"
                ></input>
            </label>
            <ul>
                {suggestions.map((suggestion, index) => (
                    <li key={index}>{suggestion}</li>
                ))}
            </ul>
        </>
    );
};
