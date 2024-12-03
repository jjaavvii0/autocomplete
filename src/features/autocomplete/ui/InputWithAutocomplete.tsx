import { useState, useEffect } from "react";
import { SuggestedWords } from "../domain/SuggestedWords";
import { autocompleteRepository } from "../infrastructure/AutocompleteRepo";

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
    useEffect(() => {
        const fetchSuggestions = async () => {
            if (inputData.trim() === "") {
                setSuggestions([]);
                return;
            }
            const splittedWOrds = inputData.split(" ");
            try {
                const result: SuggestedWords =
                    await autocompleteRepository.getSuggestions(
                        splittedWOrds.pop() || inputData
                    );
                setSuggestions(result.suggestions);
            } catch (error) {
                console.error("Error fetching suggestions:", error);
                setSuggestions([]);
            }
        };

        fetchSuggestions();
    }, [inputData]);

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
                <label>
                    Check our suggestion tool:{" "}
                    <input
                        value={inputData}
                        onChange={handleChangeInput}
                        name="autocomplete-input"
                    ></input>
                </label>
                {suggestions.length > 0 && (
                    <select
                        size={20}
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
