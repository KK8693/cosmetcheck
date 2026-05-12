// CosmetCheck Compliance Engine
// Detects ANVISA (Brazil) and COFEPRIS (Mexico) violations

import { loadRegulationRules, type LoadedRules } from './regulation-loader'
import rootClustersData from '../data/regulations/root-clusters.json'

// ── 同步构建词根簇映射（确保 checkCompliance 调用时已可用）──
const termToGroupMap = new Map<string, string>()
for (const cluster of (rootClustersData as { clusters: { groupId: string; terms: string[] }[] }).clusters) {
  for (const term of cluster.terms) {
    termToGroupMap.set(term.toLowerCase(), cluster.groupId)
  }
}

function getTermGroupId(term: string): string | undefined {
  return termToGroupMap.get(term.toLowerCase())
}

export interface CheckInput {
  ingredients?: string
  description?: string
  label?: string
  country: 'BR' | 'MX'
}

export interface Violation {
  ruleId: string
  category: 'ingredient' | 'label' | 'claim' | 'packaging'
  ruleType: 'prohibited' | 'restricted' | 'required'
  keyword: string
  severity: 'critical' | 'warning' | 'info'
  message: string
  suggestion: string
  source: string
  matchedText: string
  position?: { start: number; end: number }
  sourceField?: 'ingredients' | 'description' | 'label'  // 匹配来源字段
  contextSnippet?: string  // 原文上下文片段，高亮显示匹配位置
  casNumber?: string  // CAS号支持
  aliases?: string[] // 成分别名（支持中文、英文、葡语、西语）
  rootFamily?: string  // 成分族词根，用于归一匹配（如 "retinoids" 可匹配 "tretinoin"）
}

export interface CheckResult {
  isCompliant: boolean
  violations: Violation[]
  warnings: Violation[]
  info: Violation[]
  summary: {
    totalIssues: number
    criticalCount: number
    warningCount: number
    infoCount: number
  }
  regulationVersion: number
}

