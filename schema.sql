DROP TABLE IF EXSIST jokes;
CREATE TABLE jokes (
    id SERIAL PRIMARY KEY,
    number VARCHAR (225),
    type VARCHAR (225),
    setup VARCHAR (225),
    punchline VARCHAR (225)
 );