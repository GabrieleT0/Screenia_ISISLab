!/bin/bash

# Esegui il comando standard `npm run build`
npm run build

# Sovrascrivi la cartella `/var/www/screenia` con la cartella `build`
rm -rf /var/www/screenia/*
cp -r build/* /var/www/screenia
service apache2 restart