// ANVISA Rules (Brazil) - Core rules for MVP
const ANVISA_RULES: Omit<Violation, 'matchedText' | 'position'>[] = [
  // Prohibited ingredients
  {
    ruleId: 'BR-ING-001',
    category: 'ingredient',
    ruleType: 'prohibited',
    keyword: 'mercury',
    severity: 'critical',
    message: 'Mercury (Mercúrio) is prohibited in cosmetics by ANVISA RDC 529/2021.',
    suggestion: 'Remove mercury compounds from the formula.',
    aliases: ['汞', 'mercurio', 'mercúrio', 'Hg', 'mercurial', 'thimerosal', 'merthiolate', '氯化汞', 'mercury chloride'],
    source: 'ANVISA RDC 529/2021',
  },
  {
    ruleId: 'BR-ING-002',
    category: 'ingredient',
    ruleType: 'prohibited',
    keyword: 'lead',
    severity: 'critical',
    message: 'Lead (Chumbo) compounds are prohibited in cosmetics.',
    suggestion: 'Remove lead and its compounds from the formula.',
    aliases: ['铅', 'chumbo', 'plomo', 'Pb', 'lead acetate', 'lead oxide', '氧化铅', '醋酸铅', 'plomo'],
    source: 'ANVISA RDC 529/2021',
  },
  {
    ruleId: 'BR-ING-003',
    category: 'ingredient',
    ruleType: 'prohibited',
    keyword: 'hydroquinone',
    severity: 'critical',
    message: 'Hydroquinone is restricted and generally prohibited in cosmetic products.',
    suggestion: 'Remove hydroquinone or reformulate as a pharmaceutical product.',
    aliases: ['对苯二酚', 'hidroquinona', 'hidroquinona', 'HQ', 'quinol', 'benzenediol', '1,4-benzenediol', '美白剂', 'bleaching agent'],
    source: 'ANVISA RDC 529/2021',
  },
  {
    ruleId: 'BR-ING-004',
    category: 'ingredient',
    ruleType: 'prohibited',
    keyword: 'corticosteroid',
    severity: 'critical',
    message: 'Corticosteroids require medical prescription and cannot be in cosmetics.',
    suggestion: 'Remove corticosteroids - product must be registered as medicine.',
    aliases: ['皮质类固醇', 'corticosteróide', 'corticosteroide', 'steroid', 'cortisone', 'prednisone', '氢化可的松', '类固醇激素', 'corticoides'],
    source: 'ANVISA RDC 529/2021',
  },
  {
    ruleId: 'BR-ING-005',
    category: 'ingredient',
    ruleType: 'prohibited',
    keyword: 'formaldehyde',
    severity: 'critical',
    message: 'Formaldehyde is prohibited in cosmetics except as preservative trace.',
    suggestion: 'Ensure formaldehyde concentration is below 0.2% or remove entirely.',
    aliases: ['甲醛', 'formaldeído', 'formaldehído', 'formalin', 'methanal', 'formol', '福尔马林', '蚁醛', 'methylene oxide'],
    source: 'ANVISA RDC 529/2021',
  },
  {
    ruleId: 'BR-ING-006',
    category: 'ingredient',
    ruleType: 'restricted',
    keyword: 'paraben',
    severity: 'warning',
    message: 'Parabens are restricted - concentration limits apply.',
    suggestion: 'Verify total paraben concentration does not exceed 0.4% for single / 0.8% for mixtures.',
    aliases: ['对羟基苯甲酸酯', 'parabeno', 'parabeno', 'methylparaben', 'propylparaben', 'butylparaben', 'ethylparaben', 'nipagin', 'nipasol', '羟苯甲酯'],
    source: 'ANVISA RDC 529/2021',
  },
  {
    ruleId: 'BR-ING-007',
    category: 'ingredient',
    ruleType: 'restricted',
    keyword: 'retinol',
    severity: 'warning',
    message: 'Retinol (Vitamin A) concentration is restricted in cosmetics.',
    suggestion: 'Ensure retinol concentration does not exceed regulatory limits.',
    aliases: ['视黄醇', 'retinol', 'retinol', 'vitamin A', 'retinyl palmitate', 'retinyl acetate', '维生素A', '维A醇', 'retinaldehyde', 'retinal'],
    source: 'ANVISA RDC 529/2021',
  },
  // Label/Claim rules
  {
    ruleId: 'BR-LBL-001',
    category: 'claim',
    ruleType: 'prohibited',
    keyword: 'medicinal',
    severity: 'critical',
    message: 'Cosmetics cannot claim medicinal or therapeutic properties.',
    suggestion: 'Remove terms like "treats", "cures", "medicinal" from product claims.',
    aliases: ['药用', 'medicinal', 'medicinal', 'drug', 'pharmaceutical', '药品', '药物', 'medicamento', 'farmaceutico'],
    source: 'ANVISA RDC 529/2021',
  },
  {
    ruleId: 'BR-LBL-002',
    category: 'claim',
    ruleType: 'prohibited',
    keyword: 'cure',
    severity: 'critical',
    message: 'Cosmetics cannot claim to cure, treat, or prevent diseases.',
    suggestion: 'Use cosmetic claims only (moisturizing, cleansing, beautifying).',
    aliases: ['治愈', 'cura', 'cura', 'heal', 'healing', '治疗', '痊愈', 'curativo', 'terapêutico'],
    source: 'ANVISA RDC 529/2021',
  },
  {
    ruleId: 'BR-LBL-003',
    category: 'claim',
    ruleType: 'prohibited',
    keyword: '100% natural',
    severity: 'warning',
    message: '"100% natural" claims require proof and specific registration.',
    suggestion: 'Remove absolute claims unless certified. Use "contains natural ingredients" instead.',
    aliases: ['100%天然', '100% natural', '100% natural', 'all natural', 'pure natural', '纯天然', '全天然', 'totalmente natural', 'natural puro'],
    source: 'ANVISA IN 26/2022',
  },
  // === 功效宣称检测 (Effect Claims Detection - Brazil) ===
  {
    ruleId: 'BR-CLM-001',
    category: 'claim',
    ruleType: 'prohibited',
    keyword: 'anti-aging',
    severity: 'critical',
    message: '"Anti-aging" claims are considered drug-like and require medicine registration.',
    suggestion: 'Use "helps reduce the appearance of fine lines" instead of "anti-aging".',
    source: 'ANVISA RDC 529/2021',
    aliases: ['antienvejecimiento', 'antiarrug', 'anti-wrinkle', 'anti age', 'antiage'],
  },
  {
    ruleId: 'BR-CLM-002',
    category: 'claim',
    ruleType: 'prohibited',
    keyword: 'wrinkle',
    severity: 'warning',
    message: 'Wrinkle reduction claims are considered therapeutic and require proof.',
    suggestion: 'Use "helps improve skin appearance" instead of explicit wrinkle claims.',
    source: 'ANVISA RDC 529/2021',
    aliases: ['arrug', 'wrinkles', 'anti-wrinkle', 'reduces wrinkles'],
  },
  {
    ruleId: 'BR-CLM-003',
    category: 'claim',
    ruleType: 'prohibited',
    keyword: 'whitening',
    severity: 'critical',
    message: 'Skin whitening/lightening claims require special registration (medicine).',
    suggestion: 'Use "brightening" or "evens skin tone" instead of whitening claims.',
    source: 'ANVISA RDC 907/2024',
    aliases: ['branqueamento', 'blanqueamiento', 'lightening', 'skin lightening', 'fairness'],
  },
  {
    ruleId: 'BR-CLM-004',
    category: 'claim',
    ruleType: 'prohibited',
    keyword: 'treats',
    severity: 'critical',
    message: '"Treats" implies therapeutic intent - prohibited for cosmetics.',
    suggestion: 'Use cosmetic claims only: "helps maintain", "contributes to".',
    source: 'ANVISA RDC 529/2021',
    aliases: ['trata', 'tratar', 'trata de', 'treatment for', 'tratar de'],
  },
  {
    ruleId: 'BR-CLM-005',
    category: 'claim',
    ruleType: 'prohibited',
    keyword: 'removes scars',
    severity: 'critical',
    message: 'Scar removal claims require medicine registration.',
    suggestion: 'Do not claim scar removal. Use "helps improve skin appearance".',
    source: 'ANVISA RDC 529/2021',
    aliases: ['remove scars', 'elimina cicatrices', 'cicatrices', 'scar treatment'],
  },
  {
    ruleId: 'BR-CLM-006',
    category: 'claim',
    ruleType: 'prohibited',
    keyword: 'fat burner',
    severity: 'critical',
    message: 'Slimming/fat burning claims are drug-like and prohibited.',
    suggestion: 'Use "helps improve skin texture" for body products.',
    source: 'ANVISA RDC 529/2021',
    aliases: ['queima gordura', 'slimming', 'slimming', 'fat reducing', 'reductor de grasa'],
  },
  {
    ruleId: 'BR-CLM-007',
    category: 'claim',
    ruleType: 'prohibited',
    keyword: 'cellulite',
    severity: 'warning',
    message: 'Anti-cellulite claims require scientific proof and may be considered drug-like.',
    suggestion: 'Use "helps improve skin appearance" or "helps reduce the appearance of".',
    source: 'ANVISA RDC 529/2021',
    aliases: ['anti-celulite', 'celulitis', 'anticelulite', 'reduce cellulitis'],
  },
  {
    ruleId: 'BR-CLM-008',
    category: 'claim',
    ruleType: 'prohibited',
    keyword: 'permanent',
    severity: 'warning',
    message: 'Permanent results claims require proof and are often misleading.',
    suggestion: 'Do not claim permanent results. Use "helps maintain" or "long-lasting".',
    source: 'ANVISA RDC 529/2021',
    aliases: ['permanente', 'permanent results', 'efecto permanente', 'permanente'],
  },
  {
    ruleId: 'BR-CLM-009',
    category: 'claim',
    ruleType: 'prohibited',
    keyword: 'clinical',
    severity: 'info',
    message: 'Clinical claims require substantiation and cannot imply drug efficacy.',
    suggestion: 'Use "tested" or "dermatologically tested" rather than "clinical results".',
    source: 'ANVISA IN 26/2022',
    aliases: ['clínico', 'clinically proven', 'clínicamente probado'],
  },
  {
    ruleId: 'BR-CLM-010',
    category: 'claim',
    ruleType: 'prohibited',
    keyword: 'dermatologist',
    severity: 'info',
    message: 'References to dermatologist endorsement require proof.',
    suggestion: 'If claiming dermatologist-tested, ensure clinical evidence exists.',
    source: 'ANVISA IN 26/2022',
    aliases: ['dermatologist tested', 'dermatologicamente testado', 'teste dermatológico'],
  },
  {
    ruleId: 'BR-LBL-004',
    category: 'label',
    ruleType: 'required',
    keyword: 'manufacturer',
    severity: 'warning',
    message: 'Brazil requires manufacturer/distributor name and address on the label.',
    suggestion: 'Add manufacturer name, CNPJ, and complete address to the label.',
    aliases: ['制造商', 'fabricante', 'fabricante', 'manufactured by', 'made by', '生产者', '生产厂家', 'produtor'],
    source: 'ANVISA RDC 529/2021',
  },
  {
    ruleId: 'BR-LBL-005',
    category: 'label',
    ruleType: 'required',
    keyword: 'ingredient list',
    severity: 'warning',
    message: 'Ingredient list in INCI nomenclature is mandatory.',
    suggestion: 'Include full ingredient list in INCI standard format.',
    aliases: ['成分表', 'lista de ingredientes', 'lista de ingredientes', 'ingredients', 'composition', '配方', '成分', 'composição'],
    source: 'ANVISA RDC 529/2021',
  },
  {
    ruleId: 'BR-LBL-006',
    category: 'label',
    ruleType: 'required',
    keyword: 'ANVISA registration',
    severity: 'info',
    message: 'Products sold in Brazil require ANVISA registration number.',
    suggestion: 'Obtain ANVISA registration before commercialization.',
    aliases: ['ANVISA注册', 'registro ANVISA', 'registro ANVISA', 'ANVISA registration number', 'processo ANVISA', '注册号', 'anvisa', 'registro sanitário'],
    source: 'ANVISA RDC 529/2021',
  },
  // === 标签规则增强 (Enhanced Label Rules - Brazil) ===
  {
    ruleId: 'BR-LBL-007',
    category: 'label',
    ruleType: 'required',
    keyword: 'lot number',
    severity: 'warning',
    message: 'Products must display lot/batch number on the label.',
    suggestion: 'Add lot number for traceability.',
    source: 'ANVISA RDC 529/2021',
    aliases: ['número do lote', 'lote', 'batch number'],
  },
  {
    ruleId: 'BR-LBL-008',
    category: 'label',
    ruleType: 'required',
    keyword: 'expiration date',
    severity: 'warning',
    message: 'Products must display expiration date (PAO: Period After Opening).',
    suggestion: 'Add expiration date or PAO symbol.',
    source: 'ANVISA RDC 529/2021',
    aliases: ['data de validade', 'validade', 'vencimento', 'data de expiração'],
  },
  {
    ruleId: 'BR-LBL-009',
    category: 'label',
    ruleType: 'required',
    keyword: 'net content',
    severity: 'warning',
    message: 'Products must display net content (volume/weight).',
    suggestion: 'Add net content in metric units (mL, g, etc.).',
    source: 'ANVISA RDC 529/2021',
    aliases: ['conteúdo líquido', 'líquido', 'peso líquido', 'volume líquido'],
  },
  {
    ruleId: 'BR-LBL-010',
    category: 'label',
    ruleType: 'required',
    keyword: 'importer',
    severity: 'warning',
    message: 'Imported products must display importer information.',
    suggestion: 'Add importer name, CNPJ, and complete address.',
    source: 'ANVISA RDC 529/2021',
    aliases: ['importador', 'importadora', 'importado por'],
  },
  {
    ruleId: 'BR-LBL-011',
    category: 'label',
    ruleType: 'required',
    keyword: 'warnings',
    severity: 'info',
    message: 'Products must display usage warnings/precautions.',
    suggestion: 'Add relevant warnings (e.g., "Avoid eye contact", "Keep out of reach of children").',
    source: 'ANVISA RDC 529/2021',
    aliases: ['advertências', 'precauções', 'warnings', 'contraindicações'],
  },
  // Additional MVP prohibited ingredients
  {
    ruleId: 'BR-ING-026',
    category: 'ingredient',
    ruleType: 'prohibited',
    keyword: 'tretinoin',
    severity: 'critical',
    message: 'Tretinoin (Retinoic Acid) is a drug-level ingredient prohibited in cosmetics in Brazil.',
    suggestion: 'Remove tretinoin. If used, product must be registered as medicine with ANVISA.',
    aliases: ['维甲酸', 'tretinoína', 'tretinoína', 'retinoic acid', 'vitamin A acid', 'all-trans retinoic acid', '视黄酸', '维A酸', 'retin-A'],
    source: 'ANVISA RDC 665/2022',
  },
  {
    ruleId: 'BR-ING-008',
    category: 'ingredient',
    ruleType: 'prohibited',
    keyword: 'retinoic acid',
    severity: 'critical',
    message: 'Retinoic Acid is a drug-level ingredient prohibited in cosmetics in Brazil.',
    suggestion: 'Remove retinoic acid. If used, product must be registered as medicine with ANVISA.',
    aliases: ['视黄酸', 'ácido retinoico', 'ácido retinoico', 'vitamin A acid', 'tretinoin', 'all-trans retinoic acid', '维A酸', 'retinoic', 'retinol acid'],
    source: 'ANVISA RDC 665/2022',
  },
  {
    ruleId: 'BR-ING-009',
    category: 'ingredient',
    ruleType: 'prohibited',
    keyword: 'arsenic',
    severity: 'critical',
    message: 'Arsenic and its compounds are prohibited in cosmetics by ANVISA.',
    suggestion: 'Remove arsenic compounds from the formula.',
    aliases: ['砷', 'arsênio', 'arsénico', 'As', 'arsenic trioxide', '三氧化二砷', '砒霜', 'arsenite', 'arsenate'],
    source: 'ANVISA RDC 529/2021',
  },
  {
    ruleId: 'BR-ING-010',
    category: 'ingredient',
    ruleType: 'prohibited',
    keyword: 'cadmium',
    severity: 'critical',
    message: 'Cadmium and its compounds are prohibited in cosmetics by ANVISA.',
    suggestion: 'Remove cadmium compounds from the formula.',
    aliases: ['镉', 'cádmio', 'cadmio', 'Cd', 'cadmium sulfide', '硫化镉', 'cadmium oxide', '氧化镉', 'cadmium chloride'],
    source: 'ANVISA RDC 529/2021',
  },
  {
    ruleId: 'BR-ING-011',
    category: 'ingredient',
    ruleType: 'prohibited',
    keyword: 'betamethasone',
    severity: 'critical',
    message: 'Betamethasone is a corticosteroid prohibited in cosmetics.',
    suggestion: 'Remove corticosteroids - product must be registered as medicine.',
    aliases: ['倍他米松', 'betametasona', 'betametasona', 'steroid', 'corticosteroid', '糖皮质激素', 'beta-methasone', 'Celestone', 'betamethasone valerate'],
    source: 'ANVISA RDC 529/2021',
  },
  {
    ruleId: 'BR-ING-012',
    category: 'ingredient',
    ruleType: 'prohibited',
    keyword: 'hydrocortisone',
    severity: 'critical',
    message: 'Hydrocortisone is a corticosteroid prohibited in cosmetics.',
    suggestion: 'Remove corticosteroids - product must be registered as medicine.',
    aliases: ['氢化可的松', 'hidrocortisona', 'hidrocortisona', 'cortisol', 'steroid', 'corticosteroid', '皮质醇', 'hydrocortisone acetate', 'cortef'],
    source: 'ANVISA RDC 529/2021',
  },
  // === RDC 907/2024 核心禁用成分 (Brazil Prohibited Ingredients) ===
  {
    ruleId: 'BR-ING-013',
    category: 'ingredient',
    ruleType: 'prohibited',
    keyword: 'mercury compounds',
    severity: 'critical',
    message: 'Mercury compounds (e.g., mercury chloride, mercuric oxide) are prohibited in cosmetics.',
    suggestion: 'Remove all mercury compounds. Use alternative preservatives.',
    source: 'ANVISA RDC 907/2024',
    casNumber: '7487-94-7',
    aliases: ['cloreto de mercúrio', 'oxido de mercúrio', 'mercuric chloride', 'mercuric oxide'],
  },
  {
    ruleId: 'BR-ING-014',
    category: 'ingredient',
    ruleType: 'prohibited',
    keyword: 'hydroquinone',
    severity: 'critical',
    message: 'Hydroquinone is prohibited for skin lightening in cosmetics (RDC 907/2024).',
    suggestion: 'Remove hydroquinone. Use alternative brightening agents like alpha-arbutin.',
    source: 'ANVISA RDC 907/2024',
    casNumber: '123-31-9',
    aliases: ['hidroquinona', '1,4-benzenediol', 'benzene-1,4-diol'],
  },
  {
    ruleId: 'BR-ING-015',
    category: 'ingredient',
    ruleType: 'prohibited',
    keyword: 'alpha hydroxy acid',
    severity: 'warning',
    message: 'AHAs are restricted - concentration limits apply (max 10% for rinse-off, 4% for leave-on).',
    suggestion: 'Ensure AHA concentration complies with RDC 907/2024 limits.',
    source: 'ANVISA RDC 907/2024',
    aliases: ['ácido glicólico', 'ácido lático', 'glycolic acid', 'lactic acid', 'AHA'],
  },
  {
    ruleId: 'BR-ING-016',
    category: 'ingredient',
    ruleType: 'prohibited',
    keyword: 'salicylic acid',
    severity: 'warning',
    message: 'Salicylic acid concentration is restricted (max 2% for leave-on products).',
    suggestion: 'Ensure salicylic acid does not exceed 2% in leave-on products.',
    source: 'ANVISA RDC 907/2024',
    casNumber: '69-72-7',
    aliases: ['ácido salicílico', 'beta hydroxy acid', 'BHA'],
  },
  {
    ruleId: 'BR-ING-017',
    category: 'ingredient',
    ruleType: 'prohibited',
    keyword: 'retinoids',
    severity: 'critical',
    message: 'Retinoids (Retinol, Retinyl Palmitate, Tretinoin) are restricted in cosmetics.',
    suggestion: 'Ensure retinol concentration does not exceed 0.05% (5000 IU/g). Tretinoin requires medical prescription.',
    source: 'ANVISA RDC 907/2024',
    aliases: ['retinol', 'retinyl palmitate', 'tretinoin', 'adapalene', 'retinoic acid', 'retinol palmitate'],
  },
  {
    ruleId: 'BR-ING-018',
    category: 'ingredient',
    ruleType: 'prohibited',
    keyword: 'triclocarban',
    severity: 'critical',
    message: 'Triclocarban is prohibited in cosmetics in Brazil.',
    suggestion: 'Remove triclocarban. Use alternative antibacterial agents.',
    source: 'ANVISA RDC 907/2024',
    casNumber: '101-20-2',
    aliases: ['tricocarbano', 'TCC'],
  },
  {
    ruleId: 'BR-ING-019',
    category: 'ingredient',
    ruleType: 'prohibited',
    keyword: 'triclosan',
    severity: 'warning',
    message: 'Triclosan is restricted in cosmetics - not allowed in leave-on products.',
    suggestion: 'Use in rinse-off products only, max 0.3%. Not permitted in leave-on.',
    source: 'ANVISA RDC 907/2024',
    casNumber: '3380-34-5',
    aliases: ['triclosano', '5-chloro-2-(2,4-dichlorophenoxy)phenol'],
  },
  // Talco (滑石粉) - 婴幼儿产品需特别关注，石棉污染风险
  {
    ruleId: 'BR-ING-021',
    category: 'ingredient',
    ruleType: 'restricted',
    keyword: 'talco',
    severity: 'warning',
    message: 'Talco (Talcum) in cosmetics requires purity verification - asbestos-free certification mandatory for infant products.',
    suggestion: 'Ensure talc is asbestos-free. For infant products, ANVISA requires specific certification.',
    source: 'ANVISA RDC 55/2011',
    aliases: ['talco', 'talcum', 'magnesium silicate', 'silicato de magnésio'],
  },
  {
    ruleId: 'BR-ING-020',
    category: 'ingredient',
    ruleType: 'prohibited',
    keyword: 'formaldehyde',
    severity: 'critical',
    message: 'Formaldehyde releasers are restricted. Maximum 0.2% formaldehyde release.',
    suggestion: 'Ensure formaldehyde release does not exceed 0.2%. Use alternative preservatives.',
    source: 'ANVISA RDC 907/2024',
    casNumber: '50-00-0',
    aliases: ['formaldeído', 'formalin', 'methanal'],
  },
  {
    ruleId: 'BR-ING-022',
    category: 'ingredient',
    ruleType: 'prohibited',
    keyword: 'arsenic',
    severity: 'critical',
    message: 'Arsenic and its compounds are prohibited in cosmetics.',
    suggestion: 'Remove all arsenic compounds from the formula.',
    source: 'ANVISA RDC 907/2024',
    casNumber: '7440-38-2',
    aliases: ['arsênio', 'arsenic trioxide'],
  },
  {
    ruleId: 'BR-ING-023',
    category: 'ingredient',
    ruleType: 'prohibited',
    keyword: 'cadmium',
    severity: 'critical',
    message: 'Cadmium and its compounds are prohibited in cosmetics.',
    suggestion: 'Remove all cadmium compounds from the formula.',
    source: 'ANVISA RDC 907/2024',
    casNumber: '7440-43-9',
    aliases: ['cádmio', 'cadmium sulfide'],
  },
  {
    ruleId: 'BR-ING-024',
    category: 'ingredient',
    ruleType: 'prohibited',
    keyword: 'hexachlorophene',
    severity: 'critical',
    message: 'Hexachlorophene is prohibited in cosmetics.',
    suggestion: 'Remove hexachlorophene. Use alternative preservatives.',
    source: 'ANVISA RDC 907/2024',
    casNumber: '70-30-4',
    aliases: ['hexaclorofeno', 'HCP'],
  },
  {
    ruleId: 'BR-ING-025',
    category: 'ingredient',
    ruleType: 'prohibited',
    keyword: 'bithionol',
    severity: 'critical',
    message: 'Bithionol is prohibited in cosmetics.',
    suggestion: 'Remove bithionol. Use alternative preservatives.',
    source: 'ANVISA RDC 907/2024',
    casNumber: '97-18-7',
    aliases: ['bitionol'],
  },
]

