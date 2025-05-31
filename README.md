# Idioms

## Development

The app is structured as a mono repo with two main directories

``` bash
idioms
├── backend
└── frontend
```

Linters and formatters are managed at the base level using [pre-commit framework](https://pre-commit.com/).

1. Install pre-commit:

```bash
pip install pre-commit
```

1. Install hooks:

```bash
pre-commit install --hook-type pre-commit --hook-type pre-push
```
