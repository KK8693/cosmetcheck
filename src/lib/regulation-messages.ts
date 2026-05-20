// CosmetCheck Regulation Messages Translation Layer
// Maps ruleId + locale → translated message & suggestion

// === Regulation message translations ===
// Structure: locale -> ruleId -> { message, suggestion }

interface RegulationTranslation {
  message: string
  suggestion: string
}

type RegulationDictionary = Record<string, RegulationTranslation>

// English (fallback / source of truth)
const enRegulations: RegulationDictionary = {
  // === Banned Ingredients (Brazil) ===
  'BR-ING-001': {
    message: 'Mercury (Mercúrio) is prohibited in cosmetics by ANVISA RDC 529/2021.',
    suggestion: 'Remove mercury compounds from the formula.',
  },
  'BR-ING-002': {
    message: 'Lead (Chumbo) compounds are prohibited in cosmetics.',
    suggestion: 'Remove lead and its compounds from the formula.',
  },
  'BR-ING-003': {
    message: 'Hydroquinone is restricted and generally prohibited in cosmetic products.',
    suggestion: 'Remove hydroquinone or reformulate as a pharmaceutical product.',
  },
  'BR-ING-004': {
    message: 'Corticosteroids are prohibited in cosmetics without medical prescription.',
    suggestion: 'Remove corticosteroids or obtain pharmaceutical registration.',
  },
  'BR-ING-005': {
    message: 'Formaldehyde is prohibited in cosmetics except as preservative trace below 0.2%.',
    suggestion: 'Ensure formaldehyde concentration is below 0.2% or remove entirely.',
  },
  'BR-ING-006': {
    message: 'Parabens are restricted. Maximum concentration: 0.4% for single, 0.8% for mixture.',
    suggestion: 'Verify paraben concentration complies with ANVISA limits.',
  },
  'BR-ING-007': {
    message: 'Retinol (Vitamin A) concentration exceeds safe cosmetic limits (>0.3%).',
    suggestion: 'Reduce retinol concentration to 0.3% or below for cosmetic use.',
  },
  // === Claim Violations (Brazil) ===
  'BR-CLAIM-001': {
    message: "Cosmetics cannot claim to cure, treat, or prevent diseases. Must include 'este produto não é um medicamento' (this product is not a medicine).",
    suggestion: 'Remove medical/therapeutic claims. Use cosmetic claims only (moisturizing, cleansing, beautifying).',
  },
  'BR-CLAIM-002': {
    message: "Absolute whitening claims are prohibited - no 'permanent whitening', 'complete melanin elimination'. Hydroquinone is banned in cosmetics. Use 'helps brighten skin tone' instead.",
    suggestion: "Replace with compliant claims: 'helps brighten skin tone', 'evens skin tone'.",
  },
  'BR-CLAIM-003': {
    message: "Sunscreen products must display SPF and UVA/UVB protection. Absolute claims like 'total protection' or 'no reapplication needed' are prohibited per RDC 907/2024.",
    suggestion: 'Include SPF value and UVA/UVB labels. Avoid absolute protection claims.',
  },
  'BR-CLAIM-004': {
    message: 'Cosmetics cannot claim hair loss prevention or hair growth promotion. These claims require ANVISA medicine registration.',
    suggestion: 'Use cosmetic hair care claims: moisturizing, conditioning, shine.',
  },
  'BR-CLAIM-005': {
    message: 'Breast enlargement/firming claims are prohibited for cosmetics. These require pharmaceutical registration.',
    suggestion: 'Remove breast enhancement claims. Use body care cosmetic claims only.',
  },
  // === Absolute Claims ===
  'BR-ABS-001': {
    message: "Absolute terms like 'permanent', 'completely cure', 'forever' are prohibited. Use 'helps maintain' instead.",
    suggestion: "Replace with: 'helps maintain', 'supports', 'assists with'.",
  },
  'BR-ABS-002': {
    message: "Fixed-day efficacy claims (e.g., 'in 3 days', 'in 7 days') and absolute effectiveness guarantees (e.g., '100% effective', 'guaranteed results') are prohibited. Efficacy must be scientifically substantiated.",
    suggestion: "Remove fixed-time claims. Use: 'with regular use', 'gradually improves'.",
  },
  'BR-ABS-003': {
    message: "Claims like 'medical grade', 'clinical formula', 'clinical grade' that imply medicinal efficacy are prohibited. Cosmetics cannot mimic drug marketing.",
    suggestion: "Remove medical/clinical terminology. Use: 'developed with care', 'premium formula'.",
  },
  'BR-ABS-004': {
    message: "Safety claims require test support. Absolute terms like 'no risk at all', 'never causes sensitization' are prohibited. Low sensitization requires clinical validation.",
    suggestion: "Use: 'tested for skin compatibility', 'suitable for sensitive skin' (with proof).",
  },
  'BR-ABS-005': {
    message: "Claims of suitability for all skin types without scientific evidence are prohibited. Test support required. Use 'compatible with most skin types' or 'suitable for dry/oily/normal skin' instead.",
    suggestion: 'Specify tested skin types or conduct compatibility testing.',
  },
  'BR-ABS-006': {
    message: "Absolute effectiveness guarantees like '100% effective' are prohibited. Efficacy varies by individual. Use 'results may vary' or 'works best with regular use' instead.",
    suggestion: "Remove absolute guarantees. Add: 'results may vary by individual'.",
  },
  // === Special Population ===
  'BR-POP-001': {
    message: 'Claims suitability for infants, pregnant women require specific labeling of applicable age and special condition warnings. Infant products require separate registration.',
    suggestion: 'Obtain infant product registration or remove infant/pregnancy claims.',
  },
  // === Mexico ===
  'MX-ING-001': {
    message: 'Mercury (Mercurio) is prohibited in cosmetics by COFEPRIS NOM-141-SSA1/SCF1-2012.',
    suggestion: 'Remove mercury compounds from the formula.',
  },
  'MX-ING-002': {
    message: 'Lead (Plomo) compounds are prohibited in cosmetics.',
    suggestion: 'Remove lead and its compounds from the formula.',
  },
  'MX-ING-003': {
    message: 'Hydroquinone is prohibited for skin lightening in cosmetics (NOM-141-SSA1/SCF1-2012).',
    suggestion: 'Remove hydroquinone. Use alternative brightening agents like alpha-arbutin.',
  },
  'MX-ING-004': {
    message: 'Corticosteroids are prohibited in cosmetic products.',
    suggestion: 'Remove corticosteroids - product must be registered as medicine.',
  },
  'MX-ING-005': {
    message: 'Formaldehyde releasers are restricted. Maximum 0.2% formaldehyde release.',
    suggestion: 'Ensure formaldehyde release does not exceed 0.2%. Use alternative preservatives.',
  },


  // === Mexico Banned & Claims (auto-translated) ===
  'MX-BAN-001': {
    message: 'Mercury is a heavy metal prohibited in cosmetics.',
    suggestion: 'Remove mercury compounds from the formula.',
  },
  'MX-BAN-002': {
    message: 'All mercury compounds (e.g. mercuric chloride, mercuric oxide) are prohibited in cosmetics.',
    suggestion: 'Remove all mercury compounds from the formula.',
  },
  'MX-BAN-003': {
    message: 'Lead is a heavy metal prohibited in cosmetics.',
    suggestion: 'Remove lead and its compounds from the formula.',
  },
  'MX-BAN-004': {
    message: 'Arsenic is a heavy metal prohibited in cosmetics.',
    suggestion: 'Remove arsenic and its compounds from the formula.',
  },
  'MX-BAN-005': {
    message: 'Cadmium is a heavy metal prohibited in cosmetics.',
    suggestion: 'Remove cadmium and its compounds from the formula.',
  },
  'MX-BAN-006': {
    message: 'Hydroquinone is prohibited for skin lightening in cosmetics (NOM-141-SSA1/SCF1-2012).',
    suggestion: 'Remove hydroquinone. Use alternative brightening agents like alpha-arbutin.',
  },
  'MX-BAN-007': {
    message: 'Tretinoin is a pharmaceutical-grade ingredient prohibited in cosmetics.',
    suggestion: 'Remove tretinoin. If used, the product must be registered as a medicine with COFEPRIS.',
  },
  'MX-BAN-008': {
    message: 'Retinoic acid is a pharmaceutical-grade ingredient prohibited in cosmetics.',
    suggestion: 'Remove retinoic acid. If used, the product must be registered as a medicine with COFEPRIS.',
  },
  'MX-BAN-009': {
    message: 'Hexachlorophene is prohibited in cosmetics.',
    suggestion: 'Remove hexachlorophene from the formula.',
  },
  'MX-BAN-010': {
    message: 'Bithionol is prohibited in cosmetics.',
    suggestion: 'Remove bithionol from the formula.',
  },
  'MX-BAN-011': {
    message: 'Cloroxylenol (PCMX) is prohibited in cosmetics.',
    suggestion: 'Remove cloroxylenol from the formula.',
  },
  'MX-BAN-012': {
    message: 'Mequinol is prohibited in cosmetics.',
    suggestion: 'Remove mequinol from the formula.',
  },
  'MX-BAN-013': {
    message: 'Corticosteroids are hormone drugs prohibited in cosmetics.',
    suggestion: 'Remove corticosteroids. The product must be registered as a medicine with COFEPRIS.',
  },
  'MX-BAN-014': {
    message: 'Hydrocortisone is a corticosteroid prohibited in cosmetics.',
    suggestion: 'Remove hydrocortisone. The product must be registered as a medicine with COFEPRIS.',
  },
  'MX-BAN-015': {
    message: 'Betamethasone is a corticosteroid prohibited in cosmetics.',
    suggestion: 'Remove betamethasone. The product must be registered as a medicine with COFEPRIS.',
  },
  'MX-BAN-016': {
    message: 'Chloramphenicol is an antibiotic prohibited in cosmetics.',
    suggestion: 'Remove chloramphenicol from the formula.',
  },
  'MX-BAN-017': {
    message: 'Tretinoin is a pharmaceutical-grade ingredient prohibited in cosmetics.',
    suggestion: 'Remove tretinoin. If used, the product must be registered as a medicine with COFEPRIS.',
  },
  'MX-CLAIM-001': {
    message: `Cosmetics cannot use medical treatment terms (e.g. 'cure', 'anti-inflammatory', 'antibacterial') or claim drug efficacy such as treating acne or wound healing.`,
    suggestion: 'Remove medical/therapeutic claims. Use cosmetic claims only.',
  },
  'MX-CLAIM-002': {
    message: `Absolute claims like '100% natural', 'no chemicals', 'organic' are prohibited without scientific evidence.`,
    suggestion: 'Remove absolute claims or provide valid certification.',
  },
  'MX-CLAIM-003': {
    message: `Sunscreen products must display SPF and UVA/UVB protection. Absolute claims like 'total protection' or 'no reapplication needed' are prohibited.`,
    suggestion: 'Include SPF value and UVA/UVB labels. Avoid absolute protection claims.',
  },
  'MX-CLAIM-004': {
    message: `Absolute safety claims without evidence are prohibited, such as 'zero risk', 'never causes allergies', 'safe for everyone'.`,
    suggestion: `Use claims with evidence such as 'tested for skin compatibility'.`,
  },
  'MX-CLAIM-005': {
    message: `Anti-aging claims require scientific evidence. Absolute claims like 'completely eliminates wrinkles', 'stops aging', '10 years younger' are prohibited.`,
    suggestion: `Use compliant claims like 'helps improve skin appearance'.`,
  },
  'MX-CLAIM-006': {
    message: `Misleading FDA-related claims are prohibited, such as 'FDA approved', 'FDA certified', 'pharmaceutical grade'.`,
    suggestion: 'Remove FDA-related claims. Use product efficacy claims.',
  },
  'MX-CLAIM-007': {
    message: 'Dermatologist-tested claims require valid and authentic test reports.',
    suggestion: 'Ensure you have valid dermatological test reports.',
  },
  'MX-CLAIM-008': {
    message: `Hypoallergenic claims require clinical testing support. Using 'hypoallergenic' or 'allergy-free' without evidence is prohibited.`,
    suggestion: 'Provide clinical hypoallergenic testing proof.',
  },
  'MX-CLAIM-009': {
    message: 'Cruelty-free claims require valid documentation.',
    suggestion: 'Ensure you have valid cruelty-free certification.',
  },
  'MX-CLAIM-010': {
    message: `Cosmetics cannot claim to cure, treat, or prevent diseases. Terms like 'cure', 'root cause treatment', 'completely solve' are prohibited.`,
    suggestion: 'Remove cure/treatment claims. Use cosmetic claims only.',
  },
  'MX-CLAIM-011': {
    message: `Claims of cellulite removal are prohibited, such as 'fat burning', 'burns fat', 'completely eliminates cellulite'.`,
    suggestion: `Remove cellulite removal claims. Use 'helps improve skin appearance'.`,
  },
  'MX-CLAIM-012': {
    message: 'Breast enhancement claims are prohibited for cosmetics and require drug registration.',
    suggestion: 'Remove breast enhancement claims. Use body care cosmetic claims only.',
  },
  'MX-CLAIM-013': {
    message: `Absolute permanent efficacy claims are prohibited, such as 'permanent', 'thorough', 'root cause treatment', 'forever', 'guaranteed lasting results'.`,
    suggestion: `Remove permanent/thorough claims. Use 'helps maintain' or 'long-lasting care'.`,
  },
  'MX-CLAIM-014': {
    message: `Promises of specific timeframes and absolute results are prohibited, such as 'results in 7 days', '100% effective', 'immediate results', 'guaranteed results'.`,
    suggestion: `Remove fixed-time claims. Use 'with consistent use' or 'gradual improvement'.`,
  },
  'MX-CLAIM-015': {
    message: `Medical-grade claims are prohibited, such as 'medical grade', 'medical formula', 'clinical grade', 'professional treatment'. Cosmetics cannot mimic drug marketing.`,
    suggestion: `Remove medical/clinical terminology. Use 'carefully developed' or 'premium formula'.`,
  },
  'MX-CLAIM-016': {
    message: 'Special population claims (infants, pregnant women, children, newborns) require special approval and warning labels.',
    suggestion: 'Obtain infant product registration or remove infant/pregnancy claims.',
  },
  'MX-CLAIM-017': {
    message: `Absolute whitening claims are prohibited, such as 'eliminates all spots', 'only effective one', 'permanent whitening', 'completely eliminates melanin'.`,
    suggestion: `Replace with compliant claims: 'helps brighten skin tone', 'evens skin tone'.`,
  },
  'MX-CLAIM-018': {
    message: 'Hair loss prevention / hair growth claims are prohibited for cosmetics and require drug registration.',
    suggestion: 'Remove hair loss/growth claims. Use hair care cosmetic claims only.',
  },
  'MX-CLAIM-019': {
    message: `Absolute detox/purification claims without evidence are prohibited, such as 'completely removes toxins', 'deep purification'.`,
    suggestion: `Remove absolute detox/purification claims. Use 'cleans skin'.`,
  },
  'MX-CLAIM-020': {
    message: `Absolute price claims are prohibited, such as 'best price', 'lowest price', 'exclusive offer'.`,
    suggestion: 'Remove absolute price claims. Use market price descriptions.',
  },
  'MX-CLAIM-021': {
    message: `Medical-grade cell regeneration/repair claims are prohibited, such as 'cell regeneration', 'tissue repair', 'completely renews skin'.`,
    suggestion: `Remove cell regeneration/repair claims. Use 'moisturizes skin'.`,
  },
  'MX-CLAIM-022': {
    message: `Comparative/derogatory competitor claims are prohibited, such as 'better than competitors', 'unmatched in the market', 'surpasses all other products'.`,
    suggestion: 'Remove comparative/derogatory competitor claims. Use product feature descriptions.',
  },
}

