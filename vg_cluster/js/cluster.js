// Valores reais máximos para normalização (baseados na base vgsales.csv)
const maxValues = {
  NA_Sales: 41.49,
  EU_Sales: 29.02,
  JP_Sales: 10.22,
  Other_Sales: 10.57,
};

// Centroides do modelo K-Means extraídos do PMML
const centroids = {
  cluster_0: [0.22105728287940868, 0.18300187063109186, 0.3846100083869163, 0.1663287831688967],
  cluster_1: [0.03749125801595483, 0.0352392640462767, 0.0979596419749121, 0.0317341842827674],
  cluster_2: [0.004873014081573089, 0.0036715727626920464, 0.003881315076287727, 0.003298540333195957],
};

let dataset = [];

// Normaliza os dados de entrada com base nos valores máximos
function normalize(row) {
  return [
    parseFloat(row.NA_Sales) / maxValues.NA_Sales,
    parseFloat(row.EU_Sales) / maxValues.EU_Sales,
    parseFloat(row.JP_Sales) / maxValues.JP_Sales,
    parseFloat(row.Other_Sales) / maxValues.Other_Sales,
  ];
}

// Calcula a distância euclidiana
function euclideanDistance(arr1, arr2) {
  return Math.sqrt(arr1.reduce((sum, val, i) => sum + Math.pow(val - arr2[i], 2), 0));
}

// Classifica um jogo em um cluster
function classifyCluster(normalized) {
  let minDistance = Infinity;
  let selectedCluster = null;
  for (const [key, centroid] of Object.entries(centroids)) {
    const dist = euclideanDistance(normalized, centroid);
    if (dist < minDistance) {
      minDistance = dist;
      selectedCluster = key;
    }
  }
  return selectedCluster;
}

// Carrega CSV e processa dados
Papa.parse("data/vgsales.csv", {
  download: true,
  header: true,
  complete: function (results) {
    dataset = results.data.map(row => {
      const norm = normalize(row);
      const cluster = classifyCluster(norm);
      return { 
        name: row.Name, 
        sales: norm, 
        cluster: cluster,
        NA_Sales: parseFloat(row.NA_Sales),
        EU_Sales: parseFloat(row.EU_Sales),
        JP_Sales: parseFloat(row.JP_Sales),
        Other_Sales: parseFloat(row.Other_Sales)
      };
    });
  }
});

// Processa envio do formulário
const form = document.getElementById("gameForm");
form.addEventListener("submit", function (e) {
  e.preventDefault();
  const name = document.getElementById("name").value;
  const na = parseFloat(document.getElementById("na_sales").value);
  const eu = parseFloat(document.getElementById("eu_sales").value);
  const jp = parseFloat(document.getElementById("jp_sales").value);
  const other = parseFloat(document.getElementById("other_sales").value);

  const input = [
    na / maxValues.NA_Sales, 
    eu / maxValues.EU_Sales, 
    jp / maxValues.JP_Sales, 
    other / maxValues.Other_Sales
  ];
  
  const cluster = classifyCluster(input);

  // Filtra os jogos do mesmo cluster e ordena por distância
  const similar = dataset
    .filter(game => game.cluster === cluster)
    .map(game => ({
      name: game.name,
      distance: euclideanDistance(input, game.sales),
      na_sales: game.NA_Sales.toFixed(2),
      eu_sales: game.EU_Sales.toFixed(2),
      jp_sales: game.JP_Sales.toFixed(2),
      other_sales: game.Other_Sales.toFixed(2)
    }))
    .sort((a, b) => a.distance - b.distance)
    .slice(0, 5);

  let html = `<h3>O jogo <strong>${name}</strong> pertence ao <strong>${cluster}</strong></h3>`;
  html += `<h4>Jogos mais semelhantes:</h4>`;
  similar.forEach(g => {
    html += `<div class="similar-game">
      🎮 ${g.name} — Distância Euclidiana: ${g.distance.toFixed(4)}<br>
      <small>NA_Sales: ${g.na_sales}, EU_Sales: ${g.eu_sales}, JP_Sales: ${g.jp_sales}, Other_Sales: ${g.other_sales}</small>
    </div>`;
  });
  document.getElementById("result").innerHTML = html;
});