// COFEPRIS Rules (Mexico)
const COFEPRIS_RULES: Omit<Violation, 'matchedText' | 'position'>[] = [
  // Prohibited ingredients
  {
    ruleId: 'MX-ING-001',
    category: 'ingredient',
    ruleType: 'prohibited',
    keyword: 'mercury',
    severity: 'critical',
    message: 'Mercury (Mercurio) is prohibited in cosmetics by COFEPRIS.',
    suggestion: 'Remove mercury compounds from the formula.',
    aliases: ['汞', 'mercurio', 'mercúrio', 'Hg', 'mercurial', 'thimerosal', 'merthiolate', '氯化汞', 'mercury chloride'],
    source: 'COFEPRIS NOM-259-SSA1-2014',
  },
  {
    ruleId: 'MX-ING-002',
    category: 'ingredient',
    ruleType: 'prohibited',
    keyword: 'lead',
    severity: 'critical',
    message: 'Lead (Plomo) is prohibited in cosmetics.',
    suggestion: 'Remove lead and its compounds.',
    aliases: ['铅', 'chumbo', 'plomo', 'Pb', 'lead acetate', 'lead oxide', '氧化铅', '醋酸铅', 'plomo'],
    source: 'COFEPRIS NOM-259-SSA1-2014',
  },
  {
    ruleId: 'MX-ING-003',
    category: 'ingredient',
    ruleType: 'prohibited',
    keyword: 'hydroquinone',
    severity: 'critical',
    message: 'Hydroquinone is prohibited in cosmetics by COFEPRIS.',
    suggestion: 'Remove hydroquinone or register as pharmaceutical product.',
    aliases: ['对苯二酚', 'hidroquinona', 'hidroquinona', 'HQ', 'quinol', 'benzenediol', '1,4-benzenediol', '美白剂', 'bleaching agent'],
    source: 'COFEPRIS NOM-141-SSA1/SCF1-2012',
  },
  {
    ruleId: 'MX-ING-004',
    category: 'ingredient',
    ruleType: 'prohibited',
    keyword: 'corticosteroid',
    severity: 'critical',
    message: 'Corticosteroids are prohibited in cosmetic products.',
    suggestion: 'Remove corticosteroids - product must be registered as medicine.',
    aliases: ['皮质类固醇', 'corticosteróide', 'corticosteroide', 'steroid', 'cortisone', 'prednisone', '氢化可的松', '类固醇激素', 'corticoides'],
    source: 'COFEPRIS NOM-259-SSA1-2014',
  },
  {
    ruleId: 'MX-ING-005',
    category: 'ingredient',
    ruleType: 'prohibited',
    keyword: 'formaldehyde',
    severity: 'critical',
    message: 'Formaldehyde is prohibited in nail products and restricted in others.',
    suggestion: 'Ensure formaldehyde is not used as an ingredient.',
    aliases: ['甲醛', 'formaldeído', 'formaldehído', 'formalin', 'methanal', 'formol', '福尔马林', '蚁醛', 'methylene oxide'],
    source: 'COFEPRIS NOM-259-SSA1-2014',
  },
  {
    ruleId: 'MX-ING-006',
    category: 'ingredient',
    ruleType: 'restricted',
    keyword: 'paraben',
    severity: 'warning',
    message: 'Parabens are restricted - concentration limits apply.',
    suggestion: 'Verify paraben concentrations comply with NOM limits.',
    aliases: ['对羟基苯甲酸酯', 'parabeno', 'parabeno', 'methylparaben', 'propylparaben', 'butylparaben', 'ethylparaben', 'nipagin', 'nipasol', '羟苯甲酯'],
    source: 'COFEPRIS NOM-141-SSA1/SCF1-2012',
  },
  {
    ruleId: 'MX-ING-007',
    category: 'ingredient',
    ruleType: 'restricted',
    keyword: 'retinol',
    severity: 'warning',
    message: 'Retinol concentration is restricted in cosmetics.',
    suggestion: 'Ensure retinol concentration is within allowed limits.',
    aliases: ['视黄醇', 'retinol', 'retinol', 'vitamin A', 'retinyl palmitate', 'retinyl acetate', '维生素A', '维A醇', 'retinaldehyde', 'retinal'],
    source: 'COFEPRIS NOM-141-SSA1/SCF1-2012',
  },
  // Label/Claim rules
  {
    ruleId: 'MX-LBL-001',
    category: 'claim',
    ruleType: 'prohibited',
    keyword: 'medicinal',
    severity: 'critical',
    message: 'Cosmetics cannot claim medicinal or therapeutic properties.',
    suggestion: 'Remove therapeutic claims. Use cosmetic claims only.',
    aliases: ['药用', 'medicinal', 'medicinal', 'drug', 'pharmaceutical', '药品', '药物', 'medicamento', 'farmaceutico'],
    source: 'COFEPRIS NOM-141-SSA1/SCF1-2012',
  },
  {
    ruleId: 'MX-LBL-002',
    category: 'claim',
    ruleType: 'prohibited',
    keyword: 'cure',
    severity: 'critical',
    message: 'Cosmetics cannot claim to cure, treat, or prevent diseases.',
    suggestion: 'Remove disease-related claims.',
    aliases: ['治愈', 'cura', 'cura', 'heal', 'healing', '治疗', '痊愈', 'curativo', 'terapêutico'],
    source: 'COFEPRIS NOM-141-SSA1/SCF1-2012',
  },
  // === 功效宣称检测 (Effect Claims Detection - Mexico) ===
  {
    ruleId: 'MX-CLM-001',
    category: 'claim',
    ruleType: 'prohibited',
    keyword: 'anti-aging',
    severity: 'critical',
    message: '"Anti-aging" claims are considered drug-like in Mexico.',
    suggestion: 'Use "ayuda a reducir la apariencia de líneas de expresión" instead.',
    source: 'COFEPRIS NOM-141-SSA1/SCF1-2012',
    aliases: ['antienvejecimiento', 'anti-edad', 'anti-wrinkle', 'anti age', 'antiage'],
  },
  {
    ruleId: 'MX-CLM-002',
    category: 'claim',
    ruleType: 'prohibited',
    keyword: 'wrinkle',
    severity: 'warning',
    message: 'Wrinkle reduction claims require scientific proof.',
    suggestion: 'Use "ayuda a mejorar la apariencia de la piel" instead.',
    source: 'COFEPRIS NOM-141-SSA1/SCF1-2012',
    aliases: ['arrug', 'arrugas', 'anti-arrugas', 'reduce arrugas'],
  },
  {
    ruleId: 'MX-CLM-003',
    category: 'claim',
    ruleType: 'prohibited',
    keyword: 'whitening',
    severity: 'critical',
    message: 'Skin whitening claims require medicine registration in Mexico.',
    suggestion: 'Use "aclarante" or "iluminador" instead of "blanqueador".',
    source: 'COFEPRIS NOM-141-SSA1/SCF1-2012',
    aliases: ['blanqueamiento', 'blanqueador', 'lightening', 'skin lightening', 'aclarante'],
  },
  {
    ruleId: 'MX-CLM-004',
    category: 'claim',
    ruleType: 'prohibited',
    keyword: 'treats',
    severity: 'critical',
    message: '"Treats" implies therapeutic intent - prohibited for cosmetics.',
    suggestion: 'Use cosmetic claims only.',
    source: 'COFEPRIS NOM-141-SSA1/SCF1-2012',
    aliases: ['trata', 'tratar', 'trata de', 'treatment for', 'tratar de'],
  },
  {
    ruleId: 'MX-CLM-005',
    category: 'claim',
    ruleType: 'prohibited',
    keyword: 'removes scars',
    severity: 'critical',
    message: 'Scar removal claims require medicine registration.',
    suggestion: 'Do not claim scar removal.',
    source: 'COFEPRIS NOM-141-SSA1/SCF1-2012',
    aliases: ['elimina cicatrices', 'cicatrices', 'tratamiento de cicatrices'],
  },
  {
    ruleId: 'MX-CLM-006',
    category: 'claim',
    ruleType: 'prohibited',
    keyword: 'fat burner',
    severity: 'critical',
    message: 'Slimming/fat burning claims are prohibited in Mexico.',
    suggestion: 'Use "ayuda a mejorar la textura de la piel" for body products.',
    source: 'COFEPRIS NOM-141-SSA1/SCF1-2012',
    aliases: ['quema grasa', 'reductor de grasa', 'slimming', 'reductor'],
  },
  {
    ruleId: 'MX-CLM-007',
    category: 'claim',
    ruleType: 'prohibited',
    keyword: 'cellulite',
    severity: 'warning',
    message: 'Anti-cellulite claims require scientific proof.',
    suggestion: 'Use "ayuda a mejorar la apariencia de la piel".',
    source: 'COFEPRIS NOM-141-SSA1/SCF1-2012',
    aliases: ['anti-celulitis', 'celulitis', 'anticelulitis', 'reduce celulitis'],
  },
  {
    ruleId: 'MX-CLM-008',
    category: 'claim',
    ruleType: 'prohibited',
    keyword: 'permanent',
    severity: 'warning',
    message: 'Permanent results claims require proof.',
    suggestion: 'Do not claim permanent results.',
    source: 'COFEPRIS NOM-141-SSA1/SCF1-2012',
    aliases: ['permanente', 'resultados permanentes', 'efecto permanente'],
  },
  {
    ruleId: 'MX-CLM-009',
    category: 'claim',
    ruleType: 'prohibited',
    keyword: 'clinical',
    severity: 'info',
    message: 'Clinical claims require substantiation.',
    suggestion: 'Use "testado dermatológicamente" instead of "clínico".',
    source: 'COFEPRIS NOM-141-SSA1/SCF1-2012',
    aliases: ['clínico', 'clínicamente probado', 'clinicamente probado'],
  },
  {
    ruleId: 'MX-CLM-010',
    category: 'claim',
    ruleType: 'prohibited',
    keyword: 'dermatologist',
    severity: 'info',
    message: 'References to dermatologist endorsement require proof.',
    suggestion: 'If claiming dermatologist-tested, ensure clinical evidence exists.',
    source: 'COFEPRIS NOM-141-SSA1/SCF1-2012',
    aliases: ['dermatologist tested', 'testeado por dermatólogo', 'dermatológicamente testado'],
  },
  {
    ruleId: 'MX-LBL-003',
    category: 'label',
    ruleType: 'required',
    keyword: 'manufacturer',
    severity: 'warning',
    message: 'Mexico requires manufacturer/importer name and address on label.',
    suggestion: 'Add manufacturer name and address in Spanish.',
    aliases: ['制造商', 'fabricante', 'fabricante', 'manufactured by', 'made by', '生产者', '生产厂家', 'produtor'],
    source: 'COFEPRIS NOM-141-SSA1/SCF1-2012',
  },
  {
    ruleId: 'MX-LBL-004',
    category: 'label',
    ruleType: 'required',
    keyword: 'ingredient list',
    severity: 'warning',
    message: 'Ingredient list in INCI nomenclature is mandatory.',
    suggestion: 'Include full ingredient list in INCI standard format.',
    aliases: ['成分表', 'lista de ingredientes', 'lista de ingredientes', 'ingredients', 'composition', '配方', '成分', 'composición'],
    source: 'COFEPRIS NOM-141-SSA1/SCF1-2012',
  },
  {
    ruleId: 'MX-LBL-005',
    category: 'label',
    ruleType: 'required',
    keyword: 'COFEPRIS registration',
    severity: 'info',
    message: 'Products sold in Mexico require COFEPRIS registration.',
    suggestion: 'Obtain COFEPRIS registration before commercialization.',
    aliases: ['COFEPRIS注册', 'registro COFEPRIS', 'registro COFEPRIS', 'COFEPRIS registration', 'registro sanitario', '注册号', 'cofepris', 'registro'],
    source: 'COFEPRIS NOM-141-SSA1/SCF1-2012',
  },
  // Additional MVP prohibited ingredients for Mexico
  {
    ruleId: 'MX-ING-018',
    category: 'ingredient',
    ruleType: 'prohibited',
    keyword: 'tretinoin',
    severity: 'critical',
    message: 'Tretinoin (Retinoic Acid) is a drug-level ingredient prohibited in cosmetics in Mexico.',
    suggestion: 'Remove tretinoin. If used, product must be registered as medicine with COFEPRIS.',
    source: 'COFEPRIS NOM-141-SSA1/SCF1-2012',
    aliases: ['retinol', 'retinyl palmitate', 'retinoic acid', 'adapalene', 'retinol palmitate'],
    rootFamily: 'retinoids,retinol,tretinoin,retinoic',
  },
  {
    ruleId: 'MX-ING-008',
    category: 'ingredient',
    ruleType: 'prohibited',
    keyword: 'retinoic acid',
    severity: 'critical',
    message: 'Retinoic Acid is a drug-level ingredient prohibited in cosmetics in Mexico.',
    suggestion: 'Remove retinoic acid. If used, product must be registered as medicine.',
    aliases: ['视黄酸', 'ácido retinoico', 'ácido retinoico', 'vitamin A acid', 'tretinoin', 'all-trans retinoic acid', '维A酸', 'retinoic', 'retinol acid'],
    source: 'COFEPRIS NOM-141-SSA1/SCF1-2012',
  },
  {
    ruleId: 'MX-ING-009',
    category: 'ingredient',
    ruleType: 'prohibited',
    keyword: 'arsenic',
    severity: 'critical',
    message: 'Arsenic and its compounds are prohibited in cosmetics by COFEPRIS.',
    suggestion: 'Remove arsenic compounds from the formula.',
    aliases: ['砷', 'arsênio', 'arsénico', 'As', 'arsenic trioxide', '三氧化二砷', '砒霜', 'arsenite', 'arsenate'],
    source: 'COFEPRIS NOM-259-SSA1-2014',
  },
  {
    ruleId: 'MX-ING-010',
    category: 'ingredient',
    ruleType: 'prohibited',
    keyword: 'cadmium',
    severity: 'critical',
    message: 'Cadmium and its compounds are prohibited in cosmetics by COFEPRIS.',
    suggestion: 'Remove cadmium compounds from the formula.',
    aliases: ['镉', 'cádmio', 'cadmio', 'Cd', 'cadmium sulfide', '硫化镉', 'cadmium oxide', '氧化镉', 'cadmium chloride'],
    source: 'COFEPRIS NOM-259-SSA1-2014',
  },
  {
    ruleId: 'MX-ING-011',
    category: 'ingredient',
    ruleType: 'prohibited',
    keyword: 'betamethasone',
    severity: 'critical',
    message: 'Betamethasone is a corticosteroid prohibited in cosmetics.',
    suggestion: 'Remove corticosteroids - product must be registered as medicine.',
    aliases: ['倍他米松', 'betametasona', 'betametasona', 'steroid', 'corticosteroid', '糖皮质激素', 'beta-methasone', 'Celestone', 'betamethasone valerate'],
    source: 'COFEPRIS NOM-259-SSA1-2014',
  },
  {
    ruleId: 'MX-ING-012',
    category: 'ingredient',
    ruleType: 'prohibited',
    keyword: 'hydrocortisone',
    severity: 'critical',
    message: 'Hydrocortisone is a corticosteroid prohibited in cosmetics.',
    suggestion: 'Remove corticosteroids - product must be registered as medicine.',
    aliases: ['氢化可的松', 'hidrocortisona', 'hidrocortisona', 'cortisol', 'steroid', 'corticosteroid', '皮质醇', 'hydrocortisone acetate', 'cortef'],
    source: 'COFEPRIS NOM-259-SSA1-2014',
  },
  // === NOM-141 防晒标签 SPF 要求 (Mexico Sunscreen Label Requirements) ===
  {
    ruleId: 'MX-LBL-006',
    category: 'label',
    ruleType: 'required',
    keyword: 'sunscreen',
    severity: 'critical',
    message: 'Sunscreen products must display SPF value on the label (NOM-141 requirement).',
    suggestion: 'Add SPF value on the label. Without SPF, customs may detain the product.',
    aliases: ['防晒霜', 'protetor solar', 'protector solar', 'sunscreen', 'sun block', '防晒', 'bloqueador solar', 'bloqueador'],
    source: 'COFEPRIS NOM-141-SSA1/SCF1-2012',
  },
  {
    ruleId: 'MX-LBL-007',
    category: 'label',
    ruleType: 'required',
    keyword: 'sun protection',
    severity: 'critical',
    message: 'Sunscreen products must display SPF value on the label (NOM-141 requirement).',
    suggestion: 'Add SPF value on the label. Without SPF, customs may detain the product.',
    aliases: ['防晒保护', 'proteção solar', 'protección solar', 'sun protection', 'uv protection', '防紫外线', '防晒指数', 'proteção uv'],
    source: 'COFEPRIS NOM-141-SSA1/SCF1-2012',
  },
  {
    ruleId: 'MX-LBL-008',
    category: 'label',
    ruleType: 'required',
    keyword: 'spf',
    severity: 'info',
    message: 'Verify SPF value is clearly displayed on the label.',
    suggestion: 'SPF must be visible on the front panel of the packaging.',
    aliases: ['防晒指数', 'fator de proteção solar', 'factor de protección solar', 'sun protection factor', 'spf rating', '防晒系数', '防晒值', 'protección solar'],
    source: 'COFEPRIS NOM-141-SSA1/SCF1-2012',
  },
  {
    ruleId: 'MX-LBL-009',
    category: 'label',
    ruleType: 'required',
    keyword: 'fps',
    severity: 'info',
    message: 'Verify SPF (FPS) value is clearly displayed on the label.',
    suggestion: 'SPF/FPS must be visible on the front panel of the packaging.',
    aliases: ['FPS', 'fator de proteção solar', 'factor de protección solar', 'sun protection factor', 'spf', '防晒系数', '防晒值', 'proteção solar'],
    source: 'COFEPRIS NOM-141-SSA1/SCF1-2012',
  },
  {
    ruleId: 'MX-LBL-010',
    category: 'label',
    ruleType: 'required',
    keyword: 'protector solar',
    severity: 'critical',
    message: 'Los productos de protección solar deben mostrar el valor SPF en la etiqueta.',
    suggestion: 'Añadir SPF en la etiqueta. Sin SPF, aduanas pueden retener el producto.',
    aliases: ['防晒霜', 'protetor solar', 'protector solar', 'sunscreen', 'sun block', '防晒', 'bloqueador solar', 'bloqueador'],
    source: 'COFEPRIS NOM-141-SSA1/SCF1-2012',
  },
  // === 额外禁用成分 (Additional Mexico Prohibited) ===
  {
    ruleId: 'MX-ING-013',
    category: 'ingredient',
    ruleType: 'prohibited',
    keyword: 'triclocarban',
    severity: 'critical',
    message: 'Triclocarban is prohibited in cosmetics in Mexico.',
    suggestion: 'Remove triclocarban. Use alternative antibacterial agents.',
    source: 'COFEPRIS NOM-141-SSA1/SCF1-2012',
    casNumber: '101-20-2',
    aliases: ['tricocarbano', 'TCC'],
  },
  {
    ruleId: 'MX-ING-014',
    category: 'ingredient',
    ruleType: 'prohibited',
    keyword: 'triclosan',
    severity: 'warning',
    message: 'Triclosan is restricted in cosmetics - not allowed in leave-on products.',
    suggestion: 'Use in rinse-off products only, max 0.3%. Not permitted in leave-on.',
    source: 'COFEPRIS NOM-141-SSA1/SCF1-2012',
    casNumber: '3380-34-5',
    aliases: ['triclosano'],
  },
  {
    ruleId: 'MX-ING-015',
    category: 'ingredient',
    ruleType: 'prohibited',
    keyword: 'formaldehyde',
    severity: 'critical',
    message: 'Formaldehyde is prohibited in nail products and restricted in others.',
    suggestion: 'Ensure formaldehyde is not used as an ingredient. Max 0.2% in preservatives.',
    source: 'COFEPRIS NOM-141-SSA1/SCF1-2012',
    casNumber: '50-00-0',
    aliases: ['formaldehído', 'formalin'],
  },
  {
    ruleId: 'MX-ING-016',
    category: 'ingredient',
    ruleType: 'prohibited',
    keyword: 'hexachlorophene',
    severity: 'critical',
    message: 'Hexachlorophene is prohibited in cosmetics.',
    suggestion: 'Remove hexachlorophene. Use alternative preservatives.',
    source: 'COFEPRIS NOM-141-SSA1/SCF1-2012',
    casNumber: '70-30-4',
    aliases: ['hexaclorofeno'],
  },
  {
    ruleId: 'MX-ING-017',
    category: 'ingredient',
    ruleType: 'prohibited',
    keyword: 'bithionol',
    severity: 'critical',
    message: 'Bithionol is prohibited in cosmetics.',
    suggestion: 'Remove bithionol. Use alternative preservatives.',
    source: 'COFEPRIS NOM-141-SSA1/SCF1-2012',
    casNumber: '97-18-7',
    aliases: ['bitionol'],
  },
  // === 标签规则增强 (Enhanced Label Rules - Mexico) ===
  {
    ruleId: 'MX-LBL-011',
    category: 'label',
    ruleType: 'required',
    keyword: 'lot number',
    severity: 'warning',
    message: 'Products must display lot/batch number on the label.',
    suggestion: 'Add lot number for traceability.',
    source: 'COFEPRIS NOM-141-SSA1/SCF1-2012',
    aliases: ['número de lote', 'lote', 'batch number'],
  },
  {
    ruleId: 'MX-LBL-012',
    category: 'label',
    ruleType: 'required',
    keyword: 'expiration date',
    severity: 'warning',
    message: 'Products must display expiration date (PAO: Period After Opening).',
    suggestion: 'Add expiration date or PAO symbol.',
    source: 'COFEPRIS NOM-141-SSA1/SCF1-2012',
    aliases: ['fecha de caducidad', 'caducidad', 'vencimiento', 'fecha de expiración'],
  },
  {
    ruleId: 'MX-LBL-013',
    category: 'label',
    ruleType: 'required',
    keyword: 'net content',
    severity: 'warning',
    message: 'Products must display net content (volume/weight).',
    suggestion: 'Add net content in metric units (mL, g, etc.).',
    source: 'COFEPRIS NOM-141-SSA1/SCF1-2012',
    aliases: ['contenido neto', 'neto', 'peso neto', 'volumen neto'],
  },
  {
    ruleId: 'MX-LBL-014',
    category: 'label',
    ruleType: 'required',
    keyword: 'importer',
    severity: 'warning',
    message: 'Imported products must display importer information.',
    suggestion: 'Add importer name, address, and RFC.',
    source: 'COFEPRIS NOM-141-SSA1/SCF1-2012',
    aliases: ['importador', 'importadora', 'imported by'],
  },
  {
    ruleId: 'MX-LBL-015',
    category: 'label',
    ruleType: 'required',
    keyword: 'warnings',
    severity: 'info',
    message: 'Products must display usage warnings/precautions.',
    suggestion: 'Add relevant warnings (e.g., "Avoid eye contact", "Keep out of reach of children").',
    source: 'COFEPRIS NOM-141-SSA1/SCF1-2012',
    aliases: ['advertencias', 'precauciones', 'warnings', 'contraindicaciones'],
  },
]

