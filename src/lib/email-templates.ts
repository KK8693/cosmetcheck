// src/lib/email-templates.ts
// Email templates for M1b: Onboarding, Abandoned Checkout, Quota Warning
// Supports pt-BR, es-MX, en

import type { EmailLocale } from './email'

// ---------------------------------------------------------------------------
// Brand constants
// ---------------------------------------------------------------------------
const BRAND_COLOR = '#0A4D8C'
const ACCENT_COLOR = '#00A86B'
const LOGO_URL = 'https://cosmetcheck.com/logo.png'
const APP_URL = 'https://cosmetcheck.com'

// ---------------------------------------------------------------------------
// Layout wrapper
// ---------------------------------------------------------------------------
function wrapHtml(title: string, content: string, locale: EmailLocale): string {
  const footer = {
    'pt-BR': `CosmetCheck &mdash; Seu parceiro de compliance cosmético.<br><a href="${APP_URL}">${APP_URL}</a>`,
    'es-MX': `CosmetCheck &mdash; Tu aliado en compliance de belleza.<br><a href="${APP_URL}">${APP_URL}</a>`,
    'en': `CosmetCheck &mdash; Your cosmetics compliance partner.<br><a href="${APP_URL}">${APP_URL}</a>`,
  }

  return `<!DOCTYPE html>
<html lang="${locale}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title}</title>
<style>
body{margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;background:#f4f4f5;color:#18181b;line-height:1.6;}
.container{max-width:600px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 6px -1px rgba(0,0,0,0.1);}
.header{background:${BRAND_COLOR};padding:32px 24px;text-align:center;}
.header h1{color:#ffffff;margin:0;font-size:24px;font-weight:700;}
.header p{color:rgba(255,255,255,0.85);margin:8px 0 0;font-size:14px;}
.body{padding:32px 24px;}
.body h2{color:${BRAND_COLOR};font-size:20px;margin:0 0 16px;}
.body p{margin:0 0 16px;font-size:15px;color:#3f3f46;}
.cta{display:inline-block;background:${ACCENT_COLOR};color:#ffffff;padding:14px 28px;border-radius:8px;text-decoration:none;font-weight:600;font-size:15px;margin:8px 0;}
.cta-secondary{display:inline-block;background:#ffffff;color:${BRAND_COLOR};padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;font-size:15px;border:2px solid ${BRAND_COLOR};margin:8px 0;}
.divider{height:1px;background:#e4e4e7;margin:24px 0;}
.footer{padding:24px;text-align:center;font-size:13px;color:#71717a;background:#fafafa;}
.footer a{color:${BRAND_COLOR};text-decoration:none;}
.badge{display:inline-block;background:#fef3c7;color:#92400e;padding:4px 10px;border-radius:999px;font-size:12px;font-weight:600;margin-bottom:12px;}
.step{display:flex;align-items:flex-start;margin-bottom:20px;}
.step-num{flex-shrink:0;width:28px;height:28px;background:${BRAND_COLOR};color:#fff;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:13px;margin-right:12px;margin-top:2px;}
.step-content h3{margin:0 0 4px;font-size:15px;color:#18181b;}
.step-content p{margin:0;font-size:14px;color:#52525b;}
</style>
</head>
<body>
<div class="container">
  <div class="header">
    <h1>CosmetCheck</h1>
    <p>${locale === 'pt-BR' ? 'Compliance de cosméticos simplificado' : locale === 'es-MX' ? 'Compliance de belleza simplificado' : 'Simplified cosmetics compliance'}</p>
  </div>
  <div class="body">
    ${content}
  </div>
  <div class="divider"></div>
  <div class="footer">
    ${footer[locale]}
  </div>
</div>
</body>
</html>`
}

// ---------------------------------------------------------------------------
// 1. Onboarding Welcome Flow
// ---------------------------------------------------------------------------

export interface OnboardingEmailData {
  email: string
  locale: EmailLocale
  userName?: string
}

