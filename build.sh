#!/bin/bash
# Instala dependências
pip install -r requirements.txt

# Coleta arquivos estáticos
python manage.py collectstatic --noinput

# Migrações (se houver)
python manage.py migrate