// 生成上下文片段：在匹配词前后各取一定字符，高亮显示匹配位置
function generateContextSnippet(
  text: string,
  matchStart: number,
  matchEnd: number,
  contextLength: number = 50
): string {
  const lowerText = text.toLowerCase()
  const matchText = text.substring(matchStart, matchEnd)
  
  // 提取匹配词前后各 contextLength 个字符
  const snippetStart = Math.max(0, matchStart - contextLength)
  const snippetEnd = Math.min(text.length, matchEnd + contextLength)
  
  let snippet = ''
  
  // 添加前导省略标记
  if (snippetStart > 0) {
    snippet += '...'
  }
  
  // 获取中间部分（包括匹配词）
  const middlePart = text.substring(snippetStart, snippetEnd)
  
  // 在中间部分中找到匹配词的位置（相对位置）
  const relativeMatchStart = matchStart - snippetStart
  const relativeMatchEnd = matchEnd - snippetStart
  
  // 构建带高亮的片段：前导部分 + 高亮匹配 + 后续部分
  const beforeMatch = middlePart.substring(0, relativeMatchStart)
  const matched = middlePart.substring(relativeMatchStart, relativeMatchEnd)
  const afterMatch = middlePart.substring(relativeMatchEnd)
  
  // 使用【匹配词】格式高亮
  snippet += beforeMatch + '【' + matched + '】' + afterMatch
  
  // 添加尾部省略标记
  if (snippetEnd < text.length) {
    snippet += '...'
  }
  
  return snippet
}

