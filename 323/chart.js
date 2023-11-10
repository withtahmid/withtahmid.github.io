var temChart;
var humiChart;
var labels = ['48', '46', '44', '42', '40', '38', '36', '34', '32', '30', '28', '26', '24', '22', '20', '18', '16', '14', '12', '10', '8', '6', '4', '2', '0'];
let temparatures = []
let humidities = [];
document.addEventListener("DOMContentLoaded", function () {
  temChart = new Chart(document.getElementById('temparature').getContext('2d'), {
      type: 'line',
      data: {
          labels: labels,
          datasets: [{
              label: '',
              data: temparatures,
              borderColor: 'rgba(255, 99, 132, 0.8)',
              borderWidth: 2,
              fill: false
          }]
      },
      options: {
        scales: {
              y: {
                suggestedMin: null,
                suggestedMax: null,
                grid: {
                        color: 'rgba(255, 99, 132, 0.2)'
                    }
            }
        },
        animations: {
          tension: {
            duration: 1000,
            easing: 'linear',
            from: 1,
            to: 0,
            loop: true
          }
        },
      }
  });
  humiChart = new Chart(document.getElementById('humidity').getContext('2d'), {
      type: 'line',
      data: {
          labels: labels,
          datasets: [{
              label: '',
              data: humidities,
              borderColor: 'rgba(54, 162, 235, 0.8)',
              borderWidth: 2,
              fill: true
          }]
      },
      options: {
          scales: {
                y: {
                  suggestedMin: null,
                  suggestedMax: null,
                  grid: {
                          color: 'rgba(54, 162, 235, 0.2)'
                      }
              }
          },
          animations: {
            tension: {
              duration: 1000,
              easing: 'linear',
              from: 1,
              to: 0,
              loop: true
            }
          },
        }
  });
});

function changeChart(t, h){
  temparatures.push(t);
  humidities.push(h);
  if(temparatures.length > 25){
    temparatures.shift();
    humidities.shift();
  }
  temChart.data.datasets[0].data = temparatures;
  humiChart.data.datasets[0].data = humidities;
  temChart.update();
  humiChart.update();
}
