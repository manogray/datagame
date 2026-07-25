import React, { useEffect, useRef, useState } from 'react';
import filesize from 'filesize';
import { Link, useHistory, useParams } from 'react-router-dom';

import Upload from '../../components/Upload';
import FileImage from '../../components/FileImage';
import Button from '../../components/button';
import api from '../../services/api';
import { platformOptions, statusOptions } from '../../constants/gameOptions';

import {
  Container,
  MyInput,
  MyForm,
  UploadBox,
  InputContainer,
  SearchArea,
  SearchControls,
  SearchInput,
  Results,
  Result,
  ResultImage,
  ResultInfo,
  SelectedCover,
  Feedback,
  Attribution,
  SourceOptions,
  SourceButton,
  MySelect,
} from '../CreateGame/style';
import { Actions, CurrentCover, DeleteButton, BackLink, SteamInfo } from './style';

export default function EditGame(){
  const { id } = useParams();
  const formRef = useRef(null);
  const history = useHistory();
  const [game, setGame] = useState(null);
  const [gameStatus, setGameStatus] = useState('progress');
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchSource, setSearchSource] = useState('rawg');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedGame, setSelectedGame] = useState(null);
  const [searching, setSearching] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    async function loadGame(){
      try {
        const response = await api.get(`/games/${id}`);
        setGame(response.data);
        setGameStatus(response.data.status);
      } catch (error) {
        setFeedback('Jogo não encontrado.');
      }
    }

    loadGame();
  }, [id]);

  useEffect(() => () => {
    uploadedFiles.forEach(file => URL.revokeObjectURL(file.preview));
  }, [uploadedFiles]);

  function currentCover(){
    if(!game) return '';
    if(game.coverSource === 'steam' && game.steamAppId){
      return `https://cdn.cloudflare.steamstatic.com/steam/apps/${game.steamAppId}/library_600x900.jpg`;
    }
    return game.coverUrl || `${api.defaults.baseURL}/img/${game.photo}`;
  }

  function handleUpload(files){
    uploadedFiles.forEach(file => URL.revokeObjectURL(file.preview));
    const newFiles = files.slice(0, 1).map(file => ({
      file,
      name: file.name,
      readableSize: filesize(file.size),
      preview: URL.createObjectURL(file),
    }));

    setUploadedFiles(newFiles);
    setSelectedGame(null);
    setFeedback('A imagem enviada substituirá a capa atual ao salvar.');
  }

  async function handleSearch(){
    const query = searchQuery.trim();
    if(query.length < 2){
      setFeedback('Digite pelo menos 2 caracteres para buscar.');
      return;
    }

    setSearching(true);
    setFeedback('');

    try {
      const endpoint = searchSource === 'steam' ? '/steam/search' : '/games/search';
      const response = await api.get(endpoint, { params: { query } });
      const results = response.data.map(item => ({
        ...item,
        source: item.source || 'rawg',
        sourceUrl: item.sourceUrl || item.rawgUrl,
      }));
      setSearchResults(results);
      if(!results.length) setFeedback('Nenhum jogo encontrado.');
    } catch (error) {
      const message = error.response && error.response.data && error.response.data.error;
      setFeedback(message || 'Não foi possível buscar jogos agora.');
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  }

  function selectCover(item){
    uploadedFiles.forEach(file => URL.revokeObjectURL(file.preview));
    setUploadedFiles([]);
    setSelectedGame(item);
    setSearchResults([]);
    setFeedback('A capa selecionada substituirá a atual ao salvar.');

    if(formRef.current){
      formRef.current.setFieldValue('name', item.name);
    }
  }

  async function handleSubmit(data){
    const formData = new FormData();
    formData.append('name', data.name || '');
    formData.append('status', data.status || '');
    formData.append('platform', data.platform || '');
    formData.append('year', data.year || '');

    if(uploadedFiles.length){
      formData.append('photo', uploadedFiles[0].file);
    } else if(selectedGame){
      formData.append('coverUrl', selectedGame.coverUrl);
      formData.append('coverSource', selectedGame.source);
      formData.append('sourceUrl', selectedGame.sourceUrl);

      if(selectedGame.source === 'steam'){
        formData.append('steamAppId', selectedGame.appId);
      } else {
        formData.append('externalId', selectedGame.id);
      }
    }

    setSubmitting(true);
    setFeedback('');

    try {
      await api.put(`/games/${id}`, formData);
      history.push('/');
    } catch (error) {
      const message = error.response && error.response.data && error.response.data.error;
      setFeedback(message || 'Não foi possível atualizar o jogo.');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(){
    if(!window.confirm(`Excluir "${game.name}" da sua lista?`)) return;

    setDeleting(true);
    setFeedback('');
    try {
      await api.delete(`/games/${id}`);
      history.push('/');
    } catch (error) {
      setFeedback('Não foi possível excluir o jogo.');
      setDeleting(false);
    }
  }

  if(!game){
    return <Container>{feedback ? <Feedback>{feedback}</Feedback> : <p>Carregando...</p>}</Container>;
  }

  return (
    <Container>
      <BackLink as={Link} to="/">← Voltar para seus jogos</BackLink>
      <h1>Editar jogo</h1>

      <CurrentCover>
        <img src={currentCover()} alt={`Capa atual de ${game.name}`} />
        <div><strong>{game.name}</strong><span>Capa atual</span></div>
      </CurrentCover>

      {String(game.platform || '').toLowerCase() === 'steam' && game.steamLastPlayedAt && (
        <SteamInfo>
          <strong>Última vez jogado na Steam</strong>
          <span>{new Date(game.steamLastPlayedAt).toLocaleString('pt-BR')}</span>
        </SteamInfo>
      )}

      <SearchArea>
        <h2>Substituir capa automaticamente</h2>
        <SourceOptions>
          <SourceButton type="button" aria-pressed={searchSource === 'rawg'} onClick={() => { setSearchSource('rawg'); setSearchResults([]); }}>
            RAWG
          </SourceButton>
          <SourceButton type="button" aria-pressed={searchSource === 'steam'} onClick={() => { setSearchSource('steam'); setSearchResults([]); }}>
            Steam (capa vertical)
          </SourceButton>
        </SourceOptions>
        <SearchControls>
          <SearchInput
            value={searchQuery}
            onChange={event => setSearchQuery(event.target.value)}
            onKeyDown={event => { if(event.key === 'Enter'){ event.preventDefault(); handleSearch(); } }}
            placeholder="Buscar uma nova capa"
          />
          <Button type="button" onClick={handleSearch} disabled={searching}>{searching ? 'Buscando...' : 'Buscar'}</Button>
        </SearchControls>

        {!!searchResults.length && (
          <Results>
            {searchResults.map(item => (
              <Result key={item.id} type="button" onClick={() => selectCover(item)}>
                <ResultImage src={item.coverUrl} alt={`Capa de ${item.name}`} />
                <ResultInfo>
                  <strong>{item.name}</strong>
                  <span>{item.year || 'Ano desconhecido'}</span>
                  <span>{item.platforms.slice(0, 3).join(', ')}</span>
                </ResultInfo>
              </Result>
            ))}
          </Results>
        )}

        <Attribution>
          {searchSource === 'steam' ? 'Resultados e imagens fornecidos pela Steam.' : 'Resultados e imagens fornecidos pela RAWG.'}
        </Attribution>
      </SearchArea>

      {selectedGame && (
        <SelectedCover>
          <img src={selectedGame.coverUrl} alt={`Nova capa de ${selectedGame.name}`} />
          <div><strong>{selectedGame.name}</strong><span>Nova capa selecionada</span></div>
        </SelectedCover>
      )}

      {feedback && <Feedback>{feedback}</Feedback>}

      <MyForm ref={formRef} initialData={game} onSubmit={handleSubmit}>
        <InputContainer>
          <MyInput autoComplete="off" name="name" placeholder="Nome do jogo" />
          <MySelect name="status" options={statusOptions} onChange={event => setGameStatus(event.target.value)} />
          {gameStatus === 'finished' && (
            <>
              <MySelect name="platform" options={platformOptions} />
              <MyInput autoComplete="off" name="year" type="number" placeholder="Ano em que zerou" />
            </>
          )}
          <Actions>
            <Button type="submit" disabled={submitting || deleting}>{submitting ? 'Salvando...' : 'Salvar alterações'}</Button>
            <DeleteButton type="button" onClick={handleDelete} disabled={submitting || deleting}>{deleting ? 'Excluindo...' : 'Excluir jogo'}</DeleteButton>
          </Actions>
        </InputContainer>

        <UploadBox>
          <Upload onUpload={handleUpload} />
          {!!uploadedFiles.length && <FileImage files={uploadedFiles} />}
        </UploadBox>
      </MyForm>
    </Container>
  );
}
