export const PRODUCTS = [
  // 1. Mall Yoddha (Flagship 1kg Swarna Bhasma Formulation for Athletes & Wrestlers)
  {
    id: 'mall-yoddha',
    slug: 'mall-yoddha',
    name: 'Mall Yoddha (Swarna Bhasma)',
    hindiName: 'मल्ल योद्धा (स्वर्ण भस्म)',
    subtitle: 'Special Formulation for Wrestlers & Special Athletes',
    tagline: 'ताकत • सहनशक्ति • पुनर्निर्माण (Strength • Endurance • Recovery)',
    category: "Strength & Stamina",
    packageColor: '#C9A45C', // Gold on Black
    packageColorName: 'Matte Obsidian & 24K Gold',
    colorHex: '#C9A45C',
    image: '/images/products/mall-yoddha.jpg',
    price: 17999,
    originalPrice: 22499,
    rating: 5.0,
    reviewCount: 789,
    badge: 'Supreme Flagship',
    capsuleCount: 'Pure Shastriya Granules / Confection',
    strength: 'Net Wt. 1 kg',
    volume: 'Net Wt. 1 kg • Swarna Bhasma',
    dosha: 'Supreme Dhatu & Ojas Builder',
    description:
      'Mall Yoddha is the premier athletic Rasayana of Vagvat Ayurveda, specially formulated for wrestlers, bodybuilders, and elite athletes. Prepared with genuine Swarna Bhasma (purified gold calx) following authentic Shastra methods, it maximizes muscle power, accelerates rapid post-training recovery, and builds extraordinary endurance.',
    boxFeatures: [
      'मांसपेशियों की शक्ति बढ़ाए (Enhances Muscle Power)',
      'सहनशक्ति बढ़ाए (Boosts Physical Endurance)',
      'तेज रिकवरी में सहायक (Assists Rapid Recovery)',
      'स्टैमिना और स्टेमिना (Sustained Athletic Power)',
      '100% आयुर्वेदिक • कोई साइड इफेक्ट नहीं'
    ],
    highlights: [
      'Empowered with genuine 24K Swarna Bhasma for deep cellular revitalization',
      'Accelerates micro-tear muscle repair and prevents chronic athletic fatigue',
      'Promotes dense, lean muscle mass without synthetic hormones or steroids',
      'Zero side effects, 100% Ayush GMP certified classical formulation'
    ],
    keyIngredients: [
      {
        name: 'Swarna Bhasma',
        botanical: 'Purified Gold Calx (Classical)',
        role: 'Penetrates deepest Shukra & Ojas dhatus, boosting stamina and immune power'
      },
      {
        name: 'Shuddha Shilajit',
        botanical: 'Asphaltum punjabianum',
        role: 'Delivers 84+ minerals directly to muscle mitochondria for ATP synthesis'
      },
      {
        name: 'Ashwagandha Extract',
        botanical: 'Withania somnifera',
        role: 'Regulates cortisol and amplifies muscle strength and resistance'
      },
      {
        name: 'Safed Musli & Shatavari',
        botanical: 'Chlorophytum borivilianum & Asparagus racemosus',
        role: 'Natural anabolic herbs that build tissue bulk and nourish joint cartilage'
      }
    ],
    usage: 'Take 1 to 2 scoops (approx. 10-15g) twice daily with 250ml warm milk after workout or before bedtime.',
    inStock: true
  },

  // 2. Vajra Shakti Premium (Swarna Bhasma)
  {
    id: 'vajra-shakti-premium',
    slug: 'vajra-shakti-premium',
    name: 'Vajra Shakti Premium',
    hindiName: 'वज्र शक्ति प्रीमियम',
    subtitle: 'शास्त्र विधि द्वारा तैयार स्वर्ण भस्म का योग',
    tagline: 'शक्ति • स्टैमिना • ऊर्जा (Strength • Stamina • Vitality)',
    category: "Strength & Stamina",
    packageColor: '#C9A45C', // Royal Gold
    packageColorName: 'Imperial Gold & Black',
    colorHex: '#C9A45C',
    image: '/images/products/vajra-shakti-premium.jpg',
    price: 11999,
    originalPrice: 14999,
    rating: 5.0,
    reviewCount: 512,
    badge: 'Gold Bhasma',
    capsuleCount: '60 Capsules',
    strength: 'Swarna Bhasma Yukta',
    volume: '60 Capsules • Swarna Bhasma',
    dosha: 'Tridoshic Rasayana & Ojas Enhancer',
    description:
      'Vajra Shakti Premium features genuine Swarna Bhasma (purified 24K gold calx) prepared strictly according to classical Shastra methods. It amplifies endurance, ignites physical vitality, and nourishes the deepest vital essence (Ojas).',
    boxFeatures: [
      'शास्त्र विधि द्वारा तैयार स्वर्ण भस्म का योग',
      'शक्ति • स्टैमिना • ऊर्जा (Peak Endurance)',
      'Supreme Ojas & Cellular Vitality Rejuvenation'
    ],
    highlights: [
      'Enriched with classical Swarna Bhasma for cellular regeneration',
      'Restores peak male stamina, athletic endurance, and muscle power',
      'Dispels deep-seated physical fatigue and nervous exhaustion',
      'Enhances natural testosterone and vital reproductive essence'
    ],
    keyIngredients: [
      {
        name: 'Swarna Bhasma',
        botanical: 'Purified Gold Calx (Classical)',
        role: 'Ultimate Rasayana; penetrates deep tissue dhatus, boosting Ojas and immunity'
      },
      {
        name: 'Shuddha Shilajit',
        botanical: 'Asphaltum punjabianum',
        role: 'Rich in 84+ minerals & fulvic acid, maximizes cellular ATP energy'
      },
      {
        name: 'Nagori Ashwagandha',
        botanical: 'Withania somnifera',
        role: 'Adapts body to high physical stress and enhances muscle stamina'
      },
      {
        name: 'Safed Musli',
        botanical: 'Chlorophytum borivilianum',
        role: 'Natural anabolic restorative for strength and reproductive vigor'
      }
    ],
    usage: 'Take 1 capsule twice daily with warm full-cream milk or lukewarm water, ideally 1 hour after meals.',
    inStock: true
  },

  // 3. Shilajit Pure Himalayan Resin (20 g)
  {
    id: 'shilajit-resin',
    slug: 'shilajit-resin',
    name: 'Shilajit Pure Himalayan Resin',
    hindiName: 'शुद्ध हिमालयन शिलाजीत',
    subtitle: 'Pure Himalayan Resin (Grade A Gold Tier)',
    tagline: '100% Raw High-Altitude Himalayan Exudate',
    category: "Strength & Stamina",
    packageColor: '#B8860B',
    packageColorName: 'Himalayan Black Gold',
    colorHex: '#B8860B',
    image: '/images/products/shilajit-resin.jpg',
    price: 1799,
    originalPrice: 2299,
    rating: 4.9,
    reviewCount: 684,
    badge: '100% Pure Resin',
    capsuleCount: 'Pure Semi-Liquid Resin',
    strength: '20 g Net Wt.',
    volume: '20 g Pure Gold Resin',
    dosha: 'Universal Rasayana (Vata-Kapha Pacifying)',
    description:
      'Harvested at elevations above 16,000 feet in the pristine Himalayas. Purified through classical Surya Tapi (sun-curing) and Shodhana techniques. Rich in 85+ bio-available trace minerals and over 75% natural fulvic acid to revitalize physical and mental performance.',
    boxFeatures: [
      'Pure Himalayan Sun-Dried Resin (20 g)',
      '>75% Organic Fulvic Acid & 85+ Ionic Minerals',
      'Lab Certified Heavy Metal Free'
    ],
    highlights: [
      'Boosts cellular mitochondrial ATP production for sustained daily stamina',
      'Amplifies nutrient and herbal absorption across cell membranes',
      'Combats brain fog and accelerates post-workout recovery',
      'Free from chemical solvents, sugars, or thickeners'
    ],
    keyIngredients: [
      {
        name: 'Himalayan Shilajit Resin',
        botanical: 'Asphaltum punjabianum',
        role: 'Rich in fulvic acid, humic acid, and ionic minerals'
      }
    ],
    usage: 'Dissolve a pea-sized portion (300-500 mg) in a glass of warm milk, green tea, or lukewarm water. Drink once or twice daily.',
    inStock: true
  },

  // 4. Shilajit Gold Resin Capsules (8 Powerful Herbs)
  {
    id: 'shilajit-capsules',
    slug: 'shilajit-capsules',
    name: 'Shilajit Pure Gold Resin (8 Herbs)',
    hindiName: 'शिलाजीत 8 हर्ब्स कैप्सूल',
    subtitle: 'Pure Gold Resin with 8 Powerful Herbs',
    tagline: 'Traditional Akhada Vigor & Stamina',
    category: "Strength & Stamina",
    packageColor: '#1A1A1A',
    packageColorName: 'Matte Obsidian & Gold',
    colorHex: '#1A1A1A',
    image: '/images/products/shilajit-capsules.jpg',
    price: 3599,
    originalPrice: 4499,
    rating: 4.9,
    reviewCount: 420,
    badge: '8 Herbs Matrix',
    capsuleCount: '60 Capsules',
    strength: '8 Powerful Herbs Complex',
    volume: '60 Capsules • Gold Resin',
    dosha: 'Kapha & Vata Balancer',
    description:
      'Formulated with 8 potent Ayurvedic Rasayana herbs including pure Himalayan Shilajit gold resin, Gokshura, Kaunch Beej, Akarkara, and Safed Musli. Designed for effortless daily intake, supporting robust vitality, endurance, and physical vigor.',
    boxFeatures: [
      'Pure Gold Resin with 8 Powerful Herbs',
      '60 Vegetarian Capsules for Daily Vigor',
      'Tested for Purity and Bio-Availability'
    ],
    highlights: [
      'Synergistic 8-herb matrix for sustained muscular energy',
      'Convenient capsule format preserving full resin potency',
      'Supports healthy testosterone levels and reproductive stamina',
      'Enhances physical resilience against intense athletic strain'
    ],
    keyIngredients: [
      {
        name: 'Pure Shilajit Resin Extract',
        botanical: 'Asphaltum punjabianum',
        role: 'Bio-energizer that replenishes cellular vitality'
      },
      {
        name: 'Gokshura',
        botanical: 'Tribulus terrestris',
        role: 'Promotes muscle recovery and healthy hormonal output'
      },
      {
        name: 'Kaunch Beej',
        botanical: 'Mucuna pruriens',
        role: 'Natural source of L-dopa, supports stamina and nerve health'
      },
      {
        name: 'Akarkara',
        botanical: 'Anacyclus pyrethrum',
        role: 'Classical stimulant that sparks energy and blood circulation'
      }
    ],
    usage: 'Take 1 to 2 capsules twice daily with warm milk or water after meals.',
    inStock: true
  },

  // 5. Vajra Shakti (Warrior Edition)
  {
    id: 'vajra-shakti',
    slug: 'vajra-shakti',
    name: 'Vajra Shakti',
    hindiName: 'वज्र शक्ति',
    subtitle: 'शक्ति • स्टैमिना • ऊर्जा',
    tagline: 'Classical Strength & Stamina Restorative',
    category: "Strength & Stamina",
    packageColor: '#2B2B2B',
    packageColorName: 'Warrior Black & Gold',
    colorHex: '#2B2B2B',
    image: '/images/products/vajra-shakti.jpg',
    price: 8550,
    originalPrice: 10699,
    rating: 4.8,
    reviewCount: 395,
    badge: 'Power Formulation',
    capsuleCount: '60 Capsules',
    strength: '500 mg.',
    volume: '60 Capsules • 500 mg',
    dosha: 'Vata-Pitta Pacifier',
    description:
      'Vajra Shakti ("शक्ति • स्टैमिना • ऊर्जा") is formulated to combat chronic fatigue, restore muscle power, and revitalize stamina. Blended with time-tested Ayurvedic adaptogens that nourish the saptadhatus (seven vital tissues) for sustained daily endurance.',
    boxFeatures: [
      'शक्ति • स्टैमिना • ऊर्जा (Strength & Stamina)',
      'Combats Daily Fatigue & Stress',
      '100% Ayurvedic Herbal Actives'
    ],
    highlights: [
      'Recharges depleted stamina and physical vitality',
      'Supports lean muscle tone and stamina during demanding tasks',
      'Reduces mental fatigue and morning lethargy',
      'Safe for continuous long-term rejuvenation'
    ],
    keyIngredients: [
      {
        name: 'Ashwagandha',
        botanical: 'Withania somnifera',
        role: 'Deep strength builder and nervous system restorative'
      },
      {
        name: 'Shatavari Root',
        botanical: 'Asparagus racemosus',
        role: 'Nourishes vital fluids and balances internal heat'
      },
      {
        name: 'Vidarikand',
        botanical: 'Pueraria tuberosa',
        role: 'Bulking and rejuvenating tonic that restores vitality'
      },
      {
        name: 'Jaiphal & Javitri',
        botanical: 'Myristica fragrans',
        role: 'Aromatic herbs that improve absorption and blood circulation'
      }
    ],
    usage: 'Take 1 to 2 capsules twice daily with warm milk or lukewarm water after meals.',
    inStock: true
  },

  // 6. Kosht Sudha (IBS Management & Digestion)
  {
    id: 'kosht-sudha',
    slug: 'kosht-sudha',
    name: 'Kosht Sudha',
    hindiName: 'कोष्ठ सुधा',
    subtitle: 'Supports IBS Management • Gas • Bloating',
    tagline: 'आवश्यक पाचन तंत्र का प्राकृतिक साथी',
    category: 'Digestive Wellness',
    packageColor: '#5C90A8',
    packageColorName: 'Sky Blue & Earth Brown',
    colorHex: '#5C90A8',
    image: '/images/products/kosht-sudha.jpg',
    price: 549,
    originalPrice: 699,
    rating: 4.9,
    reviewCount: 512,
    badge: 'IBS Specialist',
    capsuleCount: '60 Capsules',
    strength: '1000 mg.',
    volume: '60 Capsules • 1000 mg',
    dosha: 'Samana & Apana Vata Harmonizer',
    description:
      'Kosht Sudha ("आवश्यक पाचन तंत्र का प्राकृतिक साथी") is formulated specifically to support IBS (Irritable Bowel Syndrome) management, relieve persistent gas, bloating, irregular bowel habits, and abdominal discomfort. It gently normalizes gut motility, clears toxic metabolic sludge (Ama), and restores calm intestinal equilibrium.',
    boxFeatures: [
      'Supports IBS Management',
      'Relieves Gas • Bloating • Abdominal Discomfort',
      'Balances Irregular Bowel Habits Naturally',
      'आवश्यक पाचन तंत्र का प्राकृतिक साथी'
    ],
    highlights: [
      'Targets irritable bowel symptoms and chronic abdominal cramping',
      'Eliminates trapped intestinal gas and persistent bloating',
      'Restores regular, predictable daily bowel motility',
      'Gentle, non-habit forming formula that protects the microbiome'
    ],
    keyIngredients: [
      {
        name: 'Kutaja Bark',
        botanical: 'Holarrhena antidysenterica',
        role: 'Prime Ayurvedic herb for IBS, diarrhea, and intestinal mucosal repair'
      },
      {
        name: 'Bilwa (Bael Fruit)',
        botanical: 'Aegle marmelos',
        role: 'Soothes irritated gut lining and binds loose stools while aiding digestion'
      },
      {
        name: 'Haritaki',
        botanical: 'Terminalia chebula',
        role: 'Clears toxic accumulated Ama from colon folds without harsh griping'
      },
      {
        name: 'Saunf & Ajwain',
        botanical: 'Foeniculum vulgare & Trachyspermum ammi',
        role: 'Carminative herbs that instantly expel gas and ease abdominal spasms'
      }
    ],
    usage: 'Take 1 to 2 capsules twice daily with lukewarm water before or after meals.',
    inStock: true
  },

  // 7. Yonidhara (Leucorrhea Care)
  {
    id: 'yonidhara',
    slug: 'yonidhara',
    name: 'Yonidhara',
    hindiName: 'योनिधारा',
    subtitle: 'For Leucorrhea & White Discharge',
    tagline: "Ayurvedic Women's Wellness Formulation",
    category: "Women's Wellness",
    packageColor: '#A02070',
    packageColorName: 'Magenta & Ivory',
    colorHex: '#A02070',
    image: '/images/products/yonidhara.jpg',
    price: 899,
    originalPrice: 1199,
    rating: 4.9,
    reviewCount: 342,
    badge: 'Women’s Choice',
    capsuleCount: '60 Capsules',
    strength: '1000 mg.',
    volume: '60 Capsules • 1000 mg',
    dosha: 'Pitta & Kapha Balancer',
    description:
      'Yonidhara is a dedicated Ayurvedic formulation specifically targeted for leucorrhea and white discharge. Formulated with classical astringent, purifying, and nourishing botanicals that support female reproductive health, restore natural physiological pH, and balance doshas naturally.',
    boxFeatures: [
      'Helps in Leucorrhea & Excessive Discharge',
      'Supports Reproductive Health & Mucosal Tone',
      'Balances Doshas Naturally'
    ],
    highlights: [
      'Specifically formulated for leucorrhea and white discharge relief',
      'Restores intimate mucosal resilience and healthy biological flora',
      'Soothes pelvic inflammation, itching, and cyclical discomfort',
      '100% Ayurvedic, chemical-free vegetarian capsules'
    ],
    keyIngredients: [
      {
        name: 'Lodhra Bark',
        botanical: 'Symplocos racemosa',
        role: 'Primary Kashaya (astringent) herb that arrests excessive vaginal secretions'
      },
      {
        name: 'Daruharidra',
        botanical: 'Berberis aristata',
        role: 'Natural antimicrobial that purifies the reproductive tract'
      },
      {
        name: 'Shatavari',
        botanical: 'Asparagus racemosus',
        role: 'Nourishes female reproductive tissues and replenishes vital Ojas'
      },
      {
        name: 'Sphatika Bhasma',
        botanical: 'Purified Alum Calx',
        role: 'Classical barrier strengthening agent and styptic'
      }
    ],
    usage: 'Take 1 to 2 capsules twice daily with lukewarm water or milk after meals.',
    inStock: true
  },

  // 8. Nari Santulan (Hormonal Balance)
  {
    id: 'nari-santulan',
    slug: 'nari-santulan',
    name: 'Nari Santulan',
    hindiName: 'नारी संतुलन',
    subtitle: 'Helps in Hormonal Balance & Irregular Periods',
    tagline: 'प्राकृतिक संतुलन, स्वस्थ नारी जीवन',
    category: "Women's Wellness",
    packageColor: '#E06522',
    packageColorName: 'Saffron Orange & Ivory',
    colorHex: '#E06522',
    image: '/images/products/nari-santulan.jpg',
    price: 749,
    originalPrice: 999,
    rating: 4.8,
    reviewCount: 289,
    badge: 'Physician Recommended',
    capsuleCount: '60 Capsules',
    strength: '100 mg.',
    volume: '60 Capsules • 100 mg',
    dosha: 'Tridoshic (Vata-Pitta Pacifying)',
    description:
      'Nari Santulan ("प्राकृतिक संतुलन, स्वस्थ नारी जीवन") is meticulously formulated to bring equilibrium to women’s hormonal cycles. It provides comprehensive care for irregular menstrual periods, supports uterine health, and dispels cyclical exhaustion and cramps.',
    boxFeatures: [
      'Helps in Hormonal Balance',
      'Helpful in Irregular Periods',
      'Supports Uterine Health'
    ],
    highlights: [
      'Promotes predictable, rhythmic menstrual cycles',
      'Relieves painful spasmodic cramps and lower abdominal tension',
      'Harmonizes estrogen-progesterone balance naturally',
      'Revitalizes daily feminine energy and mental tranquility'
    ],
    keyIngredients: [
      {
        name: 'Ashoka Bark',
        botanical: 'Saraca asoca',
        role: 'The premier uterine restorative that regulates flow and tones uterine muscles'
      },
      {
        name: 'Dashmool',
        botanical: 'Ten Classical Roots',
        role: 'Pacifies aggravated Apana Vata to eliminate cramps and spasms'
      },
      {
        name: 'Lodhra',
        botanical: 'Symplocos racemosa',
        role: 'Balances ovarian hormones and supports uterine endometrial health'
      },
      {
        name: 'Kashmiri Kesar',
        botanical: 'Crocus sativus',
        role: 'Uplifts mood, eases PMS mood fluctuations, and imparts inner glow'
      }
    ],
    usage: 'Take 1 to 2 capsules twice daily with lukewarm water after meals.',
    inStock: true
  },

  // 9. Swas Amrit (Respiratory Health)
  {
    id: 'swas-amrit',
    slug: 'swas-amrit',
    name: 'Swas Amrit',
    hindiName: 'श्वास अमृत',
    subtitle: 'For Healthy Lungs & Better Breathing',
    tagline: 'Ayurvedic Formulation for Respiratory Wellness',
    category: 'Respiratory Health',
    packageColor: '#1B365D',
    packageColorName: 'Deep Indigo Navy',
    colorHex: '#1B365D',
    image: '/images/products/swas-amrit.jpg',
    price: 599,
    originalPrice: 799,
    rating: 4.9,
    reviewCount: 418,
    badge: 'Fast Acting',
    capsuleCount: '60 Capsules',
    strength: '200 mg.',
    volume: '60 Capsules • 200 mg',
    dosha: 'Kapha & Vata Pacifying',
    description:
      'Swas Amrit is a dedicated Ayurvedic respiratory formulation engineered to support lung health, improve respiration, and ensure effortless, unobstructed breathing. It strengthens bronchial defenses against environmental pollution, seasonal allergens, and chronic cough.',
    boxFeatures: [
      'Supports Lung Health',
      'Improves Respiration',
      'Natural & Safe'
    ],
    highlights: [
      'Relieves bronchial congestion and liquefies stubborn mucus',
      'Enhances oxygen uptake and lung vital capacity naturally',
      'Safe, non-drowsy formulation with zero sedative side effects',
      'Shields respiratory mucosa from seasonal smog and airborne irritants'
    ],
    keyIngredients: [
      {
        name: 'Vasa (Adhatoda)',
        botanical: 'Justicia adhatoda',
        role: 'Potent natural bronchodilator that relaxes contracted bronchial pathways'
      },
      {
        name: 'Kantakari',
        botanical: 'Solanum virginianum',
        role: 'Expels deep-seated Kapha phlegm and eases chest tightness'
      },
      {
        name: 'Pippali',
        botanical: 'Piper longum',
        role: 'Rasayana rejuvenator for respiratory tissues, enhances bio-potency'
      },
      {
        name: 'Yashtimadhu',
        botanical: 'Glycyrrhiza glabra',
        role: 'Soothes inflamed throat tissue and dry mucosal scratchiness'
      }
    ],
    usage: 'Take 1 to 2 capsules twice daily with lukewarm water or honey.',
    inStock: true
  },

  // 10. Madhuraksha (Sugar Control)
  {
    id: 'madhuraksha',
    slug: 'madhuraksha',
    name: 'Madhuraksha (Mudhu Raksha)',
    hindiName: 'मधुरक्षा',
    subtitle: 'शुगर नियंत्रण के लिए • Ayurvedic Diabetes Support',
    tagline: 'आयुर्वेदिक मधुमेह सहायक योग',
    category: 'Metabolic Wellness',
    packageColor: '#1F5E3B',
    packageColorName: 'Emerald Herbal Green',
    colorHex: '#1F5E3B',
    image: '/images/products/madhuraksha.jpg',
    price: 699,
    originalPrice: 899,
    rating: 4.7,
    reviewCount: 265,
    badge: 'Clinical Favorite',
    capsuleCount: '60 Capsules',
    strength: '100 mg.',
    volume: '60 Capsules • 100 mg',
    dosha: 'Kapha-Pitta Balancing',
    description:
      'Madhuraksha (Mudhu Raksha - "आयुर्वेदिक मधुमेह सहायक योग") is a potent Ayurvedic formulation specifically crafted for blood sugar regulation. It helps regulate blood sugar levels, supports healthy pancreatic endocrine function, and revitalizes daily stamina and energy.',
    boxFeatures: [
      'Helps Regulate Blood Sugar Levels',
      'Supports Pancreatic Function',
      'Boosts Energy & Vitality'
    ],
    highlights: [
      'Assists in maintaining healthy fasting and post-prandial glucose levels',
      'Rejuvenates insulin-producing pancreatic beta cells with natural phytosterols',
      'Diminishes stubborn sugar and carbohydrate cravings',
      'Fights diabetic lethargy, fatigue, and frequent urination'
    ],
    keyIngredients: [
      {
        name: 'Gudmar',
        botanical: 'Gymnema sylvestre',
        role: 'The classical "sugar destroyer", blocks intestinal glucose absorption'
      },
      {
        name: 'Jamun Seed Extract',
        botanical: 'Syzygium cumini',
        role: 'Contains jamboline which slows down conversion of starch to sugar'
      },
      {
        name: 'Vijaysar',
        botanical: 'Pterocarpus marsupium',
        role: 'Classical Rasayana that revitalizes pancreatic tissue cells'
      },
      {
        name: 'Karela (Bitter Gourd)',
        botanical: 'Momordica charantia',
        role: 'Contains charantin, functioning as a gentle botanical insulin mimetic'
      }
    ],
    usage: 'Take 1 to 2 capsules twice daily, 30-45 minutes before meals with lukewarm water.',
    inStock: true
  },

  // 11. Akshire Jigar (Liver Support)
  {
    id: 'akshire-jigar',
    slug: 'akshire-jigar',
    name: 'Akshire Jigar',
    hindiName: 'अक्सीरे जिगर',
    subtitle: 'Premium Ayurvedic Liver Support',
    tagline: 'Deep Hepatic Detox & Vitality Formulation',
    category: 'Liver & Digestion',
    packageColor: '#204B78',
    packageColorName: 'Royal Blue & White',
    colorHex: '#204B78',
    image: '/images/products/akshire-jigar.jpg',
    price: 649,
    originalPrice: 849,
    rating: 4.9,
    reviewCount: 380,
    badge: 'Doctor Endorsed',
    capsuleCount: '60 Capsules',
    strength: '500 mg.',
    volume: '60 Capsules • 500 mg',
    dosha: 'Pitta Pacifier & Agni Stimulator',
    description:
      'Akshire Jigar is a premium Ayurvedic formulation engineered to provide comprehensive liver support. It protects and detoxifies hepatic cells, optimizes bile secretion for healthy fat breakdown, stimulates digestive fire (Agni), and helps normalize elevated liver enzymes.',
    boxFeatures: [
      'Premium Ayurvedic Liver Support',
      'Flushes Hepatic Toxins & Sluggish Bile',
      'Restores Healthy Appetite & Digestion'
    ],
    highlights: [
      'Promotes cellular regeneration of hepatic parenchymal tissue',
      'Optimizes healthy bile production and lipid metabolism',
      'Assists in normalizing SGOT, SGPT, and bilirubin parameters',
      'Relieves morning heaviness, loss of appetite, and post-meal sluggishness'
    ],
    keyIngredients: [
      {
        name: 'Kalmegh',
        botanical: 'Andrographis paniculata',
        role: 'King of bitter hepatoprotectives, clears toxic metabolic build-up'
      },
      {
        name: 'Bhumi Amla',
        botanical: 'Phyllanthus niruri',
        role: 'Protects liver cells from oxidative stress and improves enzyme balance'
      },
      {
        name: 'Punarnava',
        botanical: 'Boerhavia diffusa',
        role: 'Flushes metabolic waste and resolves fluid retention in the liver'
      },
      {
        name: 'Kasani (Chicory)',
        botanical: 'Cichorium intybus',
        role: 'Clears sluggish biliary pathways and stimulates digestive secretion'
      }
    ],
    usage: 'Take 1 to 2 capsules twice daily after meals with lukewarm water.',
    inStock: true
  }
];

