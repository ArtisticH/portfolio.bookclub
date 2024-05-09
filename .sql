INSERT INTO books (title, author, img, meetingDate, MemberId) VALUES ('공정하다는 착각', '마이클 샌델', '/img/book/공정하다는 착각.jpeg', '2022-11-09', 1);
INSERT INTO books (title, author, img, meetingDate, MemberId) VALUES ('서울 자가에 대기업 다니는 김 부장 이야기 시리즈', '송희구', '/img/book/김 부장 이야기.jpeg', '2022-11-30', 2);
INSERT INTO books (title, author, img, meetingDate, MemberId) VALUES ('선량한 차별주의자', '김지혜', '/img/book/선량한 차별주의자.jpeg', '2022-12-14', 3);
INSERT INTO books (title, author, img, meetingDate, MemberId) VALUES ('데미안', '헤르만 헤세', '/img/book/데미안.jpeg', '2023-01-12', 1);
INSERT INTO books (title, author, img, meetingDate, MemberId) VALUES ('침묵은 여자가 되나니', '팻 바커', '/img/book/침묵은 여자가 되나니.jpeg', '2023-02-02', 2);
INSERT INTO books (title, author, img, meetingDate, MemberId) VALUES ('불안', '알랭 드 보통', '/img/book/불안.jpeg', '2023-03-08', 3);
INSERT INTO books (title, author, img, meetingDate, MemberId) VALUES ('명상록', '마르쿠스 아우렐리우스', '/img/book/명상록.jpeg', '2023-04-05', 1);
INSERT INTO books (title, author, img, meetingDate, MemberId) VALUES ('심판', '베르나르 베르베르', '/img/book/심판.jpeg', '2023-05-12', 2);
INSERT INTO books (title, author, img, meetingDate, MemberId) VALUES ('내가 틀릴 수도 있습니다', '비욘 나티코 린데블라드', '/img/book/내가 틀릴 수도 있습니다.jpeg', '2023-06-25', 3);
INSERT INTO books (title, author, img, meetingDate, MemberId) VALUES ('2030 축의 전환', '마우로 기옌', '/img/book/2030 축의 전환.jpeg', '2023-08-16', 1);
INSERT INTO books (title, author, img, meetingDate, MemberId) VALUES ('소피의 세계', '요슈타인 가아더', '/img/book/소피의 세계.jpeg', '2023-09-20', 2);
INSERT INTO books (title, author, img, meetingDate, MemberId) VALUES ('달러구트 꿈 백화점', '이미예', '/img/book/달러구트.jpeg', '2023-11-14', 3);
INSERT INTO books (title, author, img, meetingDate, MemberId) VALUES ('우울할 땐 뇌과학', '앨릭스 코브', '/img/book/뇌과학.jpeg', '2024-01-05', 4);

INSERT INTO attend (BookId, MemberId) VALUES (1, 1);
INSERT INTO attend (BookId, MemberId) VALUES (1, 2);
INSERT INTO attend (BookId, MemberId) VALUES (1, 3);
INSERT INTO attend (BookId, MemberId) VALUES (2, 1);
INSERT INTO attend (BookId, MemberId) VALUES (2, 2);
INSERT INTO attend (BookId, MemberId) VALUES (2, 3);
INSERT INTO attend (BookId, MemberId) VALUES (3, 1);
INSERT INTO attend (BookId, MemberId) VALUES (3, 2);
INSERT INTO attend (BookId, MemberId) VALUES (3, 3);
INSERT INTO attend (BookId, MemberId) VALUES (4, 1);
INSERT INTO attend (BookId, MemberId) VALUES (4, 2);
INSERT INTO attend (BookId, MemberId) VALUES (4, 3);
INSERT INTO attend (BookId, MemberId) VALUES (5, 1);
INSERT INTO attend (BookId, MemberId) VALUES (5, 2);
INSERT INTO attend (BookId, MemberId) VALUES (5, 3);
INSERT INTO attend (BookId, MemberId) VALUES (6, 1);
INSERT INTO attend (BookId, MemberId) VALUES (6, 2);
INSERT INTO attend (BookId, MemberId) VALUES (6, 3);
INSERT INTO attend (BookId, MemberId) VALUES (7, 1);
INSERT INTO attend (BookId, MemberId) VALUES (7, 2);
INSERT INTO attend (BookId, MemberId) VALUES (7, 3);
INSERT INTO attend (BookId, MemberId) VALUES (8, 1);
INSERT INTO attend (BookId, MemberId) VALUES (8, 2);
INSERT INTO attend (BookId, MemberId) VALUES (8, 3);
INSERT INTO attend (BookId, MemberId) VALUES (9, 1);
INSERT INTO attend (BookId, MemberId) VALUES (9, 2);
INSERT INTO attend (BookId, MemberId) VALUES (9, 3);
INSERT INTO attend (BookId, MemberId) VALUES (10, 1);
INSERT INTO attend (BookId, MemberId) VALUES (10, 2);
INSERT INTO attend (BookId, MemberId) VALUES (10, 3);
INSERT INTO attend (BookId, MemberId) VALUES (11, 1);
INSERT INTO attend (BookId, MemberId) VALUES (11, 2);
INSERT INTO attend (BookId, MemberId) VALUES (11, 3);
INSERT INTO attend (BookId, MemberId) VALUES (12, 1);
INSERT INTO attend (BookId, MemberId) VALUES (12, 2);
INSERT INTO attend (BookId, MemberId) VALUES (12, 3);
INSERT INTO attend (BookId, MemberId) VALUES (13, 1);
INSERT INTO attend (BookId, MemberId) VALUES (13, 2);
INSERT INTO attend (BookId, MemberId) VALUES (13, 3);
INSERT INTO attend (BookId, MemberId) VALUES (13, 4);

