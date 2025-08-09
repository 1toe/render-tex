"use client";

import { useState, type Dispatch, type SetStateAction } from "react";
import { LatexInputForm } from "@/components/latex-input-form";
import { ExampleCarousel } from "@/components/example-carousel";
import { FormulaDisplay } from "@/components/formula-display";
import { Sigma } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function HomePage() { // Página principal: composición de formulario + vista previa
  const [latexFromExample, setLatexFromExample] = useState<string>("");
  const [renderedImageUrl, setRenderedImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [outputFormat, setOutputFormat] = useState<"png" | "jpg">("png");
  const [withBorder, setWithBorder] = useState<boolean>(false);
  const [fontColor, setFontColor] = useState<"black" | "white">("black");
  const [borderColor, setBorderColor] = useState<"black" | "white">("black");

  const handleExampleSelect = (exampleLatex: string) => { // Carga ejemplo y limpia imagen previa
    setLatexFromExample(exampleLatex);
    setRenderedImageUrl(null); 
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-background via-background/60 to-background flex flex-col">
      <header className="w-full border-b border-border bg-card/70 backdrop-blur flex flex-col items-center px-4 py-6 sm:py-8">
        <div className="flex items-center gap-3 mb-3">
          <Sigma size={48} className="text-primary drop-shadow-sm" />
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-primary">RnDeR TeX</h1>
        </div>
        <p className="text-sm sm:text-base max-w-2xl text-center text-muted-foreground">
          Escribe, ajusta y listo.
        </p>
      </header>

      <main className="flex-1 w-full mx-auto max-w-6xl px-4 sm:px-6 md:px-8 py-6 sm:py-10 grid gap-8 lg:gap-10 xl:gap-12">
        {/* Layout responsive: formulario & resultado */}
        <section className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] items-start">
          {/* Columna izquierda: ejemplos + formulario */}
          <div className="space-y-6">
            <div className="rounded-lg border border-border bg-card shadow-sm p-4 sm:p-6">
              <h2 className="text-xl font-semibold mb-4 text-primary/90">Ejemplos Rápidos</h2>
              <ExampleCarousel onExampleSelect={handleExampleSelect} />
            </div>

            <div className="rounded-lg border border-border bg-card shadow-sm">
              {/* Sección colapsable de opciones inspirada en QuickLaTeX "Choose Options" */}
              <div className="p-0">
                <LatexInputForm
                  initialLatex={latexFromExample}
                  onRenderStart={() => {
                    setIsLoading(true);
                    setRenderedImageUrl(null);
                  }}
                  onRenderSuccess={(url) => {
                    setRenderedImageUrl(url);
                    setIsLoading(false);
                  }}
                  onRenderError={() => {
                    setIsLoading(false);
                    setRenderedImageUrl(null);
                  }}
                  outputFormat={outputFormat}
                  setOutputFormat={setOutputFormat as Dispatch<SetStateAction<"png" | "jpg">>}
                  withBorder={withBorder}
                  setWithBorder={setWithBorder}
                  fontColor={fontColor}
                  setFontColor={setFontColor as Dispatch<SetStateAction<"black" | "white">>}
                  borderColor={borderColor}
                  setBorderColor={setBorderColor as Dispatch<SetStateAction<"black" | "white">>}
                  isLoading={isLoading}
                />
              </div>
            </div>
          </div>

          {/* Columna derecha: resultado */}
            <div className="space-y-6 sticky top-4">
              <FormulaDisplay imageUrl={renderedImageUrl} isLoading={isLoading} />

            </div>
        </section>
      </main>
    </div>
  );
}