export const INGREDIENTS_SHOWCASE = [
  {
    name: 'Swarna Bhasma',
    sanskrit: 'स्वर्ण भस्म (Pure 24K Gold Calx)',
    benefit: 'The supreme Ayurvedic Rasayana for cellular rejuvenation, muscle reconstruction, and Ojas.',
    foundIn: 'Mall Yoddha & Vajra Shakti Premium',
    color: '#C9A45C',
    image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'Shuddha Shilajit',
    sanskrit: 'शिलाजीत (Pure Himalayan Resin)',
    benefit: 'Ancient rock exudate with 85+ minerals and fulvic acid for physical power and ATP energy.',
    foundIn: 'Shilajit Resin & Capsules',
    color: '#B8860B',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'Ashoka Bark',
    sanskrit: 'अशोक (Saraca asoca)',
    benefit: 'Sacred uterine tonic that harmonizes female endocrine cycles and uterine resilience.',
    foundIn: 'Nari Santulan',
    color: '#E06522',
    image: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'Kutaja & Bilwa',
    sanskrit: 'कुटज एवं बिल्व (Holarrhena & Bael)',
    benefit: 'Time-honored digestive protectors that calm IBS, relieve gas, and normalize bowel motility.',
    foundIn: 'Kosht Sudha',
    color: '#5C90A8',
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'Lodhra',
    sanskrit: 'लोध्र (Symplocos racemosa)',
    benefit: 'Classical Kashaya astringent that tones mucosal tissues and relieves leucorrhea.',
    foundIn: 'Yonidhara',
    color: '#A02070',
    image: 'https://images.unsplash.com/photo-1546842931-886c185b4c8c?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'Kalmegh & Bhumi Amla',
    sanskrit: 'कालमेघ एवं भूमि आंवला',
    benefit: 'Bitter therapeutic powerhouses that rejuvenate sluggish liver cells and restore healthy bile.',
    foundIn: 'Akshire Jigar',
    color: '#204B78',
    image: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=600&q=80'
  }
];

