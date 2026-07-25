import React, { useEffect, useState } from 'react';

import api from '../../services/api';
import Button from '../../components/button';
import { platformOptions } from '../../constants/gameOptions';
import {
  Container,
  Header,
  Section,
  CurrentList,
  CurrentItem,
  Order,
  Cover,
  GameInfo,
  CompleteButton,
  Builder,
  AvailableList,
  AvailableGame,
  PlanDraft,
  DraftItem,
  PlatformSelect,
  OrderActions,
  SmallButton,
  Feedback,
  Empty,
} from './style';

function coverUrl(game){
  if(game.coverSource === 'steam' && game.steamAppId){
    return `https://cdn.cloudflare.steamstatic.com/steam/apps/${game.steamAppId}/library_600x900.jpg`;
  }
  return game.coverUrl || `${api.defaults.baseURL}/img/${game.photo}`;
}

export default function GamePlan(){
  const [plan, setPlan] = useState({ items: [] });
  const [eligible, setEligible] = useState([]);
  const [draft, setDraft] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [completingId, setCompletingId] = useState('');
  const [feedback, setFeedback] = useState('');

  async function loadData(){
    try {
      const [planResponse, eligibleResponse] = await Promise.all([
        api.get('/game-plan'),
        api.get('/game-plan/eligible'),
      ]);
      setPlan(planResponse.data);
      setEligible(eligibleResponse.data);
      setFeedback('');
    } catch (error) {
      setFeedback('Não foi possível carregar o plano de jogo.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadData(); }, []);

  function toggleGame(game){
    setDraft(current => {
      const exists = current.some(item => item.game._id === game._id);
      if(exists) return current.filter(item => item.game._id !== game._id);
      return [...current, { game, platform: game.steamPlaytimeMinutes != null ? 'Steam' : '' }];
    });
  }

  function changePlatform(gameId, platform){
    setDraft(current => current.map(item => item.game._id === gameId ? { ...item, platform } : item));
  }

  function move(gameId, direction){
    setDraft(current => {
      const index = current.findIndex(item => item.game._id === gameId);
      const target = index + direction;
      if(index < 0 || target < 0 || target >= current.length) return current;
      const next = [...current];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  async function savePlan(){
    if(!draft.length){
      setFeedback('Selecione pelo menos um jogo para o plano.');
      return;
    }
    if(draft.some(item => !item.platform)){
      setFeedback('Informe a plataforma de todos os jogos selecionados.');
      return;
    }
    if(plan.items && plan.items.length && !window.confirm('Já existe um plano de jogo. Ao continuar, ele será descartado e substituído pelo novo plano. Deseja continuar?')){
      return;
    }

    setSaving(true);
    setFeedback('');
    try {
      const response = await api.put('/game-plan', {
        items: draft.map(item => ({ gameId: item.game._id, platform: item.platform })),
      });
      setPlan(response.data);
      setDraft([]);
      setFeedback('Plano de jogo salvo com sucesso.');
    } catch (error) {
      const message = error.response && error.response.data && error.response.data.error;
      setFeedback(message || 'Não foi possível salvar o plano de jogo.');
    } finally {
      setSaving(false);
    }
  }

  async function completeGame(game){
    if(!window.confirm(`Marcar "${game.name}" como zerado e removê-lo do plano?`)) return;
    setCompletingId(game._id);
    setFeedback('');
    try {
      const response = await api.patch(`/game-plan/items/${game._id}/complete`);
      setPlan(response.data.plan);
      setEligible(current => current.filter(item => item._id !== game._id));
      setDraft(current => current.filter(item => item.game._id !== game._id));
      setFeedback(`${game.name} foi marcado como zerado.`);
    } catch (error) {
      const message = error.response && error.response.data && error.response.data.error;
      setFeedback(message || 'Não foi possível concluir o jogo.');
    } finally {
      setCompletingId('');
    }
  }

  const currentItems = (plan.items || []).filter(item => item.game);

  return (
    <Container>
      <Header><h1>Plano de jogo</h1><p>Organize a sequência dos próximos jogos que você pretende concluir.</p></Header>
      {feedback && <Feedback>{feedback}</Feedback>}

      <Section>
        <h2>Plano atual</h2>
        {loading ? <Empty>Carregando...</Empty> : !currentItems.length ? <Empty>Nenhum plano de jogo ativo.</Empty> : (
          <CurrentList>
            {currentItems.map((item, index) => (
              <CurrentItem key={item.game._id}>
                <Order>{index + 1}</Order>
                <Cover src={coverUrl(item.game)} alt={`Capa de ${item.game.name}`} />
                <GameInfo><strong>{item.game.name}</strong><span>Jogar em: {item.platform}</span></GameInfo>
                <CompleteButton type="button" onClick={() => completeGame(item.game)} disabled={Boolean(completingId)}>
                  {completingId === item.game._id ? 'Concluindo...' : 'Marcar como zerado'}
                </CompleteButton>
              </CurrentItem>
            ))}
          </CurrentList>
        )}
      </Section>

      <Section>
        <h2>Criar novo plano</h2>
        <p>Selecione apenas jogos em progresso. A ordem escolhida será a ordem do plano.</p>
        <Builder>
          <div>
            <h3>Jogos disponíveis</h3>
            <AvailableList>
              {eligible.map(game => {
                const selected = draft.some(item => item.game._id === game._id);
                return (
                  <AvailableGame key={game._id} type="button" aria-pressed={selected} onClick={() => toggleGame(game)}>
                    <Cover src={coverUrl(game)} alt="" /><span>{game.name}</span><strong>{selected ? 'Remover' : 'Adicionar'}</strong>
                  </AvailableGame>
                );
              })}
              {!eligible.length && <Empty>Não há jogos em progresso disponíveis.</Empty>}
            </AvailableList>
          </div>

          <div>
            <h3>Sequência do novo plano</h3>
            <PlanDraft>
              {draft.map((item, index) => (
                <DraftItem key={item.game._id}>
                  <Order>{index + 1}</Order>
                  <div><strong>{item.game.name}</strong>
                    <PlatformSelect value={item.platform} onChange={event => changePlatform(item.game._id, event.target.value)}>
                      {platformOptions.map(option => <option key={option.id || 'empty'} value={option.id}>{option.title}</option>)}
                    </PlatformSelect>
                  </div>
                  <OrderActions>
                    <SmallButton type="button" onClick={() => move(item.game._id, -1)} disabled={index === 0}>↑</SmallButton>
                    <SmallButton type="button" onClick={() => move(item.game._id, 1)} disabled={index === draft.length - 1}>↓</SmallButton>
                  </OrderActions>
                </DraftItem>
              ))}
              {!draft.length && <Empty>Adicione jogos para montar a sequência.</Empty>}
            </PlanDraft>
            <Button type="button" onClick={savePlan} disabled={saving}>{saving ? 'Salvando...' : plan.items && plan.items.length ? 'Substituir plano atual' : 'Criar plano'}</Button>
          </div>
        </Builder>
      </Section>
    </Container>
  );
}
