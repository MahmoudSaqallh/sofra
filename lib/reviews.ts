export type DishReview = {
  name: string;
  initials: string;
  when: string;
  rating: number;
  text: string;
};

// Reviews and the 5→1 bar widths (relative to the largest bar) as drawn on the Figma dish page.
export const dishReviews: Record<string, { bars: number[]; items: DishReview[] }> = {
  "sufra-mixed-grill": {
    bars: [100, 18, 5, 2, 1],
    items: [
      {
        name: "سارة الغامدي",
        initials: "سغ",
        when: "قبل يومين",
        rating: 5,
        text: "الكباب طري جداً والأرز بالزعفران رائع. الكمية كافية لشخص جائع جداً، والتغليف أنيق ويحافظ على الحرارة.",
      },
      {
        name: "محمد العنزي",
        initials: "مع",
        when: "قبل أسبوع",
        rating: 5,
        text: "تجربة ممتازة كالعادة. أنصح بإضافة الحلوم المشوي، يكمّل الطبق بشكل جميل.",
      },
    ],
  },
};