export const REVIEWS = [
  {
    id: 1,
    name: 'Pehlwan Gurpreet Singh Sandhu',
    role: 'National Wrestling Champion, Punjab',
    rating: 5,
    verified: true,
    product: 'Mall Yoddha (Swarna Bhasma)',
    comment:
      'Mall Yoddha is genuine gold. In traditional Akhada wrestling, muscle recovery and tendon endurance decide victory. This Swarna Bhasma formulation gives extraordinary stamina without any harmful supplements.',
    date: '10 Nov 2026'
  },
  {
    id: 2,
    name: 'Dr. Sunita Kulkarni',
    role: 'Ayurvedic Physician (BAMS), Pune',
    rating: 5,
    verified: true,
    product: 'Yonidhara & Nari Santulan',
    comment:
      'In my clinical practice, female reproductive health requires genuine classical care. Vagvat Ayurveda’s Yonidhara provides marked relief in leucorrhea without side effects, while Nari Santulan restores hormonal balance effectively.',
    date: '14 Oct 2026'
  },
  {
    id: 3,
    name: 'Meenakshi Sundaram',
    role: 'Nutrition & Gut Health Consultant, Bengaluru',
    rating: 5,
    verified: true,
    product: 'Kosht Sudha (IBS Support)',
    comment:
      'IBS symptoms and chronic bloating are notoriously stubborn. Kosht Sudha’s blend of Kutaja and Bilwa soothes intestinal spasms naturally without inducing dependency. A phenomenal gut formulation.',
    date: '28 Oct 2026'
  },
  {
    id: 4,
    name: 'Vikramaditya Sengupta',
    role: 'Architect, New Delhi',
    rating: 5,
    verified: true,
    product: 'Swas Amrit',
    comment:
      'I have suffered from winter lung congestion and breathing difficulty for years. Swas Amrit opened up my airways noticeably within just 10 days—completely natural and non-drowsy.',
    date: '02 Nov 2026'
  }
];

