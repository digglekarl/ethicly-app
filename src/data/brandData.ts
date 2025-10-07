export interface Brand {
    id: string;
    name: string;
    category: 'Clothing' | 'Tech' | 'Food and Drink' | 'Makeup' | 'Perfume' | 'Financial Services';
    subcategory?: 'Supermarkets' | 'Fast Food' | 'Cafes' | 'Alcohol';
    logo: string;
}

export const brands: Brand[] = [
    // Food & Drink
    { id: 'fd1', name: 'Tesco', category: 'Food and Drink', subcategory: 'Supermarkets', logo: 'https://logo.clearbit.com/tesco.com' },
    { id: 'fd2', name: 'Sainsbury\'s', category: 'Food and Drink', subcategory: 'Supermarkets', logo: 'https://logo.clearbit.com/sainsburys.co.uk' },
    { id: 'fd3', name: 'Asda', category: 'Food and Drink', subcategory: 'Supermarkets', logo: 'https://logo.clearbit.com/asda.com' },
    { id: 'fd4', name: 'Nestlé', category: 'Food and Drink', logo: 'https://logo.clearbit.com/nestle.com' },

    // Fast Food
    { id: 'fd7', name: 'McDonald\'s', category: 'Food and Drink', subcategory: 'Fast Food', logo: 'https://logo.clearbit.com/mcdonalds.com' },
    { id: 'fd8', name: 'Burger King', category: 'Food and Drink', subcategory: 'Fast Food', logo: 'https://logo.clearbit.com/burgerking.co.uk' },
    { id: 'fd9', name: 'KFC', category: 'Food and Drink', subcategory: 'Fast Food', logo: 'https://logo.clearbit.com/kfc.co.uk' },

    // Cafes
    { id: 'fd10', name: 'Starbucks', category: 'Food and Drink', subcategory: 'Cafes', logo: 'https://logo.clearbit.com/starbucks.com' },
    { id: 'fd11', name: 'Costa Coffee', category: 'Food and Drink', subcategory: 'Cafes', logo: 'https://logo.clearbit.com/costacoffee.com' },
    { id: 'fd12', name: 'Caffè Nero', category: 'Food and Drink', subcategory: 'Cafes', logo: 'https://logo.clearbit.com/caffenero.com' },

    // Alcohol
    { id: 'fd13', name: 'Diageo', category: 'Food and Drink', subcategory: 'Alcohol', logo: 'https://logo.clearbit.com/diageo.com' },
    { id: 'fd14', name: 'Heineken', category: 'Food and Drink', subcategory: 'Alcohol', logo: 'https://logo.clearbit.com/heineken.com' },
    { id: 'fd15', name: 'AB InBev', category: 'Food and Drink', subcategory: 'Alcohol', logo: 'https://logo.clearbit.com/abinbev.com' },

    // Clothing
    { id: 'c1', name: 'H&M', category: 'Clothing', logo: 'https://logo.clearbit.com/hm.com' },
    { id: 'c2', name: 'Zara', category: 'Clothing', logo: 'https://logo.clearbit.com/zara.com' },
    { id: 'c3', name: 'Nike', category: 'Clothing', logo: 'https://logo.clearbit.com/nike.com' },
    { id: 'c4', name: 'Shein', category: 'Clothing', logo: 'https://logo.clearbit.com/shein.com' },

    // Tech
    { id: 't1', name: 'Apple', category: 'Tech', logo: 'https://logo.clearbit.com/apple.com' },
    { id: 't2', name: 'Samsung', category: 'Tech', logo: 'https://logo.clearbit.com/samsung.com' },
    { id: 't3', name: 'Google', category: 'Tech', logo: 'https://logo.clearbit.com/google.com' },

    // Financial Services
    { id: 'fs1', name: 'Lloyds', category: 'Financial Services', logo: 'https://logo.clearbit.com/lloydsbank.com' },

    // Makeup
    { id: 'm1', name: 'Fenty Beauty', category: 'Makeup', logo: 'https://logo.clearbit.com/fentybeauty.com' },
    { id: 'm2', name: 'MAC Cosmetics', category: 'Makeup', logo: 'https://logo.clearbit.com/maccosmetics.com' },
    { id: 'm3', name: 'NARS Cosmetics', category: 'Makeup', logo: 'https://logo.clearbit.com/narscosmetics.com' },

    // Perfume
    { id: 'p1', name: 'Dior', category: 'Perfume', logo: 'https://logo.clearbit.com/dior.com' },
    { id: 'p2', name: 'Chanel', category: 'Perfume', logo: 'https://logo.clearbit.com/chanel.com' },
    { id: 'p3', name: 'Jo Malone', category: 'Perfume', logo: 'https://logo.clearbit.com/jomalone.co.uk' },
];

export const getBrandsByCategory = (category: string) => {
    return brands.filter(brand => brand.category === category);
};
