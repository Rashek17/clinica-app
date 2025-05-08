
// pruebas-e2e-citas-medicas.js
const { Builder, By, Key, until } = require('selenium-webdriver');
require('chromedriver');

(async function testCitasMedicas() {
  let driver = await new Builder().forBrowser('chrome').build();
  try {
    // URL del sistema
    await driver.get('http://localhost:3000');

    // 1. Login del paciente
    await driver.findElement(By.name('email')).sendKeys('paciente@example.com');
    await driver.findElement(By.name('password')).sendKeys('123456', Key.RETURN);
    await driver.wait(until.urlContains('/dashboard'), 5000);

    console.log('✅ Login exitoso');

    // 2. Agendar una cita médica
    await driver.findElement(By.linkText('Agendar Cita')).click();
    await driver.wait(until.elementLocated(By.name('fecha')), 5000);
    await driver.findElement(By.name('fecha')).sendKeys('2025-05-15');
    await driver.findElement(By.name('hora')).sendKeys('10:00');
    await driver.findElement(By.name('motivo')).sendKeys('Chequeo general');
    await driver.findElement(By.css('button[type="submit"]')).click();

    console.log('✅ Cita agendada');

    // 3. Ver historial médico
    await driver.findElement(By.linkText('Historial Médico')).click();
    await driver.wait(until.elementLocated(By.css('.historial')), 5000);

    console.log('✅ Historial médico visible');

    // 4. Logout
    await driver.findElement(By.linkText('Cerrar Sesión')).click();
    await driver.wait(until.urlIs('http://localhost:3000/login'), 5000);

    console.log('✅ Logout exitoso');

  } catch (error) {
    console.error('❌ Error en la prueba:', error);
  } finally {
    await driver.quit();
  }
})();