// Chinese translations
const zhRegulations: RegulationDictionary = {
  'BR-ING-001': {
    message: '汞（Mercúrio）被 ANVISA RDC 529/2021 禁止用于化妆品。',
    suggestion: '从配方中去除汞化合物。',
  },
  'BR-ING-002': {
    message: '铅（Chumbo）化合物禁止用于化妆品。',
    suggestion: '从配方中去除铅及其化合物。',
  },
  'BR-ING-003': {
    message: '氢醌（Hydroquinone）在化妆品中受限制且通常被禁止。',
    suggestion: '去除氢醌，或重新配方为药品。',
  },
  'BR-ING-004': {
    message: '皮质类固醇禁止用于化妆品，除非有医疗处方。',
    suggestion: '去除皮质类固醇，或获得药品注册。',
  },
  'BR-ING-005': {
    message: '甲醛禁止用于化妆品，除非作为防腐剂痕迹低于 0.2%。',
    suggestion: '确保甲醛浓度低于 0.2%，或完全去除。',
  },
  'BR-ING-006': {
    message: '对羟基苯甲酸酯（Parabens）受限制。单一最高 0.4%，混合物最高 0.8%。',
    suggestion: '验证对羟基苯甲酸酯浓度符合 ANVISA 限制。',
  },
  'BR-ING-007': {
    message: '视黄醇（维生素A）浓度超过安全化妆品限值（>0.3%）。',
    suggestion: '将视黄醇浓度降至 0.3% 或以下。',
  },
  'BR-ABS-001': {
    message: "禁止使用'永久'、'彻底治愈'、'永远'等绝对化用语。请改用'帮助维持'。",
    suggestion: "替换为：'帮助维持'、'支持'、'辅助'。",
  },
  'BR-ABS-002': {
    message: "禁止承诺具体时效（如'3天见效'、'7天见效'）和绝对效果保证（如'100%有效'、'保证效果'）。功效必须有科学依据。",
    suggestion: "去除固定时间宣称。使用：'坚持使用'、'逐渐改善'。",
  },
  'BR-ABS-003': {
    message: "禁止使用'医疗级'、'临床配方'、'临床级别'等暗示药用功效的宣称。化妆品不得模仿药品营销。",
    suggestion: "去除医疗/临床术语。使用：'精心研发'、'优质配方'。",
  },
  'BR-ABS-004': {
    message: "安全宣称需要测试支持。禁止使用'零风险'、'永不致敏'等绝对化用语。低致敏性需要临床验证。",
    suggestion: "使用：'经过皮肤兼容性测试'、'适合敏感肌肤'（需有证明）。",
  },
  'BR-ABS-005': {
    message: "禁止无科学依据地宣称适用于所有肤质。需要测试支持。请改用'兼容大多数肤质'或'适用于干/油/中性皮肤'。",
    suggestion: '明确说明经过测试的肤质，或进行兼容性测试。',
  },
  'BR-ABS-006': {
    message: "禁止'100%有效'等绝对效果保证。功效因人而异。请改用'效果可能因人而异'或'坚持使用效果最佳'。",
    suggestion: "去除绝对保证。添加：'效果可能因人而异'。",
  },
  'BR-POP-001': {
    message: '宣称适用于婴儿、孕妇需要明确标注适用年龄和特殊状况警告。婴儿产品需要单独注册。',
    suggestion: '获得婴儿产品注册，或去除婴儿/孕妇宣称。',
  },
  'MX-ING-001': {
    message: '汞（Mercurio）被 COFEPRIS NOM-141-SSA1/SCF1-2012 禁止用于化妆品。',
    suggestion: '从配方中去除汞化合物。',
  },
  'MX-ING-002': {
    message: '铅（Plomo）化合物禁止用于化妆品。',
    suggestion: '从配方中去除铅及其化合物。',
  },
  'MX-ING-003': {
    message: '氢醌禁止用于化妆品美白（NOM-141-SSA1/SCF1-2012）。',
    suggestion: '去除氢醌。使用替代美白成分如 α-熊果苷。',
  },
  'MX-ING-004': {
    message: '皮质类固醇（Corticosteroids）属于激素类药物，禁止添加到化妆品中。',
    suggestion: '去除皮质类固醇。产品必须按药品向COFEPRIS注册。',
  },
  'MX-ING-005': {
    message: '甲醛释放体受限制。最大 0.2% 甲醛释放量。',
    suggestion: '确保甲醛释放不超过 0.2%。使用替代防腐剂。',
  },

  // === Mexico Banned Ingredients ===
  'MX-BAN-001': {
    message: '汞（Mercury）是重金属，禁止用于化妆品。',
    suggestion: '从配方中去除汞化合物。',
  },
  'MX-BAN-002': {
    message: '所有汞化合物（如氯化汞、氧化汞）均禁止用于化妆品。',
    suggestion: '从配方中去除所有汞化合物。',
  },
  'MX-BAN-003': {
    message: '铅（Lead）是重金属，禁止用于化妆品。',
    suggestion: '从配方中去除铅及其化合物。',
  },
  'MX-BAN-004': {
    message: '砷（Arsenic）是重金属，禁止用于化妆品。',
    suggestion: '从配方中去除砷及其化合物。',
  },
  'MX-BAN-005': {
    message: '镉（Cadmium）是重金属，禁止用于化妆品。',
    suggestion: '从配方中去除镉及其化合物。',
  },
  'MX-BAN-006': {
    message: '氢醌（Hydroquinone）禁止用于化妆品美白（NOM-141-SSA1/SCF1-2012）。',
    suggestion: '去除氢醌。使用替代美白成分如 α-熊果苷。',
  },
  'MX-BAN-007': {
    message: '维A酸（Tretinoin）属于药品级成分，禁止用于化妆品。',
    suggestion: '去除维A酸。若使用，产品必须按药品向COFEPRIS注册。',
  },
  'MX-BAN-008': {
    message: '视黄酸（Retinoic Acid）属于药品级成分，禁止用于化妆品。',
    suggestion: '去除视黄酸。若使用，产品必须按药品向COFEPRIS注册。',
  },
  'MX-BAN-009': {
    message: '六氯酚（Hexachlorophene）禁止用于化妆品。',
    suggestion: '从配方中去除六氯酚。',
  },
  'MX-BAN-010': {
    message: '硫双二氯酚（Bithionol）禁止用于化妆品。',
    suggestion: '从配方中去除硫双二氯酚。',
  },
  'MX-BAN-011': {
    message: '氯二甲苯酚（Cloroxylenol/PCMX）禁止用于化妆品。',
    suggestion: '从配方中去除氯二甲苯酚。',
  },
  'MX-BAN-012': {
    message: '对苯二酚甲醚（Mequinol）禁止用于化妆品。',
    suggestion: '从配方中去除对苯二酚甲醚。',
  },
  'MX-BAN-013': {
    message: '皮质类固醇（Corticosteroids）属于激素类药物，禁止添加到化妆品中。',
    suggestion: '去除皮质类固醇。产品必须按药品向COFEPRIS注册。',
  },
  'MX-BAN-014': {
    message: '氢化可的松（Hydrocortisone）属于皮质类固醇，禁止用于化妆品。',
    suggestion: '去除氢化可的松。产品必须按药品向COFEPRIS注册。',
  },
  'MX-BAN-015': {
    message: '倍他米松（Betamethasone）属于皮质类固醇，禁止用于化妆品。',
    suggestion: '去除倍他米松。产品必须按药品向COFEPRIS注册。',
  },
  'MX-BAN-016': {
    message: '氯霉素（Chloramphenicol）是抗生素，禁止用于化妆品。',
    suggestion: '从配方中去除氯霉素。',
  },
  'MX-BAN-017': {
    message: '维A酸类（Retinoids）属于药品级成分，化妆品中禁止使用。',
    suggestion: '去除维A酸类成分。若使用，产品必须按药品向COFEPRIS注册。',
  },
  // === Mexico Claims ===
  'MX-CLAIM-001': {
    message: '化妆品不得声称治愈、治疗或预防疾病。',
    suggestion: '仅使用化妆品声称（保湿、清洁、美化、香氛、防护）。',
  },
  'MX-CLAIM-002': {
    message: '禁止使用"百分百天然"、"无化学成分"、"有机"等绝对化无添加/纯天然声称，需要科学证据支撑。',
    suggestion: '去除绝对化用语，或提供有效认证。',
  },
  'MX-CLAIM-003': {
    message: '防晒产品必须标示SPF值和UVA/UVB防护。禁止"完全防护"、"无需补涂"等绝对化声称。',
    suggestion: '标示SPF值和UVA/UVB标签。避免绝对防护声称。',
  },
  'MX-CLAIM-004': {
    message: '禁止无依据的安全绝对化声称，如"零风险"、"绝不致敏"、"人人安全"等。',
    suggestion: '使用"经过皮肤兼容性测试"等有据声称。',
  },
  'MX-CLAIM-005': {
    message: '抗衰老声称需要科学证据支撑，禁止"完全消除皱纹"、"停止衰老"、"年轻10岁"等绝对化声称。',
    suggestion: '使用"有助于改善皮肤外观"等合规声称。',
  },
  'MX-CLAIM-006': {
    message: '禁止误导性FDA相关声称，如"FDA批准"、"FDA认证"、"药品级"等。',
    suggestion: '去除FDA相关声称。使用产品功效声称。',
  },
  'MX-CLAIM-007': {
    message: '皮肤科医生测试声称需要真实有效的测试报告支撑。',
    suggestion: '确保拥有真实有效的皮肤科测试报告。',
  },
  'MX-CLAIM-008': {
    message: '低致敏声称需要临床测试支持，禁止无证据使用"低致敏"、"无过敏"等。',
    suggestion: '提供低致敏性临床测试证明。',
  },
  'MX-CLAIM-009': {
    message: '无残忍测试声称需要有效的证明文件支撑。',
    suggestion: '确保拥有有效的无残忍测试证明。',
  },
  'MX-CLAIM-010': {
    message: '化妆品不得声称治愈、治疗或预防疾病，禁止使用"治愈"、"根治"、"彻底解决"等术语。',
    suggestion: '去除治愈/治疗声称。仅使用化妆品声称。',
  },
  'MX-CLAIM-011': {
    message: '禁止声称去除脂肪团，如"燃脂"、"脂肪燃烧"、"完全消除橘皮"等。',
    suggestion: '去除脂肪团去除声称。使用"有助于改善皮肤外观"。',
  },
  'MX-CLAIM-012': {
    message: '丰胸声称对化妆品是禁止的，需要药品注册。',
    suggestion: '去除丰胸声称。仅使用身体护理化妆品声称。',
  },
  'MX-CLAIM-013': {
    message: '禁止绝对化永久功效声称，如"永久"、"彻底"、"根治"、"永远"、"保证持久效果"等。',
    suggestion: '去除永久/彻底声称。使用"有助于维护"或"持久保养"。',
  },
  'MX-CLAIM-014': {
    message: '禁止承诺具体时效和绝对效果，如"7天见效"、"100%有效"、"立即见效"、"保证结果"等。',
    suggestion: '去除固定时间声称。使用"坚持使用"、"逐渐改善"。',
  },
  'MX-CLAIM-015': {
    message: '禁止医疗化声称，如"医疗级"、"医学配方"、"临床级"、"专业治疗"等。化妆品不得模仿药品营销。',
    suggestion: '去除医疗/临床术语。使用"精心研发"、"优质配方"。',
  },
  'MX-CLAIM-016': {
    message: '特殊人群（婴儿、孕妇、儿童、新生儿）声称需要特殊审批和标签警示。',
    suggestion: '获得婴儿产品注册，或去除婴儿/孕妇声称。',
  },
  'MX-CLAIM-017': {
    message: '禁止绝对化美白声称，如"消除所有斑点"、"唯一有效"、"永久美白"、"完全消除黑色素"等。',
    suggestion: '替换为合规声称："帮助提亮肤色"、"均匀肤色"。',
  },
  'MX-CLAIM-018': {
    message: '防脱发/生发声称对化妆品是禁止的，需要药品注册。',
    suggestion: '去除防脱发/生发声称。仅使用护发化妆品声称。',
  },
  'MX-CLAIM-019': {
    message: '禁止无依据的排毒/净化绝对化声称，如"完全清除毒素"、"深层净化"等。',
    suggestion: '去除排毒/净化绝对化声称。使用"清洁皮肤"。',
  },
  'MX-CLAIM-020': {
    message: '禁止价格绝对化声称，如"最优价格"、"最低价格"、"独家优惠"等。',
    suggestion: '去除价格绝对化声称。使用市场价格描述。',
  },
  'MX-CLAIM-021': {
    message: '禁止细胞再生/修复等医疗级声称，如"细胞再生"、"修复组织"、"完全焕新皮肤"等。',
    suggestion: '去除细胞再生/修复声称。使用"滋润皮肤"。',
  },
  'MX-CLAIM-022': {
    message: '禁止对比/贬低竞品声称，如"优于竞争对手"、"市场上无与伦比"、"超越所有其他产品"等。',
    suggestion: '去除对比/贬低竞品声称。使用产品特点描述。',
  },
  // === Brazil Claims (auto-translated) ===
  'BR-CLAIM-001': {
    message: `化妆品不得声称治愈、治疗或预防疾病。必须包含'este produto não é um medicamento'（本产品不是药品）。`,
    suggestion: '去除医疗/治疗性宣称。仅使用化妆品宣称（保湿、清洁、美化）。',
  },
  'BR-CLAIM-002': {
    message: `禁止绝对化美白宣称——不得使用'永久美白'、'完全消除黑色素'。氢醌禁止用于化妆品。请改用'帮助提亮肤色'。`,
    suggestion: `替换为合规宣称：'帮助提亮肤色'、'均匀肤色'。`,
  },
  'BR-CLAIM-003': {
    message: `防晞产品必须标明SPF和UVA/UVB防护。禁止使用'完全防护'或'无需补涂'等绝对化宣称（RDC 907/2024）。`,
    suggestion: '包含SPF值和UVA/UVB标识。避免绝对防护宣称。',
  },
  'BR-CLAIM-004': {
    message: '化妆品不得声称防脱发或促进生发。这些宣称需要ANVISA药品注册。',
    suggestion: '使用化妆品护发宣称：保湿、调理、光泽。',
  },
  'BR-CLAIM-005': {
    message: '丰胸/紧致宣称对化妆品是禁止的。这些需要药品注册。',
    suggestion: '去除丰胸增强宣称。仅使用身体护理化妆品宣称。',
  },
  'BR-CLAIM-006': {
    message: '化妆品不得声称减肥、瘦身或燃脂效果。',
    suggestion: '去除减肥/瘦身宣称。仅使用身体护理化妆品宣称。',
  },
  'BR-CLAIM-007': {
    message: `妊娠纹宣称需要科学证据支撑。避免绝对化用语如'完全消除妊娠纹'。`,
    suggestion: `使用'帮助改善皮肤外观'等合规宣称。`,
  },
  'BR-CLAIM-008': {
    message: `禁止使用'立即'、'瞬间'、'即刻'等绝对化时效用语。`,
    suggestion: `替换为：'逐渐'、'持续使用'、'定期护理'。`,
  },
  'BR-CLAIM-009': {
    message: `禁止使用'100%'、'彻底'、'根治'等绝对化功效用语。`,
    suggestion: `替换为：'有助于'、'帮助改善'、'支持'。`,
  },
  'BR-CLAIM-010': {
    message: `禁止使用'医疗级'或'药品级'等可能误导消费者的宣称。化妆品不得暗示药用功效。`,
    suggestion: `去除医疗/临床术语。使用'精心研发'、'优质配方'。`,
  },
  'BR-CLAIM-011': {
    message: '抗菌宣称需要特定合规要求。部分产品可能需要消毒产品注册。',
    suggestion: '确保拥有有效的抗菌测试证明，或去除抗菌宣称。',
  },
  'BR-CLAIM-012': {
    message: '止汗剂和除臭剂属于不同产品类别。止汗剂需要药品注册。',
    suggestion: '正确分类产品。除臭剂仅声称香气/清爽，止汗剂需药品注册。',
  },
  'BR-CLAIM-013': {
    message: `禁止使用'永久'、'彻底治愈'、'永远'等绝对化用语。请改用'帮助维持'。`,
    suggestion: `替换为：'帮助维持'、'支持'、'辅助'。`,
  },
  'BR-CLAIM-014': {
    message: `禁止承诺具体时效（如'3天见效'、'7天见效'）和绝对效果保证（如'100%有效'、'保证效果'）。功效必须有科学依据。`,
    suggestion: `去除固定时间宣称。使用：'坚持使用'、'逐渐改善'。`,
  },
  'BR-CLAIM-015': {
    message: `禁止使用'医疗级'、'临床配方'、'临床级别'等暗示药用功效的宣称。化妆品不得模仿药品营销。`,
    suggestion: `去除医疗/临床术语。使用：'精心研发'、'优质配方'。`,
  },
  'BR-CLAIM-016': {
    message: '宣称适用于婴儿、孕妇需要明确标注适用年龄和特殊状况警告。婴儿产品需要单独注册。',
    suggestion: '获得婴儿产品注册，或去除婴儿/孕妇宣称。',
  },
  'BR-CLAIM-017': {
    message: `避免使用'100%天然'、'无化学成分'等绝对化用语。天然宣称需要有效认证。`,
    suggestion: '去除绝对化用语，或提供有效认证。',
  },
  'BR-CLAIM-018': {
    message: '化妆品不得声称细胞再生、组织修复或其他医疗级效果。',
    suggestion: `去除细胞再生/修复宣称。使用'滋润皮肤'。`,
  },
  'BR-CLAIM-019': {
    message: `避免使用'排毒'、'净化'等暗示药用功效的术语。`,
    suggestion: `去除排毒/净化宣称。使用'清洁皮肤'。`,
  },
  'BR-CLAIM-020': {
    message: '贬低竞争对手或对比广告是禁止的。',
    suggestion: '去除对比/贬低竞品宣称。使用产品特点描述。',
  },
  'BR-CLAIM-021': {
    message: `安全宣称需要测试支持。禁止使用'零风险'、'永不致敏'等绝对化用语。低致敏性需要临床验证。`,
    suggestion: `使用：'经过皮肤兼容性测试'、'适合敏感肌肤'（需有证明）。`,
  },
  'BR-CLAIM-022': {
    message: `禁止使用'完全消除皱纹'、'全面抗衰老'等绝对化用语。请改用'改善皱纹外观'（RDC 907/2024）。`,
    suggestion: `替换为：'有助于改善皱纹外观'、'帮助维持肌肤状态'。`,
  },
  'BR-CLAIM-023': {
    message: `禁止无科学依据地宣称适用于所有肤质。需要测试支持。请改用'兼容大多数肤质'或'适用于干/油/中性皮肤'。`,
    suggestion: '明确说明经过测试的肤质，或进行兼容性测试。',
  },
  'BR-CLAIM-024': {
    message: `禁止'100%有效'等绝对效果保证。功效因人而异。请改用'效果可能因人而异'或'坚持使用效果最佳'。`,
    suggestion: `去除绝对保证。添加：'效果可能因人而异'。`,
  },
}

