// ==========================================
// 1. REFERENCIAS DEL DOCUMENTO
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


// ==========================================
// 2. CONTROLES
// ==========================================

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


// ==========================================
// 3. TARJETA DE MENSAJES
// ==========================================

const messageOverlay =
  document.querySelector('#messageOverlay');

const messageClose =
  document.querySelector('#messageClose');

const secretMessage =
  document.querySelector('#secretMessage');


// ==========================================
// 4. INTERACCIÓN
// ==========================================

const TOTAL_USER_FLOWERS = 10;

const SLOW_GROWTH_START_AT = 5;

const FAST_GROWTH_START_AT = 7;


// ==========================================
// 5. CANTIDADES
// ==========================================

const FINAL_FLOWER_TARGET = 25;

const GROUND_FLOWER_TARGET = 15;


// ==========================================
// 6. FLORES ESPECIALES
// ==========================================

const SPECIAL_FLOWER_TARGET = 8;

const SPECIAL_FLOWER_SLOTS = [
  2,
  5,
  8,
  11,
  14,
  17,
  21,
  24
];


// ==========================================
// 7. MENSAJES SECRETOS
// ==========================================

const SPECIAL_MESSAGES = [

  'Eres un dulcecito que me alegra el día.',

  'Contigo hasta disfruto la monotonía.',

  'Dame chance de escucharte, de entenderte, de besarte y abrazarte cuando no te sientas fuerte.',

  'Tengo una lista de 100 cosas que yo sé que te hacen feliz.',

  'Eres lo mejor que me pasó en la vida.',

  'A veces la riego, a veces no sé qué decirte, solo quiero cuidarte.',

  'Juntos somos ese 100%.',

  'Yo a ti te quiero con todo y tus mil enojos.'

];


// ==========================================
// 8. VELOCIDADES
// ==========================================

const SLOW_GROWTH_INTERVAL = 3800;

const FIRST_SLOW_FLOWER_DELAY = 1800;

const MAX_SLOW_AUTOMATIC_FLOWERS = 4;

const SLOW_GROUND_FLOWER_INTERVAL = 4400;

const FIRST_GROUND_FLOWER_DELAY = 2100;


/*
  Fase rápida desde:

  “Podría seguir haciendo que
  aparezcan flores…”
*/

const FAST_GROWTH_INTERVAL = 420;

const FAST_GROUND_FLOWER_INTERVAL = 520;

const FAST_BIG_START_DELAY = 120;

const FAST_GROUND_START_DELAY = 220;


/*
  Seguridad final.
*/

const FINAL_BIG_FLOWER_INTERVAL = 280;

const FINAL_GROUND_FLOWER_INTERVAL = 340;


// ==========================================
// 9. DISTRIBUCIÓN
// ==========================================

const PREFERRED_FLOWER_DISTANCE = 46;

const VEGETATION_CLUSTER_COUNT = 18;

const VEGETATION_REVEAL_RADIUS = 175;


// ==========================================
// 10. MÚSICA
// ==========================================

const MUSIC_VOLUME = 0.30;

backgroundMusic.volume =
  MUSIC_VOLUME;


// ==========================================
// 11. NARRATIVA
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
// 12. PALETAS
// ==========================================

const FLOWER_PALETTES = [

  {
    petalMain: '#f0c94a',
    petalLight: '#f7dc72',
    petalDeep: '#d8ad34',

    center: '#967020',
    centerLight: '#c89a36'
  },

  {
    petalMain: '#edc544',
    petalLight: '#f5d86a',
    petalDeep: '#d3a82f',

    center: '#8f671d',
    centerLight: '#bd8b2e'
  },

  {
    petalMain: '#f3d052',
    petalLight: '#f9e17c',
    petalDeep: '#deb638',

    center: '#9e7522',
    centerLight: '#cca03a'
  }

];


// ==========================================
// 13. ESTADO GENERAL
// ==========================================

let userFlowerCount = 0;

let plantingEnabled = false;

let narrativeEnabled = false;

let explorationEnabled = false;


// ==========================================
// 14. CRECIMIENTO
// ==========================================

let slowGrowthStarted = false;

let fastGrowthStarted = false;

let finalGrowthAccelerated = false;

let slowAutomaticFlowerCount = 0;

let groundFlowerCount = 0;

let groundAnchorIndex = 0;

let visualFlowerCount = 0;


// ==========================================
// 15. FLORES ESPECIALES
// ==========================================

let largeFlowerSerial = 0;

let specialFlowerCount = 0;

let specialMessageDeck =
  shuffleArray(
    [...SPECIAL_MESSAGES]
  );


// ==========================================
// 16. POSICIONES
// ==========================================

const originalSaraFlowers = [];

const allFlowerPositions = [];

const vegetationClusters = [];


