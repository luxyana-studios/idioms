# Idioms Backend

## Local development

Start local database:

```bash
docker-compose up
```

Start local server:

```bash
uv run fastapi dev main.py
```

## Database management

You can create a backup from a running database with the command:

```bash
docker exec -t postgres_db pg_dump -U <db_user> -d <db_name> | gzip > <backup_file>
```

To load a backup file to a running database use:

```bash
gunzip -c <backup_file> | docker exec -i postgres_db psql -U <db_user> -d <db_name>
```

Make sure to adapt the variables in the angle brackets `<...>` and possibly the container name of your database.
If you are restoring to an empty database, the target database needs to be created first.
You can do this by starting the local server as above or creating it manually.

## TODOs

TODOs:

- [ ] Set up alembic for database migrations.
- [ ] Enrich data with `frequency` and `picturesque` ratings.
- [ ] Enrich data with `tags` and `smileys`.
- [ ] Add user entity to store likes and settings.
- [ ] Consider setting up other languages.

```

```