// Brazilian Portuguese translations
const ptRegulations: RegulationDictionary = {
  'BR-ING-001': {
    message: 'Mercúrio é proibido em cosméticos pela ANVISA RDC 529/2021.',
    suggestion: 'Remova compostos de mercúrio da fórmula.',
  },
  'BR-ING-002': {
    message: 'Compostos de chumbo são proibidos em cosméticos.',
    suggestion: 'Remova chumbo e seus compostos da fórmula.',
  },
  'BR-ING-003': {
    message: 'Hidroquinona é restrita e geralmente proibida em produtos cosméticos.',
    suggestion: 'Remova a hidroquinona ou reformule como produto farmacêutico.',
  },
  'BR-ING-004': {
    message: 'Corticosteroides são proibidos em cosméticos sem prescrição médica.',
    suggestion: 'Remova corticosteroides ou obtenha registro farmacêutico.',
  },
  'BR-ING-005': {
    message: 'Formaldeído é proibido em cosméticos, exceto como traço de conservante abaixo de 0,2%.',
    suggestion: 'Garanta concentração de formaldeído abaixo de 0,2% ou remova completamente.',
  },
  'BR-ING-006': {
    message: 'Parabenos são restritos. Concentração máxima: 0,4% único, 0,8% mistura.',
    suggestion: 'Verifique se a concentração de parabenos está de acordo com os limites da ANVISA.',
  },
  'BR-ING-007': {
    message: 'Concentração de retinol (Vitamina A) excede limites seguros para cosméticos (>0,3%).',
    suggestion: 'Reduza a concentração de retinol para 0,3% ou menos.',
  },
  'BR-CLAIM-001': {
    message: "Cosméticos não podem alegar curar, tratar ou prevenir doenças. Deve incluir 'este produto não é um medicamento'.",
    suggestion: 'Remova alegações médicas/terapêuticas. Use apenas alegações cosméticas (hidratação, limpeza, embelezamento).',
  },
  'BR-CLAIM-002': {
    message: "Alegações absolutas de clareamento são proibidas - não use 'clareamento permanente', 'eliminação completa de melanina'. Hidroquinona é proibida em cosméticos. Use 'ajuda a iluminar o tom da pele'.",
    suggestion: "Substitua por alegações compatíveis: 'ajuda a iluminar o tom da pele', 'uniformiza o tom da pele'.",
  },
  'BR-CLAIM-003': {
    message: "Produtos de proteção solar devem exibir FPS e proteção UVA/UVB. Alegações absolutas como 'proteção total' ou 'sem necessidade de reaplicação' são proibidas pela RDC 907/2024.",
    suggestion: 'Inclua valor de FPS e rótulos UVA/UVB. Evite alegações absolutas de proteção.',
  },
  'BR-CLAIM-004': {
    message: 'Cosméticos não podem alegar prevenção de queda de cabelo ou promoção de crescimento capilar. Essas alegações exigem registro de medicamento da ANVISA.',
    suggestion: 'Use alegações cosméticas para cabelo: hidratação, condicionamento, brilho.',
  },
  'BR-CLAIM-005': {
    message: 'Alegações de aumento/firmeza de seios são proibidas para cosméticos. Esses requerem registro farmacêutico.',
    suggestion: 'Remova alegações de aumento de seios. Use apenas alegações cosméticas de cuidado corporal.',
  },
  'BR-CLAIM-006': {
    message: 'Cosméticos não podem alegar emagrecimento, redução de medidas ou queima de gordura.',
    suggestion: 'Remova alegações de emagrecimento. Use apenas alegações cosméticas de cuidado corporal.',
  },
  'BR-CLAIM-007': {
    message: 'Alegações de estrias precisam de evidência científica. Evite termos absolutos como "eliminação completa de estrias".',
    suggestion: 'Use alegações compatíveis como "ajuda a melhorar a aparência da pele".',
  },
  'BR-CLAIM-008': {
    message: 'É proibido usar termos absolutos de tempo como "imediato", "instantâneo", "resultado imediato".',
    suggestion: 'Substitua por: "gradualmente", "uso contínuo", "cuidado regular".',
  },
  'BR-CLAIM-009': {
    message: 'É proibido usar termos absolutos de eficácia como "100%", "completamente", "cura definitiva".',
    suggestion: 'Substitua por: "ajuda a", "contribui para", "auxilia".',
  },
  'BR-CLAIM-010': {
    message: 'É proibido usar alegações como "grau médico" ou "grau farmacêutico" que possam enganar o consumidor. Cosméticos não devem sugerir efeitos medicinais.',
    suggestion: 'Remova termos médicos/clínicos. Use "cuidadosamente desenvolvido", "fórmula de qualidade".',
  },
  'BR-CLAIM-011': {
    message: 'Alegações antibacterianas exigem requisitos específicos de conformidade. Alguns produtos podem exigir registro como desinfetante.',
    suggestion: 'Garanta comprovação antibacteriana válida ou remova a alegação antibacteriana.',
  },
  'BR-CLAIM-012': {
    message: 'Antitranspirantes e desodorantes pertencem a categorias diferentes. Antitranspirantes exigem registro de medicamento.',
    suggestion: 'Classifique o produto corretamente. Desodorantes apenas alegam fragrância/frescor; antitranspirantes exigem registro farmacêutico.',
  },
  'BR-CLAIM-013': {
    message: 'É proibido usar termos absolutos como "permanente", "cura completa", "para sempre". Substitua por "ajuda a manter".',
    suggestion: 'Substitua por: "ajuda a manter", "apoia", "auxilia".',
  },
  'BR-CLAIM-014': {
    message: 'É proibido prometer prazos específicos (como "resultado em 3 dias", "resultado em 7 dias") e garantias absolutas de eficácia (como "100% eficaz", "garantido"). A eficácia deve ter base científica.',
    suggestion: 'Remova alegações de prazo fixo. Use: "uso contínuo", "melhora gradual".',
  },
  'BR-CLAIM-015': {
    message: 'É proibido usar alegações como "grau médico", "fórmula clínica", "nível clínico" que sugerem efeitos medicinais. Cosméticos não devem imitar marketing de medicamentos.',
    suggestion: 'Remova termos médicos/clínicos. Use: "cuidadosamente desenvolvido", "fórmula de qualidade".',
  },
  'BR-CLAIM-016': {
    message: 'Alegações para bebês e gestantes exigem indicação clara de idade aplicável e avisos de condições especiais. Produtos infantis exigem registro separado.',
    suggestion: 'Obtenha registro de produto infantil ou remova alegações para bebês/gestantes.',
  },
  'BR-CLAIM-017': {
    message: 'Evite termos absolutos como "100% natural", "sem químicos". Alegações naturais exigem certificação válida.',
    suggestion: 'Remova termos absolutos ou forneça certificação válida.',
  },
  'BR-CLAIM-018': {
    message: 'Cosméticos não podem alegar regeneração celular, reparo tecidual ou outros efeitos de nível médico.',
    suggestion: 'Remova alegações de regeneração celular/reparo. Use "hidrata a pele".',
  },
  'BR-CLAIM-019': {
    message: 'Evite termos como "detox", "purificação" que sugerem efeitos medicinais.',
    suggestion: 'Remova alegações de detox/purificação. Use "limpa a pele".',
  },
  'BR-CLAIM-020': {
    message: 'Denegrir concorrentes ou publicidade comparativa é proibida.',
    suggestion: 'Remova alegações comparativas/denegrientes. Use descrição de características do produto.',
  },
  'BR-CLAIM-021': {
    message: 'Alegações de segurança exigem suporte de testes. É proibido usar termos absolutos como "zero risco", "nunca causa alergia". Hipoalergenicidade exige comprovação clínica.',
    suggestion: 'Use: "testado para compatibilidade cutânea", "adequado para pele sensível" (com comprovação).',
  },
  'BR-CLAIM-022': {
    message: 'É proibido usar termos absolutos como "eliminação completa de rugas", "anti-envelhecimento total". Substitua por "ajuda a melhorar a aparência de rugas" (RDC 907/2024).',
    suggestion: 'Substitua por: "ajuda a melhorar a aparência de rugas", "ajuda a manter o estado da pele".',
  },
  'BR-CLAIM-023': {
    message: 'É proibido alegar adequação para todos os tipos de pele sem base científica. É necessário suporte de testes. Substitua por "compatível com a maioria dos tipos de pele" ou "adequado para pele seca/oleosa/normal".',
    suggestion: 'Especifique os tipos de pele testados ou realize teste de compatibilidade.',
  },
  'BR-CLAIM-024': {
    message: 'É proibido garantir eficácia absoluta como "100% eficaz". A eficácia varia de pessoa para pessoa. Substitua por "resultados podem variar" ou "melhores resultados com uso contínuo".',
    suggestion: 'Remova garantias absolutas. Adicione: "resultados podem variar de pessoa para pessoa".',
  },
  'BR-ABS-001': {
    message: "Termos absolutos como 'permanente', 'cura completamente', 'para sempre' são proibidos. Use 'ajuda a manter'.",
    suggestion: "Substitua por: 'ajuda a manter', 'auxilia', 'contribui para'.",
  },
  'BR-ABS-002': {
    message: "Alegações de eficácia em prazo fixo (ex: 'em 3 dias', 'em 7 dias') e garantias absolutas (ex: '100% eficaz', 'resultados garantidos') são proibidas. A eficácia deve ser comprovada cientificamente.",
    suggestion: "Remova alegações de prazo fixo. Use: 'com uso contínuo', 'melhora gradualmente'.",
  },
  'BR-ABS-003': {
    message: "Alegações como 'grau médico', 'fórmula clínica', 'grau clínico' que implicam eficácia medicinal são proibidas. Cosméticos não podem imitar marketing de medicamentos.",
    suggestion: "Remova terminologia médica/clínica. Use: 'desenvolvido com cuidado', 'fórmula premium'.",
  },
  'BR-ABS-004': {
    message: "Alegações de segurança exigem suporte de testes. Termos absolutos como 'zero risco', 'nunca causa sensibilização' são proibidos. Baixa sensibilização requer validação clínica.",
    suggestion: "Use: 'testado para compatibilidade com a pele', 'adequado para pele sensível' (com comprovação).",
  },
  'BR-ABS-005': {
    message: "Alegações de adequação para todos os tipos de pele sem evidência científica são proibidas. Exige suporte de testes. Use 'compatível com a maioria dos tipos de pele' ou 'adequado para pele seca/oleosa/normal'.",
    suggestion: 'Especifique os tipos de pele testados ou realize teste de compatibilidade.',
  },
  'BR-ABS-006': {
    message: "Garantias absolutas de eficácia como '100% eficaz' são proibidas. A eficácia varia por indivíduo. Use 'resultados podem variar' ou 'funciona melhor com uso contínuo'.",
    suggestion: "Remova garantias absolutas. Adicione: 'resultados podem variar de pessoa para pessoa'.",
  },
  'BR-POP-001': {
    message: 'Alegações de adequação para bebês, gestantes exigem rotulagem específica de idade aplicável e avisos de condições especiais. Produtos infantis exigem registro separado.',
    suggestion: 'Obtenha registro de produto infantil ou remova alegações de bebês/gestantes.',
  },
  'MX-ING-001': {
    message: 'Mercúrio é proibido em cosméticos pela COFEPRIS NOM-141-SSA1/SCF1-2012.',
    suggestion: 'Remova compostos de mercúrio da fórmula.',
  },
  'MX-ING-002': {
    message: 'Compostos de chumbo são proibidos em cosméticos.',
    suggestion: 'Remova chumbo e seus compostos da fórmula.',
  },
  'MX-ING-003': {
    message: 'Hidroquinona é proibida para clareamento de pele em cosméticos (NOM-141-SSA1/SCF1-2012).',
    suggestion: 'Remova hidroquinona. Use agentes clareadores alternativos como alfa-arbutina.',
  },
  'MX-ING-004': {
    message: 'Corticosteroides são proibidos em produtos cosméticos.',
    suggestion: 'Remova corticosteroides - o produto deve ser registrado como medicamento.',
  },
  'MX-ING-005': {
    message: 'Liberadores de formaldeído são restritos. Máximo de 0,2% de liberação de formaldeído.',
    suggestion: 'Garanta que a liberação de formaldeído não exceda 0,2%. Use conservantes alternativos.',
  },
  // === Mexico Banned & Claims (auto-translated) ===
  'MX-BAN-001': {
    message: 'O mercúrio é um metal pesado proibido em cosméticos.',
    suggestion: 'Remova compostos de mercúrio da fórmula.',
  },
  'MX-BAN-002': {
    message: 'Todos os compostos de mercúrio (ex: cloreto de mercúrio, óxido de mercúrio) são proibidos em cosméticos.',
    suggestion: 'Remova todos os compostos de mercúrio da fórmula.',
  },
  'MX-BAN-003': {
    message: 'O chumbo é um metal pesado proibido em cosméticos.',
    suggestion: 'Remova chumbo e seus compostos da fórmula.',
  },
  'MX-BAN-004': {
    message: 'O arsênico é um metal pesado proibido em cosméticos.',
    suggestion: 'Remova arsênico e seus compostos da fórmula.',
  },
  'MX-BAN-005': {
    message: 'O cádmio é um metal pesado proibido em cosméticos.',
    suggestion: 'Remova cádmio e seus compostos da fórmula.',
  },
  'MX-BAN-006': {
    message: 'Hidroquinona é proibida para clareamento de pele em cosméticos (NOM-141-SSA1/SCF1-2012).',
    suggestion: 'Remova hidroquinona. Use agentes clareadores alternativos como alfa-arbutina.',
  },
  'MX-BAN-007': {
    message: 'A tretinoína é um ingrediente de grau farmacêutico proibido em cosméticos.',
    suggestion: 'Remova a tretinoína. Se usada, o produto deve ser registrado como medicamento.',
  },
  'MX-BAN-008': {
    message: 'O ácido retinoico é um ingrediente de grau farmacêutico proibido em cosméticos.',
    suggestion: 'Remova o ácido retinoico. Se usado, o produto deve ser registrado como medicamento.',
  },
  'MX-BAN-009': {
    message: 'Hexaclorofeno é proibido em cosméticos.',
    suggestion: 'Remova hexaclorofeno da fórmula.',
  },
  'MX-BAN-010': {
    message: 'Bitionol é proibido em cosméticos.',
    suggestion: 'Remova bitionol da fórmula.',
  },
  'MX-BAN-011': {
    message: 'Cloroxilenol (PCMX) é proibido em cosméticos.',
    suggestion: 'Remova cloroxilenol da fórmula.',
  },
  'MX-BAN-012': {
    message: 'Mequinol é proibido em cosméticos.',
    suggestion: 'Remova mequinol da fórmula.',
  },
  'MX-BAN-013': {
    message: 'Corticosteroides são drogas hormonais proibidas em cosméticos.',
    suggestion: 'Remova corticosteroides. O produto deve ser registrado como medicamento.',
  },
  'MX-BAN-014': {
    message: 'Hidrocortisona é um corticosteroide proibido em cosméticos.',
    suggestion: 'Remova hidrocortisona. O produto deve ser registrado como medicamento.',
  },
  'MX-BAN-015': {
    message: 'Betametasona é um corticosteroide proibido em cosméticos.',
    suggestion: 'Remova betametasona. O produto deve ser registrado como medicamento.',
  },
  'MX-BAN-016': {
    message: 'Cloranfenicol é um antibiótico proibido em cosméticos.',
    suggestion: 'Remova cloranfenicol da fórmula.',
  },
  'MX-BAN-017': {
    message: 'A tretinoína é um ingrediente de grau farmacêutico proibido em cosméticos.',
    suggestion: 'Remova a tretinoína. Se usada, o produto deve ser registrado como medicamento.',
  },
  'MX-CLAIM-001': {
    message: `Cosméticos não podem usar termos de tratamento médico (ex: 'cura', 'anti-inflamatório', 'antibacteriano') ou alegar eficácia medicinal como tratamento de acne ou cicatrização.`,
    suggestion: 'Remova alegações médicas/terapêuticas. Use apenas alegações cosméticas.',
  },
  'MX-CLAIM-002': {
    message: `Alegações absolutas como '100% natural', 'sem produtos químicos', 'orgânico' são proibidas sem evidência científica.`,
    suggestion: 'Remova alegações absolutas ou forneça certificação válida.',
  },
  'MX-CLAIM-003': {
    message: `Produtos de proteção solar devem exibir FPS e proteção UVA/UVB. Alegações absolutas como 'proteção total' ou 'sem necessidade de reaplicação' são proibidas.`,
    suggestion: 'Inclua valor de FPS e rótulos UVA/UVB. Evite alegações absolutas de proteção.',
  },
  'MX-CLAIM-004': {
    message: `Alegações absolutas de segurança sem evidência são proibidas, como 'zero risco', 'nunca causa alergias', 'seguro para todos'.`,
    suggestion: `Use alegações com evidência como 'testado para compatibilidade com a pele'.`,
  },
  'MX-CLAIM-005': {
    message: `Alegações anti-envelhecimento exigem evidência científica. Alegações absolutas como 'elimina completamente rugas', 'para o envelhecimento', '10 anos mais jovem' são proibidas.`,
    suggestion: `Use alegações compatíveis como 'ajuda a melhorar a aparência da pele'.`,
  },
  'MX-CLAIM-006': {
    message: `Alegações enganosas relacionadas à FDA são proibidas, como 'aprovado pela FDA', 'certificado pela FDA', 'grau farmacêutico'.`,
    suggestion: 'Remova alegações relacionadas à FDA. Use alegações de eficácia do produto.',
  },
  'MX-CLAIM-007': {
    message: 'Alegações de teste dermatológico exigem relatórios de teste válidos e autênticos.',
    suggestion: 'Certifique-se de ter relatórios de teste dermatológicos válidos.',
  },
  'MX-CLAIM-008': {
    message: `Alegações hipoalergênicas exigem suporte de testes clínicos. Usar 'hipoalergênico' ou 'livre de alergias' sem evidência é proibido.`,
    suggestion: 'Forneça comprovação de testes clínicos hipoalergênicos.',
  },
  'MX-CLAIM-009': {
    message: 'Alegações de livre de crueldade exigem documentação válida.',
    suggestion: 'Certifique-se de ter certificação válida de livre de crueldade.',
  },
  'MX-CLAIM-010': {
    message: `Cosméticos não podem alegar curar, tratar ou prevenir doenças. Termos como 'cura', 'tratamento da raiz', 'solução completa' são proibidos.`,
    suggestion: 'Remova alegações de cura/tratamento. Use apenas alegações cosméticas.',
  },
  'MX-CLAIM-011': {
    message: `Alegações de remoção de celulite são proibidas, como 'queima gordura', 'queima de gordura', 'elimina completamente a celulite'.`,
    suggestion: `Remova alegações de remoção de celulite. Use 'ajuda a melhorar a aparência da pele'.`,
  },
  'MX-CLAIM-012': {
    message: 'Alegações de aumento de seios são proibidas para cosméticos e exigem registro de medicamento.',
    suggestion: 'Remova alegações de aumento de seios. Use apenas alegações cosméticas de cuidado corporal.',
  },
  'MX-CLAIM-013': {
    message: `Alegações absolutas de eficácia permanente são proibidas, como 'permanente', 'completo', 'tratamento da raiz', 'para sempre', 'resultados duradouros garantidos'.`,
    suggestion: `Remova alegações permanentes/completas. Use 'ajuda a manter' ou 'cuidado duradouro'.`,
  },
  'MX-CLAIM-014': {
    message: `Promessas de prazos específicos e resultados absolutos são proibidas, como 'resultados em 7 dias', '100% eficaz', 'resultados imediatos', 'resultados garantidos'.`,
    suggestion: `Remova alegações de prazo fixo. Use 'com uso contínuo' ou 'melhora gradual'.`,
  },
  'MX-CLAIM-015': {
    message: `Alegações de grau médico são proibidas, como 'grau médico', 'fórmula médica', 'grau clínico', 'tratamento profissional'. Cosméticos não podem imitar marketing de medicamentos.`,
    suggestion: `Remova terminologia médica/clínica. Use 'desenvolvido com cuidado' ou 'fórmula premium'.`,
  },
  'MX-CLAIM-016': {
    message: 'Alegações para populações especiais (bebês, gestantes, crianças, recém-nascidos) exigem aprovação especial e rótulos de aviso.',
    suggestion: 'Obtenha registro de produto infantil ou remova alegações de bebês/gestantes.',
  },
  'MX-CLAIM-017': {
    message: `Alegações absolutas de clareamento são proibidas, como 'elimina todas as manchas', 'único eficaz', 'clareamento permanente', 'elimina completamente a melanina'.`,
    suggestion: `Substitua por alegações compatíveis: 'ajuda a iluminar o tom da pele', 'uniformiza o tom da pele'.`,
  },
  'MX-CLAIM-018': {
    message: 'Alegações de prevenção de queda de cabelo / crescimento capilar são proibidas para cosméticos e exigem registro de medicamento.',
    suggestion: 'Remova alegações de queda/crescimento capilar. Use apenas alegações cosméticas de cuidado capilar.',
  },
  'MX-CLAIM-019': {
    message: `Alegações absolutas de desintoxicação/purificação sem evidência são proibidas, como 'remove completamente toxinas', 'purificação profunda'.`,
    suggestion: `Remova alegações absolutas de desintoxicação/purificação. Use 'limpa a pele'.`,
  },
  'MX-CLAIM-020': {
    message: `Alegações absolutas de preço são proibidas, como 'melhor preço', 'menor preço', 'oferta exclusiva'.`,
    suggestion: 'Remova alegações absolutas de preço. Use descrições de preço de mercado.',
  },
  'MX-CLAIM-021': {
    message: `Alegações de regeneração/reparação celular de grau médico são proibidas, como 'regeneração celular', 'reparação de tecidos', 'renova completamente a pele'.`,
    suggestion: `Remova alegações de regeneração/reparação celular. Use 'hidrata a pele'.`,
  },
  'MX-CLAIM-022': {
    message: `Alegações comparativas/depreciativas de concorrentes são proibidas, como 'melhor que concorrentes', 'sem igual no mercado', 'supera todos os outros produtos'.`,
    suggestion: 'Remova alegações comparativas/depreciativas de concorrentes. Use descrições de características do produto.',
  },
}

