export interface CountryCompliance {
  regulator: string
  regulationName: string
  registrationRequired: boolean
  registrationType: string
  testingRequirements: string[]
  notes: string
}

export interface ProductTypeData {
  slug: string
  names: {
    en: string
    'pt-BR': string
    es: string
    zh: string
  }
  descriptions: {
    en: string
    'pt-BR': string
    es: string
    zh: string
  }
  complianceByCountry: {
    brazil: CountryCompliance
    mexico: CountryCompliance
  }
  commonRestrictedIngredients: string[]
  labelRequirements: {
    en: string[]
    'pt-BR': string[]
    es: string[]
    zh: string[]
  }
}

export const productTypes: ProductTypeData[] = [
  {
    slug: "skincare",
    names: {
      "en": "Skincare",
      "pt-BR": "Cuidados com a Pele",
      "es": "Cuidado de la Piel",
      "zh": "护肤品",
    },
    descriptions: {
      "en": "General skincare products including creams, lotions, and toners regulated under ANVISA and COFEPRIS cosmetic frameworks.",
      "pt-BR": "Produtos gerais de cuidados com a pele, incluindo cremes, loções e tônicos, regulamentados sob as normas cosméticas da ANVISA e COFEPRIS.",
      "es": "Productos generales para el cuidado de la piel, incluyendo cremas, lociones y tónicos, regulados bajo los marcos cosméticos de COFEPRIS y ANVISA.",
      "zh": "包含乳霜、化妆水和爽肤水的一般护肤产品，受ANVISA和COFEPRIS化妆品框架监管。",
    },
    complianceByCountry: {
      brazil: {
        regulator: "ANVISA",
        regulationName: "RDC 729/2023",
        registrationRequired: true,
        registrationType: "Cadastro",
        testingRequirements: [
          "Safety assessment",
          "Microbiological analysis",
        ],
        notes: "Low-risk cosmetic products require Cadastro (simplified registration).",
      },
      mexico: {
        regulator: "COFEPRIS",
        regulationName: "NOM-141-SSA1",
        registrationRequired: true,
        registrationType: "Registro Sanitario",
        testingRequirements: [
          "Safety profile",
          "Label compliance",
        ],
        notes: "General cosmetics require sanitary registration before commercialization.",
      },
    },
    commonRestrictedIngredients: [
      "formaldehyde",
      "triclosan",
      "quaternium-15",
    ],
    labelRequirements: {
      "en": [
        "Manufacturer name and address",
        "Batch number",
        "Expiration date",
        "INCI ingredient list",
      ],
      "pt-BR": [
        "Nome e endereço do fabricante",
        "Número de lote",
        "Data de validade",
        "Lista de ingredientes INCI",
      ],
      "es": [
        "Nombre y dirección del fabricante",
        "Número de lote",
        "Fecha de caducidad",
        "Lista de ingredientes INCI",
      ],
      "zh": [
        "生产商名称和地址",
        "批号",
        "有效期",
        "INCI成分列表",
      ],
    },
  },
  {
    slug: "moisturizer",
    names: {
      "en": "Moisturizer",
      "pt-BR": "Hidratante",
      "es": "Hidratante",
      "zh": "保湿霜",
    },
    descriptions: {
      "en": "Facial and body moisturizers designed to hydrate and protect the skin barrier.",
      "pt-BR": "Hidratantes faciais e corporais projetados para hidratar e proteger a barreira da pele.",
      "es": "Hidratantes faciales y corporales diseñados para hidratar y proteger la barrera cutánea.",
      "zh": "面部和身体保湿霜，旨在补水和保护皮肤屏障。",
    },
    complianceByCountry: {
      brazil: {
        regulator: "ANVISA",
        regulationName: "RDC 729/2023",
        registrationRequired: true,
        registrationType: "Cadastro",
        testingRequirements: [
          "Stability testing",
          "Preservative challenge test",
        ],
        notes: "Standard cosmetic cadastro. Claims such as 'anti-aging' may trigger higher classification.",
      },
      mexico: {
        regulator: "COFEPRIS",
        regulationName: "NOM-141-SSA1",
        registrationRequired: true,
        registrationType: "Registro Sanitario",
        testingRequirements: [
          "Stability study",
          "Microbiological testing",
        ],
        notes: "Subject to standard cosmetic registration.",
      },
    },
    commonRestrictedIngredients: [
      "formaldehyde",
      "mercury-compounds",
    ],
    labelRequirements: {
      "en": [
        "Net content",
        "Usage instructions",
        "Storage conditions",
        "Warnings if applicable",
      ],
      "pt-BR": [
        "Conteúdo líquido",
        "Modo de usar",
        "Condições de armazenamento",
        "Advertências se aplicável",
      ],
      "es": [
        "Contenido neto",
        "Instrucciones de uso",
        "Condiciones de almacenamiento",
        "Advertencias si aplica",
      ],
      "zh": [
        "净含量",
        "使用说明",
        "储存条件",
        "适用警告",
      ],
    },
  },
  {
    slug: "serum",
    names: {
      "en": "Serum",
      "pt-BR": "Sérum",
      "es": "Suero",
      "zh": "精华液",
    },
    descriptions: {
      "en": "Concentrated skincare serums with active ingredients such as vitamins, acids, and peptides.",
      "pt-BR": "Séruns concentrados para cuidados com a pele com ingredientes ativos como vitaminas, ácidos e peptídeos.",
      "es": "Sueros concentrados para el cuidado de la piel con ingredientes activos como vitaminas, ácidos y péptidos.",
      "zh": "含有维生素、酸类和胜肽等活性成分的浓缩护肤精华。",
    },
    complianceByCountry: {
      brazil: {
        regulator: "ANVISA",
        regulationName: "RDC 729/2023",
        registrationRequired: true,
        registrationType: "Cadastro",
        testingRequirements: [
          "Active ingredient concentration verification",
          "Skin irritation test",
        ],
        notes: "Higher active concentrations may require additional safety data.",
      },
      mexico: {
        regulator: "COFEPRIS",
        regulationName: "NOM-141-SSA1",
        registrationRequired: true,
        registrationType: "Registro Sanitario",
        testingRequirements: [
          "Concentration verification",
          "Safety assessment",
        ],
        notes: "Serums with acids or retinoids may face additional restrictions.",
      },
    },
    commonRestrictedIngredients: [
      "retinoic-acid",
      "hydroquinone",
      "formaldehyde",
    ],
    labelRequirements: {
      "en": [
        "Active ingredient concentration",
        "Application frequency",
        "Sun protection warning for photosensitizing actives",
        "Patch test recommendation",
      ],
      "pt-BR": [
        "Concentração do ingrediente ativo",
        "Frequência de aplicação",
        "Advertência de proteção solar para ativos fotossensibilizantes",
        "Recomendação de teste de toque",
      ],
      "es": [
        "Concentración del ingrediente activo",
        "Frecuencia de aplicación",
        "Advertencia de protección solar para activos fotosensibilizantes",
        "Recomendación de prueba de parche",
      ],
      "zh": [
        "活性成分浓度",
        "使用频率",
        "光敏成分防晒警告",
        "皮肤测试建议",
      ],
    },
  },
  {
    slug: "sunscreen",
    names: {
      "en": "Sunscreen",
      "pt-BR": "Protetor Solar",
      "es": "Protector Solar",
      "zh": "防晒霜",
    },
    descriptions: {
      "en": "UV protection products classified as cosmetics in Brazil and Mexico with specific SPF labeling requirements.",
      "pt-BR": "Produtos de proteção UV classificados como cosméticos no Brasil e México com requisitos específicos de rotulagem FPS.",
      "es": "Productos de protección UV clasificados como cosméticos en Brasil y México con requisitos específicos de etiquetado FPS.",
      "zh": "在巴西和墨西哥被分类为化妆品的紫外线防护产品，具有特定的SPF标签要求。",
    },
    complianceByCountry: {
      brazil: {
        regulator: "ANVISA",
        regulationName: "RDC 729/2023 / RDC 375/2020",
        registrationRequired: true,
        registrationType: "Registro",
        testingRequirements: [
          "SPF in-vivo testing (ISO 24444)",
          "UVA protection test (ISO 24443)",
          "Water resistance test if claimed",
        ],
        notes: "Sunscreens require full Registro (not Cadastro) due to higher risk classification. SPF and UVA labeling mandatory.",
      },
      mexico: {
        regulator: "COFEPRIS",
        regulationName: "NOM-240-SSA1 / NOM-141-SSA1",
        registrationRequired: true,
        registrationType: "Registro Sanitario",
        testingRequirements: [
          "SPF determination",
          "UVA/UVB ratio testing",
          "Photostability assessment",
        ],
        notes: "NOM-240-SSA1 specifically governs sunscreen products. Broad-spectrum claims require UVA testing.",
      },
    },
    commonRestrictedIngredients: [
      "benzophenone-3",
      "octinoxate",
      "formaldehyde",
    ],
    labelRequirements: {
      "en": [
        "SPF value (numerical only, no 'sunblock')",
        "UVA protection indicator",
        "Application instructions (quantity and reapplication)",
        "Water resistance duration if applicable",
      ],
      "pt-BR": [
        "Valor FPS (apenas numérico, sem 'bloqueador')",
        "Indicador de proteção UVA",
        "Instruções de aplicação (quantidade e reaplicação)",
        "Duração da resistência à água se aplicável",
      ],
      "es": [
        "Valor FPS (solo numérico, sin 'bloqueador')",
        "Indicador de protección UVA",
        "Instrucciones de aplicación (cantidad y reaplicación)",
        "Duración de resistencia al agua si aplica",
      ],
      "zh": [
        "SPF值（仅限数字，不得使用'防晒'）",
        "UVA防护标识",
        "使用说明（用量和补涂）",
        "水耐性时间（如适用）",
      ],
    },
  },
  {
    slug: "anti-aging",
    names: {
      "en": "Anti-Aging Product",
      "pt-BR": "Produto Anti-Idade",
      "es": "Producto Anti-Edad",
      "zh": "抗衰老产品",
    },
    descriptions: {
      "en": "Products claiming anti-aging benefits including wrinkle reduction, firming, or skin renewal.",
      "pt-BR": "Produtos com alegações anti-idade, incluindo redução de rugas, firmeza ou renovação da pele.",
      "es": "Productos con afirmaciones anti-edad, incluyendo reducción de arrugas, reafirmación o renovación de la piel.",
      "zh": "声称具有抗衰老功效的产品，包括减少细纹、紧致或肤质更新。",
    },
    complianceByCountry: {
      brazil: {
        regulator: "ANVISA",
        regulationName: "RDC 729/2023",
        registrationRequired: true,
        registrationType: "Registro",
        testingRequirements: [
          "Efficacy study for claimed benefits",
          "Safety assessment",
        ],
        notes: "Anti-aging claims may elevate product to Registro category depending on mechanism of action.",
      },
      mexico: {
        regulator: "COFEPRIS",
        regulationName: "NOM-141-SSA1",
        registrationRequired: true,
        registrationType: "Registro Sanitario",
        testingRequirements: [
          "Efficacy documentation",
          "Safety profile",
        ],
        notes: "Claims affecting skin structure/function require robust substantiation.",
      },
    },
    commonRestrictedIngredients: [
      "retinoic-acid",
      "hydroquinone",
      "mercury-compounds",
    ],
    labelRequirements: {
      "en": [
        "Clear indication of cosmetic vs. drug claim",
        "Active ingredient and concentration",
        "Directions for use",
        "Avoid contact with eyes",
      ],
      "pt-BR": [
        "Indicação clara de alegação cosmética vs. medicamentosa",
        "Ingrediente ativo e concentração",
        "Modo de usar",
        "Evitar contato com os olhos",
      ],
      "es": [
        "Indicación clara de afirmación cosmética vs. medicamentosa",
        "Ingrediente activo y concentración",
        "Instrucciones de uso",
        "Evitar contacto con los ojos",
      ],
      "zh": [
        "明确标示化妆品声称与药品声称",
        "活性成分及浓度",
        "使用方法",
        "避免接触眼睛",
      ],
    },
  },
  {
    slug: "acne-treatment",
    names: {
      "en": "Acne Treatment",
      "pt-BR": "Tratamento para Acne",
      "es": "Tratamiento para el Acné",
      "zh": "祛痘产品",
    },
    descriptions: {
      "en": "Products formulated to treat acne, reduce sebum, or prevent breakouts.",
      "pt-BR": "Produtos formulados para tratar acne, reduzir a oleosidade ou prevenir surtos.",
      "es": "Productos formulados para tratar el acné, reducir la grasa o prevenir brotes.",
      "zh": "专为治疗痘痘、减少皮脂或预防爆发而配制的产品。",
    },
    complianceByCountry: {
      brazil: {
        regulator: "ANVISA",
        regulationName: "RDC 729/2023",
        registrationRequired: true,
        registrationType: "Registro",
        testingRequirements: [
          "Comedogenicity assessment",
          "Skin tolerance study",
          "Active ingredient efficacy data",
        ],
        notes: "Products with drug-like claims (treating acne) may be classified as medicated cosmetics or borderline products.",
      },
      mexico: {
        regulator: "COFEPRIS",
        regulationName: "NOM-141-SSA1",
        registrationRequired: true,
        registrationType: "Registro Sanitario",
        testingRequirements: [
          "Non-comedogenic claim verification",
          "Safety and efficacy data",
        ],
        notes: "Acne treatment claims require careful evaluation of cosmetic vs. drug classification.",
      },
    },
    commonRestrictedIngredients: [
      "salicylic-acid",
      "benzoyl-peroxide",
      "triclosan",
    ],
    labelRequirements: {
      "en": [
        "Active ingredient and percentage",
        "Intended use (cosmetic vs. therapeutic)",
        "Frequency of application",
        "Discontinue use if irritation occurs",
      ],
      "pt-BR": [
        "Ingrediente ativo e porcentagem",
        "Uso pretendido (cosmético vs. terapêutico)",
        "Frequência de aplicação",
        "Suspender o uso em caso de irritação",
      ],
      "es": [
        "Ingrediente activo y porcentaje",
        "Uso previsto (cosmético vs. terapéutico)",
        "Frecuencia de aplicación",
        "Suspender uso si ocurre irritación",
      ],
      "zh": [
        "活性成分及百分比",
        "预期用途（化妆品与治疗用品）",
        "应用频率",
        "如出现刺激请停止使用",
      ],
    },
  },
  {
    slug: "whitening",
    names: {
      "en": "Skin Whitening",
      "pt-BR": "Clareamento da Pele",
      "es": "Blanqueamiento de la Piel",
      "zh": "美白产品",
    },
    descriptions: {
      "en": "Products claiming to lighten skin tone, reduce dark spots, or even out complexion.",
      "pt-BR": "Produtos que alegam clarear o tom da pele, reduzir manchas escuras ou uniformizar a tez.",
      "es": "Productos que afirman aclarar el tono de la piel, reducir manchas oscuras o uniformizar la tez.",
      "zh": "声称具有美白肤色、减少暗沉或均匀肤色功效的产品。",
    },
    complianceByCountry: {
      brazil: {
        regulator: "ANVISA",
        regulationName: "RDC 729/2023 / RDC 529/2021",
        registrationRequired: true,
        registrationType: "Registro",
        testingRequirements: [
          "Hydroquinone and mercury screening",
          "Safety assessment for depigmenting agents",
          "Efficacy data for whitening claims",
        ],
        notes: "Whitening products are high-risk and require Registro. Hydroquinone is strictly restricted (2% max for professional use only).",
      },
      mexico: {
        regulator: "COFEPRIS",
        regulationName: "NOM-141-SSA1",
        registrationRequired: true,
        registrationType: "Registro Sanitario",
        testingRequirements: [
          "Heavy metal screening (Hg, Pb, As)",
          "Safety evaluation",
        ],
        notes: "Mercury-containing skin lighteners are strictly prohibited.",
      },
    },
    commonRestrictedIngredients: [
      "hydroquinone",
      "mercury",
      "mercury-compounds",
      "arsenic",
      "lead",
    ],
    labelRequirements: {
      "en": [
        "List all active depigmenting agents",
        "Concentration of restricted actives",
        "Professional use only warnings where applicable",
        "Avoid sun exposure during use",
      ],
      "pt-BR": [
        "Listar todos os agentes despigmentantes ativos",
        "Concentração de ativos restritos",
        "Avisos de uso profissional quando aplicável",
        "Evitar exposição solar durante o uso",
      ],
      "es": [
        "Listar todos los agentes despigmentantes activos",
        "Concentración de activos restringidos",
        "Advertencias de uso profesional donde aplique",
        "Evitar exposición solar durante el uso",
      ],
      "zh": [
        "列出所有活性脱色剂",
        "限制性活性成分浓度",
        "适用时标注专业使用",
        "使用期间避免阳光曝晒",
      ],
    },
  },
  {
    slug: "hair-care",
    names: {
      "en": "Hair Care",
      "pt-BR": "Cuidados com o Cabelo",
      "es": "Cuidado del Cabello",
      "zh": "护发产品",
    },
    descriptions: {
      "en": "General hair care products including treatments, oils, and masks.",
      "pt-BR": "Produtos gerais de cuidados com o cabelo, incluindo tratamentos, óleos e máscaras.",
      "es": "Productos generales para el cuidado del cabello, incluyendo tratamientos, aceites y mascarillas.",
      "zh": "一般护发产品，包括护理、精油和发膜。",
    },
    complianceByCountry: {
      brazil: {
        regulator: "ANVISA",
        regulationName: "RDC 729/2023",
        registrationRequired: true,
        registrationType: "Cadastro",
        testingRequirements: [
          "Safety assessment",
          "Microbiological testing",
        ],
        notes: "Most hair care products fall under low-risk Cadastro.",
      },
      mexico: {
        regulator: "COFEPRIS",
        regulationName: "NOM-141-SSA1",
        registrationRequired: true,
        registrationType: "Registro Sanitario",
        testingRequirements: [
          "Standard safety testing",
        ],
        notes: "Standard cosmetic registration applies.",
      },
    },
    commonRestrictedIngredients: [
      "formaldehyde",
      "cocamide-dea",
    ],
    labelRequirements: {
      "en": [
        "Hair type indication",
        "Usage instructions",
        "Precautions for colored or treated hair",
      ],
      "pt-BR": [
        "Indicação do tipo de cabelo",
        "Modo de usar",
        "Precauções para cabelos coloridos ou tratados",
      ],
      "es": [
        "Indicación del tipo de cabello",
        "Instrucciones de uso",
        "Precauciones para cabello teñido o tratado",
      ],
      "zh": [
        "发质说明",
        "使用说明",
        "染发或处理过的头发注意事项",
      ],
    },
  },
  {
    slug: "shampoo",
    names: {
      "en": "Shampoo",
      "pt-BR": "Shampoo",
      "es": "Champú",
      "zh": "洗发水",
    },
    descriptions: {
      "en": "Hair cleansing products including regular, anti-dandruff, and specialty formulations.",
      "pt-BR": "Produtos de limpeza capilar, incluindo formulações regulares, anticaspa e especializadas.",
      "es": "Productos de limpieza capilar, incluyendo formulaciones regulares, anticaspa y especializadas.",
      "zh": "头发清洁产品，包括普通、去屑和专业配方。",
    },
    complianceByCountry: {
      brazil: {
        regulator: "ANVISA",
        regulationName: "RDC 729/2023",
        registrationRequired: true,
        registrationType: "Cadastro",
        testingRequirements: [
          "Surfactant safety data",
          "Eye irritation test",
          "Microbiological testing",
        ],
        notes: "Anti-dandruff or medicated shampoos may require Registro.",
      },
      mexico: {
        regulator: "COFEPRIS",
        regulationName: "NOM-141-SSA1",
        registrationRequired: true,
        registrationType: "Registro Sanitario",
        testingRequirements: [
          "Safety assessment",
          "Label compliance",
        ],
        notes: "Medicated claims elevate classification.",
      },
    },
    commonRestrictedIngredients: [
      "formaldehyde",
      "sodium-lauryl-sulfate",
      "triclosan",
    ],
    labelRequirements: {
      "en": [
        "Hair type and intended use",
        "Active ingredients for anti-dandruff/medicated variants",
        "Rinse thoroughly after use",
        "Avoid contact with eyes",
      ],
      "pt-BR": [
        "Tipo de cabelo e uso pretendido",
        "Ingredientes ativos para variantes anticaspa/medicinais",
        "Enxaguar bem após o uso",
        "Evitar contato com os olhos",
      ],
      "es": [
        "Tipo de cabello y uso previsto",
        "Ingredientes activos para variantes anticaspa/medicinales",
        "Enjuagar bien después del uso",
        "Evitar contacto con los ojos",
      ],
      "zh": [
        "发质和预期用途",
        "去屑/药用版本的活性成分",
        "使用后彻底冲洗",
        "避免接触眼睛",
      ],
    },
  },
  {
    slug: "conditioner",
    names: {
      "en": "Hair Conditioner",
      "pt-BR": "Condicionador",
      "es": "Acondicionador",
      "zh": "护发素",
    },
    descriptions: {
      "en": "Hair conditioning and detangling products for all hair types.",
      "pt-BR": "Produtos de condicionamento e desembaraço para todos os tipos de cabelo.",
      "es": "Productos de acondicionamiento y desenredo para todo tipo de cabello.",
      "zh": "适用于所有发质的护发和顺发产品。",
    },
    complianceByCountry: {
      brazil: {
        regulator: "ANVISA",
        regulationName: "RDC 729/2023",
        registrationRequired: true,
        registrationType: "Cadastro",
        testingRequirements: [
          "Safety assessment",
        ],
        notes: "Standard low-risk cosmetic.",
      },
      mexico: {
        regulator: "COFEPRIS",
        regulationName: "NOM-141-SSA1",
        registrationRequired: true,
        registrationType: "Registro Sanitario",
        testingRequirements: [
          "Standard safety testing",
        ],
        notes: "Standard cosmetic registration.",
      },
    },
    commonRestrictedIngredients: [
      "formaldehyde",
      "quaternium-15",
    ],
    labelRequirements: {
      "en": [
        "Recommended hair type",
        "Leave-on time if applicable",
        "Rinse instructions",
      ],
      "pt-BR": [
        "Tipo de cabelo recomendado",
        "Tempo de pausa se aplicável",
        "Instruções de enxágue",
      ],
      "es": [
        "Tipo de cabello recomendado",
        "Tiempo de reposo si aplica",
        "Instrucciones de enjuague",
      ],
      "zh": [
        "推荐发质",
        "如适用留置时间",
        "冲洗说明",
      ],
    },
  },
  {
    slug: "hair-dye",
    names: {
      "en": "Hair Dye",
      "pt-BR": "Tintura de Cabelo",
      "es": "Tinte de Cabello",
      "zh": "染发剂",
    },
    descriptions: {
      "en": "Permanent, semi-permanent, and temporary hair coloring products.",
      "pt-BR": "Produtos de coloração capilar permanente, semipermanente e temporária.",
      "es": "Productos de coloración capilar permanente, semipermanente y temporal.",
      "zh": "永久性、半永久性和暂时性染发产品。",
    },
    complianceByCountry: {
      brazil: {
        regulator: "ANVISA",
        regulationName: "RDC 729/2023 / RDC 38/2003",
        registrationRequired: true,
        registrationType: "Registro",
        testingRequirements: [
          "PPD and p-toluenediamine screening",
          "Skin sensitization assessment",
          "Mutagenicity test (Ames)",
        ],
        notes: "Hair dyes are high-risk due to allergenic potential. Requires Registro. Professional-use-only products must be clearly labeled.",
      },
      mexico: {
        regulator: "COFEPRIS",
        regulationName: "NOM-141-SSA1",
        registrationRequired: true,
        registrationType: "Registro Sanitario",
        testingRequirements: [
          "Aromatic amine screening",
          "Skin sensitization data",
        ],
        notes: "Hair dyes require special attention to aromatic amine content.",
      },
    },
    commonRestrictedIngredients: [
      "p-phenylenediamine",
      "ammonia",
      "formaldehyde",
      "lead",
    ],
    labelRequirements: {
      "en": [
        "Skin allergy test warning (48h prior)",
        "Professional use only if high-concentration developer",
        "List of colorants (CI numbers)",
        "Glove use recommendation",
      ],
      "pt-BR": [
        "Advertência de teste de alergia (48h antes)",
        "Uso profissional apenas se oxidante de alta concentração",
        "Lista de colorantes (números CI)",
        "Recomendação de uso de luvas",
      ],
      "es": [
        "Advertencia de prueba de alergia (48h antes)",
        "Uso profesional solo si es revelador de alta concentración",
        "Lista de colorantes (números CI)",
        "Recomendación de uso de guantes",
      ],
      "zh": [
        "皮肤过敏测试警告（48小时前）",
        "高浓度显色剂仅限专业使用",
        "染料列表（CI号）",
        "建议佩戴手套",
      ],
    },
  },
  {
    slug: "makeup",
    names: {
      "en": "Makeup",
      "pt-BR": "Maquiagem",
      "es": "Maquillaje",
      "zh": "彩妆",
    },
    descriptions: {
      "en": "General makeup products including powders, blush, and bronzers.",
      "pt-BR": "Produtos gerais de maquiagem, incluindo pós, blushes e bronzers.",
      "es": "Productos generales de maquillaje, incluyendo polvos, rubores y bronceadores.",
      "zh": "一般彩妆产品，包括粉底、腮红和古铜色产品。",
    },
    complianceByCountry: {
      brazil: {
        regulator: "ANVISA",
        regulationName: "RDC 729/2023",
        registrationRequired: true,
        registrationType: "Cadastro",
        testingRequirements: [
          "Heavy metal screening (Pb, As, Cd, Hg)",
          "Microbiological testing",
        ],
        notes: "Color additives must be approved by ANVISA. Heavy metal limits apply.",
      },
      mexico: {
        regulator: "COFEPRIS",
        regulationName: "NOM-141-SSA1",
        registrationRequired: true,
        registrationType: "Registro Sanitario",
        testingRequirements: [
          "Heavy metal limits compliance",
          "Colorant approval verification",
        ],
        notes: "All colorants must be on the approved positive list.",
      },
    },
    commonRestrictedIngredients: [
      "lead",
      "cadmium",
      "arsenic",
      "formaldehyde",
    ],
    labelRequirements: {
      "en": [
        "Complete ingredient list",
        "Color shade name/number",
        "Batch code",
        "Period-after-opening (PAO) symbol",
      ],
      "pt-BR": [
        "Lista completa de ingredientes",
        "Nome/número do tom",
        "Código de lote",
        "Símbolo de prazo de validade após abertura (PAO)",
      ],
      "es": [
        "Lista completa de ingredientes",
        "Nombre/número del tono",
        "Código de lote",
        "Símbolo de período después de apertura (PAO)",
      ],
      "zh": [
        "完整成分列表",
        "颜色名称/编号",
        "批次代码",
        "开封后保质期(PAO)标识",
      ],
    },
  },
  {
    slug: "foundation",
    names: {
      "en": "Foundation",
      "pt-BR": "Base",
      "es": "Base de Maquillaje",
      "zh": "粉底液",
    },
    descriptions: {
      "en": "Liquid, cream, and powder foundation products for facial coverage.",
      "pt-BR": "Produtos de base líquida, cremosa e em pó para cobertura facial.",
      "es": "Productos de base líquida, en crema y en polvo para cobertura facial.",
      "zh": "液体、霜状和粉状粉底产品，用于面部遮盖。",
    },
    complianceByCountry: {
      brazil: {
        regulator: "ANVISA",
        regulationName: "RDC 729/2023",
        registrationRequired: true,
        registrationType: "Cadastro",
        testingRequirements: [
          "Heavy metal testing",
          "Microbiological analysis",
          "SPF claim verification if applicable",
        ],
        notes: "Foundations with SPF claims are regulated as sunscreens and require Registro.",
      },
      mexico: {
        regulator: "COFEPRIS",
        regulationName: "NOM-141-SSA1",
        registrationRequired: true,
        registrationType: "Registro Sanitario",
        testingRequirements: [
          "Heavy metal compliance",
          "Microbiological safety",
        ],
        notes: "SPF-containing foundations fall under NOM-240-SSA1.",
      },
    },
    commonRestrictedIngredients: [
      "lead",
      "cadmium",
      "formaldehyde",
    ],
    labelRequirements: {
      "en": [
        "Shade name and number",
        "Skin type recommendation",
        "SPF value if claimed",
        "Complete ingredient list",
      ],
      "pt-BR": [
        "Nome e número do tom",
        "Recomendação de tipo de pele",
        "Valor FPS se alegado",
        "Lista completa de ingredientes",
      ],
      "es": [
        "Nombre y número del tono",
        "Recomendación de tipo de piel",
        "Valor FPS si se alega",
        "Lista completa de ingredientes",
      ],
      "zh": [
        "颜色名称和编号",
        "肤质推荐",
        "如声称SPF则需标明",
        "完整成分列表",
      ],
    },
  },
  {
    slug: "lipstick",
    names: {
      "en": "Lipstick",
      "pt-BR": "Batom",
      "es": "Lápiz Labial",
      "zh": "口红",
    },
    descriptions: {
      "en": "Lip color products including traditional bullets, liquids, and tints.",
      "pt-BR": "Produtos de cor para lábios, incluindo batons tradicionais, líquidos e tintas.",
      "es": "Productos de color para labios, incluyendo barras tradicionales, líquidos y tintas.",
      "zh": "唇部彩妆产品，包括传统唇膏、唇彩和唇霞。",
    },
    complianceByCountry: {
      brazil: {
        regulator: "ANVISA",
        regulationName: "RDC 729/2023",
        registrationRequired: true,
        registrationType: "Cadastro",
        testingRequirements: [
          "Lead content analysis",
          "Heavy metal screening",
          "Microbiological testing",
        ],
        notes: "Lip products have stricter heavy metal limits due to ingestion risk.",
      },
      mexico: {
        regulator: "COFEPRIS",
        regulationName: "NOM-141-SSA1",
        registrationRequired: true,
        registrationType: "Registro Sanitario",
        testingRequirements: [
          "Lead limit verification (max 20 ppm)",
          "Heavy metal screening",
        ],
        notes: "Lead limits are particularly strict for lip products.",
      },
    },
    commonRestrictedIngredients: [
      "lead",
      "cadmium",
      "arsenic",
    ],
    labelRequirements: {
      "en": [
        "Color index (CI) numbers for all pigments",
        "Manufacturer information",
        "Country of origin",
        "Expiration date",
      ],
      "pt-BR": [
        "Números de índice de cor (CI) para todos os pigmentos",
        "Informações do fabricante",
        "País de origem",
        "Data de validade",
      ],
      "es": [
        "Números de índice de color (CI) para todos los pigmentos",
        "Información del fabricante",
        "País de origen",
        "Fecha de caducidad",
      ],
      "zh": [
        "所有颜料的颜料索引(CI)号",
        "生产商信息",
        "原产地",
        "有效期",
      ],
    },
  },
  {
    slug: "mascara",
    names: {
      "en": "Mascara",
      "pt-BR": "Rímel",
      "es": "Rímel",
      "zh": "睫毛膏",
    },
    descriptions: {
      "en": "Eyelash coloring and volumizing products.",
      "pt-BR": "Produtos para colorir e dar volume aos cílios.",
      "es": "Productos para teñir y dar volumen a las pestañas.",
      "zh": "睫毛染色和增密产品。",
    },
    complianceByCountry: {
      brazil: {
        regulator: "ANVISA",
        regulationName: "RDC 729/2023",
        registrationRequired: true,
        registrationType: "Cadastro",
        testingRequirements: [
          "Ophthalmological safety assessment",
          "Microbiological testing",
          "Preservative efficacy",
        ],
        notes: "Eye area products require additional safety considerations.",
      },
      mexico: {
        regulator: "COFEPRIS",
        regulationName: "NOM-141-SSA1",
        registrationRequired: true,
        registrationType: "Registro Sanitario",
        testingRequirements: [
          "Eye safety evaluation",
          "Microbiological limits compliance",
        ],
        notes: "Products for eye area must meet stricter microbiological standards.",
      },
    },
    commonRestrictedIngredients: [
      "formaldehyde",
      "lead",
    ],
    labelRequirements: {
      "en": [
        "Ophthalmologically tested claim if applicable",
        "Precautions for contact lens wearers",
        "Discontinue use if eye irritation occurs",
        "PAO symbol",
      ],
      "pt-BR": [
        "Alegação de testado oftalmologicamente se aplicável",
        "Precauções para usuários de lentes de contato",
        "Suspender o uso em caso de irritação ocular",
        "Símbolo PAO",
      ],
      "es": [
        "Afirmación de testado oftalmológicamente si aplica",
        "Precauciones para usuarios de lentes de contacto",
        "Suspender uso si ocurre irritación ocular",
        "Símbolo PAO",
      ],
      "zh": [
        "如适用标注眼科测试",
        "隐形眼镜佩戴者注意事项",
        "如眼部发生刺激请停止使用",
        "PAO标识",
      ],
    },
  },
  {
    slug: "fragrance",
    names: {
      "en": "Fragrance",
      "pt-BR": "Fragrância",
      "es": "Fragancia",
      "zh": "香水",
    },
    descriptions: {
      "en": "Perfumes, colognes, and body sprays for personal fragrance.",
      "pt-BR": "Perfumes, colônias e body sprays para fragrância pessoal.",
      "es": "Perfumes, colonias y body sprays para fragancia personal.",
      "zh": "用于个人香气的香水、古龙水和身体喷雾。",
    },
    complianceByCountry: {
      brazil: {
        regulator: "ANVISA",
        regulationName: "RDC 729/2023",
        registrationRequired: true,
        registrationType: "Cadastro",
        testingRequirements: [
          "Alcohol content declaration",
          "Allergen labeling compliance",
          "IFRA standards adherence",
        ],
        notes: "Fragrance allergens must be declared if concentrations exceed thresholds (RDC 756/2022).",
      },
      mexico: {
        regulator: "COFEPRIS",
        regulationName: "NOM-141-SSA1",
        registrationRequired: true,
        registrationType: "Registro Sanitario",
        testingRequirements: [
          "Alcohol percentage labeling",
          "Flammability warnings if applicable",
        ],
        notes: "High-alcohol fragrances require flammability warnings.",
      },
    },
    commonRestrictedIngredients: [
      "formaldehyde",
      "quaternium-15",
    ],
    labelRequirements: {
      "en": [
        "Alcohol content (if > 70%)",
        "List of 26 EU fragrance allergens if present above threshold",
        "Flammability warning",
        "Batch number",
      ],
      "pt-BR": [
        "Teor de álcool (se > 70%)",
        "Lista dos 26 alergênicos de fragrância da UE se presentes acima do limite",
        "Advertência de inflamabilidade",
        "Número de lote",
      ],
      "es": [
        "Contenido de alcohol (si > 70%)",
        "Lista de los 26 alergénicos de fragancia de la UE si están presentes por encima del umbral",
        "Advertencia de inflamabilidad",
        "Número de lote",
      ],
      "zh": [
        "酒精含量（如>70%）",
        "如超过阈值列出26种欧盟香料过敏原",
        "易燃警告",
        "批号",
      ],
    },
  },
  {
    slug: "deodorant",
    names: {
      "en": "Deodorant",
      "pt-BR": "Desodorante",
      "es": "Desodorante",
      "zh": "除臭剂",
    },
    descriptions: {
      "en": "Underarm deodorants and antiperspirants including sprays, sticks, and roll-ons.",
      "pt-BR": "Desodorantes e antitranspirantes para as axilas, incluindo sprays, bastões e roll-ons.",
      "es": "Desodorantes y antitranspirantes para las axilas, incluyendo aerosoles, barras y roll-ons.",
      "zh": "腋下除臭剂和止汗剂，包括喷雾、棒状和走珠产品。",
    },
    complianceByCountry: {
      brazil: {
        regulator: "ANVISA",
        regulationName: "RDC 729/2023",
        registrationRequired: true,
        registrationType: "Registro",
        testingRequirements: [
          "Aluminum compound safety data",
          "Aerosol safety testing if applicable",
          "Skin irritation test",
        ],
        notes: "Antiperspirants (aluminum-based) are classified as drug-cosmetic borderline and require Registro.",
      },
      mexico: {
        regulator: "COFEPRIS",
        regulationName: "NOM-141-SSA1",
        registrationRequired: true,
        registrationType: "Registro Sanitario",
        testingRequirements: [
          "Propellant safety if aerosol",
          "Aluminum salt assessment",
        ],
        notes: "Aerosol deodorants require additional propellant safety data.",
      },
    },
    commonRestrictedIngredients: [
      "triclosan",
      "formaldehyde",
      "quaternium-15",
    ],
    labelRequirements: {
      "en": [
        "Active antiperspirant ingredient and percentage",
        "Aerosol warnings (pressurized container)",
        "Do not apply to broken skin",
        "Discontinue if rash occurs",
      ],
      "pt-BR": [
        "Ingrediente ativo antitranspirante e porcentagem",
        "Advertências de aerossol (recipiente pressurizado)",
        "Não aplicar em pele lesionada",
        "Suspender em caso de erupção",
      ],
      "es": [
        "Ingrediente activo antitranspirante y porcentaje",
        "Advertencias de aerosol (envase presurizado)",
        "No aplicar sobre piel lastimada",
        "Suspender si aparece sarpullido",
      ],
      "zh": [
        "活性止汗成分及百分比",
        "气雾罐警告（压力容器）",
        "勿用于破损皮肤",
        "如出现皮疹请停用",
      ],
    },
  },
  {
    slug: "baby-care",
    names: {
      "en": "Baby Care",
      "pt-BR": "Cuidados com o Bebê",
      "es": "Cuidado del Bebé",
      "zh": "婴儿护理",
    },
    descriptions: {
      "en": "Products specifically formulated for infants including lotions, oils, and wipes.",
      "pt-BR": "Produtos especificamente formulados para bebês, incluindo loções, óleos e toalhas umedecidas.",
      "es": "Productos específicamente formulados para bebés, incluyendo lociones, aceites y toallitas.",
      "zh": "专为婴儿配制的产品，包括乳液、精油和湿巾。",
    },
    complianceByCountry: {
      brazil: {
        regulator: "ANVISA",
        regulationName: "RDC 729/2023 / RDC 430/2020",
        registrationRequired: true,
        registrationType: "Registro",
        testingRequirements: [
          "Toxicological assessment for pediatric use",
          "Dermal tolerance in infants",
          "Fragrance-free verification if claimed",
        ],
        notes: "Baby products require the highest safety scrutiny and Registro. Many ingredients permitted in adult cosmetics are prohibited in baby products.",
      },
      mexico: {
        regulator: "COFEPRIS",
        regulationName: "NOM-141-SSA1",
        registrationRequired: true,
        registrationType: "Registro Sanitario",
        testingRequirements: [
          "Pediatric safety evaluation",
          "Hypoallergenic claim substantiation if applicable",
        ],
        notes: "Baby products have the most stringent ingredient restrictions.",
      },
    },
    commonRestrictedIngredients: [
      "formaldehyde",
      "quaternium-15",
      "triclosan",
      "corticosteroids",
    ],
    labelRequirements: {
      "en": [
        "Age suitability (e.g., 'for babies 0+ months')",
        "Pediatrician tested claim if applicable",
        "Hypoallergenic claim if substantiated",
        "Alcohol-free indication",
      ],
      "pt-BR": [
        "Idade recomendada (ex: 'para bebês de 0+ meses')",
        "Alegação de testado por pediatra se aplicável",
        "Alegação de hipoalergênico se comprovado",
        "Indicação de livre de álcool",
      ],
      "es": [
        "Edad recomendada (ej: 'para bebés de 0+ meses')",
        "Afirmación de testado por pediatra si aplica",
        "Afirmación de hipoalergénico si está sustentado",
        "Indicación libre de alcohol",
      ],
      "zh": [
        "适用年龄（如'适用0+个月婴儿'）",
        "如适用标注儿科医生测试",
        "如有依据标注低敏",
        "无酒精标示",
      ],
    },
  },
  {
    slug: "oral-care",
    names: {
      "en": "Oral Care",
      "pt-BR": "Cuidados Bucais",
      "es": "Cuidado Oral",
      "zh": "口腔护理",
    },
    descriptions: {
      "en": "Toothpaste, mouthwash, and other oral hygiene products.",
      "pt-BR": "Creme dental, enxaguante bucal e outros produtos de higiene oral.",
      "es": "Pasta de dientes, enjuague bucal y otros productos de higiene oral.",
      "zh": "牙膏、漱口水和其他口腔卫生产品。",
    },
    complianceByCountry: {
      brazil: {
        regulator: "ANVISA",
        regulationName: "RDC 530/2021 / RDC 729/2023",
        registrationRequired: true,
        registrationType: "Registro",
        testingRequirements: [
          "Fluoride content verification",
          "Microbiological limits for oral use",
          "Toxicological assessment for ingestion risk",
        ],
        notes: "Oral care products are regulated as a special category with specific fluoride limits. Toothpaste requires Registro.",
      },
      mexico: {
        regulator: "COFEPRIS",
        regulationName: "NOM-141-SSA1 / NOM-013-SSA2",
        registrationRequired: true,
        registrationType: "Registro Sanitario",
        testingRequirements: [
          "Fluoride concentration limits",
          "Oral toxicity assessment",
        ],
        notes: "NOM-013-SSA2 governs oral care products specifically.",
      },
    },
    commonRestrictedIngredients: [
      "triclosan",
      "formaldehyde",
    ],
    labelRequirements: {
      "en": [
        "Fluoride concentration (ppm or %)",
        "Children's use warnings if fluoride present",
        "Recommended usage amount",
        "Do not swallow warning",
      ],
      "pt-BR": [
        "Concentração de flúor (ppm ou %)",
        "Advertências de uso infantil se houver flúor",
        "Quantidade recomendada de uso",
        "Advertência de não engolir",
      ],
      "es": [
        "Concentración de fluoruro (ppm o %)",
        "Advertencias de uso infantil si hay fluoruro",
        "Cantidad recomendada de uso",
        "Advertencia de no tragar",
      ],
      "zh": [
        "氟浓度（ppm或%）",
        "含氟产品的儿童使用警告",
        "推荐使用量",
        "勿吞吞警告",
      ],
    },
  },
  {
    slug: "nail-products",
    names: {
      "en": "Nail Products",
      "pt-BR": "Produtos para Unhas",
      "es": "Productos para Uñas",
      "zh": "指甲产品",
    },
    descriptions: {
      "en": "Nail polish, removers, hardeners, and artificial nail products.",
      "pt-BR": "Esmalte, removedores, endurecedores e produtos de unhas artificiais.",
      "es": "Esmalte, removedores, endurecedores y productos de uñas artificiales.",
      "zh": "指甲油、洗甲水、硬甲剂和人工指甲产品。",
    },
    complianceByCountry: {
      brazil: {
        regulator: "ANVISA",
        regulationName: "RDC 729/2023",
        registrationRequired: true,
        registrationType: "Registro",
        testingRequirements: [
          "Formaldehyde resin screening",
          "Toluene and DBP limit verification",
          "Nail product specific safety data",
        ],
        notes: "Nail products often contain solvents and resins with specific restrictions. Formaldehyde-based hardeners are regulated.",
      },
      mexico: {
        regulator: "COFEPRIS",
        regulationName: "NOM-141-SSA1",
        registrationRequired: true,
        registrationType: "Registro Sanitario",
        testingRequirements: [
          "Solvent safety assessment",
          "Formaldehyde content verification",
        ],
        notes: "Nail polish removers with acetone require proper labeling.",
      },
    },
    commonRestrictedIngredients: [
      "formaldehyde",
      "lead",
      "cadmium",
      "arsenic",
    ],
    labelRequirements: {
      "en": [
        "Flammable warning for solvent-based products",
        "Professional use only for certain hardeners",
        "Ventilation recommendation",
        "Keep away from children",
      ],
      "pt-BR": [
        "Advertência de inflamabilidade para produtos à base de solvente",
        "Uso profissional apenas para certos endurecedores",
        "Recomendação de ventilação",
        "Manter fora do alcance de crianças",
      ],
      "es": [
        "Advertencia de inflamabilidad para productos a base de solvente",
        "Uso profesional solo para ciertos endurecedores",
        "Recomendación de ventilación",
        "Mantener fuera del alcance de niños",
      ],
      "zh": [
        "含溶剂产品易燃警告",
        "某些硬甲剂仅限专业使用",
        "通风建议",
        "置于儿童不可触及处",
      ],
    },
  },
]

export function getAllProductTypeSlugs(): string[] {
  return productTypes.map((p) => p.slug)
}

export function getProductTypeData(slug: string): ProductTypeData | undefined {
  return productTypes.find((p) => p.slug === slug)
}