// 检查匹配位置是否为词边界（避免子字符串误匹配，如 "lead" 匹配 "sunflower"）
function isWordBoundary(text: string, matchStart: number, matchEnd: number): boolean {
  const isWordChar = (c: string) => /[a-zA-Z0-9_]/.test(c)
  
  const before = matchStart > 0 ? text[matchStart - 1] : ''
  const after = matchEnd < text.length ? text[matchEnd] : ''
  
  const beforeOk = matchStart === 0 || !isWordChar(before)
  const afterOk = matchEnd >= text.length || !isWordChar(after)
  
  return beforeOk && afterOk
}

// 查找第一个满足词边界的匹配位置
function findWordBoundaryMatch(text: string, candidate: string): { index: number; length: number } | null {
  let searchFrom = 0
  while (true) {
    const index = text.indexOf(candidate, searchFrom)
    if (index === -1) return null
    
    if (isWordBoundary(text, index, index + candidate.length)) {
      return { index, length: candidate.length }
    }
    
    searchFrom = index + 1
  }
}

function findMatches(
  text: string, 
  rules: Omit<Violation, 'matchedText' | 'position' | 'sourceField' | 'contextSnippet'>[],
  sourceField: 'ingredients' | 'description' | 'label' = 'description'
): Violation[] {
  const violations: Violation[] = []
  const lowerText = text.toLowerCase()
  const seenRuleIds = new Set<string>() // 去重：每个 ruleId 只记录一次

  for (const rule of rules) {
    // Skip if already matched this ruleId (deduplication)
    if (seenRuleIds.has(rule.ruleId)) continue

    // ── 短语优先匹配 ──
    // 收集所有候选匹配项（keyword + aliases + rootFamily + CAS），按长度降序排列
    // 这样更长的、更具体的短语会优先匹配，避免短词抢占长词的位置
    type Candidate = {
      text: string
      type: 'keyword' | 'alias' | 'rootFamily' | 'cas'
      familyTerm?: string
    }

    const candidates: Candidate[] = []

    // 1) 主关键词
    candidates.push({ text: rule.keyword.toLowerCase(), type: 'keyword' })

    // 2) 别名
    if (rule.aliases) {
      for (const alias of rule.aliases) {
        candidates.push({ text: alias.toLowerCase(), type: 'alias' })
      }
    }

    // 3) 词根族
    if (rule.rootFamily) {
      const familyTerms = rule.rootFamily.toLowerCase().split(/[,，|]/)
      for (const term of familyTerms) {
        const termTrimmed = term.trim()
        if (termTrimmed) {
          candidates.push({ text: termTrimmed, type: 'rootFamily', familyTerm: termTrimmed })
        }
      }
    }

    // 4) CAS 号
    if (rule.casNumber) {
      candidates.push({ text: rule.casNumber.toLowerCase(), type: 'cas' })
    }

    // 按长度从长到短排序：短语优先
    candidates.sort((a, b) => b.text.length - a.text.length)

    // 依次尝试候选，取第一个（最长）满足词边界的匹配
    for (const candidate of candidates) {
      const match = findWordBoundaryMatch(lowerText, candidate.text)
      if (!match) continue

      seenRuleIds.add(rule.ruleId)

      if (candidate.type === 'rootFamily') {
        violations.push({
          ...rule,
          matchedText: candidate.familyTerm!,
          position: {
            start: match.index,
            end: match.index + match.length,
          },
          sourceField,
          contextSnippet: `成分族匹配: 识别到 ${candidate.familyTerm} 属于 ${rule.rootFamily} 成分族`,
        })
      } else {
        violations.push({
          ...rule,
          matchedText: text.substring(match.index, match.index + match.length),
          position: {
            start: match.index,
            end: match.index + match.length,
          },
          sourceField,
          contextSnippet: generateContextSnippet(text, match.index, match.index + match.length),
        })
      }
      break // 只取最长的一个匹配
    }
  }

  return violations
}