// ==========================================
// 17. TEMPORIZADORES
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
// 18. CAPAS
// ==========================================

let fieldReady = false;

let vegetationLayer = null;

let revealLayer = null;

let flowersBackLayer = null;

let flowersMidLayer = null;

let flowersFrontLayer = null;


// ==========================================
// 19. MÚSICA
// ==========================================

function playBackgroundMusic(
  restart = false
) {

  if (restart) {

    try {

      backgroundMusic.currentTime = 0;

    }

    catch (error) {

      // Algunos navegadores esperan metadata.

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
      () => {

        /*
          Si el navegador bloquea el audio,
          la experiencia continúa.
        */

      }
    );

  }
}


// ==========================================
// 20. ICONO DE SONIDO
// ==========================================

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


// ==========================================
// 21. ACTIVAR / SILENCIAR
// ==========================================

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
// 22. INICIAR EXPERIENCIA
// ==========================================

function startExperience() {

  startScreen.hidden = true;

  scene.hidden = false;

  experienceControls.hidden = false;


  plantingEnabled = true;

  narrativeEnabled = true;

  explorationEnabled = false;


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
// 23. REINICIAR EXPERIENCIA
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

    backgroundMusic.currentTime = 0;

  }

  catch (error) {

    // Nada.

  }


  userFlowerCount = 0;

  plantingEnabled = false;

  narrativeEnabled = false;

  explorationEnabled = false;


  slowGrowthStarted = false;

  fastGrowthStarted = false;

  finalGrowthAccelerated = false;

  slowAutomaticFlowerCount = 0;

  groundFlowerCount = 0;

  groundAnchorIndex = 0;

  visualFlowerCount = 0;


  largeFlowerSerial = 0;

  specialFlowerCount = 0;


  specialMessageDeck =
    shuffleArray(
      [...SPECIAL_MESSAGES]
    );


  originalSaraFlowers.length = 0;

  allFlowerPositions.length = 0;

  vegetationClusters.length = 0;


  field.innerHTML = '';


  field.removeAttribute(
    'data-mode'
  );


  field.classList.remove(
    'final-wind-wave'
  );


  field.style.setProperty(
    '--field-reveal-opacity',
    '0.025'
  );


  fieldReady = false;

  vegetationLayer = null;

  revealLayer = null;

  flowersBackLayer = null;

  flowersMidLayer = null;

  flowersFrontLayer = null;


  narrativeText.classList.remove(
    'is-visible'
  );


  narrativeText.textContent = '';


  interactionHint.classList.remove(
    'is-visible'
  );


  experienceControls.classList.remove(
    'is-exploration'
  );


  startExperience();
}


// ==========================================
// 24. LIMPIAR TEMPORIZADORES
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


  narrativeTimer = null;

  hintTimer = null;

  slowGrowthTimer = null;

  slowGrowthStartTimer = null;

  fastGrowthTimer = null;

  fastGrowthStartTimer = null;

  groundFlowerStartTimer = null;

  slowGroundFlowerTimer = null;

  fastGroundFlowerTimer = null;

  fastGroundStartTimer = null;

  messageHideTimer = null;

  finalWindTimer = null;

  finalWindCleanupTimer = null;
}


// ==========================================
// 25. CONSTRUIR CAMPO
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


  fieldReady = true;
}


// ==========================================
// 26. VEGETACIÓN
// ==========================================