// Mexican Spanish translations

const esRegulations: RegulationDictionary = {
  'BR-ING-001': {
    message: 'El mercurio está prohibido en cosméticos por ANVISA RDC 529/2021.',
    suggestion: 'Elimine los compuestos de mercurio de la fórmula.',
  },
  'BR-ING-002': {
    message: 'Los compuestos de plomo están prohibidos en cosméticos.',
    suggestion: 'Elimine el plomo y sus compuestos de la fórmula.',
  },
  'BR-ING-003': {
    message: 'La hidroquinona está restringida y generalmente prohibida en productos cosméticos.',
    suggestion: 'Elimine la hidroquinona o reformule como producto farmacéutico.',
  },
  'BR-ING-004': {
    message: 'Los corticosteroides están prohibidos en cosméticos sin prescripción médica.',
    suggestion: 'Elimine los corticosteroides u obtenga registro farmacéutico.',
  },
  'BR-ING-005': {
    message: 'El formaldehído está prohibido en cosméticos, excepto como traza de conservante por debajo del 0,2%.',
    suggestion: 'Asegure una concentración de formaldehído inferior al 0,2% o elimínelo por completo.',
  },
  'BR-ING-006': {
    message: 'Los parabenos están restringidos. Concentración máxima: 0,4% individual, 0,8% mezcla.',
    suggestion: 'Verifique que la concentración de parabenos cumpla con los límites de ANVISA.',
  },
  'BR-ING-007': {
    message: 'La concentración de retinol (Vitamina A) excede los límites seguros para cosméticos (>0,3%).',
    suggestion: 'Reduzca la concentración de retinol al 0,3% o menos.',
  },
  'BR-CLAIM-001': {
    message: "Los cosméticos no pueden afirmar curar, tratar o prevenir enfermedades. Debe incluir 'este produto não é um medicamento'.",
    suggestion: 'Elimine las afirmaciones médicas/terapéuticas. Use solo afirmaciones cosméticas (hidratación, limpieza, embellecimiento).',
  },
  'BR-CLAIM-002': {
    message: "Las afirmaciones absolutas de blanqueamiento están prohibidas: no use 'blanqueamiento permanente', 'eliminación completa de melanina'. La hidroquinona está prohibida en cosméticos. Use 'ayuda a iluminar el tono de la piel'.",
    suggestion: "Reemplace con afirmaciones compatibles: 'ayuda a iluminar el tono de la piel', 'unifica el tono de la piel'.",
  },
  'BR-CLAIM-003': {
    message: "Los productos de protección solar deben mostrar SPF y protección UVA/UVB. Las afirmaciones absolutas como 'protección total' o 'sin necesidad de reaplicación' están prohibidas por RDC 907/2024.",
    suggestion: 'Incluya valor de SPF y etiquetas UVA/UVB. Evite afirmaciones absolutas de protección.',
  },
  'BR-CLAIM-004': {
    message: 'Los cosméticos no pueden afirmar prevención de caída de cabelo o promoción de crecimiento capilar. Estas afirmaciones requieren registro de medicamento de ANVISA.',
    suggestion: 'Use afirmaciones cosméticas para cabello: hidratación, acondicionamiento, brillo.',
  },
  'BR-CLAIM-005': {
    message: 'Las afirmaciones de aumento/firmeza de senos están prohibidas para cosméticos. Estos requieren registro farmacéutico.',
    suggestion: 'Elimine las afirmaciones de aumento de senos. Use solo afirmaciones cosméticas de cuidado corporal.',
  },
  'BR-CLAIM-006': {
    message: 'Los cosméticos no pueden alegar adelgazamiento, reducción de medidas o quema de grasa.',
    suggestion: 'Elimine alegaciones de adelgazamiento. Use solo alegaciones cosméticas de cuidado corporal.',
  },
  'BR-CLAIM-007': {
    message: 'Las alegaciones de estrías necesitan evidencia científica. Evite términos absolutos como "eliminación completa de estrías".',
    suggestion: 'Use alegaciones compatibles como "ayuda a mejorar la apariencia de la piel".',
  },
  'BR-CLAIM-008': {
    message: 'Está prohibido usar términos absolutos de tiempo como "inmediato", "instantáneo", "resultado inmediato".',
    suggestion: 'Sustituya por: "gradualmente", "uso continuo", "cuidado regular".',
  },
  'BR-CLAIM-009': {
    message: 'Está prohibido usar términos absolutos de eficacia como "100%", "completamente", "cura definitiva".',
    suggestion: 'Sustituya por: "ayuda a", "contribuye a", "auxilia".',
  },
  'BR-CLAIM-010': {
    message: 'Está prohibido usar alegaciones como "grado médico" o "grado farmacéutico" que puedan engañar al consumidor. Los cosméticos no deben sugerir efectos medicinales.',
    suggestion: 'Elimine términos médicos/clínicos. Use "cuidadosamente desarrollado", "fórmula de calidad".',
  },
  'BR-CLAIM-011': {
    message: 'Las alegaciones antibacterianas exigen requisitos específicos de conformidad. Algunos productos pueden requerir registro como desinfectante.',
    suggestion: 'Garantice comprobación antibacteriana válida o elimine la alegación antibacteriana.',
  },
  'BR-CLAIM-012': {
    message: 'Los antitranspirantes y desodorantes pertenecen a categorías diferentes. Los antitranspirantes requieren registro de medicamento.',
    suggestion: 'Clasifique el producto correctamente. Los desodorantes solo alegan fragancia/frescura; los antitranspirantes requieren registro farmacéutico.',
  },
  'BR-CLAIM-013': {
    message: 'Está prohibido usar términos absolutos como "permanente", "cura completa", "para siempre". Sustituya por "ayuda a mantener".',
    suggestion: 'Sustituya por: "ayuda a mantener", "apoya", "auxilia".',
  },
  'BR-CLAIM-014': {
    message: 'Está prohibido prometer plazos específicos (como "resultado en 3 días", "resultado en 7 días") y garantías absolutas de eficacia (como "100% eficaz", "garantizado"). La eficacia debe tener base científica.',
    suggestion: 'Elimine alegaciones de plazo fijo. Use: "uso continuo", "mejora gradual".',
  },
  'BR-CLAIM-015': {
    message: 'Está prohibido usar alegaciones como "grado médico", "fórmula clínica", "nivel clínico" que sugieran efectos medicinales. Los cosméticos no deben imitar marketing de medicamentos.',
    suggestion: 'Elimine términos médicos/clínicos. Use: "cuidadosamente desarrollado", "fórmula de calidad".',
  },
  'BR-CLAIM-016': {
    message: 'Las alegaciones para bebés y embarazadas exigen indicación clara de edad aplicable y advertencias de condiciones especiales. Los productos infantiles requieren registro separado.',
    suggestion: 'Obtenga registro de producto infantil o elimine alegaciones para bebés/embarazadas.',
  },
  'BR-CLAIM-017': {
    message: 'Evite términos absolutos como "100% natural", "sin químicos". Las alegaciones naturales exigen certificación válida.',
    suggestion: 'Elimine términos absolutos o proporcione certificación válida.',
  },
  'BR-CLAIM-018': {
    message: 'Los cosméticos no pueden alegar regeneración celular, reparo tisular u otros efectos de nivel médico.',
    suggestion: 'Elimine alegaciones de regeneración celular/reparo. Use "hidrata la piel".',
  },
  'BR-CLAIM-019': {
    message: 'Evite términos como "detox", "purificación" que sugieran efectos medicinales.',
    suggestion: 'Elimine alegaciones de detox/purificación. Use "limpia la piel".',
  },
  'BR-CLAIM-020': {
    message: 'Denigrar competidores o publicidad comparativa está prohibida.',
    suggestion: 'Elimine alegaciones comparativas/denigrantes. Use descripción de características del producto.',
  },
  'BR-CLAIM-021': {
    message: 'Las alegaciones de seguridad exigen soporte de pruebas. Está prohibido usar términos absolutos como "cero riesgo", "nunca causa alergia". La hipoalergenicidad exige comprobación clínica.',
    suggestion: 'Use: "probado para compatibilidad cutánea", "adecuado para piel sensible" (con comprobación).',
  },
  'BR-CLAIM-022': {
    message: 'Está prohibido usar términos absolutos como "eliminación completa de arrugas", "anti-envejecimiento total". Sustituya por "ayuda a mejorar la apariencia de arrugas" (RDC 907/2024).',
    suggestion: 'Sustituya por: "ayuda a mejorar la apariencia de arrugas", "ayuda a mantener el estado de la piel".',
  },
  'BR-CLAIM-023': {
    message: 'Está prohibido alegar adecuación para todos los tipos de piel sin base científica. Se necesita soporte de pruebas. Sustituya por "compatible con la mayoría de los tipos de piel" o "adecuado para piel seca/grasa/normal".',
    suggestion: 'Especifique los tipos de piel probados o realice prueba de compatibilidad.',
  },
  'BR-CLAIM-024': {
    message: 'Está prohibido garantizar eficacia absoluta como "100% eficaz". La eficacia varía de persona a persona. Sustituya por "los resultados pueden variar" o "mejores resultados con uso continuo".',
    suggestion: 'Elimine garantías absolutas. Agregue: "los resultados pueden variar de persona a persona".',
  },
  'BR-ABS-001': {
    message: "Los términos absolutos como 'permanente', 'cura completamente', 'para siempre' están prohibidos. Use 'ayuda a mantener'.",
    suggestion: "Reemplace por: 'ayuda a mantener', 'apoya', 'contribuye a'.",
  },
  'BR-ABS-002': {
    message: "Las afirmaciones de eficacia en plazo fijo (ej: 'en 3 días', 'en 7 días') y garantías absolutas (ej: '100% eficaz', 'resultados garantizados') están prohibidas. La eficacia debe estar científicamente sustentada.",
    suggestion: "Elimine afirmaciones de plazo fijo. Use: 'con uso regular', 'mejora gradualmente'.",
  },
  'BR-ABS-003': {
    message: "Las afirmaciones como 'grado médico', 'fórmula clínica', 'grado clínico' que implican eficacia medicinal están prohibidas. Los cosméticos no pueden imitar el marketing de medicamentos.",
    suggestion: "Elimine terminología médica/clínica. Use: 'desarrollado con cuidado', 'fórmula premium'.",
  },
  'BR-ABS-004': {
    message: "Las afirmaciones de seguridad requieren respaldo de pruebas. Términos absolutos como 'cero riesgo', 'nunca causa sensibilización' están prohibidos. La baja sensibilización requiere validación clínica.",
    suggestion: "Use: 'probado para compatibilidad con la piel', 'adecuado para piel sensible' (con comprobación).",
  },
  'BR-ABS-005': {
    message: "Las afirmaciones de adecuación para todos los tipos de piel sin evidencia científica están prohibidas. Requiere respaldo de pruebas. Use 'compatible con la mayoría de los tipos de piel' o 'adecuado para piel seca/grasa/normal'.",
    suggestion: 'Especifique los tipos de piel probados o realice prueba de compatibilidad.',
  },
  'BR-ABS-006': {
    message: "Las garantías absolutas de eficacia como '100% eficaz' están prohibidas. La eficacia varía por individuo. Use 'los resultados pueden variar' o 'funciona mejor con uso continuo'.",
    suggestion: "Elimine garantías absolutas. Agregue: 'los resultados pueden variar según la persona'.",
  },
  'BR-POP-001': {
    message: 'Las afirmaciones de adecuación para bebés, embarazadas requieren etiquetado específico de edad aplicable y advertencias de condiciones especiales. Los productos infantiles requieren registro separado.',
    suggestion: 'Obtenga registro de producto infantil o elimine afirmaciones de bebés/embarazadas.',
  },
  'MX-ING-001': {
    message: 'El mercurio está prohibido en cosméticos por COFEPRIS NOM-141-SSA1/SCF1-2012.',
    suggestion: 'Elimine los compuestos de mercurio de la fórmula.',
  },
  'MX-ING-002': {
    message: 'Los compuestos de plomo están prohibidos en cosméticos.',
    suggestion: 'Elimine el plomo y sus compuestos de la fórmula.',
  },
  'MX-ING-003': {
    message: 'La hidroquinona está prohibida para blanqueamiento de piel en cosméticos (NOM-141-SSA1/SCF1-2012).',
    suggestion: 'Elimine la hidroquinona. Use agentes blanqueadores alternativos como alfa-arbutina.',
  },
  'MX-ING-004': {
    message: 'El formaldehído está prohibido en cosméticos, excepto como traza de conservante.',
    suggestion: 'Asegure una concentración de formaldehído inferior al 0,2% o elimínelo por completo.',
  },
  'MX-ING-005': {
    message: 'Los liberadores de formaldehído están restringidos. Máximo 0,2% de liberación de formaldehído.',
    suggestion: 'Asegure que la liberación de formaldehído no exceda el 0,2%. Use conservantes alternativos.',
  },
  // === Mexico Banned & Claims (auto-translated) ===
  'MX-BAN-001': {
    message: 'El mercurio es un metal pesado prohibido en cosméticos.',
    suggestion: 'Elimine los compuestos de mercurio de la fórmula.',
  },
  'MX-BAN-002': {
    message: 'Todos los compuestos de mercurio (ej. cloruro de mercurio, óxido de mercurio) están prohibidos en cosméticos.',
    suggestion: 'Elimine todos los compuestos de mercurio de la fórmula.',
  },
  'MX-BAN-003': {
    message: 'El plomo es un metal pesado prohibido en cosméticos.',
    suggestion: 'Elimine el plomo y sus compuestos de la fórmula.',
  },
  'MX-BAN-004': {
    message: 'El arsénico es un metal pesado prohibido en cosméticos.',
    suggestion: 'Elimine el arsénico y sus compuestos de la fórmula.',
  },
  'MX-BAN-005': {
    message: 'El cadmio es un metal pesado prohibido en cosméticos.',
    suggestion: 'Elimine el cadmio y sus compuestos de la fórmula.',
  },
  'MX-BAN-006': {
    message: 'La hidroquinona está prohibida para blanqueamiento de piel en cosméticos (NOM-141-SSA1/SCF1-2012).',
    suggestion: 'Elimine la hidroquinona. Use agentes blanqueadores alternativos como alfa-arbutina.',
  },
  'MX-BAN-007': {
    message: 'La tretinoína es un ingrediente de grado farmacéutico prohibido en cosméticos.',
    suggestion: 'Elimine la tretinoína. Si se usa, el producto debe registrarse como medicamento.',
  },
  'MX-BAN-008': {
    message: 'El ácido retinoico es un ingrediente de grado farmacéutico prohibido en cosméticos.',
    suggestion: 'Elimine el ácido retinoico. Si se usa, el producto debe registrarse como medicamento.',
  },
  'MX-BAN-009': {
    message: 'El hexaclorofeno está prohibido en cosméticos.',
    suggestion: 'Elimine el hexaclorofeno de la fórmula.',
  },
  'MX-BAN-010': {
    message: 'El bitionol está prohibido en cosméticos.',
    suggestion: 'Elimine el bitionol de la fórmula.',
  },
  'MX-BAN-011': {
    message: 'El cloroxilenol (PCMX) está prohibido en cosméticos.',
    suggestion: 'Elimine el cloroxilenol de la fórmula.',
  },
  'MX-BAN-012': {
    message: 'La mequinol está prohibida en cosméticos.',
    suggestion: 'Elimine la mequinol de la fórmula.',
  },
  'MX-BAN-013': {
    message: 'Los corticosteroides son drogas hormonales prohibidas en cosméticos.',
    suggestion: 'Elimine los corticosteroides. El producto debe registrarse como medicamento.',
  },
  'MX-BAN-014': {
    message: 'La hidrocortisona es un corticosteroide prohibido en cosméticos.',
    suggestion: 'Elimine la hidrocortisona. El producto debe registrarse como medicamento.',
  },
  'MX-BAN-015': {
    message: 'La betametasona es un corticosteroide prohibido en cosméticos.',
    suggestion: 'Elimine la betametasona. El producto debe registrarse como medicamento.',
  },
  'MX-BAN-016': {
    message: 'El cloranfenicol es un antibiótico prohibido en cosméticos.',
    suggestion: 'Elimine el cloranfenicol de la fórmula.',
  },
  'MX-BAN-017': {
    message: 'La tretinoína es un ingrediente de grado farmacéutico prohibido en cosméticos.',
    suggestion: 'Elimine la tretinoína. Si se usa, el producto debe registrarse como medicamento.',
  },
  'MX-CLAIM-001': {
    message: `Los cosméticos no pueden usar términos de tratamiento médico (ej. 'cura', 'antiinflamatorio', 'antibacteriano') ni afirmar eficacia medicinal como tratar acné o cicatrización.`,
    suggestion: 'Elimine las afirmaciones médicas/terapéuticas. Use solo afirmaciones cosméticas.',
  },
  'MX-CLAIM-002': {
    message: `Las afirmaciones absolutas como '100% natural', 'sin químicos', 'orgánico' están prohibidas sin evidencia científica.`,
    suggestion: 'Elimine las afirmaciones absolutas o proporcione certificación válida.',
  },
  'MX-CLAIM-003': {
    message: `Los productos de protección solar deben mostrar SPF y protección UVA/UVB. Las afirmaciones absolutas como 'protección total' o 'sin necesidad de reaplicación' están prohibidas.`,
    suggestion: 'Incluya valor de SPF y etiquetas UVA/UVB. Evite afirmaciones absolutas de protección.',
  },
  'MX-CLAIM-004': {
    message: `Las afirmaciones absolutas de seguridad sin evidencia están prohibidas, como 'cero riesgo', 'nunca causa alergias', 'seguro para todos'.`,
    suggestion: `Use afirmaciones con evidencia como 'probado para compatibilidad con la piel'.`,
  },
  'MX-CLAIM-005': {
    message: `Las afirmaciones anti-envejecimiento requieren evidencia científica. Las afirmaciones absolutas como 'elimina completamente arrugas', 'detiene el envejecimiento', '10 años más joven' están prohibidas.`,
    suggestion: `Use afirmaciones compatibles como 'ayuda a mejorar la apariencia de la piel'.`,
  },
  'MX-CLAIM-006': {
    message: `Las afirmaciones engañosas relacionadas con la FDA están prohibidas, como 'aprobado por la FDA', 'certificado por la FDA', 'grado farmacéutico'.`,
    suggestion: 'Elimine las afirmaciones relacionadas con la FDA. Use afirmaciones de eficacia del producto.',
  },
  'MX-CLAIM-007': {
    message: 'Las afirmaciones de prueba dermatológica requieren informes de prueba válidos y auténticos.',
    suggestion: 'Asegúrese de tener informes de prueba dermatológicos válidos.',
  },
  'MX-CLAIM-008': {
    message: `Las afirmaciones hipoalergénicas requieren respaldo de pruebas clínicas. Usar 'hipoalergénico' o 'libre de alergias' sin evidencia está prohibido.`,
    suggestion: 'Proporcione prueba de pruebas clínicas hipoalergénicas.',
  },
  'MX-CLAIM-009': {
    message: 'Las afirmaciones de libre de crueldad requieren documentación válida.',
    suggestion: 'Asegúrese de tener certificación válida de libre de crueldad.',
  },
  'MX-CLAIM-010': {
    message: `Los cosméticos no pueden afirmar curar, tratar o prevenir enfermedades. Términos como 'cura', 'tratamiento de la raíz', 'solución completa' están prohibidos.`,
    suggestion: 'Elimine las afirmaciones de cura/tratamiento. Use solo afirmaciones cosméticas.',
  },
  'MX-CLAIM-011': {
    message: `Las afirmaciones de eliminación de celulitis están prohibidas, como 'quema grasa', 'quema de grasa', 'elimina completamente la celulitis'.`,
    suggestion: `Elimine las afirmaciones de eliminación de celulitis. Use 'ayuda a mejorar la apariencia de la piel'.`,
  },
  'MX-CLAIM-012': {
    message: 'Las afirmaciones de aumento de senos están prohibidas para cosméticos y requieren registro de medicamento.',
    suggestion: 'Elimine las afirmaciones de aumento de senos. Use solo afirmaciones cosméticas de cuidado corporal.',
  },
  'MX-CLAIM-013': {
    message: `Las afirmaciones absolutas de eficacia permanente están prohibidas, como 'permanente', 'completo', 'tratamiento de la raíz', 'para siempre', 'resultados duraderos garantizados'.`,
    suggestion: `Elimine las afirmaciones permanentes/completas. Use 'ayuda a mantener' o 'cuidado duradero'.`,
  },
  'MX-CLAIM-014': {
    message: `Las promesas de plazos específicos y resultados absolutos están prohibidas, como 'resultados en 7 días', '100% eficaz', 'resultados inmediatos', 'resultados garantizados'.`,
    suggestion: `Elimine las afirmaciones de plazo fijo. Use 'con uso continuo' o 'mejora gradual'.`,
  },
  'MX-CLAIM-015': {
    message: `Las afirmaciones de grado médico están prohibidas, como 'grado médico', 'fórmula médica', 'grado clínico', 'tratamiento profesional'. Los cosméticos no pueden imitar el marketing de medicamentos.`,
    suggestion: `Elimine terminología médica/clínica. Use 'desarrollado con cuidado' o 'fórmula premium'.`,
  },
  'MX-CLAIM-016': {
    message: 'Las afirmaciones para poblaciones especiales (bebés, embarazadas, niños, recién nacidos) requieren aprobación especial y etiquetas de advertencia.',
    suggestion: 'Obtenga registro de producto infantil o elimine afirmaciones de bebés/embarazadas.',
  },
  'MX-CLAIM-017': {
    message: `Las afirmaciones absolutas de blanqueamiento están prohibidas, como 'elimina todas las manchas', 'único eficaz', 'blanqueamiento permanente', 'elimina completamente la melanina'.`,
    suggestion: `Reemplace con afirmaciones compatibles: 'ayuda a iluminar el tono de la piel', 'unifica el tono de la piel'.`,
  },
  'MX-CLAIM-018': {
    message: 'Las afirmaciones de prevención de caída de cabello / crecimiento capilar están prohibidas para cosméticos y requieren registro de medicamento.',
    suggestion: 'Elimine las afirmaciones de caída/crecimiento capilar. Use solo afirmaciones cosméticas de cuidado capilar.',
  },
  'MX-CLAIM-019': {
    message: `Las afirmaciones absolutas de desintoxicación/purificación sin evidencia están prohibidas, como 'elimina completamente toxinas', 'purificación profunda'.`,
    suggestion: `Elimine las afirmaciones absolutas de desintoxicación/purificación. Use 'limpia la piel'.`,
  },
  'MX-CLAIM-020': {
    message: `Las afirmaciones absolutas de precio están prohibidas, como 'mejor precio', 'precio más bajo', 'oferta exclusiva'.`,
    suggestion: 'Elimine las afirmaciones absolutas de precio. Use descripciones de precio de mercado.',
  },
  'MX-CLAIM-021': {
    message: `Las afirmaciones de regeneración/reparación celular de grado médico están prohibidas, como 'regeneración celular', 'reparación de tejidos', 'renueva completamente la piel'.`,
    suggestion: `Elimine las afirmaciones de regeneración/reparación celular. Use 'hidrata la piel'.`,
  },
  'MX-CLAIM-022': {
    message: `Las afirmaciones comparativas/derogatorias de competidores están prohibidas, como 'mejor que los competidores', 'sin igual en el mercado', 'supera todos los demás productos'.`,
    suggestion: 'Elimine las afirmaciones comparativas/derogatorias de competidores. Use descripciones de características del producto.',
  },
}

