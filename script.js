// ==========================================
// 1. REFERENCIAS
// ==========================================

const startButton =
  document.querySelector('#startButton');

const startScreen =
  document.querySelector('#startScreen');

const scene =
  document.querySelector('#scene');

const field =
  document.querySelector('#field');

const narrative =
  document.querySelector('.narrative');

const narrativeText =
  document.querySelector('#narrativeText');

const interactionHint =
  document.querySelector('#interactionHint');


const experienceControls =
  document.querySelector('#experienceControls');

const replayButton =
  document.querySelector('#replayButton');

const soundButton =
  document.querySelector('#soundButton');

const soundOnIcon =
  document.querySelector('#soundOnIcon');

const soundOffIcon =
  document.querySelector('#soundOffIcon');

const backgroundMusic =
  document.querySelector('#backgroundMusic');


const messageOverlay =
  document.querySelector('#messageOverlay');

const messageClose =
  document.querySelector('#messageClose');

const secretMessage =
  document.querySelector('#secretMessage');


// ==========================================
// 2. CONFIGURACIÓN
// ==========================================

const TOTAL_USER_FLOWERS = 10;

const SLOW_GROWTH_START_AT = 5;

const FAST_GROWTH_START_AT = 7;


const FINAL_FLOWER_TARGET = 25;

const GROUND_FLOWER_TARGET = 15;


const SPECIAL_FLOWER_TARGET = 13;

const REGULAR_SPECIAL_FLOWER_TARGET = 12;

/*
  12 flores normales con frases
  + 1 flor secreta final.

  La flor número 25 existe desde el principio,
  pero solo se activa después de descubrir
  las otras 12 flores especiales.
*/
const SPECIAL_FLOWER_SLOTS = [
  2,
  4,
  5,
  7,
  8,
  11,
  13,
  14,
  17,
  19,
  21,
  24,
  25
];

const FINAL_SECRET_FLOWER_SLOT = 25;


// ==========================================
// 3. MENSAJES SECRETOS
// ==========================================

const SPECIAL_MESSAGES = [

  'Eres un dulcecito que me alegra el día.',

  'Contigo hasta disfruto la monotonía.',

  'Dame chance de escucharte, de entenderte, de besarte y abrazarte cuando no te sientas fuerte.',

  'Tengo una lista de 100 cosas que yo sé que te hacen feliz.',

  'Eres lo mejor que me pasó en la vida.',

  'A veces la riego y no sé qué decirte, pero solo quiero cuidarte.',

  'Juntos somos ese 100%.',

  'Yo a ti te amo con todo y tus mil enojos.',

  'No siempre sé decir las cosas bonito, pero sí sé que te amo muchísimo.',

  'A veces no sé cómo ayudarte, pero nunca quiero que sientas que tienes que cargar todo tú sola.',

  'Tu abrazo sigue siendo uno de mis lugares favoritos.',

  'Me siguen gustando tus ojitos. Muchísimo.'

];


/*
  Esta frase NO entra al sorteo.

  Siempre pertenece a la última
  flor especial del campo.
*/
const FINAL_SECRET_MESSAGE =
  'Si encontraste esta, significa que de verdad te pusiste a revisar todas mis florecitas. Te amo, curiosa. 💛';


// ==========================================
// 4. TIEMPOS
// ==========================================

const SLOW_GROWTH_INTERVAL = 3800;

const FIRST_SLOW_FLOWER_DELAY = 1800;

const MAX_SLOW_AUTOMATIC_FLOWERS = 4;


const SLOW_GROUND_FLOWER_INTERVAL = 4400;

const FIRST_GROUND_FLOWER_DELAY = 2100;


/*
  Fase rápida desde:

  “Podría seguir haciendo que aparezcan
  flores…”
*/
const FAST_GROWTH_INTERVAL = 420;

const FAST_GROUND_FLOWER_INTERVAL = 520;

const FAST_BIG_START_DELAY = 120;

const FAST_GROUND_START_DELAY = 220;


const FINAL_BIG_FLOWER_INTERVAL = 280;

const FINAL_GROUND_FLOWER_INTERVAL = 340;


// ==========================================
// 5. DISTRIBUCIÓN
// ==========================================

const PREFERRED_FLOWER_DISTANCE = 44;


/*
  Más vegetación que antes.

  Sigue siendo ligera porque cada elemento
  es SVG muy pequeño.
*/
const VEGETATION_CLUSTER_COUNT = 30;

const VEGETATION_REVEAL_RADIUS = 155;


// ==========================================
// 6. MÚSICA
// ==========================================

const MUSIC_VOLUME = 0.30;

backgroundMusic.volume =
  MUSIC_VOLUME;


// ==========================================
// 7. NARRATIVA
// ==========================================

const INITIAL_MESSAGE =
  'No quería que este día pasara como cualquier otro.';


const NARRATIVE_AFTER_TAP = [

  'Así que quise darte algo.',

  'Algo pequeño.',

  'Pero hecho pensando en ti.',

  'Y quería que tú también fueras parte de esto.',

  'Y una flor tampoco me pareció suficiente.',

  'Así que hice un lugar donde pudieran crecer todas.',

  'Podría seguir haciendo que aparezcan flores… pero creo que ya entendiste la idea.',

  'No duran unos días.',

  'Mientras esta página exista, estas flores siguen siendo tuyas.',

  'Feliz día de las flores amarillas, mi amor de ojitos bonitos 💛'

];


// ==========================================
// 8. PALETAS
// ==========================================

const FLOWER_PALETTES = [

  {
    petalMain: '#efc94b',
    petalLight: '#f7de78',
    petalDeep: '#d7aa30',

    center: '#93671c',
    centerLight: '#c99732'
  },

  {
    petalMain: '#f2cc4d',
    petalLight: '#f8e184',
    petalDeep: '#ddb23a',

    center: '#9c7020',
    centerLight: '#cfa13a'
  },

  {
    petalMain: '#eac044',
    petalLight: '#f4d66d',
    petalDeep: '#ce9f2b',

    center: '#875e1b',
    centerLight: '#ba892f'
  }

];


// ==========================================
// 9. VARIANTES
// ==========================================

/*
  Tres flores de la misma familia.

  No intentamos crear especies diferentes.

  0 = abierta de 8 pétalos
  1 = 6 pétalos redondos
  2 = 7 pétalos silvestres
*/

function createFlowerVariantDeck() {

  return shuffleArray([
    ...Array(10).fill(0),
    ...Array(8).fill(1),
    ...Array(7).fill(2)
  ]);
}


// ==========================================
// 10. ESTADO
// ==========================================

let userFlowerCount = 0;

let plantingEnabled = false;

let narrativeEnabled = false;

let explorationEnabled = false;


let slowGrowthStarted = false;

let fastGrowthStarted = false;

let finalGrowthAccelerated = false;


let slowAutomaticFlowerCount = 0;

let groundFlowerCount = 0;

let groundAnchorIndex = 0;

let visualFlowerCount = 0;


let largeFlowerSerial = 0;

let specialFlowerCount = 0;

/*
  Cuenta únicamente las 12 flores especiales
  normales descubiertas por primera vez.
*/
let discoveredRegularSpecialCount = 0;

/*
  Referencia a la flor número 25.

  Al principio se comporta como una flor normal.
*/
let finalSecretFlower = null;


let specialMessageDeck =
  shuffleArray(
    [...SPECIAL_MESSAGES]
  );


let flowerVariantDeck =
  createFlowerVariantDeck();


// ==========================================
// 11. POSICIONES
// ==========================================

const originalSaraFlowers = [];

const allFlowerPositions = [];

const vegetationClusters = [];


// ==========================================
// 12. TEMPORIZADORES
// ==========================================

let narrativeTimer = null;

let hintTimer = null;

let slowGrowthTimer = null;

let slowGrowthStartTimer = null;

let fastGrowthTimer = null;

let fastGrowthStartTimer = null;

let groundFlowerStartTimer = null;

let slowGroundFlowerTimer = null;

let fastGroundFlowerTimer = null;

let fastGroundStartTimer = null;

let messageHideTimer = null;

let finalWindTimer = null;

let finalWindCleanupTimer = null;


// ==========================================
// 13. CAPAS
// ==========================================

let fieldReady = false;

let vegetationLayer = null;

let revealLayer = null;

let flowersBackLayer = null;

let flowersMidLayer = null;

let flowersFrontLayer = null;


// ==========================================
// 14. MÚSICA
// ==========================================

function playBackgroundMusic(
  restart = false
) {

  if (restart) {

    try {

      backgroundMusic.currentTime = 0;

    }

    catch (error) {

      // No hacemos nada.

    }
  }


  const playPromise =
    backgroundMusic.play();


  if (
    playPromise &&
    typeof playPromise.catch ===
    'function'
  ) {

    playPromise.catch(
      () => {}
    );

  }
}


function updateSoundButton() {

  const isMuted =
    backgroundMusic.muted;


  soundOnIcon.hidden =
    isMuted;


  soundOffIcon.hidden =
    !isMuted;


  soundButton.setAttribute(
    'aria-label',

    isMuted

      ? 'Activar música'

      : 'Silenciar música'
  );
}


