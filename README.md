# 🎨 Générateur de Décoration IA

Plateforme de design d'intérieur propulsée par **Home Designs AI** - La meilleure API de design assisté par intelligence artificielle.

## ✨ Fonctionnalités

- 🏠 **Design d'Intérieur** - Transformez vos pièces avec 24+ styles
- 🏡 **Design d'Extérieur** - Rénovez vos façades avec 16+ styles
- 🌳 **Design de Jardin** - Aménagez vos espaces verts avec 12+ styles
- 🎯 **50+ Styles Disponibles** - Modern, Scandinavian, Industrial, Bohemian, etc.
- ⚡ **Génération Rapide** - Résultats en 30-60 secondes
- 📸 **Qualité HD** - Images professionnelles réalistes
- 🔄 **Multiple Variations** - Générez jusqu'à 2 designs par requête
- 🎨 **4 Niveaux d'Intervention** - De minimal à transformation complète

## 🚀 Démarrage Rapide

### 1. Installation

```bash
npm install
# ou
yarn install
# ou
pnpm install
```

### 2. Configuration (OBLIGATOIRE)

Créez un fichier `.env.local` à la racine:

```bash
# Home Designs AI
HOME_DESIGN_API_TOKEN=votre-token-ici

# Database (MySQL)
DATABASE_URL=mysql://user:password@localhost:3306/database
```

**Obtenir un token Home Designs AI:**
1. Visitez https://homedesigns.ai
2. Créez un compte
3. Accédez au dashboard API
4. Copiez votre token

### 3. Base de Données

```bash
# Générer le client Prisma
npx prisma generate

# Appliquer les migrations
npx prisma migrate deploy

# (Optionnel) Si vous migrez depuis Replicate
npx prisma db execute --file ./prisma/migrations/update_ai_provider.sql
```

### 4. Lancer le Serveur

```bash
npm run dev
```

Le serveur démarre sur [http://localhost:3000](http://localhost:3000)

## 🧪 Tester l'Application

### Page de Test Complète (Recommandé)
Visitez: **http://localhost:3000/test-homedesign**

Cette page vous permet de:
- ✅ Télécharger et prévisualiser des images
- ✅ Sélectionner parmi 50+ styles
- ✅ Choisir le type de design (Interior/Exterior/Garden)
- ✅ Ajuster le niveau d'intervention AI
- ✅ Visualiser et télécharger les résultats

### Test Rapide API

```bash
# PowerShell
.\test-api.ps1

# Ou manuellement
curl http://localhost:3000/api/design-options
```

### Tests Complets
Consultez **`TESTING_GUIDE.md`** pour tous les scénarios de test.

## 📚 Documentation

- **`HOME_DESIGNS_AI.md`** - Guide complet de l'API Home Designs AI
- **`MIGRATION.md`** - Guide de migration Replicate → Home Designs AI
- **`TESTING_GUIDE.md`** - Guide de test détaillé avec tous les scénarios
- **`TODO.md`** - État d'avancement du projet

## 🏗️ Architecture

```
src/
├── app/
│   ├── api/
│   │   ├── generate/              # Génération simple
│   │   ├── generate-design/       # Upload + génération
│   │   ├── process-design/        # Génération avec DB
│   │   └── design-options/        # Options disponibles
│   └── test-homedesign/           # Page de test complète
├── components/
│   └── DesignOptionsSelect.tsx    # Sélecteur d'options
├── libs/
│   └── homedesign.ts              # Service Home Designs AI
└── types/
    └── api.ts                     # Types TypeScript
```

## 🎯 Endpoints API

### `GET /api/design-options`
Récupère toutes les options disponibles (styles, types de pièces, etc.)

### `POST /api/generate`
Génération simple avec paramètres personnalisables

**Body:**
```json
{
  "image": "base64_string",
  "prompt": "description",
  "designStyle": "Modern",
  "roomType": "Living Room",
  "aiIntervention": "Mid",
  "noDesign": 2
}
```

### `POST /api/generate-design`
Upload d'image + génération

**FormData:**
- `file`: Image file
- `prompt`: Description
- `designStyle`: Style choice
- `roomType`: Room type
- `aiIntervention`: AI level
- `noDesign`: Number of designs

### `POST /api/process-design`
Génération avec sauvegarde en base de données

## 🎨 Utilisation du Service

```typescript
import { homeDesignClient } from '@/libs/homedesign';

// Génération d'un design
const result = await homeDesignClient.generateDesign({
  image: base64Image,
  design_type: 'Interior',
  design_style: 'Modern',
  room_type: 'Living Room',
  ai_intervention: 'Mid',
  no_design: 2,
  custom_instruction: 'Add warm lighting',
  keep_structural_element: true
});

if (result.success) {
  console.log('Images:', result.output_images);
}
```

## 🌟 Styles Disponibles

### Intérieur (24 styles)
Modern, Minimalist, Contemporary, Scandinavian, Industrial, Mid-Century Modern, Bohemian, Coastal, Traditional, Transitional, Rustic, Farmhouse, French Country, Art Deco, Victorian, Mediterranean, Japanese, Tropical, Hollywood Glam, Shabby Chic, Eclectic, Urban Modern, Nordic, Zen

### Extérieur (16 styles)
Modern, Contemporary, Traditional, Colonial, Victorian, Craftsman, Mediterranean, Spanish, Ranch, Tudor, Cape Cod, Farmhouse, Mid-Century Modern, Industrial, Rustic, Beach House

### Jardin (12 styles)
Modern, Traditional, Tropical, Mediterranean, Japanese, English, French, Desert, Minimalist, Cottage, Zen, Contemporary

## 🔧 Développement

```bash
# Développement
npm run dev

# Build
npm run build

# Start production
npm start

# Lint
npm run lint

# Prisma Studio
npx prisma studio
```

## 📦 Technologies

- **Framework:** Next.js 15.3.5
- **Language:** TypeScript
- **Database:** MySQL (Prisma ORM)
- **Styling:** Tailwind CSS
- **AI Service:** Home Designs AI
- **Storage:** Vercel Blob
- **State Management:** React Query

## 🚀 Déploiement

### Vercel (Recommandé)

1. Connectez votre repo GitHub
2. Ajoutez les variables d'environnement:
   - `HOME_DESIGN_API_TOKEN`
   - `DATABASE_URL`
3. Déployez!

### Autres plateformes

Consultez la [documentation Next.js](https://nextjs.org/docs/app/building-your-application/deploying)

## 🐛 Dépannage

### Token non configuré
```bash
⚠️ HOME_DESIGN_API_TOKEN not configured
```
→ Ajoutez le token dans `.env.local`

### Erreur de génération
- Vérifiez que l'image est au format JPG/PNG
- Vérifiez que l'image fait au moins 512x512px
- Vérifiez votre connexion internet

### Timeout
- L'image est peut-être trop lourde
- Le serveur est peut-être surchargé
- Réessayez dans quelques minutes

Pour plus d'aide, consultez **`TESTING_GUIDE.md`**

## 📞 Support

- **Documentation API:** https://homedesigns.ai/api/docs
- **Support Home Designs AI:** support@homedesigns.ai
- **Issues:** GitHub Issues

## 📝 License

MIT

## 🎉 Crédits

Propulsé par [Home Designs AI](https://homedesigns.ai) - La meilleure API de design assisté par IA.

---

**Prêt à transformer vos espaces! 🚀**
