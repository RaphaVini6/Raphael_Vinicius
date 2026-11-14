# build
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src
COPY Api2.Speech.csproj .
RUN dotnet restore
COPY . .
RUN dotnet publish -c Release -o /app --no-restore

# run
FROM mcr.microsoft.com/dotnet/aspnet:10.0
WORKDIR /app
COPY --from=build /app .
# generated audio is cached here (mounted as a volume so it survives restarts)
RUN mkdir -p /data/audio-cache && chown -R $APP_UID /data
ENV Speech__CacheDir=/data/audio-cache
EXPOSE 8080
USER $APP_UID
ENTRYPOINT ["dotnet", "Api2.Speech.dll"]
