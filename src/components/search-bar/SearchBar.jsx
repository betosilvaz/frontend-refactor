import styles from './SearchBar.module.css';

import { Search as SearchIcon } from 'lucide-react';

export default function SearchBar({ onSubmit }) {
    return (
        <form className={styles.searchBar} onSubmit={onSubmit} >
            <input type="text" name="query" placeholder="Pesquise por endereços" />
            <button type="submit">
                <SearchIcon />
            </button>
        </form>
    )
}