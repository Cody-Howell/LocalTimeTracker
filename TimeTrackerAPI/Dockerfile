FROM mcr.microsoft.com/dotnet/sdk:9.0 AS web
WORKDIR /TTA
COPY . ./
RUN dotnet restore
RUN dotnet publish -c Release -o out
WORKDIR /TTA/out
ENTRYPOINT ["dotnet", "TimeTrackerAPI.dll"]