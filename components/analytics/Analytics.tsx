import Script from 'next/script';
import { CONSENT_KEY, GTM_ID } from '@/lib/analytics';
import { ConsentBanner } from './ConsentBanner';

/**
 * GTM con Consent Mode v2: el estado por defecto (denegado, o la elección guardada) se fija antes de pedir el
 * contenedor, así GA4 no escribe cookies sin permiso. Se carga después de hidratar para no competir con el LCP.
 */
const bootstrap = `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}window.gtag=gtag;
var c=null;try{c=localStorage.getItem('${CONSENT_KEY}')}catch(e){}
gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:c==='granted'?'granted':'denied',wait_for_update:500});
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
