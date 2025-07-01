# vg_cluster# vg_cluster - Sistema de Recomendação de Jogos por Cluster

Este projeto é uma aplicação web simples para recomendar jogos similares baseados em clusters gerados pelo algoritmo K-Means. Ele utiliza dados de vendas regionais de jogos (base `vgsales.csv`) e classifica o jogo informado pelo usuário, retornando os jogos mais parecidos dentro do mesmo cluster.

---

## Como rodar localmente (recomendado)

### Rodar com um servidor local usando Python

O navegador bloqueia algumas operações (como leitura de arquivos CSV locais) por questões de segurança quando você abre o arquivo diretamente (`file://`). Por isso, é recomendado rodar um servidor local simples para testes.

### Pré-requisitos:

- Ter Python instalado (versão 3.x recomendada).  
  Você pode baixar e instalar Python em https://www.python.org/downloads/

---

### Passo a passo

1. Abra o terminal (Linux/Mac) ou prompt de comando (Windows).

2. Navegue até a pasta do projeto `vg_cluster` (onde está o arquivo `index.html`), por exemplo:

   ```bash
   cd /caminho/para/vg_cluster
   ```

3. Execute o servidor local com o comando:

   ```bash
   python -m http.server 8000
   ```
   
   Esse comando inicia um servidor HTTP na porta 8000, servindo os arquivos da pasta atual.

4. Abra seu navegador e acesse:

   ```bash
   http://localhost:8000/index.html
   ```
   
5. A aplicação deverá carregar normalmente e você poderá testar a recomendação de jogos. 
