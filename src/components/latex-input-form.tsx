"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Wand2 } from "lucide-react";
import { renderLatexAction } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import { useEffect, type Dispatch, type SetStateAction } from "react";
import type { CheckedState } from "@radix-ui/react-checkbox";

const latexFormSchema = z.object({ // Validación mínima del campo LaTeX
  latex: z.string().min(1, "La entrada LaTeX no puede estar vacía."),
});

type LatexFormValues = z.infer<typeof latexFormSchema>;

interface LatexInputFormProps {
  initialLatex: string;
  onRenderStart: () => void;
  onRenderSuccess: (url: string) => void;
  onRenderError: (message: string) => void;
  outputFormat: "png" | "jpg";
  setOutputFormat: Dispatch<SetStateAction<"png" | "jpg">>;
  withBorder: boolean;
  setWithBorder: Dispatch<SetStateAction<boolean>>;
  fontColor: "black" | "white";
  setFontColor: Dispatch<SetStateAction<"black" | "white">>;
  borderColor: "black" | "white";
  setBorderColor: Dispatch<SetStateAction<"black" | "white">>;
  isLoading: boolean;
}

export function LatexInputForm({
  initialLatex,
  onRenderStart,
  onRenderSuccess,
  onRenderError,
  outputFormat,
  setOutputFormat,
  withBorder,
  setWithBorder,
  fontColor,
  setFontColor,
  borderColor,
  setBorderColor,
  isLoading,
}: LatexInputFormProps) {
  const { toast } = useToast();
  const form = useForm<LatexFormValues>({ // Inicializa react-hook-form
    resolver: zodResolver(latexFormSchema),
    defaultValues: { latex: initialLatex || "" },
  });

  useEffect(() => {
    form.setValue("latex", initialLatex);
  }, [initialLatex, form]);

  async function onSubmit(data: LatexFormValues) { // Orquesta la acción server y feedback
    onRenderStart();
    try {
      const result = await renderLatexAction(data.latex, outputFormat, withBorder, fontColor, borderColor);
      if (result.imageUrl) {
        onRenderSuccess(result.imageUrl);
      } else if (result.error) {
        onRenderError(result.error);
        toast({
          variant: "destructive",
          title: "Error de renderizado",
          description: result.error,
        });
      }
    } catch (error) {
      const errorMsg = "Ocurrió un error inesperado al intentar renderizar.";
      onRenderError(errorMsg);
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMsg,
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-5 sm:p-6 bg-card rounded-lg shadow-md lg:shadow-lg">
        <FormField
          control={form.control}
          name="latex"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base sm:text-lg font-semibold text-primary flex items-center gap-2">Ingresa fórmula LaTeX</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="p.ej., E = mc^2"
                  aria-describedby="latex-help"
                  className="min-h-[140px] sm:min-h-[160px] text-sm sm:text-base bg-background border-border focus:ring-primary focus-visible:outline-none focus:border-primary resize-y"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormItem>
            <FormLabel className="text-sm sm:text-base font-medium text-primary">Formato de salida</FormLabel>
             <Select
              value={outputFormat}
              onValueChange={(value) => setOutputFormat(value as "png" | "jpg")}
            >
              <FormControl>
                <SelectTrigger className="bg-background border-border focus:ring-primary focus:border-primary">
                  <SelectValue placeholder="Selecciona formato" />
                </SelectTrigger>
              </FormControl>
              <SelectContent className="bg-popover border-border">
                <SelectItem value="png">PNG</SelectItem>
                <SelectItem value="jpg">JPG</SelectItem>
              </SelectContent>
            </Select>
          </FormItem>
          <FormItem>
            <FormLabel className="text-sm sm:text-base font-medium text-primary">Color de fuente</FormLabel>
             <Select
              value={fontColor}
              onValueChange={(value) => setFontColor(value as "black" | "white")}
            >
              <FormControl>
                <SelectTrigger className="bg-background border-border focus:ring-primary focus:border-primary">
                  <SelectValue placeholder="Selecciona color de fuente" />
                </SelectTrigger>
              </FormControl>
              <SelectContent className="bg-popover border-border">
                <SelectItem value="black">Negro</SelectItem>
                <SelectItem value="white">Blanco</SelectItem>
              </SelectContent>
            </Select>
          </FormItem>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
          <div className="flex items-center space-x-2 pt-2 sm:pt-0">
            <Checkbox
              id="withBorderCheckbox"
              checked={withBorder}
              onCheckedChange={(checked: CheckedState) => setWithBorder(checked === true)}
              className="border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
            />
            <Label htmlFor="withBorderCheckbox" className="text-sm font-medium text-primary cursor-pointer">
              Añadir borde al texto
            </Label>
          </div>
          <FormItem>
            <FormLabel className={`text-base font-medium ${!withBorder ? "text-muted-foreground" : "text-primary"}`}>Color del borde</FormLabel>
             <Select
              value={borderColor}
              onValueChange={(value) => setBorderColor(value as "black" | "white")}
              disabled={!withBorder}
            >
              <FormControl>
                <SelectTrigger disabled={!withBorder} className="bg-background border-border focus:ring-primary focus:border-primary disabled:opacity-70">
                  <SelectValue placeholder="Selecciona color del borde" />
                </SelectTrigger>
              </FormControl>
              <SelectContent className="bg-popover border-border">
                <SelectItem value="black">Negro</SelectItem>
                <SelectItem value="white">Blanco</SelectItem>
              </SelectContent>
            </Select>
          </FormItem>
        </div>

        <Button 
          type="submit" 
          className="w-full bg-accent hover:bg-accent/90 text-accent-foreground text-base sm:text-lg px-5 sm:px-6 py-3 h-auto font-semibold tracking-wide min-h-[44px]" 
          disabled={form.formState.isSubmitting || isLoading}
          aria-label="Renderizar fórmula LaTeX"
        >
          <Wand2 className="mr-2 h-5 w-5" />
          Renderizar
        </Button>
      </form>
    </Form>
  );
}
