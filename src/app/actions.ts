"use server";

import { mathjax } from 'mathjax-full/js/mathjax';
import { TeX } from 'mathjax-full/js/input/tex';
import { SVG } from 'mathjax-full/js/output/svg';
import { liteAdaptor } from 'mathjax-full/js/adaptors/liteAdaptor';
import { RegisterHTMLHandler } from 'mathjax-full/js/handlers/html';
import { AllPackages } from 'mathjax-full/js/input/tex/AllPackages';
import sharp from 'sharp';

const adaptor = liteAdaptor(); // Adaptador ligero para entorno server (sin DOM real)
RegisterHTMLHandler(adaptor);

const texInput = new TeX({ // Configuración de delimitadores y paquetes TeX
  packages: AllPackages.sort().join(', ').split(/, /),
  inlineMath: [['$', '$'], ['\\(', '\\)']],
  displayMath: [['$$', '$$'], ['\\[', '\\]']],
  processEscapes: true,
});
const svgOutput = new SVG({ fontCache: 'none' }); // Desactiva cache de fuentes para salida inline
const mathDocument = mathjax.document('', { InputJax: texInput, OutputJax: svgOutput });

const BORDER_STROKE_WIDTH = "2.5"; // Grosor aplicado cuando se activa el borde en las paths

export async function renderLatexAction(
  latexString: string,
  format: "png" | "jpg",
  withBorder: boolean,
  fontColor: "black" | "white",
  borderColor: "black" | "white"
): Promise<{ imageUrl?: string; error?: string }> {
  if (!latexString.trim()) {
    return { error: "La entrada LaTeX no puede estar vacía." };
  }

  try {
    const node = mathDocument.convert(latexString, {
      display: true,
      em: 16,
      ex: 8,
      containerWidth: 80 * 16,
    });

    let svgString = adaptor.innerHTML(node);
    if (!svgString || svgString.trim() === "") {
      return { error: "MathJax produjo un SVG vacío. Verifica la sintaxis LaTeX." };
    }

    let modifiedSvgString = svgString;

    const styleToAdd = `
      <defs>
        <style type="text/css">
          <![CDATA[
            .math-content {
              fill: ${fontColor} !important;
              ${withBorder ? `stroke: ${borderColor} !important; stroke-width: ${BORDER_STROKE_WIDTH} !important; stroke-linecap: round !important; stroke-linejoin: round !important;` : 'stroke: none !important; stroke-width: 0 !important;'}
            }
            .math-content * {
              fill: ${fontColor} !important;
              ${withBorder ? `stroke: ${borderColor} !important; stroke-width: ${BORDER_STROKE_WIDTH} !important; stroke-linecap: round !important; stroke-linejoin: round !important;` : 'stroke: none !important; stroke-width: 0 !important;'}
            }
          ]]>
        </style>
      </defs>
    `;

    modifiedSvgString = modifiedSvgString.replace(/<svg([^>]*)>/, `<svg$1>${styleToAdd}`);

    const gTagRegex = /(<g\s)([^>]*data-mml-node="math"[^>]*?)(\s*\/?>)/i;

    let replaced = false;
  modifiedSvgString = modifiedSvgString.replace(gTagRegex, (match, opening, attributes, closing) => { // Inyecta clase y estilos globales al nodo raíz
      replaced = true;
      let newAttributes = attributes.replace(/\s*fill="[^"]*"/gi, '');
      newAttributes = newAttributes.replace(/\s*stroke="[^"]*"/gi, '');
      newAttributes = newAttributes.replace(/\s*stroke-width="[^"]*"/gi, '');
      newAttributes = newAttributes.replace(/\s*class="[^"]*"/gi, '');

      newAttributes += ` class="math-content"`;
      newAttributes += ` fill="${fontColor}"`;

      if (withBorder) {
        newAttributes += ` stroke="${borderColor}" stroke-width="${BORDER_STROKE_WIDTH}" stroke-linecap="round" stroke-linejoin="round"`;
      } else {
        newAttributes += ` stroke="none" stroke-width="0"`;
      }

      return `${opening}${newAttributes.trim()}${closing}`;
    });

    const pathElementsRegex = /<path\s([^>]*?)>/gi;
    modifiedSvgString = modifiedSvgString.replace(pathElementsRegex, (match, attributes) => {
      let newAttributes = attributes.replace(/\s*fill="[^"]*"/gi, '');
      newAttributes = newAttributes.replace(/\s*stroke="[^"]*"/gi, '');
      newAttributes = newAttributes.replace(/\s*stroke-width="[^"]*"/gi, '');

      newAttributes += ` fill="${fontColor}"`;

      if (withBorder) {
        newAttributes += ` stroke="${borderColor}" stroke-width="${BORDER_STROKE_WIDTH}" stroke-linecap="round" stroke-linejoin="round"`;
      } else {
        newAttributes += ` stroke="none" stroke-width="0"`;
      }

      return `<path ${newAttributes.trim()}>`;
    });

    if (!replaced && svgString.includes("<g")) {
      console.warn("Modificación SVG: etiqueta principal <g data-mml-node='math'...> no encontrada o modificación fallida. Los colores/borde podrían no aplicarse correctamente.");
    } else if (!svgString.includes("<g")) {
      console.warn("Modificación SVG: No se encontró etiqueta <g> en la salida SVG. No se pueden aplicar colores/borde.");
    } else {
      console.log(`Modificación SVG exitosa. Aplicado: colorFuente=${fontColor}, conBorde=${withBorder}, colorBorde=${borderColor}`);
    }

    const finalSvgBufferInput = Buffer.from(modifiedSvgString);

    let processor = sharp(finalSvgBufferInput, { density: 300 });
    let mimeType: string;

    if (format === 'jpg') {
      if (fontColor === 'white' && (!withBorder || borderColor === 'white')) {
        processor = processor.flatten({ background: { r: 0, g: 0, b: 0 } });
      } else {
        processor = processor.flatten({ background: { r: 255, g: 255, b: 255 } });
      }
    }

    if (format === 'png') {
      processor = processor.png({ quality: 90 });
      mimeType = 'image/png';
    } else {
      processor = processor.jpeg({ quality: 90 });
      mimeType = 'image/jpeg';
    }

    const imageBuffer = await processor.toBuffer();
    const imageUrl = `data:${mimeType};base64,${imageBuffer.toString('base64')}`;

    return { imageUrl };

  } catch (e: any) {
    console.error("Error al renderizar LaTeX:", e);
    let errorMessage = "No se pudo renderizar LaTeX.";
    if (e.message) {
      errorMessage += ` Details: ${e.message}`;
    }
    if (e.toString && e.toString().includes('[MathJax]')) {
      errorMessage = `Error de parseo de MathJax: ${e.toString()}. Por favor verifica tu sintaxis LaTeX.`;
    }
    return { error: errorMessage };
  }
}
