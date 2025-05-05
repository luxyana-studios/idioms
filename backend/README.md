# Idioms Backend

## Local development

Start local database:

```bash
docker-compose up
```

You can stop or delete your local database by running `docker-compose down` or `docker-compose down -v`.

Start local server:

```bash
uv run fastapi dev main.py
```

You can try out the API by visiting [localhost:8000/docs](localhost:8000/docs).

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
You might face issues when restoring to existing databases or tables, for now the easiest is to stop your local server and delete your database.
This will make sure that you are only loading the contents of your backup file.

## TODOs

TODOs:

- [ ] Set up alembic for database migrations.
- [ ] Enrich data with `frequency` and `picturesque` ratings.
- [ ] Enrich data with `tags` and `smileys`.
- [ ] Add user entity to store likes and settings.
- [ ] Consider setting up other languages.

```

```