export function getOnboardingEmail(data: OnboardingEmailData & { step: 1 | 2 | 3 }) {
  const { locale, step, userName } = data
  const name = userName || (locale === 'pt-BR' ? 'Olá' : locale === 'es-MX' ? 'Hola' : 'Hi there')

  const templates = {
    'pt-BR': {
      1: {
        subject: 'Bem-vindo! Seu primeiro passo para compliance no Brasil 🇧🇷',
        content: `
          <h2>${name}, bem-vindo à CosmetCheck! 🎉</h2>
          <p>Você acabou de dar o primeiro passo para vender cosméticos no Brasil e no México sem se preocupar com rejeições da ANVISA ou COFEPRIS.</p>
          <div style="text-align:center;margin:24px 0;">
            <a href="${APP_URL}" class="cta">Fazer minha primeira análise</a>
          </div>
          <p style="font-size:13px;color:#71717a;">Dica: Comece com um produto que você já vende. Nosso sistema verifica ingredientes proibidos, rotulagem obrigatória e muito mais em segundos.</p>
        `,
      },
      2: {
        subject: 'Como fazer sua primeira análise em 3 minutos',
        content: `
          <h2>${name}, pronto para sua primeira análise?</h2>
          <p>É mais simples do que você imagina. Siga estes 3 passos:</p>
          <div class="step"><div class="step-num">1</div><div class="step-content"><h3>Cole os ingredientes do seu produto</h3><p>Copie da embalagem ou do fornecedor e cole no campo de análise.</p></div></div>
          <div class="step"><div class="step-num">2</div><div class="step-content"><h3>Escolha o país (Brasil ou México)</h3><p>Nosso sistema carrega automaticamente as regras da ANVISA ou COFEPRIS.</p></div></div>
          <div class="step"><div class="step-num">3</div><div class="step-content"><h3>Receba o relatório completo</h3><p>Veja violações, alertas e sugestões de correção em segundos.</p></div></div>
          <div style="text-align:center;margin:24px 0;">
            <a href="${APP_URL}" class="cta">Começar agora</a>
          </div>
        `,
      },
      3: {
        subject: 'Veja como a Maria vende 3x mais com CosmetCheck',
        content: `
          <h2>${name}, quer ver um exemplo real?</h2>
          <p>A Maria vendia cosméticos importados no Mercado Livre e tinha 40% dos produtos reprovados na ANVISA. Depois que começou a usar a CosmetCheck:</p>
          <ul style="padding-left:20px;margin:16px 0;">
            <li style="margin-bottom:8px;">📉 <strong>Rejeições caíram de 40% para 2%</strong></li>
            <li style="margin-bottom:8px;">⚡ <strong>Tempo de listagem diminuiu de 3 dias para 10 minutos</strong></li>
            <li style="margin-bottom:8px;">📈 <strong>Faturamento triplicou em 6 meses</strong></li>
          </ul>
          <p>O segredo? Ela verifica <strong>todos</strong> os produtos antes de colocar à venda.</p>
          <div style="text-align:center;margin:24px 0;">
            <a href="${APP_URL}/pricing" class="cta">Quero resultados assim</a>
          </div>
          <p style="font-size:13px;color:#71717a;">Você tem <strong>10 análises grátis</strong> por mês. Aproveite!</p>
        `,
      },
    },
    'es-MX': {
      1: {
        subject: '¡Bienvenido! Tu primer paso para cumplir en México 🇲🇽',
        content: `
          <h2>¡${name}, bienvenido a CosmetCheck! 🎉</h2>
          <p>Acabas de dar el primer paso para vender cosméticos en Brasil y México sin preocuparte por rechazos de COFEPRIS o ANVISA.</p>
          <div style="text-align:center;margin:24px 0;">
            <a href="${APP_URL}" class="cta">Hacer mi primer análisis</a>
          </div>
          <p style="font-size:13px;color:#71717a;">Consejo: Empieza con un producto que ya vendes. Nuestro sistema verifica ingredientes prohibidos, etiquetado obligatorio y más en segundos.</p>
        `,
      },
      2: {
        subject: 'Cómo hacer tu primer análisis en 3 minutos',
        content: `
          <h2>${name}, ¿listo para tu primer análisis?</h2>
          <p>Es más simple de lo que imaginas. Sigue estos 3 pasos:</p>
          <div class="step"><div class="step-num">1</div><div class="step-content"><h3>Pega los ingredientes de tu producto</h3><p>Copia del empaque o del proveedor y pégalo en el campo de análisis.</p></div></div>
          <div class="step"><div class="step-num">2</div><div class="step-content"><h3>Elige el país (Brasil o México)</h3><p>Nuestro sistema carga automáticamente las reglas de COFEPRIS o ANVISA.</p></div></div>
          <div class="step"><div class="step-num">3</div><div class="step-content"><h3>Recibe el reporte completo</h3><p>Ve violaciones, alertas y sugerencias de corrección en segundos.</p></div></div>
          <div style="text-align:center;margin:24px 0;">
            <a href="${APP_URL}" class="cta">Empezar ahora</a>
          </div>
        `,
      },
      3: {
        subject: 'Mira cómo María vende 3x más con CosmetCheck',
        content: `
          <h2>${name}, ¿quieres ver un ejemplo real?</h2>
          <p>María vendía cosméticos importados en Mercado Libre y tenía 40% de productos rechazados por COFEPRIS. Después de usar CosmetCheck:</p>
          <ul style="padding-left:20px;margin:16px 0;">
            <li style="margin-bottom:8px;">📉 <strong>Rechazos bajaron de 40% a 2%</strong></li>
            <li style="margin-bottom:8px;">⚡ <strong>Tiempo de listado disminuyó de 3 días a 10 minutos</strong></li>
            <li style="margin-bottom:8px;">📈 <strong>Facturación se triplicó en 6 meses</strong></li>
          </ul>
          <p>¿El secreto? Ella verifica <strong>todos</strong> los productos antes de ponerlos a la venta.</p>
          <div style="text-align:center;margin:24px 0;">
            <a href="${APP_URL}/pricing" class="cta">Quiero resultados así</a>
          </div>
          <p style="font-size:13px;color:#71717a;">Tienes <strong>10 análisis gratis</strong> al mes. ¡Aprovéchalos!</p>
        `,
      },
    },
    'en': {
      1: {
        subject: 'Welcome! Your first step to cosmetics compliance 🌍',
        content: `
          <h2>${name}, welcome to CosmetCheck! 🎉</h2>
          <p>You've just taken the first step to selling cosmetics in Brazil and Mexico without worrying about ANVISA or COFEPRIS rejections.</p>
          <div style="text-align:center;margin:24px 0;">
            <a href="${APP_URL}" class="cta">Run my first analysis</a>
          </div>
          <p style="font-size:13px;color:#71717a;">Tip: Start with a product you already sell. Our system checks prohibited ingredients, mandatory labeling, and more in seconds.</p>
        `,
      },
      2: {
        subject: 'How to run your first analysis in 3 minutes',
        content: `
          <h2>${name}, ready for your first analysis?</h2>
          <p>It's simpler than you think. Follow these 3 steps:</p>
          <div class="step"><div class="step-num">1</div><div class="step-content"><h3>Paste your product ingredients</h3><p>Copy from the packaging or supplier and paste into the analysis field.</p></div></div>
          <div class="step"><div class="step-num">2</div><div class="step-content"><h3>Choose the country (Brazil or Mexico)</h3><p>Our system automatically loads ANVISA or COFEPRIS rules.</p></div></div>
          <div class="step"><div class="step-num">3</div><div class="step-content"><h3>Get the full report</h3><p>See violations, warnings, and correction suggestions in seconds.</p></div></div>
          <div style="text-align:center;margin:24px 0;">
            <a href="${APP_URL}" class="cta">Start now</a>
          </div>
        `,
      },
      3: {
        subject: 'See how Maria sells 3x more with CosmetCheck',
        content: `
          <h2>${name}, want to see a real example?</h2>
          <p>Maria sold imported cosmetics on Mercado Libre and had 40% of products rejected by ANVISA. After using CosmetCheck:</p>
          <ul style="padding-left:20px;margin:16px 0;">
            <li style="margin-bottom:8px;">📉 <strong>Rejections dropped from 40% to 2%</strong></li>
            <li style="margin-bottom:8px;">⚡ <strong>Listing time decreased from 3 days to 10 minutes</strong></li>
            <li style="margin-bottom:8px;">📈 <strong>Revenue tripled in 6 months</strong></li>
          </ul>
          <p>The secret? She checks <strong>all</strong> products before listing them.</p>
          <div style="text-align:center;margin:24px 0;">
            <a href="${APP_URL}/pricing" class="cta">I want results like this</a>
          </div>
          <p style="font-size:13px;color:#71717a;">You have <strong>10 free analyses</strong> per month. Make the most of them!</p>
        `,
      },
    },
  }

  const tmpl = templates[locale][step]
  return {
    subject: tmpl.subject,
    html: wrapHtml(tmpl.subject, tmpl.content, locale),
  }
}