function toggleSound(
  event
) {

  event.stopPropagation();


  backgroundMusic.muted =
    !backgroundMusic.muted;


  if (
    !backgroundMusic.muted &&
    backgroundMusic.paused
  ) {

    playBackgroundMusic();

  }


  updateSoundButton();
}


// ==========================================
// 15. INICIO
// ==========================================

function startExperience() {

  startScreen.hidden =
    true;

  scene.hidden =
    false;

  experienceControls.hidden =
    false;


  plantingEnabled =
    true;

  narrativeEnabled =
    true;

  explorationEnabled =
    false;


  experienceControls.classList.remove(
    'is-exploration'
  );


  playBackgroundMusic(
    true
  );


  updateSoundButton();


  window.requestAnimationFrame(
    () => {

      initializeFieldVisuals();

    }
  );


  showNarrative(
    INITIAL_MESSAGE
  );


  hintTimer =
    window.setTimeout(
      showInteractionHint,
      900
    );
}


// ==========================================
// 16. REINICIO
// ==========================================

function restartExperience(
  event
) {

  event.stopPropagation();


  clearExperienceTimers();


  closeSecretMessage(
    true
  );


  backgroundMusic.pause();


  try {

    backgroundMusic.currentTime =
      0;

  }

  catch (error) {

    // Nada.

  }


  userFlowerCount =
    0;

  plantingEnabled =
    false;

  narrativeEnabled =
    false;

  explorationEnabled =
    false;


  slowGrowthStarted =
    false;

  fastGrowthStarted =
    false;

  finalGrowthAccelerated =
    false;


  slowAutomaticFlowerCount =
    0;

  groundFlowerCount =
    0;

  groundAnchorIndex =
    0;

  visualFlowerCount =
    0;


  largeFlowerSerial =
    0;

  specialFlowerCount =
    0;

  discoveredRegularSpecialCount =
    0;

  finalSecretFlower =
    null;


  specialMessageDeck =
    shuffleArray(
      [...SPECIAL_MESSAGES]
    );


  flowerVariantDeck =
    createFlowerVariantDeck();


  originalSaraFlowers.length =
    0;

  allFlowerPositions.length =
    0;

  vegetationClusters.length =
    0;


  field.innerHTML =
    '';


  field.removeAttribute(
    'data-mode'
  );


  field.classList.remove(
    'final-wind-wave'
  );


  field.style.setProperty(
    '--field-reveal-opacity',
    '0.018'
  );


  fieldReady =
    false;


  vegetationLayer =
    null;

  revealLayer =
    null;

  flowersBackLayer =
    null;

  flowersMidLayer =
    null;

  flowersFrontLayer =
    null;


  narrativeText.classList.remove(
    'is-visible'
  );


  narrativeText.textContent =
    '';


  interactionHint.classList.remove(
    'is-visible'
  );


  experienceControls.classList.remove(
    'is-exploration'
  );


  startExperience();
}


// ==========================================
// 17. LIMPIEZA DE TIMERS
// ==========================================

function clearExperienceTimers() {

  window.clearTimeout(
    narrativeTimer
  );

  window.clearTimeout(
    hintTimer
  );

  window.clearTimeout(
    slowGrowthStartTimer
  );

  window.clearTimeout(
    fastGrowthStartTimer
  );

  window.clearTimeout(
    groundFlowerStartTimer
  );

  window.clearTimeout(
    fastGroundStartTimer
  );

  window.clearTimeout(
    messageHideTimer
  );

  window.clearTimeout(
    finalWindTimer
  );

  window.clearTimeout(
    finalWindCleanupTimer
  );


  window.clearInterval(
    slowGrowthTimer
  );

  window.clearInterval(
    fastGrowthTimer
  );

  window.clearInterval(
    slowGroundFlowerTimer
  );

  window.clearInterval(
    fastGroundFlowerTimer
  );


  narrativeTimer =
    null;

  hintTimer =
    null;

  slowGrowthTimer =
    null;

  slowGrowthStartTimer =
    null;

  fastGrowthTimer =
    null;

  fastGrowthStartTimer =
    null;

  groundFlowerStartTimer =
    null;

  slowGroundFlowerTimer =
    null;

  fastGroundFlowerTimer =
    null;

  fastGroundStartTimer =
    null;

  messageHideTimer =
    null;

  finalWindTimer =
    null;

  finalWindCleanupTimer =
    null;
}


// ==========================================
// 18. CREAR CAPAS
// ==========================================

function initializeFieldVisuals() {

  if (fieldReady) {
    return;
  }


  field.innerHTML = `

    <div
      class="field-background"
      aria-hidden="true"
    ></div>

    <div
      class="vegetation-layer"
      id="vegetationLayer"
      aria-hidden="true"
    ></div>

    <div
      class="reveal-layer"
      id="revealLayer"
      aria-hidden="true"
    ></div>

    <div
      class="flowers-layer flowers-back"
      id="flowersBackLayer"
      aria-hidden="true"
    ></div>

    <div
      class="flowers-layer flowers-mid"
      id="flowersMidLayer"
      aria-hidden="true"
    ></div>

    <div
      class="flowers-layer flowers-front"
      id="flowersFrontLayer"
      aria-hidden="true"
    ></div>

  `;


  vegetationLayer =
    document.querySelector(
      '#vegetationLayer'
    );


  revealLayer =
    document.querySelector(
      '#revealLayer'
    );


  flowersBackLayer =
    document.querySelector(
      '#flowersBackLayer'
    );


  flowersMidLayer =
    document.querySelector(
      '#flowersMidLayer'
    );


  flowersFrontLayer =
    document.querySelector(
      '#flowersFrontLayer'
    );


  generateVegetation();


  fieldReady =
    true;
}


// ==========================================
// 19. VEGETACIÓN
// ==========================================

function generateVegetation() {

  vegetationClusters.length =
    0;


  for (
    let index = 0;
    index < VEGETATION_CLUSTER_COUNT;
    index += 1
  ) {

    const cluster =
      document.createElement(
        'div'
      );


    cluster.classList.add(
      'vegetation-cluster'
    );


    const xPercent =
      randomBetween(
        3,
        97
      );


    /*
      Ligero sesgo hacia abajo,
      pero sigue habiendo vegetación
      por todo el campo.
    */
    const verticalRandom =
      Math.pow(
        Math.random(),
        0.78
      );


    const yPercent =
      10 +
      verticalRandom *
      87;


    const scale =
      randomBetween(
        0.66,
        1.28
      );


    const rotation =
      randomBetween(
        -24,
        24
      );


    const baseOpacity =
      randomBetween(
        0.045,
        0.105
      );


    const variant =
      Math.floor(
        randomBetween(
          0,
          4
        )
      );


    cluster.style.left =
      `${xPercent}%`;


    cluster.style.top =
      `${yPercent}%`;


    cluster.style.setProperty(
      '--veg-scale',
      scale.toFixed(2)
    );


    cluster.style.setProperty(
      '--veg-rotation',
      `${rotation.toFixed(1)}deg`
    );


    cluster.style.setProperty(
      '--veg-opacity',
      baseOpacity.toFixed(3)
    );


    cluster.style.opacity =
      baseOpacity.toFixed(3);


    cluster.innerHTML =
      getVegetationSvg(
        variant
      );


    vegetationLayer.appendChild(
      cluster
    );


    vegetationClusters.push({

      element:
        cluster,

      xPercent,

      yPercent,

      baseOpacity,

      revealLevel:
        0

    });

  }
}


// ==========================================
// 20. SVG VEGETACIÓN
// ==========================================

