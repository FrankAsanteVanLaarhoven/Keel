import type { Locale } from "./locale";

const refuse: Record<Locale, RegExp> = {
  en: /\b(the answer|correct option|which (one|option)|just tell me|give me the tick)\b/i,
  es: /\b(la respuesta|opci[oó]n correcta|dime la respuesta|cu[aá]l es la correcta)\b/i,
  fr: /\b(la r[eé]ponse|bonne option|dis-moi la r[eé]ponse|laquelle est correcte)\b/i,
  de: /\b(die antwort|richtige option|sag mir die l[oö]sung|welche ist richtig)\b/i,
  pt: /\b(a resposta|op[cç][aã]o correta|me diz a resposta|qual [eé] a correta)\b/i,
  zh: /答案|正确选项|告诉我选|哪一个对/,
  ja: /答え|正解|どれが正しい|教えて$/,
  ar: /الإجابة|الخيار الصحيح|قل لي الحل/,
};

const greet: Record<Locale, RegExp> = {
  en: /^(hi|hello|hey|help|good (morning|afternoon|evening))\b/i,
  es: /^(hola|ayuda|buenos d[ií]as|buenas)\b/i,
  fr: /^(bonjour|salut|aide|bonsoir)\b/i,
  de: /^(hallo|hi|hilfe|guten (tag|morgen))\b/i,
  pt: /^(ol[aá]|oi|ajuda|bom dia)\b/i,
  zh: /^(你好|您好|帮助)/,
  ja: /^(こんにちは|おはよう|助けて|はじめまして)/,
  ar: /^(مرحبا|مرحباً|السلام|مساعدة)/,
};

const thanks: Record<Locale, RegExp> = {
  en: /\b(thank you|thanks|that helps)\b/i,
  es: /\b(gracias|me ayuda)\b/i,
  fr: /\b(merci|ça aide)\b/i,
  de: /\b(danke|das hilft)\b/i,
  pt: /\b(obrigad[oa]|isso ajuda)\b/i,
  zh: /谢谢|有帮助/,
  ja: /ありがとう|助かった/,
  ar: /شكرًا|شكرا|هذا يفيد/,
};

export function fill(template: string, vars: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => vars[key] ?? "");
}

export function localReply(input: {
  locale: Locale;
  title: string;
  promise: string;
  how: string;
  message: string;
  greet: string;
  refuse: string;
  stay: string;
  thanks: string;
}): string {
  const message = input.message.trim();
  const vars = { title: input.title, promise: input.promise, how: input.how };
  if (!message || greet[input.locale].test(message)) return fill(input.greet, vars);
  if (thanks[input.locale].test(message)) return fill(input.thanks, vars);
  if (refuse[input.locale].test(message)) return fill(input.refuse, vars);
  return fill(input.stay, vars);
}
