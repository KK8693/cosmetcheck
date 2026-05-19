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
    message: 'Formaldehyde is prohibited in cosmetics except as preservative trace.',
    suggestion: 'Ensure formaldehyde concentration is below 0.2% or remove entirely.',
  },
  'MX-ING-005': {
    message: 'Formaldehyde releasers are restricted. Maximum 0.2% formaldehyde release.',
    suggestion: 'Ensure formaldehyde release does not exceed 0.2%. Use alternative preservatives.',
  },
  'MX-CLAIM-001': {
    message: 'Cosmetics cannot claim to cure, treat, or prevent diseases.',
    suggestion: 'Use cosmetic claims only (moisturizing, cleansing, beautifying, perfuming, protecting).',
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
  'BR-CLAIM-001': {
    message: "化妆品不得声称治疗、治愈或预防疾病。必须包含 'este produto não é um medicamento'（本产品不是药品）。",
    suggestion: '去除医疗/治疗性宣称。仅使用化妆品宣称（保湿、清洁、美化）。',
  },
  'BR-CLAIM-002': {
    message: "禁止绝对化美白宣称——不得使用'永久美白'、'完全消除黑色素'。氢醌禁止用于化妆品。请改用'帮助提亮肤色'。",
    suggestion: "替换为合规宣称：'帮助提亮肤色'、'均匀肤色'。",
  },
  'BR-CLAIM-003': {
    message: "防晒产品必须标明 SPF 和 UVA/UVB 防护。禁止使用'完全防护'或'无需补涂'等绝对化宣称（RDC 907/2024）。",
    suggestion: '包含 SPF 值和 UVA/UVB 标识。避免绝对防护宣称。',
  },
  'BR-CLAIM-004': {
    message: '化妆品不得声称防脱发或促进生发。这些宣称需要 ANVISA 药品注册。',
    suggestion: '使用化妆品护发宣称：保湿、调理、光泽。',
  },
  'BR-CLAIM-005': {
    message: '丰胸/紧致宣称对化妆品是禁止的。这些需要药品注册。',
    suggestion: '去除丰胸增强宣称。仅使用身体护理化妆品宣称。',
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
    message: '甲醛禁止用于化妆品，除非作为防腐剂痕迹。',
    suggestion: '确保甲醛浓度低于 0.2%，或完全去除。',
  },
  'MX-ING-005': {
    message: '甲醛释放体受限制。最大 0.2% 甲醛释放量。',
    suggestion: '确保甲醛释放不超过 0.2%。使用替代防腐剂。',
  },
  'MX-CLAIM-001': {
    message: '化妆品不得声称治疗、治愈或预防疾病。',
    suggestion: '仅使用化妆品宣称（保湿、清洁、美化、香氛、防护）。',
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
    message: 'Formaldeído é proibido em cosméticos, exceto como traço de conservante.',
    suggestion: 'Garanta concentração de formaldeído abaixo de 0,2% ou remova completamente.',
  },
  'MX-ING-005': {
    message: 'Liberadores de formaldeído são restritos. Máximo de 0,2% de liberação de formaldeído.',
    suggestion: 'Garanta que a liberação de formaldeído não exceda 0,2%. Use conservantes alternativos.',
  },
  'MX-CLAIM-001': {
    message: 'Cosméticos não podem alegar curar, tratar ou prevenir doenças.',
    suggestion: 'Use apenas alegações cosméticas (hidratação, limpeza, embelezamento, perfumação, proteção).',
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
  'MX-CLAIM-001': {
    message: 'Los cosméticos no pueden afirmar curar, tratar o prevenir enfermedades.',
    suggestion: 'Use solo afirmaciones cosméticas (hidratación, limpieza, embellecimiento, perfumado, protección).',
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
 * Falls back to English if translation not found
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

  // Fallback: return original English
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
