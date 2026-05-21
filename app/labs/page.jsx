import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export default function LabsPage() {
  const serif = '"Fraunces", Georgia, serif';
  const mono = '"IBM Plex Mono", monospace';

  const subjects = [
    {
      name: "Biology",
      slug: "biology",
      labs: [
        { href: "/food-tests", kicker: "Food & nutrition", title: "Food Tests",
          blurb: "Iodine · Benedict's · Biuret · Emulsion. Test an unknown food sample for starch, sugar, protein and lipid." },
        { href: "/nutrients-in-foods", kicker: "Food & nutrition", title: "Nutrients in Real Foods",
          blurb: "Run all four food tests on six real foods. Predict the nutrient profile of each, then check the mark scheme." },
        { href: "/food-energy", kicker: "Food & nutrition", title: "Energy Content of Food",
          blurb: "Burn a peanut/cashew/marshmallow under a tube of water. Use q = mcΔT to find kJ per gram, compared to published values." },
        { href: "/photosynthesis", kicker: "Photosynthesis", title: "Starch Test in a Leaf",
          blurb: "Boil, decolorise, stain. Predict whether each prepared leaf will turn blue-black after iodine." },
        { href: "/elodea", kicker: "Photosynthesis", title: "Pondweed Bubble Counter",
          blurb: "Count O₂ bubbles from Elodea. Vary lamp distance, CO₂ and temperature. Plot rate vs light intensity." },
        { href: "/co2", kicker: "Photosynthesis", title: "Need for CO₂",
          blurb: "Three bagged leaves: soda lime, sodium bicarbonate, water control. Predict which photosynthesise." },
        { href: "/variegated-leaf", kicker: "Photosynthesis", title: "Need for Chlorophyll",
          blurb: "Variegated leaf through the standard starch test — only green regions go blue-black. Chlorophyll is required." },
        { href: "/hill-reaction", kicker: "A-level extension", title: "Hill Reaction · DCPIP",
          blurb: "Time the decolourisation of DCPIP by isolated chloroplasts." },
        { href: "/limewater-exhaled", kicker: "Respiration", title: "Inhaled vs Exhaled Air",
          blurb: "U-tube limewater apparatus. Exhaled side goes milky much faster — exhaled air contains more CO₂." },
        { href: "/germinating-seeds", kicker: "Respiration", title: "Germinating Seeds · Heat",
          blurb: "Live vs dead seeds in insulated flasks. Live flask warms up — direct evidence respiration releases energy as heat." },
        { href: "/respirometer", kicker: "Respiration", title: "Respirometer",
          blurb: "Compare rate of O₂ uptake in germinating peas, maggots, woodlice. KOH absorbs CO₂; manometer measures the gap." },
        { href: "/enzyme-temperature", kicker: "Enzymes", title: "Effect of Temperature on Amylase",
          blurb: "Five water baths (5, 20, 35, 50, 65 °C). Sample with iodine every 30 s. Optimum around 35 °C; denatured at 65 °C." },
        { href: "/enzyme-ph", kicker: "Enzymes", title: "Effect of pH on Amylase",
          blurb: "Five buffered tubes (pH 3, 5, 7, 9, 11). Rate peaks at pH 7; falls steeply outside the optimum range." },
        { href: "/enzyme-substrate", kicker: "Enzymes", title: "Effect of [H₂O₂] on Catalase",
          blurb: "Yeast-filter-paper disc rise time at six H₂O₂ concentrations. Rate rises then plateaus — saturation of active sites." },
        { href: "/osmosis-potato", kicker: "Osmosis", title: "Potato Cylinders",
          blurb: "Six sucrose concentrations. Mass change over 60 min. Crossing point on graph gives potato's water potential." },
        { href: "/diffusion-agar", kicker: "Diffusion", title: "Agar Cubes (SA:V)",
          blurb: "Three sizes of phenolphthalein-NaOH agar cube in HCl. Small cube decolourises first — high SA:V wins." },
        { href: "/visking-tubing", kicker: "Membranes", title: "Visking Tubing Model",
          blurb: "Bag of starch + glucose in water. Glucose passes through, starch does not. Models partial permeability." },
        { href: "/potometer", kicker: "Plant transport", title: "Potometer · Transpiration",
          blurb: "Time the air bubble in a capillary under five conditions: still, wind, light, humid bag, heat." },
        { href: "/celery-xylem", kicker: "Plant transport", title: "Stained Celery",
          blurb: "Celery in red dye. Cross-section reveals dye traces the xylem vessels — water transport tissue." },
        { href: "/microscopy-cells", kicker: "Microscopy", title: "Animal vs Plant Cells",
          blurb: "Cheek epithelium (methylene blue) and onion epidermis (iodine). Click features to identify and compare." },
        { href: "/mitosis", kicker: "Cell division", title: "Mitosis Stages",
          blurb: "Field of 24 onion-root-tip cells stained with aceto-orcein. Classify each cell; calculate mitotic index." },
        { href: "/monohybrid", kicker: "Inheritance", title: "Monohybrid Cross",
          blurb: "Pick parental genotypes. See Punnett square. Run 1000 offspring trials and compare observed vs expected ratios." },
        { href: "/variation", kicker: "Inheritance", title: "Continuous vs Discontinuous",
          blurb: "Sample a student population for height (continuous) and tongue-rolling (discontinuous). Compare histograms." },
      ],
    },
    {
      name: "Chemistry",
      slug: "chemistry",
      labs: [
        { href: "/qualitative-analysis", kicker: "NSSCO Paper 3 · core", title: "Qualitative Analysis",
          blurb: "Identify cations and anions. NaOH, ammonia, AgNO₃, BaNO₃, flame tests. Wording from NSSCO Annexe B." },
        { href: "/filtration", kicker: "NSSCO 2024 · Q2", title: "Purification of Rock Salt",
          blurb: "Grind, dissolve, filter, evaporate. Obtain dry NaCl crystals. Quiz on the exam vocabulary." },
        { href: "/flame-gas-tests", kicker: "Drill", title: "Flame & Gas Tests",
          blurb: "Flame colours (Li, Na, K, Ca, Ba) and gases (H₂, O₂, CO₂, NH₃, Cl₂) tested with the standard reagents." },
        { href: "/chromatography", kicker: "NSSCO 2024 · Q1", title: "Paper Chromatography",
          blurb: "Spot the setup error, run the chromatogram, interpret Rf and number of dyes." },
        { href: "/fractional-distillation", kicker: "Separation", title: "Fractional Distillation",
          blurb: "Distil wine to separate ethanol from water. Watch the temperature plateau at 78 °C." },
        { href: "/gas-diffusion", kicker: "Matter", title: "Gas Diffusion (NH₃ + HCl)",
          blurb: "Watch where the white ring of NH₄Cl forms — and verify Graham's law from the position." },
        { href: "/group-1-metals", kicker: "Periodic table", title: "Group I Reactivity",
          blurb: "Drop Li, Na and K into water. Compare vigour. Potassium burns with a lilac flame." },
        { href: "/electrolysis", kicker: "Syllabus 5.1", title: "Electrolysis",
          blurb: "Six electrolyte / electrode combinations. Identify products at cathode and anode; check half-equations." },
        { href: "/electroplating", kicker: "Electrochemistry", title: "Electroplating",
          blurb: "Plate a zinc cathode with copper. Calculate the deposited mass from Q = It and Faraday's law." },
        { href: "/gas-collection-rate", kicker: "NSSCO 2024 · Q3", title: "Rate · KClO₃ → O₂",
          blurb: "Heat KClO₃ + MnO₂. Collect O₂ in a gas syringe. Tabulate, plot V vs t, answer the kinetics questions." },
        { href: "/rate-of-reaction", kicker: "Rates", title: "Rate · Mg + HCl",
          blurb: "Drop magnesium ribbon into HCl at different concentrations. Time to dissolve → rate vs [HCl]." },
        { href: "/iodine-clock", kicker: "NSSCAS 2024 · Q1", title: "Iodine Clock",
          blurb: "Five experiments with different [I⁻]. Time to blue-black. Plot rate vs [I⁻]." },
        { href: "/thiosulfate-rate", kicker: "Rates", title: "Na₂S₂O₃ + HCl (turbidity)",
          blurb: "The disappearing cross. Time how long until sulfur clouds the solution at five concentrations." },
        { href: "/titration", kicker: "Standard", title: "Acid–Base Titration",
          blurb: "Burette of NaOH, flask of unknown HCl + phenolphthalein. Calculate the concentration of the acid." },
        { href: "/insoluble-salts", kicker: "Salts", title: "Insoluble Salts",
          blurb: "Precipitate PbI₂, BaSO₄, AgCl or Fe(OH)₃ by mixing two soluble salts. Filter, wash, dry." },
        { href: "/soluble-salts", kicker: "Salts", title: "Soluble Salts",
          blurb: "Acid + insoluble base (or carbonate). Filter the excess, evaporate the filtrate, grow crystals." },
        { href: "/alloy-redox-titration", kicker: "NSSCAS", title: "Alloy Redox Titration",
          blurb: "Titrate Fe²⁺ from a dissolved iron alloy against standardised KMnO₄. Calculate the % iron." },
        { href: "/enthalpy-neutralisation", kicker: "NSSCAS", title: "Enthalpy of Neutralisation",
          blurb: "Mix HCl and NaOH in a styrofoam cup. Use q = mcΔT to find ΔH per mole of water formed." },
        { href: "/reactivity-series", kicker: "Reactivity", title: "Reactivity Series",
          blurb: "Drop four metals into four salt solutions. Build up the reactivity order from the displacement matrix." },
        { href: "/fermentation", kicker: "Organic", title: "Fermentation",
          blurb: "Yeast + glucose → ethanol + CO₂ over 7 days. Then distil to concentrate the ethanol." },
        { href: "/bromine-water", kicker: "Organic", title: "Bromine Water Test",
          blurb: "Test six substances for unsaturation. Alkenes and unsaturated fats decolourise orange Br₂; alkanes don't." },
      ],
    },
    {
      name: "Physics",
      slug: "physics",
      labs: [
        { href: "/pendulum", kicker: "Mechanics", title: "Pendulum · g",
          blurb: "Time oscillations at several lengths. Plot T² vs L → slope gives gravity." },
        { href: "/hookes-law", kicker: "Mechanics", title: "Hooke's Law",
          blurb: "Hang masses one at a time. Plot F vs extension. Beyond the elastic limit the line bends." },
        { href: "/density-displacement", kicker: "Mechanics", title: "Density by Displacement",
          blurb: "Mass on a balance + volume from water rise. Identify the material from its density." },
        { href: "/friction-incline", kicker: "Mechanics", title: "Friction on an Incline",
          blurb: "Tilt the plank until the block just slides. μ = tan θ at the slipping angle." },
        { href: "/refraction", kicker: "Optics", title: "Refraction · Snell's Law",
          blurb: "Light through a glass block at varying angles. Plot sin i vs sin r → refractive index." },
        { href: "/lens-focal-length", kicker: "Optics", title: "Lens · Focal Length",
          blurb: "Bench, object, lens, screen. Find sharp images at five u-values. Calculate f from 1/u + 1/v = 1/f." },
        { href: "/plane-mirror", kicker: "Optics", title: "Plane Mirror",
          blurb: "Drag the incident ray. Confirm the angles of incidence and reflection are equal at five angles." },
        { href: "/specific-heat-capacity", kicker: "Thermal", title: "Specific Heat of Water",
          blurb: "Electric heater, water, thermometer. Calculate c from VIt = mcΔT and explain the inefficiency." },
        { href: "/boyles-law", kicker: "Thermal", title: "Boyle's Law",
          blurb: "Squeeze a sealed gas column. PV stays constant — and 1/V vs P is a straight line through the origin." },
        { href: "/ohms-law", kicker: "Electricity", title: "Ohm's Law",
          blurb: "Vary V across a 10 Ω resistor. Read I. Plot V vs I — gradient gives R." },
        { href: "/resistance-wire", kicker: "Electricity", title: "Resistance vs Length",
          blurb: "Slide a jockey along a constantan wire. R is proportional to L. Gradient gives Ω/m." },
        { href: "/electromagnet", kicker: "Electromagnetism", title: "Electromagnet",
          blurb: "Wrap an iron nail. Vary N and I. Count the paperclips you can pick up." },
        { href: "/resonance-tube", kicker: "Waves", title: "Resonance Tube",
          blurb: "Find loud resonance in an air column. Two resonances give λ → v = fλ → speed of sound." },
      ],
    },
    {
      name: "Maths",
      slug: "maths",
      labs: [
        { href: "/monte-carlo-pi", kicker: "Exploration", title: "Monte Carlo π",
          blurb: "Random points in a unit square. The fraction inside the quarter circle converges to π/4." },
        { href: "/galton-board", kicker: "Exploration", title: "Galton Board",
          blurb: "Beads bouncing through pegs build the Binomial → Normal distribution." },
      ],
    },
  ];

  return (
    <main
      className="min-h-screen w-full relative"
      style={{ backgroundColor: "#e8e4d8", color: "#1a1f2e", fontFamily: serif }}
    >
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(#1a1f2e 1px, transparent 1px), linear-gradient(90deg, #1a1f2e 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      <SiteHeader />

      <section className="relative">
        <div className="max-w-6xl mx-auto px-5 pt-12 pb-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10 items-end">
            <div className="md:col-span-7">
              <div
                className="text-[11px] uppercase text-stone-500 mb-3"
                style={{ fontFamily: mono, letterSpacing: "0.28em" }}
              >
                Lab library
              </div>
              <h1 className="text-4xl sm:text-5xl leading-tight mb-3" style={{ fontWeight: 500 }}>
                <span style={{ fontStyle: "italic" }}>Every</span> live practical
              </h1>
              <p className="text-sm sm:text-base opacity-75 max-w-xl leading-snug">
                Click any lab to open it. Each one is a self-contained 3D simulation — drag to rotate, sound is optional, no install. Observation wording is taken straight from NSSCO Annexe B and Cambridge mark schemes.
              </p>
            </div>
            <div className="md:col-span-5">
              <div className="relative overflow-hidden" style={{ aspectRatio: "16/10", border: "1px solid rgba(26,31,46,0.2)" }}>
                <img
                  src="/pics/lab-09.jpg"
                  alt="A rack of test tubes holding solutions of different colours under stage lighting"
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative pb-16">
        <div className="max-w-6xl mx-auto px-5">
          {subjects.map((subject) => (
            <div key={subject.name} className="mb-12">
              <div className="flex items-baseline justify-between mb-3 pb-1.5 border-b border-stone-900/15">
                <div
                  className="text-[11px] uppercase text-stone-500"
                  style={{ fontFamily: mono, letterSpacing: "0.28em" }}
                >
                  {subject.name} · {subject.labs.length} live
                </div>
                <Link
                  href={`/${subject.slug}`}
                  className="text-[10px] uppercase opacity-65 hover:opacity-100"
                  style={{ fontFamily: mono, letterSpacing: "0.22em" }}
                >
                  Full syllabus →
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {subject.labs.map((lab) => (
                  <Link
                    key={lab.href}
                    href={lab.href}
                    className="block p-5 transition active:scale-[0.99] hover:-translate-y-0.5"
                    style={{
                      backgroundColor: "rgba(26,31,46,0.04)",
                      border: "1px solid rgba(26,31,46,0.18)",
                    }}
                  >
                    <div
                      className="text-[10px] uppercase text-stone-500 mb-1"
                      style={{ fontFamily: mono, letterSpacing: "0.22em" }}
                    >
                      {lab.kicker}
                    </div>
                    <div className="text-lg leading-tight mb-2" style={{ fontWeight: 500 }}>
                      {lab.title}
                    </div>
                    <p className="text-xs opacity-70 leading-snug">{lab.blurb}</p>
                    <div
                      className="mt-4 text-[10px] uppercase"
                      style={{ fontFamily: mono, letterSpacing: "0.22em" }}
                    >
                      Enter →
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
