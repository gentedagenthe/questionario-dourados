import { useState, useCallback } from "react";
import { supabase } from "./supabaseClient";

const INSCRICOES_ENCERRADAS = process.env.REACT_APP_INSCRICOES_ENCERRADAS === "true";

const estilos = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Segoe UI', Arial, sans-serif; background: #f0f4f8; }
  .container { max-width: 640px; margin: 0 auto; padding: 20px 16px 48px; }
  .header { display: flex; align-items: center; gap: 14px; padding: 0 0 16px; border-bottom: 3px solid #1B6FAB; margin-bottom: 20px; }
  .logo-bloco { background: #1B6FAB; border-radius: 8px; padding: 7px 12px; }
  .logo-nome { color: #fff; font-weight: 800; font-size: 1.15rem; letter-spacing: 1px; display: block; }
  .logo-tag { color: #6BBF4E; font-size: 0.6rem; font-weight: 700; letter-spacing: 0.5px; display: block; margin-top: 1px; }
  .titulo-vaga { font-size: 1.1rem; font-weight: 700; color: #1B6FAB; }
  .subtitulo-vaga { font-size: 0.82rem; color: #666; margin-top: 2px; }
  .barra-prog-wrap { display: flex; align-items: center; gap: 10px; margin-bottom: 20px; }
  .barra-prog { flex: 1; height: 8px; background: #D4E6F1; border-radius: 4px; overflow: hidden; }
  .barra-prog-fill { height: 100%; background: linear-gradient(90deg, #1B6FAB, #6BBF4E); border-radius: 4px; transition: width 0.4s; }
  .barra-prog-txt { font-size: 0.78rem; font-weight: 700; color: #1B6FAB; white-space: nowrap; }
  .card { background: #fff; border-radius: 12px; padding: 26px 26px 22px; border: 1px solid #D4E6F1; box-shadow: 0 2px 10px rgba(27,111,171,0.08); }
  .etapa-titulo { font-size: 1rem; font-weight: 700; color: #1B6FAB; margin-bottom: 18px; padding-bottom: 10px; border-bottom: 1px solid #f0f4f8; }
  .campo { margin-bottom: 16px; }
  .campo label { display: block; font-size: 0.87rem; font-weight: 600; color: #222; margin-bottom: 5px; }
  .obrig { color: #e63946; margin-left: 2px; }
  .campo input, .campo select, .campo textarea { width: 100%; padding: 9px 12px; border: 1.5px solid #D4E6F1; border-radius: 8px; font-size: 0.92rem; color: #222; background: #fafcff; font-family: inherit; outline: none; }
  .campo input:focus, .campo select:focus, .campo textarea:focus { border-color: #1B6FAB; }
  .campo textarea { resize: vertical; min-height: 90px; line-height: 1.5; }
  .campo select { cursor: pointer; }
  .radio-grupo { display: flex; flex-direction: column; gap: 7px; margin-top: 4px; }
  .radio-op { display: flex; align-items: center; gap: 10px; padding: 8px 12px; border-radius: 8px; border: 1.5px solid #D4E6F1; background: #fafcff; font-size: 0.9rem; cursor: pointer; color: #222; transition: border-color 0.15s, background 0.15s; }
  .radio-op:hover { border-color: #1B6FAB; }
  .radio-op input[type="radio"] { accent-color: #1B6FAB; width: 16px; height: 16px; flex-shrink: 0; }
  .lgpd-box { background: #f0f4f8; border: 1px solid #D4E6F1; border-radius: 8px; padding: 14px; font-size: 0.82rem; color: #555; line-height: 1.6; }
  .lgpd-box label { display: flex; gap: 10px; align-items: flex-start; font-weight: 400; cursor: pointer; }
  .lgpd-box input[type="checkbox"] { width: 16px; height: 16px; margin-top: 2px; flex-shrink: 0; accent-color: #1B6FAB; }
  .btns { display: flex; justify-content: space-between; align-items: center; margin-top: 22px; gap: 12px; }
  .btn-voltar { background: none; border: 1.5px solid #D4E6F1; color: #1B6FAB; font-weight: 600; font-size: 0.92rem; padding: 10px 20px; border-radius: 8px; cursor: pointer; font-family: inherit; }
  .btn-voltar:hover { border-color: #1B6FAB; background: #ebf4fb; }
  .btn-avancar { margin-left: auto; background: #1B6FAB; color: #fff; border: none; font-weight: 700; font-size: 0.95rem; padding: 11px 26px; border-radius: 8px; cursor: pointer; font-family: inherit; }
  .btn-avancar:hover:not(:disabled) { opacity: 0.88; }
  .btn-avancar:disabled { opacity: 0.55; cursor: not-allowed; }
  .msg-erro { background: #fdecea; color: #c0392b; border: 1px solid #f5c6cb; border-radius: 8px; padding: 12px 14px; font-size: 0.87rem; margin-top: 12px; }
  .passos { display: flex; justify-content: center; gap: 8px; margin-bottom: 18px; flex-wrap: wrap; }
  .passo { width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.78rem; font-weight: 700; border: 2px solid #D4E6F1; color: #999; background: #fff; }
  .passo.ativo { border-color: #1B6FAB; color: #1B6FAB; }
  .passo.concluido { border-color: #6BBF4E; background: #6BBF4E; color: #fff; }
  .rodape { text-align: center; font-size: 0.78rem; color: #aaa; margin-top: 24px; display: flex; justify-content: center; gap: 8px; }
  .tela-central { min-height: 100vh; display: flex; align-items: center; justify-content: center; background: #f0f4f8; padding: 20px; }
  .card-central { background: #fff; border-radius: 14px; padding: 40px 32px; max-width: 500px; width: 100%; text-align: center; border: 1px solid #D4E6F1; }
  .card-central h2 { color: #1B6FAB; font-size: 1.25rem; margin-bottom: 12px; }
  .card-central p { color: #555; font-size: 0.93rem; line-height: 1.6; margin-bottom: 8px; }
  .icone-ok { font-size: 3rem; margin-bottom: 14px; }
  .hint { font-size: 0.78rem; color: #999; margin-top: 4px; }
  @media (max-width: 480px) {
    .card { padding: 18px 14px; }
    .btns { flex-direction: column; }
    .btn-avancar, .btn-voltar { width: 100%; text-align: center; }
  }
`;

const estadoInicial = {
  nome: "", cpf: "", email: "", telefone: "", cidade: "", bairro: "",
  idade: "", estado_civil: "", filhos: "", qtd_filhos: "",
  cnh: "", veiculo_proprio: "",
  formacao: "", curso: "", situacao_academica: "",
  experiencia_comercial: "", tempo_experiencia_comercial: "",
  segmentos_atuados: "", experiencia_credito: "", descricao_experiencia: "",
  conhecimento_crm: "", ferramentas_crm: "", dominio_office: "",
  uso_whatsapp_profissional: "", experiencia_visita_externa: "",
  pretensao_salarial: "", disponibilidade: "", situacao_atual: "",
  outro_processo: "", motivo_interesse: "", pontos_fortes: "", como_lida_metas: "",
  lgpd: false,
};

const CampoTexto = ({ label, name, value, onChange, required, placeholder, type = "text" }) => (
  <div className="campo">
    <label>{label}{required && <span className="obrig">*</span>}</label>
    <input type={type} name={name} value={value} onChange={onChange} required={required} placeholder={placeholder || ""} autoComplete="off" />
  </div>
);

const CampoSelect = ({ label, name, value, onChange, required, opcoes }) => (
  <div className="campo">
    <label>{label}{required && <span className="obrig">*</span>}</label>
    <select name={name} value={value} onChange={onChange} required={required}>
      <option value="">Selecione</option>
      {opcoes.map(op => <option key={op} value={op}>{op}</option>)}
    </select>
  </div>
);

const CampoRadio = ({ label, name, value, onChange, required, opcoes }) => (
  <div className="campo">
    <label>{label}{required && <span className="obrig">*</span>}</label>
    <div className="radio-grupo">
      {opcoes.map(op => (
        <label key={op} className="radio-op">
          <input type="radio" name={name} value={op} checked={value === op} onChange={onChange} required={required} />
          <span>{op}</span>
        </label>
      ))}
    </div>
  </div>
);

const CampoTextarea = ({ label, name, value, onChange, required, placeholder }) => (
  <div className="campo">
    <label>{label}{required && <span className="obrig">*</span>}</label>
    <textarea name={name} value={value} onChange={onChange} required={required} placeholder={placeholder || ""} rows={4} onKeyDown={e => e.stopPropagation()} />
  </div>
);

export default function QuestionarioCaptador() {
  const [etapa, setEtapa] = useState(1);
  const [form, setForm] = useState(estadoInicial);
  const [enviado, setEnviado] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState("");

  const handleChange = useCallback(e => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  }, []);

  const avancar = e => {
    e.preventDefault();
    setEtapa(p => p + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const voltar = () => {
    setEtapa(p => p - 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.lgpd) { setErro("Você precisa aceitar os termos de uso para enviar o questionário."); return; }
    setEnviando(true);
    setErro("");
    const payload = {
      nome: form.nome, cpf: form.cpf, email: form.email, telefone: form.telefone,
      cidade: form.cidade, bairro: form.bairro, idade: form.idade,
      estado_civil: form.estado_civil, filhos: form.filhos,
      qtd_filhos: form.qtd_filhos || null, cnh: form.cnh,
      veiculo_proprio: form.veiculo_proprio, formacao: form.formacao,
      curso: form.curso, situacao_academica: form.situacao_academica || null,
      experiencia_comercial: form.experiencia_comercial,
      tempo_experiencia_comercial: form.tempo_experiencia_comercial,
      segmentos_atuados: form.segmentos_atuados,
      experiencia_credito: form.experiencia_credito,
      descricao_experiencia: form.descricao_experiencia,
      conhecimento_crm: form.conhecimento_crm,
      ferramentas_crm: form.ferramentas_crm || null,
      dominio_office: form.dominio_office,
      uso_whatsapp_profissional: form.uso_whatsapp_profissional,
      experiencia_visita_externa: form.experiencia_visita_externa,
      pretensao_salarial: form.pretensao_salarial,
      disponibilidade: form.disponibilidade,
      situacao_atual: form.situacao_atual,
      outro_processo: form.outro_processo,
      motivo_interesse: form.motivo_interesse,
      pontos_fortes: form.pontos_fortes,
      como_lida_metas: form.como_lida_metas,
      status: "novo",
    };
    const { error } = await supabase.from("candidatos_captador").insert([payload]);
    if (error) {
      setErro("Erro ao enviar. Tente novamente ou entre em contato com contato@genthe.com.br");
      setEnviando(false);
    } else {
      setEnviado(true);
    }
  };

  if (INSCRICOES_ENCERRADAS) {
    return (
      <div className="tela-central">
        <style>{estilos}</style>
        <div className="card-central">
          <div style={{ fontSize: "2.5rem", marginBottom: 14 }}>🔒</div>
          <h2>Inscrições encerradas</h2>
          <p>O período de inscrições para a vaga de <strong>Captador Comercial</strong> foi encerrado.</p>
          <p style={{ fontSize: "0.82rem", color: "#aaa", marginTop: 16 }}>Acompanhe novas oportunidades em <strong>@gentheconsultoria</strong></p>
        </div>
      </div>
    );
  }

  if (enviado) {
    return (
      <div className="tela-central">
        <style>{estilos}</style>
        <div className="card-central">
          <div className="icone-ok">✅</div>
          <h2>Questionário enviado com sucesso!</h2>
          <p>Obrigada pela participação, <strong>{form.nome.split(" ")[0]}</strong>!</p>
          <p>Suas respostas foram registradas. Entraremos em contato em breve pelo telefone ou e-mail informado.</p>
          <p style={{ fontSize: "0.82rem", color: "#aaa", marginTop: 16 }}>contato@genthe.com.br</p>
        </div>
      </div>
    );
  }

  const nomesEtapas = ["Dados Pessoais", "Formação", "Experiência", "Ferramentas", "Perfil"];

  return (
    <div style={{ background: "#f0f4f8", minHeight: "100vh" }}>
      <style>{estilos}</style>
      <div className="container">

        <div className="header">
          <div className="logo-bloco">
            <span className="logo-nome">genthe</span>
            <span className="logo-tag">GENTE QUE ENTENDE DE GENTE</span>
          </div>
          <div>
            <div className="titulo-vaga">Captador Comercial</div>
            <div className="subtitulo-vaga">Crédito e Serviços Financeiros • Dourados/MS</div>
          </div>
        </div>

        <div className="passos">
          {nomesEtapas.map((n, i) => (
            <div key={i} className={`passo${etapa === i + 1 ? " ativo" : etapa > i + 1 ? " concluido" : ""}`} title={n}>
              {etapa > i + 1 ? "✓" : i + 1}
            </div>
          ))}
        </div>

        <div className="barra-prog-wrap">
          <div className="barra-prog">
            <div className="barra-prog-fill" style={{ width: `${(etapa / 5) * 100}%` }} />
          </div>
          <span className="barra-prog-txt">Etapa {etapa} de 5</span>
        </div>

        <div className="card">
          <form onSubmit={etapa < 5 ? avancar : handleSubmit} onKeyDown={e => { if (e.key === "Enter") e.preventDefault(); }}>

            {etapa === 1 && (
              <>
                <h2 className="etapa-titulo">📋 Dados Pessoais</h2>
                <CampoTexto label="Nome completo" name="nome" value={form.nome} onChange={handleChange} required placeholder="Seu nome completo" />
                <CampoTexto label="CPF" name="cpf" value={form.cpf} onChange={handleChange} required placeholder="000.000.000-00" />
                <CampoTexto label="E-mail" name="email" value={form.email} onChange={handleChange} required type="email" placeholder="seuemail@exemplo.com" />
                <CampoTexto label="Telefone / WhatsApp" name="telefone" value={form.telefone} onChange={handleChange} required placeholder="(67) 99999-9999" />
                <CampoTexto label="Cidade" name="cidade" value={form.cidade} onChange={handleChange} required placeholder="Ex: Dourados" />
                <CampoTexto label="Bairro" name="bairro" value={form.bairro} onChange={handleChange} required placeholder="Seu bairro" />
                <CampoTexto label="Idade" name="idade" value={form.idade} onChange={handleChange} required placeholder="Ex: 30" type="number" />
                <CampoSelect label="Estado civil" name="estado_civil" value={form.estado_civil} onChange={handleChange} required opcoes={["Solteiro(a)", "Casado(a)", "Divorciado(a)", "União estável", "Viúvo(a)"]} />
                <CampoRadio label="Tem filhos?" name="filhos" value={form.filhos} onChange={handleChange} required opcoes={["Sim", "Não"]} />
                {form.filhos === "Sim" && (
                  <CampoTexto label="Quantos filhos?" name="qtd_filhos" value={form.qtd_filhos} onChange={handleChange} placeholder="Ex: 2" type="number" />
                )}
                <CampoRadio label="Possui CNH?" name="cnh" value={form.cnh} onChange={handleChange} required opcoes={["Sim, categoria B", "Sim, outra categoria", "Não possuo"]} />
                <CampoRadio label="Possui veículo próprio?" name="veiculo_proprio" value={form.veiculo_proprio} onChange={handleChange} required opcoes={["Sim", "Não"]} />
              </>
            )}

            {etapa === 2 && (
              <>
                <h2 className="etapa-titulo">🎓 Formação Acadêmica</h2>
                <CampoSelect label="Nível de escolaridade" name="formacao" value={form.formacao} onChange={handleChange} required opcoes={["Ensino Médio completo", "Superior incompleto", "Superior completo", "Pós-graduação incompleta", "Pós-graduação completa"]} />
                <CampoTexto label="Curso de graduação (atual ou concluído)" name="curso" value={form.curso} onChange={handleChange} required placeholder="Ex: Administração, Gestão Comercial, Marketing..." />
                {(form.formacao === "Superior incompleto" || form.formacao === "Pós-graduação incompleta") && (
                  <CampoSelect label="Situação atual do curso" name="situacao_academica" value={form.situacao_academica} onChange={handleChange} opcoes={["Cursando — período matutino", "Cursando — período vespertino", "Cursando — período noturno", "Cursando — EAD", "Trancado"]} />
                )}
              </>
            )}

            {etapa === 3 && (
              <>
                <h2 className="etapa-titulo">💼 Experiência Profissional</h2>
                <CampoRadio label="Possui experiência na área comercial ou em vendas?" name="experiencia_comercial" value={form.experiencia_comercial} onChange={handleChange} required opcoes={["Sim", "Não"]} />
                {form.experiencia_comercial === "Sim" && (
                  <>
                    <CampoSelect label="Tempo de experiência comercial" name="tempo_experiencia_comercial" value={form.tempo_experiencia_comercial} onChange={handleChange} required opcoes={["Menos de 1 ano", "Entre 1 e 2 anos", "Entre 2 e 5 anos", "Mais de 5 anos"]} />
                    <CampoTexto label="Em quais segmentos você atuou comercialmente?" name="segmentos_atuados" value={form.segmentos_atuados} onChange={handleChange} placeholder="Ex: financeiro, varejo, serviços, agronegócio..." />
                  </>
                )}
                <CampoRadio label="Já trabalhou com crédito, financiamento ou serviços financeiros?" name="experiencia_credito" value={form.experiencia_credito} onChange={handleChange} required opcoes={["Sim", "Não"]} />
                <CampoTextarea label="Descreva sua principal experiência profissional (empresa, cargo e atividades)" name="descricao_experiencia" value={form.descricao_experiencia} onChange={handleChange} required placeholder="Relate onde trabalhou, quanto tempo e o que fazia no dia a dia..." />
              </>
            )}

            {etapa === 4 && (
              <>
                <h2 className="etapa-titulo">🛠️ Habilidades e Ferramentas</h2>
                <CampoRadio label="Possui conhecimento em ferramentas de CRM?" name="conhecimento_crm" value={form.conhecimento_crm} onChange={handleChange} required opcoes={["Sim", "Não", "Conheço superficialmente"]} />
                {form.conhecimento_crm === "Sim" && (
                  <CampoTexto label="Quais ferramentas de CRM você utilizou?" name="ferramentas_crm" value={form.ferramentas_crm} onChange={handleChange} placeholder="Ex: HubSpot, Pipedrive, RD Station..." />
                )}
                <CampoSelect label="Nível de domínio no Pacote Office (Excel, Word)" name="dominio_office" value={form.dominio_office} onChange={handleChange} required opcoes={["Básico", "Intermediário", "Avançado"]} />
                <CampoRadio label="Utiliza WhatsApp de forma profissional para prospecção ou atendimento?" name="uso_whatsapp_profissional" value={form.uso_whatsapp_profissional} onChange={handleChange} required opcoes={["Sim, regularmente", "Sim, eventualmente", "Não utilizo para fins profissionais"]} />
                <CampoRadio label="Possui experiência com visitas externas a clientes?" name="experiencia_visita_externa" value={form.experiencia_visita_externa} onChange={handleChange} required opcoes={["Sim, com frequência", "Sim, esporadicamente", "Não possuo essa experiência"]} />
              </>
            )}

            {etapa === 5 && (
              <>
                <h2 className="etapa-titulo">🎯 Perfil e Motivação</h2>
                <CampoTexto label="Qual é a sua pretensão salarial?" name="pretensao_salarial" value={form.pretensao_salarial} onChange={handleChange} required placeholder="Ex: R$ 3.500,00" />
                <CampoSelect label="Disponibilidade para início" name="disponibilidade" value={form.disponibilidade} onChange={handleChange} required opcoes={["Imediata", "Em até 15 dias", "Em até 30 dias", "Mais de 30 dias"]} />
                <CampoSelect label="Situação profissional atual" name="situacao_atual" value={form.situacao_atual} onChange={handleChange} required opcoes={["Empregado(a) com carteira assinada", "Desempregado(a)", "Autônomo(a) / Freelancer", "Empresário(a)", "Estudante"]} />
                <CampoRadio label="Está participando de outros processos seletivos?" name="outro_processo" value={form.outro_processo} onChange={handleChange} required opcoes={["Sim", "Não"]} />
                <CampoTextarea label="Por que você tem interesse nesta vaga?" name="motivo_interesse" value={form.motivo_interesse} onChange={handleChange} required placeholder="Conte um pouco sobre sua motivação e expectativas para esta oportunidade..." />
                <CampoTextarea label="Quais são seus principais pontos fortes para atuar como Captador Comercial?" name="pontos_fortes" value={form.pontos_fortes} onChange={handleChange} required placeholder="Descreva habilidades e experiências que considera diferenciais para esta função..." />
                <CampoTextarea label="Como você lida com metas comerciais? Relate uma experiência real." name="como_lida_metas" value={form.como_lida_metas} onChange={handleChange} required placeholder="Relate uma experiência com metas, resultados obtidos e como superou desafios..." />

                <div className="lgpd-box">
                  <label>
                    <input type="checkbox" name="lgpd" checked={form.lgpd} onChange={handleChange} required />
                    <span>
                      Autorizo o uso dos meus dados pessoais para fins de participação neste processo seletivo,
                      de acordo com a Lei 13.709/2018 (LGPD). Os dados serão utilizados exclusivamente pela
                      Genthe Consultoria para avaliação da candidatura e eventual comunicação sobre o processo.
                      Para exercer seus direitos de acesso, correção ou exclusão dos dados, entre em contato:
                      <strong> contato@genthe.com.br</strong>
                    </span>
                  </label>
                </div>

                {erro && <p className="msg-erro">{erro}</p>}
              </>
            )}

            <div className="btns">
              {etapa > 1 && <button type="button" className="btn-voltar" onClick={voltar}>← Voltar</button>}
              <button type="submit" className="btn-avancar" disabled={enviando}>
                {etapa < 5 ? "Avançar →" : enviando ? "Enviando..." : "Enviar questionário ✓"}
              </button>
            </div>
          </form>
        </div>

        <div className="rodape">
          <span>@gentheconsultoria</span><span>|</span><span>contato@genthe.com.br</span>
        </div>
      </div>
    </div>
  );
}
