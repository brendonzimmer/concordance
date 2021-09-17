let clicked = false,
  appear = false,
  opacity = 0,
  mouse = {
    x: 0,
    y: 0,
  },
  fonts = {
    sad: ["AURORA-PRO.otf", "Untitled In Motion.ttf", "ASS.ttf", "Grunge.ttf", "Astral Wave.ttf", "Bespoke.otf"],
    angry: ["marola.ttf", "nervous.ttf", "timesnewarial.ttf", "chinese rocks rg.otf", "SplitOn.ttf", "quickend.ttf"],
    helvetica: ["", " light", " italic", " bold"],
  },
  i = 0;

const quotes = [];

function preload() {
  fonts.angry.forEach((f, ind) => {
    fonts.angry[ind] = loadFont(`../static/fonts/angry/${f}`);
  });
  fonts.sad.forEach((f, ind) => {
    fonts.sad[ind] = loadFont(`../static/fonts/sad/${f}`);
  });
  fonts.helvetica.forEach((f, ind) => {
    fonts.helvetica[ind] = loadFont(`../static/fonts/helvetica/helvetica${f}.ttf`);
  });
}

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  clear();
  background(255, opacity);

  for (const e of end) {
    textSize(e.size);
    textFont(fonts.helvetica[e.font]);
    fill(0, 0, 0, e.fade);
    text(e.text, e.pos.x * windowWidth, e.pos.y * windowHeight);
    if (opacity >= 255 && e.fade < e.maxFade) e.fade++;
  }

  if (appear) {
    const index = i % angryQuotes.length;
    const randomAngryFont = i % (!clicked ? fonts.angry.length : fonts.sad.length);

    if (!clicked) {
      quotes.push({
        text: angryQuotes[index],
        font: fonts.angry[randomAngryFont],
        mouse: { x: mouse.x, y: mouse.y },
        color: {
          r: 238,
          g: 147,
          b: 1,
        },
        fade: 255,
        fadeRate: () => (!clicked ? 3 : 20),
      });
    } else {
      quotes.push({
        text: sadQuotes[index],
        font: fonts.sad[randomAngryFont],
        mouse: { x: mouse.x, y: mouse.y },
        color: {
          r: 74,
          g: 132,
          b: 244,
        },
        fade: 255,
        fadeRate: () => (clicked ? 2.25 : 25),
      });
    }
  }

  for (const q of quotes) {
    if (q.fade > 1) {
      !clicked ? textSize(32) : textSize(36);
      textFont(q.font);
      fill(q.color.r, q.color.g, q.color.b, q.fade);
      text(q.text, q.mouse.x + (!clicked ? random(-1.5, 1.5) : 0), q.mouse.y + (!clicked ? random(-1.5, 1.5) : 0));
      q.fade -= q.fadeRate();
    }
  }

  i++;
  appear = false;
}

function mouseClicked() {
  clicked = !clicked;
}

function mouseMoved() {
  if (opacity > 0) return;
  if (
    mouseX / windowWidth > 0.36 &&
    mouseX / windowWidth < 0.61 &&
    mouseY / windowHeight > 0.4 &&
    mouseY / windowHeight < 0.75
  )
    return;
  if (Math.abs(mouseX - mouse.x) > (!clicked ? 250 : 375) || Math.abs(mouseY - mouse.y) > (!clicked ? 250 : 375)) {
    mouse.x = mouseX;
    mouse.y = mouseY;
    appear = true;
  }
}

function mouseWheel(e) {
  if (e.deltaY > 0) {
    if (opacity < 255) opacity += 3;
  }
  if (e.deltaY < 0) {
    if (opacity > 0) opacity -= 3;
    for (const t of end) if (t.fade > 0) t.fade -= 4;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

// DATA
const end = [
  {
    text: "the fog makes me invisible",
    font: 1,
    pos: { x: 0.44, y: 0.5 },
    fade: 0,
    size: 28,
    maxFade: 100,
  },
  {
    text: "it's a simple matter to step over the guard chain",
    font: 3,
    pos: { x: 0.07, y: 0.3 },
    fade: 0,
    size: 30,
    maxFade: 150,
  },
  {
    text: "the fog's thick enough to conceal one's trespasses",
    font: 0,
    pos: { x: 0.12, y: 0.35 },
    fade: 0,
    size: 30,
    maxFade: 150,
  },
  {
    text: "creamy water folds in on itself",
    font: 0,
    pos: { x: 0.2, y: 0.4 },
    fade: 0,
    size: 30,
    maxFade: 140,
  },
  {
    text: "the cream of the water obscures the turbulence",
    font: 2,
    pos: { x: 0.2, y: 0.6 },
    fade: 0,
    size: 25,
    maxFade: 150,
  },
  {
    text: "what would one see looking up through the water?",
    font: 3,
    pos: { x: 0.19, y: 0.7 },
    fade: 0,
    size: 30,
    maxFade: 180,
  },
  {
    text: "i don't think the Denouement happened here",
    font: 1,
    pos: { x: 0.23, y: 0.65 },
    fade: 0,
    size: 25,
    maxFade: 75,
  },
];
const angryQuotes = [
  "My chest feels buckled-up",
  "My ribs feel bruised",
  "Not even a concordance",
  "God dammit all!",
  "Right here, you dolts",
  "I lived here my whole life!",
  "I know where to find her",
  "I can't help myself",
  "I went to highschool with you for four years",
  "We were on a date",
  "Goddammnit my name's not Mike",
  "That damn book",
  "No publisher would dare print",
  "No way out",
];
const sadQuotes = [
  "I'll put in a rush order, but I won't",
  "The secret is... there is no denouement",
  "Everything about this place muddies my head",
  "Too easy to dungeon myself in my bedroom",
  "Dear God, not today, not here, not now",
  "There's no joy in this particular glass of beer",
  "There's nothing else to do",
  "I never want to see her again",
  "There's nothing gained by pretending",
  "My inner gyroscope's loopy",
  "It's not healthy there",
  "I've got nothing else going on",
  "Too early to go home",
  '"You went to highschool around here, right?"',
  '"We were all there"',
  '"Are you from around here?"',
  '"But did you go to school here?"',
  '"I don\'t remember that"',
  '"You don\'t look so good"',
  "The nonsense mosquitoes my ears",
  "There will be questions and insuinuations",
  "Here no one asks about Denouements",
];
//
