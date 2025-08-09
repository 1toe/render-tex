// Componente carrusel de ejemplos LaTeX; permite seleccionar expresiones rápidas.
"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";

interface ExampleCarouselProps {
  onExampleSelect: (latex: string) => void;
}

const examples = [ // Lista mínima de expresiones reutilizables
  { title: "Teorema de Pitágoras", latex: "a^2 + b^2 = c^2" },
  { title: "Fórmula cuadrática", latex: "x = \\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}" },
  { title: "Energía-masa de Einstein", latex: "E = mc^2" },
  { title: "Identidad de Euler", latex: "e^{i\\pi} + 1 = 0" },
  { title: "Ejemplo de integral", latex: "\\int_0^\\infty e^{-x^2} dx = \\frac{\\sqrt{\\pi}}{2}" },
  { title: "Sumatoria", latex: "\\sum_{n=1}^\\infty \\frac{1}{n^2} = \\frac{\\pi^2}{6}" },
];

export function ExampleCarousel({ onExampleSelect }: ExampleCarouselProps) {
  return (
    <div className="w-full" aria-labelledby="examples-heading" role="region">
  <h2 id="examples-heading" className="text-2xl font-semibold text-primary mb-4 text-center">Ejemplos LaTeX</h2>
      <Carousel
        opts={{
          align: "start",
          loop: false,
        }}
        className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl mx-auto"
      >
        <CarouselContent className="-ml-2 md:-ml-4" aria-live="polite">
          {examples.map((example, index) => (
            <CarouselItem key={index} className="pl-2 md:pl-4 basis-full sm:basis-1/2 md:basis-1/2 lg:basis-1/3 group" role="group" aria-roledescription="Ejemplo" aria-label={`${example.title}`}> 
              <div className="p-1 h-full">
                <Card className="shadow-md hover:shadow-xl transition-shadow duration-300 bg-card h-full flex flex-col">
                  <CardHeader className="pb-2 pt-4">
                    <CardTitle className="text-md font-medium text-primary truncate group-hover:text-accent transition-colors">
                      {example.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col items-center justify-between p-4 flex-grow">
                    <div className="w-full p-3 bg-background/70 rounded-md mb-4 overflow-x-auto" role="presentation">
                      <p className="text-sm text-center text-foreground whitespace-nowrap" aria-label="Ejemplo de código LaTeX">
                        {example.latex}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full min-h-[44px] border-primary text-primary hover:bg-primary/10 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background active:bg-primary/20"
                      onClick={() => onExampleSelect(example.latex)}
                      aria-label={`Usar ejemplo: ${example.title}`}
                    >
                      <Copy className="mr-2 h-4 w-4" aria-hidden="true" /> <span className="text-sm">Usar ejemplo</span>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
  <CarouselPrevious className="text-primary bg-card hover:bg-secondary/80 border-primary disabled:opacity-30 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background min-h-[44px] min-w-[44px]" aria-label="Ejemplos anteriores" />
  <CarouselNext className="text-primary bg-card hover:bg-secondary/80 border-primary disabled:opacity-30 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background min-h-[44px] min-w-[44px]" aria-label="Siguientes ejemplos" />
      </Carousel>
    </div>
  );
}
