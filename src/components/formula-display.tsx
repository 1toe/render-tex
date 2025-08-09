"use client";

import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ImageOff, ScanText } from "lucide-react";

interface FormulaDisplayProps {
  imageUrl: string | null;
  isLoading: boolean;
}

export function FormulaDisplay({ imageUrl, isLoading }: FormulaDisplayProps) { // Render condicional de la imagen o estados vacíos
  const renderContent = () => {
  if (isLoading) { // Estado de carga
      return <Skeleton role="status" aria-label="Cargando fórmula" className="h-[180px] sm:h-[240px] md:h-[300px] w-full rounded-md bg-muted animate-pulse" />;
    }

  if (!imageUrl) { // Aún no se ha renderizado nada
      return (
  <div className="flex flex-col items-center justify-center p-6 min-h-[180px] sm:min-h-[220px] text-center text-muted-foreground" role="status" aria-live="polite">
          <ScanText className="h-16 w-16 mb-4 opacity-70" />
       <p className="text-lg">La fórmula renderizada aparecerá aquí.</p>
       <p className="text-sm">Ingresa LaTeX arriba y haz clic en "Renderizar".</p>
        </div>
      );
    }

  return (
     <div className="relative w-full max-w-full overflow-auto rounded-md border border-border bg-white dark:bg-zinc-900 p-3 md:p-4" role="figure" aria-label="Salida LaTeX renderizada">
        <Image
          src={imageUrl}
       alt="Fórmula LaTeX renderizada"
    layout="intrinsic"
    width={1200}
    height={400}
    className="max-h-[420px] w-auto mx-auto"
          data-ai-hint="formula math"
          unoptimized={true}
          onError={(e) => {
             e.currentTarget.style.display = 'none';
             const parent = e.currentTarget.parentElement;
             if (parent) {
                const errorMsg = document.createElement('div');
                errorMsg.className = "flex flex-col items-center justify-center p-6 min-h-[200px] text-center text-destructive";
           errorMsg.innerHTML = `<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"48\" height=\"48\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"lucide lucide-image-off mb-2\"><path d=\"M10.44 10.44 2 19l3-3M13.47 13.47 22 5l-3 3\"/><path d=\"m21.08 21.08-2.54-2.54\"/><path d=\"M6.518 6.518A8.59 8.59 0 0 0 3.32 9.02\"/><path d=\"M20.68 14.98a8.59 8.59 0 0 0-2.54-2.54\"/><path d=\"M3 3 21 21\"/><circle cx=\"12\" cy=\"12\" r=\"10\"/></svg> <p>Error al cargar la imagen. La fórmula puede ser demasiado compleja para el servicio provisional.</p>`;
                if (!parent.querySelector('.text-destructive')) {
                    parent.appendChild(errorMsg);
                }
             }
          }}
        />
      </div>
    );
  };

  return (
    <Card className="w-full shadow-xl bg-card/90 backdrop-blur border-border/70" aria-live="polite">
      <CardHeader className="pb-3 sm:pb-4">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <CardTitle className="text-lg sm:text-xl font-semibold text-primary flex items-center gap-2 m-0">
      <span>Fórmula renderizada</span>
          </CardTitle>
          {imageUrl && (
            <Button
              variant="outline"
              size="sm"
              className="min-h-[40px] px-4 text-sm font-medium"
              onClick={() => {
                try {
                  if (!imageUrl) return;
                  const a = document.createElement('a');
                  a.href = imageUrl;
                  a.download = 'latex-formula.' + (imageUrl.startsWith('data:image/png') ? 'png' : 'jpg');
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                } catch (e) {
          console.error('Fallo al descargar', e);
                }
              }}
        aria-label="Descargar imagen de la fórmula"
            >
        Descargar
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-3 sm:p-5 flex justify-center items-center">
        {renderContent()}
      </CardContent>
    </Card>
  );
}
