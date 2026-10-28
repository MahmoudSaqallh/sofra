export type Testimonial = {
  id: string;
  quote: string;
  name: string;
  initials: string;
  context: string;
  rating: number;
};

export const testimonials: Testimonial[] = [
  {
    id: "abdullah",
    quote:
      "أفضل مشاوي جربتها في الرياض، والخدمة راقية جداً. القهوة الترحيبية والتمر لمسة جميلة تشعرك أنك في بيتك.",
    name: "عبدالله القحطاني",
    initials: "عق",
    context: "الرياض · عشاء عائلي",
    rating: 5,
  },
  {
    id: "reem",
    quote:
      "حجزنا لعيد ميلاد والدتي وكان كل شيء مثالي، من تزيين الطاولة إلى الكنافة التي قدموها هدية. شكراً سُفرة!",
    name: "ريم الشهري",
    initials: "رش",
    context: "جدة · مناسبة خاصة",
    rating: 5,
  },
  {
    id: "fahad",
    quote:
      "التطبيق سهل والتوصيل سريع، البرجر يصل ساخناً وكأنه من المطبخ مباشرة. أصبحت سُفرة خياري الأول للغداء.",
    name: "فهد الدوسري",
    initials: "فد",
    context: "الدمام · طلب توصيل",
    rating: 5,
  },
];
