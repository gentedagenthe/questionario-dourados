-- ============================================================
-- Genthe Consultoria — Captador Comercial (Dourados/MS)
-- Executar no SQL Editor do Supabase
-- ============================================================

CREATE TABLE IF NOT EXISTS candidatos_captador (
  id                          BIGSERIAL PRIMARY KEY,
  created_at                  TIMESTAMPTZ DEFAULT NOW(),
  nome                        TEXT NOT NULL,
  cpf                         TEXT,
  email                       TEXT,
  telefone                    TEXT,
  cidade                      TEXT,
  bairro                      TEXT,
  idade                       TEXT,
  estado_civil                TEXT,
  filhos                      TEXT,
  qtd_filhos                  TEXT,
  cnh                         TEXT,
  veiculo_proprio             TEXT,
  formacao                    TEXT,
  curso                       TEXT,
  situacao_academica          TEXT,
  experiencia_comercial       TEXT,
  tempo_experiencia_comercial TEXT,
  segmentos_atuados           TEXT,
  experiencia_credito         TEXT,
  descricao_experiencia       TEXT,
  conhecimento_crm            TEXT,
  ferramentas_crm             TEXT,
  dominio_office              TEXT,
  uso_whatsapp_profissional   TEXT,
  experiencia_visita_externa  TEXT,
  pretensao_salarial          TEXT,
  disponibilidade             TEXT,
  situacao_atual              TEXT,
  outro_processo              TEXT,
  motivo_interesse            TEXT,
  pontos_fortes               TEXT,
  como_lida_metas             TEXT,
  status                      TEXT DEFAULT 'novo'
);

-- RLS
ALTER TABLE candidatos_captador ENABLE ROW LEVEL SECURITY;

CREATE POLICY "insert_anon" ON candidatos_captador
  FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "select_anon" ON candidatos_captador
  FOR SELECT TO anon USING (true);

CREATE POLICY "update_anon" ON candidatos_captador
  FOR UPDATE TO anon USING (true) WITH CHECK (true);
