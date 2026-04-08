import styles from './SearchGreenRoof.module.css'
import { useEffect, useState, useCallback, useRef } from 'react';
import Container from '@components/container/Container'
import FormGroup from '@components/form-group/FormGroup'
import Select from '@components/select/Select'
import Input from '@components/input/Input'
import Card from './card/Card'
import ActionBar from '@components/action-bar/ActionBar'
import ResponsiveRow from '@components/responsive-row/ResponsiveRow'
import { API_URL } from '@config/api/api.js'
import toast from 'react-hot-toast';
import { Search } from 'lucide-react';

export default function SearchGreenRoof() {
  const [data, setData] = useState({});
  const [results, setResults] = useState([]);
  const resultsRef = useRef(null);
  const [form, setForm] = useState({ page: 0, size: 12 });

  const options = [
    {name: "Intensivo", value: "intensivo"},
    {name: "Semi-Intensivo", value: "semi-intensivo"},
    {name: "Extensivo", value: "extensivo"}
  ]

  const submit = useCallback(async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    try {
      const query = new URLSearchParams(form).toString();
      const endpoint = `${API_URL}/api/green-roofs?${query}`;
      
      const response = await fetch(endpoint);
      if (!response.ok) return toast.error("Ocorreu um erro na API");
      
      const data = await response.json();
      setData(data);
      setResults(data.content || []);
    } catch (err) {
      toast.error(err.message);
    }
  }, [form]);
  
  useEffect(() => {
    submit().then(() => {
      if(resultsRef.current) {
        resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  }, [form.page, submit]);

  function onInputChange(e) { 
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  function handlePagination(direction) {
    if (direction === 'forward' && results.length < form.size) return;
    setForm(prev => ({
      ...prev,
      page: direction === "back" ? Math.max(0, prev.page - 1) : prev.page + 1
    }));
  }

  return (
    <Container>
      <ActionBar/>
      <div className={styles.main}>
        
        <section className={styles.header}>
          <h1 className={styles.pageTitle}>Catálogo de Telhados Verdes</h1>
          <p className={styles.pageSubtitle}>Explore, filtre e descubra projetos sustentáveis.</p>
        </section>

        <section className={styles.searchSection}>
          <form className={styles.form} onSubmit={submit}>
            
            <div className={styles.searchBar}>
              <Search size={30}/>
              <input 
                type="text" 
                name="name" 
                placeholder="Pesquise por nome ou local..." 
                onChange={onInputChange}
              />
              <button type="submit" className={styles.searchSubmit}>Buscar</button>
            </div>

            <div className={styles.filtersPanel}>
              <div className={styles.filtersHeader}>Filtros Avançados</div>
              <div className={styles.filtersContent}>
                <FormGroup>
                  <label htmlFor="type">Tipo de Instalação</label>
                  <Select name="type" value={form.type} options={options} onSelect={onInputChange}/>
                </FormGroup>
                
                <ResponsiveRow>
                  <FormGroup>
                    <label htmlFor="minArea">Área Mínima (m²)</label>
                    <Input type="number" value={form.minArea} name="minArea" placeholder="Ex: 50" onChange={onInputChange}/>
                  </FormGroup>
                  <FormGroup>
                    <label htmlFor="maxArea">Área Máxima (m²)</label>
                    <Input type="number" value={form.maxArea} name="maxArea" placeholder="Ex: 500" onChange={onInputChange}/>
                  </FormGroup>
                  <FormGroup>
                    <label htmlFor="minConclusion">Ano Min. Conclusão</label>
                    <Input type="number" value={form.minConclusion} name="minConclusion" placeholder="Ex: 2018" onChange={onInputChange}/>
                  </FormGroup>
                  <FormGroup>
                    <label htmlFor="maxConclusion">Ano Máx. Conclusão</label>
                    <Input type="number" value={form.maxConclusion} name="maxConclusion" placeholder="Ex: 2024" onChange={onInputChange}/>
                  </FormGroup>
                </ResponsiveRow>
              </div>
            </div>
          </form>
        </section>

        <div className={styles.resultsHeader} ref={resultsRef}>
          <span className={styles.resultCount}>
            {data.totalElements || 0} {data.totalElements === 1 ? 'resultado encontrado' : 'resultados encontrados'}
          </span>
        </div>

        <section className={styles.resultsGrid}>
          {results.map((c, index) => <Card key={c.id || index} data={c}/>)}
        </section>

        {results.length > 0 && (
          <section className={styles.pagination}>
            <button 
              type="button" 
              onClick={() => handlePagination("back")}
              disabled={form.page === 0}
              className={styles.pageButton}
            >
              Anterior
            </button>
            <span className={styles.pageIndicator}>Página {form.page + 1}</span>
            <button 
              type="button" 
              onClick={() => handlePagination("forward")}
              disabled={results.length < form.size}
              className={styles.pageButton}
            >
              Próxima
            </button>
          </section>
        )}
      </div>
    </Container>
  )
}