function getVegetationSvg(
  variant
) {

  if (variant === 1) {

    return `

      <svg
        class="vegetation-svg"
        viewBox="0 0 60 60"
        xmlns="http://www.w3.org/2000/svg"
      >

        <path
          class="veg-grass"
          d="M29 57 C25 43 24 29 28 16"
        />

        <path
          class="veg-grass"
          d="M31 57 C34 43 39 29 44 18"
        />

        <path
          class="veg-grass"
          d="M26 57 C22 47 17 37 13 31"
        />

        <path
          class="veg-grass"
          d="M34 57 C39 48 44 42 49 38"
        />

      </svg>

    `;
  }


  if (variant === 2) {

    return `

      <svg
        class="vegetation-svg"
        viewBox="0 0 60 60"
        xmlns="http://www.w3.org/2000/svg"
      >

        <path
          class="veg-stem"
          d="
            M30 57
            C29 45,
             31 34,
             34 21
          "
        />

        <path
          class="veg-stem-soft"
          d="
            M27 57
            C24 48,
             22 40,
             19 32
          "
        />

        <ellipse
          class="veg-leaf"
          cx="35"
          cy="34"
          rx="3"
          ry="7"
          transform="rotate(34 35 34)"
        />

        <ellipse
          class="veg-leaf-soft"
          cx="22"
          cy="42"
          rx="2.7"
          ry="6"
          transform="rotate(-38 22 42)"
        />

        <circle
          class="veg-seed"
          cx="35"
          cy="20"
          r="1.8"
        />

      </svg>

    `;
  }


  if (variant === 3) {

    return `

      <svg
        class="vegetation-svg"
        viewBox="0 0 60 60"
        xmlns="http://www.w3.org/2000/svg"
      >

        <path
          class="veg-stem-soft"
          d="
            M30 56
            C29 47,
             26 41,
             22 35
          "
        />

        <ellipse
          class="veg-leaf"
          cx="22"
          cy="37"
          rx="4"
          ry="8"
          transform="rotate(-55 22 37)"
        />

        <ellipse
          class="veg-leaf-soft"
          cx="29"
          cy="45"
          rx="3.5"
          ry="7"
          transform="rotate(-20 29 45)"
        />

        <ellipse
          class="veg-leaf"
          cx="36"
          cy="48"
          rx="3"
          ry="6"
          transform="rotate(35 36 48)"
        />

      </svg>

    `;
  }


  return `

    <svg
      class="vegetation-svg"
      viewBox="0 0 60 60"
      xmlns="http://www.w3.org/2000/svg"
    >

      <path
        class="veg-stem"
        d="
          M30 57
          C29 45,
           27 35,
           29 24
        "
      />

      <path
        class="veg-stem-soft"
        d="
          M27 57
          C24 47,
           21 40,
           18 35
        "
      />

      <path
        class="veg-stem-soft"
        d="
          M33 57
          C37 47,
           40 41,
           43 35
        "
      />

      <ellipse
        class="veg-leaf"
        cx="23"
        cy="45"
        rx="3"
        ry="7"
        transform="rotate(-42 23 45)"
      />

      <ellipse
        class="veg-leaf-soft"
        cx="38"
        cy="43"
        rx="3"
        ry="6.5"
        transform="rotate(42 38 43)"
      />

    </svg>

  `;
}


// ==========================================
// 21. NARRATIVA
// ==========================================

function showNarrative(
  text
) {

  window.clearTimeout(
    narrativeTimer
  );


  narrativeText.classList.remove(
    'is-visible'
  );


  narrativeTimer =
    window.setTimeout(
      () => {

        narrativeText.textContent =
          text;


        window.requestAnimationFrame(
          () => {

            narrativeText.classList.add(
              'is-visible'
            );

          }
        );

      },
      250
    );
}


function showInteractionHint() {

  if (
    userFlowerCount > 0
  ) {
    return;
  }


  interactionHint.classList.add(
    'is-visible'
  );
}


function hideInteractionHint() {

  interactionHint.classList.remove(
    'is-visible'
  );
}


// ==========================================
// 22. TOQUE
// ==========================================

function handleFieldPointer(
  event
) {

  if (
    event.pointerType ===
      'mouse' &&
    event.button !== 0
  ) {
    return;
  }


  if (
    explorationEnabled
  ) {
    return;
  }


  if (
    plantingEnabled &&
    userFlowerCount <
      TOTAL_USER_FLOWERS
  ) {

    plantUserFlower(
      event
    );


    return;
  }


  if (
    narrativeEnabled &&
    userFlowerCount >=
      TOTAL_USER_FLOWERS
  ) {

    enterExplorationMode();

  }
}


// ==========================================
// 23. PLANTAR FLOR
// ==========================================

function plantUserFlower(
  event
) {

  initializeFieldVisuals();


  const fieldRect =
    field.getBoundingClientRect();


  const x =
    event.clientX -
    fieldRect.left;


  const y =
    event.clientY -
    fieldRect.top;


  const isFirstFlower =
    userFlowerCount ===
    0;


  createFlower(
    x,
    y,
    {
      type:
        'user',

      stable:
        isFirstFlower
    }
  );


  registerFlowerPosition(
    x,
    y,
    'user'
  );


  if (
    userFlowerCount <
    SLOW_GROWTH_START_AT
  ) {

    originalSaraFlowers.push({
      x,
      y
    });

  }


  userFlowerCount +=
    1;


  if (
    userFlowerCount ===
    1
  ) {

    hideInteractionHint();

  }


  showNarrative(

    NARRATIVE_AFTER_TAP[
      userFlowerCount - 1
    ]

  );


  if (
    userFlowerCount ===
    SLOW_GROWTH_START_AT
  ) {

    startSlowGrowth();

    startSlowGroundGrowth();

  }


  if (
    userFlowerCount ===
    FAST_GROWTH_START_AT
  ) {

    startFastGrowth();

  }


  if (
    userFlowerCount ===
    TOTAL_USER_FLOWERS
  ) {

    plantingEnabled =
      false;


    accelerateFinalGrowth();


    finalWindTimer =
      window.setTimeout(
        triggerFinalWindWave,
        700
      );

  }
}


// ==========================================
// 24. ACELERACIÓN FINAL
// ==========================================

function accelerateFinalGrowth() {

  if (
    finalGrowthAccelerated
  ) {
    return;
  }


  finalGrowthAccelerated =
    true;


  if (
    fastGrowthTimer !==
    null
  ) {

    window.clearInterval(
      fastGrowthTimer
    );


    fastGrowthTimer =
      null;


    beginFastFieldFill();

  }


  if (
    fastGroundFlowerTimer !==
    null
  ) {

    window.clearInterval(
      fastGroundFlowerTimer
    );


    fastGroundFlowerTimer =
      null;


    beginFastGroundGrowth();

  }
}


// ==========================================
// 25. RÁFAGA FINAL
// ==========================================

function triggerFinalWindWave() {

  field.classList.remove(
    'final-wind-wave'
  );


  void field.offsetWidth;


  field.classList.add(
    'final-wind-wave'
  );


  finalWindCleanupTimer =
    window.setTimeout(
      () => {

        field.classList.remove(
          'final-wind-wave'
        );

      },
      2800
    );
}


// ==========================================
// 26. EXPLORACIÓN
// ==========================================

function enterExplorationMode() {

  narrativeEnabled =
    false;

  explorationEnabled =
    true;

  plantingEnabled =
    false;


  hideInteractionHint();


  narrativeText.classList.remove(
    'is-visible'
  );


  field.dataset.mode =
    'exploration';


  experienceControls.classList.add(
    'is-exploration'
  );


  const specialFlowers =
    field.querySelectorAll(
      '.flower.is-special'
    );


  specialFlowers.forEach(
    flower => {

      flower.tabIndex =
        0;

    }
  );
}


// ==========================================
// 27. MENSAJES SECRETOS
// ==========================================

function openSecretMessage(
  flower
) {

  if (
    !explorationEnabled
  ) {
    return;
  }


  const message =
    flower.dataset.secretMessage;


  if (!message) {
    return;
  }


  /*
    Revisamos si esta flor ya había sido leída.

    Así, volver a abrir una misma frase no hace
    avanzar el contador.
  */
  const wasAlreadyDiscovered =

    flower.dataset.discovered ===
    'true';


  const isFinalSecret =

    flower.dataset.finalSecret ===
    'true';


  flower.classList.add(
    'is-discovered'
  );


  flower.dataset.discovered =
    'true';


  /*
    Solo cuentan las primeras 12 flores.

    La flor secreta final no participa
    en este contador.
  */
  if (
    !wasAlreadyDiscovered &&
    !isFinalSecret
  ) {

    discoveredRegularSpecialCount +=
      1;


    /*
      Al descubrir la número 12,
      despertamos la flor final.
    */
    if (
      discoveredRegularSpecialCount >=
      REGULAR_SPECIAL_FLOWER_TARGET
    ) {

      unlockFinalSecretFlower();

    }

  }


  secretMessage.textContent =
    message;


  window.clearTimeout(
    messageHideTimer
  );


  messageOverlay.hidden =
    false;


  messageOverlay.setAttribute(
    'aria-hidden',
    'false'
  );


  window.requestAnimationFrame(
    () => {

      messageOverlay.classList.add(
        'is-visible'
      );

    }
  );
}


/*
  Convierte la flor número 25 en una flor especial
  únicamente después de descubrir las otras 12.
*/
function unlockFinalSecretFlower() {

  if (
    !finalSecretFlower
  ) {
    return;
  }


  /*
    Evitamos configurar dos veces la misma flor.
  */
  if (
    finalSecretFlower.classList.contains(
      'is-special'
    )
  ) {
    return;
  }


  finalSecretFlower.classList.add(
    'is-special'
  );


  finalSecretFlower.dataset.secretMessage =
    FINAL_SECRET_MESSAGE;


  finalSecretFlower.dataset.discovered =
    'false';


  finalSecretFlower.tabIndex =

    explorationEnabled

      ? 0

      : -1;


  finalSecretFlower.setAttribute(
    'role',
    'button'
  );


  finalSecretFlower.setAttribute(
    'aria-label',
    'Flor especial'
  );


  /*
    Reutilizamos exactamente el mismo sistema
    de brillo que las demás flores especiales.
  */
  const glintDuration =
    randomBetween(
      5.6,
      7.8
    );


  finalSecretFlower.style.setProperty(
    '--glint-duration',
    `${glintDuration.toFixed(2)}s`
  );


  finalSecretFlower.style.setProperty(
    '--glint-delay',
    `${(-glintDuration * 0.10).toFixed(2)}s`
  );


  finalSecretFlower.style.setProperty(
    '--glint-discovered-duration',
    `${randomBetween(
      11,
      15
    ).toFixed(2)}s`
  );


  finalSecretFlower.addEventListener(
    'click',
    handleSpecialFlowerClick
  );


  finalSecretFlower.addEventListener(
    'keydown',
    handleSpecialFlowerKeydown
  );
}


