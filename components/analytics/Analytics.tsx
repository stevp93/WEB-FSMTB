import Script from 'next/script';
import { CONSENT_KEY, GA_ID, GTM_ID } from '@/lib/analytics';
import { ConsentBanner } from './ConsentBanner';

/**
 * GA4 (gtag.js) y GTM con Consent Mode v2: el estado por defecto (denegado, o la elección guardada) se fija antes
 * de pedir las etiquetas, así GA4 no escribe cookies sin permiso. GA4 va directo y no dentro de GTM: si se añade
 * una etiqueta de Google con el mismo ID en el contenedor, las visitas se contarían dos veces.
 */
const bootstrap = `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}window.gtag=gtag;
var c=null;try{c=localStorage.getItem('${CONSENT_KEY}')}catch(e){}
gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:c==='granted'?'granted':'denied',wait_for_update:500});
gtag('js',new Date());gtag('config','${GA_ID}');
(function(d){var g=d.createElement('script');g.async=true;g.src='https://www.googletagmanager.com/gtag/js?id=${GA_ID}';d.head.appendChild(g);})(document);
(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_ID}');`;

export function Analytics() {
  return (
    <>
      <Script id="gtm" strategy="afterInteractive">
        {bootstrap}
      </Script>
      <ConsentBanner />
    </>
  );
}
