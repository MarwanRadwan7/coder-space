
CREATE TABLE IF NOT EXISTS comments (
    id VARCHAR NOT NULL PRIMARY KEY ,
    userId VARCHAR NOT NULL,
    postId VARCHAR NOT NULL,
    createdAt VARCHAR NOT NULL,
    postedAt VARCHAR NOT NULL,
    FOREIGN KEY (userId) REFERENCES users(id),
    FOREIGN KEY (postId) REFERENCES posts(id)
);

CREATE TABLE IF NOT EXISTS likes (
  userId  VARCHAR NOT NULL,
  postId  VARCHAR NOT NULL,
  FOREIGN KEY (userId) REFERENCES users (id),
  FOREIGN KEY (postId) REFERENCES posts (id),
  PRIMARY KEY (userId, postId)
);