function closeSecretMessage(
  immediate = false
) {

  window.clearTimeout(
    messageHideTimer
  );


  if (
    messageOverlay.hidden
  ) {
    return;
  }


  messageOverlay.classList.remove(
    'is-visible'
  );


  messageOverlay.setAttribute(
    'aria-hidden',
    'true'
  );


  if (immediate) {

    messageOverlay.hidden =
      true;

    return;

  }


  messageHideTimer =
    window.setTimeout(
      () => {

        messageOverlay.hidden =
          true;

      },
      280
    );
}


function handleSpecialFlowerClick(
  event
) {

  if (
    !explorationEnabled
  ) {
    return;
  }


  event.stopPropagation();


  openSecretMessage(
    event.currentTarget
  );
}


function handleSpecialFlowerKeydown(
  event
) {

  if (
    !explorationEnabled
  ) {
    return;
  }


  if (
    event.key !== 'Enter' &&
    event.key !== ' '
  ) {
    return;
  }


  event.preventDefault();

  event.stopPropagation();


  openSecretMessage(
    event.currentTarget
  );
}


// ==========================================
// 28. REGISTRO POSICIONES
// ==========================================

function registerFlowerPosition(
  x,
  y,
  source
) {

  allFlowerPositions.push({

    x,

    y,

    source

  });
}


function getNormalFlowerCount() {

  return allFlowerPositions.filter(
    position =>
      position.source !==
      'ground-accent'
  ).length;
}


// ==========================================
// 29. CRECIMIENTO LENTO
// ==========================================

function startSlowGrowth() {

  if (
    slowGrowthStarted
  ) {
    return;
  }


  slowGrowthStarted =
    true;


  slowGrowthStartTimer =
    window.setTimeout(
      () => {

        if (
          !fastGrowthStarted
        ) {

          createSlowAutomaticFlower();

        }

      },
      FIRST_SLOW_FLOWER_DELAY
    );


  slowGrowthTimer =
    window.setInterval(
      () => {

        if (
          fastGrowthStarted
        ) {
          return;
        }


        if (
          slowAutomaticFlowerCount >=
          MAX_SLOW_AUTOMATIC_FLOWERS
        ) {

          window.clearInterval(
            slowGrowthTimer
          );


          slowGrowthTimer =
            null;


          return;
        }


        createSlowAutomaticFlower();

      },
      SLOW_GROWTH_INTERVAL
    );
}


// ==========================================
// 30. FLORES PEQUEÑAS LENTAS
// ==========================================

function startSlowGroundGrowth() {

  groundFlowerStartTimer =
    window.setTimeout(
      () => {

        if (
          !fastGrowthStarted &&
          groundFlowerCount <
          GROUND_FLOWER_TARGET
        ) {

          createNextGroundFlower();

        }

      },
      FIRST_GROUND_FLOWER_DELAY
    );


  slowGroundFlowerTimer =
    window.setInterval(
      () => {

        if (
          fastGrowthStarted
        ) {
          return;
        }


        if (
          groundFlowerCount >=
          GROUND_FLOWER_TARGET
        ) {

          stopSlowGroundGrowth();

          return;
        }


        createNextGroundFlower();

      },
      SLOW_GROUND_FLOWER_INTERVAL
    );
}


function stopSlowGroundGrowth() {

  window.clearTimeout(
    groundFlowerStartTimer
  );


  groundFlowerStartTimer =
    null;


  if (
    slowGroundFlowerTimer !==
    null
  ) {

    window.clearInterval(
      slowGroundFlowerTimer
    );


    slowGroundFlowerTimer =
      null;

  }
}


// ==========================================
// 31. AUTOMÁTICA LENTA
// ==========================================

function createSlowAutomaticFlower() {

  if (
    slowAutomaticFlowerCount >=
    MAX_SLOW_AUTOMATIC_FLOWERS
  ) {
    return;
  }


  const remainingUserFlowers =

    TOTAL_USER_FLOWERS -
    userFlowerCount;


  const currentAllowedMaximum =

    FINAL_FLOWER_TARGET -
    remainingUserFlowers;


  if (
    getNormalFlowerCount() >=
    currentAllowedMaximum
  ) {

    return;

  }


  const position =
    findSlowGrowthPosition();


  if (!position) {
    return;
  }


  createFlower(
    position.x,
    position.y,
    {
      type:
        'automatic-slow'
    }
  );


  registerFlowerPosition(
    position.x,
    position.y,
    'automatic-slow'
  );


  slowAutomaticFlowerCount +=
    1;
}


// ==========================================
// 32. POSICIÓN LENTA
// ==========================================

function findSlowGrowthPosition() {

  const ATTEMPTS =
    42;


  if (
    originalSaraFlowers.length ===
    0
  ) {
    return null;
  }


  let bestCandidate =
    null;

  let bestScore =
    -Infinity;


  for (
    let attempt = 0;
    attempt < ATTEMPTS;
    attempt += 1
  ) {

    const origin =
      randomChoice(
        originalSaraFlowers
      );


    const angle =
      randomBetween(
        0,
        Math.PI * 2
      );


    const distance =
      randomBetween(
        62,
        160
      );


    let x =

      origin.x +

      Math.cos(angle) *
      distance;


    let y =

      origin.y +

      Math.sin(angle) *
      distance;


    y +=
      randomBetween(
        8,
        30
      );


    const safe =
      keepAutomaticFlowerOnScreen(
        x,
        y
      );


    x =
      safe.x;

    y =
      safe.y;


    const score =
      getMinimumDistanceToFlowers(
        x,
        y
      );


    if (
      score >
      bestScore
    ) {

      bestScore =
        score;


      bestCandidate = {
        x,
        y
      };

    }
  }


  if (
    bestScore <
    PREFERRED_FLOWER_DISTANCE *
    0.70
  ) {

    return null;

  }


  return bestCandidate;
}


// ==========================================
// 33. FASE RÁPIDA
// ==========================================

function startFastGrowth() {

  if (
    fastGrowthStarted
  ) {
    return;
  }


  fastGrowthStarted =
    true;


  window.clearTimeout(
    slowGrowthStartTimer
  );


  slowGrowthStartTimer =
    null;


  if (
    slowGrowthTimer !==
    null
  ) {

    window.clearInterval(
      slowGrowthTimer
    );


    slowGrowthTimer =
      null;

  }


  stopSlowGroundGrowth();


  if (
    slowAutomaticFlowerCount ===
    0
  ) {

    createSlowAutomaticFlower();

  }


  fastGrowthStartTimer =
    window.setTimeout(
      beginFastFieldFill,
      FAST_BIG_START_DELAY
    );


  fastGroundStartTimer =
    window.setTimeout(
      beginFastGroundGrowth,
      FAST_GROUND_START_DELAY
    );
}


// ==========================================
// 34. PEQUEÑAS RÁPIDAS
// ==========================================

function beginFastGroundGrowth() {

  if (
    groundFlowerCount >=
    GROUND_FLOWER_TARGET
  ) {
    return;
  }


  if (
    fastGroundFlowerTimer !==
    null
  ) {

    window.clearInterval(
      fastGroundFlowerTimer
    );

  }


  const interval =

    finalGrowthAccelerated

      ? FINAL_GROUND_FLOWER_INTERVAL

      : FAST_GROUND_FLOWER_INTERVAL;


  fastGroundFlowerTimer =
    window.setInterval(
      () => {

        if (
          groundFlowerCount >=
          GROUND_FLOWER_TARGET
        ) {

          window.clearInterval(
            fastGroundFlowerTimer
          );


          fastGroundFlowerTimer =
            null;


          return;
        }


        createNextGroundFlower();

      },
      interval
    );
}


// ==========================================
// 35. CREAR FLOR PEQUEÑA
// ==========================================

function createNextGroundFlower() {

  if (
    groundFlowerCount >=
    GROUND_FLOWER_TARGET
  ) {
    return;
  }


  const position =
    findNextGroundFlowerPosition();


  if (!position) {
    return;
  }


  createFlower(
    position.x,
    position.y,
    {
      type:
        'ground-accent',

      forceGroundFlower:
        true
    }
  );


  registerFlowerPosition(
    position.x,
    position.y,
    'ground-accent'
  );


  groundFlowerCount +=
    1;

  groundAnchorIndex +=
    1;
}


// ==========================================
// 36. POSICIONES PEQUEÑAS
// ==========================================