// === Translation registry ===
const REGULATION_MESSAGES: Record<string, RegulationDictionary> = {
  en: enRegulations,
  zh: zhRegulations,
  'pt-BR': ptRegulations,
  'pt': ptRegulations, // fallback
  'es-MX': esRegulations,
  'es': esRegulations, // fallback
}

// Supported locales for regulation messages

export const SUPPORTED_LOCALES = ['en', 'zh', 'pt-BR', 'pt', 'es-MX', 'es']

// Default/fallback locale
export const DEFAULT_LOCALE = 'en'

/**
 * Translate a violation's message and suggestion based on ruleId and locale
 * Falls back to English if translation not found, then to original as last resort
 */
export function translateViolation(
  ruleId: string,
  locale: string,
  original: { message: string; suggestion: string }
): { message: string; suggestion: string } {
  const dictionary = REGULATION_MESSAGES[locale] || REGULATION_MESSAGES[DEFAULT_LOCALE]
  const translation = dictionary[ruleId]

  if (translation) {
    return translation
  }

  // If current locale is not Chinese and original appears to be Chinese,
  // try English fallback first to avoid Chinese leaking into non-Chinese UIs
  if (locale !== 'zh' && locale !== 'zh-CN') {
    const enDict = REGULATION_MESSAGES['en']
    const enTranslation = enDict?.[ruleId]
    if (enTranslation) {
      return enTranslation
    }
  }

  // Last resort: return original (may be Chinese for JSON rules without translations)
  return original
}

/**
 * Translate all violations/warnings/info in a check result
 */
export function translateCheckResult<T extends { ruleId: string; message: string; suggestion: string }>(
  items: T[],
  locale: string
): T[] {
  return items.map(item => ({
    ...item,
    ...translateViolation(item.ruleId, locale, {
      message: item.message,
      suggestion: item.suggestion,
    }),
  }))
}

/**
 * Check if a rule has translation for given locale
 */
export function hasTranslation(ruleId: string, locale: string): boolean {
  const dictionary = REGULATION_MESSAGES[locale]
  if (!dictionary) return false
  return !!dictionary[ruleId]
}

/**
 * Get translation coverage stats for a locale
 */
export function getCoverageStats(
  ruleIds: string[],
  locale: string
): { total: number; translated: number; coverage: number } {
  const dictionary = REGULATION_MESSAGES[locale]
  if (!dictionary) return { total: ruleIds.length, translated: 0, coverage: 0 }

  const translated = ruleIds.filter(id => !!dictionary[id]).length
  return {
    total: ruleIds.length,
    translated,
    coverage: Math.round((translated / ruleIds.length) * 100),
  }
}
