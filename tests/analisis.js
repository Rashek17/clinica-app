const fs = require("fs");
const os = require("os");

// Leer archivo JSON generado por Artillery
const data = JSON.parse(fs.readFileSync("../tests/reporte.json", "utf8"));

// Extraer métricas de Artillery
const totalRequests = data.aggregate.counters["http.requests"];
const successfulRequests = data.aggregate.counters["http.codes.200"];
const failedRequests = data.aggregate.counters["vusers.failed"];
const errorRate = (failedRequests / totalRequests) * 100;
const availability = 100 - errorRate;
const avgResponseTime = data.aggregate.summaries["http.response_time"].mean;
const throughput = data.aggregate.rates["http.request_rate"];
const maxUsers = data.aggregate.counters["vusers.created"];

// Obtener métricas del sistema (CPU y RAM)
const cpuLoad = os.loadavg()[0]; // Promedio de carga en 1 minuto
const totalMem = os.totalmem() / (1024 ** 3); // Convertido a GB
const freeMem = os.freemem() / (1024 ** 3); // Convertido a GB
const usedMem = totalMem - freeMem;
const usedMemPercent = (usedMem / totalMem) * 100;

// Mostrar resultados
console.log({
    totalRequests,
    successfulRequests,
    failedRequests,
    errorRate: errorRate.toFixed(2) + '%',
    availability: availability.toFixed(2) + '%',
    avgResponseTime,
    throughput,
    maxUsers
});

console.log("\n📊 RESULTADOS PERSONALIZADOS DE LA PRUEBA DE CARGA\n");

console.log(`🔁 Tiempo de respuesta promedio: ${avgResponseTime.toFixed(2)} ms`);
console.log(`🧠 Uso de CPU (loadavg 1min): ${cpuLoad.toFixed(2)} (depende del número de núcleos)`);
console.log(`💾 Uso de RAM: ${usedMem.toFixed(2)} GB de ${totalMem.toFixed(2)} GB (${usedMemPercent.toFixed(2)}%)`);
console.log(`👥 Cantidad de usuarios simultáneos simulados: ${maxUsers} usuarios/segundo`);
console.log(`❌ Tasa de errores: ${errorRate.toFixed(2)}%`);
console.log(`⚙️ Throughput: ${throughput.toFixed(2)} transacciones/segundo`);
console.log(`✅ Disponibilidad del sistema: ${availability.toFixed(2)}%`);
console.log(`📦 Total de solicitudes: ${totalRequests}`);
console.log(`✔️ Exitosas: ${successfulRequests}`);
console.log(`❗ Fallidas: ${failedRequests}\n`);
