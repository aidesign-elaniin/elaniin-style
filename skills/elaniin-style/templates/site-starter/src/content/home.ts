// Home. Real text: hero. Placeholder text: logos, features and figures (they are marked on screen).
export const home = {
  hero: {
    before: "Diseñamos ",
    accent: "productos",
    after: " que la gente usa",
    lead: "Estrategia, diseño e ingeniería para equipos que entregan, en semanas y no en trimestres.",
    primary: { label: "Hablemos", href: "/contacto/" },
    secondary: { label: "Ver servicios", href: "/servicios/" },
  },
  clientsLabel: "Confían en nosotros",
  clients: ["Logo cliente 01", "Logo cliente 02", "Logo cliente 03", "Logo cliente 04", "Logo cliente 05"],
  featuresTitle: "Por qué trabajar con nosotros",
  features: [
    { title: "Encontramos el problema real", text: "Texto de relleno: investigación y datos que muestran qué frena el crecimiento." },
    { title: "Interfaces que convierten", text: "Texto de relleno: diseño de producto y sistemas listos para ingeniería." },
    { title: "Ingeniería al ritmo del negocio", text: "Texto de relleno: entregas pequeñas, medibles y frecuentes." },
  ],
  statsTitle: "Resultados",
  statsNote: "Cifras ilustrativas",
  stats: [
    { value: 48, suffix: " %", label: "menos tiempo de entrega" },
    { value: 12400, suffix: "", label: "envíos al mes" },
    { value: 98, suffix: " %", label: "cumplimiento" },
  ],
  loopTitle: "Cómo trabajamos",
  loopSteps: ["Plan", "Diseño", "Código", "Lanzar"], // labels of 8 letters at most: they break at 375 px
  cta: {
    title: "¿Listo para construir algo que la gente ame?",
    lead: "Cuéntanos sobre tu producto y te respondemos en dos días hábiles.",
    action: { label: "Inicia un proyecto", href: "/contacto/" },
  },
};
