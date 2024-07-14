import React from 'react';

import * as styles from './Publication.styles';

const MY_NAME_LIST = ['Kihwan Kim', '김기환'];

export interface PublicationProps {
  title: string;
  uri: string;
  authors: string[];
  conference: string;
  points: string[];
}

export function Publication({
  title,
  uri,
  authors,
  conference,
  points,
}: PublicationProps) {
  return (
    <div>
      <h4 css={styles.titleStyle}>
        <a href={uri}>{title}</a>
      </h4>
      <h5 css={styles.authorStyle}>
        {authors.map((author, index) => (
          <React.Fragment key={author}>
            {index > 0 && ', '}
            {MY_NAME_LIST.includes(author) ? <b>{author}</b> : author}
          </React.Fragment>
        ))}
      </h5>
      <p css={styles.conferenceStyle}>{conference}</p>
      <ul css={styles.pointsListStyle}>
        {points.map((point) => (
          <li key={point}>{point}</li>
        ))}
      </ul>
    </div>
  );
}