// ---------------------------------------------------------------------------
// 2. Abandoned Checkout Flow
// ---------------------------------------------------------------------------

export interface AbandonedCheckoutData {
  email: string
  locale: EmailLocale
  plan: 'monthly' | 'yearly'
  discount?: number
}

export function getAbandonedCheckoutEmail(data: AbandonedCheckoutData & { step: 1 | 2 | 3 }) {
  const { locale, step, plan, discount = 20 } = data

  const planLabel = {
    'pt-BR': { monthly: 'Plano Mensal', yearly: 'Plano Anual' },
    'es-MX': { monthly: 'Plan Mensual', yearly: 'Plan Anual' },
    'en': { monthly: 'Monthly Plan', yearly: 'Yearly Plan' },
  }

  const templates = {
    'pt-BR': {
      1: {
        subject: 'Esqueceu algo? Sua análise está esperando',
        content: `
          <h2>Você estava a um passo de desbloquear análises ilimitadas</h2>
          <p>Notamos que você começou a assinar o <strong>${planLabel['pt-BR'][plan]}</strong> da CosmetCheck, mas não finalizou.</p>
          <p>Sem problemas! Você pode continuar de onde parou:</p>
          <div style="text-align:center;margin:24px 0;">
            <a href="${APP_URL}/pricing" class="cta">Continuar minha assinatura</a>
          </div>
          <p style="font-size:13px;color:#71717a;">Ainda tem dúvidas? Responda este e-mail ou fale conosco pelo chat do site.</p>
        `,
      },
      2: {
        subject: `${discount}% OFF nos primeiros 3 meses — por tempo limitado`,
        content: `
          <div class="badge">OFERTA EXCLUSIVA</div>
          <h2>Ainda está em dúvida? Temos uma oferta especial para você</h2>
          <p>Use o código <strong style="color:${ACCENT_COLOR};font-size:18px;">COMEBACK${discount}</strong> e ganhe <strong>${discount}% de desconto</strong> nos primeiros 3 meses do ${planLabel['pt-BR'][plan]}.</p>
          <p style="background:#f0fdf4;padding:16px;border-radius:8px;margin:16px 0;">💡 Com o Pro, você faz análises ilimitadas, exporta relatórios em PDF e tem acesso prioritário a novos recursos.</p>
          <div style="text-align:center;margin:24px 0;">
            <a href="${APP_URL}/pricing?coupon=COMEBACK${discount}" class="cta">Aplicar ${discount}% OFF</a>
          </div>
          <p style="font-size:13px;color:#71717a;">Esta oferta expira em 48 horas. Não perca!</p>
        `,
      },
      3: {
        subject: 'Última chance: seu desconto expira em 6h',
        content: `
        <div class="badge" style="background:#fee2e2;color:#991b1b;">⏰ EXPIRA EM 6 HORAS</div>
        <h2>Esta é sua última chance</h2>
        <p>Seu cupom de <strong>${discount}% OFF</strong> no ${planLabel['pt-BR'][plan]} expira em poucas horas.</p>
          <p>Depois disso, o preço volta ao normal.</p>
          <div style="text-align:center;margin:24px 0;">
            <a href="${APP_URL}/pricing?coupon=COMEBACK${discount}&urgency=1" class="cta">Ativar desconto agora</a>
          </div>
          <div style="text-align:center;margin:12px 0;">
            <a href="${APP_URL}/pricing" class="cta-secondary">Não quero o desconto</a>
          </div>
        `,
      },
    },
    'es-MX': {
      1: {
        subject: '¿Olvidaste algo? Tu análisis te espera',
        content: `
          <h2>Estabas a un paso de desbloquear análisis ilimitadas</h2>
          <p>Notamos que comenzaste a suscribirte al <strong>${planLabel['es-MX'][plan]}</strong> de CosmetCheck, pero no finalizaste.</p>
          <p>¡No hay problema! Puedes continuar donde lo dejaste:</p>
          <div style="text-align:center;margin:24px 0;">
            <a href="${APP_URL}/pricing" class="cta">Continuar mi suscripción</a>
          </div>
          <p style="font-size:13px;color:#71717a;">¿Aún tienes dudas? Responde este correo o habla con nosotros por el chat del sitio.</p>
        `,
      },
      2: {
        subject: `${discount}% OFF en los primeros 3 meses — por tiempo limitado`,
        content: `
          <div class="badge">OFERTA EXCLUSIVA</div>
          <h2>¿Aún tienes dudas? Tenemos una oferta especial para ti</h2>
          <p>Usa el código <strong style="color:${ACCENT_COLOR};font-size:18px;">COMEBACK${discount}</strong> y obtén <strong>${discount}% de descuento</strong> en los primeros 3 meses del ${planLabel['es-MX'][plan]}.</p>
          <p style="background:#f0fdf4;padding:16px;border-radius:8px;margin:16px 0;">💡 Con Pro, haces análisis ilimitadas, exportas reportes en PDF y tienes acceso prioritario a nuevas funciones.</p>
          <div style="text-align:center;margin:24px 0;">
            <a href="${APP_URL}/pricing?coupon=COMEBACK${discount}" class="cta">Aplicar ${discount}% OFF</a>
          </div>
          <p style="font-size:13px;color:#71717a;">Esta oferta expira en 48 horas. ¡No la pierdas!</p>
        `,
      },
      3: {
        subject: 'Última chance: tu descuento expira en 6h',
        content: `
          <div class="badge" style="background:#fee2e2;color:#991b1b;">⏰ EXPIRA EN 6 HORAS</div>
          <h2>Esta es tu última oportunidad</h2>
          <p>Tu cupón de <strong>${discount}% OFF</strong> en el ${planLabel['es-MX'][plan]} expira en pocas horas.</p>
          <p>Después de eso, el precio vuelve a la normalidad.</p>
          <div style="text-align:center;margin:24px 0;">
            <a href="${APP_URL}/pricing?coupon=COMEBACK${discount}&urgency=1" class="cta">Activar descuento ahora</a>
          </div>
          <div style="text-align:center;margin:12px 0;">
            <a href="${APP_URL}/pricing" class="cta-secondary">No quiero el descuento</a>
          </div>
        `,
      },
    },
    'en': {
      1: {
        subject: 'Forget something? Your analysis is waiting',
        content: `
          <h2>You were one step away from unlocking unlimited analyses</h2>
          <p>We noticed you started subscribing to the <strong>${planLabel['en'][plan]}</strong> but didn't finish.</p>
          <p>No problem! You can continue where you left off:</p>
          <div style="text-align:center;margin:24px 0;">
            <a href="${APP_URL}/pricing" class="cta">Continue my subscription</a>
          </div>
          <p style="font-size:13px;color:#71717a;">Still have questions? Reply to this email or chat with us on the site.</p>
        `,
      },
      2: {
        subject: `${discount}% OFF for the first 3 months — limited time`,
        content: `
          <div class="badge">EXCLUSIVE OFFER</div>
          <h2>Still unsure? We have a special offer for you</h2>
          <p>Use code <strong style="color:${ACCENT_COLOR};font-size:18px;">COMEBACK${discount}</strong> and get <strong>${discount}% off</strong> your first 3 months of the ${planLabel['en'][plan]}.</p>
          <p style="background:#f0fdf4;padding:16px;border-radius:8px;margin:16px 0;">💡 With Pro, you get unlimited analyses, PDF report exports, and priority access to new features.</p>
          <div style="text-align:center;margin:24px 0;">
            <a href="${APP_URL}/pricing?coupon=COMEBACK${discount}" class="cta">Apply ${discount}% OFF</a>
          </div>
          <p style="font-size:13px;color:#71717a;">This offer expires in 48 hours. Don't miss out!</p>
        `,
      },
      3: {
        subject: 'Last chance: your discount expires in 6h',
        content: `
          <div class="badge" style="background:#fee2e2;color:#991b1b;">⏰ EXPIRES IN 6 HOURS</div>
          <h2>This is your last chance</h2>
          <p>Your <strong>${discount}% OFF</strong> coupon for the ${planLabel['en'][plan]} expires in a few hours.</p>
          <p>After that, the price goes back to normal.</p>
          <div style="text-align:center;margin:24px 0;">
            <a href="${APP_URL}/pricing?coupon=COMEBACK${discount}&urgency=1" class="cta">Activate discount now</a>
          </div>
          <div style="text-align:center;margin:12px 0;">
            <a href="${APP_URL}/pricing" class="cta-secondary">No thanks</a>
          </div>
        `,
      },
    },
  }

  const tmpl = templates[locale][step]
  return {
    subject: tmpl.subject,
    html: wrapHtml(tmpl.subject, tmpl.content, locale),
  }
}

