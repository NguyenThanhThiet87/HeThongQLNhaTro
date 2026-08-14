FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
ARG SERVICE
WORKDIR /src
COPY . .
RUN dotnet restore "${SERVICE}/${SERVICE}.csproj"
RUN dotnet publish "${SERVICE}/${SERVICE}.csproj" -c Release -o /out /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS runtime
ARG SERVICE
ENV SERVICE=${SERVICE}
ENV ASPNETCORE_URLS=http://+:8080
WORKDIR /app
COPY --from=build /out .
EXPOSE 8080
ENTRYPOINT ["sh", "-c", "dotnet /app/${SERVICE}.dll"]
