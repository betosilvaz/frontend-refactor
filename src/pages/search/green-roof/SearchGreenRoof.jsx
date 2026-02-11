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

export default function SearchGreenRoof() {
  const [error, setError] = useState(undefined);
  const [results, setResults] = useState([]);
  const [form, setForm] = useState({
    page: 0,
    size: 12,
  });

  const options = [
    {name: "Intensivo", value: "intensivo"},
    {name: "Semi-Intensivo", value: "semi-intensivo"},
    {name: "Extensivo", value: "extensivo"}
  ]

  async function submit(e) {
    e.preventDefault();

    try {
      const query = new URLSearchParams(form).toString();
      const endpoint = `${API_URL}/api/green-roofs?${query}`;

      const response = await fetch(endpoint, {
        method: 'GET'
      });

      if (!response.ok) {
        setError("Ocorreu um erro inesperado na API");
        return;
      }

      const data = await response.json();
      setResults(data.content);
      console.log(data.content);
    } catch (err) {
      setError(err.message);
    }
  }


  function onInputChange(e) { 
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  }

  function handlePagination(e) {
    if (form.page == 0) return;
    
    setForm(prev => ({
      ...prev,
        page: e == "back" ? prev.page - 1 : prev.page + 1
    }));
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
              <input type="text" name="name" onChange={onInputChange}/>
              <button type="button" onClick={submit}><SearchIcon/></button>
            </div>
            <div className={styles.filters}>
              <FormGroup>
                <label htmlFor="type">Tipo</label>
                <Select value={form.type} options={options} onSelect={onInputChange}/>
              </FormGroup>
              <ResponsiveRow>
                <FormGroup>
                  <label htmlFor="minArea">Área mínima</label>
                  <Input type="number" value={form.minArea} name="minArea" onChange={onInputChange}/>
                </FormGroup>
                <FormGroup>
                  <label htmlFor="maxArea">Área máxima</label>
                  <Input type="number" value={form.maxArea} name="maxArea" onChange={onInputChange}/>
                </FormGroup>
                <FormGroup>
                  <label htmlFor="minConclusion">Ano minimo de conclusão</label>
                  <Input type="number" value={form.minConclusion} name="minConclusion" onChange={onInputChange}/>
                </FormGroup>
                <FormGroup>
                  <label htmlFor="maxConclusion">Ano máximo de conclusão</label>
                  <Input type="number" value={form.maxConclusion} name="maxConclusion" onChange={onInputChange}/>
                </FormGroup>
                {error && <span style={styles.error}>{error}</span>}
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
          <button type="button" onClick={() => handlePagination("back")}>Anterior</button>
          <button type="button" onClick={() => handlePagination("forward")}>Proxima</button>
        </section>
      </div>
    </Container>
  )
}