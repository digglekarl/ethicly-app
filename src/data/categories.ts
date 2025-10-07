export interface Category {
  name: string;
  subcategories: string[];
}

export const categories: Category[] = [
  {
    name: "Food & Drink",
    subcategories: [
      "Juice", "Smoothies", "Tea", "Coffee", "Soft Drinks", "Water", 
      "Chocolate", "Biscuits", "Cereal", "Packaged Food", "Dairy", 
      "Ice Cream", "Alcohol", "Snacks", "Condiments & Sauces", 
      "Baby Food", "Frozen Food"
    ]
  },
  {
    name: "Household",
    subcategories: [
      "Furniture", "Home Décor", "Bedding & Linen", "Kitchenware", 
      "Bathroom Products", "Cleaning Products", "Household Essentials", 
      "Lighting", "Gardening & Outdoor", "DIY & Hardware", 
      "Storage & Organization", "Small Appliances", "Home Fragrance"
    ]
  },
  {
    name: "Personal Care & Beauty",
    subcategories: [
      "Skincare", "Cosmetics", "Haircare", "Fragrance", "Oral Care", 
      "Personal Hygiene", "Men's Grooming", "Luxury Beauty", 
      "Household & Personal Care"
    ]
  },
  {
    name: "Fashion & Apparel",
    subcategories: [
      "Women's Clothing", "Men's Clothing", "Kids' Clothing", 
      "Baby Clothing", "Lingerie", "Sleepwear", "Maternity Wear", 
      "Footwear", "Accessories", "Sportswear", "Workwear", 
      "Fast Fashion", "Discount Fashion"
    ]
  },
  {
    name: "Electronics & Tech",
    subcategories: [
      "Mobile Phones", "Computers & Laptops", "TV & Audio", "Gaming", 
      "Appliances", "Wearables", "Internet Services", "Software", 
      "AI Technology", "Semiconductors", "Enterprise Tech", "Streaming", 
      "Cybersecurity", "Biotechnology", "Aerospace & Automotive Tech", 
      "Infrastructure"
    ]
  },
  {
    name: "Supermarkets & Retail",
    subcategories: [
      "Supermarket", "Convenience Store", "Online Fashion", 
      "Department Store", "Electronics Retail", "Discount Retail"
    ]
  },
  {
    name: "Travel & Transport",
    subcategories: [
      "Accommodation", "Travel Booking", "Travel & Tourism", 
      "Tours & Experiences", "Car Hire & Transportation"
    ]
  },
  {
    name: "Finance & Insurance",
    subcategories: [
      "Banking", "Insurance", "Trading & Investments"
    ]
  },
  {
    name: "Energy & Utilities",
    subcategories: [
      "Oil & Gas", "Renewable Energy", "Electricity & Utilities"
    ]
  },
  {
    name: "Raw Materials & Industrial",
    subcategories: [
      "Mining", "Agriculture", "Machinery", "Manufacturing", "Various"
    ]
  },
  {
    name: "Property & Facilities",
    subcategories: [
      "Facilities Management", "Home Improvement Services"
    ]
  },
  {
    name: "Arts, Culture & Leisure",
    subcategories: [
      "Entertainment", "Books & Publishing", "Music & Instruments", 
      "Arts & Crafts"
    ]
  },
  {
    name: "E-commerce & Retail",
    subcategories: [
      "Online Marketplace", "Deals & Coupons"
    ]
  },
  {
    name: "Foodservice & Hospitality",
    subcategories: [
      "Fast Food", "Coffee Shop", "Travel & Accommodation", "Packaged Drinks"
    ]
  },
  {
    name: "Automotive",
    subcategories: [
      "Vehicles", "Parts & Accessories", "Electric Vehicles & Charging"
    ]
  }
];

export const getAllCategories = (): string[] => {
  return categories.map(category => category.name);
};

export const getSubcategories = (categoryName: string): string[] => {
  const category = categories.find(cat => cat.name === categoryName);
  return category ? category.subcategories : [];
};

export const getCategoryBySubcategory = (subcategoryName: string): string | null => {
  for (const category of categories) {
    if (category.subcategories.includes(subcategoryName)) {
      return category.name;
    }
  }
  return null;
};