import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-lg border-b border-primary-100">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-3">
          <img 
            src="https://stackblitz-user-content.s3.us-west-2.amazonaws.com/h93ks9f75a6srzgaf3sjgjjz0xw7?response-content-disposition=inline%3B%20filename%3D%22-image%201.png%22%3B%20filename%2A%3DUTF-8%27%27-image%25201.png&response-content-type=image%2Fpng&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=ASIATEWXQORMCNZ5BCEC%2F20250718%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20250718T150834Z&X-Amz-Expires=300&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEHUaCXVzLXdlc3QtMiJGMEQCIFjc7HUJZHDnvzXJ2qp5%2BLtbh6yM2dybRzQt7x1m4MZsAiBC12mEctH%2F3mVmmdB9BHZzB3F7oVlknrEJPlBNvDONwSq7BQiO%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAYaDDIxNjI3NDA3MjY2NCIMxLwHPY6QWH4JajSVKo8FuZZGPAD2edro8S7kidfb6993vgYvgvf9RD0X1rDT8A12sNs4qm1H%2BLAbcwQztrlHY6u5LdF%2FaHP6IgIeZDU6xTJLVrFEccdJ9ErHtRmQdMLdkKCwgoVokGL%2B%2FTB22%2Ffey0V2o5h65oYVfxs1LN10ZsxGfj5CPJ646oRK%2FrjpIawSJAiJjYtUjNbWgRjuSCtmd5sqiucwQCI%2FdKtJTdfllTdRC1%2BI%2BZPIXdSS4MIF3fmfdgeOXIHMNZmOL23FML1QOiT9T5kAppPDVJpg%2F6YEaS%2Byr1r1rR%2FA4i%2ByWRi7V7T7lJ9eD4CXTviWBPEgbC7mYj4azwVBAgiu%2FDdbhEU2NmzT777ACxZDwef6f8LjsC1aqxMp5LCZfKi84vHC769O2LfFf%2B4GQGivSF6MhtFedos2QbUcS7rvbmeMzhS4%2Bgne2AeNKY8wpBYF21EtgMgTgspeyN6ykmVbudPbSOzqDhhnVSN6aOMfVQ%2Fdzpqum2onJJWjiEi7YsQpvtWcBGHb2ZO6H69rZJTOcgpwhcJFbnwRFQgegmpR0cnII2blzQjt2Kw7gEV1cYvWD8gcAc4sT4bnA4ej5gAIEPI6OyAs%2FKdz3ItLXtGsE5xqyGWaGnusNc8GwTFvKLFsJzjNhYIY3Tixg%2FKAF77e0EwdGj3fm%2B93zg7gz0lxu9yxdvqZ0jlTDjpx1wWiXaqQnZjoTzoK0UiHAkhOYlKYF3FWNQiH56x5mRPzth9ijd8QrsOWom5v%2BNXG%2BEJfc2CViHMCOoHlimgENf0GTwNxQ%2BBODDAkt0CWWCl%2BLrFb7MiYRGhjn%2BVeEqTT481delfQmub8ZX6QUmkS0KGaJegvcoKHGI%2FS%2F6lnSpmvGmseQJNnAcB0yDDEienDBjqyASoN%2FCUmTvjEQ2VeX%2FPsbteHbekTFWEKlDUZc22%2BNWuiHrus02TRZyALcpt7XQ8ARtZv%2Bh%2FjzM0Zniow1rYWDf5fzea1dfwAE5yNnW7jlG460PCtNCzRFLNtPqopVWSJsUTuAX6RViDe2%2FW9VRAw27GlqzOjuOYa8LClZu7W39I4we45Udyu%2BtOJ2jR9IGIWWyuoZtKQBJJR6dCKG6FECDgLWqC34nwfuWi1g3bqGJHiCLQ%3D&X-Amz-SignedHeaders=host&X-Amz-Signature=e55358299ba210190cb96240ef0adbddc85a754a1a01bf97a06d99a6782dce02" 
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