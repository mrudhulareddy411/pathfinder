const fs = require('fs');
const path = require('path');

function getMetricValue(metricObj, key) {
  if (!metricObj) return 'N/A';
  if (metricObj.values !== undefined && metricObj.values[key] !== undefined) {
    return metricObj.values[key];
  }
  if (metricObj[key] !== undefined) {
    return metricObj[key];
  }
  return 'N/A';
}

function parseSummary() {
  try {
    const summaryPath = path.join(__dirname, '..', 'summary.json');
    if (!fs.existsSync(summaryPath)) {
      console.error('summary.json not found!');
      process.exit(1);
    }

    const data = JSON.parse(fs.readFileSync(summaryPath, 'utf8'));
    const metrics = data.metrics;

    const rps = getMetricValue(metrics.http_reqs, 'rate');
    const totalRequests = getMetricValue(metrics.http_reqs, 'count');
    const avgLatency = getMetricValue(metrics.http_req_duration, 'avg');
    const minLatency = getMetricValue(metrics.http_req_duration, 'min');
    const maxLatency = getMetricValue(metrics.http_req_duration, 'max');
    const p95Latency = getMetricValue(metrics.http_req_duration, 'p(95)');
    const failureRate = getMetricValue(metrics.http_req_failed, 'rate');
    
    // Format numbers
    const formatMs = (val) => val === 'N/A' ? val : Number(val).toFixed(2) + 'ms';
    const formatNum = (val) => val === 'N/A' ? val : Number(val).toFixed(2);
    const formatPct = (val) => val === 'N/A' ? val : (Number(val) * 100).toFixed(2) + '%';

    const markdown = `
## 🚀 API Load Testing Results (100 VUs, 1m)

| Metric | Result |
|--------|--------|
| **Total Requests** | ${totalRequests} |
| **Throughput (RPS)** | ${formatNum(rps)} req/s |
| **Failure Rate** | ${formatPct(failureRate)} |
| **Avg Latency** | ${formatMs(avgLatency)} |
| **Min Latency** | ${formatMs(minLatency)} |
| **Max Latency** | ${formatMs(maxLatency)} |
| **p(95) Latency** | ${formatMs(p95Latency)} |

*Load test executed successfully via k6. Thresholds: p95 < 1500ms, Error Rate < 5%.*
`;

    console.log(markdown);
    
    if (process.env.GITHUB_STEP_SUMMARY) {
      fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, markdown);
    }
  } catch (error) {
    console.error('Error parsing summary:', error);
    process.exit(1);
  }
}

parseSummary();
