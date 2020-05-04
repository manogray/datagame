import React from 'react';

import Dropzone from 'react-dropzone';
import { FiUpload } from 'react-icons/fi';

import { DropContainer, UploadMessage } from './style';

export default function Upload({ onUpload }) {
  function renderUploadMessage(isDragActive, isDragReject){
    if(!isDragActive){
        return <UploadMessage>Clique ou arraste a capa do jogo aqui</UploadMessage>
    }

    if(isDragReject){
        return <UploadMessage>Este arquivo não é uma imagem</UploadMessage>
    }

    return <UploadMessage>Solte a imagem aqui</UploadMessage>
  }

  return (
      <Dropzone accept="image/*" onDropAccepted={onUpload}>
          { ({ getRootProps, getInputProps, isDragActive, isDragReject }) => (
              <DropContainer 
                {...getRootProps()}
                isDragActive={isDragActive}
                isDragReject={isDragReject}
              >
                  <input {...getInputProps()} />
                  <FiUpload size={40} color="#333" />
                  <UploadMessage>
                      { renderUploadMessage(isDragActive,isDragReject) }
                  </UploadMessage>
              </DropContainer>
          ) }
      </Dropzone>
  );
}