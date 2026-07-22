import React, { useEffect, useRef, useState } from 'react';
import filesize from 'filesize';
import { useHistory } from 'react-router-dom';

import Upload from '../../components/Upload';
import FileImage from '../../components/FileImage';
import Button from '../../components/button';

import api from '../../services/api';

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
} from './style';

export default function CreateGame(){
  const formRef = useRef(null);
  const history = useHistory();
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchSource, setSearchSource] = useState('rawg');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedGame, setSelectedGame] = useState(null);
  const [searching, setSearching] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState('');

  useEffect(() => () => {
    uploadedFiles.forEach(file => URL.revokeObjectURL(file.preview));
  }, [uploadedFiles]);

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
    setFeedback('');
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
      const results = response.data.map(game => ({
        ...game,
        source: game.source || 'rawg',
        sourceUrl: game.sourceUrl || game.rawgUrl,
      }));
      setSearchResults(results);

      if(!results.length){
        setFeedback('Nenhum jogo encontrado. Você ainda pode enviar a capa manualmente.');
      }
    } catch (error) {
      const message = error.response && error.response.data && error.response.data.error;
      setFeedback(message || 'Não foi possível buscar jogos agora. Use o upload manual.');
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  }

  function selectGame(game){
    uploadedFiles.forEach(file => URL.revokeObjectURL(file.preview));
    setUploadedFiles([]);
    setSelectedGame(game);
    setSearchResults([]);
    setFeedback('Capa selecionada. Você pode substituí-la enviando outra imagem.');

    if(formRef.current){
      formRef.current.setFieldValue('name', game.name);
      formRef.current.setFieldValue('platform', game.platforms.join(', '));

      if(game.year){
        formRef.current.setFieldValue('year', game.year);
      }
    }
  }

  async function handleSubmit(data){
    if(!selectedGame && !uploadedFiles.length){
      setFeedback('Selecione uma capa da RAWG ou Steam, ou envie uma imagem.');
      return;
    }

    const formatedData = new FormData();

    formatedData.append('name', data.name || '');
    formatedData.append('status', data.status || '');
    formatedData.append('platform', data.platform || '');
    formatedData.append('year', data.year || '');

    if(uploadedFiles.length){
      formatedData.append('photo', uploadedFiles[0].file);
    } else {
      formatedData.append('coverUrl', selectedGame.coverUrl);
      formatedData.append('coverSource', selectedGame.source);
      formatedData.append('sourceUrl', selectedGame.sourceUrl);

      if(selectedGame.source === 'steam'){
        formatedData.append('steamAppId', selectedGame.appId);
      } else {
        formatedData.append('externalId', selectedGame.id);
      }
    }

    setSubmitting(true);
    setFeedback('');

    try {
      await api.post('/games', formatedData);
      history.push('/');
    } catch (error) {
      const message = error.response && error.response.data && error.response.data.error;
      setFeedback(message || 'Não foi possível cadastrar o jogo.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Container>
      <h1>Adicionar Jogo</h1>

      <SearchArea>
        <h2>Buscar capa automaticamente</h2>
        <SourceOptions>
          <SourceButton
            type="button"
            aria-pressed={searchSource === 'rawg'}
            onClick={() => {
              setSearchSource('rawg');
              setSearchResults([]);
            }}
          >
            RAWG
          </SourceButton>
          <SourceButton
            type="button"
            aria-pressed={searchSource === 'steam'}
            onClick={() => {
              setSearchSource('steam');
              setSearchResults([]);
            }}
          >
            Steam (capa vertical)
          </SourceButton>
        </SourceOptions>
        <SearchControls>
          <SearchInput
            value={searchQuery}
            onChange={event => setSearchQuery(event.target.value)}
            onKeyDown={event => {
              if(event.key === 'Enter'){
                event.preventDefault();
                handleSearch();
              }
            }}
            placeholder="Ex.: The Witcher 3"
          />
          <Button type="button" onClick={handleSearch} disabled={searching}>
            {searching ? 'Buscando...' : 'Buscar'}
          </Button>
        </SearchControls>

        {!!searchResults.length && (
          <Results>
            {searchResults.map(game => (
              <Result key={game.id} type="button" onClick={() => selectGame(game)}>
                {game.coverUrl ? (
                  <ResultImage src={game.coverUrl} alt={`Capa de ${game.name}`} />
                ) : (
                  <ResultImage as="div">Sem capa</ResultImage>
                )}
                <ResultInfo>
                  <strong>{game.name}</strong>
                  <span>{game.year || 'Ano desconhecido'}</span>
                  <span>{game.platforms.slice(0, 3).join(', ') || 'Plataforma desconhecida'}</span>
                </ResultInfo>
              </Result>
            ))}
          </Results>
        )}

        <Attribution>
          {searchSource === 'steam' ? (
            <>Resultados e imagens fornecidos pela <a href="https://store.steampowered.com" target="_blank" rel="noopener noreferrer">Steam</a>.</>
          ) : (
            <>Resultados e imagens fornecidos por <a href="https://rawg.io" target="_blank" rel="noopener noreferrer">RAWG</a>.</>
          )}
        </Attribution>
      </SearchArea>

      {selectedGame && (
        <SelectedCover>
          <img src={selectedGame.coverUrl} alt={`Capa selecionada de ${selectedGame.name}`} />
          <div>
            <strong>{selectedGame.name}</strong>
            <span>Capa selecionada da {selectedGame.source === 'steam' ? 'Steam' : 'RAWG'}</span>
          </div>
        </SelectedCover>
      )}

      {feedback && <Feedback>{feedback}</Feedback>}

      <MyForm ref={formRef} onSubmit={handleSubmit}>
        <InputContainer>
          <MyInput autoComplete="off" autoFocus name="name" placeholder="Nome do jogo" />
          <MyInput autoComplete="off" name="platform" placeholder="Plataforma" />
          <MyInput autoComplete="off" name="year" type="number" placeholder="Ano" />
          <MyInput autoComplete="off" name="status" placeholder="finished ou progress" />
          <Button type="submit" disabled={submitting}>
            {submitting ? 'Adicionando...' : 'Adicionar'}
          </Button>
        </InputContainer>

        <UploadBox>
          <Upload onUpload={handleUpload} />
          {!!uploadedFiles.length && <FileImage files={uploadedFiles} />}
        </UploadBox>
      </MyForm>
    </Container>
  );
}
