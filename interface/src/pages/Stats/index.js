import React, { useEffect, useState } from 'react';

import api from '../../services/api';
import PieChart from '../../components/PieChart';
import {
  Container,
  Header,
  Grid,
  Card,
  Value,
  Label,
  Detail,
  UpdatedAt,
  Feedback,
  ChartsGrid,
  ChartCard,
  BackupSection,
  BackupActions,
  BackupButton,
  HiddenFileInput,
} from './style';

const platformColors = [
  '#ff6600', '#00b8a9', '#ffca3a', '#6c63ff', '#ef476f',
  '#4cc9f0', '#8ac926', '#f72585', '#9b5de5', '#00f5d4',
  '#fb8500', '#90be6d', '#577590', '#f94144', '#43aa8b',
];

export default function Stats(){
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');
  const [backupFeedback, setBackupFeedback] = useState('');
  const [exporting, setExporting] = useState(false);
  const [importing, setImporting] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadStats(){
      try {
        const response = await api.get('/stats');
        if(isMounted){
          setStats(response.data);
          setError('');
        }
      } catch (requestError) {
        if(isMounted) setError('Não foi possível carregar as estatísticas.');
      }
    }

    loadStats();
    const interval = setInterval(loadStats, 30000);
    return () => { isMounted = false; clearInterval(interval); };
  }, []);

  async function exportDataGame(){
    setExporting(true);
    setBackupFeedback('');

    try {
      const response = await api.get('/backup/export', { responseType: 'blob' });
      const downloadUrl = window.URL.createObjectURL(response.data);
      const link = document.createElement('a');
      const disposition = response.headers['content-disposition'] || '';
      const fileNameMatch = disposition.match(/filename="?([^"]+)"?/);

      link.href = downloadUrl;
      link.download = fileNameMatch ? fileNameMatch[1] : 'datagame-backup.datagame';
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(downloadUrl);
      setBackupFeedback('Backup exportado com sucesso.');
    } catch (requestError) {
      setBackupFeedback('Não foi possível exportar os dados do DataGame.');
    } finally {
      setExporting(false);
    }
  }

  async function importDataGame(event){
    const file = event.target.files && event.target.files[0];
    event.target.value = '';

    if(!file) return;

    const confirmed = window.confirm(
      'A importação substituirá todos os jogos e o plano de jogo atuais. Deseja continuar?'
    );
    if(!confirmed) return;

    const data = new FormData();
    data.append('backup', file);
    setImporting(true);
    setBackupFeedback('Importando backup...');

    try {
      const response = await api.post('/backup/import', data);
      setBackupFeedback(
        `${response.data.message}. ${response.data.games} jogo(s) restaurado(s).`
      );
      const statsResponse = await api.get('/stats');
      setStats(statsResponse.data);
      setError('');
    } catch (requestError) {
      const message = requestError.response
        && requestError.response.data
        && requestError.response.data.error;
      setBackupFeedback(message || 'Não foi possível importar o backup.');
    } finally {
      setImporting(false);
    }
  }

  return (
    <Container>
      <Header>
        <div><h1>Estatísticas</h1><p>Um resumo atualizado da sua lista de jogos.</p></div>
        {stats && <UpdatedAt>Atualizado às {new Date(stats.updatedAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</UpdatedAt>}
      </Header>

      {error && <Feedback>{error}</Feedback>}
      {!stats && !error && <Feedback>Carregando estatísticas...</Feedback>}

      {stats && (
        <Grid>
          <Card><Label>Jogos cadastrados</Label><Value>{stats.total}</Value><Detail>Total da sua coleção</Detail></Card>
          <Card><Label>Jogos zerados</Label><Value>{stats.finished}</Value><Detail>Primeiras conclusões registradas</Detail></Card>
          <Card><Label>Em progresso</Label><Value>{stats.progress}</Value><Detail>Jogos que você está jogando</Detail></Card>
          <Card featured>
            <Label>Plataforma com mais jogos zerados</Label>
            <Value small>{stats.topPlatform ? stats.topPlatform.name : '—'}</Value>
            <Detail>{stats.topPlatform ? `${stats.topPlatform.count} ${stats.topPlatform.count === 1 ? 'jogo zerado' : 'jogos zerados'}` : 'Nenhuma plataforma registrada'}</Detail>
          </Card>
          <Card featured>
            <Label>Ano com mais jogos zerados</Label>
            <Value small>{stats.topYear ? stats.topYear.year : '—'}</Value>
            <Detail>{stats.topYear ? `${stats.topYear.count} ${stats.topYear.count === 1 ? 'jogo zerado' : 'jogos zerados'}` : 'Nenhum ano registrado'}</Detail>
          </Card>
        </Grid>
      )}

      {stats && (
        <ChartsGrid>
          <ChartCard>
            <h2>Status dos jogos</h2>
            <p>Proporção entre jogos zerados e em progresso.</p>
            <PieChart items={[
              { label: 'Zerados', value: stats.finished, color: '#ff6600' },
              { label: 'Em progresso', value: stats.progress, color: '#00b8a9' },
            ]} />
          </ChartCard>

          <ChartCard>
            <h2>Jogos zerados por plataforma</h2>
            <p>Distribuição da plataforma da primeira conclusão.</p>
            <PieChart items={(stats.platformDistribution || []).map((platform, index) => ({
              label: platform.name,
              value: platform.count,
              color: platformColors[index % platformColors.length],
            }))} />
          </ChartCard>
        </ChartsGrid>
      )}

      <BackupSection>
        <div>
          <h2>Backup do DataGame</h2>
          <p>Exporte ou restaure os dados armazenados no MongoDB.</p>
        </div>
        <BackupActions>
          <BackupButton type="button" onClick={exportDataGame} disabled={exporting || importing}>
            {exporting ? 'Exportando...' : 'Exportar DataGame'}
          </BackupButton>
          <BackupButton as="label" disabled={exporting || importing}>
            {importing ? 'Importando...' : 'Importar DataGame'}
            <HiddenFileInput
              type="file"
              accept=".datagame,application/json"
              disabled={exporting || importing}
              onChange={importDataGame}
            />
          </BackupButton>
        </BackupActions>
        {backupFeedback && <Feedback>{backupFeedback}</Feedback>}
      </BackupSection>
    </Container>
  );
}