function generateVegetation() {

  vegetationClusters.length = 0;


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
        4,
        96
      );


    const verticalRandom =
      Math.pow(
        Math.random(),
        0.78
      );


    const yPercent =
      15 +
      verticalRandom * 82;


    const scale =
      randomBetween(
        0.72,
        1.25
      );


    const rotation =
      randomBetween(
        -18,
        18
      );


    const baseOpacity =
      randomBetween(
        0.07,
        0.13
      );


    const variant =
      Math.floor(
        randomBetween(
          0,
          3
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


    cluster.style.opacity =
      baseOpacity.toFixed(2);


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
// 27. SVG DE VEGETACIÓN
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
          class="veg-stem"
          d="
            M30 56
            C28 43,
             30 30,
             35 13
          "
        />

        <path
          class="veg-stem veg-stem-soft"
          d="
            M27 56
            C23 44,
             20 34,
             17 22
          "
        />

        <ellipse
          class="veg-leaf"
          cx="36"
          cy="24"
          rx="4"
          ry="10"
          transform="rotate(32 36 24)"
        />

        <ellipse
          class="veg-leaf veg-leaf-soft"
          cx="20"
          cy="34"
          rx="3.5"
          ry="8"
          transform="rotate(-38 20 34)"
        />

        <circle
          class="veg-seed"
          cx="36"
          cy="12"
          r="2.4"
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
            M30 56
            C31 43,
             27 31,
             24 18
          "
        />

        <path
          class="veg-stem veg-stem-soft"
          d="
            M33 56
            C35 42,
             40 34,
             44 23
          "
        />

        <path
          class="veg-stem veg-stem-soft"
          d="
            M27 56
            C23 46,
             20 40,
             15 34
          "
        />

        <ellipse
          class="veg-leaf"
          cx="24"
          cy="30"
          rx="3.8"
          ry="9"
          transform="rotate(-28 24 30)"
        />

        <ellipse
          class="veg-leaf veg-leaf-soft"
          cx="40"
          cy="35"
          rx="3.5"
          ry="8"
          transform="rotate(36 40 35)"
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
          M30 56
          C29 43,
           27 31,
           30 16
        "
      />

      <path
        class="veg-stem veg-stem-soft"
        d="
          M27 56
          C24 45,
           21 38,
           18 29
        "
      />

      <path
        class="veg-stem veg-stem-soft"
        d="
          M33 56
          C37 45,
           39 37,
           41 29
        "
      />

      <ellipse
        class="veg-leaf"
        cx="23"
        cy="39"
        rx="3.6"
        ry="8.5"
        transform="rotate(-40 23 39)"
      />

      <ellipse
        class="veg-leaf veg-leaf-soft"
        cx="37"
        cy="34"
        rx="3.4"
        ry="8"
        transform="rotate(38 37 34)"
      />

    </svg>

  `;
}


// ==========================================
// 28. NARRATIVA
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
// 29. TOQUE DEL CAMPO
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
// 30. FLOR PLANTADA POR SARA
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
    userFlowerCount === 0;


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


  userFlowerCount += 1;


  if (
    userFlowerCount === 1
  ) {

    hideInteractionHint();

  }


  showNarrative(

    NARRATIVE_AFTER_TAP[
      userFlowerCount - 1
    ]

  );


  // ========================================
  // FLOR 5
  // ========================================

  if (
    userFlowerCount ===
    SLOW_GROWTH_START_AT
  ) {

    startSlowGrowth();

    startSlowGroundGrowth();

  }


  // ========================================
  // FLOR 7
  // ========================================

  if (
    userFlowerCount ===
    FAST_GROWTH_START_AT
  ) {

    startFastGrowth();

  }


  // ========================================
  // FLOR 10
  // ========================================

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
// 31. ACELERACIÓN FINAL
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
// 32. ONDA FINAL
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
// 33. EXPLORACIÓN
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

      flower.tabIndex = 0;

    }
  );
}


// ==========================================
// 34. MENSAJES SECRETOS
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


  flower.classList.add(
    'is-discovered'
  );


  flower.dataset.discovered =
    'true';


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
// 35. POSICIONES
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
// 36. CRECIMIENTO LENTO GRANDES
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
// 37. CRECIMIENTO LENTO PEQUEÑAS
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
// 38. FLOR AUTOMÁTICA LENTA
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
// 39. POSICIÓN LENTA
// ==========================================

function findSlowGrowthPosition() {

  const ATTEMPTS = 40;


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
        65,
        165
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
        5,
        30
      );


    const safePosition =
      keepAutomaticFlowerOnScreen(
        x,
        y
      );


    x =
      safePosition.x;

    y =
      safePosition.y;


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
    0.72
  ) {

    return null;

  }


  return bestCandidate;
}


// ==========================================
// 40. FASE RÁPIDA
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
// 41. PEQUEÑAS RÁPIDAS
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
// 42. CREAR PEQUEÑA
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
// 43. POSICIONES PEQUEÑAS
// ==========================================

function findNextGroundFlowerPosition() {

  const anchors = [

    { x: 0.10, y: 0.12 },

    { x: 0.30, y: 0.16 },

    { x: 0.50, y: 0.12 },

    { x: 0.70, y: 0.18 },

    { x: 0.88, y: 0.15 },


    { x: 0.18, y: 0.36 },

    { x: 0.42, y: 0.38 },

    { x: 0.65, y: 0.36 },

    { x: 0.84, y: 0.43 },


    { x: 0.10, y: 0.60 },

    { x: 0.31, y: 0.64 },

    { x: 0.54, y: 0.59 },

    { x: 0.77, y: 0.66 },


    { x: 0.35, y: 0.82 },

    { x: 0.70, y: 0.80 }

  ];


  const anchor =

    anchors[
      groundAnchorIndex %
      anchors.length
    ];


  const ATTEMPTS =
    24;


  const topMargin =
    getAutomaticTopMargin();


  const availableHeight =

    Math.max(

      100,

      field.clientHeight -
      topMargin -
      20

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
        -35,
        35
      );


    y +=
      randomBetween(
        -30,
        30
      );


    const safePosition =
      keepAutomaticFlowerOnScreen(
        x,
        y
      );


    x =
      safePosition.x;

    y =
      safePosition.y;


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
    0.32
  ) {

    return null;

  }


  return bestCandidate;
}


// ==========================================
// 44. GRANDES RÁPIDAS
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
// 45. POSICIÓN RÁPIDA
// ==========================================

function findFastGrowthPosition() {

  const ATTEMPTS =
    55;


  let bestCandidate =
    null;

  let bestScore =
    -Infinity;


  const topMargin =
    getAutomaticTopMargin();


  const horizontalMargin =
    20;

  const bottomMargin =
    8;


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


    const verticalBias =

      Math.pow(
        Math.random(),
        0.72
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
    0.5
  ) {

    return null;

  }


  return bestCandidate;
}


// ==========================================
// 46. TERMINAR GRANDES
// ==========================================

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
// 47. ZONA SEGURA
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
    88;


  const desiredMargin =

    Math.max(

      165,

      narrativeBottom +
      flowerSafetySpace

    );


  return Math.min(

    desiredMargin,

    Math.max(

      165,

      field.clientHeight -
      80

    )

  );
}


// ==========================================
// 48. LIMITAR POSICIÓN
// ==========================================

function keepAutomaticFlowerOnScreen(
  x,
  y
) {

  const horizontalMargin =
    20;


  const topMargin =
    getAutomaticTopMargin();


  const bottomMargin =
    8;


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
// 49. DISTANCIA
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
// 50. CREAR FLOR
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
    options.stable === true;


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
  // SERIAL GRANDES
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

      : (
          (
            largeFlowerSerial -
            1
          ) %
          3
        );


  flower.classList.add(
    `flower--variant-${flowerVariant + 1}`
  );


  // ========================================
  // ESPECIAL
  // ========================================

  let isSpecialFlower =
    false;

  let assignedMessage =
    null;


  if (
    !isGroundFlower &&
    SPECIAL_FLOWER_SLOTS.includes(
      largeFlowerSerial
    ) &&
    specialFlowerCount <
    SPECIAL_FLOWER_TARGET
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


  // ========================================
  // ESCALA
  // ========================================

  const depthScale =

    isGroundFlower

      ? (
          0.64 +
          depth * 0.22
        )

      : (
          0.64 +
          depth * 0.40
        );


  let randomScale;


  if (stable) {

    randomScale = 1;

  }

  else if (
    type === 'user'
  ) {

    randomScale =
      randomBetween(
        0.95,
        1.06
      );

  }

  else if (
    isGroundFlower
  ) {

    randomScale =
      randomBetween(
        0.93,
        1.06
      );

  }

  else {

    randomScale =
      randomBetween(
        0.86,
        1.05
      );

  }


  const scale =

    depthScale *
    randomScale;


  // ========================================
  // ORIENTACIÓN
  // ========================================

  const bodyRotation =

    stable

      ? 0

      : isGroundFlower

        ? randomBetween(
            -9,
            9
          )

        : randomBetween(
            -3.2,
            3.2
          );


  const bloomRotation =

    stable

      ? 0

      : randomBetween(
          -18,
          18
        );


  const bloomSquash =

    stable

      ? 0.87

      : randomBetween(
          0.83,
          0.92
        );


  // ========================================
  // BRISA
  // ========================================

  const swayDuration =

    isGroundFlower

      ? randomBetween(
          7.2,
          10
        )

      : randomBetween(
          4.8,
          7.2
        );


  const swayDelay =

    -randomBetween(
      0,
      swayDuration
    );


  // ========================================
  // ONDA FINAL
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
      90
    );


  // ========================================
  // PALETA
  // ========================================

  const palette =
    randomChoice(
      FLOWER_PALETTES
    );


  // ========================================
  // VARIABLES CSS
  // ========================================

  flower.style.setProperty(
    '--flower-scale',
    scale.toFixed(2)
  );


  flower.style.setProperty(
    '--flower-rotation',
    `${bodyRotation.toFixed(1)}deg`
  );


  flower.style.setProperty(
    '--bloom-rotation',
    `${bloomRotation.toFixed(1)}deg`
  );


  flower.style.setProperty(
    '--bloom-squash',
    bloomSquash.toFixed(2)
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
  // ID SVG
  // ========================================

  const svgId =

    `f-${visualFlowerCount + 1}-${Math
      .random()
      .toString(36)
      .slice(2, 8)}`;


  // ========================================
  // CONFIGURAR ESPECIAL
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


    /*
      El ciclo puede ser relativamente
      corto porque la mayor parte del
      tiempo la flor permanece normal.
    */
    const glintDuration =
      randomBetween(
        5.6,
        7.8
      );


    /*
      Delay negativo:
      las ocho flores empiezan en
      puntos diferentes del ciclo.
    */
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


    /*
      Después de descubrirla,
      tarda bastante más en repetir.
    */
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

  /*
    IMPORTANTE:

    Ya no agregamos ningún
    <span class="special-glint">.

    No existe ningún foco colocado
    encima de la flor.

    Todo el brillo ocurre directamente
    sobre los grupos SVG:
      .flower-heart
      .flower-petals
  */

  flower.innerHTML = `

    <div class="flower-grow">

      <div class="flower-wave">

        <div class="flower-sway">

          ${
            isGroundFlower

              ? getGroundFlowerSvg(
                  flowerVariant,
                  svgId
                )

              : getBaseFlowerSvg(
                  flowerVariant,
                  svgId
                )
          }

        </div>

      </div>

    </div>

  `;


  // ========================================
  // EVENTOS ESPECIALES
  // ========================================

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
// 51. PROFUNDIDAD
// ==========================================

function getFlowerLayer(
  depth
) {

  if (
    depth < 0.47
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
// 52. GRADIENTES SVG
// ==========================================

function getFlowerDefs(
  svgId
) {

  return `

    <defs>

      <linearGradient
        id="${svgId}-petal-light"
        x1="0%"
        y1="0%"
        x2="0%"
        y2="100%"
      >
        <stop
          offset="0%"
          stop-color="var(--petal-light)"
        />

        <stop
          offset="58%"
          stop-color="var(--petal-main)"
        />

        <stop
          offset="100%"
          stop-color="var(--petal-deep)"
          stop-opacity="0.88"
        />
      </linearGradient>


      <linearGradient
        id="${svgId}-petal-main"
        x1="16%"
        y1="8%"
        x2="76%"
        y2="92%"
      >
        <stop
          offset="0%"
          stop-color="var(--petal-light)"
          stop-opacity="0.88"
        />

        <stop
          offset="48%"
          stop-color="var(--petal-main)"
        />

        <stop
          offset="100%"
          stop-color="var(--petal-deep)"
          stop-opacity="0.94"
        />
      </linearGradient>


      <linearGradient
        id="${svgId}-petal-deep"
        x1="20%"
        y1="0%"
        x2="75%"
        y2="100%"
      >
        <stop
          offset="0%"
          stop-color="var(--petal-main)"
        />

        <stop
          offset="62%"
          stop-color="var(--petal-deep)"
        />

        <stop
          offset="100%"
          stop-color="var(--petal-deep)"
          stop-opacity="0.78"
        />
      </linearGradient>


      <radialGradient
        id="${svgId}-center"
        cx="38%"
        cy="32%"
        r="72%"
      >
        <stop
          offset="0%"
          stop-color="var(--flower-center-light)"
        />

        <stop
          offset="52%"
          stop-color="var(--flower-center)"
        />

        <stop
          offset="100%"
          stop-color="#6f4e16"
        />
      </radialGradient>

    </defs>

  `;
}


// ==========================================
// 53. PÉTALO
// ==========================================

function createPetalMarkup(
  svgId,
  petal
) {

  return `

    <path
      class="petal"
      fill="url(#${svgId}-${petal.fill})"
      style="
        --petal-delay:
          ${petal.delay}ms;

        --petal-fold:
          ${petal.fold}deg;
      "
      d="${petal.d}"
    />

  `;
}


// ==========================================
// 54. CABEZA FLORAL
// ==========================================

function getFlowerHeadMarkup(
  variant,
  svgId
) {

  const variantOne = [

    {
      fill: 'petal-light',
      delay: 160,
      fold: -8,
      d:
        'M46.5 36 C43.2 29.5 44.2 18.5 50 12 C56.1 18 57.2 28.5 53 36 C51.2 39 48.2 39 46.5 36 Z'
    },

    {
      fill: 'petal-main',
      delay: 205,
      fold: 12,
      d:
        'M54 35 C58.8 28.4 67.3 23.3 74 26.5 C75 33.7 68 39.9 59 41 C56 41.3 52.8 38 54 35 Z'
    },

    {
      fill: 'petal-deep',
      delay: 245,
      fold: 14,
      d:
        'M58 41 C67 38.1 76.7 40.5 80 46.8 C76.4 53.5 66.5 55 58.5 50.2 C55.5 48.4 55.1 43.3 58 41 Z'
    },

    {
      fill: 'petal-main',
      delay: 295,
      fold: 10,
      d:
        'M56 49 C64.1 51.8 69.4 59.6 66.3 65.8 C59.4 68.4 53.2 61.8 51.1 54.1 C50.2 50.9 52.9 47.9 56 49 Z'
    },

    {
      fill: 'petal-light',
      delay: 340,
      fold: -10,
      d:
        'M48.5 52 C48 60.8 42.2 69 35.7 69.6 C31.3 63.7 35.2 54 43.1 49.2 C46 47.4 49 48.8 48.5 52 Z'
    },

    {
      fill: 'petal-main',
      delay: 265,
      fold: -14,
      d:
        'M42 49 C34 53.5 24.8 52.2 20.6 46.4 C23.8 40 34 38.2 42 41.3 C45 42.5 45 47 42 49 Z'
    },

    {
      fill: 'petal-deep',
      delay: 215,
      fold: -12,
      d:
        'M42 40 C33.3 39.3 27 33 28.2 26.2 C34.7 22 43 27 46.8 34.1 C48.4 37 45.3 40.2 42 40 Z'
    }

  ];


  const variantTwo = [

    {
      fill: 'petal-light',
      delay: 160,
      fold: -7,
      d:
        'M45.5 36.5 C40.7 29.3 42.3 18.3 49.5 11.5 C57.5 17.5 59.2 29.2 54 37 C51.8 40.1 47.6 39.8 45.5 36.5 Z'
    },

    {
      fill: 'petal-main',
      delay: 210,
      fold: 13,
      d:
        'M54 36 C60.3 28.2 71.2 24.2 77.4 29.2 C77.2 37.2 68.3 43.6 59.1 43 C55.5 42.8 52 39.4 54 36 Z'
    },

    {
      fill: 'petal-deep',
      delay: 280,
      fold: 13,
      d:
        'M58.5 44 C68.1 43.2 77 48.2 77.3 55.5 C71.3 62.2 60.8 59.8 54.2 52.1 C51.8 49.1 54.8 44.3 58.5 44 Z'
    },

    {
      fill: 'petal-light',
      delay: 340,
      fold: 2,
      d:
        'M54 51.5 C59.4 60 57 69.1 50 73.2 C42.8 69.4 40.8 59.8 46.2 51.6 C48.1 48.9 52 48.7 54 51.5 Z'
    },

    {
      fill: 'petal-main',
      delay: 275,
      fold: -13,
      d:
        'M45.7 52 C38.5 59.3 28.4 61.3 22.6 55.7 C22.9 48.3 31.8 43.2 41.1 44.6 C44.9 45.2 48 49.1 45.7 52 Z'
    },

    {
      fill: 'petal-deep',
      delay: 215,
      fold: -13,
      d:
        'M41.4 43 C32.1 43.4 23.1 37.2 22.8 30 C28.7 23.8 39.8 27.2 46 35.7 C48.2 38.7 45 42.8 41.4 43 Z'
    }

  ];


  const variantThree = [

    {
      fill: 'petal-light',
      delay: 150,
      fold: -8,
      d:
        'M47 36 C43.9 29.6 45 18.6 50 12.4 C55.6 18.2 56.7 29.1 53 36.2 C51.5 39 48.5 39 47 36 Z'
    },

    {
      fill: 'petal-main',
      delay: 185,
      fold: 10,
      d:
        'M53.5 35.8 C57.2 28.5 64.5 23.4 70.6 24.8 C73 31.6 67.2 38.6 58.8 40.5 C55.7 41.2 52.2 38.8 53.5 35.8 Z'
    },

    {
      fill: 'petal-deep',
      delay: 230,
      fold: 14,
      d:
        'M58 40.6 C65.9 36.9 75.5 38.7 79.3 44 C77 50.9 67.7 53 59.1 49.4 C56.1 48.1 55.1 42.5 58 40.6 Z'
    },

    {
      fill: 'petal-main',
      delay: 285,
      fold: 13,
      d:
        'M58.2 48.2 C66.2 49.4 72.4 56.2 70.3 62.1 C64.5 66.4 56.5 61.7 52.6 54 C51.2 51.1 55 47.7 58.2 48.2 Z'
    },

    {
      fill: 'petal-light',
      delay: 335,
      fold: 4,
      d:
        'M53 52 C56.3 59.8 53.5 68.1 47.9 71 C42.1 66.7 42.1 57.8 46.7 51.1 C48.5 48.6 51.8 49.1 53 52 Z'
    },

    {
      fill: 'petal-main',
      delay: 300,
      fold: -12,
      d:
        'M45.7 51.2 C40.6 58.3 31.8 62.2 26.9 58.3 C25 51.9 32.1 45.5 40.8 44.8 C44.2 44.5 47.7 48.2 45.7 51.2 Z'
    },

    {
      fill: 'petal-deep',
      delay: 245,
      fold: -14,
      d:
        'M41.3 47.3 C33.4 50.2 24.4 47.8 21.8 42 C25.1 35.8 34.5 35.6 42.2 40.2 C45 42.1 44.3 46.3 41.3 47.3 Z'
    },

    {
      fill: 'petal-main',
      delay: 195,
      fold: -11,
      d:
        'M42.4 40 C35.3 38.9 29.8 32.4 31.4 26.6 C37.6 23.1 44.5 28.3 47 34.7 C48.3 37.6 45.5 40.5 42.4 40 Z'
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
      cy: 41.2,
      rx: 9.8,
      ry: 6.8
    },

    {
      cy: 42.1,
      rx: 9.2,
      ry: 6.4
    },

    {
      cy: 41.4,
      rx: 8.8,
      ry: 6.1
    }

  ];


  const center =
    centers[variant];


  /*
    CAMBIO IMPORTANTE:

    Los pétalos y el centro quedan
    agrupados por separado.

    Esto permite que el brillo nazca
    en .flower-heart y luego viaje
    a .flower-petals.
  */

  return `

    <g class="flower-bloom">


      <g class="flower-petals">

        ${petals}

      </g>


      <g class="flower-heart">

        <ellipse
          class="flower-center-shadow"
          cx="50"
          cy="${center.cy + 2.1}"
          rx="${center.rx + 1.2}"
          ry="${center.ry + 0.9}"
          fill="#694b19"
        />


        <ellipse
          class="flower-center"
          cx="50"
          cy="${center.cy}"
          rx="${center.rx}"
          ry="${center.ry}"
          fill="url(#${svgId}-center)"
        />


        <ellipse
          class="flower-center-light"
          cx="46.8"
          cy="${center.cy - 2.3}"
          rx="2.7"
          ry="1.7"
          fill="var(--flower-center-light)"
        />


        <circle
          class="center-speck"
          cx="48"
          cy="${center.cy + 1}"
          r="0.85"
          fill="var(--flower-center-light)"
        />


        <circle
          class="center-speck"
          cx="52.3"
          cy="${center.cy - 0.8}"
          r="0.75"
          fill="var(--flower-center-light)"
        />


        <circle
          class="center-speck"
          cx="53"
          cy="${center.cy + 2}"
          r="0.65"
          fill="#e0b347"
        />


        <circle
          class="center-speck"
          cx="46.3"
          cy="${center.cy - 0.3}"
          r="0.65"
          fill="#e0b347"
        />

      </g>


    </g>

  `;
}


// ==========================================
// 55. FLOR COMPLETA
// ==========================================

function getBaseFlowerSvg(
  variant,
  svgId
) {

  if (
    variant === 0
  ) {

    return `

      <svg
        class="flower-svg"
        viewBox="0 0 100 120"
        xmlns="http://www.w3.org/2000/svg"
      >

        ${getFlowerDefs(svgId)}


        <path
          class="flower-stem-shadow"
          pathLength="1"
          d="
            M51 116
            C50 99,
             54 82,
             50 57
          "
        />


        <path
          class="flower-stem"
          pathLength="1"
          d="
            M49.5 116
            C48.8 99,
             52.5 82,
             49 56
          "
        />


        <path
          class="flower-leaf"
          style="
            --leaf-delay:
              360ms;
          "
          d="
            M49 84
            C42 79,
             35 72,
             31 66
            C39 68,
             46 73,
             50 80
            C50.5 82,
             50 83.5,
             49 84
            Z
          "
        />


        <path
          class="leaf-vein"
          d="
            M48.5 82
            C42 76,
             37 71,
             33 68
          "
        />


        <path
          class="flower-leaf-light"
          style="
            --leaf-delay:
              430ms;
          "
          d="
            M50.5 74
            C56 68,
             62 64,
             67 65
            C64 71,
             58 76,
             51 78
            Z
          "
        />


        <path
          class="leaf-vein"
          d="
            M52 76
            C57 71,
             61 68,
             65 66
          "
        />


        <path
          class="flower-calyx-dark"
          d="
            M40 52
            C44 49,
             56 49,
             60 52
            C56 58,
             44 58,
             40 52
            Z
          "
        />


        ${getFlowerHeadMarkup(
          variant,
          svgId
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
        viewBox="0 0 100 120"
        xmlns="http://www.w3.org/2000/svg"
      >

        ${getFlowerDefs(svgId)}


        <path
          class="flower-stem-shadow"
          pathLength="1"
          d="
            M52 116
            C55 98,
             48 80,
             50 57
          "
        />


        <path
          class="flower-stem"
          pathLength="1"
          d="
            M50.5 116
            C53.4 98,
             46.8 80,
             49 56
          "
        />


        <path
          class="flower-leaf"
          style="
            --leaf-delay:
              390ms;
          "
          d="
            M49.5 87
            C55 80,
             61 75,
             66 76
            C63 83,
             57 88,
             50 90
            Z
          "
        />


        <path
          class="leaf-vein"
          d="
            M51 88
            C56 83,
             60 79,
             64 77
          "
        />


        <path
          class="flower-leaf-light"
          style="
            --leaf-delay:
              450ms;
          "
          d="
            M48.5 76
            C42 72,
             36 66,
             33 61
            C40 62,
             46 67,
             50 73
            Z
          "
        />


        <path
          class="leaf-vein"
          d="
            M48.5 74
            C43 69,
             38 65,
             35 63
          "
        />


        <path
          class="flower-calyx-dark"
          d="
            M40 52
            C44 49,
             56 49,
             60 52
            C56 58,
             44 58,
             40 52
            Z
          "
        />


        ${getFlowerHeadMarkup(
          variant,
          svgId
        )}

      </svg>

    `;
  }


  return `

    <svg
      class="flower-svg"
      viewBox="0 0 100 120"
      xmlns="http://www.w3.org/2000/svg"
    >

      ${getFlowerDefs(svgId)}


      <path
        class="flower-stem-shadow"
        pathLength="1"
        d="
          M48.5 116
          C46.5 97,
           53.5 81,
           50 57
        "
      />


      <path
        class="flower-stem"
        pathLength="1"
        d="
          M47.2 116
          C45.5 97,
           52 81,
           49 56
        "
      />


      <path
        class="flower-leaf"
        style="
          --leaf-delay:
            370ms;
        "
        d="
          M48 82
          C41 78,
           36 73,
           34 68
          C40 69,
           46 73,
           49 78
          Z
        "
      />


      <path
        class="leaf-vein"
        d="
          M47.5 80
          C42 76,
           38 72,
           35 69
        "
      />


      <path
        class="flower-leaf-light"
        style="
          --leaf-delay:
            440ms;
        "
        d="
          M49.7 69
          C55 65,
           60 63,
           64 65
          C61 70,
           56 73,
           50 74
          Z
        "
      />


      <path
        class="leaf-vein"
        d="
          M51 72
          C55 69,
           59 66,
           62 65
        "
      />


      <path
        class="flower-calyx-dark"
        d="
          M40 52
          C44 49,
           56 49,
           60 52
          C56 58,
           44 58,
           40 52
          Z
        "
      />


      ${getFlowerHeadMarkup(
        variant,
        svgId
      )}

    </svg>

  `;
}


// ==========================================
// 56. FLOR PEQUEÑA
// ==========================================

function getGroundFlowerSvg(
  variant,
  svgId
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
        cy="61"
        rx="23"
        ry="10"
      />


      <g
        transform="
          translate(0 14)
        "
      >

        ${getFlowerHeadMarkup(
          variant,
          svgId
        )}

      </g>

    </svg>

  `;
}


// ==========================================
// 57. ILUMINACIÓN LOCAL
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

      ? 0.80

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
      120 +
      depth * 62
    ) *
    groundFactor;


  revealPatch.style.setProperty(
    '--reveal-size',
    `${revealSize.toFixed(0)}px`
  );


  revealPatch.style.setProperty(
    '--reveal-peak-opacity',

    manualStrength

      ? '0.26'

      : isGroundFlower

        ? '0.16'

        : '0.20'
  );


  revealPatch.style.setProperty(
    '--reveal-rest-opacity',

    manualStrength

      ? '0.115'

      : isGroundFlower

        ? '0.070'

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
      90 +
      depth * 46
    ) *
    groundFactor;


  birthGlow.style.setProperty(
    '--glow-size',
    `${glowSize.toFixed(0)}px`
  );


  birthGlow.style.setProperty(
    '--glow-peak-opacity',

    manualStrength

      ? '0.30'

      : isGroundFlower

        ? '0.16'

        : '0.22'
  );


  birthGlow.style.setProperty(
    '--glow-mid-opacity',

    manualStrength

      ? '0.135'

      : isGroundFlower

        ? '0.075'

        : '0.10'
  );


  revealLayer.appendChild(
    birthGlow
  );


  window.setTimeout(
    () => {

      birthGlow.remove();

    },
    1700
  );
}


// ==========================================
// 58. VEGETACIÓN CERCANA
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

      ? 0.52

      : 0.34;


  if (
    type ===
    'automatic-slow'
  ) {

    strength =
      0.36;

  }


  if (
    type ===
    'ground-accent'
  ) {

    strength =
      0.24;

  }


  if (
    isGroundFlower
  ) {

    strength *=
      0.82;

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

      opacity.toFixed(2);


    if (
      cluster.revealLevel >
      0.2
    ) {

      cluster.element.classList.add(
        'is-revealed'
      );

    }
  }
}


// ==========================================
// 59. REVELADO GLOBAL
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


  const revealOpacity =

    0.025 +

    progress *
    0.15;


  field.style.setProperty(
    '--field-reveal-opacity',
    revealOpacity.toFixed(3)
  );
}


// ==========================================
// 60. AUXILIARES
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
          index +
          1
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
// 61. EVENTOS
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
// 62. ESTADO INICIAL
// ==========================================

updateSoundButton();
