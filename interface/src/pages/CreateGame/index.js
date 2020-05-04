import React, { useState } from 'react';
import filesize from 'filesize';
import { Redirect } from 'react-router';

import Upload from '../../components/Upload';
import FileImage from '../../components/FileImage';
import Button from '../../components/button';

import api from '../../services/api';

import { Container, MyInput, MyForm, UploadBox, InputContainer } from './style';

export default function CreateGame(){

  const [uploadedFiles, setUploadedFiles] = useState([]);

  function handleUpload(files){
    const uploadedFiles = files.map( file => ({
      file,
      name: file.name,
      readableSize: filesize(file.size),
      preview: URL.createObjectURL(file),
    }));

    setUploadedFiles(uploadedFiles);
  }

  function successSubmit(){
    return <Redirect to="Home" />
  }

  async function handleSubmit(data){
    const formatedData = new FormData();

    formatedData.append('name', data.name);
    formatedData.append('status', data.status);
    formatedData.append('platform', data.platform);
    formatedData.append('year', data.year);
    formatedData.append('photo', uploadedFiles[0].file);

    await api.post('games',formatedData)

    successSubmit();
  }

  return (
    <Container>
      <h1>Adicionar Jogo</h1>
      
      <MyForm onSubmit={handleSubmit}>
        <InputContainer>
          <MyInput autocomplete="off" autofocus="autofocus" name="name" placeholder="Nome do jogo" />
          <MyInput autocomplete="off" name="platform" placeholder="Plataforma" />
          <MyInput autocomplete="off" name="year" placeholder="Ano que começou a jogar" />
          <MyInput autocomplete="off" name="status" placeholder="finished ou progress" />
          <Button type="submit">Adicionar</Button>
        </InputContainer>
        
        <UploadBox>
          <Upload onUpload={handleUpload} />
          { !!uploadedFiles.length && (
            <FileImage files={uploadedFiles} />
          ) }
        </UploadBox>

      </MyForm>
    </Container>
  );
}