export const FAQS = [
  {
    question: 'How are Vagvat Ayurveda formulations different from commercial herbal brands?',
    answer:
      'Vagvat Ayurveda draws inspiration from the classical texts of Acharya Vagbhata (author of Ashtanga Hridaya). We use full-spectrum, ethically harvested wildcrafted herbs, standardized botanical extracts, and time-honored Bhavana (trituration) and Shastriya Swarna Bhasma calx preparation without chemical preservatives or artificial coloring.'
  },
  {
    question: 'Are your products safe for long-term daily use?',
    answer:
      'Yes. Our formulations are composed of non-habit forming, gentle rasayana botanicals manufactured in our Ayush-certified and GMP-compliant facilities. Every batch undergoes heavy metal screening for lead, mercury, cadmium, and arsenic.'
  },
  {
    question: 'How long does shipping take across India?',
    answer:
      'We offer complimentary insured courier shipping on orders above ₹499. Orders are typically dispatched within 24 hours from our apothecary and delivered within 2-4 business days in metro cities and 4-6 days across other locations in discrete protective packaging.'
  },
  {
    question: 'Can I take multiple Vagvat Ayurveda formulations together?',
    answer:
      'Yes, several formulations complement each other. For example, Kosht Sudha (IBS & gut balance) synergizes beautifully with Akshire Jigar (liver renewal) or Mall Yoddha (strength & muscle recovery). If you have specific chronic conditions, please consult our in-house Ayurvedic Vaidyas.'
  }
];