function findNextGroundFlowerPosition() {

  /*
    Siguen existiendo huecos deliberados.
    No llenamos una cuadrícula.
  */
  const anchors = [

    { x: 0.12, y: 0.15 },

    { x: 0.35, y: 0.17 },

    { x: 0.64, y: 0.13 },

    { x: 0.86, y: 0.20 },


    { x: 0.20, y: 0.38 },

    { x: 0.48, y: 0.37 },

    { x: 0.76, y: 0.41 },


    { x: 0.10, y: 0.59 },

    { x: 0.32, y: 0.63 },

    { x: 0.58, y: 0.57 },

    { x: 0.84, y: 0.65 },


    { x: 0.20, y: 0.80 },

    { x: 0.43, y: 0.84 },

    { x: 0.68, y: 0.78 },

    { x: 0.88, y: 0.88 }

  ];


  const anchor =

    anchors[
      groundAnchorIndex %
      anchors.length
    ];


  const ATTEMPTS =
    26;


  const topMargin =
    getAutomaticTopMargin();


  const availableHeight =

    Math.max(

      100,

      field.clientHeight -
      topMargin -
      16

    );


  let bestCandidate =
    null;

  let bestScore =
    -Infinity;


  for (
    let attempt = 0;
    attempt < ATTEMPTS;
    attempt += 1
  ) {

    let x =

      anchor.x *
      field.clientWidth;


    let y =

      topMargin +

      anchor.y *
      availableHeight;


    x +=
      randomBetween(
        -32,
        32
      );


    y +=
      randomBetween(
        -27,
        27
      );


    const safe =
      keepAutomaticFlowerOnScreen(
        x,
        y
      );


    x =
      safe.x;

    y =
      safe.y;


    const score =
      getMinimumDistanceToFlowers(
        x,
        y
      );


    if (
      score >
      bestScore
    ) {

      bestScore =
        score;


      bestCandidate = {
        x,
        y
      };

    }
  }


  if (
    bestScore <
    PREFERRED_FLOWER_DISTANCE *
    0.29
  ) {

    return null;

  }


  return bestCandidate;
}


// ==========================================
// 37. CAMPO RÁPIDO
// ==========================================

function beginFastFieldFill() {

  if (
    fastGrowthTimer !==
    null
  ) {

    window.clearInterval(
      fastGrowthTimer
    );

  }


  const interval =

    finalGrowthAccelerated

      ? FINAL_BIG_FLOWER_INTERVAL

      : FAST_GROWTH_INTERVAL;


  fastGrowthTimer =
    window.setInterval(
      () => {

        const normalFlowerCount =
          getNormalFlowerCount();


        const remainingUserFlowers =

          TOTAL_USER_FLOWERS -
          userFlowerCount;


        const currentAllowedMaximum =

          FINAL_FLOWER_TARGET -
          remainingUserFlowers;


        if (
          userFlowerCount >=
          TOTAL_USER_FLOWERS &&
          normalFlowerCount >=
          FINAL_FLOWER_TARGET
        ) {

          finishFastGrowth();

          return;
        }


        if (
          normalFlowerCount >=
          currentAllowedMaximum
        ) {

          return;

        }


        const position =
          findFastGrowthPosition();


        if (!position) {
          return;
        }


        createFlower(
          position.x,
          position.y,
          {
            type:
              'automatic-fast'
          }
        );


        registerFlowerPosition(
          position.x,
          position.y,
          'automatic-fast'
        );

      },
      interval
    );
}


// ==========================================
// 38. POSICIÓN RÁPIDA
// ==========================================

function findFastGrowthPosition() {

  const ATTEMPTS =
    65;


  let bestCandidate =
    null;

  let bestScore =
    -Infinity;


  const topMargin =
    getAutomaticTopMargin();


  const horizontalMargin =
    18;

  const bottomMargin =
    7;


  const maximumY =

    Math.max(

      topMargin + 1,

      field.clientHeight -
      bottomMargin

    );


  for (
    let attempt = 0;
    attempt < ATTEMPTS;
    attempt += 1
  ) {

    const x =

      randomBetween(

        horizontalMargin,

        Math.max(

          horizontalMargin + 1,

          field.clientWidth -
          horizontalMargin

        )

      );


    /*
      Exponente inferior a 1:

      más candidatos hacia la mitad
      inferior del campo.
    */
    const verticalBias =

      Math.pow(
        Math.random(),
        0.58
      );


    const y =

      topMargin +

      verticalBias *
      (
        maximumY -
        topMargin
      );


    const score =
      getMinimumDistanceToFlowers(
        x,
        y
      );


    if (
      score >
      bestScore
    ) {

      bestScore =
        score;


      bestCandidate = {
        x,
        y
      };

    }
  }


  if (
    bestScore <
    PREFERRED_FLOWER_DISTANCE *
    0.48
  ) {

    return null;

  }


  return bestCandidate;
}


function finishFastGrowth() {

  if (
    fastGrowthTimer ===
    null
  ) {
    return;
  }


  window.clearInterval(
    fastGrowthTimer
  );


  fastGrowthTimer =
    null;
}


// ==========================================
// 39. ZONA SEGURA
// ==========================================

function getAutomaticTopMargin() {

  const narrativeRect =
    narrative.getBoundingClientRect();


  const fieldRect =
    field.getBoundingClientRect();


  const narrativeBottom =

    narrativeRect.bottom -
    fieldRect.top;


  const flowerSafetySpace =
    72;


  const desiredMargin =

    Math.max(

      150,

      narrativeBottom +
      flowerSafetySpace

    );


  return Math.min(

    desiredMargin,

    Math.max(

      150,

      field.clientHeight -
      78

    )

  );
}


function keepAutomaticFlowerOnScreen(
  x,
  y
) {

  const horizontalMargin =
    18;


  const topMargin =
    getAutomaticTopMargin();


  const bottomMargin =
    7;


  return {

    x:
      clamp(

        x,

        horizontalMargin,

        Math.max(

          horizontalMargin,

          field.clientWidth -
          horizontalMargin

        )

      ),


    y:
      clamp(

        y,

        topMargin,

        Math.max(

          topMargin,

          field.clientHeight -
          bottomMargin

        )

      )

  };
}


// ==========================================
// 40. DISTANCIA
// ==========================================

function getMinimumDistanceToFlowers(
  x,
  y
) {

  if (
    allFlowerPositions.length ===
    0
  ) {

    return Infinity;

  }


  let minimumDistance =
    Infinity;


  for (
    const position
    of allFlowerPositions
  ) {

    const dx =
      position.x -
      x;


    const dy =
      position.y -
      y;


    const distance =

      Math.sqrt(

        dx * dx +
        dy * dy

      );


    if (
      distance <
      minimumDistance
    ) {

      minimumDistance =
        distance;

    }
  }


  return minimumDistance;
}


// ==========================================
// 41. CREAR FLOR
// ==========================================

