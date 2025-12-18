#/bin/bash

cd /var/www/plugplay
docker compose up -d --build
cd /var/www/plugplay/backend/PlugPlay/PlugPlay.Infrastructure && 
# docker run --rm -it \
#  --network plugplay_webnet \
#  -v /var/www/plugplay/backend/PlugPlay:/src \
#  -w /src/PlugPlay.Infrastructure \
#  -e "ConnectionStrings__DefaultConnection=Host=plugplay-db-1;Port=5432;Database=plugplay;Username=myuser;Password=mypassword" \
#  mcr.microsoft.com/dotnet/sdk:8.0 \
#  dotnet ef database update \
#    --project PlugPlay.Infrastructure.csproj \
#    --startup-project ../PlugPlay.Api/PlugPlay.Api.csproj

cd /var/www/plugplay
docker exec -i plugplay-db-1 psql -U myuser -d plugplay < /var/www/plugplay/backend/PlugPlay/PlugPlay.Infrastructure/DataSeeds/prod_data_seed.sql
docker restart plugplay-db-1

