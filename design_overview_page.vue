<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Top Navigation Bar -->
    <header class="bg-white border-b border-gray-200 px-5 py-3 flex items-center justify-between">
      <div class="flex items-center gap-2 bg-gray-100 border border-gray-200 rounded-lg px-3 py-2 w-64">
        <i class="ti ti-search text-gray-400 text-sm"></i>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search analytics, orders, or stock..."
          class="bg-transparent text-sm text-gray-500 outline-none w-full placeholder-gray-400"
        />
      </div>
      <div class="flex items-center gap-3">
        <button class="w-8 h-8 flex items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 transition">
          <i class="ti ti-bell text-base"></i>
        </button>
        <button class="w-8 h-8 flex items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 transition">
          <i class="ti ti-help text-base"></i>
        </button>
        <div class="w-8 h-8 rounded-full bg-blue-700 flex items-center justify-center text-white text-xs font-medium">
          JD
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="p-5">
      <!-- Page Header -->
      <div class="flex items-start justify-between mb-5 flex-wrap gap-3">
        <div>
          <h1 class="text-2xl font-medium text-gray-900">Dashboard Overview</h1>
          <p class="text-sm text-gray-500 mt-0.5">Real-time performance metrics for today</p>
        </div>
        <div class="flex items-center gap-2">
          <button class="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm text-gray-600 hover:bg-gray-50 transition">
            <i class="ti ti-calendar text-sm"></i>
            Last 24 Hours
          </button>
          <button class="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-700 text-sm text-white font-medium hover:bg-blue-800 transition">
            <i class="ti ti-download text-sm"></i>
            Export Report
          </button>
        </div>
      </div>

      <!-- Metric Cards -->
      <div class="grid grid-cols-3 gap-3 mb-5">
        <!-- Total Sales Card -->
        <div class="bg-blue-700 rounded-xl p-4 text-white">
          <p class="text-xs font-medium uppercase tracking-wider text-blue-200 mb-1">Total Sales (Today)</p>
          <p class="text-3xl font-medium text-white">{{ formatCurrency(metrics.totalSales) }}</p>
          <span class="inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full mt-2 bg-white/10 text-blue-100">
            <i class="ti ti-trending-up text-xs"></i>
            +12.4% vs last week
          </span>
          <div class="metric-sparkbar mt-3" aria-hidden="true">
            <div v-for="(bar, i) in sparkBars" :key="i" :style="{ height: bar + '%' }"></div>
          </div>
          <p class="text-xs text-blue-200 mt-1">Peak at 12:45 PM</p>
        </div>

        <!-- Orders Card -->
        <div class="bg-white rounded-xl p-4 border border-gray-100">
          <div class="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center mb-3">
            <i class="ti ti-tools-kitchen-2 text-gray-500 text-xl"></i>
          </div>
          <p class="text-xs font-medium uppercase tracking-wider text-gray-400 mb-1">Orders</p>
          <p class="text-3xl font-medium text-gray-900">{{ metrics.orders }}</p>
          <span class="inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full mt-2 bg-red-50 text-red-600">
            <i class="ti ti-trending-down text-xs"></i>
            -2%
          </span>
        </div>

        <!-- Active Tables Card -->
        <div class="bg-white rounded-xl p-4 border border-gray-100">
          <div class="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center mb-3">
            <i class="ti ti-armchair text-gray-500 text-xl"></i>
          </div>
          <p class="text-xs font-medium uppercase tracking-wider text-gray-400 mb-1">Active Tables</p>
          <div class="flex items-baseline gap-1">
            <p class="text-3xl font-medium text-gray-900">{{ metrics.activeTables }}</p>
            <span class="text-sm text-gray-400">/ {{ metrics.totalTables }}</span>
          </div>
          <span class="inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full mt-2 bg-green-50 text-green-700">
            <i class="ti ti-trending-up text-xs"></i>
            +16%
          </span>
        </div>
      </div>

      <!-- Sales Performance Chart -->
      <div class="bg-white rounded-xl border border-gray-100 p-5">
        <div class="flex items-start justify-between mb-4">
          <div>
            <h2 class="text-base font-medium text-gray-900">Sales Performance Trend</h2>
            <p class="text-xs text-gray-400 mt-0.5">Revenue vs. Projections (Hourly)</p>
          </div>
          <div class="flex items-center gap-4 text-xs text-gray-500">
            <span class="flex items-center gap-1.5">
              <span class="w-3 h-3 rounded-sm bg-blue-700 inline-block"></span>
              Actual
            </span>
            <span class="flex items-center gap-1.5">
              <span class="w-3 h-3 rounded-sm bg-gray-300 inline-block"></span>
              Target
            </span>
          </div>
        </div>
        <div style="position: relative; width: 100%; height: 240px">
          <canvas
            ref="salesChartRef"
            role="img"
            aria-label="Hourly sales performance chart from 10 AM to 12 AM showing actual revenue versus target projections. Peak around 4 PM."
          >
            Hourly revenue: starts at $620 at 10 AM, peaks at $2,100 around 4 PM, and declines to $210 by midnight.
          </canvas>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import Chart from 'chart.js/auto'

// Reactive state
const searchQuery = ref('')
const salesChartRef = ref(null)
let chartInstance = null

const metrics = ref({
  totalSales: 14284.50,
  orders: 342,
  activeTables: 28,
  totalTables: 45,
})

const sparkBars = ref([30, 45, 38, 60, 72, 88, 100, 82])

// Chart data
const chartLabels = [
  '10 AM', '11 AM', '12 PM', '1 PM', '2 PM', '3 PM',
  '4 PM', '5 PM', '6 PM', '7 PM', '8 PM', '10 PM', '12 AM',
]

const actualData = [620, 850, 1400, 1550, 1700, 1900, 2100, 1800, 1300, 950, 700, 400, 210]
const targetData = [700, 900, 1300, 1500, 1800, 2000, 2000, 1900, 1500, 1100, 800, 500, 300]

// Helpers
function formatCurrency(value) {
  return '$' + value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function initChart() {
  if (!salesChartRef.value) return

  chartInstance = new Chart(salesChartRef.value, {
    type: 'bar',
    data: {
      labels: chartLabels,
      datasets: [
        {
          label: 'Actual',
          data: actualData,
          backgroundColor: '#1d4ed8',
          borderRadius: 4,
          borderSkipped: false,
          barPercentage: 0.6,
          categoryPercentage: 0.75,
        },
        {
          label: 'Target',
          data: targetData,
          type: 'line',
          borderColor: '#d1d5db',
          backgroundColor: 'transparent',
          borderWidth: 1.5,
          borderDash: [4, 3],
          pointRadius: 0,
          tension: 0.4,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: ctx => ' $' + ctx.parsed.y.toLocaleString(),
          },
        },
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: {
            font: { size: 11 },
            color: '#9ca3af',
            autoSkip: false,
            maxRotation: 0,
          },
        },
        y: {
          grid: { color: 'rgba(0,0,0,0.05)' },
          border: { display: false },
          ticks: {
            font: { size: 11 },
            color: '#9ca3af',
            callback: v => '$' + (v / 1000).toFixed(1) + 'k',
          },
        },
      },
    },
  })
}

onMounted(() => {
  initChart()
})

onBeforeUnmount(() => {
  chartInstance?.destroy()
})
</script>

<style scoped>
.metric-sparkbar {
  display: flex;
  align-items: flex-end;
  gap: 2px;
  height: 36px;
}
.metric-sparkbar div {
  flex: 1;
  border-radius: 2px 2px 0 0;
  background: rgba(255, 255, 255, 0.35);
}
</style>