function createFlower(
  x,
  y,
  options = {}
) {

  initializeFieldVisuals();


  const type =

    options.type ||
    'automatic-fast';


  const isGroundFlower =

    options.forceGroundFlower ===
    true;


  const stable =
    options.stable ===
    true;


  const depth =

    clamp(

      y /
      field.clientHeight,

      0,

      1

    );


  const layer =
    getFlowerLayer(
      depth
    );


  const flower =
    document.createElement(
      'div'
    );


  flower.classList.add(
    'flower'
  );


  if (
    isGroundFlower
  ) {

    flower.classList.add(
      'flower--ground'
    );

  }


  flower.dataset.flowerType =
    type;


  flower.style.left =
    `${x}px`;


  flower.style.top =
    `${y}px`;


  // ========================================
  // SERIAL
  // ========================================

  if (
    !isGroundFlower
  ) {

    largeFlowerSerial +=
      1;

  }


  // ========================================
  // VARIANTE
  // ========================================

  const flowerVariant =

    isGroundFlower

      ? Math.floor(
          randomBetween(
            0,
            3
          )
        )

      : flowerVariantDeck[
          (
            largeFlowerSerial -
            1
          ) %
          flowerVariantDeck.length
        ];


  flower.classList.add(
    `flower--variant-${flowerVariant + 1}`
  );


  // ========================================
  // ESPECIAL
  // ========================================

  let isSpecialFlower =
    false;

  let isFinalSecretFlower =
    false;

  let assignedMessage =
    null;


  if (
    !isGroundFlower &&
    SPECIAL_FLOWER_SLOTS.includes(
      largeFlowerSerial
    )
  ) {

    /*
      La flor número 25 todavía NO es especial.

      Existe visualmente como una flor normal
      hasta que Sara descubra las otras 12.
    */
    if (
      largeFlowerSerial ===
      FINAL_SECRET_FLOWER_SLOT
    ) {

      isFinalSecretFlower =
        true;

    }

    else if (
      specialFlowerCount <
      REGULAR_SPECIAL_FLOWER_TARGET
    ) {

      isSpecialFlower =
        true;


      assignedMessage =

        specialMessageDeck[
          specialFlowerCount
        ];


      specialFlowerCount +=
        1;

    }

  }


  // ========================================
  // PROFUNDIDAD Y ESCALA
  // ========================================

  /*
    Mucho más evidente que antes:

    arriba -> pequeña
    abajo  -> mayor

    Sigue siendo delicada.
  */
  const depthScale =

    isGroundFlower

      ? (
          0.57 +
          depth * 0.24
        )

      : (
          0.58 +
          depth * 0.37
        );


  let randomScale;


  if (stable) {

    randomScale =
      1;

  }

  else if (
    type === 'user'
  ) {

    randomScale =
      randomBetween(
        0.94,
        1.05
      );

  }

  else {

    randomScale =
      randomBetween(
        0.88,
        1.04
      );

  }


  const scale =

    depthScale *
    randomScale;


  // ========================================
  // PROFUNDIDAD POR LUZ
  // ========================================

  const depthBrightness =

    0.82 +
    depth * 0.20;


  const depthSaturation =

    0.84 +
    depth * 0.18;


  // ========================================
  // ROTACIÓN
  // ========================================

  const bodyRotation =

    stable

      ? 0

      : isGroundFlower

        ? randomBetween(
            -8,
            8
          )

        : randomBetween(
            -3,
            3
          );


  const bloomRotation =

    stable

      ? 0

      : randomBetween(
          -16,
          16
        );


  /*
    Perspectiva superior.

    0.84–0.91 conserva algo
    de sensación lateral.
  */
  const bloomSquash =

    stable

      ? 0.88

      : randomBetween(
          0.84,
          0.91
        );


  // ========================================
  // BRISA
  // ========================================

  const swayDuration =

    isGroundFlower

      ? randomBetween(
          8.4,
          11.4
        )

      : randomBetween(
          6.3,
          9.4
        );


  const swayDelay =

    -randomBetween(
      0,
      swayDuration
    );


  // ========================================
  // RÁFAGA FINAL
  // ========================================

  const horizontalProgress =

    clamp(

      x /
      Math.max(
        field.clientWidth,
        1
      ),

      0,

      1

    );


  const waveDelay =

    horizontalProgress *
    820 +

    randomBetween(
      0,
      80
    );


  // ========================================
  // PALETA
  // ========================================

  const palette =
    randomChoice(
      FLOWER_PALETTES
    );


  // ========================================
  // IMPERFECCIONES
  // ========================================

  const organic = {

    centerX:
      stable
        ? 0
        : randomBetween(
            -0.7,
            0.7
          ),

    centerY:
      stable
        ? 0
        : randomBetween(
            -0.4,
            0.35
          )

  };


  // ========================================
  // VARIABLES CSS
  // ========================================

  flower.style.setProperty(
    '--flower-scale',
    scale.toFixed(3)
  );


  flower.style.setProperty(
    '--flower-rotation',
    `${bodyRotation.toFixed(2)}deg`
  );


  flower.style.setProperty(
    '--bloom-rotation',
    `${bloomRotation.toFixed(2)}deg`
  );


  flower.style.setProperty(
    '--bloom-squash',
    bloomSquash.toFixed(3)
  );


  flower.style.setProperty(
    '--sway-duration',
    `${swayDuration.toFixed(2)}s`
  );


  flower.style.setProperty(
    '--sway-delay',
    `${swayDelay.toFixed(2)}s`
  );


  flower.style.setProperty(
    '--wave-delay',
    `${waveDelay.toFixed(0)}ms`
  );


  flower.style.setProperty(
    '--depth-brightness',
    depthBrightness.toFixed(3)
  );


  flower.style.setProperty(
    '--depth-saturation',
    depthSaturation.toFixed(3)
  );


  flower.style.setProperty(
    '--petal-main',
    palette.petalMain
  );


  flower.style.setProperty(
    '--petal-light',
    palette.petalLight
  );


  flower.style.setProperty(
    '--petal-deep',
    palette.petalDeep
  );


  flower.style.setProperty(
    '--flower-center',
    palette.center
  );


  flower.style.setProperty(
    '--flower-center-light',
    palette.centerLight
  );


  flower.style.zIndex =
    Math.round(y);


  // ========================================
  // FLOR SECRETA FINAL
  // ========================================

  if (
    isFinalSecretFlower
  ) {

    flower.dataset.finalSecret =
      'true';


    /*
      Guardamos la referencia, pero todavía
      no le damos brillo ni interacción.
    */
    finalSecretFlower =
      flower;

  }


  // ========================================
  // ID SVG
  // ========================================

  const svgId =

    `flower-${visualFlowerCount}-${Math
      .random()
      .toString(36)
      .slice(2, 7)}`;


  // ========================================
  // BRILLO ESPECIAL
  // ========================================

  if (
    isSpecialFlower
  ) {

    flower.classList.add(
      'is-special'
    );


    flower.dataset.secretMessage =
      assignedMessage;


    flower.dataset.discovered =
      'false';


    flower.tabIndex =

      explorationEnabled

        ? 0

        : -1;


    const glintDuration =
      randomBetween(
        5.6,
        7.8
      );


    const glintDelay =

      specialFlowerCount === 1

        ? -(
            glintDuration *
            0.10
          )

        : -randomBetween(
            0,
            glintDuration
          );


    flower.style.setProperty(
      '--glint-duration',
      `${glintDuration.toFixed(2)}s`
    );


    flower.style.setProperty(
      '--glint-delay',
      `${glintDelay.toFixed(2)}s`
    );


    flower.style.setProperty(
      '--glint-discovered-duration',
      `${randomBetween(
        11,
        15
      ).toFixed(2)}s`
    );

  }


  // ========================================
  // HTML
  // ========================================

  flower.innerHTML = `

    <div class="flower-grow">

      <div class="flower-wave">

        <div class="flower-sway">

          ${
            isGroundFlower

              ? getGroundFlowerSvg(
                  flowerVariant,
                  svgId,
                  organic
                )

              : getBaseFlowerSvg(
                  flowerVariant,
                  svgId,
                  organic
                )
          }

        </div>

      </div>

    </div>

  `;


  if (
    isSpecialFlower
  ) {

    flower.setAttribute(
      'role',
      'button'
    );


    flower.setAttribute(
      'aria-label',
      'Flor especial'
    );


    flower.addEventListener(
      'click',
      handleSpecialFlowerClick
    );


    flower.addEventListener(
      'keydown',
      handleSpecialFlowerKeydown
    );

  }


  layer.appendChild(
    flower
  );


  /*
    Caso de seguridad:

    si Sara ya encontró las 12 frases normales
    antes de que la flor 25 terminara de aparecer,
    la activamos en cuanto nace.
  */
  if (
    isFinalSecretFlower &&
    discoveredRegularSpecialCount >=
      REGULAR_SPECIAL_FLOWER_TARGET
  ) {

    unlockFinalSecretFlower();

  }


  createLocalIllumination(
    x,
    y,
    depth,
    {
      type,
      isGroundFlower
    }
  );


  revealNearbyVegetation(
    x,
    y,
    {
      type,
      isGroundFlower
    }
  );


  visualFlowerCount +=
    1;


  updateAccumulatedFieldReveal();
}


// ==========================================
// 42. CAPA POR PROFUNDIDAD
// ==========================================

function getFlowerLayer(
  depth
) {

  if (
    depth < 0.45
  ) {

    return flowersBackLayer;

  }


  if (
    depth < 0.74
  ) {

    return flowersMidLayer;

  }


  return flowersFrontLayer;
}


// ==========================================
// 43. GRADIENTES
// ==========================================

function getFlowerDefs(
  svgId
) {

  return `

    <defs>

      <linearGradient
        id="${svgId}-light"
        x1="25%"
        y1="5%"
        x2="65%"
        y2="95%"
      >

        <stop
          offset="0%"
          stop-color="var(--petal-light)"
        />

        <stop
          offset="55%"
          stop-color="var(--petal-main)"
        />

        <stop
          offset="100%"
          stop-color="var(--petal-deep)"
          stop-opacity="0.82"
        />

      </linearGradient>


      <linearGradient
        id="${svgId}-main"
        x1="12%"
        y1="8%"
        x2="80%"
        y2="92%"
      >

        <stop
          offset="0%"
          stop-color="var(--petal-light)"
          stop-opacity="0.90"
        />

        <stop
          offset="50%"
          stop-color="var(--petal-main)"
        />

        <stop
          offset="100%"
          stop-color="var(--petal-deep)"
          stop-opacity="0.92"
        />

      </linearGradient>


      <linearGradient
        id="${svgId}-deep"
        x1="20%"
        y1="0%"
        x2="70%"
        y2="100%"
      >

        <stop
          offset="0%"
          stop-color="var(--petal-main)"
        />

        <stop
          offset="68%"
          stop-color="var(--petal-deep)"
        />

        <stop
          offset="100%"
          stop-color="var(--petal-deep)"
          stop-opacity="0.74"
        />

      </linearGradient>


      <radialGradient
        id="${svgId}-center"
        cx="36%"
        cy="30%"
        r="74%"
      >

        <stop
          offset="0%"
          stop-color="var(--flower-center-light)"
        />

        <stop
          offset="50%"
          stop-color="var(--flower-center)"
        />

        <stop
          offset="100%"
          stop-color="#674715"
        />

      </radialGradient>

    </defs>

  `;
}


// ==========================================
// 44. PÉTALO
// ==========================================

function createPetalMarkup(
  svgId,
  petal
) {

  const rest =

    petal.rest +

    randomBetween(
      -0.8,
      0.8
    );


  return `

    <path
      class="petal"
      fill="url(#${svgId}-${petal.fill})"

      style="
        --petal-delay:
          ${petal.delay}ms;

        --petal-fold:
          ${petal.fold}deg;

        --petal-rest:
          ${rest.toFixed(2)}deg;
      "

      d="${petal.d}"
    />

  `;
}


