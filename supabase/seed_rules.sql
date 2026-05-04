-- Regulation Rules Seed Data
-- Generated from src/lib/engine.ts
-- Run this after creating the regulations table

INSERT INTO public.regulations (country, category, rule_type, keyword, severity, suggestion, version, is_active) VALUES
    ('BR', 'ingredient', 'prohibited', 'mercury', 'critical', 'Remove mercury compounds from the formula.', 1, TRUE),
    ('BR', 'ingredient', 'prohibited', 'lead', 'critical', 'Remove lead and its compounds from the formula.', 1, TRUE),
    ('BR', 'ingredient', 'prohibited', 'hydroquinone', 'critical', 'Remove hydroquinone or reformulate as a pharmaceutical product.', 1, TRUE),
    ('BR', 'ingredient', 'prohibited', 'corticosteroid', 'critical', 'Remove corticosteroids - product must be registered as medicine.', 1, TRUE),
    ('BR', 'ingredient', 'prohibited', 'formaldehyde', 'critical', 'Ensure formaldehyde concentration is below 0.2% or remove entirely.', 1, TRUE),
    ('BR', 'ingredient', 'restricted', 'paraben', 'warning', 'Verify total paraben concentration does not exceed 0.4% for single / 0.8% for mixtures.', 1, TRUE),
    ('BR', 'ingredient', 'restricted', 'retinol', 'warning', 'Ensure retinol concentration does not exceed regulatory limits.', 1, TRUE),
    ('BR', 'claim', 'prohibited', 'medicinal', 'critical', 'Remove terms like "treats", "cures", "medicinal" from product claims.', 1, TRUE),
    ('BR', 'claim', 'prohibited', 'cure', 'critical', 'Use cosmetic claims only (moisturizing, cleansing, beautifying).', 1, TRUE),
    ('BR', 'claim', 'prohibited', '100% natural', 'warning', 'Remove absolute claims unless certified. Use "contains natural ingredients" instead.', 1, TRUE),
    ('BR', 'label', 'required', 'manufacturer', 'warning', 'Add manufacturer name, CNPJ, and complete address to the label.', 1, TRUE),
    ('BR', 'label', 'required', 'ingredient list', 'warning', 'Include full ingredient list in INCI standard format.', 1, TRUE),
    ('BR', 'label', 'required', 'ANVISA registration', 'info', 'Obtain ANVISA registration before commercialization.', 1, TRUE),
    ('MX', 'ingredient', 'prohibited', 'mercury', 'critical', 'Remove mercury compounds from the formula.', 1, TRUE),
    ('MX', 'ingredient', 'prohibited', 'lead', 'critical', 'Remove lead and its compounds.', 1, TRUE),
    ('MX', 'ingredient', 'prohibited', 'hydroquinone', 'critical', 'Remove hydroquinone or register as pharmaceutical product.', 1, TRUE),
    ('MX', 'ingredient', 'prohibited', 'corticosteroid', 'critical', 'Remove corticosteroids - product must be registered as medicine.', 1, TRUE),
    ('MX', 'ingredient', 'prohibited', 'formaldehyde', 'critical', 'Ensure formaldehyde is not used as an ingredient.', 1, TRUE),
    ('MX', 'ingredient', 'restricted', 'paraben', 'warning', 'Verify paraben concentrations comply with NOM limits.', 1, TRUE),
    ('MX', 'ingredient', 'restricted', 'retinol', 'warning', 'Ensure retinol concentration is within allowed limits.', 1, TRUE),
    ('MX', 'claim', 'prohibited', 'medicinal', 'critical', 'Remove therapeutic claims. Use cosmetic claims only.', 1, TRUE),
    ('MX', 'claim', 'prohibited', 'cure', 'critical', 'Remove disease-related claims.', 1, TRUE),
    ('MX', 'label', 'required', 'manufacturer', 'warning', 'Add manufacturer name and address in Spanish.', 1, TRUE),
    ('MX', 'label', 'required', 'ingredient list', 'warning', 'Include full ingredient list in INCI standard format.', 1, TRUE),
    ('MX', 'label', 'required', 'COFEPRIS registration', 'info', 'Obtain COFEPRIS registration before commercialization.', 1, TRUE);