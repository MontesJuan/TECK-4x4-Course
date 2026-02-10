import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    console.log("Seeding database...");

    // Module 1
    const mod1 = await prisma.module.upsert({
        where: { order: 1 },
        update: {},
        create: {
            title: "Modulo 1 - Seguridad Vial",
            description: "Conceptos básicos de seguridad vial, siniestros y normativas.",
            videoUrl: "https://drive.google.com/file/d/1PjJjNMYTl0flM4srgdM76Je_kFPfdhCk/preview",
            order: 1,
            questions: {
                create: [
                    {
                        text: "¿Qué es la Seguridad Vial?",
                        options: {
                            create: [
                                { text: "Es el conjunto de normas destinadas únicamente a regular la velocidad de los vehículos.", isCorrect: false },
                                { text: "Es el sistema de señales de tránsito que ordena la circulación en calles y rutas.", isCorrect: false },
                                { text: "Es el conjunto de acciones, normas y medidas destinadas a prevenir accidentes de tránsito y proteger la vida y la integridad de las personas que circulan por la vía pública.", isCorrect: true },
                            ],
                        },
                    },
                    {
                        text: "¿Cuál es la diferencia entre Accidente vial y Siniestro vial?",
                        options: {
                            create: [
                                { text: "Accidente vial: Hecho fortuito e inevitable. Siniestro vial: Hecho evitable, producto de fallas humanas, mecánicas, etc.", isCorrect: true },
                                { text: "Accidente vial: Evento causado exclusivamente por condiciones climáticas. Siniestro vial: Evento causado únicamente por error humano.", isCorrect: false },
                                { text: "Accidente vial: Hecho leve sin consecuencias. Siniestro vial: Hecho grave con víctimas fatales.", isCorrect: false },
                            ],
                        },
                    },
                    {
                        text: "¿Cuál es el límite máximo de velocidad de circulación? (Opción correcta general)",
                        options: {
                            create: [
                                { text: "Calles: 40, Avenidas: 60, Rutas rural: 110 (autos), Autopistas: 130 (autos)", isCorrect: true },
                                { text: "Calles: 50, Avenidas: 80, Rutas: 100, Autopistas: 120", isCorrect: false },
                                { text: "Calles: 30, Avenidas: 50, Rutas: 90, Autopistas: 110", isCorrect: false },
                            ],
                        },
                    },
                    {
                        text: "¿Qué se entiende por fatiga y somnolencia en la conducción?",
                        options: {
                            create: [
                                { text: "Fatiga: Cansancio físico/mental que reduce atención. Somnolencia: Tendencia a dormirse.", isCorrect: true },
                                { text: "Fatiga: Molestia leve. Somnolencia: Solo ocurre de noche.", isCorrect: false },
                                { text: "Fatiga: Condición normal. Somnolencia: Se controla con café.", isCorrect: false },
                            ],
                        },
                    },
                    {
                        text: "La señalización que realiza el conductor con su vehículo, ¿debo utilizarla siempre para realizar una maniobra?",
                        options: {
                            create: [
                                { text: "Si", isCorrect: true },
                                { text: "No", isCorrect: false },
                            ],
                        },
                    },
                    {
                        text: "A un vehículo de emergencia que no está en servicio ¿se le debe ceder el paso?",
                        options: {
                            create: [
                                { text: "Si", isCorrect: false },
                                { text: "No", isCorrect: true },
                            ],
                        },
                    },
                    {
                        text: "En una rotonda, ¿quién tiene prioridad de paso?",
                        options: {
                            create: [
                                { text: "El que circula por la rotonda", isCorrect: true },
                                { text: "El que ingresa a la rotonda", isCorrect: false },
                            ],
                        },
                    },
                    {
                        text: "Mencione los factores de la trilogía vial.",
                        options: {
                            create: [
                                { text: "Humano, físico, químico", isCorrect: false },
                                { text: "Humano, vehicular, ambiental", isCorrect: true },
                                { text: "Humano, vehicular, matemático", isCorrect: false },
                            ],
                        },
                    },
                    {
                        text: "¿Cuál es el factor principal en los siniestros viales?",
                        options: {
                            create: [
                                { text: "Factor ambiental", isCorrect: false },
                                { text: "Factor vehicular", isCorrect: false },
                                { text: "Factor Humano", isCorrect: true },
                            ],
                        },
                    },
                    {
                        text: "Los sistemas pasivos de seguridad son:",
                        options: {
                            create: [
                                { text: "Cinturón de seguridad, airbags, apoyacabeza, chasis.", isCorrect: true },
                                { text: "Freno, suspensión, dirección, neumáticos, espejos.", isCorrect: false },
                            ],
                        },
                    },
                    {
                        text: "La documentación reglamentaria para circular es:",
                        options: {
                            create: [
                                { text: "Licencia de conducir, Seguro, RTO, Autorización de manejo, Tarjeta verde o azul.", isCorrect: true },
                                { text: "Manual del usuario, extintor, gato, eslinga.", isCorrect: false },
                            ],
                        },
                    },
                    {
                        text: "Un cruce de calles con semáforo en rojo. ¿puede ser atravesado por un vehículo si no viene ninguno por la otra vía?",
                        options: {
                            create: [
                                { text: "Si", isCorrect: false },
                                { text: "No", isCorrect: true },
                            ],
                        },
                    },
                    {
                        text: "¿Qué es una senda peatonal? ¿para que se usa?",
                        options: {
                            create: [
                                { text: "Es el lugar de la calzada destinado al cruce de peatones.", isCorrect: true },
                                { text: "Es cualquier lugar de la calzada.", isCorrect: false },
                            ],
                        },
                    },
                    {
                        text: "Los paragolpes corresponden a...",
                        options: {
                            create: [
                                { text: "La seguridad activa.", isCorrect: false },
                                { text: "La seguridad pasiva.", isCorrect: true },
                            ],
                        },
                    },
                    {
                        text: "Al estacionar, que debo tener en cuenta",
                        options: {
                            create: [
                                { text: "Equipos de operación, distancia mínima de 50 mtr", isCorrect: false },
                                { text: "Bolsillo o Banquina habilitadas", isCorrect: false },
                                { text: "Todas son correctas", isCorrect: true },
                            ],
                        },
                    },
                    {
                        text: "Como se activa una emergencia.",
                        options: {
                            create: [
                                { text: "Emergencia, emergencia, emergencia. 2. ¿Quién modula? 3. ¿Dónde se encuentra? 4. ¿Qué ocurrió? 5. Personas involucradas.", isCorrect: true },
                                { text: "Nombre de las personas involucradas. Seguir con la actividad.", isCorrect: false },
                            ],
                        },
                    },
                ],
            },
        },
    });

    // Module 2
    const mod2 = await prisma.module.upsert({
        where: { order: 2 },
        update: {},
        create: {
            title: "Modulo 2 - Manejo Defensivo",
            description: "Técnicas de manejo defensivo y prevención de riesgos.",
            videoUrl: "https://drive.google.com/file/d/1zVCm9zCkVpDv2DaA7-4VXbZ_rJzty5EB/preview",
            order: 2,
            questions: {
                create: [
                    {
                        text: "¿Qué es el manejo defensivo?",
                        options: {
                            create: [
                                { text: "Conjunto de técnicas y actitudes que permiten anticiparse a situaciones de riesgo, evitando siniestros viales propios o causados por terceros.", isCorrect: true },
                                { text: "Forma de conducción rápida para reducir tiempos de viaje.", isCorrect: false },
                                { text: "Estilo de manejo aplicado solo en rutas de montaña.", isCorrect: false },
                                { text: "Conducción basada únicamente en la experiencia del conductor.", isCorrect: false },
                            ],
                        },
                    },
                    {
                        text: "¿Cuáles son los elementos que conforman el manejo defensivo?",
                        options: {
                            create: [
                                { text: "Velocidad, experiencia, confianza y rapidez.", isCorrect: false },
                                { text: "Conocimiento, estar alerta, previsión, juicio y habilidad.", isCorrect: true },
                                { text: "Fuerza, reflejos, potencia del vehículo y tiempo.", isCorrect: false },
                                { text: "Atención parcial y reacción inmediata.", isCorrect: false },
                            ],
                        },
                    },
                    {
                        text: "¿Cuál de las siguientes es una causa principal de accidentes viales?",
                        options: {
                            create: [
                                { text: "Exclusivamente condiciones climáticas adversas.", isCorrect: false },
                                { text: "Únicamente fallas mecánicas del vehículo.", isCorrect: false },
                                { text: "Error humano, distracciones, exceso de velocidad y conducción imprudente.", isCorrect: true },
                                { text: "El estado de la ruta sin intervención del conductor.", isCorrect: false },
                            ],
                        },
                    },
                    {
                        text: "¿Qué se consideran factores naturales de riesgo en la conducción?",
                        options: {
                            create: [
                                { text: "Lluvia, niebla, viento, nieve, hielo y baja visibilidad.", isCorrect: true },
                                { text: "Tránsito intenso en horarios pico.", isCorrect: false },
                                { text: "Señalización deficiente.", isCorrect: false },
                                { text: "Estado emocional del conductor", isCorrect: false },
                            ],
                        },
                    },
                    {
                        text: "¿Cómo influyen las condiciones de la ruta en la seguridad vial?",
                        options: {
                            create: [
                                { text: "Únicamente influyen en zonas urbanas.", isCorrect: false },
                                { text: "No influyen si el conductor tiene experiencia.", isCorrect: false },
                                { text: "Solo afectan a vehículos pesados.", isCorrect: false },
                                { text: "Pueden aumentar el riesgo por baches, curvas cerradas, calzada resbaladiza o señalización deficiente.", isCorrect: true },
                            ],
                        },
                    },
                    {
                        text: "¿Qué condiciones del conductor aumentan el riesgo de siniestros viales?",
                        options: {
                            create: [
                                { text: "Fatiga, estrés, distracciones, consumo de alcohol o drogas y estados emocionales alterados.", isCorrect: true },
                                { text: "Buena alimentación y descanso adecuado.", isCorrect: false },
                                { text: "Uso del cinturón de seguridad.", isCorrect: false },
                                { text: "Conocimiento de normas de tránsito.", isCorrect: false },
                            ],
                        },
                    },
                    {
                        text: "¿Qué efecto tiene el consumo de alcohol y drogas en la conducción?",
                        options: {
                            create: [
                                { text: "Solo afecta a conductores inexpertos.", isCorrect: false },
                                { text: "Mejora la concentración en trayectos largos.", isCorrect: false },
                                { text: "No influye en la conducción a baja velocidad.", isCorrect: false },
                                { text: "Disminuye reflejos, atención y capacidad de reacción, aumentando el riesgo de siniestros.", isCorrect: true },
                            ],
                        },
                    },
                    {
                        text: "¿Cuáles son buenos hábitos al conducir?",
                        options: {
                            create: [
                                { text: "Uso del cinturón, respeto de velocidades, atención permanente y distancia de seguridad.", isCorrect: true },
                                { text: "Llegar rápido al destino.", isCorrect: false },
                                { text: "Manejar solo de día.", isCorrect: false },
                                { text: "Conducir sin pausas.", isCorrect: false },
                            ],
                        },
                    },
                    {
                        text: "El check list es obligatorio realizarlo antes de conducir un vehículo",
                        options: {
                            create: [
                                { text: "Verdadero", isCorrect: true },
                                { text: "Falso", isCorrect: false },
                            ],
                        },
                    },
                    {
                        text: "¿Cuánto aumenta el riesgo de accidente el uso del celular?",
                        options: {
                            create: [
                                { text: "No aumenta", isCorrect: false },
                                { text: "Duplica el riesgo", isCorrect: false },
                                { text: "Aumenta 4 veces el riesgo", isCorrect: true },
                            ],
                        },
                    },
                    {
                        text: "¿Qué hacer ante la neblina?",
                        options: {
                            create: [
                                { text: "Usar luces altas", isCorrect: false },
                                { text: "Aumentar la velocidad para salir rápido", isCorrect: false },
                                { text: "Reducir la velocidad y utilizar luces bajas o neblineros", isCorrect: true },
                            ],
                        },
                    },
                ],
            },
        },
    });

    // Module 3
    const mod3 = await prisma.module.upsert({
        where: { order: 3 },
        update: {},
        create: {
            title: "Modulo 3 - Conducción 4x4",
            description: "Operación de vehículos, modos 4x4 y técnicas off-road.",
            videoUrl: "https://drive.google.com/file/d/1JDsjo8jqkl0ZSLN7QTDlgPCISsDQBH66/preview",
            order: 3,
            questions: {
                create: [
                    {
                        text: "¿Cómo se coloca el modo L4 (Posición baja LOW de 4x4)?",
                        options: {
                            create: [
                                { text: "Con el vehículo detenido, embrague apretado y pasar el selector de H4 a L4", isCorrect: true },
                                { text: "Con el vehículo detenido, embrague apretado y pasar el selector de H2 a L4", isCorrect: false },
                            ],
                        },
                    },
                    {
                        text: "¿Cómo hacer para cruzar un rio o cruce de agua?",
                        options: {
                            create: [
                                { text: "A favor de la corriente del rio", isCorrect: false },
                                { text: "Velocidad controlada y constante", isCorrect: false },
                                { text: "Todas son correctas", isCorrect: true },
                            ],
                        },
                    },
                    {
                        text: "Si el vehículo se atora en barro o arena, tengo que dejar de acelerar.",
                        options: {
                            create: [
                                { text: "Verdadero", isCorrect: false },
                                { text: "Falso", isCorrect: true },
                            ],
                        },
                    },
                    {
                        text: "Mencione los ángulos de la geometría del vehículo.",
                        options: {
                            create: [
                                { text: "Ataque, ventral, salida", isCorrect: true },
                                { text: "Entrada, ventral, salida", isCorrect: false },
                                { text: "Ataque, medio, trasero", isCorrect: false },
                            ],
                        },
                    },
                    {
                        text: "¿Cómo activamos el bloqueo de diferencial?",
                        options: {
                            create: [
                                { text: "Colocamos la L4", isCorrect: false },
                                { text: "Frenamos el vehículo", isCorrect: false },
                                { text: "A y B son correctas", isCorrect: true },
                            ],
                        },
                    },
                    {
                        text: "En caso de quedar atrapado por un temporal o la nieve",
                        options: {
                            create: [
                                { text: "Realice las comunicaciones por radio", isCorrect: false },
                                { text: "Permanezca dentro del vehículo", isCorrect: false },
                                { text: "Todas son correctas", isCorrect: true },
                            ],
                        },
                    },
                    {
                        text: "¿Cómo se coloca el modo H4 (Posición alta de 4x4)?",
                        options: {
                            create: [
                                { text: "Con el vehículo detenido, embrague apretado y pasar el selector de H2 a H4", isCorrect: false },
                                { text: "Con el vehículo en movimiento, pasar el selector de H2 a H4", isCorrect: true },
                                { text: "Todas son correctas", isCorrect: true },
                            ],
                        },
                    },
                    {
                        text: "¿Cuáles son las posiciones de manejo de un vehículo 4x4?",
                        options: {
                            create: [
                                { text: "H2: Alta simple, H4: Alta doble, L4: Baja doble", isCorrect: true },
                                { text: "H4: Alta simple, L4: Alta Doble, N: Neutro", isCorrect: false },
                            ],
                        },
                    },
                    {
                        text: "PENDIENTES DESCENDENTES, Si el vehículo se embala",
                        options: {
                            create: [
                                { text: "Frenar bruscamente", isCorrect: false },
                                { text: "Hacer toques suaves al pedal de freno.", isCorrect: true },
                            ],
                        },
                    },
                    {
                        text: "¿Qué es la profundidad de vadeo?",
                        options: {
                            create: [
                                { text: "Profundidad que podremos enfrentar al cruzar un rio", isCorrect: true },
                                { text: "Distancia entre ejes del vehículo", isCorrect: false },
                            ],
                        },
                    },
                    {
                        text: "¿Cómo funciona el bloqueo diferencial?",
                        options: {
                            create: [
                                { text: "Bloquea el diferencial, para que ambas ruedas tracciones juntas equitativamente", isCorrect: true },
                                { text: "Bloquea el diferencial, para que una rueda traccione individualmente", isCorrect: false },
                            ],
                        },
                    },
                ],
            },
        },
    });

    // Module 4
    const mod4 = await prisma.module.upsert({
        where: { order: 4 },
        update: {},
        create: {
            title: "Modulo 4 - Cuidado y Equipamiento",
            description: "Mantenimiento, equipamiento y cuidado del vehículo.",
            videoUrl: "https://drive.google.com/file/d/1wt9nHY3unPSHYtFPn1PZVeM374YHeo9i/preview",
            order: 4,
            questions: {
                create: [
                    {
                        text: "¿Qué se entiende por cuidado del vehículo en conducción off road?",
                        options: {
                            create: [
                                { text: "Realizar inspecciones periódicas, utilizar correctamente el 4x4 y evitar maniobras que generen daños innecesarios.", isCorrect: true },
                                { text: "Conducir sin considerar el estado del terreno.", isCorrect: false },
                            ],
                        },
                    },
                    {
                        text: "¿Cuál de los siguientes elementos forma parte del equipamiento de seguridad básico para conducción 4x4?",
                        options: {
                            create: [
                                { text: "Extintor, botiquín, eslinga de remolque, herramientas básicas y elementos de señalización.", isCorrect: true },
                                { text: "Accesorios estéticos del vehículo.", isCorrect: false },
                            ],
                        },
                    },
                    {
                        text: "¿Cuál es la forma correcta de realizar un remolque o arrastre 4x4?",
                        options: {
                            create: [
                                { text: "Utilizando puntos de anclaje adecuados, eslingas certificadas y comunicación clara.", isCorrect: true },
                                { text: "Atando la eslinga al paragolpes.", isCorrect: false },
                            ],
                        },
                    },
                    {
                        text: "¿Para qué se utiliza el gato Hi-Lift en conducción off road?",
                        options: {
                            create: [
                                { text: "Para levantar el vehículo en terrenos irregulares y facilitar rescates o cambios de rueda.", isCorrect: true },
                                { text: "Para elevar el vehículo a alta velocidad.", isCorrect: false },
                            ],
                        },
                    },
                    {
                        text: "¿Cuál de las siguientes afirmaciones causa el reventón de neumáticos?",
                        options: {
                            create: [
                                { text: "Sobrecarga, Exceso de velocidad, Neumáticos defectuosos", isCorrect: false },
                                { text: "Todas son correctas", isCorrect: true },
                            ],
                        },
                    },
                    {
                        text: "¿Cuál es la importancia de realizar un checklist previo a la conducción off road?",
                        options: {
                            create: [
                                { text: "Detectar fallas, verificar equipamiento y reducir riesgos antes de iniciar el recorrido.", isCorrect: true },
                                { text: "Cumplir solo con un requisito administrativo.", isCorrect: false },
                            ],
                        },
                    },
                    {
                        text: "¿Cuáles son los principales niveles de fluidos a revisar de un vehículo?",
                        options: {
                            create: [
                                { text: "Refrigerante, Hidráulico, Aceite, Liquido limpia parabrisa, Liquido de freno", isCorrect: false },
                                { text: "Todas son correctas", isCorrect: true },
                            ],
                        },
                    },
                    {
                        text: "¿Cómo nos damos cuenta una falla en el freno?",
                        options: {
                            create: [
                                { text: "Pedal abajo, Freno de mano estirado, Bajo liquido, Chillido, Discos deformados", isCorrect: false },
                                { text: "Todas son correctas", isCorrect: true },
                            ],
                        },
                    },
                    {
                        text: "¿SOBRE QUE RUEDAS ACTÚA EL FRENO DE MANO DE UN AUTOMÓVIL?",
                        options: {
                            create: [
                                { text: "Sobre las cuatro.", isCorrect: false },
                                { text: "Sobre las traseras solamente.", isCorrect: true },
                                { text: "Sólo sobre las ruedas delanteras.", isCorrect: false },
                            ],
                        },
                    },
                    {
                        text: "¿Cuál de estos líquidos, en caso de estar en un nivel bajo, podría causar un accidente?",
                        options: {
                            create: [
                                { text: "Liquido de freno.", isCorrect: true },
                                { text: "Anticongelante.", isCorrect: false },
                            ],
                        },
                    },
                    {
                        text: "Es necesario calibrar los neumáticos según el terreno a enfrentar",
                        options: {
                            create: [
                                { text: "Si", isCorrect: true },
                                { text: "No", isCorrect: false },
                            ],
                        },
                    },
                    {
                        text: "¿Cómo nos darnos cuenta del embrague roto?",
                        options: {
                            create: [
                                { text: "Ruidos, No entra cambio, Salta el cambio", isCorrect: false },
                                { text: "Todas son correctas", isCorrect: true },
                            ],
                        },
                    },
                    {
                        text: "Técnicas de Recuperación y Rescate 4X4 ¿Cuáles son?",
                        options: {
                            create: [
                                { text: "Remolque, Gatos Hi-Lift, Cabestrante, Tablas", isCorrect: false },
                                { text: "Todas son correctas", isCorrect: true },
                            ],
                        },
                    },
                    {
                        text: "¿Cuál es la profundidad mínima del dibujo del neumático?",
                        options: {
                            create: [
                                { text: "0.5 mm", isCorrect: false },
                                { text: "1.6 mm", isCorrect: true },
                                { text: "3 mm", isCorrect: false },
                            ],
                        },
                    },
                    {
                        text: "¿Cada cuánto se recomienda revisar el filtro de aire en condiciones de polvo?",
                        options: {
                            create: [
                                { text: "Semanalmente o diario", isCorrect: true },
                                { text: "Cada año", isCorrect: false },
                            ],
                        },
                    },
                    {
                        text: "¿Color del líquido de frenos en mal estado?",
                        options: {
                            create: [
                                { text: "Transparente", isCorrect: false },
                                { text: "Negro oscuro", isCorrect: true },
                                { text: "Rojo vivo", isCorrect: false },
                            ],
                        },
                    },
                ],
            },
        },
    });

    console.log({ mod1, mod2, mod3, mod4 });
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
