import { Leaf, MapPin, Target, Users, Award, Code } from 'lucide-react';

import FloatingButton from '@components/floating-button/FloatingButton';

import './About.css'; // Importando nosso arquivo de estilos

const Sobre = () => {
  return (
    <div className="sobre-container">
      <FloatingButton to="/">Inicio</FloatingButton>
      {/* Hero Section */}
      <header className="hero-section">
        <div className="icon-wrapper emerald-bg">
          <Leaf className="icon-emerald" strokeWidth={1.5} size={32} />
        </div>
        <h1 className="hero-title">
          Cultivando um Recife mais verde,<br />
          <span className="text-emerald">um telhado por vez.</span>
        </h1>
        <p className="hero-subtitle">
          Nossa plataforma utiliza geolocalização e dados precisos para mapear,
          registrar e monitorar iniciativas de telhados verdes, transformando a
          paisagem urbana e a qualidade de vida na cidade.
        </p>
      </header>

      {/* Main Content */}
      <main className="main-content">

        {/* O Sistema & Motivação */}
        <section className="info-grid">
          <div className="card">
            <div className="card-header">
              <div className="icon-wrapper blue-bg">
                <MapPin className="icon-blue" size={24} />
              </div>
              <h2>O Sistema</h2>
            </div>
            <p className="card-text">
              Desenvolvemos uma solução tecnológica integrada que permite aos cidadãos e
              gestores públicos cadastrarem e visualizarem telhados verdes espalhados pelo Recife.
              Através de um mapa interativo, é possível monitorar a saúde dessas áreas,
              entender seu impacto microclimático e incentivar a expansão da infraestrutura verde.
            </p>
          </div>

          <div className="card">
            <div className="card-header">
              <div className="icon-wrapper orange-bg">
                <Target className="icon-orange" size={24} />
              </div>
              <h2>Nossa Motivação</h2>
            </div>
            <p className="card-text">
              O avanço das ilhas de calor e a necessidade de espaços sustentáveis nos motivaram a agir.
              Acreditamos que a tecnologia é a chave para democratizar o acesso à informação ambiental.
              Nosso objetivo é mitigar os efeitos das mudanças climáticas, melhorar a qualidade do ar e
              proporcionar um ecossistema urbano mais equilibrado para todos.
            </p>
          </div>
        </section>

        {/* Equipe & Apoio */}
        <section className="team-section">
          <div className="section-header">
            <h2>Quem faz acontecer</h2>
            <div className="divider"></div>
          </div>

          <div className="team-grid">
            {/* Desenvolvedor */}
            <div className="team-member">
              <div className="avatar">
                <Code size={32} />
              </div>
              <h3>Gilberto Silva do Nascimento</h3>
              <p className="role">Desenvolvedor & Criador</p>
              <p className="description">Engenharia de software e arquitetura do sistema web.</p>
            </div>

            {/* Orientador */}
            <div className="team-member">
              <div className="avatar">
                <Users size={32} />
              </div>
              <h3>Vânia Soares de Carvalho</h3>
              <p className="role">Orientação Acadêmica</p>
              <p className="description">Suporte metodológico e revisão científica do projeto.</p>
            </div>
          </div>

          {/* Apoio */}
          <div className="support-section">
            <div className="support-info">
              <Award className="icon-emerald" size={24} />
              <div>
                <h4>Apoio e Financiamento</h4>
                <p>Projeto desenvolvido com suporte institucional.</p>
              </div>
            </div>
            <div className="cnpq-badge">
              CNPq
            </div>
          </div>
        </section>

      </main>
    </div>
  );
};

export default Sobre;