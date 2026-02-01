import styles from './SearchGreenRoof.module.css'

import { useEffect, useState } from 'react';

import Container from '@components/container/Container'
import FormGroup from '@components/form-group/FormGroup'
import Select from '@components/select/Select'
import Input from '@components/input/Input'
import SearchIcon from '@components/icons/SearchIcon'
import Button from '@components/button/Button'
import Card from './card/Card'
import ActionBar from '@components/action-bar/ActionBar'
import ResponsiveRow from '@components/responsive-row/ResponsiveRow'

import { API_URL } from '@config/api/api.js'
import safeFetch, { ERROR_CODES } from '@utils/safeFetch.js'
import AppError from '@utils/AppError.js'

export default function SearchGreenRoof() {
  const [results, setResults] = useState([]);
  const [form, setForm] = useState({
    searchField: null,
    filters: {
      type: null,
      minArea: null,
      maxArea: null,
      minConclusion: null,
      maxConclusion: null,
      isAccessible: null,
      isMandatory: null,
    },
  });

  const options = [
    {
      name: "Intensivo",
      value: "intensivo"
    },
    {
      name: "Semi-Intensivo",
      value: "semi-intensivo"
    },
    {
      name: "Extensivo",
      value: "extensivo"
    }
  ]

  async function submit(e) {
    e.preventDefault();
    const query = new URLSearchParams(form.filters).toString();
    const data = await safeFetch(`${API_URL}/api/green-roofs/search?${query}`);
    setResults(data);
  }


  function onInputChange(e) {
    setForm(prev => ({
      ...prev,
      filters: {
        ...prev.filters,
        [e.target.name]: e.target.value
      }
    }));
    console.log(form);
  }

  return (
    <Container>
      <ActionBar/>
      <div className={styles.main}>
        <section className={styles.header}>
          <h1>Pesquisa</h1>
        </section>
        <section className={styles.searchArea}>
          <form className={styles.form}>
            <div className={styles.searchBar}>
              <input type="text" name="searchField"/>
              <button type="button" onClick={submit}><SearchIcon/></button>
            </div>
            <div className={styles.filters}>
              <FormGroup>
                <label htmlFor="type">Tipo</label>
                <Select value={form.filters.type} options={options} onSelect={onInputChange}/>
              </FormGroup>
              <ResponsiveRow>
                <FormGroup>
                  <label htmlFor="minArea">Área mínima</label>
                  <Input type="number" name="minArea" onChange={onInputChange}/>
                </FormGroup>
                <FormGroup>
                  <label htmlFor="maxArea">Área máxima</label>
                  <Input type="number" name="maxArea" onChange={onInputChange}/>
                </FormGroup>
                <FormGroup>
                  <label htmlFor="minConclusion">Ano minimo de conclusão</label>
                  <Input type="number" name="minConclusion" onChange={onInputChange}/>
                </FormGroup>
                <FormGroup>
                  <label htmlFor="maxConclusion">Ano máximo de conclusão</label>
                  <Input type="number" name="maxConclusion" onChange={onInputChange}/>
                </FormGroup>
                <Button type="button" onClick={submit}>Filtrar</Button>
              </ResponsiveRow>
            </div>
          </form>
        </section>
        <span className={styles.resultCount}>{results.length} resultados encontrados</span>
        <section className={styles.results}>
          {results.map(c => <Card data={c}/>)}
        </section>
        <section className={styles.paginationButtons}>
          <button type="button">Anterior</button>
          <button type="button">Proxima</button>
        </section>
      </div>
    </Container>
  )
}