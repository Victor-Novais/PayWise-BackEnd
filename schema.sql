-- create database challenge;

drop table if exists charges;
drop table if exists clients;
drop table if exists users;
drop function if exists get_total_charges;
drop function if exists get_count_charges;
drop type if exists charge_status;

create table users(
  id serial primary key,
  username text not null,
  email text not null unique,
  password text not null,
  cpf text unique,
  phone text
);

create table clients(
  id serial primary key,
  user_id integer not null references users(id),
  defaulter boolean not null default false,
  name text not null,
  email text not null unique,
  cpf text unique,
  phone text not null,
  zipcode text,
  street text,
  complement text,
  neighborhood text,
  city text,
  state text
);

create type charge_status as enum ('paid', 'pending', 'overdue');

create table charges (
	id serial primary key,
  client_id integer not null references clients(id),
  description text not null,
  status charge_status not null default 'pending',
  amount integer not null,
  due_date date not null
);

create or replace function update_client_status()
returns void as
$$
begin
    update clients
    set defaulter = false;

    perform update_charge_status();

    update clients
    set defaulter = true
    where id in (
        select distinct c.client_id
        from charges c
        where c.status = 'overdue'
    );
end;
$$
language plpgsql;

create or replace function update_charge_status()
returns void as
$$
begin
    update charges
    set status = 'overdue'
    where id in (
        select distinct c.id
        from charges c
        where (c.status = 'pending') and (c.due_date < current_date)
    );
end;
$$
language plpgsql;

create or replace function get_total_charges(id_user integer, c_status charge_status)
returns integer as
$$
declare
    total_amount integer;
begin
    select sum(c.amount)
    into total_amount
    from charges c
    join clients cl on c.client_id = cl.id
    where cl.user_id = id_user and c.status = c_status;

    return total_amount;
end;
$$
language plpgsql;

create or replace function get_count_charges(id_user integer, c_status charge_status)
returns integer as
$$
declare
    count integer;
begin
    select count(c.*)
    into count
    from charges c
    join clients cl on c.client_id = cl.id
    where cl.user_id = id_user and c.status = c_status;

    return count;
end;
$$
language plpgsql;