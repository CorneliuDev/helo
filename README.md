# Helo Website Installation Guide

## Instalare si configurare search engine
Pornesti meilisearch din terminal cu comanda:

`docker-compose up -d`

Ca sa incarci toate produsele din firebase in meilisearch rulezi urmatorul script nodejs:

`node fill_meili.js`

## Pornire website

### Ca sa pornesti website-ul propriu-zis rulezi comanda:

`npm start`

# Atat
Ar trebui sa mearga tot

# Optional
Daca vrei si website-ul sa ruleze in docker intri in fisierul `docker-compose.yml` si scoti comentariile (liniile care incep cu #)

Mai rulezi odata comanda:

`docker-compose up -d`