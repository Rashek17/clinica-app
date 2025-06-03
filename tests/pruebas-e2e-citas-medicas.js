// pruebas-e2e-citas-medicas.js
const {
  Builder,
  By,
  Key,
  until
} = require('selenium-webdriver');
require('chromedriver');

(async function testCitasMedicas() {
  let driver = await new Builder().forBrowser('chrome').build();
  await driver.manage().window().maximize();
  try {
    // URL del sistema
    await driver.get('http://127.0.0.1:5500/index.html');
    await driver.sleep(3000); // para ver el navegador abierto por unos segundos

    await driver.wait(until.alertIsPresent());
    let alert = await driver.switchTo().alert();
    await alert.accept(); // hace clic en "Aceptar"

    await driver.sleep(5000);

    // Esperar que el input de usuario esté visible
    await driver.wait(until.elementLocated(By.id('txtUsuario')), 5000);

    // Obtener input usuario y password
    const usuarioInput = await driver.findElement(By.id('txtUsuario'));

    // Limpiar y setear valores
    await usuarioInput.clear();
    await usuarioInput.sendKeys('franco@Gmal.com');

    //Login como paciente
    await driver.executeScript("login()");
    //Si todo esta correcto deberia enviar el usuario y password correcto a la vista correspondiente. En este caso paciente
    await driver.sleep(5000);

    // Esperar que el select de tipo de cita esté presente
    await driver.wait(until.elementLocated(By.id('descripcion')), 5000);

    // Seleccionar "Medicina general" (value = 3)
    const selectTipo = await driver.findElement(By.id('descripcion'));
    await selectTipo.sendKeys('Medicina general'); // También puedes usar value '3' directamente si quieres

    // Esperar que el input de fecha esté presente
    const inputFecha = await driver.findElement(By.id('fecha'));
    const hoy = new Date().toISOString().split('T')[0]; // '2025-06-03'
    await driver.executeScript("arguments[0].value = arguments[1]", inputFecha, hoy);

    // Obtener la hora actual del sistema en formato HH:MM
    const ahora = new Date();
    const horas = ahora.getHours().toString().padStart(2, '0');
    const minutos = ahora.getMinutes().toString().padStart(2, '0');
    const horaActual = `${horas}:${minutos}`;

    // Ingresar en el input tipo time
    const inputHora = await driver.findElement(By.id('hora'));
    await driver.executeScript("arguments[0].value = arguments[1]", inputHora, horaActual);



    // Clic en el botón Guardar
    const btnGuardar = await driver.findElement(By.xpath("//button[contains(text(), 'Guardar')]"));
    await btnGuardar.click();

    // Esperar un momento para que se procese la cita
    await driver.sleep(3000);

    // Esperar el alert
    await driver.wait(until.alertIsPresent(), 5000);

    // Cambiar el foco al alert
    const alertGurdado = await driver.switchTo().alert();

    // Aceptar el alert (click en "Aceptar")
    await alertGurdado.accept();

    // Recargar la página para limpiar sesión anterior (opcional)
    await driver.navigate().refresh();
    await driver.sleep(3000); // Tiempo reducido a 3s, suficiente

    // Navegar al login
    await driver.get('http://127.0.0.1:5500/index.html');
    await driver.sleep(3000);

    // Esperar que el input de usuario esté visible y obtenerlo
    const usuarioInputL = await driver.wait(until.elementLocated(By.id('txtUsuario')), 5000);

    // Limpiar inputs
    await usuarioInputL.clear();

    // Ingresar nuevo usuario y contraseña
    await usuarioInputL.sendKeys('carlos.garcia@email.com');
    // Ejecutar función de login (debe estar disponible en la página)
    await driver.executeScript("login()");

    // Esperar navegación/redirección posterior al login
    await driver.sleep(5000);

    // Esperar a que el botón esté presente en el DOM
    const botonVerCitas = await driver.wait(until.elementLocated(By.id('ver-citas')), 5000);

    // Darle clic al botón "Ver"
    await botonVerCitas.click();
    // Esperar navegación/redirección posterior al login
    await driver.sleep(5000);

    // Navegar al login
    await driver.get('http://127.0.0.1:5500/index.html');
    await driver.sleep(3000);

    // Esperar que los inputs estén visibles
    const usuarioInputA = await driver.wait(until.elementLocated(By.id('txtUsuario')), 5000);

    // Limpiar los inputs
    await usuarioInputA.clear();

    // Ingresar nuevo usuario y contraseña
    await usuarioInputA.sendKeys('admin@gmail.com.co');

    // Ejecutar la función de login
    await driver.executeScript("login()");

    // Esperar redirección o carga de la vista admin
    await driver.sleep(5000);


  } catch (error) {
    console.error('❌ Error en la prueba:', error);
  } finally {
    await driver.quit();
  }
})();
//Para ejecutar este test, asegúrate de tener instalado Node.js y el paquete selenium-webdriver.
// Puedes instalarlo con el siguiente comando: node pruebas-e2e-citas-medicas.js