import React from 'react';

import { Container, FileInfo, Preview } from './style';

export default function FileImage({ files }) {
  return (
      <Container>
          { files.map(uploadedFile => (
              <FileInfo>
                <Preview src={uploadedFile.preview} />
                <div>
                    <strong>{uploadedFile.name}</strong>
                    <span>{uploadedFile.readableSize}</span>
                </div>
              </FileInfo>
          )) }
      </Container>
  );
}