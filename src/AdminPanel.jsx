import { useState, useEffect, useCallback } from "react";
import { supabase } from "./supabaseClient";

const SENHA = process.env.REACT_APP_ADMIN_PASSWORD || "genthe2024";

const estilos = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Segoe UI', Arial, sans-serif; background: #f0f4f8; }
  .admin-wrap { max-width: 960px; margin: 0 auto; padding: 20px 16px 48px; }
  .admin-header { display: flex; align-items: center; justify-content: space-between; padding-bottom: 14px; border-bottom: 3px solid #1B6FAB; margin-bottom: 20px; }
  .admin-header h1 { font-size: 1.3rem; color: #1B6FAB; }
  .admin-subtitulo { font-size: 0.82rem; color: #777; margin-top: 2px; }
  .btn-att { background: #1B6FAB; color: #fff; border: none; padding: 8px 18px; border-radius: 8px; cursor: pointer; font-weight: 700; font-family: inherit; font-size: 0.88rem; }
  .btn-att:hover { opacity: 0.85; }
  .stats { display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 20px; }
  .stat { background: #fff; border: 1px solid #D4E6F1; border-radius: 10px; padding: 12px 18px; text-align: center; min-width: 80px; }
  .stat-n { font-size: 1.6rem; font-weight: 800; color: #1B6FAB; display: block; }
  .stat-l { font-size: 0.72rem; color: #888; }
  .filtros { margin-bottom: 16px; display: flex; flex-direction: column; gap: 10px; }
  .busca { padding: 9px 13px; border: 1.5px solid #D4E6F1; border-radius: 8px; font-size: 0.9rem; font-family: inherit; width: 100%; outline: none; }
  .busca:focus { border-color: #1B6FAB; }
  .filtro-btns { display: flex; flex-wrap: wrap; gap: 8px; }
  .fbtn { background: #fff; border: 1px solid #D4E6F1; color: #666; padding: 5px 13px; border-radius: 20px; font-size: 0.78rem; font-weight: 700; cursor: pointer; font-family: inherit; }
  .fbtn.ativo { background: #ebf4fb; color: #1B6FAB; border-color: #1B6FAB; }
  .lista { display: flex; flex-direction: column; gap: 10px; }
  .cand-card { background: #fff; border: 1px solid #D4E6F1; border-radius: 10px; overflow: hidden; }
  .cand-topo { display: flex; align-items: center; justify-content: space-between; padding: 13px 16px; cursor: pointer; gap: 12px; }
  .cand-topo:hover { background: #f8fbfe; }
  .cand-nome { font-weight: 700; font-size: 0.95rem; color: #1a1a2e; }
  .cand-sub { font-size: 0.79rem; color: #777; margin-top: 2px; }
  .cand-acoes { display: flex; align-items: center; gap: 10px; flex-shrink: 0; }
  .badge { padding: 3px 11px; border-radius: 20px; font-size: 0.76rem; font-weight: 700; white-space: nowrap; border: 1px solid; }
  .badge-novo { background: #ebf4fb; color: #1B6FAB; border-color: #1B6FAB; }
  .badge-em_analise { background: #FEF3C7; color: #d97706; border-color: #d97706; }
  .badge-aprovado { background: #DCFCE7; color: #16a34a; border-color: #16a34a; }
  .badge-entrevista { background: #EDE9FE; color: #7c3aed; border-color: #7c3aed; }
  .badge-reprovado { background: #FEE2E2; color: #dc2626; border-color: #dc2626; }
  .badge-desistiu { background: #F3F4F6; color: #6b7280; border-color: #6b7280; }
  .seta { color: #1B6FAB; font-size: 0.72rem; }
  .cand-detalhe { border-top: 1px solid #D4E6F1; padding: 16px; background: #fafcff; display: flex; flex-direction: column; gap: 13px; }
  .secao { background: #fff; border: 1px solid #D4E6F1; border-radius: 8px; padding: 12px 14px; }
  .secao h4 { color: #1B6FAB; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 10px; padding-bottom: 6px; border-bottom: 1px solid #f0f4f8; }
  .di { display: flex; gap: 8px; margin-bottom: 6px; font-size: 0.86rem; align-items: flex-start; }
  .di-r { color: #999; min-width: 170px; flex-shrink: 0; }
  .di-v { color: #222; line-height: 1.45; }
  .status-btns { display: flex; flex-wrap: wrap; gap: 7px; margin-top: 4px; }
  .sbtn { padding: 5px 13px; border-radius: 20px; font-size: 0.78rem; font-weight: 700; cursor: pointer; font-family: inherit; border: 1.5px solid; }
  .sbtn:disabled { opacity: 0.45; cursor: default; }
  .wabtn { display: inline-block; background: #25D366; color: #fff; font-weight: 700; text-decoration: none; padding: 10px 20px; border-radius: 8px; font-size: 0.9rem; text-align: center; }
  .wabtn:hover { opacity: 0.88; }
  .vazio { text-align: center; color: #aaa; margin: 32px 0; }
  .login-wrap { min-height: 100vh; display: flex; align-items: center; justify-content: center; background: #f0f4f8; font-family: 'Segoe UI', Arial, sans-serif; }
  .login-card { background: #fff; border-radius: 14px; padding: 40px 32px; max-width: 360px; width: 100%; text-align: center; border: 1px solid #D4E6F1; }
  .login-card h2 { color: #1B6FAB; margin-bottom: 6px; }
  .login-card p { color: #888; font-size: 0.84rem; margin-bottom: 20px; }
  .login-card input { width: 100%; padding: 10px 13px; border: 1.5px solid #D4E6F1; border-radius: 8px; font-size: 0.93rem; margin-bottom: 12px; outline: none; font-family: inherit; }
  .login-card input:focus { border-color: #1B6FAB; }
  .login-card button { width: 100%; background: #1B6FAB; color: #fff; border: none; padding: 11px; border-radius: 8px; font-size: 1rem; font-weight: 700; cursor: pointer; font-family: inherit; }
  .login-card button:hover { opacity: 0.88; }
  .erro-login { color: #c0392b; font-size: 0.84rem; margin-bottom: 10px; }
  .admin-rodape { text-align: center; color: #bbb; font-size: 0.78rem; margin-top: 32px; }
`;

const STATUS_CONFIG = {
  novo:       { label: "Novo",       cor: "#1B6FAB", fundo: "#ebf4fb" },
  em_analise: { label: "Em análise", cor: "#d97706", fundo: "#FEF3C7" },
  aprovado:   { label: "Aprovado",   cor: "#16a34a", fundo: "#DCFCE7" },
  entrevista: { label: "Entrevista", cor: "#7c3aed", fundo: "#EDE9FE" },
  reprovado:  { label: "Reprovado",  cor: "#dc2626", fundo: "#FEE2E2" },
  desistiu:   { label: "Desistiu",   cor: "#6b7280", fundo: "#F3F4F6" },
};

const Di = ({ r, v }) => {
  if (!v && v !== 0) return null;
  return (
    <div className="di">
      <span className="di-r">{r}</span>
      <span className="di-v">{v}</span>
    </div>
  );
};

export default function AdminPanel() {
  const [auth, setAuth] = useState(false);
  const [senha, setSenha] = useState("");
  const [errSenha, setErrSenha] = useState("");
  const [candidatos, setCandidatos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [expandido, setExpandido] = useState(null);
  const [filtroStatus, setFiltroStatus] = useState("todos");
  const [busca, setBusca] = useState("");
  const [atualizando, setAtualizando] = useState(null);

  const entrar = () => {
    if (senha === SENHA) { setAuth(true); }
    else { setErrSenha("Senha incorreta."); }
  };

  const buscarCandidatos = useCallback(async () => {
    setCarregando(true);
    const { data, error } = await supabase
      .from("candidatos_captador")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error) setCandidatos(data || []);
    setCarregando(false);
  }, []);

  useEffect(() => { if (auth) buscarCandidatos(); }, [auth, buscarCandidatos]);

  const atualizarStatus = async (id, novoStatus) => {
    setAtualizando(id);
    const { error } = await supabase.from("candidatos_captador").update({ status: novoStatus }).eq("id", id);
    if (!error) setCandidatos(prev => prev.map(c => c.id === id ? { ...c, status: novoStatus } : c));
    setAtualizando(null);
  };

  const gerarWA = c => {
    const msg = `Olá, ${c.nome.split(" ")[0]}! Tudo bem?\n\nSou da Genthe Consultoria e estou entrando em contato referente à sua candidatura para a vaga de *Captador Comercial* em Dourados/MS.\n\nGostaríamos de dar continuidade ao seu processo seletivo. Você tem disponibilidade para conversarmos?`;
    const tel = c.telefone.replace(/\D/g, "");
    return `https://wa.me/55${tel}?text=${encodeURIComponent(msg)}`;
  };

  const filtrados = candidatos.filter(c => {
    const s = filtroStatus === "todos" || c.status === filtroStatus;
    const b = !busca || c.nome?.toLowerCase().includes(busca.toLowerCase()) || c.email?.toLowerCase().includes(busca.toLowerCase());
    return s && b;
  });

  const contar = s => candidatos.filter(c => c.status === s).length;

  if (!auth) {
    return (
      <div className="login-wrap">
        <style>{estilos}</style>
        <div className="login-card">
          <h2>🔒 Painel Administrativo</h2>
          <p>Captador Comercial — Dourados/MS</p>
          <input type="password" placeholder="Senha de acesso" value={senha} onChange={e => setSenha(e.target.value)} onKeyDown={e => { if (e.key === "Enter") entrar(); }} />
          {errSenha && <p className="erro-login">{errSenha}</p>}
          <button onClick={entrar}>Entrar</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: "#f0f4f8", minHeight: "100vh" }}>
      <style>{estilos}</style>
      <div className="admin-wrap">
        <div className="admin-header">
          <div>
            <h1>Painel Genthe</h1>
            <div className="admin-subtitulo">Captador Comercial • Dourados/MS</div>
          </div>
          <button className="btn-att" onClick={buscarCandidatos}>↻ Atualizar</button>
        </div>

        <div className="stats">
          <div className="stat"><span className="stat-n">{candidatos.length}</span><span className="stat-l">Total</span></div>
          {Object.entries(STATUS_CONFIG).map(([k, v]) => (
            <div key={k} className="stat" style={{ borderTop: `3px solid ${v.cor}` }}>
              <span className="stat-n" style={{ color: v.cor }}>{contar(k)}</span>
              <span className="stat-l">{v.label}</span>
            </div>
          ))}
        </div>

        <div className="filtros">
          <input className="busca" type="text" placeholder="🔍 Buscar por nome ou e-mail..." value={busca} onChange={e => setBusca(e.target.value)} />
          <div className="filtro-btns">
            <button className={`fbtn${filtroStatus === "todos" ? " ativo" : ""}`} onClick={() => setFiltroStatus("todos")}>Todos ({candidatos.length})</button>
            {Object.entries(STATUS_CONFIG).map(([k, v]) => (
              <button key={k} className={`fbtn${filtroStatus === k ? " ativo" : ""}`} onClick={() => setFiltroStatus(k)}
                style={filtroStatus === k ? { background: v.fundo, color: v.cor, borderColor: v.cor } : {}}>
                {v.label} ({contar(k)})
              </button>
            ))}
          </div>
        </div>

        {carregando ? <p className="vazio">Carregando candidatos...</p> :
         filtrados.length === 0 ? <p className="vazio">Nenhum candidato encontrado.</p> : (
          <div className="lista">
            {filtrados.map(c => (
              <div key={c.id} className="cand-card">
                <div className="cand-topo" onClick={() => setExpandido(expandido === c.id ? null : c.id)}>
                  <div>
                    <div className="cand-nome">{c.nome}</div>
                    <div className="cand-sub">{c.cidade} • {c.telefone}</div>
                    <div className="cand-sub">{c.email}</div>
                  </div>
                  <div className="cand-acoes">
                    <span className={`badge badge-${c.status || "novo"}`}>{STATUS_CONFIG[c.status]?.label || "Novo"}</span>
                    <span className="seta">{expandido === c.id ? "▲" : "▼"}</span>
                  </div>
                </div>

                {expandido === c.id && (
                  <div className="cand-detalhe">
                    <div className="secao">
                      <h4>Dados Pessoais</h4>
                      <Di r="CPF" v={c.cpf} />
                      <Di r="Idade" v={c.idade} />
                      <Di r="Estado civil" v={c.estado_civil} />
                      <Di r="Filhos" v={c.filhos === "Sim" ? `Sim — ${c.qtd_filhos || "?"}` : "Não"} />
                      <Di r="CNH" v={c.cnh} />
                      <Di r="Veículo próprio" v={c.veiculo_proprio} />
                    </div>
                    <div className="secao">
                      <h4>Formação</h4>
                      <Di r="Escolaridade" v={c.formacao} />
                      <Di r="Curso" v={c.curso} />
                      <Di r="Situação acadêmica" v={c.situacao_academica} />
                    </div>
                    <div className="secao">
                      <h4>Experiência</h4>
                      <Di r="Experiência comercial" v={c.experiencia_comercial} />
                      <Di r="Tempo comercial" v={c.tempo_experiencia_comercial} />
                      <Di r="Segmentos atuados" v={c.segmentos_atuados} />
                      <Di r="Experiência em crédito" v={c.experiencia_credito} />
                      <Di r="Descrição" v={c.descricao_experiencia} />
                    </div>
                    <div className="secao">
                      <h4>Ferramentas e Habilidades</h4>
                      <Di r="Conhece CRM" v={c.conhecimento_crm} />
                      <Di r="Ferramentas CRM" v={c.ferramentas_crm} />
                      <Di r="Domínio Office" v={c.dominio_office} />
                      <Di r="WhatsApp profissional" v={c.uso_whatsapp_profissional} />
                      <Di r="Visita externa" v={c.experiencia_visita_externa} />
                    </div>
                    <div className="secao">
                      <h4>Perfil e Motivação</h4>
                      <Di r="Pretensão salarial" v={c.pretensao_salarial} />
                      <Di r="Disponibilidade" v={c.disponibilidade} />
                      <Di r="Situação atual" v={c.situacao_atual} />
                      <Di r="Outros processos" v={c.outro_processo} />
                      <Di r="Motivo de interesse" v={c.motivo_interesse} />
                      <Di r="Pontos fortes" v={c.pontos_fortes} />
                      <Di r="Como lida com metas" v={c.como_lida_metas} />
                    </div>
                    <div className="secao">
                      <h4>Alterar status</h4>
                      <div className="status-btns">
                        {Object.entries(STATUS_CONFIG).map(([k, v]) => (
                          <button key={k} className="sbtn"
                            onClick={() => atualizarStatus(c.id, k)}
                            disabled={c.status === k || atualizando === c.id}
                            style={{ background: c.status === k ? v.fundo : "#fff", color: v.cor, borderColor: v.cor }}>
                            {v.label}
                          </button>
                        ))}
                      </div>
                    </div>
                    <a className="wabtn" href={gerarWA(c)} target="_blank" rel="noreferrer">💬 Contatar via WhatsApp</a>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="admin-rodape">@gentheconsultoria | contato@genthe.com.br</div>
      </div>
    </div>
  );
}