// ==========================================
// 45. CABEZA FLORAL
// ==========================================

function getFlowerHeadMarkup(
  variant,
  svgId,
  organic
) {

  /*
    VARIANTE 1

    8 pétalos.
    Cabeza abierta y delicada.
  */
  const variantOne = [

    {
      fill: 'light',
      delay: 130,
      fold: -7,
      rest: -0.5,
      d:
        'M47 39 C43 32 43.8 19 50 11 C56.8 18.5 57 31 53 39 C51.4 42 48.5 42 47 39 Z'
    },

    {
      fill: 'main',
      delay: 165,
      fold: 9,
      rest: 0.8,
      d:
        'M54 38 C59 30 68 24 75 27 C76 35 69 42 59 44 C56 44.5 52 41 54 38 Z'
    },

    {
      fill: 'deep',
      delay: 205,
      fold: 12,
      rest: 1.2,
      d:
        'M59 44 C69 40 79 43 82 50 C78 57 68 59 59 54 C56 52 56 46 59 44 Z'
    },

    {
      fill: 'main',
      delay: 250,
      fold: 10,
      rest: -0.2,
      d:
        'M58 53 C67 55 73 62 70 69 C63 72 55 66 52 58 C51 55 55 52 58 53 Z'
    },

    {
      fill: 'light',
      delay: 285,
      fold: 3,
      rest: -1.0,
      d:
        'M52 57 C55 66 51 75 44 77 C38 72 39 63 44 56 C46 53 50 54 52 57 Z'
    },

    {
      fill: 'main',
      delay: 255,
      fold: -10,
      rest: 0.8,
      d:
        'M44 55 C38 63 28 66 22 61 C21 54 29 47 39 47 C43 47 46 52 44 55 Z'
    },

    {
      fill: 'deep',
      delay: 210,
      fold: -12,
      rest: -1.1,
      d:
        'M40 48 C31 51 21 47 19 40 C24 34 34 34 42 39 C45 41 44 47 40 48 Z'
    },

    {
      fill: 'main',
      delay: 170,
      fold: -8,
      rest: -0.4,
      d:
        'M42 40 C34 38 29 30 32 24 C39 20 46 27 48 35 C49 38 45 41 42 40 Z'
    }

  ];


  /*
    VARIANTE 2

    6 pétalos más amplios,
    blandos y redondeados.
  */
  const variantTwo = [

    {
      fill: 'light',
      delay: 135,
      fold: -7,
      rest: -0.6,
      d:
        'M44 40 C38 30 40 18 49 10 C59 17 61 30 55 40 C52 44 47 44 44 40 Z'
    },

    {
      fill: 'main',
      delay: 180,
      fold: 11,
      rest: 1,
      d:
        'M55 39 C62 29 75 25 82 32 C81 42 70 49 59 47 C55 46 52 42 55 39 Z'
    },

    {
      fill: 'deep',
      delay: 230,
      fold: 11,
      rest: 0.3,
      d:
        'M60 48 C71 47 81 53 81 62 C74 70 62 67 54 58 C51 54 56 49 60 48 Z'
    },

    {
      fill: 'light',
      delay: 280,
      fold: 2,
      rest: -0.7,
      d:
        'M55 57 C61 67 58 78 49 82 C40 77 38 65 45 56 C48 52 53 53 55 57 Z'
    },

    {
      fill: 'main',
      delay: 235,
      fold: -12,
      rest: 0.9,
      d:
        'M44 58 C35 67 23 69 17 62 C18 52 29 46 40 48 C44 49 47 54 44 58 Z'
    },

    {
      fill: 'deep',
      delay: 185,
      fold: -11,
      rest: -1,
      d:
        'M40 48 C29 49 18 42 19 33 C26 25 39 29 46 39 C49 43 45 48 40 48 Z'
    }

  ];


  /*
    VARIANTE 3

    7 pétalos más estrechos,
    silvestres y ligeramente irregulares.
  */
  const variantThree = [

    {
      fill: 'light',
      delay: 125,
      fold: -8,
      rest: -1.2,
      d:
        'M47 39 C44 31 45 17 50 9 C56 17 57 30 53 39 C51 42 48 42 47 39 Z'
    },

    {
      fill: 'main',
      delay: 160,
      fold: 9,
      rest: 1.1,
      d:
        'M54 38 C58 29 66 21 73 23 C77 31 70 41 59 44 C56 45 52 41 54 38 Z'
    },

    {
      fill: 'deep',
      delay: 205,
      fold: 13,
      rest: 1.8,
      d:
        'M59 44 C69 39 81 41 85 48 C82 57 70 60 59 54 C56 52 56 46 59 44 Z'
    },

    {
      fill: 'main',
      delay: 255,
      fold: 11,
      rest: -0.7,
      d:
        'M58 53 C68 54 76 62 74 69 C67 75 57 68 52 58 C50 55 55 52 58 53 Z'
    },

    {
      fill: 'light',
      delay: 290,
      fold: 1,
      rest: 1.4,
      d:
        'M52 57 C56 68 52 79 45 82 C37 76 39 64 44 56 C46 53 51 54 52 57 Z'
    },

    {
      fill: 'main',
      delay: 245,
      fold: -12,
      rest: -1.7,
      d:
        'M44 55 C37 65 25 69 19 64 C17 56 27 47 39 47 C43 47 46 52 44 55 Z'
    },

    {
      fill: 'deep',
      delay: 185,
      fold: -12,
      rest: -0.5,
      d:
        'M41 47 C31 50 20 45 19 37 C25 30 37 32 44 39 C47 42 45 46 41 47 Z'
    }

  ];


  const variants = [
    variantOne,
    variantTwo,
    variantThree
  ];


  const petals =

    variants[variant]
      .map(
        petal =>
          createPetalMarkup(
            svgId,
            petal
          )
      )
      .join('');


  const centers = [

    {
      cx: 50,
      cy: 47,
      rx: 9.2,
      ry: 6.5
    },

    {
      cx: 50,
      cy: 49,
      rx: 8.1,
      ry: 5.8
    },

    {
      cx: 49.5,
      cy: 47,
      rx: 8.5,
      ry: 5.9
    }

  ];


  const center =
    centers[variant];


  const centerX =

    center.cx +
    organic.centerX;


  const centerY =

    center.cy +
    organic.centerY;


  return `

    <g class="flower-bloom">

      <ellipse
        class="bloom-under-shadow"
        cx="50"
        cy="55"
        rx="24"
        ry="9"
      />


      <g class="flower-petals">

        ${petals}

      </g>


      <g class="flower-heart">

        <ellipse
          class="flower-center-shadow"
          cx="${(centerX + 0.3).toFixed(2)}"
          cy="${(centerY + 1.8).toFixed(2)}"
          rx="${center.rx + 1.0}"
          ry="${center.ry + 0.8}"
          fill="#654715"
        />


        <ellipse
          class="flower-center"
          cx="${centerX.toFixed(2)}"
          cy="${centerY.toFixed(2)}"
          rx="${center.rx}"
          ry="${center.ry}"
          fill="url(#${svgId}-center)"
        />


        <ellipse
          class="flower-center-light"
          cx="${(centerX - 2.7).toFixed(2)}"
          cy="${(centerY - 2.0).toFixed(2)}"
          rx="2.4"
          ry="1.45"
          fill="var(--flower-center-light)"
        />


        <circle
          class="center-speck"
          cx="${(centerX - 1.2).toFixed(2)}"
          cy="${(centerY + 0.8).toFixed(2)}"
          r="0.7"
          fill="#e0b347"
        />


        <circle
          class="center-speck"
          cx="${(centerX + 2.0).toFixed(2)}"
          cy="${(centerY - 0.5).toFixed(2)}"
          r="0.65"
          fill="var(--flower-center-light)"
        />


        <circle
          class="center-speck"
          cx="${(centerX + 2.4).toFixed(2)}"
          cy="${(centerY + 1.6).toFixed(2)}"
          r="0.55"
          fill="#ddb044"
        />

      </g>

    </g>

  `;
}


// ==========================================
// 46. FLOR GRANDE
// ==========================================