INSERT INTO doneFolders (MemberId, public) VALUES (1, true);
INSERT INTO doneFolders (MemberId, public) VALUES (2, true);
INSERT INTO doneFolders (MemberId, public) VALUES (3, true);
INSERT INTO doneFolders (MemberId, public) VALUES (4, true);

UPDATE members SET type = 'member' WHERE id = 1;
UPDATE members SET type = 'member' WHERE id = 2;
UPDATE members SET type = 'member' WHERE id = 3;
UPDATE members SET type = 'member' WHERE id = 4;

INSERT INTO favorite (title, types, img, explanation, modelName, round) VALUES ('Taylor Swift', 'music', '/img/favorite/ts.jpeg', "What's your Favorite Taylor Swift's song?", 'TS', 32);
INSERT INTO favorite (title, types, img, explanation, modelName, round) VALUES ('POP', 'music2', '/img/favorite/pop.jpeg', "What's your Favorite song in POP?", 'POP', 32);
INSERT INTO favorite (title, types, img, explanation, modelName, round) VALUES ('K-POP', 'music2', '/img/favorite/kpop.jpeg', "What's your Favorite song in K-POP?", 'KPOP', 32);
INSERT INTO favorite (title, types, img, explanation, modelName, round) VALUES ('KOREAN FEMALE', 'basic', '/img/favorite/kfc.jpeg', "Who's your Favorite female celebrity in KOREA?", 'KFC', 32);
INSERT INTO favorite (title, types, img, explanation, modelName, round) VALUES ('HOLLYWOOD FEMALE', 'basic', '/img/favorite/hfc.jpeg', "Who's your Favorite female celebrity in HOLLYWOOD?", 'HFC', 32);
INSERT INTO favorite (title, types, img, explanation, modelName, round) VALUES ('HOLLYWOOD MALE', 'basic', '/img/favorite/hmc.jpeg', "Who's your Favorite male celebrity in HOLLYWOOD?", 'HMC', 32);
INSERT INTO favorite (title, types, img, explanation, modelName, round) VALUES ('KOREAN MALE', 'basic', '/img/favorite/kmc.jpeg', "Who's your Favorite male celebrity in KOREA?", 'KMC', 32);

INSERT INTO ts (main, sub) VALUES ('You Belong With Me', "Fearless(Taylor's Version)");
INSERT INTO ts (main, sub) VALUES ('Superstar', "Fearless(Taylor's Version)");
INSERT INTO ts (main, sub) VALUES ('Love Story', "Fearless(Taylor's Version)");
INSERT INTO ts (main, sub) VALUES ("Don't You", "Fearless(Taylor's Version)");
INSERT INTO ts (main, sub) VALUES ('Back to December', 'Speak Now');
INSERT INTO ts (main, sub) VALUES ('Sparks Fly', 'Speak Now');
INSERT INTO ts (main, sub) VALUES ('Long Live', 'Speak Now');
INSERT INTO ts (main, sub) VALUES ('Superman', "Speak Now(Taylor's Version)");
INSERT INTO ts (main, sub) VALUES ('Anti-hero', 'Midnights');
INSERT INTO ts (main, sub) VALUES ("You're on Your Own, Kid", 'Midnights');
INSERT INTO ts (main, sub) VALUES ('Snow on the Beach(Feat. More Lana Del Rey)', 'Midnights');
INSERT INTO ts (main, sub) VALUES ('Shake It Off', '1989');
INSERT INTO ts (main, sub) VALUES ('Clean', '1989');
INSERT INTO ts (main, sub) VALUES ('Wildest Dreams', '1989');
INSERT INTO ts (main, sub) VALUES ('Style', '1989');
INSERT INTO ts (main, sub) VALUES ('Getaway Car', 'reputation');
INSERT INTO ts (main, sub) VALUES ('I Did Something Bad', 'reputation');
INSERT INTO ts (main, sub) VALUES ("Don't Blame Me", 'reputation');
INSERT INTO ts (main, sub) VALUES ('Cruel Summer', 'Lover');
INSERT INTO ts (main, sub) VALUES ('Miss Americana & The Heartbreak Prince', 'Lover');
INSERT INTO ts (main, sub) VALUES ('Lover', 'Lover');
INSERT INTO ts (main, sub) VALUES ('All Too Well', "Red (Taylor's Version)");
INSERT INTO ts (main, sub) VALUES ('Starlight', 'Red');
INSERT INTO ts (main, sub) VALUES ('Treacherous', 'Red');
INSERT INTO ts (main, sub) VALUES ("august", 'folklore');
INSERT INTO ts (main, sub) VALUES ('exile', 'folklore');
INSERT INTO ts (main, sub) VALUES ('illicit affairs', 'folklore');
INSERT INTO ts (main, sub) VALUES ('this is me trying', 'folklore');
INSERT INTO ts (main, sub) VALUES ('Fortnight(Feat. Post Malone)', 'TTPD');
INSERT INTO ts (main, sub) VALUES ('Guilty as Sin', 'TTPD');
INSERT INTO ts (main, sub) VALUES ('The Alchemy', 'TTPD');
INSERT INTO ts (main, sub) VALUES ('I Can Do It With a Broken Heart', 'TTPD');





