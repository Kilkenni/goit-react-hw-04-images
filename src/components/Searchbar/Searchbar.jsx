import { useState } from "react";
import propTypes from "prop-types";

import styles from "./Searchbar.module.css"

export default function Searchbar({ onSubmit }) {
    const [searchString, setSearchString] = useState("");

    const onInputChange = (event) => {
        const { value } = event.target;
        setSearchString(value);
    }

    const onFormSubmit = (event) => {
        event.preventDefault();
        onSubmit(searchString);
        setSearchString(""); //reset form
    }

    return (
        <header className={styles.Searchbar}>
            <form action="submit" className={styles.SearchForm} onSubmit={onFormSubmit}>
                <input 
                    type="text" 
                    name="Search" 
                    className={styles["SearchForm-input"]} 
                    value={searchString} 
                    onChange={onInputChange} 
                    autoComplete="off" 
                    autoFocus
                    placeholder="Search images and photos"/>
                <button type="submit" className={styles['SearchForm-button']}>
                    <span className={styles['SearchForm-button-label']}>Search</span>
                </button>
            </form>
        </header>         
    );
}

Searchbar.propTypes = {
    onSubmit: propTypes.func.isRequired,
}