// ---------------------------------------------------------------------------
// 3. Quota Warning
// ---------------------------------------------------------------------------

export interface QuotaWarningData {
  email: string
  locale: EmailLocale
  used: number
  limit: number
  percent: 80 | 100
}

export function getQuotaWarningEmail(data: QuotaWarningData) {
  const { locale, used, limit, percent } = data
  const isFull = percent === 100

  const templates = {
    'pt-BR': {
      subject: isFull
        ? 'Análises esgotadas — continue sem parar'
        : 'Você usou 80% das suas análises grátis',
      content: isFull
        ? `
          <h2>Suas análises grátis acabaram 😔</h2>
          <p>Você já usou <strong>${used} de ${limit}</strong> análises grátis este mês.</p>
          <p>Mas não precisa parar! Com o <strong>CosmetCheck Pro</strong>, você tem:</p>
          <ul style="padding-left:20px;margin:16px 0;">
            <li style="margin-bottom:8px;">✅ Análises ilimitadas</li>
            <li style="margin-bottom:8px;">✅ Exportação de relatórios em PDF</li>
            <li style="margin-bottom:8px;">✅ Acesso prioritário a novos recursos</li>
          </ul>
          <div style="text-align:center;margin:24px 0;">
            <a href="${APP_URL}/pricing" class="cta">Fazer upgrade para Pro</a>
          </div>
        `
        : `
          <h2>Você usou ${percent}% das suas análises grátis</h2>
          <p>Faltam apenas <strong>${limit - used} análises</strong> grátis este mês.</p>
          <p style="background:#fef3c7;padding:16px;border-radius:8px;margin:16px 0;">⚠️ Dica: Quando as análises acabarem, você precisa esperar o próximo ciclo ou fazer upgrade.</p>
          <div style="text-align:center;margin:24px 0;">
            <a href="${APP_URL}/pricing" class="cta">Ver planos Pro</a>
          </div>
        `,
    },
    'es-MX': {
      subject: isFull
        ? 'Análisis agotados — continúa sin parar'
        : 'Has usado el 80% de tus análisis gratis',
      content: isFull
        ? `
          <h2>Tus análisis gratis se acabaron 😔</h2>
          <p>Ya usaste <strong>${used} de ${limit}</strong> análisis gratis este mes.</p>
          <p>¡Pero no necesitas parar! Con <strong>CosmetCheck Pro</strong> tienes:</p>
          <ul style="padding-left:20px;margin:16px 0;">
            <li style="margin-bottom:8px;">✅ Análisis ilimitadas</li>
            <li style="margin-bottom:8px;">✅ Exportación de reportes en PDF</li>
            <li style="margin-bottom:8px;">✅ Acceso prioritario a nuevas funciones</li>
          </ul>
          <div style="text-align:center;margin:24px 0;">
            <a href="${APP_URL}/pricing" class="cta">Hacer upgrade a Pro</a>
          </div>
        `
        : `
          <h2>Has usado el ${percent}% de tus análisis gratis</h2>
          <p>Solo te quedan <strong>${limit - used} análisis</strong> gratis este mes.</p>
          <p style="background:#fef3c7;padding:16px;border-radius:8px;margin:16px 0;">⚠️ Consejo: Cuando se acaben los análisis, tendrás que esperar al siguiente ciclo o hacer upgrade.</p>
          <div style="text-align:center;margin:24px 0;">
            <a href="${APP_URL}/pricing" class="cta">Ver planes Pro</a>
          </div>
        `,
    },
    'en': {
      subject: isFull
        ? 'Analyses exhausted — keep going without stopping'
        : 'You have used 80% of your free analyses',
      content: isFull
        ? `
          <h2>Your free analyses are used up 😔</h2>
          <p>You've used <strong>${used} of ${limit}</strong> free analyses this month.</p>
          <p>But you don't have to stop! With <strong>CosmetCheck Pro</strong>, you get:</p>
          <ul style="padding-left:20px;margin:16px 0;">
            <li style="margin-bottom:8px;">✅ Unlimited analyses</li>
            <li style="margin-bottom:8px;">✅ PDF report exports</li>
            <li style="margin-bottom:8px;">✅ Priority access to new features</li>
          </ul>
          <div style="text-align:center;margin:24px 0;">
            <a href="${APP_URL}/pricing" class="cta">Upgrade to Pro</a>
          </div>
        `
        : `
          <h2>You've used ${percent}% of your free analyses</h2>
          <p>You only have <strong>${limit - used} analyses</strong> left this month.</p>
          <p style="background:#fef3c7;padding:16px;border-radius:8px;margin:16px 0;">⚠️ Tip: When analyses run out, you'll need to wait for the next cycle or upgrade.</p>
          <div style="text-align:center;margin:24px 0;">
            <a href="${APP_URL}/pricing" class="cta">View Pro Plans</a>
          </div>
        `,
    },
  }

  const tmpl = templates[locale]
  return {
    subject: tmpl.subject,
    html: wrapHtml(tmpl.subject, tmpl.content, locale),
  }
}