function getBaseFlowerSvg(
  variant,
  svgId,
  organic
) {

  /*
    Tallo muy corto.

    La cabeza ocupa visualmente
    casi toda la flor.
  */

  if (
    variant === 0
  ) {

    return `

      <svg
        class="flower-svg"
        viewBox="0 0 100 112"
        xmlns="http://www.w3.org/2000/svg"
      >

        ${getFlowerDefs(svgId)}


        <path
          class="flower-stem-shadow"
          pathLength="1"
          d="
            M51 109
            C51 92,
             52 77,
             50 61
          "
        />


        <path
          class="flower-stem"
          pathLength="1"
          d="
            M49.5 109
            C49.6 92,
             51 77,
             49 61
          "
        />


        <path
          class="flower-leaf"
          style="--leaf-delay: 300ms;"
          d="
            M49 82
            C43 78,
             37 73,
             34 68
            C41 69,
             46 73,
             50 78
            Z
          "
        />


        <path
          class="leaf-vein"
          d="
            M48 80
            C43 76,
             39 72,
             35 69
          "
        />


        <path
          class="flower-leaf-light"
          style="--leaf-delay: 350ms;"
          d="
            M50 75
            C55 70,
             60 68,
             64 69
            C61 74,
             56 77,
             51 79
            Z
          "
        />


        ${getFlowerHeadMarkup(
          variant,
          svgId,
          organic
        )}

      </svg>

    `;
  }


  if (
    variant === 1
  ) {

    return `

      <svg
        class="flower-svg"
        viewBox="0 0 100 112"
        xmlns="http://www.w3.org/2000/svg"
      >

        ${getFlowerDefs(svgId)}


        <path
          class="flower-stem-shadow"
          pathLength="1"
          d="
            M50 109
            C53 93,
             48 79,
             50 62
          "
        />


        <path
          class="flower-stem"
          pathLength="1"
          d="
            M48.8 109
            C51.5 93,
             46.8 79,
             49 62
          "
        />


        <path
          class="flower-leaf"
          style="--leaf-delay: 320ms;"
          d="
            M49 83
            C55 78,
             61 75,
             65 76
            C62 82,
             56 86,
             50 87
            Z
          "
        />


        <path
          class="leaf-vein"
          d="
            M51 85
            C56 81,
             60 78,
             63 77
          "
        />


        ${getFlowerHeadMarkup(
          variant,
          svgId,
          organic
        )}

      </svg>

    `;
  }


  return `

    <svg
      class="flower-svg"
      viewBox="0 0 100 112"
      xmlns="http://www.w3.org/2000/svg"
    >

      ${getFlowerDefs(svgId)}


      <path
        class="flower-stem-shadow"
        pathLength="1"
        d="
          M49 109
          C47 94,
           52 79,
           50 62
        "
      />


      <path
        class="flower-stem"
        pathLength="1"
        d="
          M47.8 109
          C46 94,
           51 79,
           49 62
        "
      />


      <path
        class="flower-leaf"
        style="--leaf-delay: 315ms;"
        d="
          M48 80
          C42 77,
           37 73,
           35 69
          C41 70,
           46 74,
           49 78
          Z
        "
      />


      <path
        class="leaf-vein"
        d="
          M47 79
          C42 75,
           38 72,
           36 70
        "
      />


      ${getFlowerHeadMarkup(
        variant,
        svgId,
        organic
      )}

    </svg>

  `;
}


// ==========================================
// 47. FLOR PEQUEÑA
// ==========================================

function getGroundFlowerSvg(
  variant,
  svgId,
  organic
) {

  return `

    <svg
      class="flower-svg"
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
    >

      ${getFlowerDefs(svgId)}


      <ellipse
        class="ground-bloom-shadow"
        cx="50"
        cy="60"
        rx="24"
        ry="9"
      />


      <g
        transform="
          translate(0 5)
        "
      >

        ${getFlowerHeadMarkup(
          variant,
          svgId,
          organic
        )}

      </g>

    </svg>

  `;
}


// ==========================================
// 48. ILUMINACIÓN LOCAL
// ==========================================

function createLocalIllumination(
  x,
  y,
  depth,
  options
) {

  const {
    type,
    isGroundFlower
  } = options;


  const manualStrength =
    type === 'user';


  const groundFactor =

    isGroundFlower

      ? 0.76

      : 1;


  const revealPatch =
    document.createElement(
      'div'
    );


  revealPatch.classList.add(
    'ground-reveal'
  );


  revealPatch.style.left =
    `${x}px`;


  revealPatch.style.top =
    `${y}px`;


  const revealSize =

    (
      125 +
      depth * 66
    ) *
    groundFactor;


  revealPatch.style.setProperty(
    '--reveal-size',
    `${revealSize.toFixed(0)}px`
  );


  revealPatch.style.setProperty(
    '--reveal-rotation',
    `${randomBetween(
      -22,
      22
    ).toFixed(1)}deg`
  );


  revealPatch.style.setProperty(
    '--reveal-peak-opacity',

    manualStrength

      ? '0.34'

      : isGroundFlower

        ? '0.17'

        : '0.24'
  );


  revealPatch.style.setProperty(
    '--reveal-rest-opacity',

    manualStrength

      ? '0.13'

      : isGroundFlower

        ? '0.055'

        : '0.085'
  );


  revealLayer.appendChild(
    revealPatch
  );


  const birthGlow =
    document.createElement(
      'div'
    );


  birthGlow.classList.add(
    'birth-glow'
  );


  birthGlow.style.left =
    `${x}px`;


  birthGlow.style.top =
    `${y}px`;


  const glowSize =

    (
      88 +
      depth * 42
    ) *
    groundFactor;


  birthGlow.style.setProperty(
    '--glow-size',
    `${glowSize.toFixed(0)}px`
  );


  birthGlow.style.setProperty(
    '--glow-rotation',
    `${randomBetween(
      -25,
      25
    ).toFixed(1)}deg`
  );


  birthGlow.style.setProperty(
    '--glow-peak-opacity',

    manualStrength

      ? '0.28'

      : '0.18'
  );


  birthGlow.style.setProperty(
    '--glow-mid-opacity',

    manualStrength

      ? '0.12'

      : '0.075'
  );


  revealLayer.appendChild(
    birthGlow
  );


  window.setTimeout(
    () => {

      birthGlow.remove();

    },
    1650
  );
}


// ==========================================
// 49. REVELAR VEGETACIÓN
// ==========================================

function revealNearbyVegetation(
  x,
  y,
  options
) {

  const {
    type,
    isGroundFlower
  } = options;


  let strength =

    type === 'user'

      ? 0.62

      : 0.36;


  if (
    type ===
    'automatic-slow'
  ) {

    strength =
      0.40;

  }


  if (
    isGroundFlower
  ) {

    strength *=
      0.72;

  }


  for (
    const cluster
    of vegetationClusters
  ) {

    const clusterX =

      field.clientWidth *
      (
        cluster.xPercent /
        100
      );


    const clusterY =

      field.clientHeight *
      (
        cluster.yPercent /
        100
      );


    const dx =
      clusterX -
      x;


    const dy =
      clusterY -
      y;


    const distance =

      Math.sqrt(

        dx * dx +
        dy * dy

      );


    if (
      distance >=
      VEGETATION_REVEAL_RADIUS
    ) {

      continue;

    }


    const proximity =

      1 -

      distance /
      VEGETATION_REVEAL_RADIUS;


    cluster.revealLevel =

      clamp(

        cluster.revealLevel +

        proximity *
        strength,

        0,

        1

      );


    const opacity =

      cluster.baseOpacity +

      cluster.revealLevel *
      0.40;


    cluster.element.style.opacity =

      opacity.toFixed(3);


    if (
      cluster.revealLevel >
      0.16
    ) {

      cluster.element.classList.add(
        'is-revealed'
      );

    }
  }
}


// ==========================================
// 50. REVELADO GLOBAL
// ==========================================

function updateAccumulatedFieldReveal() {

  const totalTarget =

    FINAL_FLOWER_TARGET +

    GROUND_FLOWER_TARGET;


  const progress =

    clamp(

      visualFlowerCount /
      totalTarget,

      0,

      1

    );


  /*
    Incluso lleno, el campo sigue oscuro.
  */
  const revealOpacity =

    0.018 +

    progress *
    0.135;


  field.style.setProperty(
    '--field-reveal-opacity',
    revealOpacity.toFixed(3)
  );
}


// ==========================================
// 51. AUXILIARES
// ==========================================

function randomBetween(
  minimum,
  maximum
) {

  return (

    Math.random() *
    (
      maximum -
      minimum
    )

    +

    minimum

  );
}


function randomChoice(
  array
) {

  return array[

    Math.floor(

      Math.random() *
      array.length

    )

  ];
}


function clamp(
  value,
  minimum,
  maximum
) {

  return Math.min(

    Math.max(
      value,
      minimum
    ),

    maximum

  );
}


function shuffleArray(
  array
) {

  for (
    let index =
      array.length - 1;

    index > 0;

    index -= 1
  ) {

    const randomIndex =

      Math.floor(

        Math.random() *
        (
          index + 1
        )

      );


    const temporary =
      array[index];


    array[index] =
      array[randomIndex];


    array[randomIndex] =
      temporary;

  }


  return array;
}


// ==========================================
// 52. EVENTOS
// ==========================================

startButton.addEventListener(
  'click',
  startExperience
);


field.addEventListener(
  'pointerdown',
  handleFieldPointer
);


soundButton.addEventListener(
  'click',
  toggleSound
);


replayButton.addEventListener(
  'click',
  restartExperience
);


messageClose.addEventListener(
  'click',
  () => {

    closeSecretMessage();

  }
);


messageOverlay.addEventListener(
  'click',
  event => {

    if (
      event.target ===
      messageOverlay
    ) {

      closeSecretMessage();

    }

  }
);


document.addEventListener(
  'keydown',
  event => {

    if (
      event.key ===
        'Escape' &&
      !messageOverlay.hidden
    ) {

      closeSecretMessage();

    }

  }
);


// ==========================================
// 53. ESTADO INICIAL
// ==========================================

updateSoundButton();
