import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Languages, ArrowRightLeft, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const languages = [
  { code: 'en', name: 'English' },
  { code: 'te', name: 'Telugu' },
  { code: 'hi', name: 'Hindi' },
  { code: 'ta', name: 'Tamil' },
  { code: 'kn', name: 'Kannada' },
  { code: 'ml', name: 'Malayalam' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' },
  { code: 'zh', name: 'Chinese' },
  { code: 'ar', name: 'Arabic' },
  { code: 'ru', name: 'Russian' },
  { code: 'pt', name: 'Portuguese' },
];

const Translator = () => {
  const [sourceText, setSourceText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [sourceLang, setSourceLang] = useState("en");
  const [targetLang, setTargetLang] = useState("te");
  const [isTranslating, setIsTranslating] = useState(false);
  const { toast } = useToast();

  const translate = async () => {
    if (!sourceText.trim()) return;

    setIsTranslating(true);
    
    try {
      // Mock translation - in a real app, you'd use a translation service
      // For demonstration, we'll just show a placeholder
      await new Promise(resolve => setTimeout(resolve, 1000));
      setTranslatedText(`[Translated from ${languages.find(l => l.code === sourceLang)?.name} to ${languages.find(l => l.code === targetLang)?.name}]: ${sourceText}`);
      
      toast({
        title: "Translation completed",
        description: "Your text has been translated successfully",
      });
    } catch (error) {
      toast({
        title: "Translation failed",
        description: "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsTranslating(false);
    }
  };

  const swapLanguages = () => {
    setSourceLang(targetLang);
    setTargetLang(sourceLang);
    setSourceText(translatedText);
    setTranslatedText(sourceText);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "Text has been copied to your clipboard",
    });
  };

  return (
    <section className="py-20">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Language Translator
          </h2>
          <p className="text-xl text-muted-foreground">
            Translate your study materials to any language
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Languages className="w-5 h-5" />
              Universal Translator
            </CardTitle>
            <CardDescription>
              Translate text between any supported languages instantly
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Language Selection */}
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <label className="text-sm font-medium text-foreground mb-2 block">From</label>
                <Select value={sourceLang} onValueChange={setSourceLang}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map(lang => (
                      <SelectItem key={lang.code} value={lang.code}>
                        {lang.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <Button
                variant="outline"
                size="icon"
                onClick={swapLanguages}
                className="mt-6"
              >
                <ArrowRightLeft className="w-4 h-4" />
              </Button>
              
              <div className="flex-1">
                <label className="text-sm font-medium text-foreground mb-2 block">To</label>
                <Select value={targetLang} onValueChange={setTargetLang}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map(lang => (
                      <SelectItem key={lang.code} value={lang.code}>
                        {lang.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Translation Areas */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium text-foreground">Source Text</label>
                  {sourceText && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(sourceText)}
                    >
                      <Copy className="w-4 h-4 mr-1" />
                      Copy
                    </Button>
                  )}
                </div>
                <Textarea
                  placeholder="Enter text to translate..."
                  value={sourceText}
                  onChange={(e) => setSourceText(e.target.value)}
                  className="min-h-[200px]"
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium text-foreground">Translation</label>
                  {translatedText && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(translatedText)}
                    >
                      <Copy className="w-4 h-4 mr-1" />
                      Copy
                    </Button>
                  )}
                </div>
                <Textarea
                  placeholder="Translation will appear here..."
                  value={translatedText}
                  readOnly
                  className="min-h-[200px] bg-muted/50"
                />
              </div>
            </div>

            <Button 
              onClick={translate} 
              disabled={isTranslating || !sourceText.trim()}
              className="w-full"
            >
              {isTranslating ? "Translating..." : "Translate"}
            </Button>

            <div className="text-center text-sm text-muted-foreground">
              <p>
                <strong>Note:</strong> This is a demo translator. In a production app, 
                this would integrate with Google Translate, Microsoft Translator, or similar services.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default Translator;