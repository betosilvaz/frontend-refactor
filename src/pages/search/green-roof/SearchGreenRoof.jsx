import styles from './SearchGreenRoof.module.css'
import { useEffect, useState, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal, Leaf } from 'lucide-react';
import toast from 'react-hot-toast';

import Container from '@components/container/Container'
import FormGroup from '@components/form-group/FormGroup'
import Select from '@components/select/Select'
import Input from '@components/input/Input'
import Card from './card/Card'
import ActionBar from '@components/action-bar/ActionBar'
import ResponsiveRow from '@components/responsive-row/ResponsiveRow'
import { API_URL } from '@config/api/api.js'

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
      if(resultsRef.current && form.page > 0) {
        resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  }, [form.page, submit]);

  function onInputChange(e) { 
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value, page: 0 })); // Resetar página ao filtrar
  }

  function handlePagination(direction) {
    if (direction === 'forward' && results.length < form.size) return;
    setForm(prev => ({
      ...prev,
      page: direction === "back" ? Math.max(0, prev.page - 1) : prev.page + 1
    }));
  }

  // Variantes de Animação
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <div className={styles.pageWrapper}>
      <ActionBar/>
      <Container>
        <div className={styles.main}>
          
          <motion.section 
            className={styles.header}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className={styles.badge}>Explorador Verde</span>
            <h1 className={styles.pageTitle}>
              Catálogo de <span className={styles.highlight}>Telhados</span>
            </h1>
            <p className={styles.pageSubtitle}>
              Explore, filtre e descubra projetos sustentáveis espalhados pela cidade.
            </p>
          </motion.section>

          <motion.section 
            className={styles.searchSection}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className={styles.floatingContent}>
              <form className={styles.form} onSubmit={submit}>
                
                <div className={styles.searchBar}>
                  <Search className={styles.searchIcon} size={22}/>
                  <input 
                    type="text" 
                    name="name" 
                    placeholder="Pesquise por nome ou local..." 
                    onChange={onInputChange}
                  />
                  <button type="submit" className={styles.searchSubmit}>Procurar</button>
                </div>

                <div className={styles.filtersPanel}>
                  <div className={styles.filtersHeader}>
                    <SlidersHorizontal size={18} />
                    <span>Filtros Avançados</span>
                  </div>
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
            </div>
          </motion.section>

          <div className={styles.resultsHeader} ref={resultsRef}>
            <span className={styles.resultCount}>
              {data.totalElements || 0} {data.totalElements === 1 ? 'resultado encontrado' : 'resultados encontrados'}
            </span>
          </div>

          {results.length === 0 ? (
            <div className={styles.emptyState}>
              <Leaf size={48} className={styles.emptyIcon} />
              <p>Nenhum telhado verde encontrado com estes filtros.</p>
            </div>
          ) : (
            <motion.section 
              className={styles.resultsGrid}
              variants={containerVariants}
              initial="hidden"
              animate="show"
            >
              {results.map((c, index) => (
                <motion.div key={c.id || index} variants={itemVariants}>
                  <Card data={c}/>
                </motion.div>
              ))}
            </motion.section>
          )}

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
    </div>
  )
}