// ── 词根簇跨规则去重 ──
// 同一语义簇（如 cure/treat/heal 都属于"治疗宣称"）的多个 violations 只保留最严重/最长的一个
function deduplicateByGroupId(violations: Violation[]): Violation[] {
  const severityOrder = { critical: 3, warning: 2, info: 1 }
  const groupBest = new Map<string, Violation>()
  const result: Violation[] = []

  for (const v of violations) {
    // 尝试从 keyword 或 matchedText 查找 groupId
    let groupId = getTermGroupId(v.keyword)
    if (!groupId && v.matchedText) {
      groupId = getTermGroupId(v.matchedText)
    }

    if (!groupId) {
      // 不属于任何词根簇的 violation，直接保留
      result.push(v)
      continue
    }

    const existing = groupBest.get(groupId)
    if (!existing) {
      groupBest.set(groupId, v)
    } else {
      const vScore = severityOrder[v.severity] || 0
      const eScore = severityOrder[existing.severity] || 0

      if (vScore > eScore) {
        groupBest.set(groupId, v)
      } else if (vScore === eScore) {
        // 严重程度相同，保留 matchedText 更长的（短语优先）
        const vLen = v.matchedText?.length || 0
        const eLen = existing.matchedText?.length || 0
        if (vLen > eLen) {
          groupBest.set(groupId, v)
        }
      }
    }
  }

  // 将各 group 的最佳 violation 加入结果
  for (const v of groupBest.values()) {
    result.push(v)
  }

  return result
}