// ---------------------------------------------------------------------------
// 4. Lead Magnet Download (PDF)
// ---------------------------------------------------------------------------

export interface LeadMagnetData {
  email: string
  locale: EmailLocale
  userName?: string
  pdfUrl: string
  magnetType: 'checklist-compliance-anvisa-2025'
}

export function getLeadMagnetEmail(data: LeadMagnetData) {
  const { locale, userName, pdfUrl, magnetType } = data
  const name = userName || (locale === 'pt-BR' ? 'Olá' : locale === 'es-MX' ? 'Hola' : 'Hi there')

  const templates = {
    'pt-BR': {
      subject: 'Seu PDF gratuito chegou! Checklist Compliance ANVISA 2025 📋',
      content: `
        <h2>${name}, aqui está o seu checklist! 📋</h2>
        <p>Obrigado por baixar nosso <strong>Checklist Completo de Compliance ANVISA 2025</strong>.</p>
        <p>Este PDF de 6 páginas contém:</p>
        <ul style="padding-left:20px;margin:16px 0;">
          <li style="margin-bottom:8px;">✅ Lista de substâncias proibidas e restritas</li>
          <li style="margin-bottom:8px;">✅ Checklist de documentação obrigatória</li>
          <li style="margin-bottom:8px;">✅ Template de email para fornecedores</li>
          <li style="margin-bottom:8px;">✅ Checklist de rótulo em português</li>
          <li style="margin-bottom:8px;">✅ Fluxograma: Notificação vs Registro</li>
        </ul>
        <div style="text-align:center;margin:24px 0;">
          <a href="${pdfUrl}" class="cta" target="_blank">📥 Baixar PDF</a>
        </div>
        <p style="font-size:13px;color:#71717a;">Dica: Imprima o checklist e deixe na mesa do seu escritório. Ele vai salvar seu negócio de um prejuízo enorme.</p>
        <div class="divider"></div>
        <h3>Próximo passo: teste seus produtos</h3>
        <p>Agora que você tem o checklist, que tal verificar se seus produtos estão em compliance?</p>
        <div style="text-align:center;margin:24px 0;">
          <a href="${APP_URL}" class="cta-secondary">Analisar meu produto (grátis)</a>
        </div>
      `,
    },
    'es-MX': {
      subject: '¡Tu PDF gratuito llegó! Checklist Compliance ANVISA 2025 📋',
      content: `
        <h2>${name}, ¡aquí está tu checklist! 📋</h2>
        <p>Gracias por descargar nuestro <strong>Checklist Completo de Compliance ANVISA 2025</strong>.</p>
        <p>Este PDF de 6 páginas contiene:</p>
        <ul style="padding-left:20px;margin:16px 0;">
          <li style="margin-bottom:8px;">✅ Lista de sustancias prohibidas y restringidas</li>
          <li style="margin-bottom:8px;">✅ Checklist de documentación obligatoria</li>
          <li style="margin-bottom:8px;">✅ Template de email para proveedores</li>
          <li style="margin-bottom:8px;">✅ Checklist de etiqueta en portugués</li>
          <li style="margin-bottom:8px;">✅ Flujograma: Notificación vs Registro</li>
        </ul>
        <div style="text-align:center;margin:24px 0;">
          <a href="${pdfUrl}" class="cta" target="_blank">📥 Descargar PDF</a>
        </div>
        <p style="font-size:13px;color:#71717a;">Consejo: Imprime el checklist y déjalo en tu escritorio. Te salvará de un gran perjuicio.</p>
        <div class="divider"></div>
        <h3>Próximo paso: prueba tus productos</h3>
        <p>Ahora que tienes el checklist, ¿qué tal verificar si tus productos están en compliance?</p>
        <div style="text-align:center;margin:24px 0;">
          <a href="${APP_URL}" class="cta-secondary">Analizar mi producto (gratis)</a>
        </div>
      `,
    },
    'en': {
      subject: 'Your free PDF is here! ANVISA Compliance Checklist 2025 📋',
      content: `
        <h2>${name}, here's your checklist! 📋</h2>
        <p>Thanks for downloading our <strong>ANVISA Compliance Checklist 2025</strong>.</p>
        <p>This 6-page PDF contains:</p>
        <ul style="padding-left:20px;margin:16px 0;">
          <li style="margin-bottom:8px;">✅ List of prohibited and restricted substances</li>
          <li style="margin-bottom:8px;">✅ Mandatory documentation checklist</li>
          <li style="margin-bottom:8px;">✅ Supplier email template</li>
          <li style="margin-bottom:8px;">✅ Portuguese label checklist</li>
          <li style="margin-bottom:8px;">✅ Flowchart: Notification vs Registration</li>
        </ul>
        <div style="text-align:center;margin:24px 0;">
          <a href="${pdfUrl}" class="cta" target="_blank">📥 Download PDF</a>
        </div>
        <p style="font-size:13px;color:#71717a;">Tip: Print the checklist and keep it on your desk. It will save your business from huge losses.</p>
        <div class="divider"></div>
        <h3>Next step: test your products</h3>
        <p>Now that you have the checklist, why not check if your products are compliant?</p>
        <div style="text-align:center;margin:24px 0;">
          <a href="${APP_URL}" class="cta-secondary">Analyze my product (free)</a>
        </div>
      `,
    },
  }

  const tmpl = templates[locale]
  return {
    subject: tmpl.subject,
    html: wrapHtml(tmpl.subject, tmpl.content, locale),
  }
}
