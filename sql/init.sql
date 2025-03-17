CREATE TABLE public.people (
	id int4 GENERATED ALWAYS AS IDENTITY NOT NULL,
	username varchar NOT NULL,
	pass varchar NOT NULL,
	apikey varchar NULL
);

create table public.records (
  id int generated always as identity not null, 
  StartTime timestamp not null, 
  EndTime timestamp not null,
  Attended varchar(200) not null,
  AnticipatedDuration varchar(80) not null,
  Goal text not null,
  Finished text not null,
  ElapsedTime real not null,
  AdditionalNotes text not null,
  Planning real not null,
  Eploration real not null,
  Testing real not null,
  Refactoring real not null,
  Implementation real not null,
  Debugging real not null,
  Other real not null, 
  PrimaryProject boolean not null
);

insert into public.people (username, pass, apikey) values ('admin', 'lorem', '');

