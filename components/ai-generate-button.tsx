"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

interface AiGenerateButtonProps {
  modelConfig: any;
  form: any;
  modelKey: string;
}

export function AiGenerateButton({
  modelConfig,
  form,
  modelKey,
}: AiGenerateButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [numberOfItems, setNumberOfItems] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const processStream = async (reader: ReadableStreamDefaultReader) => {
    const decoder = new TextDecoder();
    let fullResponse = "";
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      fullResponse += decoder.decode(value, { stream: true });
    }
    return fullResponse;
  };

  const handleAiGeneration = async (fullPrompt: string) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: fullPrompt }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        try {
          const errorData = JSON.parse(errorText);
          if (errorData.error && errorData.error.message) {
            throw new Error(errorData.error.message);
          }
        } catch (e) {
          throw new Error(`The server returned an error:\n${errorText}`);
        }
        throw new Error("An unknown error occurred during AI generation.");
      }

      if (!response.body) {
        throw new Error("The response body is empty.");
      }

      const reader = response.body.getReader();
      const completion = await processStream(reader);

      try {
        const match = completion.match(
          /```(?:json)?\s*([\s\S]*?)\s*```|([\s\S]*)/
        );
        if (!match) {
          throw new Error("No valid JSON object found in the AI response.");
        }
        const jsonString = match[1] || match[2];
        const jsonResponse = JSON.parse(jsonString);

        if (Array.isArray(jsonResponse)) {
          const creationPromises = jsonResponse.map((itemData) => {
            const augmentedData = { ...itemData };
            const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
            for (const key in augmentedData) {
              if (key.endsWith("_en")) {
                const baseKey = key.slice(0, -3);
                if (
                  augmentedData[key] !== null &&
                  augmentedData[key] !== undefined &&
                  !augmentedData[baseKey]
                ) {
                  augmentedData[baseKey] = augmentedData[key];
                }
              }
              // Filter many-to-many arrays
              const fieldCfg = modelConfig.fields[key];
              if (
                fieldCfg &&
                fieldCfg.ui_component === "manytomany_select" &&
                Array.isArray(augmentedData[key])
              ) {
                augmentedData[key] = augmentedData[key]
                  .map((v: any) => String(v))
                  .filter((v: string) => uuidRegex.test(v));
              }
            }
            return api.createModelItem(
              `/api/admin/models/${modelKey}/`,
              augmentedData
            );
          });
          await Promise.all(creationPromises);
          toast({
            title: "Success",
            description: `${jsonResponse.length} items have been created.`,
          });
          queryClient.invalidateQueries({ queryKey: ["modelItems", modelKey] });
          queryClient.invalidateQueries({ queryKey: ["adminConfig"] });
        } else {
          const augmentedData = { ...jsonResponse };
          const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
          for (const key in augmentedData) {
            if (key.endsWith("_en")) {
              const baseKey = key.slice(0, -3);
              if (
                augmentedData[key] !== null &&
                augmentedData[key] !== undefined &&
                !augmentedData[baseKey]
              ) {
                augmentedData[baseKey] = augmentedData[key];
              }
            }
            // Filter many-to-many arrays
            const fieldCfg = modelConfig.fields[key];
            if (
              fieldCfg &&
              fieldCfg.ui_component === "manytomany_select" &&
              Array.isArray(augmentedData[key])
            ) {
              augmentedData[key] = augmentedData[key]
                .map((v: any) => String(v))
                .filter((v: string) => uuidRegex.test(v));
            }
          }
          Object.keys(augmentedData).forEach((key) => {
            if (modelConfig.fields[key]) {
              const fieldCfg = modelConfig.fields[key];
              let val = augmentedData[key];
              if (
                fieldCfg.ui_component === "manytomany_select" &&
                Array.isArray(val)
              ) {
                val = val.map((v: any) => String(v));
              }
              form.setValue(key, val, {
                shouldValidate: true,
              });
            }
          });
          toast({
            title: "Success",
            description: "AI data has been populated in the form.",
          });
        }
        setIsOpen(false);
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "The AI response was not valid JSON. Please try again.";
        toast({
          variant: "info",
          title: "Error parsing AI response",
          description: (
            <div className="flex flex-col gap-2">
              <p>{errorMessage}</p>
              <p className="font-semibold">Raw AI Response:</p>
              <pre className="text-xs bg-muted p-2 rounded-md whitespace-pre-wrap font-mono">
                <code>{completion}</code>
              </pre>
            </div>
          ),
        });
        console.error(
          "AI response parsing error:",
          error,
          "Raw completion from AI:",
          completion
        );
      }
    } catch (err: any) {
      toast({
        variant: "info",
        title: "AI Generation Error",
        description: (
          <p>
            <code>{String(err.message)}</code>
          </p>
        ),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateClick = () => {
    const schema = Object.entries(modelConfig.fields)
      .filter(([, fieldConfig]: [string, any]) => fieldConfig.editable)
      .reduce((acc, [fieldName, fieldConfig]: [string, any]) => {
        acc[fieldName] = {
          type: fieldConfig.type,
          required: fieldConfig.required,
          verbose_name: fieldConfig.verbose_name,
          help_text: fieldConfig.help_text,
        };
        if (fieldConfig.choices) {
          acc[fieldName].choices = fieldConfig.choices.map((c: any) => c.value);
        }
        return acc;
      }, {} as Record<string, any>);

    const outputInstruction =
      numberOfItems > 1
        ? `You must return a JSON array containing ${numberOfItems} objects.`
        : "The output must be ONLY the raw JSON object. Do not add any commentary, greetings, or markdown syntax.";

    const fullPrompt = `
      You are a data generation assistant for a Django admin panel.
      Your task is to generate a complete JSON object based on a user's request and a provided model schema.
      The JSON object must be valid and should not be wrapped in markdown or any other text. Your output should be clean, raw JSON.

      User Request: "${prompt}"
      Number of items to generate: ${numberOfItems}

      Model: "${modelConfig.verbose_name}"

      Instructions:
      1. Analyze the user request.
      2. Look at the model schema below to understand the required fields, their types, and their languages.
      3. **Crucially, you must provide plausible values for ALL fields in the schema, especially for all language variations (e.g., fields ending in _en, _fr, _de).** If the user's prompt is in one language, you must translate and adapt the content for the other languages.
      4. ${outputInstruction}

      Example of a perfect response:
      {
        "field1": "value1",
        "field2_en": "english value",
        "field2_fr": "french value"
      }

      Model Schema (for your reference):
      ${JSON.stringify(schema, null, 2)}
    `;
    handleAiGeneration(fullPrompt);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Sparkles className="h-4 w-4 mr-2" />
          Generate with AI
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Generate with AI</DialogTitle>
          <DialogDescription>
            Describe the data you want to generate for this{" "}
            {modelConfig.verbose_name}. For example, "a new user named John Doe
            who is a developer".
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <Textarea
            placeholder="Enter your prompt here..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={4}
          />
          <div className="space-y-2">
            <Label htmlFor="numberOfItems">Number of Items (1-10)</Label>
            <Input
              id="numberOfItems"
              type="number"
              min="1"
              max="10"
              value={numberOfItems}
              onChange={(e) => setNumberOfItems(parseInt(e.target.value, 10))}
              className="w-24"
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            onClick={handleGenerateClick}
            disabled={isLoading || !prompt}
            className="w-full">
            {isLoading ? "Generating..." : "Generate"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
