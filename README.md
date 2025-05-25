# InzerujTo.cz - Platforma pro inzeráty

Webová inzertní platforma inspirována Bazoš.cz.

## Technologie

- [Next.js](https://nextjs.org/) - React framework
- [MongoDB](https://www.mongodb.com/) - NoSQL databáze
- [NextAuth.js](https://next-auth.js.org/) - Autentizace
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework

## Požadavky

- [Node.js](https://nodejs.org/) (v20+)
- [MongoDB](https://www.mongodb.com/)

## Lokální spuštění

1. Klonovat repozitář:
```bash
git clone <url-repozitáře>
cd classifieds-platform
```

2. Instalovat závislosti:
```bash
npm install
```

3. Vytvořit soubor `.env.local` s obsahem:
```
MONGODB_URI=mongodb://localhost:27017/classifieds
NEXTAUTH_SECRET=libovolný-tajný-klíč
NEXTAUTH_URL=http://localhost:3000
```

4. Spustit vývojový server:
```bash
npm run dev
```

Aplikace běží na [http://localhost:3000](http://localhost:3000)

Pro produkci:
```bash
npm run build
npm start
```

## Funkce

- Registrace a přihlášení uživatelů
- Správa inzerátů včetně nahrávání obrázků
- Filtrování inzerátů dle kategorií
- Oblíbené inzeráty
- Admin rozhraní