// Cache for loaded JSON rules
let jsonRulesCache: {
  BR: LoadedRules[]
  MX: LoadedRules[]
} = {
  BR: [],
  MX: [],
}

let rulesInitialized = false

// Initialize JSON rules (call this at app startup)
export async function initRules(): Promise<void> {
  if (rulesInitialized) return
  
  try {
    const [brRules, mxRules] = await Promise.all([
      loadRegulationRules('BR'),
      loadRegulationRules('MX'),
    ])
    jsonRulesCache = { BR: brRules, MX: mxRules }
    rulesInitialized = true
    console.log('[Engine] JSON rules loaded:', {
      BR: brRules.length,
      MX: mxRules.length,
    })
  } catch (e) {
    console.warn('[Engine] Failed to load JSON rules, using hardcoded rules only')
  }
}

// Synchronous version - uses cached rules if available, otherwise falls back to hardcoded
export function checkCompliance(input: CheckInput): CheckResult {
  const rules = input.country === 'BR' ? ANVISA_RULES : COFEPRIS_RULES
  
  // Auto-initialize JSON rules on first call (async, non-blocking)
  if (!rulesInitialized) {
    initRules().catch(e => console.warn('[Engine] Background init failed:', e))
  }
  
  // Use cached JSON rules if available
  const jsonRules = jsonRulesCache[input.country]
  
  // Merge JSON rules with hardcoded rules (JSON takes precedence for duplicates)
  const allRules = [...rules]
  if (jsonRules && jsonRules.length > 0) {
    for (const jsonRule of jsonRules) {
      const existingIndex = allRules.findIndex(r => r.ruleId === jsonRule.ruleId)
      if (existingIndex >= 0) {
        allRules[existingIndex] = jsonRule
      } else {
        allRules.push(jsonRule)
      }
    }
  }
  
  const violations: Violation[] = []

  // Check ingredients (with sourceField)
  if (input.ingredients) {
    violations.push(...findMatches(input.ingredients, allRules.filter(r => r.category === 'ingredient'), 'ingredients'))
  }

  // Check description/claims (with sourceField)
  if (input.description) {
    violations.push(...findMatches(input.description, allRules.filter(r => r.category === 'claim'), 'description'))
  }
  
  // Also check claims in combined text (product name, description, etc.)
  const combinedText = [input.ingredients || '', input.description || '', input.label || ''].join(' ')
  if (combinedText) {
    violations.push(...findMatches(combinedText, allRules.filter(r => r.category === 'claim'), 'description'))
  }

  // Check label (with sourceField)
  if (input.label) {
    violations.push(...findMatches(input.label, allRules.filter(r => r.category === 'label'), 'label'))
  }

  // ── 全局 ruleId 去重 ──
  // 同一规则在 description + combinedText 等多字段中可能被重复匹配，只保留一条
  const uniqueByRuleId = new Map<string, Violation>()
  for (const v of violations) {
    const existing = uniqueByRuleId.get(v.ruleId)
    if (!existing) {
      uniqueByRuleId.set(v.ruleId, v)
    } else if ((v.matchedText?.length || 0) > (existing.matchedText?.length || 0)) {
      // 保留 matchedText 更长的（短语优先）
      uniqueByRuleId.set(v.ruleId, v)
    }
  }
  violations.length = 0
  violations.push(...uniqueByRuleId.values())

  // ── 词根簇跨规则去重 ──
  // 同一语义簇（如 cure/treat/heal）的多个 violations 只保留最严重/最长的一个
  const deduplicatedViolations = deduplicateByGroupId(violations)
  violations.length = 0
  violations.push(...deduplicatedViolations)

  // ── 时效规则文案动态化 ──
  // 将固定的"7天"等替换为实际匹配到的时间表述
  for (const v of violations) {
    if (v.ruleId.includes('CLAIM-014') || v.ruleId.includes('MX-CLAIM-001')) {
      const timeMatch = v.matchedText?.match(/(\d+)\s*(dias?|days?|天|semanas?|weeks?|周)/i)
      if (timeMatch) {
        const timeStr = timeMatch[0]
        v.message = v.message
          .replace(/X天\/\u5468/, timeStr)
          .replace(/\uff08如'\\d+天'\uff09/, `(如'${timeStr}')`)
      }
    }
  }

  // 只在用户提供了 label 内容时，才检查标签规则缺失
  // 避免用户只检测 ingredients 时收到大量标签缺失警告
  if (input.label) {
    const labelRules = allRules.filter(r => r.category === 'label' && r.ruleType === 'required')
    const existingRuleIds = new Set(violations.map(v => v.ruleId))
    
    // 收集所有缺失的标签项
    const missingLabelItems: string[] = []
    for (const rule of labelRules) {
      if (!existingRuleIds.has(rule.ruleId)) {
        missingLabelItems.push(rule.keyword)
      }
    }

    // 如果有缺失的标签项，聚合为一条
    if (missingLabelItems.length > 0) {
      const countryLabel = input.country === 'BR' ? '巴西' : '墨西哥'
      const aggregatedViolation: Violation = {
        ruleId: `${input.country}-LABEL-AGGREGATED`,
        category: 'label',
        ruleType: 'required',
        keyword: 'Multiple label requirements missing',
        severity: 'warning',
        message: `${countryLabel}标签合规缺失 - 缺少以下必要信息: ${missingLabelItems.join(', ')}`,
        suggestion: '请补全所有必需标签信息后再上市销售',
        source: input.country === 'BR' ? 'ANVISA RDC 169/2024' : 'COFEPRIS NOM-141-SSA1/SCF1-2012',
        matchedText: missingLabelItems.join(', '),
        sourceField: 'label',
        contextSnippet: `缺失项目: ${missingLabelItems.join(', ')}`,
      }
      violations.push(aggregatedViolation)
    }
  }

  const criticalCount = violations.filter(v => v.severity === 'critical').length
  const warningCount = violations.filter(v => v.severity === 'warning').length
  const infoCount = violations.filter(v => v.severity === 'info').length

  return {
    isCompliant: criticalCount === 0,
    violations: violations.filter(v => v.severity === 'critical'),
    warnings: violations.filter(v => v.severity === 'warning'),
    info: violations.filter(v => v.severity === 'info'),
    summary: {
      totalIssues: violations.length,
      criticalCount,
      warningCount,
      infoCount,
    },
    regulationVersion: 1,
  }
}
