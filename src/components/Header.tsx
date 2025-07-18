import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-lg border-b border-primary-100">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-3">
          <img 
            src="https://stackblitz-user-content.s3.us-west-2.amazonaws.com/8w2qi4atmy8i4830jbxfpscniko9?response-content-disposition=inline%3B%20filename%3D%22-image.png%22%3B%20filename%2A%3DUTF-8%27%27-image.png&response-content-type=image%2Fpng&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=ASIATEWXQORMCUF5OJ6R%2F20250718%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20250718T150659Z&X-Amz-Expires=300&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEHUaCXVzLXdlc3QtMiJGMEQCID2FPpgTRQLFOCzPya25upd19nuCTBkJwRgSYNiYaeHyAiA7TLlrVFSHbu%2F6Tb0HGpKyP5BYj%2BbXsfDk04UIRlQ3nyq7BQiO%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAYaDDIxNjI3NDA3MjY2NCIM32YHKZQMRPFvxoOfKo8FpJLwHI0NJeQEN%2Fl60YxDc4fNSMkgyOssKJy9FoNr4HFfyYweidL61sILZ81SImlhRJJF2oFiE48UPNtd2BUY8dVPfPQrAZyE4keGQGKC0f4f3VAuDpzA0f6XPs6zLkO61wslfxcoH2R1SXHJ0VfsPNWENWkM1s99fFgFsxe9zt9rymbUvfm5wA6zdi4DF28bThieN3pZnExgK8mxHgseP%2F5QdUr3zkX3lZWISx9cY9AqKaOTrYN5Ih1ZBTEHLjXjaXmutFHxUPNqS8tIocJ%2BHZ3iZDZ3xKGx%2BjFGcLYvgQeqto7KI%2BwsOup2hnlP2itIx%2FZ8nkHb4M7ogzrIV6R%2BsHvIhG5IDL9AMmEqCLR73g9j%2Bo6LtEvZb%2BuaXHG3ogU6e2k8SoVpPtehiURtbwMA7MPUcdfdEmlsiNSHdc5hF%2BBL9bZRsBBwrFaTtfG%2FUzm%2FxH0WDhSNN1Ipi8dY1Rn59VkyzCiV6M%2Bj0aTVFy6kdFAqO3Tl1ojIbyny2j3KiGvDiPcmqgjNtcB%2Bzelv%2BZaUW%2BahDphEf5vEztorlq7O8CpaSV7PP%2Bf4pm30aSWL9kPzzWaJity0D06mJUvkLHTyuNVLHKpOnVwfa0dYUBCGpZsfeznMsYZUBHSsQZaM0WidIS9eaDzsKt6iTJfO84VfQOI%2F8ZsfCHXLbLiEaEPFevjQT0SUc7KN9fL0ezNTG2SFWbqV9R3uYDHdsmul%2BjBrD3w1OiJlJuHQrp73UXc54laLvH80j0uvdcwZE%2B1oQGDSKwX32DuAgq5Z0d0KdsN8dJoW8XJKotwxSHzl4UWyvLa1gt6NI2BwahEhPg%2FAyObjV9F8oDY25S1vTTg%2BQFDH%2FDJofwyfycvycZ73YK7%2BeDDegOnDBjqyAVDkIOBuKDe6m6tIHA9mpEBqMDVdAVEmjGYxx3wIZ04wUXCTUAqASlWd8PbdsGdLp4Kf78nXK1im4g%2B12htWaHe95RSbSpG%2BcH%2FZOeGYJauYWyVBs10LSf9Fk%2Br61neFji08g%2BGu7%2FxjLfNXII65d5YBPk1CiToZqGbUhKaGlwORusdP8oVnaln%2F0FlvzRKFC5YoKRWfmlaPqcbldY3soCQkJ%2BIaBCqAmngTWsvrH4CFZ00%3D&X-Amz-SignedHeaders=host&X-Amz-Signature=93d9ac9a9c3e88e57980ad99d881a98a45073bc47a2fd9ef74f9ea3cc2578847" 
            alt="5 Degrés Logo" 
            className="h-12 w-auto"
          />
          <div>
            <h1 className="text-xl font-bold text-secondary-900">Présence Bureau</h1>
            <p className="text-sm text-primary-600">Réservez votre place à l'agence</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;