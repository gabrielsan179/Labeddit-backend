DROP TABLE users;

DROP TABLE posts;

DROP TABLE comments;

DROP TABLE likes_dislikes_post;

DROP TABLE likes_dislikes_comment;

CREATE TABLE
    users(
        id TEXT PRIMARY KEY UNIQUE NOT NULL,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT NOT NULL,
        created_at TEXT DEFAULT (DATETIME()) NOT NULL
    );

CREATE TABLE
    posts(
        id TEXT PRIMARY KEY UNIQUE NOT NULL,
        creator_id TEXT NOT NULL,
        content TEXT NOT NULL,
        likes INTEGER DEFAULT (0) NOT NULL,
        dislikes INTEGER DEFAULT (0) NOT NULL,
        comments INTEGER DEFAULT (0) NOT NULL,
        created_at TEXT DEFAULT (DATETIME()) NOT NULL,
        updated_at TEXT DEFAULT (DATETIME()) NOT NULL,
        FOREIGN KEY (creator_id) REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE
    );

CREATE TABLE
    comments(
        id TEXT PRIMARY KEY UNIQUE NOT NULL,
        creator_id TEXT NOT NULL,
        post_id TEXT NOT NULL,
        content TEXT NOT NULL,
        likes INTEGER DEFAULT (0) NOT NULL,
        dislikes INTEGER DEFAULT (0) NOT NULL,
        created_at TEXT DEFAULT (DATETIME()) NOT NULL,
        updated_at TEXT DEFAULT (DATETIME()) NOT NULL,
        FOREIGN KEY (creator_id) REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE,
        FOREIGN KEY (post_id) REFERENCES posts (id) ON DELETE CASCADE ON UPDATE CASCADE
    );

CREATE TABLE
    likes_dislikes_post(
        user_id TEXT NOT NULL,
        post_id TEXT NOT NULL,
        like INTEGER NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE,
        FOREIGN KEY (post_id) REFERENCES posts (id) ON DELETE CASCADE ON UPDATE CASCADE
    );

CREATE TABLE
    likes_dislikes_comment(
        user_id TEXT NOT NULL,
        comment_id TEXT NOT NULL,
        like INTEGER NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE,
        FOREIGN KEY (comment_id) REFERENCES comments (id) ON DELETE CASCADE ON UPDATE CASCADE
    );

INSERT INTO
    users (id, name, email, password, role)
VALUES (
        "U001",
        "Gabriel",
        "gabi@labe.com",
        "Gg123456#",
        "ADMIN"
    ), (
        "U002",
        "Larissa",
        "lala@labe.com",
        "Ll123456#",
        "NORMAL"
    );

INSERT INTO
    posts(id, creator_id, content)
VALUES (
        "P001",
        "U002",
        "Post test 1"
    ),(
        "P002",
        "U001",
        "Post test 2"
    );

INSERT INTO
    comments(id, creator_id, post_id, content)
VALUES (
        "C001",
        "U001",
        "P001",
        "Comentario no post test 1"
    ),(
        "C002",
        "U002",
        "P002",
        "Comentario no post test 2"
    );

INSERT INTO
    likes_dislikes_post(user_id, post_id, like)
VALUES (
        "U001",
        "P001",
        0
    ),(
        "U002",
        "P002",
        1
    );

INSERT INTO
    likes_dislikes_comment(user_id, comment_id, like)
VALUES (
        "U001",
        "C002",
        0
    ),(
        "U002",
        "C001",
        1
    );

UPDATE users SET role = "ADMIN" WHERE id = ;

SELECT * FROM users;

SELECT * FROM posts;

SELECT * FROM comments;

SELECT * FROM likes_dislikes_post;

SELECT * FROM likes_dislikes_comment;